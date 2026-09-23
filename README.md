# landing-hosting

A Nuxt 3 + Vue 3 multi-domain app for landing pages, public product pages, JSON-driven surveys, and service marketing pages. Domains are Nuxt layers under `domains/`, with Tailwind UI and static generation served behind Caddy on this VPS. Personal finance lives in the sibling [`personal-finance`](../personal-finance) app.

- **Live site:** https://kazansky.dev
- **Repository:** https://github.com/slnnzmtl/landing-hosting

## Tech Stack

- **Framework:** Nuxt 3 (multi-layer via `extends`)
- **Frontend:** Vue 3 + TypeScript
- **Styling:** Tailwind CSS (+ forms plugin)
- **Charting:** Chart.js (service demos)
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint (+ lint-staged + Husky)
- **Deploy:** Docker (nginx serving `.output/public`) behind Caddy at `127.0.0.1:8082`

## Domains

| Domain | Routes | Purpose |
|--------|--------|---------|
| **Root** | `/` | Portfolio / landing homepage |
| **projects** | `/products`, `/products/:slug` | Public selected products (data-driven; layer folder stays `domains/projects`) |
| **cases** | `/work/:slug` | Directus-backed project case studies (`case_enabled`) |
| **survey** | `/survey`, `/survey/:slug` | JSON-driven surveys with webhook submit |
| **service** | `/service/:page` | Service landing pages |

Each domain lives under `domains/<name>/` as a Nuxt layer. Page routes are prefixed with `utils/prefix-domain-pages.ts` so `domains/service/pages/foo.vue` becomes `/service/foo`. Finance was moved to the sibling `personal-finance` repository.

## Features

- Multi-domain Nuxt layer architecture
- Public `/products` catalog and product landings (first product: Simple Rekordbox Converter)
- Static generation (`nuxt generate`) with explicit prerender routes
- JSON-configurable surveys (one file per survey under `domains/survey/data/`)
- Webhook-based survey submission (JSON POST, update support via `submissionId`)
- Reusable UI primitives (`components/ui/*`)
- Legacy `/finance` and `/login` URLs return 404 (finance is a separate app)

## Project Structure

```text
.
├─ components/ui/                 # Shared UI primitives
├─ composables/                   # Root composables (usePortfolio, …)
├─ data/                          # Homepage/experience view types + helpers
├─ domains/
│  ├─ projects/
│  │  ├─ pages/                   # index, [slug] → /products/*
│  │  ├─ data/                    # Project types + projectPath
│  │  └─ components/              # Gallery + GitHub releases
│  ├─ cases/
│  │  ├─ pages/                   # [slug] → /work/*
│  │  ├─ data/                    # CaseStudy types + casePath
│  │  └─ components/              # Hero, sections, claims
│  ├─ survey/
│  │  ├─ pages/                   # index, [slug] → /survey/*
│  │  ├─ data/*.json              # Survey definitions
│  │  ├─ composables/             # useSurveys, useSurveyResponses
│  │  └─ survey-routes.ts
│  └─ service/
│     ├─ pages/                   # Landing pages → /service/*
│     └─ service-routes.ts
├─ utils/cms/                     # Directus build reader (client, fields, map, load)
├─ utils/seo.ts                   # Site-wide SEO, sitemap, robots
├─ pages/index.vue                # Homepage
├─ utils/prefix-domain-pages.ts   # Domain path prefixing
├─ tests/                         # Vitest suites
├─ nuxt.config.ts
└─ nginx.conf                     # Static routing + cache headers
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended; `packageManager` is pinned in `package.json`)

### Environment

Copy `.env.example` to `.env` in the project root (gitignored):

```bash
cp .env.example .env
```

```bash
SURVEY_WEBHOOK_URL=https://example.com/webhook/survey/submit
NUXT_PUBLIC_SITE_URL=https://kazansky.dev
DIRECTUS_URL=https://cms.kazansky.dev
DIRECTUS_TOKEN=
```

`SURVEY_WEBHOOK_URL` maps to `runtimeConfig.public.surveyWebhookUrl` and is the live survey POST target; JSON `action` fields in survey files are inert placeholders only.

`NUXT_PUBLIC_SITE_URL` (or `SITE_URL`) is the production origin used for canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt`. If unset, it defaults to `https://kazansky.dev`. Set production to `https://kazansky.dev` (apex). `www.kazansky.dev` and `daniel.kazansky.dev` redirect to the apex via Caddy; do not use `www` as the canonical host.

