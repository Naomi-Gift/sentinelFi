"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeWallet = analyzeWallet;
const API_BASE = process.env.WALLETGUARD_API_URL || "https://walletguard.ai/api";
async function analyzeWallet(address, options) {
    const response = await fetch(`${options?.apiBase ?? API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, storeOnChain: options?.storeOnChain ?? true })
    });
    if (!response.ok) {
        throw new Error(`WalletGuard analysis failed: ${response.statusText}`);
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
