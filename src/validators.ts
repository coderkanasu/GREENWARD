import { OnboardingInput } from "./types.js";

const ZIP_RE = /^[0-9]{5}$/;

export function validateOnboardingInput(input: unknown): OnboardingInput {
  if (!input || typeof input !== "object") {
    throw new Error("VALIDATION_ERROR: onboarding payload must be an object");
  }

  const value = input as Record<string, unknown>;

  const zip_code = value.zip_code;
  const sq_ft = value.sq_ft;
  const turf_type = value.turf_type;
  const plan_tier = value.plan_tier;

  if (typeof zip_code !== "string" || !ZIP_RE.test(zip_code)) {
    throw new Error("VALIDATION_ERROR: zip_code must be a 5-digit string");
  }

  if (!Number.isInteger(sq_ft) || (sq_ft as number) < 500) {
    throw new Error("VALIDATION_ERROR: sq_ft must be an integer >= 500");
  }

  if (turf_type !== "Tall_Fescue" && turf_type !== "Bermuda") {
    throw new Error("VALIDATION_ERROR: turf_type must be Tall_Fescue or Bermuda");
  }

  if (plan_tier !== "Basic_7" && plan_tier !== "Plus_9") {
    throw new Error("VALIDATION_ERROR: plan_tier must be Basic_7 or Plus_9");
  }

  return {
    zip_code,
    sq_ft: sq_ft as number,
    turf_type,
    plan_tier
  };
}
