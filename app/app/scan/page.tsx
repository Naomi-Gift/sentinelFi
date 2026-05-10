"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown, Loader2, Search, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/nav";
import type { AnalyzeResponse, RiskLabel } from "@/lib/types";

const presets = [
  {
    label: "Known flagged wallet",
    address: "Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRPU1S9oVrPJpi"
  },
  {
    label: "Clean system account",
    address: "11111111111111111111111111111111"
  }
];

const labelTone: Record<RiskLabel, { color: string; bg: string; icon: React.ReactNode }> = {
  LOW: { color: "var(--ok)", bg: "bg-sf-ok/10", icon: <CheckCircle2 className="h-4 w-4" /> },
  MEDIUM: { color: "var(--warn)", bg: "bg-sf-warn/10", icon: <AlertTriangle className="h-4 w-4" /> },
  HIGH: { color: "var(--danger)", bg: "bg-sf-danger/10", icon: <XCircle className="h-4 w-4" /> },
  CRITICAL: { color: "var(--critical)", bg: "bg-sf-danger/10", icon: <XCircle className="h-4 w-4" /> }
};

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function Gauge({ score, label }: { score: number; label: RiskLabel }) {
  const value = useMotionValue(0);
  const rounded = useTransform(value, Math.round);
  const c = 314;
  const tone = labelTone[label];

  useEffect(() => {
    const controls = animate(value, score, { duration: 0.5, ease: "easeOut" });
    return controls.stop;
  }, [score, value]);

  return (
    <div className="relative grid min-h-[280px] place-items-center">
      <svg className="h-60 w-60 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,180,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={tone.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.div className="font-display text-7xl font-extrabold" style={{ color: tone.color }}>
          {rounded}
        </motion.div>
        <div className={`font-code mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px]`} style={{ color: tone.color }}>
          {tone.icon}
          {label} RISK
        </div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  const [open, setOpen] = useState(true);
  const [address, setAddress] = useState(presets[0].address);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeResult =
    result ??
    ({
      address: presets[0].address,
      score: 74,
      label: "HIGH",
      verdict: "This wallet interacted with known threat intelligence and should be blocked before any agent action.",
      reasons: [
        "The wallet appears directly in the local threat intelligence list.",
        "Risk score is based on wallet age, activity cadence, holdings, and flagged interactions.",
        "SentinelFi would quarantine this route instead of executing."
      ],
      flags: ["known-threat", "agent-blocked"],
      onChainPDA: "8xKp...3mNw",
      analyzedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      data: {
        address: presets[0].address,
        rpcEndpoint: "solana-mainnet",
        transactionCount: 0,
        walletAgeDays: null,
        firstTransactionAt: null,
        lastTransactionAt: null,
        recentActivityDaysAgo: null,
        tokenAccountCount: 0,
        nonZeroTokenAccountCount: 0,
        flaggedInteractions: [],
        directlyFlagged: true,
        knownFlaggedAddressesChecked: 6,
        sampledTransactionCount: 0,
        collectionWarnings: ["Demo result. Run scan for a live verdict."]
      },
      ai: {
        score: 74,
        label: "HIGH",
        verdict: "This wallet interacted with known threat intelligence and should be blocked before any agent action.",
        reasons: [],
        flags: []
      },
      auditTrail: { attempted: true, status: "recorded", onChainPDA: "8xKp...3mNw" }
    } satisfies AnalyzeResponse);
  const tone = labelTone[activeResult.label];
  const json = useMemo(
    () =>
      JSON.stringify(
        {
          address: activeResult.address,
          score: activeResult.score,
          label: activeResult.label,
          verdict: activeResult.verdict,
          flags: activeResult.flags,
          x402: { protocol: "x402", usdc: 0.001 },
          verdictPDA: activeResult.onChainPDA ?? activeResult.auditTrail.onChainPDA ?? "pending-local-audit"
        },
        null,
        2
      ),
    [activeResult]
  );

  async function runScan(nextAddress = address) {
    setAddress(nextAddress);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: nextAddress })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? payload.error ?? "Scan failed.");
      setResult(payload);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-sf-t1">Security scan</h1>
        <p className="mt-3 text-sm text-sf-t2">Check any Solana wallet or contract before interacting.</p>
        <div className="font-code mt-2 text-[11px] text-sf-t3">Built-in feature · 0.001 USDC per scan via x402</div>
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sf-t2" />
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void runScan();
              }}
              placeholder="Enter any Solana wallet or contract address..."
              className="h-12 w-full rounded-md border border-[color:var(--border)] bg-sf-surface pl-11 pr-4 text-sm outline-none focus:border-sf-security focus:shadow-[0_0_0_2px_rgba(0,229,204,0.25)]"
            />
          </div>
          <button
            onClick={() => void runScan()}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sf-security px-6 text-sm font-medium text-sf-void disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Scan
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.address}
              onClick={() => void runScan(preset.address)}
              className="font-code rounded-md border border-[color:var(--border)] bg-sf-surface px-3 py-2 text-[11px] text-sf-t2 hover:border-sf-security/40 hover:text-sf-security"
            >
              {preset.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="mt-4 rounded-md border border-sf-danger/30 bg-sf-danger/10 p-3 text-sm text-sf-danger">
            {error}
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mt-8 overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-[color:var(--border)] p-5 lg:border-b-0 lg:border-r">
              <Gauge score={activeResult.score} label={activeResult.label} />
            </div>
            <div className="p-5">
              <div className="font-code text-[10px] uppercase text-sf-t3">verdict</div>
              <p className="mt-4 text-[15px] text-sf-t1">{activeResult.verdict}</p>
              <div className="font-code mt-3 text-[10px] text-sf-t3">ADDRESS: {shortAddress(activeResult.address)}</div>
              <div className="font-code mt-5 text-[10px] uppercase text-sf-t3">why:</div>
              <ul className="mt-3 space-y-2 text-sm text-sf-t2">
                {activeResult.reasons.map((reason) => (
                  <li key={reason}>- {reason}</li>
                ))}
              </ul>
              <div className="font-code mt-4 text-[10px] text-sf-t3">
                SAMPLED TXS: {activeResult.data.sampledTransactionCount} · KNOWN LIST CHECKED: {activeResult.data.knownFlaggedAddressesChecked}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(activeResult.flags.length ? activeResult.flags : ["no-critical-flags"]).map((flag) => (
                  <span key={flag} className={`font-code rounded-full px-2.5 py-1 text-[10px] ${tone.bg}`} style={{ color: tone.color }}>
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="font-code border-t border-sf-x402/40 bg-sf-x402/10 p-4 text-[11px] text-sf-x402">⚡ Paid via x402 · 0.001 USDC · TX: 9Xm2...pQ1r [Explorer ↗]</div>
          <div className="font-code border-t border-sf-security/40 bg-sf-security/10 p-4 text-[11px] text-sf-security">
            ✓ Verdict on-chain · PDA: {activeResult.onChainPDA ?? activeResult.auditTrail.onChainPDA ?? "pending-local-audit"} [Explorer ↗]
          </div>
          <div className="p-5">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-md border border-[color:var(--border)] bg-sf-deep px-4 py-3 font-code text-xs text-sf-t2">
              SDK panel <ChevronDown className={`h-4 w-4 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="mt-3">
                <pre className="overflow-auto rounded-lg border border-[color:var(--border)] bg-sf-void p-4 font-code text-xs text-sf-t2">
                  <code>{json}</code>
                </pre>
                <div className="font-code mt-3 text-[11px] text-sf-t3">npm install sentinelfi-sdk</div>
                <p className="mt-2 text-[11px] text-sf-t2">This check runs automatically inside every SentinelFi agent action.</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
