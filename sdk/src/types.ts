export type RiskLabel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface WalletVerdict {
  address: string;
  score: number;
  label: RiskLabel;
  verdict: string;
  reasons: string[];
  flags: string[];
  analyzedAt: string;
  onChainPDA?: string;
}

export interface WalletData {
  address: string;
  transactionCount: number;
  walletAgeDays: number;
  lastActivityDaysAgo: number;
  tokenAccountCount: number;
  hasKnownFlaggedInteractions: boolean;
  flaggedContracts: string[];
  solBalance: number;
}

export interface BulkResult {
  results: WalletVerdict[];
  summary: {
    total: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface WatchEvent {
  address: string;
  eventType: "new-transaction" | "risk-change" | "flagged-interaction";
  message: string;
  timestamp: string;
  newVerdict?: WalletVerdict;
}
