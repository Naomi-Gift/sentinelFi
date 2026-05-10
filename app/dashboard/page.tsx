"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2, ChevronDown, Copy, ExternalLink, Radar, Search, ShieldCheck, Terminal, Zap } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";

const presets = [
  ["Known Scammer", "Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRPU1S9oVrPJpi"],
  ["Dead Wallet", "3a7zZQjEfgbLz4P7mGLZxgT4WZ2CK8Djq7QULGrn8J2V"],
  ["Clean Wallet", "11111111111111111111111111111111"]
];

const result = {
  address: "Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRPU1S9oVrPJpi",
  score: 74,
  label: "HIGH RISK",
  verdict: "This wallet interacted with flagged contracts and shows a pattern consistent with scam routing.",
  reasons: [
    "Recent transactions touched addresses in the local threat list.",
    "The wallet has sparse legitimate history for its age.",
    "Token account behavior matches airdrop-scam interaction patterns."
  ],
  flags: ["scam-interaction", "dead-wallet", "sparse-history"]
};

function RiskGauge() {
  const score = useMotionValue(0);
  const rounded = useTransform(score, Math.round);
  const circumference = 314;

  useEffect(() => {
    const controls = animate(score, result.score, { duration: 0.5, ease: "easeOut" });
    return controls.stop;
  }, [score]);

  return (
    <div className="relative grid min-h-[300px] place-items-center">
      <svg className="h-64 w-64 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,180,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--danger)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (result.score / 100) * circumference }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <motion.div className="font-display text-7xl font-extrabold text-sf-danger">{rounded}</motion.div>
          <div className="font-code mt-3 inline-flex rounded-full border border-sf-danger/25 bg-sf-danger/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-sf-danger">
            {result.label}
          </div>
        </div>
      </div>
    </div>
  );
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function GuardDashboard() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [sdkOpen, setSdkOpen] = useState(true);
  const json = useMemo(
    () =>
      JSON.stringify(
        {
          address: result.address,
          score: result.score,
          label: "HIGH",
          verdict: result.verdict,
          payment: { protocol: "x402", usdc: 0.001, tx: "9Xm2...pQ1r" },
          verdictPDA: "8xKp...3mNw"
        },
        null,
        2
      ),
    []
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = address.trim();
    if (trimmed) router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8">
        <motion.div initial="hidden" animate="show" variants={fade} className="text-center">
          <h1 className="font-display text-5xl font-extrabold leading-tight text-sf-secondary md:text-6xl">
            Know who you&apos;re dealing with.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-sf-t2">
            AI risk verdicts for every Solana wallet. Paid per-request via x402. Stored on-chain.
          </p>

          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sf-t2" />
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter Solana wallet address..."
                className="focus-guard h-14 w-full rounded-md border border-[color:var(--border)] bg-sf-surface pl-12 pr-4 font-mono text-sm text-sf-t1 outline-none placeholder:text-sf-t3"
              />
            </div>
            <button className="font-code h-14 rounded-md bg-sf-secondary px-7 text-xs font-medium uppercase tracking-[0.14em] text-sf-void">
              Analyze →
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["On-chain Registry", "x402 per query", "Plain English verdict"].map((item, index) => (
              <div key={item} className="font-code rounded-full border border-[color:var(--border)] bg-sf-surface px-3 py-2 text-xs uppercase tracking-[0.12em] text-sf-t2">
                {index === 0 ? "⬡" : index === 1 ? "⚡" : "🤖"} {item}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {presets.map(([label, value]) => (
              <button
                key={label}
                onClick={() => setAddress(value)}
                className="font-code rounded-md border border-[color:var(--border)] bg-sf-deep px-3 py-2 text-xs uppercase tracking-[0.12em] text-sf-t2 hover:border-[color:var(--border-hot)] hover:text-sf-secondary"
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card mt-10 overflow-hidden"
        >
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-[color:var(--border)] p-6 lg:border-b-0 lg:border-r">
              <RiskGauge />
            </div>
            <div className="p-6">
              <div className="font-code text-xs uppercase tracking-[0.18em] text-sf-secondary">VERDICT</div>
              <p className="mt-4 text-lg leading-8 text-sf-t1">{result.verdict}</p>
              <div className="font-code mt-8 text-xs uppercase tracking-[0.18em] text-sf-t2">WHY:</div>
              <div className="mt-4 space-y-3">
                {result.reasons.map((reason, index) => (
                  <motion.div
                    key={reason}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index }}
                    className="flex gap-3 rounded-md border border-[color:var(--border)] bg-sf-deep p-3 text-sm text-sf-t2"
                  >
                    <span className="text-sf-secondary">•</span>
                    {reason}
                  </motion.div>
                ))}
              </div>
              <div className="font-code mt-5 text-xs uppercase tracking-[0.14em] text-sf-t1">CONFIDENCE: HIGH</div>
            </div>
          </div>

          <div className="border-t border-[color:var(--border)] p-5">
            <div className="flex flex-wrap gap-2">
              {result.flags.map((flag) => (
                <span key={flag} className="font-code rounded-full border border-sf-danger/25 bg-sf-danger/10 px-3 py-1.5 text-xs text-sf-danger">
                  {flag}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="font-code border-t border-[color:var(--border)] bg-sf-x402/10 p-4 text-xs uppercase tracking-[0.12em] text-sf-x402"
          >
            ⚡ PAID VIA X402 · 0.001 USDC · TX: 9Xm2...pQ1r <span className="text-sf-t2">[Explorer ↗]</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="font-code border-t border-[color:var(--border)] bg-sf-secondary/10 p-4 text-xs uppercase tracking-[0.12em] text-sf-secondary"
          >
            ✓ VERDICT ON-CHAIN · PDA: 8xKp...3mNw [⎘] <span className="text-sf-t2">[Explorer ↗]</span>
          </motion.div>

          <div className="border-t border-[color:var(--border)] p-5">
            <button
              onClick={() => setSdkOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-md border border-[color:var(--border)] bg-sf-deep px-4 py-3 text-left"
            >
              <span className="font-code flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-sf-t2">
                <Terminal className="h-4 w-4 text-sf-secondary" />
                SDK / API response
              </span>
              <ChevronDown className={`h-4 w-4 transition ${sdkOpen ? "rotate-180" : ""}`} />
            </button>
            {sdkOpen && (
              <div className="mt-4">
                <pre className="terminal-scrollbar max-h-80 overflow-auto rounded-md border border-[color:var(--border)] bg-sf-deep p-4 font-mono text-xs leading-6 text-sf-t2">
                  <code>{json}</code>
                </pre>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="font-code text-xs text-sf-t2">npm install solanaguard-sdk</div>
                  <div className="flex gap-2">
                    <button className="font-code inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] px-3 py-2 text-xs uppercase text-sf-t2">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                    <Link href="/app" className="font-code inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] px-3 py-2 text-xs uppercase text-sf-primary">
                      Used by Sentinel Agent <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </section>
    </main>
  );
}
