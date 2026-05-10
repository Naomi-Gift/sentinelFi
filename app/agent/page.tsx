"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { AlertTriangle, CheckCircle2, CircleDollarSign, Send, ShieldCheck, Zap } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Nav } from "@/components/nav";

const suggestions = ["Daily briefing", "Best yield now", "Exit risky positions", "Scan my wallet"];

const positions = [
  { icon: "SOL", color: "var(--primary)", name: "SOL", protocol: "Wallet", amount: "12.4 SOL", right: "liquid", badge: "✓ CLEAR", tone: "var(--ok)" },
  { icon: "US", color: "var(--primary)", name: "USDC", protocol: "Kamino", amount: "1,240 USDC", right: "4.2% APY", badge: "✓ CLEAR", tone: "var(--ok)" },
  { icon: "LP", color: "var(--x402)", name: "SOL-USDC LP", protocol: "Raydium", amount: "$850.00", right: "IL 68%", badge: "⚠ WATCH", tone: "var(--warn)" },
  { icon: "mS", color: "#F97316", name: "mSOL", protocol: "Marinade", amount: "4.2 SOL", right: "7.4% APY", badge: "✓ CLEAR", tone: "var(--ok)" }
];

const trace = [
  ["✓", "Policy loaded", "max 1 SOL · x402 limit 0.001 USDC", "var(--primary)"],
  ["⚡", "x402 payment sent", "0.001 USDC · risk intelligence", "var(--x402)"],
  ["✓", "Verdict received", "LOW RISK · score 12 · PDA derived", "var(--ok)"],
  ["!", "Awaiting approval", "Stake 2 SOL · Marinade", "var(--warn)"]
];

