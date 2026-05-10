import type { AnalyzeResponse, RiskLabel } from "@/lib/types";
import type { X402Receipt } from "@/lib/x402";

export type AgentPosition = {
  protocol: string;
  asset: string;
  valueUsd: number;
  apy: number;
  targetAddress: string;
};

export type AgentAction = {
  type: "STAKE" | "YIELD_REBALANCE" | "TOKEN_QUARANTINE" | "NONE";
  description: string;
  reason: string;
  targetProtocol: string | null;
  targetWallet: string | null;
  requiresApproval: boolean;
  withinPolicy: boolean;
  walletguardVerdict: {
    score: number;
    label: RiskLabel;
    blocked: boolean;
    verdictPDA?: string;
    x402PaidUsdc: number;
  } | null;
};

export type AgentResponse = {
  briefing: string;
  alerts: Array<{ severity: "INFO" | "WARNING" | "CRITICAL"; message: string; actionRequired: boolean }>;
  recommendedActions: AgentAction[];
  portfolioScore: number;
  x402TotalSpentUsdc: number;
  checkedWallets: Array<{
    address: string;
    verdict: AnalyzeResponse;
    receipt: X402Receipt;
    blocked: boolean;
  }>;
  actionLedger: {
    id: string;
    actionType: AgentAction["type"];
    walletguardScore: number;
    walletguardLabel: RiskLabel;
    walletguardVerdictPda?: string;
    x402PaymentSig: string;
    timestamp: string;
  } | null;
};

export const defaultPositions: AgentPosition[] = [
  {
    protocol: "Marinade",
    asset: "2 SOL staking route",
    valueUsd: 310,
    apy: 7.4,
    targetAddress: "11111111111111111111111111111111"
  },
  {
    protocol: "Kamino",
    asset: "USDC lending",
    valueUsd: 1240,
    apy: 4.2,
    targetAddress: "Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRPU1S9oVrPJpi"
  }
];

export function shortAddress(address?: string) {
  if (!address) return "not recorded";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}
