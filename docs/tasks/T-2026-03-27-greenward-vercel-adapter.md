# Task: GREENWARD Vercel Adapter

## Task Metadata
- Task ID: T-2026-03-27-greenward-vercel-adapter
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Adapt runtime for Vercel auto-detectable deployment without breaking local Node server workflow.

## Scope
- Add Vercel serverless API routes for health and plan.
- Reuse existing planning logic in a shared runtime adapter.
- Keep local server routes functional.
- Add Vercel deployment docs and config.
- Log all changes in docs/ai_log.md.

## Acceptance Criteria
1. `/api/health` and `/api/plan` exist and run with Vercel.
2. Existing local flow remains functional.
3. Build and tests pass.
4. README includes Vercel deployment steps.
5. Work is logged.

## Deliverables Implemented
- api/health.ts
- api/plan.ts
- src/runtimeAdapter.ts
- vercel.json
- src/server.ts route compatibility updates
- tsconfig.json include update for api files
- README Vercel deployment section

## Execution Log
- 2026-03-27: Added Vercel serverless API handlers for health and plan.
- 2026-03-27: Added shared runtime adapter so local server and serverless handlers reuse identical planning logic.
- 2026-03-27: Added `vercel.json` rewrites for `/`, `/plan`, and `/health` compatibility.
- 2026-03-27: Updated local Node server to support both `/api/*` and legacy routes.
- 2026-03-27: Verified build/tests pass and live endpoint parity (`/api/plan` and `/plan`).