`DIRECTUS_URL` and `DIRECTUS_TOKEN` are **server-only** (never `NUXT_PUBLIC_*`). Use a Directus **static token** (Settings → Access Tokens) for a build-reader role with read access to published `site_settings`, `homepage_settings`, `experience_page_settings`, `experience_entries`, `projects`, `products`, `approved_claims`, and `files` (plus the `homepage_settings_*` junction collections) — not a session JWT (those expire and return `INVALID_CREDENTIALS`). Put the token in the host `.env` (gitignored); Docker Compose passes it as a BuildKit secret so it is not baked into image layers. A missing token or failed published-content fetch **fails `nuxt generate`**; the currently deployed container stays up until a successful rebuild. `pnpm install` / `nuxt prepare` do not call Directus. Directus is the only authoring source for homepage, experience, and product copy — do not dual-author in TypeScript. CMS edits appear only after the next successful generate (see rebuild below).

`homepage_settings` must include chrome strings `proof_heading`, `featured_work_heading`, and `flagship_label` (in addition to composition fields). Grant the build-reader role read access to those fields.

Verify the live Directus contract (published singletons, M2M links resolve, `mapPortfolio` succeeds):

```bash
pnpm cms:verify
```

Personal finance env vars (`SUPABASE_*`, `ALLOWED_EMAILS`) belong in the sibling `personal-finance` app, not here.

### Install & run

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000` by default.

## Available Scripts

- `pnpm dev` — Start dev server
- `pnpm build` / `pnpm generate` — Static generate (`nuxt generate`); requires `DIRECTUS_TOKEN`
- `pnpm preview` — Preview production build
- `pnpm cms:verify` — Live Directus contract check (published shape + mapPortfolio; not a TypeScript golden dump)
- `pnpm test` — Vitest watch mode
- `pnpm test:run` — Run tests once
- `pnpm test:ui` — Vitest UI
- `pnpm lint` / `pnpm lint:fix` — ESLint

## Products catalog (`domains/projects`)

Nuxt can drop a layer page when another layer already owns the same route name (`index` vs root, `[slug]` vs survey). The projects layer re-registers `/products` and `/products/:slug` in `pages:extend` (folder name stays `projects`; public URLs are `/products`).

### Add another selected product

1. Create a published `products` row in Directus (slug, copy, links, optional gallery/media, optional `github` repo for the releases feed).
2. Add the product to `homepage_settings.product_spotlights` (M2M) if it should appear on the homepage.
3. Upload walkthrough media to Directus Files and set each file’s `title` to the public path used in guide JSON (for example `/projects/<slug>/shot.webp`). Dev and generate write those files into `public/` (gitignored except `u.js`). Media paths stay under `/projects/<slug>/` even though catalog pages live at `/products`.
4. Ensure `site_settings.menu` Products href and `products_page_settings.detail_back_href` point at `/products` (not `/projects`).
5. `nuxt generate` discovers published product slugs from Directus for prerender, sitemap, and JSON-LD. No new page file is required.

First product: **Simple Rekordbox Converter** at `/products/rekordbox-playlist-converter`. Evergreen copy lives in Directus. GitHub release versions and download URLs are fetched in the browser from `https://api.github.com/repos/slnnzmtl/rekordbox-playlist-converter/releases` (no token, 1-hour localStorage cache, stale cache if GitHub is down).

## Case studies (`domains/cases`)

Published Directus `projects` with `case_enabled=true` generate `/work/:slug` at build time. There is no `/work` index — the homepage Selected Work section is the entry point. Case copy, sections, media, and approved claims come from Directus; Nuxt maps section `kind` values to Vue components and never renders CMS HTML.

### Add another case study

