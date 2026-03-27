import { GuardrailDecision, PlanTier, Retailer, TurfType, VisitRecord } from "./types.js";

export const PLAN_VISITS: Record<TurfType, Record<PlanTier, string[]>> = {
  Tall_Fescue: {
    Plus_9: ["FP1", "FP2", "FP3", "FP4", "FP5", "FP6", "FP7", "FP8", "FP9"],
    Basic_7: ["FP1", "FP2", "FP4", "FP5", "FP6", "FP7", "FP8"]
  },
  Bermuda: {
    Plus_9: ["BP1", "BP2", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8", "BP9"],
    Basic_7: ["BP1", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8"]
  }
};

export const CANONICAL_VISITS: Record<string, VisitRecord> = {
  FP1: { id: "FP1", month: 2, task: "Early Pre-Em/Fert", source: "W1", prod: "Scotts Halts 15k", unit_price: 68.98, coverage: 15000 },
  FP2: { id: "FP2", month: 4, task: "Late Pre-Em/Fert", source: "W1", prod: "Scotts Weed/Feed 15k", unit_price: 67.98, coverage: 14000 },
  FP3: { id: "FP3", month: 5, task: "Organic Soil/Insect", source: "S1", prod: "Milorganite + Triazicide", unit_price: 45.0, coverage: 5000 },
  FP4: { id: "FP4", month: 6, task: "Summer Color", source: "R1", prod: "SummerGuard", unit_price: 37.0, coverage: 5000 },
  FP5: { id: "FP5", month: 7, task: "Clay pH/Lime", source: "R1", prod: "Pelletized Lime (40lb)", unit_price: 7.0, coverage: 5000 },
  FP6: { id: "FP6", month: 8, task: "Spot Weed Control", source: "R1", prod: "Ortho WeedClear", unit_price: 15.0, coverage: 5000 },
  FP7: { id: "FP7", month: 9, task: "Renewal: Seed/Fert", source: "W1", prod: "Scotts Sun/Shade (40lb)", unit_price: 37.99, coverage: 10000, note: "Labor intensive: Aeration month" },
  FP8: { id: "FP8", month: 11, task: "Winterizer", source: "R1", prod: "WinterGuard", unit_price: 29.0, coverage: 5000 },
  FP9: { id: "FP9", month: 12, task: "Poa Annua Kill", source: "S1", prod: "Prodiamine 65 WDG", unit_price: 95.0, coverage: 40000, note: "Professional concentrate" },
  BP1: { id: "BP1", month: 2, task: "Dormant Pre-Em", source: "W1", prod: "Scotts Halts (No Food)", unit_price: 45.0, coverage: 15000 },
  BP2: { id: "BP2", month: 3, task: "Soil Conditioning", source: "S1", prod: "Humic Acid / Organic", unit_price: 30.0, coverage: 5000 },
  BP3: { id: "BP3", month: 4, task: "Green-Up Push", source: "W1", prod: "Scotts Turf Builder", unit_price: 68.98, coverage: 15000 },
  BP4: { id: "BP4", month: 5, task: "Summer Growth", source: "R1", prod: "High Nitrogen Fert", unit_price: 32.0, coverage: 5000 },
  BP5: { id: "BP5", month: 6, task: "Peak Maintenance", source: "R1", prod: "Bermuda/Zoysia Blend", unit_price: 35.0, coverage: 5000 },
  BP6: { id: "BP6", month: 7, task: "Iron/Color Boost", source: "R1", prod: "Ironite / Lime", unit_price: 25.0, coverage: 5000 },
  BP7: { id: "BP7", month: 8, task: "Winterizer (Root)", source: "R1", prod: "High Potash (No Nitrogen)", unit_price: 29.0, coverage: 5000 },
  BP8: { id: "BP8", month: 9, task: "Fall Weed Shield", source: "W1", prod: "Scotts Halts 15k", unit_price: 68.98, coverage: 15000 },
  BP9: { id: "BP9", month: 10, task: "Poa Specialist", source: "S1", prod: "Prodiamine", unit_price: 95.0, coverage: 40000 }
};

export const WAREHOUSE_MONTHS = new Set([2, 3, 4, 8, 9]);

export const RETAILER_PRIORITY: Retailer[] = ["W1", "R1", "S1"];

export const GUARDRAIL_SEVERITY: Record<GuardrailDecision, 1 | 2 | 3 | 4> = {
  BLOCK_APPLICATION: 1,
  WAIT_FOR_SPRING_FERT: 2,
  SUGGEST_WATER_ONLY_NO_FERT: 3,
  CLEAR: 4
};

export const GUARDRAIL_MESSAGES: Record<string, string> = {
  R1: "Heavy rain forecast. Application may wash away. Wait 48 hours after rainfall ends before applying.",
  R2: "Heat wave detected. Skip fertilizer to avoid turf burn. Water 1.5 inches this week.",
  R3: "Bermuda still dormant. Wait for 50% green-up before applying Nitrogen.",
  CLEAR: "Conditions are clear for application."
};
