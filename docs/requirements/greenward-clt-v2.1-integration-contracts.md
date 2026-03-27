# GREENWARD CLT v2.1.0 Integration Contracts

## 1. WeatherGateway Contract

### Request
```json
{
  "zip_code": "28277",
  "forecast_window_hours": 24
}
```

### Success Response
```json
{
  "zip_code": "28277",
  "as_of": "2026-03-26T12:00:00Z",
  "forecast_window_hours": 24,
  "rain_forecast_inches": 0.35,
  "max_temp_f": 89
}
```

### Error Response
```json
{
  "error_code": "WEATHER_UNAVAILABLE",
  "message": "Forecast service unavailable",
  "retry_after_seconds": 900
}
```

### Rules
- Timeout budget: 3 seconds.
- If unavailable, app must use last successful weather payload for read-only display and mark guardrails as stale.
- Forecast unit normalization is mandatory: inches and Fahrenheit only.

## 2. ProcurementSelector Contract

### Request
```json
{
  "month": 9,
  "sq_ft": 8200,
  "visit_id": "FP7",
  "default_source": "W1",
  "visit_is_plus9_specialty": false
}
```

### Success Response
```json
{
  "selected_retailer": "W1",
  "candidate_order": ["W1", "R1", "S1"],
  "reason": "warehouse-window-and-large-yard"
}
```

### Specialty Override Example
```json
{
  "selected_retailer": "S1",
  "candidate_order": ["W1", "R1", "S1"],
  "reason": "plus9-specialty-override"
}
```

### Rules
- Warehouse preference only applies for months [2,3,4,8,9] and sq_ft > 5000.
- Specialty override to S1 supersedes default priority.
- Selector must return reason token for explainability.

## 3. PlanRepository Contract

### Query Input
```json
{
  "turf_type": "Tall_Fescue",
  "plan_tier": "Basic_7"
}
```

### Response
```json
{
  "plan_key": "Tall_Fescue|Basic_7",
  "visit_ids": ["FP1", "FP2", "FP4", "FP5", "FP6", "FP7", "FP8"],
  "resolved_visits": [
    {
      "id": "FP1",
      "month": 2,
      "task": "Early Pre-Em/Fert",
      "source": "W1",
      "prod": "Scotts Halts 15k",
      "unit_price": 68.98,
      "coverage": 15000
    }
  ]
}
```

### Rules
- Missing visit ID or broken ref returns a hard validation error.
- `resolved_visits` must be month-sorted.
- Source of truth for visit contents is architecture section 12 canonical_visits.

## 4. Error Taxonomy
- `VALIDATION_ERROR`: malformed input or enum mismatch.
- `RULE_EVAL_ERROR`: rule condition cannot be evaluated.
- `DATA_INTEGRITY_ERROR`: missing/duplicate visit IDs or broken refs.
- `DEPENDENCY_UNAVAILABLE`: downstream service unavailable.

## 5. Observability Requirements
- Every decision payload must include `rule_id` and `reason` token.
- Log correlation key: `greenward_trace_id` on all integration calls.
- Emit metric counters per guardrail decision type.
