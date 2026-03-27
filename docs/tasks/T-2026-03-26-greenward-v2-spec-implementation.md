# Task: GREENWARD v2.1 Spec Implementation Pack

## Task Metadata
- Task ID: T-2026-03-26-greenward-v2-spec-implementation
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-26
- Status: COMPLETED
- Priority: P0

## Objective
Translate GREENWARD CLT v2.1 architecture into implementation-ready, test-ready specification artifacts with deterministic contracts and explicit product approvals.

## Scope
- Update normative architecture appendix to include full canonical visit map.
- Produce contract schemas for input, guardrail output, and plan output validation.
- Produce deterministic test matrix for plan expansion, guardrails, procurement, and formulas.
- Produce integration contracts for WeatherGateway, ProcurementSelector, and PlanRepository.
- Produce @po approval packet listing unresolved policy approvals.

## Deliverables
- docs/requirements/greenward-clt-v2.1-architecture.md
- docs/requirements/greenward-clt-v2.1-contract-schemas.md
- docs/requirements/greenward-clt-v2.1-test-matrix.md
- docs/requirements/greenward-clt-v2.1-integration-contracts.md
- docs/requirements/greenward-clt-v2.1-po-approvals.md
- docs/decision.md
- docs/ai_log.md

## Acceptance Criteria
1. Normative contract contains full FP1..FP9 and BP1..BP9 canonical visit records.
2. Guardrail precedence and operators are explicitly codified.
3. Validation schemas are concrete and machine-consumable.
4. Test matrix includes edge, precedence, and formula determinism cases.
5. A single @po approval checklist is present with explicit pending decisions.
6. All actions are logged in docs/ai_log.md with task linkage.

## Execution Log
- 2026-03-26: Created architecture contract and initial ADRs.
- 2026-03-26: Added normative machine-readable appendix and policy ADRs.
- 2026-03-26: Added contract schemas, test matrix, and integration contracts.
- 2026-03-26: Added @po approval packet with pending policy sign-offs.
- 2026-03-26: Expanded canonical_visits to full authoritative map.
- 2026-03-26: User approved PO-01..PO-06; approval packet updated and blockers cleared.

## Review Notes
- PO approvals are complete; this task is closed.
- Runtime implementation can proceed against approved contracts with no remaining product-policy blockers.