1. Publish a `projects` row with `case_enabled=true`, non-empty `case_lead`, and at least one published `project_sections` row.
2. Attach media with alt text; set file `title` to the public path when materializing into `public/`.
3. Optionally link approved claims via `case_claims`.
4. `nuxt generate` discovers the slug via `fetchCaseSlugs`. No new Vue page file is required.

## Survey Module

Surveys are JSON files in `domains/survey/data/`. Each file is eagerly loaded by `useSurveys`.

### Supported question types

- `text`, `email`, `textarea`, `radio`
- `section` — non-input heading/description block

### Minimal survey example

```json
{
  "slug": "customer-satisfaction",
  "title": "Customer Satisfaction Survey",
  "description": "Help us improve.",
  "action": "https://example.com/webhook/survey/submit",
  "questions": [
    { "type": "section", "title": "About you" },
    { "id": "name", "label": "Name", "type": "text", "required": true },
    { "id": "email", "label": "Email", "type": "email", "required": true },
    {
      "id": "satisfaction",
      "label": "How satisfied are you?",
      "type": "radio",
      "required": true,
      "options": [
        { "label": "Very Satisfied", "value": "very-satisfied" },
        { "label": "Neutral", "value": "neutral" },
        { "label": "Dissatisfied", "value": "dissatisfied" }
      ]
    },
    { "id": "comments", "label": "Comments", "type": "textarea" }
  ]
}
```

### Submission

- Keep JSON `action` as an inert example (`https://example.com/...`). Do not commit live webhook URLs.
- Set `SURVEY_WEBHOOK_URL` in `.env` to the real JSON `POST` endpoint.
- Payload shape: `{ slug, questions: [{ question, answer }], submissionId?, isUpdate? }`.
- Responses are also stored in `localStorage` (draft + submitted state) via `useSurveyResponses`.
- New surveys under `data/` are picked up automatically; add a `slug` so prerender includes `/survey/<slug>`.

## Build & Deployment

Configured for Nuxt static generation. Prerender uses an explicit route list (`crawlLinks: false`) from:

- `/`, `/experience`, `/survey`, `/products`, `/sitemap.xml`, `/robots.txt`, plus `getSurveyRoutes()`, `getServiceRoutes()`, CMS product slugs (`fetchProductSlugs`), and case-enabled project slugs (`fetchCaseSlugs` → `/work/:slug`) from Directus at generate time

Local preview:

```bash
pnpm build
pnpm preview
```

### Production (Docker + Caddy)

Production serves `.output/public` from the `landing-hosting` container on `127.0.0.1:8082`. Caddy in [`01-reverse-proxy`](../../01-reverse-proxy/Caddyfile) terminates TLS for `kazansky.dev` and reverse-proxies to that port. `www.kazansky.dev` and `daniel.kazansky.dev` 301 to the apex; `slnnzmtl.xyz` already redirects to `kazansky.dev`. Umami script is first-party (`/u.js`); collect is `POST /u/api/send` proxied to `gateway.umami.is` so ad blockers are less likely to drop events.

`nginx.conf` routing: known files (including prerendered `/products/*` and media under `/projects/*`) from the filesystem; unknown `/products/*` and `/projects/*` page paths → `404.html`; legacy `/finance` and `/login` → 404; `/service/**` → `/200.html` SPA fallback; other unmatched paths → `404.html`.

1. Copy env and set a Directus **static** build-reader token:

   ```bash
   cp .env.example .env
   # Edit .env: DIRECTUS_TOKEN=... (required)
   # Optional: SURVEY_WEBHOOK_URL, UMAMI_WEBSITE_ID, DIRECTUS_URL
   ```

2. Build and start (frees port 8082 from the legacy `kazansky-dev` stack first if needed):

   ```bash
   # If the old Vite site still owns 8082:
   #   cd ../kazansky-dev && docker compose down
   ./rebuild.sh
   # or: set -a && source .env && set +a && docker compose up -d --build
   ```

3. Reload Caddy after Caddyfile changes:

   ```bash
   cd ../../01-reverse-proxy && docker compose up -d --force-recreate
   ```

