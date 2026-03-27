export type TurfType = "Tall_Fescue" | "Bermuda";
export type PlanTier = "Basic_7" | "Plus_9";
export type Retailer = "W1" | "R1" | "S1";

export type GuardrailDecision =
  | "BLOCK_APPLICATION"
  | "WAIT_FOR_SPRING_FERT"
  | "SUGGEST_WATER_ONLY_NO_FERT"
  | "CLEAR";

export interface OnboardingInput {
  zip_code: string;
  sq_ft: number;
  turf_type: TurfType;
  plan_tier: PlanTier;
}

export interface VisitRecord {
  id: string;
  month: number;
  task: string;
  source: Retailer;
  prod: string;
  unit_price: number;
  coverage: number;
  note?: string;
}

export interface WeatherSnapshot {
  forecast_window_hours: number;
  rain_forecast: number;
  temp: number;
}

export interface GuardrailInput {
  turf: TurfType;
  weather: WeatherSnapshot;
  green_up?: number;
}

export interface GuardrailResult {
  decision: GuardrailDecision;
  severity: 1 | 2 | 3 | 4;
  rule_id: string;
  message: string;
  blocking: boolean;
}

export interface ProcurementInput {
  month: number;
  sq_ft: number;
  default_source: Retailer;
  visit_is_plus9_specialty: boolean;
}

export interface ProcurementResult {
  selected_retailer: Retailer;
  candidate_order: Retailer[];
  reason: string;
}

export interface PlanLineItem {
  visit_id: string;
  month: number;
  task: string;
  source: Retailer;
  product: string;
  coverage: number;
  unit_price: number;
  bags: number;
  line_cost: number;
  guardrail: GuardrailResult;
}

export interface PlanOutput {
  visit_count: number;
  annual_cost: number;
  savings_vs_pro: number;
  line_items: PlanLineItem[];
}
