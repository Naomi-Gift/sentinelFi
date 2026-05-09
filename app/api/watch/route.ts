import { NextResponse } from "next/server";
import type { AnalyzeResponse, WatchEvent } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { address, lastScore } = (await request.json()) as {
    address?: string;
    lastScore?: number | null;
  };

  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const response = await fetch(`${origin}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ address, storeOnChain: false })
  });
  const text = await response.text();
  let verdict: AnalyzeResponse;

  try {
    verdict = JSON.parse(text) as AnalyzeResponse;
  } catch {
    return NextResponse.json(
      { error: "Analyze endpoint returned a non-JSON response.", detail: text.slice(0, 180) },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(verdict, { status: response.status });
  }

  const events: WatchEvent[] = [];
  if (typeof lastScore === "number" && verdict.score !== lastScore) {
    events.push({
      address,
      eventType: "risk-change",
      message: `Risk score ${verdict.score > lastScore ? "increased" : "decreased"}: ${lastScore} → ${verdict.score}`,
      timestamp: new Date().toISOString(),
      newVerdict: verdict
    });
  } else {
    events.push({
      address,
      eventType: "new-transaction",
      message: "No changes detected",
      timestamp: new Date().toISOString(),
      newVerdict: verdict
    });
  }

  if (verdict.flags.includes("scam-interaction") || verdict.flags.includes("Interacted with known flagged address")) {
    events.unshift({
      address,
      eventType: "flagged-interaction",
      message: "Flagged interaction detected",
      timestamp: new Date().toISOString(),
      newVerdict: verdict
    });
  }

  return NextResponse.json({ verdict, events });
}
