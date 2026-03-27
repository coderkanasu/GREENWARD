# GREENWARD CLT v2.1.0 Contract Schemas

## Purpose
Machine-validated schemas for boundary contracts used by @developer implementation and @qa regression tests.

## 1. Onboarding Input Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "greenward/onboarding-input.schema.json",
  "type": "object",
  "required": ["zip_code", "sq_ft", "turf_type", "plan_tier"],
  "additionalProperties": false,
  "properties": {
    "zip_code": {
      "type": "string",
      "pattern": "^[0-9]{5}$"
    },
    "sq_ft": {
      "type": "integer",
      "minimum": 500
    },
    "turf_type": {
      "type": "string",
      "enum": ["Tall_Fescue", "Bermuda"]
    },
    "plan_tier": {
      "type": "string",
      "enum": ["Basic_7", "Plus_9"]
    }
  }
}
```

## 2. Guardrail Decision Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "greenward/guardrail-decision.schema.json",
  "type": "object",
  "required": ["decision", "severity", "rule_id", "message", "blocking"],
  "additionalProperties": false,
  "properties": {
    "decision": {
      "type": "string",
      "enum": [
        "BLOCK_APPLICATION",
        "WAIT_FOR_SPRING_FERT",
        "SUGGEST_WATER_ONLY_NO_FERT",
        "CLEAR"
      ]
    },
    "severity": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4
    },
    "rule_id": {
      "type": "string",
      "pattern": "^R[0-9]+$"
    },
    "message": {
      "type": "string",
      "minLength": 3
    },
    "blocking": {
      "type": "boolean"
    }
  }
}
```

## 3. Plan Output Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "greenward/plan-output.schema.json",
  "type": "object",
  "required": ["visit_count", "annual_cost", "savings_vs_pro", "line_items"],
  "additionalProperties": false,
  "properties": {
    "visit_count": {
      "type": "integer",
      "minimum": 1
    },
    "annual_cost": {
      "type": "number",
      "minimum": 0
    },
    "savings_vs_pro": {
      "type": "number"
    },
    "line_items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "visit_id",
          "month",
          "task",
          "source",
          "product",
          "coverage",
          "unit_price",
          "bags",
          "line_cost",
          "guardrail"
        ],
        "additionalProperties": false,
        "properties": {
          "visit_id": {
            "type": "string"
          },
          "month": {
            "type": "integer",
            "minimum": 1,
            "maximum": 12
          },
          "task": {
            "type": "string"
          },
          "source": {
            "type": "string",
            "enum": ["W1", "R1", "S1"]
          },
          "product": {
            "type": "string"
          },
          "coverage": {
            "type": "integer",
            "minimum": 1
          },
          "unit_price": {
            "type": "number",
            "minimum": 0
          },
          "bags": {
            "type": "integer",
            "minimum": 1
          },
          "line_cost": {
            "type": "number",
            "minimum": 0
          },
          "guardrail": {
            "$ref": "greenward/guardrail-decision.schema.json"
          }
        }
      }
    }
  }
}
```

## 4. Determinism Rules for Validation
- Schema validation must execute before business-rule evaluation.
- `line_items` must be sorted by month then visit_id.
- `bags` must equal `ceil(sq_ft / coverage)` for every line item.
- `annual_cost` must equal sum of all `line_cost` values.
- `savings_vs_pro` must equal `(visit_count * 85) - annual_cost`.
