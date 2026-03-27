# GREENWARD CLT v2.1.0 Architecture Contract

## 1. Purpose
Define system contracts and decision rules for GREENWARD CLT in Charlotte Piedmont (USDA 8a), optimized for heavy acidic red clay and HOA-compliant lawn outcomes.

## 2. Product Constraints
- Region: Charlotte Piedmont (NC/SC).
- Climate: Transition zone, USDA 8a.
- Soil assumptions: Heavy red clay, acidic tendency.
- Program objective: Professional outcomes with approximately 70% lower annual cost than local services.

## 3. Onboarding Contract

### 3.1 Required Inputs
- `zip_code`: string, US ZIP format.
- `sq_ft`: integer, minimum 500.
- `turf_type`: enum `Tall_Fescue | Bermuda`.
- `plan_tier`: enum `Basic_7 | Plus_9`.

### 3.2 Validation Rules
- Reject unknown turf and plan values.
- Reject non-positive square footage.
- Require all 4 onboarding fields before plan generation.
- Persist onboarding payload in local storage under a versioned key: `greenward.v2.onboarding`.

## 4. Canonical Domain Model

### 4.1 Plan Identity
- Composite key: `turf_type + plan_tier`.
- Valid combinations:
  - Tall_Fescue + Basic_7
  - Tall_Fescue + Plus_9
  - Bermuda + Basic_7
  - Bermuda + Plus_9

### 4.2 Visit Record Contract
Each visit in the expanded plan must include:
- `id`: string
- `month`: integer (1-12)
- `task`: string
- `source`: enum `W1 | R1 | S1`
- `prod`: string
- `unit_price`: decimal
- `coverage`: integer (square feet per package)
- `note`: optional string

### 4.3 Retailer Contract
- `W1`: Costco/Sams, preferred when month in warehouse window and user `sq_ft > 5000`.
- `R1`: Lowes/Home Depot, default fallback and non-specialty items.
- `S1`: DoMyOwn, specialty/Plus_9 chemical paths.

## 5. Plan Expansion Rules

### 5.1 Reference Expansion
- `Tall_Fescue.Basic_7` references `Tall_Fescue.Plus_9` entries by `ref`.
- Expansion algorithm must resolve each `ref` to a concrete visit record before calculation.
- Unresolvable reference is a hard validation failure.

### 5.2 Bermuda Basic_7 Mapping
Source phrase "Follows BP1, BP3, BP4, BP5, BP6, BP7, BP8 logic" is treated as explicit inclusion set:
- `BP1`, `BP3`, `BP4`, `BP5`, `BP6`, `BP7`, `BP8`.

### 5.3 Ordering
- Sort visits by `month` ascending.
- Preserve source `id` order for same-month ties.

## 6. Guardrail Decision Contract

### 6.1 Inputs
- Weather API response for target ZIP.
- Runtime turf state inputs when applicable (for Bermuda green-up percent).

### 6.2 Rule Set
- Rain delay rule:
  - Condition: forecast rain `> 0.5` inches within `24` hours.
  - Action: `BLOCK_APPLICATION` and display warning card.
- Tall fescue heat stress:
  - Condition: temperature `>= 92F`.
  - Action: `SUGGEST_WATER_ONLY_NO_FERT`.
- Bermuda spring nitrogen:
  - Condition: green-up `< 50%`.
  - Action: `WAIT_FOR_SPRING_FERT`.

### 6.3 Rule Precedence
When multiple rules trigger, severity ordering is:
1. `BLOCK_APPLICATION`
2. `WAIT_FOR_SPRING_FERT`
3. `SUGGEST_WATER_ONLY_NO_FERT`
4. `CLEAR`

## 7. Calculation Contract
- `bags = ceil(user_sq_ft / coverage)`
- `cost = bags * unit_price`
- `annual_cost = sum(cost for all visits)`
- `savings_vs_pro = (visit_count * 85) - annual_cost`

Output payload must include, at minimum:
- `visit_count`
- `annual_cost`
- `savings_vs_pro`
- `line_items[]` with `visit_id`, `bags`, `line_cost`

