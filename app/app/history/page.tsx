"use client";

import { motion } from "framer-motion";
import { Nav } from "@/components/nav";

const rows = [
  ["✓", "YIELD_REBALANCE", "Today 09:14", "Moved 1,240 USDC: Kamino → Marginfi", "Reason: Marginfi offering 2.6% higher APY", "LOW RISK · score 8", "TX: 4By7...mK9p ↗", "8xKp...3mNw ↗", "var(--ok)"],
  ["✗", "TOKEN_QUARANTINE", "Yesterday 23:30", "Blocked incoming: SCAM_TOKEN_2024", "Reason: Security check flagged sender as CRITICAL", "CRITICAL · score 91", "Blocked — no TX", "9xMp...7nQr ↗", "var(--danger)"],
  ["✓", "STAKE", "Yesterday 15:45", "Staked 2 SOL via Marinade (7.4% APY)", "Reason: User command — security check passed", "LOW RISK · score 12", "TX: 7Lp4...nR8s ↗", "3xKq...2mNw ↗", "var(--ok)"]
];

export default function AppHistory() {
  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-sf-t1">Action history</h1>
            <div className="font-code mt-2 text-[11px] text-sf-t3">47 actions · 0.047 USDC in security checks</div>
          </div>
          <div className="flex gap-2">{["All", "Approved", "Blocked", "Pending"].map((f) => <button key={f} className="font-code rounded-full border border-[color:var(--border)] px-3 py-1.5 text-[11px] text-sf-t2">{f}</button>)}</div>
        </div>
        <div className="mt-6 space-y-3">
          {rows.map(([icon, type, time, desc, reason, verdict, tx, pda, color], index) => (
            <motion.div key={type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="card border-l-2 p-4" style={{ borderLeftColor: color }}>
              <div className="grid gap-4 md:grid-cols-[220px_1fr_260px]">
                <div><div className="font-code text-xs" style={{ color }}>{icon} {type}</div><div className="font-code mt-1 text-[10px] text-sf-t3">{time}</div></div>
                <div><div className="text-sm text-sf-t1">{desc}</div><div className="mt-1 text-xs text-sf-t2">{reason}</div></div>
                <div className="font-code text-[10px] text-sf-t3"><div className={color === "var(--danger)" ? "text-sf-danger" : "text-sf-security"}>{verdict} · <span className="text-sf-x402">⚡ 0.001 USDC</span> · {tx}</div><div className="mt-2">Verdict PDA: {pda}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="font-code mt-4 rounded-md border border-[color:var(--border)] bg-sf-surface p-3 text-[11px] text-sf-t3">Total x402 spent: 0.047 USDC · 47 security checks · all verdicts on-chain</div>
      </section>
    </main>
  );
}
