import { GUARDRAIL_MESSAGES, GUARDRAIL_SEVERITY } from "./data.js";
import { GuardrailInput, GuardrailResult } from "./types.js";

export class GuardrailEvaluator {
  evaluate(input: GuardrailInput): GuardrailResult {
    const triggered: GuardrailResult[] = [];

    if (input.weather.rain_forecast > 0.5 && input.weather.forecast_window_hours <= 24) {
      triggered.push({
        decision: "BLOCK_APPLICATION",
        severity: GUARDRAIL_SEVERITY.BLOCK_APPLICATION,
        rule_id: "R1",
        message: GUARDRAIL_MESSAGES.R1,
        blocking: true
      });
    }

    if (input.turf === "Tall_Fescue" && input.weather.temp >= 92) {
      triggered.push({
        decision: "SUGGEST_WATER_ONLY_NO_FERT",
        severity: GUARDRAIL_SEVERITY.SUGGEST_WATER_ONLY_NO_FERT,
        rule_id: "R2",
        message: GUARDRAIL_MESSAGES.R2,
        blocking: false
      });
    }

    if (input.turf === "Bermuda" && typeof input.green_up === "number" && input.green_up < 50) {
      triggered.push({
        decision: "WAIT_FOR_SPRING_FERT",
        severity: GUARDRAIL_SEVERITY.WAIT_FOR_SPRING_FERT,
        rule_id: "R3",
        message: GUARDRAIL_MESSAGES.R3,
        blocking: false
      });
    }

    if (triggered.length === 0) {
      return {
        decision: "CLEAR",
        severity: GUARDRAIL_SEVERITY.CLEAR,
        rule_id: "CLEAR",
        message: GUARDRAIL_MESSAGES.CLEAR,
        blocking: false
      };
    }

    triggered.sort((a, b) => a.severity - b.severity);
    return triggered[0];
  }
}
