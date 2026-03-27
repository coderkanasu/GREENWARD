import { CostCalculator } from "./plannerCostFacade.js";
import { GuardrailEvaluator } from "./guardrailEvaluator.js";
import { PlanRepository } from "./planRepository.js";
import { ProcurementSelector } from "./procurementSelector.js";
import { GuardrailInput, OnboardingInput, PlanOutput } from "./types.js";

interface BuildPlanOptions {
  rain_forecast?: number;
  temp?: number;
  forecast_window_hours?: number;
  green_up?: number;
}

export class PlannerService {
  constructor(
    private readonly planRepository = new PlanRepository(),
    private readonly guardrailEvaluator = new GuardrailEvaluator(),
    private readonly procurementSelector = new ProcurementSelector(),
    private readonly costCalculator = new CostCalculator()
  ) {}

  buildPlan(input: OnboardingInput, options: BuildPlanOptions = {}): PlanOutput {
    const visits = this.planRepository.getResolvedVisits(input.turf_type, input.plan_tier);

    const rain_forecast = options.rain_forecast ?? 0;
    const temp = options.temp ?? 75;
    const forecast_window_hours = options.forecast_window_hours ?? 24;

    const line_items = visits.map((visit) => {
      const guardrailInput: GuardrailInput = {
        turf: input.turf_type,
        weather: {
          forecast_window_hours,
          rain_forecast,
          temp
        },
        green_up: options.green_up
      };

      const guardrail = this.guardrailEvaluator.evaluate(guardrailInput);
      const procurement = this.procurementSelector.select({
        month: visit.month,
        sq_ft: input.sq_ft,
        default_source: visit.source,
        visit_is_plus9_specialty: input.plan_tier === "Plus_9" && visit.source === "S1"
      });

      const bags = this.costCalculator.calculateBags(input.sq_ft, visit.coverage);
      const line_cost = this.costCalculator.calculateLineCost(bags, visit.unit_price);

      return {
        visit_id: visit.id,
        month: visit.month,
        task: visit.task,
        source: procurement.selected_retailer,
        product: visit.prod,
        coverage: visit.coverage,
        unit_price: visit.unit_price,
        bags,
        line_cost,
        guardrail
      };
    }).sort((a, b) => (a.month - b.month) || a.visit_id.localeCompare(b.visit_id));

    const annual_cost = this.costCalculator.calculateAnnualCost(line_items.map((item) => item.line_cost));

    return {
      visit_count: line_items.length,
      annual_cost,
      savings_vs_pro: this.costCalculator.calculateSavings(line_items.length, annual_cost),
      line_items
    };
  }
}
