# AI Appointment & CRM Automation — CMS implementation manifest

This is a redacted implementation manifest for DDD-211. It contains public content identifiers and metadata only; private evidence, credentials, and operational fields are intentionally excluded.

## Current Directus state

- Slug: `ai-appointment-crm-automation`
- Project ID: `4e19ffa5-a6e3-4641-b519-41e15a81799d`
- Status: `published`
- Case enabled: `true`
- Stage: `production`
- Current published section count: 7
- Current draft section count: 1
- Current linked claim count: 1

### Current sections

| Sort | ID | Status | Kind/layout | Anchor |
|---:|---|---|---|---|
| 10 | `c5db3f95-ff1a-470f-b96c-a0cdd55d9afb` | published | narrative/text | `problem` |
| 20 | `92e46e73-7cfa-47a7-9936-78cb7fb64953` | published | workflow/cards | `one-workflow-three-interfaces` |
| 30 | `64ce25a8-22e6-488c-bfe9-30900e21de12` | published | architecture/wide | `architecture` |
| 40 | `d5b0133a-f94f-4385-9a4e-614b6993a4c0` | published | evolution/cards | `engineering-evolution` |
| 50 | `32f30958-f2bb-4307-b9db-135685417b70` | published | decisions/cards | `design-decisions` |
| 60 | `89f253bb-20fe-41b3-973e-605f4b687d7b` | published | gallery/wide | `product-walkthrough` |
| 70 | `1392ad63-adfb-4072-8f2c-b38ddc0cd23e` | published | evidence/cards | `engineering-evidence` |
| 80 | `695f5591-5fba-4a7f-9f93-5a4689f14750` | draft | limitations/text | `scope-and-limitations` |

## Proposed four-section composition

Reuse the rows below after content review:

1. `c5db3f95-ff1a-470f-b96c-a0cdd55d9afb` → `narrative/text`, problem and role.
2. `89f253bb-20fe-41b3-973e-605f4b687d7b` → `gallery/split`, three booking steps and two screenshots.
3. `1392ad63-adfb-4072-8f2c-b38ddc0cd23e` → `evidence/text`, verified delivered behavior.
4. `32f30958-f2bb-430b-b9db-135685417b70` → `decisions/text`, three engineering decisions.

The workflow, architecture, and evolution rows must remain in the before/after manifest. Their public statuses must not change until shared media/claim usage has been audited and status-change authorization is explicit. The draft limitations row must be preserved unless a separate editorial decision changes it.

## Media audit

Existing public media includes two anonymized screenshots, two architecture/flow diagrams, and a wide hero asset. The current hero asset has stored dimensions but lacks a project-level caption. The proposed media set still requires a final evidence review for:

- a readable completed-booking hero;
- request and response evidence;
- selection/confirmation evidence;
- a deliberate landscape social image;
- safe versioned file titles, meaningful alt text, captions, and presentation values.

The existing hidden section media row is intentionally represented as hidden by `[hidden]`; it must not be deleted without confirmation.

## Access and deployment findings

- The available Directus reader cannot currently project public claim fields through the project claim relation; this must be fixed or reported as an access blocker.
- The redeploy Flow is inactive and its collection list does not include `project_sections`, `project_section_media`, or media file updates.
- The Flow must not be enabled as part of DDD-211. Any credential-bearing request configuration must remain out of this manifest and all logs.
