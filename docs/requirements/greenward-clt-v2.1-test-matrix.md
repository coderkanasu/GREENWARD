# GREENWARD CLT v2.1.0 Test Matrix

## Purpose
Deterministic decision-table scenarios for @developer and @qa.

## 1. Plan Expansion Cases

| ID | Input | Expected Result |
|---|---|---|
| PE-01 | Tall_Fescue + Basic_7 | IDs: FP1, FP2, FP4, FP5, FP6, FP7, FP8 |
| PE-02 | Tall_Fescue + Plus_9 | IDs: FP1..FP9 (9 visits) |
| PE-03 | Bermuda + Basic_7 | IDs: BP1, BP3, BP4, BP5, BP6, BP7, BP8 |
| PE-04 | Bermuda + Plus_9 | IDs: BP1..BP9 (9 visits) |
| PE-05 | Missing ref in map | Hard validation failure |

## 2. Guardrail Precedence Cases

| ID | Inputs | Triggered Rules | Expected Final Decision |
|---|---|---|---|
| GP-01 | rain=0.8, temp=95, turf=Tall_Fescue | R1 + R2 | BLOCK_APPLICATION |
| GP-02 | rain=0.0, temp=94, turf=Tall_Fescue | R2 | SUGGEST_WATER_ONLY_NO_FERT |
| GP-03 | rain=0.0, green_up=30, turf=Bermuda | R3 | WAIT_FOR_SPRING_FERT |
| GP-04 | rain=0.7, green_up=30, turf=Bermuda | R1 + R3 | BLOCK_APPLICATION |
| GP-05 | rain=0.0, temp=80, green_up=80 | none | CLEAR |

## 3. Cost Formula Cases

| ID | sq_ft | coverage | unit_price | Expected Bags | Expected Line Cost |
|---|---:|---:|---:|---:|---:|
| CF-01 | 5000 | 5000 | 37.00 | 1 | 37.00 |
| CF-02 | 5001 | 5000 | 37.00 | 2 | 74.00 |
| CF-03 | 12000 | 15000 | 68.98 | 1 | 68.98 |
| CF-04 | 15001 | 15000 | 68.98 | 2 | 137.96 |

## 4. Procurement Selection Cases

| ID | Month | sq_ft | specialty | Visit Source | Expected Retailer |
|---|---:|---:|---|---|---|
| PR-01 | 2 | 7000 | false | W1 | W1 |
| PR-02 | 2 | 4000 | false | W1 | R1 |
| PR-03 | 5 | 7000 | false | R1 | R1 |
| PR-04 | 12 | 7000 | true | S1 | S1 |

## 5. Onboarding Validation Cases

| ID | Payload | Expected |
|---|---|---|
| OV-01 | valid zip/turf/tier/sq_ft | accepted |
| OV-02 | zip=2820A | rejected (zip format) |
| OV-03 | sq_ft=0 | rejected (minimum) |
| OV-04 | turf_type=Zoysia | rejected (enum) |
| OV-05 | missing plan_tier | rejected (required) |

## 6. Golden Integration Scenarios

| ID | Persona Input | Expected Annual Shape |
|---|---|---|
| GI-01 | 28277, 4500, Tall_Fescue, Basic_7 | 7 visits, no specialty override |
| GI-02 | 28277, 8000, Tall_Fescue, Plus_9 | 9 visits, mixed W1/R1/S1 |
| GI-03 | 28078, 6000, Bermuda, Basic_7 | 7 visits, no BP2/BP9 |
| GI-04 | 28078, 12000, Bermuda, Plus_9 | 9 visits, specialty visits route S1 |
