import type { RiskLabel, WalletSignals, WalletVerdict } from "@/lib/types";

export function labelFromScore(score: number): RiskLabel {
  if (score >= 85) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
}

export function riskColor(label: RiskLabel) {
  const colors: Record<RiskLabel, string> = {
    LOW: "#00FF87",
    MEDIUM: "#FFB300",
    HIGH: "#FF6B35",
    CRITICAL: "#FF2D55"
  };

  return colors[label];
}

export function localRiskVerdict(signals: WalletSignals): WalletVerdict {
  let score = 18;
  const reasons: string[] = [];
  const flags: string[] = [];

  if (signals.directlyFlagged) {
    score += 72;
    flags.push("known-threat");
    reasons.push("The wallet address appears directly in the local threat intelligence list.");
  }

  if (signals.flaggedInteractions.length > 0) {
    score += 55;
    flags.push("scam-interaction");
    reasons.push("Recent transactions touched addresses in the local threat list.");
  }

  if (signals.collectionWarnings.some((warning) => warning.includes("Live RPC collection failed"))) {
    score += 25;
    flags.push("incomplete-data");
    reasons.push("Live chain data was unavailable, so this verdict should be treated as provisional.");
  }

  if (signals.walletAgeDays !== null && signals.walletAgeDays < 7) {
    score += 22;
    flags.push("new-wallet");
    reasons.push("The wallet is less than a week old, which raises counterparty risk.");
  } else if (signals.walletAgeDays !== null && signals.walletAgeDays > 365) {
    score -= 6;
    reasons.push("The wallet has a long transaction history on mainnet.");
  }

  if (signals.recentActivityDaysAgo !== null && signals.recentActivityDaysAgo > 240) {
    score += 18;
    flags.push("dead-wallet");
    reasons.push("The wallet has not shown recent activity, which may indicate abandonment.");
  }

  if (signals.transactionCount < 3) {
    score += 15;
    flags.push("sparse-history");
    reasons.push("There are too few transactions to establish a reliable behavior pattern.");
  }

  if (signals.nonZeroTokenAccountCount > 12) {
    score += 8;
    reasons.push("The wallet holds many active token accounts, increasing review complexity.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = labelFromScore(score);

  const defaultReasons = [
    "No known scam interactions were found in the sampled transaction window.",
    "Recent activity and token account signals do not show extreme anomalies.",
    "Risk score is based on wallet age, activity cadence, holdings, and flagged interactions."
  ];

  const verdict =
    label === "LOW"
      ? "This wallet appears low risk based on its sampled Solana activity."
      : label === "MEDIUM"
        ? "This wallet has mixed signals and should be reviewed before interaction."
        : label === "HIGH"
          ? "This wallet shows elevated risk signals that deserve manual investigation."
          : "This wallet shows critical risk signals and should not be trusted without deep review.";

  return {
    score,
    label,
    verdict,
    reasons: [...reasons, ...defaultReasons].slice(0, 3),
    flags
  };
}
