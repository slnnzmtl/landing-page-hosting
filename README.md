# landing-hosting

A Nuxt 3 + Vue 3 multi-domain app for landing pages, JSON-driven surveys, and a personal finance dashboard. Domains are Nuxt layers under `domains/`, with Tailwind UI, Zod validation, Supabase for finance data, and static generation for Vercel.

- **Live site:** https://landing-hosting.vercel.app
- **Repository:** https://github.com/slnnzmtl/landing-hosting

## Tech Stack

- **Framework:** Nuxt 3 (multi-layer via `extends`)
- **Frontend:** Vue 3 + TypeScript
- **Styling:** Tailwind CSS (+ forms plugin)
- **Data:** Supabase (`@supabase/supabase-js`) for finance
- **Validation:** Zod
- **Charting:** Chart.js
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint (+ lint-staged + Husky)
- **Deploy:** Vercel static build (`.output/public`)

## Domains

| Domain | Routes | Purpose |
|--------|--------|---------|
| **Root** | `/` | Portfolio / landing homepage |
| **survey** | `/survey`, `/survey/:slug` | JSON-driven surveys with webhook submit |
| **finance** | `/finance/dashboard`, `/finance/expenses` | Expense dashboard + CRUD (Supabase, client-only) |
| **service** | `/service/:page` | Service landing pages |

Each domain lives under `domains/<name>/` as a Nuxt layer. Page routes are prefixed with `utils/prefix-domain-pages.ts` so `domains/finance/pages/dashboard.vue` becomes `/finance/dashboard`.

## Features

- Multi-domain Nuxt layer architecture
- Static generation (`nuxt generate`) with explicit prerender routes
- JSON-configurable surveys (one file per survey under `domains/survey/data/`)
- Webhook-based survey submission (JSON POST, update support via `submissionId`)
- Finance dashboard: monthly/category charts, category×month matrix, URL-synced filters
- Finance expenses: list, filter, sort, create/update with Supabase
- Reusable UI primitives (`components/ui/*`)

## Project Structure

```text
.
├─ components/ui/                 # Shared UI primitives
├─ composables/                   # Root composables (e.g. useForm)
├─ domains/
│  ├─ finance/
│  │  ├─ pages/                   # dashboard, expenses → /finance/*
│  │  ├─ composables/             # Supabase + dashboard/expenses state
│  │  ├─ utils/                   # Query builders, filter URL sync
│  │  ├─ supabase/                # RLS SQL helpers
│  │  └─ finance-routes.ts        # Prerender route discovery
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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-publishable-key
SURVEY_WEBHOOK_URL=https://example.com/webhook/survey/submit
```

`SUPABASE_*` map to `runtimeConfig.public.supabaseUrl` / `supabaseKey` and are required for `/finance/*`. `SURVEY_WEBHOOK_URL` maps to `runtimeConfig.public.surveyWebhookUrl` and is the live survey POST target; JSON `action` fields in survey files are inert placeholders only.

For finance reads as anon, apply `domains/finance/supabase/rls-finance.sql` in the Supabase SQL Editor if tables return empty under RLS.

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

## Finance Module

Client-only (`ssr: false`), noindex.

| Page | Path | Notes |
|------|------|-------|
| Dashboard | `/finance/dashboard` | Charts, category totals, category×month matrix |
| Expenses | `/finance/expenses` | Filterable/sortable expense table + edits |

Filters (year, month, date range, categories, paid status) sync to the URL via `useFinanceFilterState`. Shared query helpers live in `domains/finance/utils/`.

## Build & Deployment

Configured for Nuxt static generation. Prerender uses an explicit route list (`crawlLinks: false`) from:

- `/`, `/survey`, plus `getSurveyRoutes()`, `getServiceRoutes()`, `getFinanceRoutes()`

```bash
pnpm build
pnpm preview
```

`vercel.json` builds with `@vercel/static-build` (`distDir: .output/public`) and falls back unmatched paths to `/200.html` for client-side routes.

Set `SUPABASE_URL` and `SUPABASE_KEY` in the Vercel project environment for finance pages in production. Set `SURVEY_WEBHOOK_URL` for survey submissions.

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
