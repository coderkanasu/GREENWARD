import { RETAILER_PRIORITY, WAREHOUSE_MONTHS } from "./data.js";
import { ProcurementInput, ProcurementResult } from "./types.js";

export class ProcurementSelector {
  select(input: ProcurementInput): ProcurementResult {
    if (input.visit_is_plus9_specialty) {
      return {
        selected_retailer: "S1",
        candidate_order: [...RETAILER_PRIORITY],
        reason: "plus9-specialty-override"
      };
    }

    const warehousePreferred =
      input.default_source === "W1" &&
      WAREHOUSE_MONTHS.has(input.month) &&
      input.sq_ft > 5000;

    if (warehousePreferred) {
      return {
        selected_retailer: "W1",
        candidate_order: [...RETAILER_PRIORITY],
        reason: "warehouse-window-and-large-yard"
      };
    }

    return {
      selected_retailer: input.default_source === "S1" ? "S1" : "R1",
      candidate_order: [...RETAILER_PRIORITY],
      reason: "default-retailer-routing"
    };
  }
}
