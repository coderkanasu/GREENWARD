# Task: GREENWARD Month-Aware Priority View

## Task Metadata
- Task ID: T-2026-03-27-greenward-month-aware-priority-view
- Persona: @developer
- Backup Persona: @po
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Make the plan UI month-aware by prioritizing current-month actions first, with an optional full-plan view.

## Scope
- Add current-month spotlight section.
- Default results to prioritized (not full) view.
- Add toggle to switch between prioritized and full annual plan views.
- Keep existing plan generation unchanged.

## Acceptance Criteria
1. Current-month actions are shown first by default.
2. User can click to view full annual plan.
3. User can toggle back to prioritized view.
4. Build/test remain green and change is logged.

## Deliverables Implemented
- public/index.html result control and spotlight containers
- public/styles.css result control styling
- public/app.js month-aware prioritized rendering and full-plan toggle

## Execution Log
- 2026-03-27: Added month-priority view that shows current-month actions first.
- 2026-03-27: Added `Show full annual plan` toggle with reversible `Show month-first view` state.
- 2026-03-27: Added fallback behavior to show next upcoming action when no visit exists in the current month.
- 2026-03-27: Verified build/tests pass and live assets are served.
