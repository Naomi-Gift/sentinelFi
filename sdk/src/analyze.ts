import { WalletVerdict } from "./types";

const API_BASE = process.env.WALLETGUARD_API_URL || "https://walletguard.ai/api";

export async function analyzeWallet(
  address: string,
  options?: { storeOnChain?: boolean; apiBase?: string }
): Promise<WalletVerdict> {
  const response = await fetch(`${options?.apiBase ?? API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, storeOnChain: options?.storeOnChain ?? true })
  });

  if (!response.ok) {
    throw new Error(`Sentinel Guard analysis failed: ${response.statusText}`);
  }

  const payload = await response.json();
  return {
    address: payload.address,
    score: payload.score,
    label: payload.label,
    verdict: payload.verdict,
    reasons: payload.reasons,
    flags: payload.flags,
    analyzedAt: payload.analyzedAt,
    onChainPDA: payload.onChainPDA
  };
}
