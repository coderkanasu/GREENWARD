# Task: GREENWARD v2.1 UI and README

## Task Metadata
- Task ID: T-2026-03-27-greenward-ui-and-readme
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Add a runnable user interface for the GREENWARD runtime and document local usage with concrete examples.

## Scope
- Add a browser UI served by the existing runtime server.
- Connect UI form submission to the `/plan` endpoint.
- Render plan results, guardrails, annual cost, and savings clearly.
- Add a README with install, dev, build, start, and sample request flows.
- Run the UI locally and present it for review.

## Acceptance Criteria
1. Visiting `/` loads a working UI.
2. UI submits onboarding fields and optional runtime inputs to `/plan`.
3. UI renders line items and summary metrics from live API responses.
4. README documents setup and usage accurately.
5. Work is logged in docs/ai_log.md.

## Deliverables Implemented
- public/index.html
- public/styles.css
- public/app.js
- README.md
- src/server.ts static asset support

## Execution Log
- 2026-03-27: Created a static browser UI with live form submission to `/plan`.
- 2026-03-27: Added polished styling and result rendering for summary, guardrail, and line-item cards.
- 2026-03-27: Added local storage persistence for onboarding fields.
- 2026-03-27: Updated server to serve static assets from `/`.
- 2026-03-27: Wrote README with install, run, test, and API examples.
- 2026-03-27: Fixed HEAD route handling after live probe exposed incorrect 404 behavior.
- 2026-03-27: Verified `npm run build`, `npm test`, `GET /`, `HEAD /`, and `GET /health`.
- 2026-03-27: Opened UI in the integrated browser for review.
