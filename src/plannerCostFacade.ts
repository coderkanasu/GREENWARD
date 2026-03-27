import { calculateBags, calculateLineCost, calculateSavings } from "./costCalculator.js";

export class CostCalculator {
  calculateBags(sqFt: number, coverage: number): number {
    return calculateBags(sqFt, coverage);
  }

  calculateLineCost(bags: number, unitPrice: number): number {
    return calculateLineCost(bags, unitPrice);
  }

  calculateAnnualCost(costs: number[]): number {
    return Number(costs.reduce((sum, value) => sum + value, 0).toFixed(2));
  }

  calculateSavings(visitCount: number, annualCost: number): number {
    return calculateSavings(visitCount, annualCost);
  }
}
