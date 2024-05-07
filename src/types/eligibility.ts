export interface EligibilityResult {
  chainName: string;
  collectionAddress: string;
  mintPhases: MintPhase[];
}

export interface MintPhase {
  name: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isAllowListed: boolean;
}
