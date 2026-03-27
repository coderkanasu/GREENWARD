# Task: Store Link Availability UI

## Task Metadata
- Task ID: T-2026-03-27-store-link-availability-ui
- Persona: @developer
- Backup Persona: @po
- Requested By: User
- Date Opened: 2026-03-27
- Status: COMPLETED
- Priority: P1

## Objective
Show explicit retailer links for each product line item instead of only generic product search text.

## Scope
- Replace generic find-product callout with concrete store links.
- Map links by source class (W1, R1, S1).
- Keep product term prefilled in retailer search URLs.
- Preserve existing pricing/guardrail data.

## Acceptance Criteria
1. Each line item shows "Available at" with retailer-specific links.
2. Links are prefilled with product query text.
3. Build/test remain green.
4. Work is logged in docs/ai_log.md.

## Deliverables Implemented
- public/index.html availability container in line item template
- public/styles.css availability label/link chip styles
- public/app.js retailer-specific availability link map and rendering

## Execution Log
- 2026-03-27: Replaced generic product search callout with explicit retailer links per line item.
- 2026-03-27: Added source-based mapping: W1 -> Costco/Sam's, R1 -> Lowe's/Home Depot, S1 -> DoMyOwn.
- 2026-03-27: Added product-prefilled search URLs for direct lookup.
- 2026-03-27: Verified build and tests remain green.
