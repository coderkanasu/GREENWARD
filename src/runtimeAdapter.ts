import { PlannerService } from "./planner.js";
import { validateOnboardingInput } from "./validators.js";

const planner = new PlannerService();

export function buildPlanFromPayload(payload: unknown) {
  const onboarding = validateOnboardingInput(payload);
  const source = (payload ?? {}) as Record<string, unknown>;

  return planner.buildPlan(onboarding, {
    rain_forecast: typeof source.rain_forecast === "number" ? source.rain_forecast : 0,
    temp: typeof source.temp === "number" ? source.temp : 75,
    forecast_window_hours: typeof source.forecast_window_hours === "number" ? source.forecast_window_hours : 24,
    green_up: typeof source.green_up === "number" ? source.green_up : undefined
  });
}
