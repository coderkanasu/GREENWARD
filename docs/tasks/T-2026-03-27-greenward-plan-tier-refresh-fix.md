# Task: GREENWARD Plan Tier Refresh Fix

## Task Metadata
- Task ID: T-2026-03-27-greenward-plan-tier-refresh-fix
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Fix the UI so changing plan tier refreshes the generated plan instead of leaving stale summary metrics on screen.

## Scope
- Trigger plan regeneration when plan tier changes.
- Keep turf switching behavior consistent.
- Verify Tall Fescue Basic 7 and Plus 9 produce different visit counts.
- Log the change in docs/ai_log.md.

## Acceptance Criteria
1. Changing plan tier refreshes the plan output.
2. Tall Fescue Plus 9 returns 9 visits.
3. Tall Fescue Basic 7 returns 7 visits.
4. Work is logged in docs/ai_log.md.

## Deliverables Implemented
- public/app.js auto-submit scheduling for plan tier and turf changes

## Execution Log
- 2026-03-27: Identified stale summary state after plan tier changes.
- 2026-03-27: Added automatic form resubmission when plan tier changes.
- 2026-03-27: Kept turf-change auto refresh aligned with the same behavior.
- 2026-03-27: Verified build/tests pass and live API returns 7 visits for Basic 7 and 9 visits for Plus 9.
