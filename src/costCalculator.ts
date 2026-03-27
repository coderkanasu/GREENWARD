export function calculateBags(sqFt: number, coverage: number): number {
  return Math.ceil(sqFt / coverage);
}

export function calculateLineCost(bags: number, unitPrice: number): number {
  return Number((bags * unitPrice).toFixed(2));
}

export function calculateSavings(visitCount: number, annualCost: number): number {
  return Number(((visitCount * 85) - annualCost).toFixed(2));
}
