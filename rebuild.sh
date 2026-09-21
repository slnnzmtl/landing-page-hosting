#!/bin/bash
set -euo pipefail

cd /root/containers/02-private/landing-page-hosting || {
    echo "Failed to change to project directory"
    exit 1
}

if [ ! -f .env ]; then
    echo "Missing .env — copy .env.example and set DIRECTUS_TOKEN (and other vars)."
    exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

if [ -z "${DIRECTUS_TOKEN:-}" ]; then
    echo "DIRECTUS_TOKEN must be set in .env for the image build."
    exit 1
fi

if [ "${SKIP_GIT_PULL:-}" = "1" ]; then
    echo "Skipping git pull (SKIP_GIT_PULL=1)."
else
    echo "Pulling latest changes from git..."
    git pull --ff-only
fi

echo "Rebuilding landing-hosting..."
CMS_CACHEBUST="$(date -u +%Y%m%d%H%M%S)"
export CMS_CACHEBUST
echo "CMS_CACHEBUST=${CMS_CACHEBUST} (force nuxt generate)"
docker compose up -d --build --force-recreate

echo "landing-hosting rebuild completed successfully."
