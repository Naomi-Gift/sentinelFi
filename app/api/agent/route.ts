import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { defaultPositions, type AgentPosition, type AgentResponse } from "@/lib/agent";
import { getClaudeVerdict } from "@/lib/claude";
import { getDegradedWalletSignals, getWalletSignals } from "@/lib/solana";
import { recordLookupAudit } from "@/lib/audit";
import type { AnalyzeResponse } from "@/lib/types";
import { createLocalX402Receipt } from "@/lib/x402";

export const runtime = "nodejs";

async function runSecurityCheck(address: string): Promise<AnalyzeResponse> {
  new PublicKey(address);

  const data = await getWalletSignals(address).catch((error) =>
    getDegradedWalletSignals(
      address,
      error instanceof Error ? error.message : "Unknown Solana RPC failure."
    )
  );
  const verdict = await getClaudeVerdict(data);
  const auditTrail = await recordLookupAudit(address, verdict);

  return {
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
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      userMessage?: string;
      portfolio?: { positions?: AgentPosition[] };
      policy?: { walletguardCheck?: boolean; maxX402UsdcPerAction?: number; autoExecute?: boolean };
    };

    const positions = body.portfolio?.positions?.length ? body.portfolio.positions : defaultPositions;
    const securityCheckEnabled = body.policy?.walletguardCheck ?? true;
    const maxX402Usdc = body.policy?.maxX402UsdcPerAction ?? 0.001;
    const checkedWallets: AgentResponse["checkedWallets"] = [];

    if (securityCheckEnabled) {
      for (const position of positions) {
        const receipt = createLocalX402Receipt(`/api/analyze/${position.targetAddress}`, 0.001);
        if (receipt.amountUsdc > maxX402Usdc) {
          throw new Error(`Policy allows ${maxX402Usdc} USDC per check, Security Check requires ${receipt.amountUsdc}.`);
        }

        const verdict = await runSecurityCheck(position.targetAddress);
        checkedWallets.push({
          address: position.targetAddress,
          verdict,
          receipt,
          blocked: verdict.label === "HIGH" || verdict.label === "CRITICAL"
        });
      }
    }

    const blocked = checkedWallets.find((item) => item.blocked);
    const clean = checkedWallets.find((item) => !item.blocked);
    const totalSpent = checkedWallets.reduce((sum, item) => sum + item.receipt.amountUsdc, 0);

    const action =
      blocked !== undefined
        ? {
            type: "TOKEN_QUARANTINE" as const,
            description: "Block the requested route and quarantine the risky counterparty.",
            reason: `Security Check marked ${blocked.address} as ${blocked.verdict.label} risk.`,
            targetProtocol: positions.find((position) => position.targetAddress === blocked.address)?.protocol ?? null,
            targetWallet: blocked.address,
            requiresApproval: false,
            withinPolicy: true,
            walletguardVerdict: {
              score: blocked.verdict.score,
              label: blocked.verdict.label,
              blocked: true,
              verdictPDA: blocked.verdict.onChainPDA,
              x402PaidUsdc: blocked.receipt.amountUsdc
            }
          }
        : {
            type: "STAKE" as const,
            description: "Proceed with the requested staking route after Security Check cleared the target.",
            reason: body.userMessage ?? "Routine autonomous portfolio check found a safe staking action.",
            targetProtocol: clean ? positions.find((position) => position.targetAddress === clean.address)?.protocol ?? null : null,
            targetWallet: clean?.address ?? null,
            requiresApproval: true,
            withinPolicy: true,
            walletguardVerdict: clean
              ? {
                  score: clean.verdict.score,
                  label: clean.verdict.label,
                  blocked: false,
                  verdictPDA: clean.verdict.onChainPDA,
                  x402PaidUsdc: clean.receipt.amountUsdc
                }
              : null
          };

    const actionLedger =
      checkedWallets.length > 0
        ? {
            id: `ledger-${Date.now()}`,
            actionType: action.type,
            walletguardScore: action.walletguardVerdict?.score ?? 0,
            walletguardLabel: action.walletguardVerdict?.label ?? "LOW",
            walletguardVerdictPda: action.walletguardVerdict?.verdictPDA,
            x402PaymentSig: checkedWallets[0].receipt.txSignature,
            timestamp: new Date().toISOString()
          }
        : null;

    const response: AgentResponse = {
      briefing: blocked
        ? "Security Check blocked one autonomous action. SentinelFi will not route funds to the flagged counterparty."
        : "Portfolio check complete. SentinelFi paid for security intelligence via x402 and found a safe action candidate.",
      alerts: blocked
        ? [
            {
              severity: "CRITICAL",
              message: `${blocked.verdict.label} risk target blocked before execution.`,
              actionRequired: false
            }
          ]
        : [
            {
              severity: "INFO",
              message: "Security Check cleared the requested route before execution.",
              actionRequired: true
            }
          ],
      recommendedActions: [action],
      portfolioScore: blocked ? Math.max(20, 100 - blocked.verdict.score) : 84,
      x402TotalSpentUsdc: Number(totalSpent.toFixed(6)),
      checkedWallets,
      actionLedger
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Sentinel Agent analysis failed.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
