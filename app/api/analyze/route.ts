import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { recordLookupAudit } from "@/lib/audit";
import { getClaudeVerdict } from "@/lib/claude";
import { getDegradedWalletSignals, getWalletSignals } from "@/lib/solana";
import type { AnalyzeResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { address?: string; storeOnChain?: boolean };
    const address = body.address?.trim();

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required." }, { status: 400 });
    }

    try {
      new PublicKey(address);
    } catch {
      return NextResponse.json({ error: "Invalid Solana wallet address." }, { status: 400 });
    }

    const data = await getWalletSignals(address).catch((error) =>
      getDegradedWalletSignals(
        address,
        error instanceof Error ? error.message : "Unknown Solana RPC failure."
      )
    );
    const verdict = await getClaudeVerdict(data);
    const auditTrail =
      body.storeOnChain === false
        ? {
            attempted: false,
            status: "skipped" as const,
            reason: "storeOnChain was false for this request."
          }
        : await recordLookupAudit(address, verdict);

    const response: AnalyzeResponse = {
      address,
      score: verdict.score,
      label: verdict.label,
      verdict: verdict.verdict,
      reasons: verdict.reasons,
      flags: verdict.flags,
      analyzedAt: new Date().toISOString(),
      onChainPDA: auditTrail.onChainPDA,
      generatedAt: new Date().toISOString(),
      data,
      ai: verdict,
      auditTrail
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Wallet analysis failed.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
