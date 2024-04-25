export interface EligibilityResult {
  phases: Phase[];
}

export interface Phase {
  name: string;
  isActive: boolean;
  isEligible: boolean;
}
