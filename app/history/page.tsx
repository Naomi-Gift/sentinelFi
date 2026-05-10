"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Nav } from "@/components/nav";

const rows = [
  ["YIELD_REBALANCE", "Kamino → Marginfi", "LOW · 18/100", "0.001 USDC", "8xKp...3mNw", "2 min ago"],
  ["STAKE", "2 SOL · Marinade", "LOW · 12/100", "0.001 USDC", "6QrT...9xLm", "12 min ago"],
  ["TOKEN_QUARANTINE", "Unknown airdrop token", "CRITICAL · 91/100", "0.001 USDC", "3hYa...2kPq", "28 min ago"],
  ["WALLET_CHECK", "Htp9...JJpi", "HIGH · 74/100", "0.001 USDC", "8xKp...3mNw", "41 min ago"]
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-code text-xs uppercase tracking-[0.18em] text-sf-primary">Action history</div>
          <h1 className="font-display mt-4 text-5xl font-extrabold text-sf-t1">Audit trail</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-sf-t2">
            Every SentinelFi action carries the Security Check verdict, x402 receipt, and on-chain reference used at decision time.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card mt-8 overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1.2fr_1fr_0.8fr_1fr_0.8fr] gap-3 border-b border-[color:var(--border)] p-4 font-code text-xs uppercase tracking-[0.12em] text-sf-t3 max-lg:hidden">
            <div>Action</div>
            <div>Target</div>
            <div>Security verdict</div>
            <div>x402</div>
            <div>PDA</div>
            <div>Time</div>
          </div>
          {rows.map(([action, target, verdict, paid, pda, time], index) => (
            <motion.div
              key={`${action}-${time}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index }}
              className="grid gap-3 border-b border-[color:var(--border)] p-4 last:border-b-0 lg:grid-cols-[1.2fr_1.2fr_1fr_0.8fr_1fr_0.8fr]"
            >
              <div className="font-code text-sm text-sf-primary">{action}</div>
              <div className="text-sm text-sf-t1">{target}</div>
              <div className="font-code flex items-center gap-2 text-xs text-sf-secondary">
                <ShieldCheck className="h-4 w-4" />
                {verdict}
              </div>
              <div className="font-code flex items-center gap-2 text-xs text-sf-x402">
                <Zap className="h-4 w-4" />
                {paid}
              </div>
              <div className="font-code text-xs text-sf-t2">{pda}</div>
              <div className="font-code flex items-center gap-2 text-xs text-sf-t2">
                <CheckCircle2 className="h-4 w-4 text-sf-ok" />
                {time}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
