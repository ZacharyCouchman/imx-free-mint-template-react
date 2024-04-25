export interface MintConfigurationResult {
  mintPhases: MintPhase[];
}

export interface MintPhase {
  name: string;
  startTime: number;
  endTime: number;
  maxSupply: number;
  enableAllowList: boolean;
}
