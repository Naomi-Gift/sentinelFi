export type RiskLabel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type WalletSignals = {
  address: string;
  rpcEndpoint: "helius-mainnet" | "solana-mainnet";
  transactionCount: number;
  walletAgeDays: number | null;
  firstTransactionAt: string | null;
  lastTransactionAt: string | null;
  recentActivityDaysAgo: number | null;
  tokenAccountCount: number;
  nonZeroTokenAccountCount: number;
  flaggedInteractions: string[];
  knownFlaggedAddressesChecked: number;
  sampledTransactionCount: number;
  collectionWarnings: string[];
};

export type WalletVerdict = {
  score: number;
  label: RiskLabel;
  verdict: string;
  reasons: string[];
  flags: string[];
};

export type AuditTrail = {
  attempted: boolean;
  status: "recorded" | "skipped" | "failed";
  signature?: string;
  onChainPDA?: string;
  reason?: string;
};

export type AnalyzeResponse = {
  address: string;
  score: number;
  label: RiskLabel;
  verdict: string;
  reasons: string[];
  flags: string[];
  analyzedAt: string;
  onChainPDA?: string;
  generatedAt: string;
  data: WalletSignals;
  ai: WalletVerdict;
  auditTrail: AuditTrail;
};

export type BulkResult = {
  results: AnalyzeResponse[];
  summary: {
    total: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
};

export type WatchEvent = {
  address: string;
  eventType: "new-transaction" | "risk-change" | "flagged-interaction";
  message: string;
  timestamp: string;
  newVerdict?: AnalyzeResponse;
};
