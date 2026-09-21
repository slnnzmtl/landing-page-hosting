# landing-hosting

A Nuxt 3 + Vue 3 multi-domain app for landing pages, public product pages, JSON-driven surveys, and service marketing pages. Domains are Nuxt layers under `domains/`, with Tailwind UI, Zod validation, and static generation for Vercel. Personal finance lives in the sibling [`personal-finance`](../personal-finance) app.

- **Live site:** https://kazansky.dev
- **Repository:** https://github.com/slnnzmtl/landing-hosting

## Tech Stack

- **Framework:** Nuxt 3 (multi-layer via `extends`)
- **Frontend:** Vue 3 + TypeScript
- **Styling:** Tailwind CSS (+ forms plugin)
- **Validation:** Zod
- **Charting:** Chart.js (service demos)
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint (+ lint-staged + Husky)
- **Deploy:** Vercel static build (`.output/public`)

## Domains

| Domain | Routes | Purpose |
|--------|--------|---------|
| **Root** | `/` | Portfolio / landing homepage |
| **projects** | `/projects`, `/projects/:slug` | Public selected products (data-driven) |
| **survey** | `/survey`, `/survey/:slug` | JSON-driven surveys with webhook submit |
| **service** | `/service/:page` | Service landing pages |

Each domain lives under `domains/<name>/` as a Nuxt layer. Page routes are prefixed with `utils/prefix-domain-pages.ts` so `domains/service/pages/foo.vue` becomes `/service/foo`. Finance was moved to the sibling `personal-finance` repository.

## Features

- Multi-domain Nuxt layer architecture
- Public `/projects` catalog and product landings (first product: Simple Rekordbox Converter)
- Static generation (`nuxt generate`) with explicit prerender routes
- JSON-configurable surveys (one file per survey under `domains/survey/data/`)
- Webhook-based survey submission (JSON POST, update support via `submissionId`)
- Reusable UI primitives (`components/ui/*`)
- Legacy `/finance` and `/login` URLs return 404 (finance is a separate app)

## Project Structure

```text
.
├─ components/ui/                 # Shared UI primitives
├─ composables/                   # Root composables (usePortfolio, useForm, …)
├─ data/                          # Homepage/experience view types + helpers
├─ domains/
│  ├─ projects/
│  │  ├─ pages/                   # index, [slug] → /projects/*
│  │  ├─ data/                    # Project types + findProject helpers
│  │  └─ components/              # Gallery + GitHub releases
│  ├─ survey/
│  │  ├─ pages/                   # index, [slug] → /survey/*
│  │  ├─ data/*.json              # Survey definitions
│  │  ├─ composables/             # useSurveys, useSurveyResponses
│  │  └─ survey-routes.ts
│  └─ service/
│     ├─ pages/                   # Landing pages → /service/*
│     └─ service-routes.ts
├─ utils/cms/                     # Directus build reader (client, fields, map, load)
├─ pages/index.vue                # Homepage
├─ utils/prefix-domain-pages.ts   # Domain path prefixing
├─ tests/                         # Vitest suites
├─ nuxt.config.ts
└─ vercel.json                    # Static build + SPA fallback
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended; `packageManager` is pinned in `package.json`)

### Environment

Copy or create `.env` in the project root (gitignored):

```bash
SURVEY_WEBHOOK_URL=https://example.com/webhook/survey/submit
NUXT_PUBLIC_SITE_URL=https://kazansky.dev
DIRECTUS_URL=https://cms.kazansky.dev
DIRECTUS_TOKEN=
```

`SURVEY_WEBHOOK_URL` maps to `runtimeConfig.public.surveyWebhookUrl` and is the live survey POST target; JSON `action` fields in survey files are inert placeholders only.

`NUXT_PUBLIC_SITE_URL` (or `SITE_URL`) is the production origin used for canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt`. Do not set this to a Vercel preview hostname. If unset, it defaults to `https://kazansky.dev`. Set this on Vercel production to `https://kazansky.dev` (apex). `www.kazansky.dev` and `daniel.kazansky.dev` should redirect to the apex; do not use `www` as the canonical host.

