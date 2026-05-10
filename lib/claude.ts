import { labelFromScore, localRiskVerdict } from "@/lib/risk";
import type { WalletSignals, WalletVerdict } from "@/lib/types";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

function parseJsonObject(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Claude response did not contain a JSON object.");
  return JSON.parse(match[0]);
}

function normalizeVerdict(candidate: Partial<WalletVerdict>): WalletVerdict {
  const score = Math.max(0, Math.min(100, Math.round(Number(candidate.score ?? 50))));
  const label = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(String(candidate.label))
    ? (candidate.label as WalletVerdict["label"])
    : labelFromScore(score);

  return {
    score,
    label,
    verdict:
      typeof candidate.verdict === "string" && candidate.verdict.length > 0
        ? candidate.verdict
        : "Wallet risk could not be fully determined from the available signals.",
    reasons: Array.isArray(candidate.reasons)
      ? candidate.reasons.filter((reason) => typeof reason === "string").slice(0, 3)
      : ["The analysis returned incomplete reasoning."],
    flags: Array.isArray(candidate.flags)
      ? candidate.flags.filter((flag) => typeof flag === "string").slice(0, 8)
      : []
  };
}

export async function getClaudeVerdict(signals: WalletSignals): Promise<WalletVerdict> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return localRiskVerdict(signals);
  }

  const system = [
    "You are Sentinel Guard, a professional Solana wallet risk analyst.",
    "Return JSON only. No markdown, comments, or surrounding prose.",
    'The JSON schema is: {"score": number, "label": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL", "verdict": string, "reasons": string[], "flags": string[]}.',
    "The verdict must be one plain-English sentence for a non-technical user.",
    "Reasons must be 2 to 3 short bullets. Flags should be concise risk tags."
  ].join(" ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      temperature: 0.1,
      system,
      messages: [
        {
          role: "user",
          content: `Analyze this Solana wallet data and return the required JSON only:\n${JSON.stringify(
            signals,
            null,
            2
          )}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API returned ${response.status}.`);
  }

  const payload = await response.json();
  const text = payload.content
    ?.map((part: { type: string; text?: string }) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();

  if (!text) throw new Error("Claude API returned an empty response.");
  return normalizeVerdict(parseJsonObject(text));
}
