"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Nav } from "@/components/nav";

const suggestions = ["Daily briefing", "Best yield now", "Exit risky positions", "Scan a wallet"];

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl flex-1 gap-4 px-4 pb-4 md:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-[color:var(--border)] pr-4">
          <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">portfolio score</div>
          <div className="font-display mt-3 text-5xl font-extrabold text-sf-t1">74</div>
          <div className="mt-1 text-sm text-sf-ok">▲ +3 today</div>
          <div className="mt-5 space-y-3">
            <div className="card p-3"><div className="font-display text-lg font-bold text-sf-x402">0.047 USDC</div><div className="text-[11px] text-sf-t3">x402 spent today · 47 checks</div></div>
            <div className="card p-3"><div className="font-display text-lg font-bold text-sf-t1">4</div><div className="text-[11px] text-sf-t3">Anchor programs on-chain</div></div>
          </div>
          <div className="font-code mt-6 text-[11px] uppercase tracking-[0.12em] text-sf-t3">Recent commands</div>
          <div className="mt-3 space-y-2 font-code text-[11px] text-sf-t3">
            <div>Stake 2 SOL safely</div>
            <div>What is my best yield?</div>
            <div>Exit risky positions</div>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div className="flex-1 space-y-6 overflow-auto p-2">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="ml-auto max-w-xl rounded-lg border border-[color:var(--border)] bg-sf-raised p-4 text-sm text-sf-t1">
              Stake 2 SOL, but check if the contract is safe first.
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex max-w-2xl gap-3">
              <div className="grid h-7 w-7 shrink-0 place-items-center bg-sf-primary text-xs text-sf-void [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]">A</div>
              <div className="space-y-3">
                <p className="text-[13px] text-sf-t2">Running security check on Marinade staking contract...</p>
                <div className="font-code text-[11px] text-sf-x402">⚡ Paying 0.001 USDC via x402 · risk intelligence</div>
                <div className="h-px bg-[color:var(--border)]" />
                <div className="font-code text-[10px] text-sf-security">✓ Security check passed</div>
                <p className="text-[13px] text-sf-t2">Marinade · LOW RISK · score 12/100</p>
                <p className="text-[13px] text-sf-t2">Active, well-known protocol with consistent usage.</p>
                <div className="h-px bg-[color:var(--border)]" />
                <p className="text-[13px] text-sf-t1">Safe to proceed. Staking 2 SOL via Marinade at 7.4% APY.</p>
                <div className="flex gap-2">
                  <button className="rounded-md bg-sf-ok px-3 py-2 text-xs text-sf-void">✓ Approve</button>
                  <button className="rounded-md border border-[color:var(--border)] px-3 py-2 text-xs text-sf-t2">Cancel</button>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="flex max-w-2xl gap-3">
              <div className="grid h-7 w-7 shrink-0 place-items-center bg-sf-primary text-xs text-sf-void [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]">A</div>
              <div>
                <div className="font-code text-[10px] text-sf-ok">✓ Transaction confirmed · Solana devnet</div>
                <p className="mt-2 text-xs text-sf-t2">Staked 2 SOL · Marinade · 7.4% APY</p>
                <div className="font-code mt-3 flex gap-4 text-[11px] text-sf-primary"><a>View transaction ↗</a><a>View action ledger ↗</a></div>
              </div>
            </motion.div>
          </div>
          <div className="border-t border-[color:var(--border)] bg-sf-surface p-4">
            <div className="mb-3 flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} className="font-code rounded-full border border-[color:var(--border)] px-3 py-1.5 text-[11px] text-sf-t3">{item}</button>)}</div>
            <div className="flex gap-3">
              <input placeholder="Stake SOL..." className="h-12 flex-1 rounded-md border border-[color:var(--border)] bg-sf-surface px-4 text-[13px] outline-none focus:border-[color:var(--border-hot)] focus:shadow-[0_0_0_2px_rgba(0,180,255,0.25)]" />
              <button className="grid h-12 w-12 place-items-center rounded-md bg-sf-primary text-sf-void"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
