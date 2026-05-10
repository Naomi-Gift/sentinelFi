"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Bot, ChevronDown, Copy, ExternalLink, Terminal, CheckCircle2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { AnalyzeResponse, RiskLabel } from "@/lib/types";
import { riskColor } from "@/lib/risk";

function truncate(address?: string) {
  if (!address) return "Not recorded";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function RiskBadge({ label }: { label: RiskLabel }) {
  const color = riskColor(label);
  return (
    <span className="rounded-full px-4 py-2 font-mono text-xs font-bold text-white" style={{ background: color }}>
      {label} RISK
    </span>
  );
}

function RiskGauge({ score, label }: { score: number; label: RiskLabel }) {
  const color = riskColor(label);
  const value = useMotionValue(0);
  const rounded = useTransform(value, Math.round);
  const circumference = 314;

  useEffect(() => {
    const controls = animate(value, score, { duration: 0.7, ease: "easeOut" });
    return controls.stop;
  }, [score, value]);

  return (
    <div className="relative flex min-h-[320px] flex-col items-center justify-center">
      <svg className="h-72 w-72 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1C2333" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 14px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="font-mono text-8xl font-black leading-none"
          style={{ color, textShadow: `0 0 34px ${color}70` }}
        >
          {rounded}
        </motion.div>
        <div className="mt-6">
          <RiskBadge label={label} />
        </div>
      </div>
    </div>
  );
}

export function ResultsCard({ result }: { result: AnalyzeResponse }) {
  const [apiOpen, setApiOpen] = useState(true);
  const [copied, setCopied] = useState<"address" | "pda" | "json" | "sdk" | null>(null);
  const color = riskColor(result.label);
  const json = useMemo(() => JSON.stringify(result, null, 2), [result]);
  const sdkSnippet = `import { analyzeWallet } from "walletguard-sdk";\n\nconst verdict = await analyzeWallet("${result.address}");\nconsole.log(verdict.score, verdict.label);`;
  const explorer = result.onChainPDA
    ? `https://explorer.solana.com/address/${result.onChainPDA}?cluster=devnet`
    : undefined;

  async function copy(value: string, key: NonNullable<typeof copied>) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1100);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-6xl rounded-lg border border-guard-border bg-guard-surface/95 shadow-cyan"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-guard-border p-5 md:flex-row md:items-center">
        <div className="font-mono text-xl text-white">{truncate(result.address)}</div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => copy(result.address, "address")} className="inline-flex h-10 items-center gap-2 rounded-md border border-guard-border px-3 font-mono text-xs uppercase tracking-[0.14em] text-guard-text hover:border-guard-cyan hover:text-guard-cyan">
            <Copy className="h-4 w-4" /> {copied === "address" ? "Copied" : "Copy"}
          </button>
          <a href="/" className="inline-flex h-10 items-center rounded-md bg-guard-cyan px-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#031014]">
            Scan Another
          </a>
        </div>
      </div>

      <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
        <RiskGauge score={result.score} label={result.label} />
        <div>
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.34em] text-guard-cyan">Verdict</div>
          <p className="text-2xl font-semibold leading-tight text-white md:text-4xl">{result.verdict}</p>
          <div className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-guard-muted">Why</div>
          <div className="mt-4 space-y-3">
            {result.reasons.map((reason, index) => (
              <motion.div
                key={reason}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 rounded-md border border-guard-border bg-[#080B10]/70 p-4"
              >
                <span className="mt-1 text-guard-cyan">→</span>
                <span>{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-guard-border p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-guard-muted">Flags</div>
        <div className="flex flex-wrap gap-3">
          {(result.flags.length ? result.flags : ["clean"]).map((flag) => (
            <motion.span
              key={flag}
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={clsx(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em]",
                result.label === "CRITICAL" && "animate-pulse"
              )}
              style={{ borderColor: `${color}70`, color, background: `${color}10` }}
            >
              {flag}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="border-t border-[#A855F7]/35 bg-[#A855F7]/10 p-5"
      >
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-[#D8B4FE]">
            <Zap className="h-5 w-5" />
            <span className="font-mono text-sm uppercase tracking-[0.16em]">
              x402-ready paid intelligence
            </span>
          </div>
          <div className="font-mono text-xs text-guard-text">
            0.001 USDC per check · consumed automatically by Sentinel Agent
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="border-t border-guard-border bg-guard-low/8 p-5"
      >
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-guard-low">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-mono text-sm uppercase tracking-[0.16em]">
              {result.auditTrail.status === "recorded" ? "Verdict stored on-chain" : "Verdict registry PDA ready"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-guard-text">
            <span>PDA: {truncate(result.onChainPDA)}</span>
            {result.onChainPDA && (
              <button onClick={() => copy(result.onChainPDA!, "pda")} className="text-guard-cyan">
                {copied === "pda" ? "Copied" : "Copy"}
              </button>
            )}
            {explorer && (
              <a href={explorer} target="_blank" className="inline-flex items-center gap-1 text-guard-cyan">
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <div className="border-t border-guard-border p-5">
        <button onClick={() => setApiOpen((open) => !open)} className="flex w-full items-center justify-between rounded-md border border-guard-border bg-[#080B10]/80 px-4 py-4 text-left">
          <span className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.18em] text-guard-text">
            <Terminal className="h-4 w-4 text-guard-cyan" /> SDK / API Response
          </span>
          <ChevronDown className={clsx("h-4 w-4 transition", apiOpen && "rotate-180")} />
        </button>
        <AnimatePresence initial={false}>
          {apiOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 rounded-md border border-guard-border bg-[#05070A]">
                <div className="flex flex-col justify-between gap-3 border-b border-guard-border px-4 py-3 md:flex-row md:items-center">
                  <code className="font-mono text-xs text-guard-cyan">npm install walletguard-sdk</code>
                  <div className="flex gap-2">
                    <button onClick={() => copy(sdkSnippet, "sdk")} className="rounded-md border border-guard-border px-3 py-2 font-mono text-xs uppercase text-guard-text hover:border-guard-cyan hover:text-guard-cyan">
                      {copied === "sdk" ? "Copied" : "Copy SDK"}
                    </button>
                    <button onClick={() => copy(json, "json")} className="rounded-md border border-guard-border px-3 py-2 font-mono text-xs uppercase text-guard-text hover:border-guard-cyan hover:text-guard-cyan">
                      {copied === "json" ? "Copied" : "Copy JSON"}
                    </button>
                  </div>
                </div>
                <pre className="terminal-scrollbar max-h-[430px] overflow-auto p-4 text-xs leading-relaxed text-guard-text">
                  <code>{json}</code>
                </pre>
              </div>
              <a
                href="/app"
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-md border border-guard-cyan/50 px-4 font-mono text-xs uppercase tracking-[0.14em] text-guard-cyan transition hover:bg-guard-cyan hover:text-[#031014]"
              >
                <Bot className="h-4 w-4" />
                Use inside Sentinel Agent
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
