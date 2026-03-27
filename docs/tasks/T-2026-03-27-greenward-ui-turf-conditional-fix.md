# Task: GREENWARD UI Turf Conditional Fix

## Task Metadata
- Task ID: T-2026-03-27-greenward-ui-turf-conditional-fix
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Fix the browser UI so Bermuda-only controls are not shown for Tall Fescue flows.

## Scope
- Make the Bermuda green-up control conditional on turf selection.
- Ensure Tall Fescue submissions do not send unnecessary green-up values.
- Verify the UI still works for Bermuda scenarios.
- Log the change in docs/ai_log.md.

## Acceptance Criteria
1. Tall Fescue hides the Bermuda green-up control.
2. Bermuda shows the green-up control.
3. `/plan` submissions still work for both turf types.
4. Work is logged in docs/ai_log.md.

## Deliverables Implemented
- public/index.html updated with targeted green-up container id
- public/styles.css updated with reusable hidden state
- public/app.js updated for turf-aware toggle and payload shaping

## Execution Log
- 2026-03-27: Identified that Bermuda-specific green-up control was always rendered regardless of selected turf.
- 2026-03-27: Added turf-aware UI toggling so Tall Fescue hides the green-up control.
- 2026-03-27: Prevented `green_up` from being sent in Tall Fescue requests.
- 2026-03-27: Rebuilt and reran tests successfully.
- 2026-03-27: Reopened the UI in the browser for review.
