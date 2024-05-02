export interface MintConfigurationResult {
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
  enableAllowList: boolean;
  maxPerWallet?: number;
  totalMinted: number;
}