function CountScore({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, Math.round);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.5, ease: "easeOut" });
    return controls.stop;
  }, [motionValue, value]);

  return <motion.div className="font-display text-7xl font-extrabold leading-none text-sf-t1">{rounded}</motion.div>;
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function AgentPage() {
  const [command, setCommand] = useState("Stake 2 SOL only if Security Check clears the route.");
  const [ran, setRan] = useState(false);

  function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRan(true);
  }

  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-5 md:px-8 lg:grid-cols-[220px_1fr_240px]">
        <motion.aside initial="hidden" animate="show" variants={fade} className="space-y-4">
          <div className="card p-5">
            <div className="font-code text-xs uppercase tracking-[0.14em] text-sf-t3">portfolio health</div>
            <div className="mt-4"><CountScore value={74} /></div>
            <div className="mt-2 text-sm text-sf-ok">▲ +3 today</div>
          </div>
          {[
            ["x402 spent", "0.047 USDC", "47 checks today", "text-sf-x402"],
            ["Programs", "4", "Anchor modules on-chain", "text-sf-t1"],
            ["Policy", "ACTIVE", "approval mode · policy set", "text-sf-ok"]
          ].map(([label, value, detail, tone]) => (
            <div key={label} className="card p-4">
              <div className="font-code text-xs uppercase tracking-[0.14em] text-sf-t3">{label}</div>
              <div className={`font-display mt-3 text-2xl font-bold ${tone}`}>{value}</div>
              <div className="mt-1 text-sm text-sf-t2">{detail}</div>
            </div>
          ))}
        </motion.aside>

        <motion.main initial="hidden" animate="show" variants={fade} transition={{ delay: 0.08 }} className="space-y-4">
          <section className="card p-5">
            <div className="font-code text-xs uppercase tracking-[0.16em] text-sf-primary">Sentinel Agent command</div>
            <form onSubmit={run} className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="h-12 flex-1 rounded-md border border-[color:var(--border)] bg-sf-deep px-4 text-sm text-sf-t1 outline-none focus:border-[color:var(--border-hot)]"
              />
              <button className="font-code inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sf-primary px-5 text-xs font-medium uppercase tracking-[0.14em] text-sf-void">
                Run Agent <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item} className="font-code rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs text-sf-t2 hover:border-[color:var(--border-hot)] hover:text-sf-primary">
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <div className="font-code text-xs uppercase tracking-[0.16em] text-sf-t2">Positions</div>
            <div className="mt-4 space-y-3">
              {positions.map((position, index) => (
                <motion.div
                  key={position.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                  className="grid gap-3 rounded-md border border-[color:var(--border)] bg-sf-deep p-3 md:grid-cols-[1fr_auto_auto]"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-code grid h-10 w-10 place-items-center rounded-md text-xs text-sf-void" style={{ background: position.color }}>
                      {position.icon}
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold text-sf-t1">{position.name}</div>
                      <div className="text-sm text-sf-t2">{position.protocol}</div>
                    </div>
                  </div>
                  <div className="font-code text-left text-sm text-sf-t1 md:text-right">
                    <div>{position.amount}</div>
                    {position.name === "SOL-USDC LP" ? (
                      <div className="mt-2 h-1.5 w-32 rounded-full bg-sf-surface">
                        <div className="h-full w-[68%] rounded-full bg-sf-warn" />
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-sf-t2">{position.right}</div>
                    )}
                  </div>
                  <div className="font-code self-center text-xs uppercase tracking-[0.12em]" style={{ color: position.tone }}>
                    {position.badge}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="font-code mt-4 flex flex-col gap-2 rounded-md border border-[color:var(--border)] bg-sf-secondary/10 p-3 text-xs uppercase tracking-[0.12em] text-sf-secondary md:flex-row md:items-center md:justify-between">
              <span>Security layer · built into every agent action</span>
              <span className="text-sf-x402">⚡ 0.004 USDC spent</span>
            </div>
          </section>
        </motion.main>

        <motion.aside initial="hidden" animate="show" variants={fade} transition={{ delay: 0.16 }} className="space-y-4">
          <section className="card p-4">
            <div className="font-code text-xs uppercase tracking-[0.16em] text-sf-x402">x402 Decision Trace</div>
            <div className="mt-4 space-y-4">
              {trace.map(([icon, title, body, color], index) => (
                <motion.div key={title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }} className="flex gap-3">
                  <div className="font-code grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs" style={{ borderColor: color, color }}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-sf-t1">{title}</div>
                    <div className="font-code mt-1 text-xs text-sf-t2">{body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-sf-warn/25 bg-sf-warn/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-sf-warn" />
              <div>
                <div className="font-display font-bold text-sf-t1">LP approaching exit threshold</div>
                <p className="mt-2 text-sm leading-6 text-sf-t2">SOL-USDC at 68% IL · policy exits at 70%</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-sf-ok/35 bg-sf-surface p-4">
            <div className="font-code inline-flex rounded-full border border-sf-ok/25 bg-sf-ok/10 px-2.5 py-1 text-xs text-sf-ok">
              ✓ STAKE · within policy
            </div>
            <p className="mt-4 text-sm leading-6 text-sf-t2">
              Marinade staking route cleared by Security Check. User approval required before execution.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="font-code rounded-md bg-sf-ok px-3 py-2 text-xs uppercase tracking-[0.12em] text-sf-void">Approve</button>
              <button className="font-code rounded-md border border-[color:var(--border)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-sf-t2">Dismiss</button>
            </div>
          </section>

          <section className="card p-4">
            <div className="font-code text-xs uppercase tracking-[0.16em] text-sf-t2">Yield opportunity</div>
            <div className="mt-3 flex items-center gap-3">
              <CircleDollarSign className="h-5 w-5 text-sf-ok" />
              <div>
                <div className="font-display text-3xl font-extrabold text-sf-ok">6.8% APY</div>
                <div className="text-sm text-sf-t2">Marginfi USDC · ▲ +2.6% vs current</div>
              </div>
            </div>
          </section>
        </motion.aside>
      </section>
    </main>
  );
}
