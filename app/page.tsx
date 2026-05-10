"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Nav } from "@/components/nav";

const stats = [
  ["4", "Anchor programs"],
  ["0.001", "USDC per check"],
  ["x402", "Payment protocol"]
];

const traceRows = [
  {
    n: "01",
    color: "var(--primary)",
    title: "User intent received",
    body: "Stake 2 SOL via Marinade safely",
    meta: "Sentinel Agent · policy loaded"
  },
  {
    n: "02",
    color: "var(--x402)",
    title: "x402 payment sent",
    body: "0.001 USDC → risk intelligence API",
    meta: "HTTP 402 → paid → retry"
  },
  {
    n: "03",
    color: "var(--security)",
    title: "Risk verdict returned",
    body: "Marinade · LOW RISK · score 12/100",
    meta: "PDA: 8xKp...3mNw · stored on-chain"
  },
  {
    n: "04",
    color: "var(--ok)",
    title: "Action logged",
    body: "Stake approved · x402 receipt attached",
    meta: "Action Ledger PDA · devnet"
  }
];

const loop = [
  ["01", "Command", "User asks SentinelFi to act — stake, swap, rebalance, or protect.", "var(--primary)"],
  ["02", "Security check", "Agent pays 0.001 USDC via x402 for a fresh risk verdict on the target.", "var(--x402)"],
  ["03", "Verdict", "AI scores the target. Result stored as a PDA on Solana devnet.", "var(--security)"],
  ["04", "Action", "Agent acts within policy. Decision + verdict + receipt logged on-chain.", "var(--ok)"]
];

const contracts = [
  ["Verdict Registry", "src/lib.rs", "Stores risk score, label, timestamp, PDA per wallet"],
  ["Agent Policy", "src/agent_policy.rs", "User automation limits and x402 spend cap"],
  ["Action Ledger", "src/action_ledger.rs", "AI action + verdict + x402 receipt on-chain"],
  ["Vault Router", "src/vault_router.rs", "Active DeFi allocations by protocol and APY"]
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[55fr_45fr]">
        <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.45 }}>
          <div className="font-code inline-flex rounded-md border border-[color:var(--border)] bg-sf-primary/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-sf-primary">
            Live on Solana devnet · 4 Anchor programs
          </div>
          <h1 className="font-display mt-8 max-w-4xl text-[44px] font-extrabold leading-[1.05] text-sf-t1 md:text-[56px]">
            Your DeFi portfolio, protected by AI on every move.
          </h1>
          <p className="mt-6 max-w-[420px] text-base leading-[1.7] text-sf-t2">
            SentinelFi is an autonomous agent that acts on your Solana portfolio within rules you set. Before every action, it runs a built-in security check — paying for risk intelligence via x402 and storing the verdict on-chain.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="font-code inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sf-primary px-5 text-xs font-medium uppercase tracking-[0.14em] text-sf-void"
            >
              Launch Agent <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app/scan"
              className="font-code inline-flex h-12 items-center justify-center rounded-md border border-[color:var(--border)] px-5 text-xs font-medium uppercase tracking-[0.14em] text-sf-t1"
            >
              Scan a wallet
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
                <div className="font-code mt-2 text-xs uppercase tracking-[0.12em] text-sf-t2">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="card self-start"
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border)] p-4">
            <div className="font-code text-xs uppercase tracking-[0.14em] text-sf-t2">Live execution trace</div>
            <div className="font-code rounded-full border border-sf-ok/25 bg-sf-ok/10 px-2.5 py-1 text-[10px] uppercase text-sf-ok">LIVE</div>
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
                  className="flex gap-3 rounded-md border border-[color:var(--border)] bg-sf-deep p-3"
                >
                  <div
                    className="font-code grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs"
                    style={{ borderColor: row.color, color: row.color }}
                  >
                    {row.n}
                  </div>
                  <div>
                    <div className="font-display text-base font-bold text-sf-t1">{row.title}</div>
                    <div className="mt-1 text-sm text-sf-t1">{row.body}</div>
                    <div className="font-code mt-1 text-xs text-sf-t2">{row.meta}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-[color:var(--border)] p-4 md:flex-row md:items-center md:justify-between">
            <div className="font-code inline-flex items-center gap-2 rounded-md border border-sf-x402/25 bg-sf-x402/10 px-3 py-2 text-xs text-sf-x402">
              <Zap className="h-4 w-4" />
              x402 · 0.001 USDC paid
            </div>
            <div className="font-code text-xs text-sf-t2">
              Htp9...JJpi — <span className="text-sf-danger">CRITICAL</span> · <span className="text-sf-danger">74</span>
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
        <div className="font-code text-xs uppercase tracking-[0.18em] text-sf-t2">Security loop</div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {loop.map(([n, title, copy, color], index) => (
            <motion.div
              key={title}
              variants={fade}
              transition={{ delay: 0.08 * index }}
              className="card border-t-2 p-5"
              style={{ borderTopColor: color }}
            >
              <div className="font-code text-xs" style={{ color }}>{n}</div>
              <h2 className="font-display mt-4 text-2xl font-bold text-sf-t1">{title}</h2>
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
        className="mx-auto max-w-7xl px-4 py-12 md:px-8"
      >
        <div className="font-code text-xs uppercase tracking-[0.18em] text-sf-t2">Contract surface</div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {contracts.map(([name, file, copy], index) => (
            <motion.div key={name} variants={fade} transition={{ delay: 0.08 * index }} className="card p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sf-primary" />
                <h2 className="font-display text-xl font-bold text-sf-t1">{name}</h2>
              </div>
              <div className="font-code mt-3 text-xs text-sf-t3">{file}</div>
              <p className="mt-4 text-sm leading-6 text-sf-t2">{copy}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <footer className="border-t border-[color:var(--border)]">
        <div className="font-code mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-sf-t2 md:flex-row md:items-center md:justify-between md:px-8">
          <div>SentinelFi · Autonomous DeFi security on Solana</div>
          <div><span className="text-sf-warn">●</span> Solana devnet</div>
        </div>
      </footer>
    </main>
  );
}
