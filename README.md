# landing-hosting

A Nuxt 3 + Vue 3 multi-domain app for landing pages, public product pages, JSON-driven surveys, and service marketing pages. Domains are Nuxt layers under `domains/`, with Tailwind UI, Zod validation, and static generation for Vercel. Personal finance lives in the sibling [`personal-finance`](../personal-finance) app.

- **Live site:** https://landing-hosting.vercel.app
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
├─ composables/                   # Root composables (e.g. useForm)
├─ domains/
│  ├─ projects/
│  │  ├─ pages/                   # index, [slug] → /projects/*
│  │  ├─ data/                    # Typed project registry
│  │  ├─ components/              # Gallery + GitHub releases
│  │  ├─ public/                  # Local product media
│  │  └─ project-routes.ts
│  ├─ survey/
│  │  ├─ pages/                   # index, [slug] → /survey/*
│  │  ├─ data/*.json              # Survey definitions
│  │  ├─ composables/             # useSurveys, useSurveyResponses
│  │  └─ survey-routes.ts
│  └─ service/
│     ├─ pages/                   # Landing pages → /service/*
│     └─ service-routes.ts
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
NUXT_PUBLIC_SITE_URL=https://landing-hosting.vercel.app
```

`SURVEY_WEBHOOK_URL` maps to `runtimeConfig.public.surveyWebhookUrl` and is the live survey POST target; JSON `action` fields in survey files are inert placeholders only.

`NUXT_PUBLIC_SITE_URL` (or `SITE_URL`) is the production origin used for canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt`. Do not set this to a Vercel preview hostname. If unset, it defaults to `https://landing-hosting.vercel.app`.

Personal finance env vars (`SUPABASE_*`, `ALLOWED_EMAILS`) belong in the sibling `personal-finance` app, not here.

### Install & run

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000` by default.

## Available Scripts

- `pnpm dev` — Start dev server
- `pnpm build` / `pnpm generate` — Static generate (`nuxt generate`)
- `pnpm preview` — Preview production build
- `pnpm test` — Vitest watch mode
- `pnpm test:run` — Run tests once
- `pnpm test:ui` — Vitest UI
- `pnpm lint` / `pnpm lint:fix` — ESLint

## Projects module

Nuxt can drop a layer page when another layer already owns the same route name (`index` vs root, `[slug]` vs survey). The projects layer re-registers `/projects` and `/projects/:slug` in `pages:extend`.

### Add another selected project

1. Create `domains/projects/data/<slug>.ts` exporting a `Project` (name, copy, links, optional gallery/media, optional `github` repo for the releases feed).
2. Append it to the `projects` array in `domains/projects/data/registry.ts`.
3. Put local media under `domains/projects/public/projects/<slug>/` (do not hotlink GitHub raw images).
4. `getProjectRoutes()` picks up the slug for prerender, sitemap, and JSON-LD automatically. No new page file is required.

First product: **Simple Rekordbox Converter** at `/projects/rekordbox-playlist-converter`. Evergreen copy lives in the registry. GitHub release versions and download URLs are fetched in the browser from `https://api.github.com/repos/slnnzmtl/rekordbox-playlist-converter/releases` (no token, 1-hour localStorage cache, stale cache if GitHub is down).

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

- `/`, `/survey`, `/sitemap.xml`, `/robots.txt`, plus `getSurveyRoutes()`, `getServiceRoutes()`, `getProjectRoutes()`

```bash
pnpm build
pnpm preview
```

`vercel.json` builds with `@vercel/static-build` (`distDir: .output/public`). Known files (including prerendered `/projects/*`) are served from the filesystem. Unknown `/projects/*` paths return `404.html`. Legacy `/finance` and `/login` also return `404.html`. Other unmatched paths fall back to `/200.html` for client-side routes.

Set `SURVEY_WEBHOOK_URL` in the Vercel project environment for survey submissions. Set `NUXT_PUBLIC_SITE_URL` to the production origin for canonical/social URLs. Deploy finance separately via `personal-finance`.

Homepage: https://landing-hosting.vercel.app

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
