# Testing

Vitest + Vue Test Utils. Suites focus on business logic (composables, query helpers, page logic) rather than brittle UI snapshots.

## How to run

```bash
pnpm test:run   # CI / one-shot
pnpm test       # watch
pnpm test:ui    # Vitest UI
```

Config: `vitest.config.ts` (path aliases `~/` and `@/`).

## Layout

```text
tests/
├─ composables/
│  ├─ useSurveys.test.ts
│  └─ useSurveyResponses.test.ts
├─ data/
│  ├─ experience.test.ts
│  └─ homepage.test.ts
├─ domains/projects/
│  ├─ registry.test.ts
│  ├─ rekordbox-product.test.ts
│  ├─ github-releases.test.ts
│  └─ seo.test.ts
├─ pages/
│  ├─ survey-index-logic.test.ts
│  └─ survey-slug-logic.test.ts
└─ utils/
   ├─ prefix-domain-pages.test.ts
   └─ survey-webhook.test.ts
```

## Coverage (by area)

### Survey composables

**`useSurveyResponses`** — localStorage get/set/clear, SSR-safe access, validation, slug handling, draft vs submitted persistence.

**`useSurveys`** — load definitions from `domains/survey/data/*.json`, sort by title, find by slug, shape checks (including inert webhook `action` URLs).

**`survey-webhook`** — inert placeholder detection (`example.com`) and env override via `SURVEY_WEBHOOK_URL`.

### Survey page logic

**Index** — filter by title/description/slug, case-insensitive search, trending/empty/saved states.

**Detail (`[slug]`)** — form init, progress, required vs optional validation, question types (`text` / `email` / `textarea` / `radio`), submission readiness, webhook payload mapping.

### Domain routing

**`prefix-domain-pages`** — prefixes Nuxt pages contributed by a domain layer (`domains/<name>/pages/*` → `/<name>/...`), including the projects index collision with root `/`.

### Projects domain

**Registry** — lookup by slug, unknown-slug 404 data, prerender discovery for `/projects` and registered slugs.

**Rekordbox product data** — evergreen copy, five-step How to use walkthrough with local screenshots (no GitHub hotlinks), required links.

**GitHub releases** — mocked `fetch` for success, empty, 403/429, network error, prerelease, and stale localStorage cache. Notes are plain text.

**SEO** — production site origin, canonical/OG tags, homepage Person/WebSite/CreativeWork JSON-LD, CollectionPage/SoftwareApplication for projects, sitemap and robots output.

**Homepage content** — approved copy, href classification, and conversion events for contact/case CTAs (`conversionEventName` + `trackConversion` window CustomEvent).

Finance unit tests moved to the sibling `personal-finance` app.

## Philosophy

- Prefer logic tests over DOM-heavy component mounts.
- Use real survey JSON when useful; mock storage and network.
- Cover SSR / empty / malformed edge cases where the composable handles them.
