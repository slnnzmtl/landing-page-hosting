# Nuxt Example

Deploy your [Nuxt](https://nuxt.com) project to Vercel with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/framework-boilerplates/nuxtjs&template=nuxtjs)

_Live Example: https://nuxtjs-template.vercel.app_

Look at the [Nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment#presets) for more information.

## Surveys as a Service

This project includes a lightweight JSON-driven survey system using shadcn-inspired Tailwind UI components and Google Forms submission (no backend required).

### Files & Structure

- `pages/survey/surveys.json`: Master list of surveys & questions.
- `pages/survey/index.vue`: Lists all surveys.
- `pages/survey/[slug].vue`: Dynamic form renderer.
- `components/ui/*`: Reusable UI primitives.

### Defining a Survey

Add an object to `surveys.json`:

```jsonc
{
	"slug": "customer-satisfaction",
	"title": "Customer Satisfaction Survey",
	"description": "Help us improve.",
	"googleForm": {
		"formId": "FORM_ID",
		"action": "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
		"entryMap": {
			"name": "entry.123456",
			"email": "entry.234567",
			"satisfaction": "entry.345678",
			"comments": "entry.456789"
		}
	},
	"questions": [
		{ "id": "name", "label": "Name", "type": "text", "required": true },
		{ "id": "email", "label": "Email", "type": "email", "required": true },
		{ "id": "satisfaction", "label": "How satisfied?", "type": "radio", "required": true, "options": [
			{ "label": "Very Satisfied", "value": "very-satisfied" },
			{ "label": "Satisfied", "value": "satisfied" },
			{ "label": "Neutral", "value": "neutral" },
			{ "label": "Dissatisfied", "value": "dissatisfied" },
			{ "label": "Very Dissatisfied", "value": "very-dissatisfied" }
		]},
		{ "id": "comments", "label": "Comments", "type": "textarea" }
	]
}
```

Supported types: `text`, `email`, `textarea`, `radio`.

### Mapping to Google Forms

The `entryMap` links your local question `id` to each Google Forms `entry.xxxxx` field name. Inspect the live Google Form (right-click → Inspect) and copy the `name` attribute values.

Only mapped fields are submitted—unmapped IDs are ignored.

### Submission Behavior

- Uses a simple `fetch` POST with `FormData` and `mode: 'no-cors'` (response is opaque; success assumed if no exception).
- Add additional client validation as needed.

### Extending

- Add new components to `components/ui` for more field types (select, checkbox group, scale, date, etc.).
- Support conditional logic by adding rules in JSON (e.g., `showIf`).
- Add analytics or webhook proxying via a server route for reliability.

### Quick Start

1. Create a Google Form.
2. Copy its form ID from the URL.
3. Map each field's `entry.xxxxx` to your JSON `entryMap`.
4. Visit `/survey/your-slug` to test.

Enjoy creating surveys fast!
