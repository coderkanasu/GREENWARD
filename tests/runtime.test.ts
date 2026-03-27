import assert from "node:assert/strict";
import test from "node:test";
import { calculateBags, calculateLineCost } from "../src/costCalculator.js";
import { GuardrailEvaluator } from "../src/guardrailEvaluator.js";
import { PlannerService } from "../src/planner.js";
import { PlanRepository } from "../src/planRepository.js";
import { ProcurementSelector } from "../src/procurementSelector.js";
import { validateOnboardingInput } from "../src/validators.js";

test("onboarding validation accepts valid payload", () => {
  const value = validateOnboardingInput({
    zip_code: "28277",
    sq_ft: 5000,
    turf_type: "Tall_Fescue",
    plan_tier: "Basic_7"
  });
  assert.equal(value.zip_code, "28277");
});

test("onboarding validation rejects invalid zip", () => {
  assert.throws(() => validateOnboardingInput({
    zip_code: "2820A",
    sq_ft: 5000,
    turf_type: "Tall_Fescue",
    plan_tier: "Basic_7"
  }));
});

test("plan repository returns expected IDs for fescue basic", () => {
  const repo = new PlanRepository();
  const ids = repo.getVisitIds("Tall_Fescue", "Basic_7");
  assert.deepEqual(ids, ["FP1", "FP2", "FP4", "FP5", "FP6", "FP7", "FP8"]);
});

test("guardrail precedence picks block when rain and heat are both true", () => {
  const evaluator = new GuardrailEvaluator();
  const result = evaluator.evaluate({
    turf: "Tall_Fescue",
    weather: {
      forecast_window_hours: 24,
      rain_forecast: 0.8,
      temp: 95
    }
  });
  assert.equal(result.decision, "BLOCK_APPLICATION");
});

test("procurement routes warehouse for large yard in warehouse month", () => {
  const selector = new ProcurementSelector();
  const result = selector.select({
    month: 2,
    sq_ft: 7000,
    default_source: "W1",
    visit_is_plus9_specialty: false
  });
  assert.equal(result.selected_retailer, "W1");
});

test("procurement routes specialty override to S1", () => {
  const selector = new ProcurementSelector();
  const result = selector.select({
    month: 12,
    sq_ft: 7000,
    default_source: "S1",
    visit_is_plus9_specialty: true
  });
  assert.equal(result.selected_retailer, "S1");
});

test("cost formulas match deterministic matrix values", () => {
  assert.equal(calculateBags(5000, 5000), 1);
  assert.equal(calculateBags(5001, 5000), 2);
  assert.equal(calculateLineCost(2, 68.98), 137.96);
});

test("planner emits sorted line items and aggregate fields", () => {
  const planner = new PlannerService();
  const plan = planner.buildPlan({
    zip_code: "28277",
    sq_ft: 4500,
    turf_type: "Tall_Fescue",
    plan_tier: "Basic_7"
  }, {
    rain_forecast: 0,
    temp: 80,
    forecast_window_hours: 24
  });

  assert.equal(plan.visit_count, 7);
  assert.equal(plan.line_items[0].visit_id, "FP1");
  assert.equal(plan.line_items[plan.line_items.length - 1].visit_id, "FP8");
  assert.equal(typeof plan.annual_cost, "number");
  assert.equal(typeof plan.savings_vs_pro, "number");
});
