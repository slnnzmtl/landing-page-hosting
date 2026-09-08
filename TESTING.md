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
├─ domains/finance/
│  ├─ finance-query.test.ts
│  └─ finance-filter-query.test.ts
├─ pages/
│  ├─ survey-index-logic.test.ts
│  └─ survey-slug-logic.test.ts
└─ utils/
   └─ prefix-domain-pages.test.ts
```

## Coverage (by area)

### Survey composables

**`useSurveyResponses`** — localStorage get/set/clear, SSR-safe access, validation, slug handling, draft vs submitted persistence.

**`useSurveys`** — load definitions from `domains/survey/data/*.json`, sort by title, find by slug, shape checks (including inert webhook `action` URLs).

**`survey-webhook`** — inert placeholder detection (`example.com`) and env override via `SURVEY_WEBHOOK_URL`.

### Survey page logic

**Index** — filter by title/description/slug, case-insensitive search, trending/empty/saved states.

**Detail (`[slug]`)** — form init, progress, required vs optional validation, question types (`text` / `email` / `textarea` / `radio`), submission readiness, webhook payload mapping.

### Finance utils

**`finance-query`** — date bounds, expense/category normalization, query builders, category×month matrix, formatting.

**`finance-filter-query`** — parse/serialize URL query ↔ filter state, defaults, paid filter, category multi-select, month `0` = all months (when allowed).

### Domain routing

**`prefix-domain-pages`** — prefixes Nuxt pages contributed by a domain layer (`domains/<name>/pages/*` → `/<name>/...`).

## Philosophy

- Prefer logic tests over DOM-heavy component mounts.
- Use real survey JSON when useful; mock storage and network.
- Cover SSR / empty / malformed edge cases where the composable handles them.
