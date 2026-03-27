# Task: GREENWARD v2.1 Runtime Implementation

## Task Metadata
- Task ID: T-2026-03-26-greenward-runtime-implementation
- Persona: @developer
- Backup Persona: @architect
- Requested By: User
- Date Opened: 2026-03-26
- Status: COMPLETED
- Priority: P0

## Objective
Implement executable runtime modules for plan generation, guardrail evaluation, procurement selection, and cost calculation using approved v2.1 contracts.

## Scope
- Implement `PlanRepository` with canonical visit map and plan set expansion.
- Implement `GuardrailEvaluator` with severity precedence.
- Implement `ProcurementSelector` with warehouse preference and specialty override.
- Implement `CostCalculator` formulas and deterministic output ordering.
- Implement onboarding payload validation from schemas.

## Blocker
- Resolved: runtime stack approved and recorded in docs/skills.md.

## Required Approval
- DEV-STACK-01: Approve runtime stack for implementation.

## Proposed Options
1. TypeScript (Node 20) with JSON schema validation.
2. Python 3.12 with Pydantic models.
3. Other stack chosen by @po/@developer.

## Approval Resolution
- DEV-STACK-01: APPROVED
- Selected stack: TypeScript (Node 20)
- Decision source: User approved all pending approvals in chat.

## Acceptance Criteria
1. Implementations pass all cases in docs/requirements/greenward-clt-v2.1-test-matrix.md.
2. Outputs conform to schemas in docs/requirements/greenward-clt-v2.1-contract-schemas.md.
3. Integration modules conform to docs/requirements/greenward-clt-v2.1-integration-contracts.md.
4. Runtime logic matches normative contract appendix in docs/requirements/greenward-clt-v2.1-architecture.md section 12.

## Deliverables Implemented
- package.json / tsconfig.json runtime scaffold
- src/types.ts
- src/data.ts
- src/validators.ts
- src/planRepository.ts
- src/guardrailEvaluator.ts
- src/procurementSelector.ts
- src/costCalculator.ts
- src/plannerCostFacade.ts
- src/planner.ts
- src/server.ts
- tests/runtime.test.ts

## Execution Log
- 2026-03-27: Runtime stack approved and recorded in docs/skills.md.
- 2026-03-27: Created TypeScript runtime scaffold and scripts (`dev`, `build`, `test`, `start`).
- 2026-03-27: Implemented plan repository, guardrail evaluator, procurement selector, cost calculator, and planner service.
- 2026-03-27: Implemented HTTP server with `/health` and `/plan` endpoints.
- 2026-03-27: Wrote automated tests for validation, plan expansion, precedence, procurement, and formula determinism.
- 2026-03-27: Fixed validator typing issue and test script path issue from first verification run.
- 2026-03-27: Verified `npm run build` and `npm test` pass.
- 2026-03-27: Verified dev server responses for `/health` and `/plan` scenarios (Tall Fescue rain+heat and Bermuda low green-up).
