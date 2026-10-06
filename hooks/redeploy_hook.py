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
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from logging.handlers import RotatingFileHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"
REBUILD_SCRIPT = ROOT / "rebuild.sh"
LOG_DIR = ROOT / "logs"
HOOK_LOG = LOG_DIR / "redeploy-hook.log"
REBUILD_LOG = LOG_DIR / "redeploy-rebuild.log"
MAX_REBUILD_LOG_BYTES = 10 * 1024 * 1024
LOCK = threading.Lock()
STATE = {"running": False, "pending": False}

log = logging.getLogger("redeploy-hook")


def setup_logging() -> None:
    log.setLevel(logging.INFO)
    log.handlers.clear()
    log.propagate = False
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    stream = logging.StreamHandler()
    stream.setFormatter(formatter)
    log.addHandler(stream)
    try:
        LOG_DIR.mkdir(mode=0o750, exist_ok=True)
        file_handler = RotatingFileHandler(
            HOOK_LOG,
            maxBytes=5_000_000,
            backupCount=3,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        log.addHandler(file_handler)
        os.chmod(HOOK_LOG, 0o640)
    except OSError:
        log.warning("File logging disabled — cannot write %s", HOOK_LOG)


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


def forwarded_client_ip(handler: BaseHTTPRequestHandler) -> str:
    for header in ("X-Forwarded-For", "X-Real-IP"):
        raw = handler.headers.get(header, "")
        if raw:
            return raw.split(",", 1)[0].strip()
    return handler.address_string()


def request_path(handler: BaseHTTPRequestHandler) -> str:
    return handler.path.split("?", 1)[0]


def rotate_rebuild_log() -> None:
    if not REBUILD_LOG.is_file():
        return
    if REBUILD_LOG.stat().st_size < MAX_REBUILD_LOG_BYTES:
        return
    backup = REBUILD_LOG.with_name("redeploy-rebuild.log.1")
    backup.unlink(missing_ok=True)
    REBUILD_LOG.replace(backup)


def run_rebuild_worker() -> None:
    while True:
        with LOCK:
            STATE["pending"] = False
        started = time.monotonic()
        stamp = datetime.now(timezone.utc).isoformat()
        log.info("Starting rebuild.sh rebuild_log=%s", REBUILD_LOG)
        env = os.environ.copy()
        env["SKIP_GIT_PULL"] = "1"
        try:
            LOG_DIR.mkdir(mode=0o750, exist_ok=True)
            rotate_rebuild_log()
            with REBUILD_LOG.open("a", encoding="utf-8") as logf:
                os.chmod(REBUILD_LOG, 0o640)
                logf.write(f"\n===== rebuild start {stamp} =====\n")
                logf.flush()
                completed = subprocess.run(
                    [str(REBUILD_SCRIPT)],
                    cwd=str(ROOT),
                    check=False,
                    env=env,
                    stdout=logf,
                    stderr=subprocess.STDOUT,
                )
                duration = time.monotonic() - started
                logf.write(
                    f"===== rebuild end exit={completed.returncode} "
                    f"duration={duration:.1f}s =====\n"
                )
            duration = time.monotonic() - started
            if completed.returncode == 0:
                log.info("Rebuild succeeded duration=%.1fs", duration)
            else:
                log.error(
                    "Rebuild failed exit=%s duration=%.1fs see %s",
                    completed.returncode,
                    duration,
                    REBUILD_LOG,
                )
        except Exception:
            log.exception("Rebuild raised duration=%.1fs", time.monotonic() - started)
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
        return

    def log_error(self, fmt: str, *args) -> None:
        log.error("%s - %s", forwarded_client_ip(self), fmt % args)

    def _log_request(self, status: int, outcome: str) -> None:
        level = logging.WARNING if status >= 400 else logging.INFO
        log.log(
            level,
            "request method=%s path=%s status=%s outcome=%s peer=%s client=%s",
            self.command,
            request_path(self),
            status,
            outcome,
            self.address_string(),
            forwarded_client_ip(self),
        )

    def _json(self, status: int, body: dict, outcome: str) -> None:
        self._log_request(status, outcome)
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        path = request_path(self)
        if path not in ("/health", "/hooks/redeploy/health"):
            self._json(404, {"error": "not_found"}, "not_found")
            return
        if not authorized(self):
            self._json(401, {"error": "unauthorized"}, "unauthorized")
            return
        with LOCK:
            body = {
                "ok": True,
                "running": STATE["running"],
                "pending": STATE["pending"],
            }
        self._json(200, body, "health")

    def do_POST(self) -> None:  # noqa: N802
        path = request_path(self)
        if path not in ("/hooks/redeploy", "/redeploy"):
            self._json(404, {"error": "not_found"}, "not_found")
            return

        if not authorized(self):
            self._json(401, {"error": "unauthorized"}, "unauthorized")
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > 0:
            self.rfile.read(min(length, 1_048_576))

        status = schedule_rebuild()
        self._json(202, {"status": status}, status)


def main() -> None:
    setup_logging()
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
    log.info("Listening on http://%s:%s hook_log=%s rebuild_log=%s", host, port, HOOK_LOG, REBUILD_LOG)
    server.serve_forever()


if __name__ == "__main__":
    main()
