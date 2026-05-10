"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Send, Zap } from "lucide-react";
import { Nav } from "@/components/nav";

const suggestions = ["Daily briefing", "Best yield now", "Exit risky positions", "Scan wallet"];
const quickLinks = [
  ["Chat with agent", "/app/chat"],
  ["View history", "/app/history"],
  ["Edit policy", "/app/policy"],
  ["Security scan", "/app/scan"]
];
const positions = [
  ["SOL", "Wallet", "12.4 SOL", "$2,294", "✓ CLEAR", "var(--primary)", "var(--ok)"],
  ["USDC", "Kamino", "1,240 USDC", "4.2%", "✓ CLEAR", "var(--primary)", "var(--ok)"],
  ["LP", "Raydium", "$850.00", "IL 68%", "⚠ WATCH", "var(--x402)", "var(--warn)"],
  ["mSOL", "Marinade", "4.2 SOL", "7.4%", "✓ CLEAR", "#F97316", "var(--ok)"]
];
const trace = [
  ["✓", "Policy loaded", "max 1 SOL · x402 limit 0.001 USDC", "var(--primary)"],
  ["⚡", "x402 payment sent", "0.001 USDC · risk intelligence", "var(--x402)"],
  ["✓", "Verdict received", "LOW RISK · score 12 · PDA stored", "var(--security)"],
  ["!", "Awaiting approval", "Stake 2 SOL · Marinade", "var(--warn)"]
];

function Count({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, Math.round);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease: "easeOut" });
    return controls.stop;
  }, [mv, value]);
  return <motion.div className={className}>{rounded}</motion.div>;
}