4. Smoke-check:

   ```bash
   curl -sI http://127.0.0.1:8082/
   curl -sI https://kazansky.dev/
   curl -sI https://kazansky.dev/experience
   curl -sI https://kazansky.dev/products/rekordbox-playlist-converter
   curl -sI https://kazansky.dev/finance   # expect 404
   ```

Deploy finance separately via `personal-finance`.

### Refresh CMS content without a git push

Because the site is fully static, published Directus changes do not appear on kazansky.dev until another `nuxt generate` runs (image rebuild). `rebuild.sh` passes a unique `CMS_CACHEBUST` build arg so Docker does not reuse a cached generate when only Directus content changed. Typical delay is the generate + Docker build time (a few minutes). After the rebuild finishes, hard-refresh the page if a tab still shows the previous payload.

1. Ensure host `.env` still has a valid **static** `DIRECTUS_TOKEN` (and `DIRECTUS_URL` if not using the default). Generate fails closed if the token is missing or Directus returns `INVALID_CREDENTIALS`.
2. Manual: run `./rebuild.sh` on this VPS.
3. **Redeploy hook** (for Directus Flows): `POST https://kazansky.dev/hooks/redeploy` with header `Authorization: Bearer <REDEPLOY_HOOK_SECRET>`. Caddy only accepts this from `13.140.158.49` (Directus); other source IPs get `403`. Returns `202` immediately and runs `rebuild.sh` in the background. Overlapping calls coalesce into at most one follow-up rebuild.

#### Enable the hook

```bash
# In .env (gitignored):
REDEPLOY_HOOK_SECRET=$(openssl rand -hex 32)

sudo cp hooks/landing-redeploy-hook.service /etc/systemd/system/
# Unit must allow writes to /root/.docker (docker compose/buildx); otherwise rebuild exits 1.
sudo systemctl daemon-reload
sudo systemctl enable --now landing-redeploy-hook
# Reload Caddy after Caddyfile changes so POST /hooks/redeploy proxies to :8083
cd ../../01-reverse-proxy && docker compose up -d --force-recreate
```

Smoke (from this VPS, localhost health only — public POST is allowlisted to `13.140.158.49`):

```bash
# Public hook from this host is 403 (not the Directus IP):
curl -sS -o /dev/null -w '%{http_code}\n' -X POST https://kazansky.dev/hooks/redeploy \
  -H "Authorization: Bearer $REDEPLOY_HOOK_SECRET"
# Local hook (does not go through Caddy):
curl -sS -X POST http://127.0.0.1:8083/hooks/redeploy \
  -H "Authorization: Bearer $REDEPLOY_HOOK_SECRET"
# Health is localhost-only:
curl -sS http://127.0.0.1:8083/health \
  -H "Authorization: Bearer $REDEPLOY_HOOK_SECRET"
```

#### Directus Flow

1. Settings → Flows → new flow with an **Event Hook** on `items.create` / `items.update` / `items.delete` for `site_settings`, `homepage_settings`, `experience_page_settings`, `experience_entries`, `projects`, `products`, `approved_claims` (and `files.upload` / `files.update` when replacing media under `/projects/...`).
2. Action → **Webhook / Request URL**: `POST https://kazansky.dev/hooks/redeploy`
3. Headers: `Authorization: Bearer <REDEPLOY_HOOK_SECRET>` (treat as a secret). Empty body is fine.
4. Prefer firing when `status` is `published`, or when status leaves published (unpublish/delete must rebuild too).

Smoke-check: change a published homepage field → hook → wait for rebuild → hard-refresh `/`.

The portfolio homepage, `/experience`, and `/products` are indexable (`index, follow`) with canonical URLs, Open Graph tags, and JSON-LD (Person, WebSite, CreativeWork / SoftwareApplication). Survey and service routes remain `noindex`.

Homepage: https://kazansky.dev

## Quality & Tooling

- **ESLint** + **lint-staged** (pre-commit fix on staged `*.{js,ts,vue}`)
- **Husky** Git hooks
- **Vitest** — see [TESTING.md](./TESTING.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run checks:
   ```bash
   pnpm lint
   pnpm test:run
   ```
4. Open a pull request

## License

No license file is currently defined in this repository. If this project is intended for public reuse, consider adding a license (e.g., MIT).