## 8. Interface Contracts (Implementation-Agnostic)

### 8.1 `PlanRepository`
Responsibilities:
- Return canonical master plan data.
- Resolve references to concrete visit records.
- Validate plan integrity (IDs, refs, month range).

### 8.2 `ProcurementSelector`
Responsibilities:
- Select best retailer source according to windows and sq_ft rule.
- Return normalized purchase options with source rationale.

### 8.3 `WeatherGateway`
Responsibilities:
- Fetch weather forecast by ZIP.
- Return normalized precipitation/temperature fields required by guardrails.

### 8.4 `GuardrailEvaluator`
Responsibilities:
- Apply agronomic guardrails to current visit context.
- Return machine-readable decision and user-facing message token.

### 8.5 `CostCalculator`
Responsibilities:
- Compute bags, line item cost, annual totals, and savings metric.
- Use canonical formulas without modification by UI.

## 9. Non-Functional Requirements
- Determinism: same inputs produce identical plan, costs, and guardrail state.
- Explainability: each displayed action includes the rule/reason token.
- Configurability: constants (rain threshold, heat threshold, pro baseline rate) must be externalized from UI rendering.
- Offline tolerance: last successful generated plan remains visible if weather service is unavailable.

## 10. Ambiguities to Escalate to @po
- ZIP scope policy: permit only Charlotte-area ZIPs, or allow all US ZIPs with regional disclaimers.
- Bermuda green-up measurement source: user self-report, image analysis, or manual slider.
- `savings_vs_pro` baseline: fixed `$85/visit` for all tiers or tier-adjusted benchmark.
- Warehouse source override: can users force a retailer choice when optimization picks another source.

## 11. Acceptance Checklist (Architecture)
- Inputs are validated against required onboarding contract.
- Every produced visit is concrete and calculation-ready.
- Guardrail actions follow defined precedence.
- Cost and savings formulas match contract exactly.
- All external dependencies are accessed via declared interfaces.

## 12. Machine-Readable Contract Appendix (Normative)

The JSON below is normative for implementation. In any conflict, this appendix supersedes prose sections above.

