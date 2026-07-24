# landing-page-hosting

A Nuxt 3 + Vue 3 project for hosting landing pages and JSON-driven surveys, with Tailwind-based UI components, validation using Zod, and static generation/deployment support.

- **Live site:** https://landing-hosting.vercel.app
- **Repository:** https://github.com/slnnzmtl/landing-hosting

## Tech Stack

- **Framework:** Nuxt 3
- **Frontend:** Vue 3 + TypeScript
- **Styling:** Tailwind CSS (+ forms plugin)
- **Validation:** Zod
- **Charting:** Chart.js
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint (+ lint-staged + Husky)

## Features

- Landing-page friendly Nuxt architecture
- Static generation workflow (`nuxt generate`)
- JSON-configurable survey pages
- Dynamic survey routes via slug
- Google Forms submission support (no backend required)
- Reusable UI components (`components/ui/*`)

## Project Structure

```text
.
├─ components/
│  └─ ui/                     # Reusable UI primitives
├─ pages/
│  ├─ survey/
│  │  ├─ index.vue            # Survey listing page
│  │  ├─ [slug].vue           # Dynamic survey renderer
│  │  └─ surveys.json         # Survey definitions
├─ public/                    # Static assets
├─ tests/                     # Unit/component tests (if present)
├─ nuxt.config.*              # Nuxt configuration
└─ package.json
```

> Note: Exact file set may evolve; the survey module paths above reflect the current implementation.

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended, project includes a pinned pnpm packageManager)

### Install dependencies

```bash
pnpm install
```

If you prefer npm/yarn:

```bash
npm install
# or
# yarn
```

### Run in development

```bash
pnpm dev
```

App runs at `http://localhost:3000` by default.

## Available Scripts

From `package.json`:

- `pnpm dev` — Start dev server
- `pnpm build` — Generate static build (`nuxt generate`)
- `pnpm generate` — Generate static output
- `pnpm preview` — Preview production build
- `pnpm test` — Run tests in watch mode
- `pnpm test:run` — Run tests once
- `pnpm test:ui` — Open Vitest UI
- `pnpm lint` — Lint codebase
- `pnpm lint:fix` — Auto-fix lint issues

## Survey Module

The survey subsystem is JSON-driven and designed for fast iteration.

### Core files

- `pages/survey/surveys.json` — survey metadata + question schema
- `pages/survey/index.vue` — list/entry page for surveys
- `pages/survey/[slug].vue` — dynamic survey form by slug

### Supported question types

- `text`
- `email`
- `textarea`
- `radio`

### Minimal survey example

```json
{
  "slug": "customer-satisfaction",
  "title": "Customer Satisfaction Survey",
  "description": "Help us improve.",
  "action": "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
  "questions": [
    { "id": "name", "label": "Name", "type": "text", "required": true },
    { "id": "email", "label": "Email", "type": "email", "required": true },
    {
      "id": "satisfaction",
      "label": "How satisfied are you?",
      "type": "radio",
      "required": true,
      "options": [
        { "label": "Very Satisfied", "value": "very-satisfied" },
        { "label": "Satisfied", "value": "satisfied" },
        { "label": "Neutral", "value": "neutral" },
        { "label": "Dissatisfied", "value": "dissatisfied" },
        { "label": "Very Dissatisfied", "value": "very-dissatisfied" }
      ]
    },
    { "id": "comments", "label": "Comments", "type": "textarea" }
  ]
}
```

### Google Forms integration

- Set each survey's `action` to your Google Form `formResponse` endpoint.
- Map local question IDs to Google Forms `entry.xxxxx` fields (`entryMap` in your survey model/config).
- Submission is client-side via `fetch` + `FormData` (`no-cors` mode), so responses are opaque.

## Quality & Tooling

- **ESLint** for linting
- **Vitest** for unit tests / component tests
- **Husky** for Git hooks
- **lint-staged** for pre-commit lint fixes on staged files

## Build & Deployment

This project is configured for Nuxt static generation.

### Production build

```bash
pnpm build
```

### Preview production output

```bash
pnpm preview
```

### Deploy

Deploy to Vercel (or any static-compatible host for generated output).  
Homepage configured: https://landing-hosting.vercel.app

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
