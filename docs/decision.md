# Decision Log  (Keeli Framework v0.4.2)

Format: Record significant decisions with rationale and alternatives.

---

## TEMPLATE

**Date:** YYYY-MM-DD  
**Decision:** What was decided  
**Context:** Why this decision was needed  
**Alternatives Considered:**
- Option A — rejected because ...
- Option B — rejected because ...

**Consequences:** What this means going forward.

---

<!-- Add decisions above this line -->

**Date:** 2026-03-26  
**Decision:** Establish a contract-first architecture for GREENWARD CLT with explicit domain interfaces and rule precedence.  
**Context:** Product definition includes agronomic safety rules, retailer routing logic, and cost formulas that must stay deterministic and explainable.  
**Alternatives Considered:**
- UI-embedded logic — rejected because business rules become hard to test and easy to drift.
- Ad hoc service calls without interfaces — rejected because weather/procurement integrations need replaceable seams.

**Consequences:** Plan generation, guardrails, and costing must run behind `PlanRepository`, `ProcurementSelector`, `WeatherGateway`, `GuardrailEvaluator`, and `CostCalculator` contracts.

**Date:** 2026-03-26  
**Decision:** Treat Bermuda Basic_7 "follows BP1, BP3, ..." as explicit visit inclusion mapping for canonical expansion.  
**Context:** Source master data is partially referential for Tall Fescue and narrative for Bermuda Basic_7, creating ambiguity in generation consistency.  
**Alternatives Considered:**
- Infer subset dynamically by excluding Plus_9 "advanced" visits — rejected because classification can drift and is subjective.
- Leave as runtime free text interpretation — rejected because it breaks determinism and traceability.

**Consequences:** Bermuda Basic_7 uses fixed IDs `BP1,BP3,BP4,BP5,BP6,BP7,BP8` until product ownership revises mapping.

**Date:** 2026-03-26  
**Decision:** Enforce guardrail severity ordering where rain block supersedes all lower-severity recommendations.  
**Context:** Multiple agronomic rules can trigger for a single visit window; a single final user directive is needed.  
**Alternatives Considered:**
- Display all triggered actions equally — rejected because conflicting guidance reduces user trust.
- Last-rule-wins evaluation — rejected because behavior depends on rule order in code, not policy.

**Consequences:** Severity order is formalized as `BLOCK_APPLICATION > WAIT_FOR_SPRING_FERT > SUGGEST_WATER_ONLY_NO_FERT > CLEAR`.

**Date:** 2026-03-26  
**Decision:** Adopt machine-readable contract appendix as normative implementation source for GREENWARD CLT v2.1.0 architecture.  
**Context:** Implementation and test teams require deterministic, parseable contracts for plan sets, guardrails, and procurement policy.  
**Alternatives Considered:**
- Keep prose-only contracts — rejected because interpretation drift is likely across teams.
- Maintain separate JSON in code repo without docs binding — rejected because governance and review become fragmented.

**Consequences:** `docs/requirements/greenward-clt-v2.1-architecture.md` section 12 is normative and supersedes prose in case of conflict.

**Date:** 2026-03-26  
**Decision:** Lock rain and heat rule operators as `rain_forecast > 0.5` in a 24-hour forecast window and `temp >= 92` for fescue heat stress, with a 48-hour post-rain waiting message.  
**Context:** Proposed contract payload introduced operator and timing ambiguity (`> 92`, no explicit forecast window, and new wait message).  
**Alternatives Considered:**
- Use strict `temp > 92` — rejected to avoid edge ambiguity at exactly 92F.
- Remove 48-hour wait guidance — rejected because users need explicit post-block recovery instruction.

**Consequences:** Evaluation uses 24-hour forecast detection and inclusive 92F heat threshold; user-facing rain guidance includes a 48-hour wait after rainfall ends.

**Date:** 2026-03-26  
**Decision:** Keep procurement priority `W1 > R1 > S1` with explicit specialty override to `S1` for Plus_9 specialty visits.  
**Context:** Flat priority conflicts with specialty chemical sourcing intent in Plus_9 plan paths.  
**Alternatives Considered:**
- Global `S1` priority increase — rejected because it undermines warehouse/default optimization for non-specialty items.
- No override — rejected because it can route specialty items to unsupported retailers.

**Consequences:** Procurement engine applies default priority first, then enforces `S1` override for visits tagged as Plus_9 specialty.

**Date:** 2026-03-26  
**Decision:** Accept all PO approvals PO-01 through PO-06 as approved and clear policy blockers for runtime implementation.  
**Context:** User approved all pending items in the PO approval packet.  
**Alternatives Considered:**
- Keep approvals in pending state — rejected because explicit user approval was provided.
- Partially apply approvals — rejected because no selective rejections were provided.

**Consequences:** Product-policy freeze achieved for v2.1.0; implementation can proceed without further PO clarification on current scope.

**Date:** 2026-03-26  
**Decision:** Require explicit runtime stack approval before code implementation due to missing stack registration in `docs/skills.md`.  
**Context:** Architect policy prohibits assuming technology stack without documented project skills.  
**Alternatives Considered:**
- Choose TypeScript by default — rejected because it is an undocumented assumption.
- Choose Python by default — rejected because it is an undocumented assumption.

**Consequences:** Runtime implementation task opens as blocked until DEV-STACK-01 approval is provided.

**Date:** 2026-03-27  
**Decision:** Select TypeScript (Node 20) as runtime implementation stack for GREENWARD CLT v2.1.0.  
**Context:** User approved all pending approvals including DEV-STACK-01; runtime implementation required immediate execution.  
**Alternatives Considered:**
- Python 3.12 with Pydantic — rejected to avoid restarting implementation after TypeScript scaffold was already created and validated.
- Other stack — rejected due no specific user-provided alternative.

**Consequences:** Runtime modules, tests, and dev server are implemented in TypeScript; stack registered in `docs/skills.md`.

**Date:** 2026-03-27  
**Decision:** Accept runtime implementation completion based on successful build, tests, and live endpoint checks in dev mode.  
**Context:** User requested iterative test-and-learn execution until completion.  
**Alternatives Considered:**
- Stop at unit tests only — rejected because live endpoint checks were explicitly requested.
- Continue refactoring without new failures — rejected because acceptance criteria were already met.

**Consequences:** Runtime task marked COMPLETED and ready for user review/next feature iteration.

**Date:** 2026-03-27  
**Decision:** Make region awareness presentation-level for v2.1 UI by deriving display/disclaimer text from ZIP, while keeping agronomic logic Charlotte-tuned.  
**Context:** User requested region-sensitive behavior, but the approved v2.1 contract and formulas remain Charlotte Piedmont specific.  
**Alternatives Considered:**
- Leave region fully static in UI — rejected because it misrepresents user ZIP context.
- Switch agronomic logic by ZIP immediately — rejected because no region-specific master data or guardrails are defined yet.

**Consequences:** UI now reflects ZIP-derived region context and warns for outside-core ZIPs; future true region switching requires new plan data and guardrail contracts.