```json
{
  "contracts": {
    "PlanRepository": {
      "fescue_plus_9": ["FP1", "FP2", "FP3", "FP4", "FP5", "FP6", "FP7", "FP8", "FP9"],
      "fescue_basic_7": ["FP1", "FP2", "FP4", "FP5", "FP6", "FP7", "FP8"],
      "bermuda_plus_9": ["BP1", "BP2", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8", "BP9"],
      "bermuda_basic_7": ["BP1", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8"]
    },
    "GuardrailEvaluator": {
      "severity_order": ["BLOCK_APPLICATION", "WAIT_FOR_SPRING_FERT", "SUGGEST_WATER_ONLY_NO_FERT", "CLEAR"],
      "rules": [
        {
          "id": "R1",
          "type": "BLOCK_APPLICATION",
          "condition": "rain_forecast > 0.5 && forecast_window_hours <= 24",
          "message": "Heavy rain forecast. Application may wash away. Wait 48 hours after rainfall ends before applying."
        },
        {
          "id": "R2",
          "type": "SUGGEST_WATER_ONLY_NO_FERT",
          "condition": "temp >= 92 && turf == 'Fescue'",
          "message": "Heat wave detected. Skip fertilizer to avoid turf burn. Water 1.5 inches this week."
        },
        {
          "id": "R3",
          "type": "WAIT_FOR_SPRING_FERT",
          "condition": "green_up < 50 && turf == 'Bermuda'",
          "message": "Bermuda still dormant. Wait for 50% green-up before applying Nitrogen."
        }
      ]
    },
    "ProcurementSelector": {
      "priority": ["W1", "R1", "S1"],
      "warehouse_months": [2, 3, 4, 8, 9],
      "specialty_override": {
        "enabled": true,
        "retailer": "S1",
        "applies_when": "visit_is_plus9_specialty == true"
      }
    }
  },
  "canonical_visits": {
    "FP1": {
      "month": 2,
      "task": "Early Pre-Em/Fert",
      "source": "W1",
      "prod": "Scotts Halts 15k",
      "unit_price": 68.98,
      "coverage": 15000
    },
    "FP2": {
      "month": 4,
      "task": "Late Pre-Em/Fert",
      "source": "W1",
      "prod": "Scotts Weed/Feed 15k",
      "unit_price": 67.98,
      "coverage": 14000
    },
    "FP3": {
      "month": 5,
      "task": "Organic Soil/Insect",
      "source": "S1",
      "prod": "Milorganite + Triazicide",
      "unit_price": 45.0,
      "coverage": 5000
    },
    "FP4": {
      "month": 6,
      "task": "Summer Color",
      "source": "R1",
      "prod": "SummerGuard",
      "unit_price": 37.0,
      "coverage": 5000
    },
    "FP5": {
      "month": 7,
      "task": "Clay pH/Lime",
      "source": "R1",
      "prod": "Pelletized Lime (40lb)",
      "unit_price": 7.0,
      "coverage": 5000
    },
    "FP6": {
      "month": 8,
      "task": "Spot Weed Control",
      "source": "R1",
      "prod": "Ortho WeedClear",
      "unit_price": 15.0,
      "coverage": 5000
    },
    "FP7": {
      "month": 9,
      "task": "Renewal: Seed/Fert",
      "source": "W1",
      "prod": "Scotts Sun/Shade (40lb)",
      "unit_price": 37.99,
      "coverage": 10000,
      "note": "Labor intensive: Aeration month"
    },
    "FP8": {
      "month": 11,
      "task": "Winterizer",
      "source": "R1",
      "prod": "WinterGuard",
      "unit_price": 29.0,
      "coverage": 5000
    },
    "FP9": {
      "month": 12,
      "task": "Poa Annua Kill",
      "source": "S1",
      "prod": "Prodiamine 65 WDG",
      "unit_price": 95.0,
      "coverage": 40000,
      "note": "Professional concentrate"
    },
    "BP1": {
      "month": 2,
      "task": "Dormant Pre-Em",
      "source": "W1",
      "prod": "Scotts Halts (No Food)",
      "unit_price": 45.0,
      "coverage": 15000
    },
    "BP2": {
      "month": 3,
      "task": "Soil Conditioning",
      "source": "S1",
      "prod": "Humic Acid / Organic",
      "unit_price": 30.0,
      "coverage": 5000
    },
    "BP3": {
      "month": 4,
      "task": "Green-Up Push",
      "source": "W1",
      "prod": "Scotts Turf Builder",
      "unit_price": 68.98,
      "coverage": 15000
    },
    "BP4": {
      "month": 5,
      "task": "Summer Growth",
      "source": "R1",
      "prod": "High Nitrogen Fert",
      "unit_price": 32.0,
      "coverage": 5000
    },
    "BP5": {
      "month": 6,
      "task": "Peak Maintenance",
      "source": "R1",
      "prod": "Bermuda/Zoysia Blend",
      "unit_price": 35.0,
      "coverage": 5000
    },
    "BP6": {
      "month": 7,
      "task": "Iron/Color Boost",
      "source": "R1",
      "prod": "Ironite / Lime",
      "unit_price": 25.0,
      "coverage": 5000
    },
    "BP7": {
      "month": 8,
      "task": "Winterizer (Root)",
      "source": "R1",
      "prod": "High Potash (No Nitrogen)",
      "unit_price": 29.0,
      "coverage": 5000
    },
    "BP8": {
      "month": 9,
      "task": "Fall Weed Shield",
      "source": "W1",
      "prod": "Scotts Halts 15k",
      "unit_price": 68.98,
      "coverage": 15000
    },
    "BP9": {
      "month": 10,
      "task": "Poa Specialist",
      "source": "S1",
      "prod": "Prodiamine",
      "unit_price": 95.0,
      "coverage": 40000
    }
  },
  "notes": {
    "canonical_visits_scope": "Authoritative complete map for v2.1.0 implementation.",
    "formula_source": "Use Section 7 formulas without modification."
  }
}
```