`DIRECTUS_URL` and `DIRECTUS_TOKEN` are **server-only** (never `NUXT_PUBLIC_*`). The static build (`nuxt generate`) loads published portfolio content from Directus at build time. A missing token or failed published-content fetch **fails the new build**; the currently deployed site stays up. Directus is the canonical source for homepage, experience, and product copy after cutover — do not dual-author in TypeScript.

Verify CMS inventory and public copy against the golden seed:

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
- `pnpm cms:verify` — Diff published Directus content against the golden seed fixture
- `pnpm test` — Vitest watch mode
- `pnpm test:run` — Run tests once
- `pnpm test:ui` — Vitest UI
- `pnpm lint` / `pnpm lint:fix` — ESLint

## Projects module

Nuxt can drop a layer page when another layer already owns the same route name (`index` vs root, `[slug]` vs survey). The projects layer re-registers `/projects` and `/projects/:slug` in `pages:extend`.

### Add another selected product

1. Create a published `products` row in Directus (slug, copy, links, optional gallery/media, optional `github` repo for the releases feed).
2. Add the slug to `site_settings.product_spotlight_slugs` if it should appear on the homepage.
3. Upload walkthrough media to Directus Files and set each file’s `title` to the public path used in guide JSON (for example `/projects/<slug>/shot.webp`). Dev and generate write those files into `public/` (gitignored except `u.js`).
4. `nuxt generate` discovers published product slugs from Directus for prerender, sitemap, and JSON-LD. No new page file is required.

First product: **Simple Rekordbox Converter** at `/projects/rekordbox-playlist-converter`. Evergreen copy lives in Directus. GitHub release versions and download URLs are fetched in the browser from `https://api.github.com/repos/slnnzmtl/rekordbox-playlist-converter/releases` (no token, 1-hour localStorage cache, stale cache if GitHub is down).

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
- Set `SURVEY_WEBHOOK_URL` in `.env` / Vercel to the real JSON `POST` endpoint.
- Payload shape: `{ slug, questions: [{ question, answer }], submissionId?, isUpdate? }`.
- Responses are also stored in `localStorage` (draft + submitted state) via `useSurveyResponses`.
- New surveys under `data/` are picked up automatically; add a `slug` so prerender includes `/survey/<slug>`.

## Build & Deployment

Configured for Nuxt static generation. Prerender uses an explicit route list (`crawlLinks: false`) from:

- `/`, `/experience`, `/survey`, `/projects`, `/sitemap.xml`, `/robots.txt`, plus `getSurveyRoutes()`, `getServiceRoutes()`, and CMS product slugs from Directus (`fetchProductSlugs` at generate time)

```bash
pnpm build
pnpm preview
```

`vercel.json` builds with `@vercel/static-build` (`distDir: .output/public`). Known files (including prerendered `/projects/*`) are served from the filesystem. Unknown `/projects/*` paths return `404.html`. Legacy `/finance` and `/login` also return `404.html`. `/service/**` falls back to `/200.html` for the client-only service layer. All other unmatched paths return `404.html`.

Set `SURVEY_WEBHOOK_URL` in the Vercel project environment for survey submissions. Set `NUXT_PUBLIC_SITE_URL` to the production origin for canonical/social URLs. Set **`DIRECTUS_TOKEN`** (and optionally `DIRECTUS_URL`) as server-only build env vars so `nuxt generate` can read published portfolio content. Deploy finance separately via `personal-finance`.

The portfolio homepage, `/experience`, and `/projects` are indexable (`index, follow`) with canonical URLs, Open Graph tags, and JSON-LD (Person, WebSite, CreativeWork / SoftwareApplication). Survey and service routes remain `noindex`.

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
