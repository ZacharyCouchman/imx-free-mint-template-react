export interface EligibilityResult {
  chainName: string;
  collectionAddress: string;
  maxTokenSupplyAcrossAllPhases: number;
  mintPhases: MintPhase[];
}

export interface MintPhase {
  name: string;
  startTime: number;
  endTime: number;
  startTokenID: number;
  endTokenID: number;
  isActive: boolean;
  isEligible: boolean;
  walletTokenAllowance?: number;
}
