#!/usr/bin/env python3
"""Localhost redeploy hook for landing-hosting.

POST /hooks/redeploy  (also accepts /redeploy)
Authorization: Bearer <REDEPLOY_HOOK_SECRET>

Returns 202 immediately and runs ./rebuild.sh in the background.
Overlapping requests coalesce: at most one rebuild runs; a request during
a rebuild schedules one follow-up rebuild after it finishes.

CMS-triggered rebuilds skip git pull (SKIP_GIT_PULL=1).
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import secrets
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"
REBUILD_SCRIPT = ROOT / "rebuild.sh"
LOCK = threading.Lock()
STATE = {"running": False, "pending": False}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("redeploy-hook")


def load_env() -> dict[str, str]:
    values: dict[str, str] = {}
    if not ENV_FILE.is_file():
        return values
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip("'").strip('"')
    return values


def constant_time_equals(a: str, b: str) -> bool:
    """Compare secrets without leaking length via compare_digest ValueError."""
    digest_a = hashlib.sha256(a.encode("utf-8")).digest()
    digest_b = hashlib.sha256(b.encode("utf-8")).digest()
    return secrets.compare_digest(digest_a, digest_b)


def extract_bearer(handler: BaseHTTPRequestHandler) -> str:
    auth = handler.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return (
        handler.headers.get("X-Redeploy-Token", "")
        or handler.headers.get("X-Deploy-Hook-Token", "")
    ).strip()


def authorized(handler: BaseHTTPRequestHandler) -> bool:
    env = load_env()
    expected = env.get("REDEPLOY_HOOK_SECRET", "")
    provided = extract_bearer(handler)
    return bool(expected) and constant_time_equals(provided, expected)


def run_rebuild_worker() -> None:
    while True:
        with LOCK:
            STATE["pending"] = False
        log.info("Starting rebuild.sh")
        env = os.environ.copy()
        env["SKIP_GIT_PULL"] = "1"
        try:
            completed = subprocess.run(
                [str(REBUILD_SCRIPT)],
                cwd=str(ROOT),
                check=False,
                env=env,
            )
            if completed.returncode == 0:
                log.info("Rebuild succeeded")
            else:
                log.error("Rebuild failed (exit %s)", completed.returncode)
        except Exception:
            log.exception("Rebuild raised")
        with LOCK:
            if STATE["pending"]:
                log.info("Pending redeploy request — running again")
                continue
            STATE["running"] = False
            return


def schedule_rebuild() -> str:
    with LOCK:
        if STATE["running"]:
            STATE["pending"] = True
            return "queued"
        STATE["running"] = True
        thread = threading.Thread(target=run_rebuild_worker, daemon=False)
        thread.start()
        return "accepted"


class Handler(BaseHTTPRequestHandler):
    server_version = "landing-redeploy/1.0"

    def log_message(self, fmt: str, *args) -> None:
        log.info("%s - %s", self.address_string(), fmt % args)

    def _json(self, status: int, body: dict) -> None:
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        path = self.path.split("?", 1)[0]
        if path not in ("/health", "/hooks/redeploy/health"):
            self._json(404, {"error": "not_found"})
            return
        if not authorized(self):
            self._json(401, {"error": "unauthorized"})
            return
        with LOCK:
            body = {
                "ok": True,
                "running": STATE["running"],
                "pending": STATE["pending"],
            }
        self._json(200, body)

    def do_POST(self) -> None:  # noqa: N802
        path = self.path.split("?", 1)[0]
        if path not in ("/hooks/redeploy", "/redeploy"):
            self._json(404, {"error": "not_found"})
            return

        if not authorized(self):
            self._json(401, {"error": "unauthorized"})
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > 0:
            self.rfile.read(min(length, 1_048_576))

        status = schedule_rebuild()
        self._json(202, {"status": status})


def main() -> None:
    env = load_env()
    if not env.get("REDEPLOY_HOOK_SECRET"):
        raise SystemExit(
            "REDEPLOY_HOOK_SECRET missing in .env — refuse to start without auth"
        )
    if not REBUILD_SCRIPT.is_file():
        raise SystemExit(f"Missing rebuild script: {REBUILD_SCRIPT}")

    host = os.environ.get("REDEPLOY_HOOK_HOST", "127.0.0.1")
    port = int(os.environ.get("REDEPLOY_HOOK_PORT", "8083"))
    server = ThreadingHTTPServer((host, port), Handler)
    log.info("Listening on http://%s:%s", host, port)
    server.serve_forever()


if __name__ == "__main__":
    main()