export default function AppDashboard() {
  const [command, setCommand] = useState("Stake 2 SOL only if security check passes.");
  const [running, setRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<"idle" | "complete" | "error">("idle");
  const [runMessage, setRunMessage] = useState("");

  async function runAgent() {
    setRunning(true);
    setRunStatus("idle");
    setRunMessage("Running policy, x402, and security check...");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userMessage: command })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? payload.error ?? "Agent run failed.");
      setRunStatus("complete");
      setRunMessage(payload.briefing ?? "Agent run complete. Security check attached to recommendation.");
    } catch (error) {
      setRunStatus("error");
      setRunMessage(error instanceof Error ? error.message : "Agent run failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-5 md:px-8 lg:grid-cols-[220px_1fr_240px]">
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border-r border-[color:var(--border)] pr-4">
          <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">portfolio score</div>
          <Count value={74} className="font-display mt-3 text-5xl font-extrabold text-sf-t1" />
          <div className="mt-1 text-sm text-sf-ok">▲ +3 today</div>
          <div className="font-code mt-1 text-[10px] uppercase tracking-[0.14em] text-sf-t3">portfolio health</div>

          <div className="mt-6 space-y-3">
            {[
              ["0.047 USDC", "x402 spent today · 47 checks", "text-sf-x402"],
              ["4", "Anchor programs on-chain", "text-sf-t1"],
              ["ACTIVE", "approval mode · policy set", "text-sf-ok"]
            ].map(([value, detail, tone]) => (
              <div key={detail} className="card p-3">
                <div className={`font-display text-lg font-bold ${tone}`}>{value}</div>
                <div className="mt-1 text-[11px] text-sf-t3">{detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="block text-xs text-sf-t2 hover:text-sf-t1">
                → {label}
              </Link>
            ))}
          </div>
        </motion.aside>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="border-r border-[color:var(--border)] px-4">
          <section className="card p-4">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">agent command</div>
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="h-12 flex-1 rounded-md border border-[color:var(--border)] bg-sf-surface px-4 text-[13px] text-sf-t1 outline-none focus:border-[color:var(--border-hot)] focus:shadow-[0_0_0_2px_rgba(0,180,255,0.25)]"
              />
              <button
                onClick={runAgent}
                disabled={running}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sf-primary px-5 text-[13px] font-medium text-sf-void disabled:cursor-not-allowed disabled:opacity-60"
              >
                {running ? "Running..." : "Run Agent"} <Send className="h-4 w-4" />
              </button>
            </div>
            {runMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 rounded-md border p-3 text-xs ${
                  runStatus === "error"
                    ? "border-sf-danger/30 bg-sf-danger/10 text-sf-danger"
                    : runStatus === "complete"
                      ? "border-sf-ok/30 bg-sf-ok/10 text-sf-ok"
                      : "border-sf-primary/30 bg-sf-primary/10 text-sf-primary"
                }`}
              >
                {runMessage}
              </motion.div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item} className="font-code rounded-full border border-[color:var(--border)] bg-sf-surface px-3 py-1.5 text-[11px] text-sf-t3">
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="card mt-4 p-4">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">positions</div>
            <div className="mt-3 space-y-2">
              {positions.map(([name, protocol, amount, metric, badge, iconColor, badgeColor], index) => (
                <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="grid items-center gap-3 rounded-md border border-[color:var(--border)] bg-sf-deep p-3 md:grid-cols-[1fr_auto_auto]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[30px] w-[30px] place-items-center rounded-lg font-code text-[10px] text-sf-void" style={{ background: iconColor }}>{name.slice(0, 2)}</div>
                    <div>
                      <div className="text-[13px] text-sf-t1">{name}</div>
                      <div className="text-[11px] text-sf-t3">{protocol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[13px] font-bold text-sf-t1">{amount}</div>
                    {name === "LP" ? (
                      <div className="mt-1">
                        <div className="font-code text-[10px] text-sf-warn">{metric}</div>
                        <div className="mt-1 h-[3px] w-24 bg-sf-surface"><div className="h-full w-[68%] bg-sf-warn" /></div>
                      </div>
                    ) : (
                      <div className="font-code text-[10px] text-sf-t3">{metric}</div>
                    )}
                  </div>
                  <div className="font-code text-[10px] uppercase tracking-[0.12em]" style={{ color: badgeColor }}>{badge}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-sf-x402/10 p-3">
              <div className="text-[11px] text-sf-t3">Security checks powered by built-in risk engine</div>
              <div className="font-code text-[10px] text-sf-x402">⚡ 0.004 USDC spent · 4 checks</div>
            </div>
          </section>
        </motion.main>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="space-y-4">
          <section className="card p-4">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">security trace</div>
            <div className="mt-4 space-y-3">
              {trace.map(([icon, title, body, color]) => (
                <div key={title} className="flex gap-3">
                  <div className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border font-code text-[9px]" style={{ borderColor: color, color }}>{icon}</div>
                  <div>
                    <div className="text-xs text-sf-t1">{title}</div>
                    <div className="font-code mt-1 text-[9px] text-sf-t3">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-sf-warn/15 bg-sf-warn/5 p-4">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-sf-warn" />
              <div>
                <div className="text-sm text-sf-t1">LP approaching exit threshold</div>
                <p className="mt-1 text-[11px] text-sf-t2">SOL-USDC at 68% IL · policy exits at 70%</p>
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-[color:var(--border)] border-l-2 border-l-sf-ok bg-sf-surface p-4">
            <div className="font-code text-[10px] text-sf-ok">✓ STAKE · within policy</div>
            <p className="mt-3 text-xs leading-5 text-sf-t1">Stake 2 SOL via Marinade (7.4% APY). Security check passed — LOW RISK.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-md bg-sf-ok px-3 py-2 text-[11px] text-sf-void">Approve</button>
              <button className="rounded-md border border-[color:var(--border)] px-3 py-2 text-[11px] text-sf-t3">Dismiss</button>
            </div>
          </section>
          <section className="card p-4">
            <div className="font-code text-[10px] uppercase tracking-[0.16em] text-sf-t3">yield opportunity</div>
            <div className="mt-3 text-[13px] font-medium text-sf-t1">Marginfi USDC</div>
            <div className="mt-1 text-[11px] text-sf-t3">▲ +2.6% vs current Kamino position</div>
            <div className="font-display mt-3 text-xl font-bold text-sf-ok">6.8% <span className="font-code text-[10px] text-sf-t3">APY</span></div>
          </section>
        </motion.aside>
      </section>
    </main>
  );
}
