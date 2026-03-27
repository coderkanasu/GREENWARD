# GREENWARD CLT v2.1.0 PO Approval Packet

## Purpose
Single review sheet for product-owner approvals required before build freeze.

## Approval Status Legend
- `PENDING`: needs explicit approval/rejection.
- `APPROVED`: approved by @po.
- `REJECTED`: rejected by @po with replacement policy.

## Decisions Requiring @po Approval

| ID | Topic | Current Proposal | Status |
|---|---|---|---|
| PO-01 | ZIP Scope | Accept any US 5-digit ZIP with Charlotte disclaimer when outside core region. | APPROVED |
| PO-02 | Green-Up Input Mode | User-controlled slider (0-100%) on Bermuda flows. | APPROVED |
| PO-03 | Pro Cost Baseline | Keep fixed $85 per visit for all tiers in v2.1.0. | APPROVED |
| PO-04 | Retailer Override UX | Allow manual override only after showing optimizer choice and price delta. | APPROVED |
| PO-05 | Rain Recovery Message | Keep 48-hour post-rain wait guidance message. | APPROVED |
| PO-06 | Yard Size Floor | Keep minimum sq_ft at 500. | APPROVED |

## Approval Questions (Answer Inline)
1. PO-01 approved? If not, provide allowed ZIP policy and fallback behavior.
2. PO-02 approved? If not, provide preferred source for green-up value.
3. PO-03 approved? If not, define alternative formula for savings baseline.
4. PO-04 approved? If not, indicate whether optimizer lock is required.
5. PO-05 approved? If not, provide revised post-rain message and timing.
6. PO-06 approved? If not, provide revised minimum sq_ft.

## Impact if Not Approved
- Unapproved PO-01..PO-06 items block implementation freeze and QA sign-off.

## Approval Resolution
- Resolution Timestamp: 2026-03-26
- Decision Source: User approved all pending items in chat.
- Result: PO-01 through PO-06 moved to APPROVED; implementation freeze blocker cleared.
