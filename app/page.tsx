"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { WalletLaunchButton } from "@/components/wallet-connect";

const stats = [
  ["24/7", "portfolio watch"],
  ["0.001", "USDC security check"],
  ["4", "security modules"]
];

const traceRows = [
  {
    n: "01",
    color: "var(--primary)",
    title: "Command received",
    body: "Stake 2 SOL safely",
    meta: "Wallet connected · policy loaded"
  },
  {
    n: "02",
    color: "var(--x402)",
    title: "Security check paid",
    body: "0.001 USDC via x402",
    meta: "Fresh risk intelligence requested"
  },
  {
    n: "03",
    color: "var(--security)",
    title: "Risk verdict returned",
    body: "LOW RISK · score 12/100",
    meta: "Verdict stored on-chain"
  },
  {
    n: "04",
    color: "var(--ok)",
    title: "Action ready",
    body: "Approve stake · receipt attached",
    meta: "Action history updated"
  }
];

const flow = [
  ["01", "Connect", "Link your Solana wallet and let SentinelFi read the portfolio context.", "var(--primary)"],
  ["02", "Command", "Ask the agent to stake, rebalance, protect, or explain a position.", "var(--primary)"],
  ["03", "Check", "Every target is screened before the agent recommends an action.", "var(--security)"],
  ["04", "Approve", "Review the recommendation and approve only what fits your policy.", "var(--ok)"]
];

const modules = [
  ["Policy", "Your limits control what the agent can do."],
  ["Security", "Risk checks run before sensitive actions."],
  ["History", "Every recommendation stays reviewable."],
  ["Portfolio", "Positions and opportunities stay organized."]
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <main className="page-shell text-sf-t1">
      <Nav />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-10 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_440px] lg:items-start lg:gap-20 xl:grid-cols-[minmax(0,0.95fr)_460px]">
        <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.45 }}>
          <div className="font-code inline-flex items-center gap-2 rounded-full border border-sf-primary/25 bg-sf-primary/10 px-3 py-2 text-[11px] uppercase tracking-[0.1em] text-sf-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-sf-ok" />
            Autonomous portfolio protection
          </div>
          <h1 className="font-display mt-8 max-w-[700px] text-[42px] font-extrabold leading-[1.02] text-sf-t1 md:text-[58px] xl:text-[62px]">
            An AI Solana agent that checks every action before it moves money.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-sf-t2">
            SentinelFi monitors your portfolio, screens risky actions before they happen, and gives you one clear place to approve, block, or review every move.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WalletLaunchButton />
            <Link
              href="/app/history"
              className="font-code inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-sf-surface/60 px-5 text-[11px] font-medium uppercase tracking-[0.1em] text-sf-t1 transition hover:border-sf-security/40 hover:text-sf-security"
            >
              View history
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {stats.map(([value, label], index) => (
              <motion.div
                key={label}
                variants={fade}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.08 * (index + 1) }}
                className="card p-4"
              >
                <div className="font-display text-3xl font-extrabold text-sf-t1">{value}</div>
                <div className="font-code mt-2 text-[10px] uppercase tracking-[0.1em] text-sf-t3">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="card self-start overflow-hidden lg:mt-8"
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-sf-raised/35 p-4">
            <div>
              <div className="font-code text-[10px] uppercase tracking-[0.14em] text-sf-t3">Execution trace</div>
              <div className="mt-1 text-sm text-sf-t2">Stake request with risk gate enabled</div>
            </div>
            <div className="font-code rounded-full border border-sf-ok/25 bg-sf-ok/10 px-2.5 py-1 text-[10px] uppercase text-sf-ok">Live</div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {traceRows.map((row, index) => (
                <motion.div
                  key={row.n}
                  variants={fade}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.08 * (index + 2) }}
                  className="flex gap-3 rounded-lg border border-[color:var(--border)] bg-sf-deep/80 p-3"
                >
                  <div
                    className="font-code grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px]"
                    style={{ borderColor: row.color, color: row.color }}
                  >
                    {row.n}
                  </div>
                  <div>
                    <div className="font-display text-[15px] font-bold text-sf-t1">{row.title}</div>
                    <div className="mt-1 text-sm text-sf-t2">{row.body}</div>
                    <div className="font-code mt-1 text-[11px] text-sf-t3">{row.meta}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-[color:var(--border)] p-4 md:flex-row md:items-center md:justify-between">
            <div className="font-code inline-flex items-center gap-2 rounded-full border border-sf-x402/25 bg-sf-x402/10 px-3 py-2 text-[11px] text-sf-x402">
              <Zap className="h-4 w-4" />
              x402 · 0.001 USDC paid
            </div>
            <div className="font-code text-[11px] text-sf-t3">
              history updated
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fade}
        className="mx-auto max-w-7xl px-4 py-12 md:px-8"
      >
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="metric-label">How it works</div>
            <h2 className="font-display mt-3 text-3xl font-bold text-sf-t1">A safer path from intent to action.</h2>
          </div>
          <p className="hidden max-w-md text-sm leading-6 text-sf-t2 md:block">
            SentinelFi keeps security in the same flow as portfolio action, so protection is not a separate task.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {flow.map(([n, title, copy, color], index) => (
            <motion.div
              key={title}
              variants={fade}
              transition={{ delay: 0.08 * index }}
              className="card border-t-2 p-5"
              style={{ borderTopColor: color }}
            >
              <div className="font-code text-xs" style={{ color }}>{n}</div>
              <h3 className="font-display mt-4 text-xl font-bold text-sf-t1">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-sf-t2">{copy}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fade}
        className="mx-auto max-w-7xl px-4 py-10 md:px-8"
      >
        <div className="card p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="metric-label">Product surface</div>
              <h2 className="font-display mt-2 text-2xl font-bold text-sf-t1">Everything a portfolio agent needs to stay accountable.</h2>
            </div>
            <Link href="/app/history" className="font-code inline-flex w-fit items-center gap-2 rounded-full border border-sf-primary/35 px-4 py-2 text-[11px] uppercase tracking-[0.1em] text-sf-primary transition hover:bg-sf-primary hover:text-sf-void">
              View history <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {modules.map(([name, copy], index) => (
              <div key={name} className="rounded-xl border border-[color:var(--border)] bg-sf-deep/70 p-4">
                <div className="flex items-center gap-2">
                  {index === 0 ? <ShieldCheck className="h-4 w-4 text-sf-security" /> : <CheckCircle2 className="h-4 w-4 text-sf-ok" />}
                  <div className="font-display text-base font-bold text-sf-t1">{name}</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-sf-t2">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-[color:var(--border)]">
        <div className="font-code mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-sf-t2 md:flex-row md:items-center md:justify-between md:px-8">
          <div>SentinelFi · Autonomous DeFi security on Solana</div>
          <div><span className="text-sf-ok">●</span> Protected session</div>
        </div>
      </footer>
    </main>
  );
}
