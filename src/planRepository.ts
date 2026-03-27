import { CANONICAL_VISITS, PLAN_VISITS } from "./data.js";
import { PlanTier, TurfType, VisitRecord } from "./types.js";

export class PlanRepository {
  getVisitIds(turfType: TurfType, planTier: PlanTier): string[] {
    return [...PLAN_VISITS[turfType][planTier]];
  }

  getResolvedVisits(turfType: TurfType, planTier: PlanTier): VisitRecord[] {
    const ids = this.getVisitIds(turfType, planTier);
    const resolved = ids.map((id) => {
      const visit = CANONICAL_VISITS[id];
      if (!visit) {
        throw new Error(`DATA_INTEGRITY_ERROR: missing canonical visit ${id}`);
      }
      return visit;
    });

    return resolved.sort((a, b) => (a.month - b.month) || a.id.localeCompare(b.id));
  }
}
