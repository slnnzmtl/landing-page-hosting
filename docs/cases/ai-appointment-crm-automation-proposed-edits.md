# AI Appointment & CRM Automation — proposed CMS edits

These are exact proposed public-field edits for DDD-218 and DDD-219. They are grounded in the current Directus record and the linked public repository. They have not been written to Directus.

## Project fields

| Field | Proposed value | Notes |
|---|---|---|
| `slug` | `ai-appointment-crm-automation` | Keep stable. |
| `name` | `AI Appointment & CRM Automation` | Keep current value. |
| `role` | `Independent full-stack AI engineer` | Keep current value. |
| `engagement_label` | `Independent product · Full-stack & AI engineering` | Keep current value. |
| `stage_label` | `early_production` | Aligns with the public repository's explicit “early production workflow” wording; this changes the current CMS value `production` and requires editorial approval. |
| `stack_tags` | `LangGraph`, `Telegram`, `EspoCRM`, `Docker`, `TypeScript` | Keep current value. |
| `case_lead` | `Telegram booking across text, voice, and guided controls—with identity, availability, and CRM writes enforced by application code.` | Keep current value. |
| `seo_title` | `LangGraph Appointment Bot Case Study | Daniel Kazansky` | Keep current value. |
| `seo_description` | `How a Telegram booking assistant evolved into a controlled LangGraph workflow with live EspoCRM availability, identity checks, explicit approval gates, and deterministic UI.` | Keep current value. |
| `evidence_links` | `[{"label":"Inspect repository","href":"https://github.com/slnnzmtl/langgraph-appointment-bot"}]` | Keep current value. |

### Homepage/detail summaries

```text
short_description:
Appointment booking and CRM updates needed live availability, identity checks, and human control over writes—not an unsupervised chatbot.

problem:
Appointment requests still required manual back-and-forth: interpret the request, identify the patient, check a live slot, get approval, and record the visit. The system had to support text, voice, and guided choices without replacing EspoCRM.

contribution:
Built a LangGraph assistant that routes booking, rescheduling, and cancellation through Telegram, live CRM availability, identity-scoped tools, and approval-controlled writes.

outcome:
One controlled workflow across text, voice, and guided controls, with EspoCRM remaining authoritative for contacts, availability, and appointments.
```

## Proposed four-section composition

The four rows below reuse real Directus IDs. The proposed status for each target row is `published`; no status mutation has been applied.

### 1. Narrative/text — `c5db3f95-ff1a-470f-b96c-a0cdd55d9afb`

- Anchor: `problem`
- Heading: `The problem and my role`
- Body:

  > Appointment requests arrived through free-form text, voice notes, and guided choices, but staff still had to interpret the request, identify the patient, check live availability, get confirmation, and record the visit.
  >
  > I built the application-owned workflow around Telegram, LangGraph, and EspoCRM so the model could interpret and route requests while identity, availability, and CRM writes stayed under deterministic controls.

- Items: empty
- Layout: `text`

### 2. Gallery/split — `89f253bb-20fe-41b3-973e-605f4b687d7b`

- Anchor: `product-walkthrough`
- Heading: `Booking an appointment`
- Body: `Text, voice, and guided controls enter the same CRM-backed booking path. The application presents current choices, keeps the operation specific, and requires confirmation before a write.`
- Items:
  1. `Start with a request` — `Type a booking question, send a voice note, or use a guided Telegram control.`
  2. `Choose a live slot` — `Select a service, date, and available time returned from the CRM-backed workflow.`
  3. `Confirm the operation` — `Review the specific pending booking, reschedule, or cancellation before the CRM write.`
- Media: retain the existing guided and voice screenshots:
  - `c2e391d2-e769-42a5-a4f9-702cb0d5bd14`
  - `a5c66a2d-e842-43df-8fa7-09db1e1dab2a`
- Layout: `split`

### 3. Evidence/text — `1392ad63-adfb-4072-8f2c-b38ddc0cd23e`

- Anchor: `engineering-evidence`
- Heading: `What was delivered`
- Body: `The public TypeScript implementation exposes the routing, Telegram controls, identity-scoped CRM tools, approval interrupts, checkpoint persistence, and failure handling.`
- Items:
  1. `Controlled workflow` — `Text, voice, and guided controls converge on one application-owned booking path.`
  2. `CRM safeguards` — `Identity-scoped reads, live availability, and operation-specific tools keep CRM state authoritative.`
  3. `Explicit writes` — `Booking, rescheduling, and cancellation pause for confirmation before changing CRM state.`
- Linked claim: retain the existing published claim only after public claim-field permission is restored and its shared usage is confirmed.
- Layout: `text`

### 4. Decisions/text — `32f30958-f2bb-4307-b9db-135685417b70`

- Anchor: `design-decisions`
- Heading: `Key engineering decisions`
- Items:
  1. `Keep EspoCRM authoritative` — `The assistant reads live contacts, services, availability, and appointments instead of replacing the CRM.`
  2. `Put guarantees in application code` — `Identity, valid slots, deterministic controls, and operation boundaries do not depend on model behavior.`
  3. `Require approval for writes` — `Each booking, reschedule, or cancellation is tied to a specific pending operation before the write proceeds.`
- Body: `The model handles ambiguity and routing; ordinary application code owns correctness-critical behavior.`
- Layout: `text`

## Required status plan

Do not apply until shared usage has been checked and status changes are explicitly authorized:

- Keep the four target rows published.
- Move `92e46e73-7cfa-47a7-9936-78cb7fb64953` (workflow), `64ce25a8-22e6-488c-bfe9-30900e21de12` (architecture), and `d5b0133a-f94f-4385-9a4e-614b6993a4c0` (evolution) out of the published composition, using a reversible supported status only.
- Preserve `695f5591-5fba-4a7f-9f93-5a4689f14750` (limitations) as draft until its publication decision is made.
- Do not delete rows, claims, or files.

## Media disposition

The current guided and voice screenshots are sufficient for the walkthrough after the section metadata is updated. The following evidence is still missing and must not be fabricated:

- a readable completed-booking product hero;
- a separate request/response example if the walkthrough screenshots do not show it clearly;
- a deliberate landscape social image.

The current wide hero file is an architecture-style asset, has dimensions `3200×960`, and has no project-level caption. It should not be described as a completed-booking hero without visual/editorial approval.
