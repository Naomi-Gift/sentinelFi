"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Send, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Nav } from "@/components/nav";
import { shortAddress, useWalletConnection, WalletGate } from "@/components/wallet-connect";


const suggestions = ["Stake 2 SOL safely", "Best yield with risk check", "Exit risky positions"];
const metrics = [
  ["Portfolio score", "74", "+3 today", "text-sf-ok"],
  ["Security checks", "47", "0.047 USDC spent", "text-sf-x402"],
  ["Policy", "Active", "Approval required above 1 SOL", "text-sf-ok"],
  ["Security modules", "4", "Policy, checks, history, routing", "text-sf-primary"]
];
const positions = [
  ["SOL", "Wallet", "12.4 SOL", "$2,294", "Clear", "var(--primary)", "var(--ok)"],
  ["USDC", "Kamino", "1,240 USDC", "4.2% APY", "Clear", "var(--primary)", "var(--ok)"],
  ["LP", "Raydium", "$850.00", "68% IL", "Watch", "var(--x402)", "var(--warn)"],
  ["mSOL", "Marinade", "4.2 SOL", "7.4% APY", "Clear", "#f4a261", "var(--ok)"]
];
const trace = [
  ["Policy", "Max auto move: 1 SOL", "var(--primary)"],
  ["Security", "Risk verdict attached", "var(--security)"],
  ["Verdict", "LOW RISK · score 12", "var(--security)"],
  ["Approval", "Stake 2 SOL via Marinade", "var(--warn)"]
];

export default function AppDashboard() {
  const { address } = useWalletConnection();
  const [command, setCommand] = useState("Stake 2 SOL only if security check passes.");
  const [running, setRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<"idle" | "complete" | "error">("idle");
  const [runMessage, setRunMessage] = useState("");

  async function runAgent() {
    setRunning(true);
    setRunStatus("idle");
    setRunMessage("Checking policy, buying a fresh security verdict, and preparing a recommendation...");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userMessage: command })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? payload.error ?? "Agent run failed.");
      setRunStatus("complete");
      setRunMessage(payload.briefing ?? "Recommendation ready. Security verdict attached.");
    } catch (error) {
      setRunStatus("error");
      setRunMessage(error instanceof Error ? error.message : "Agent run failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="page-shell text-sf-t1">
      <Nav />
      <WalletGate>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="metric-label">SentinelFi app</div>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-sf-t1 md:text-5xl">
              Review the next move before money moves.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sf-t2">
              SentinelFi turns a command into a checked recommendation: policy first, security verdict second, approval last.
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-sf-surface/75 p-3">
            <div className="metric-label">Connected wallet</div>
            <div className="font-code mt-2 text-sm text-sf-t1">{shortAddress(address)}</div>
          </div>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card mt-6 overflow-hidden">
          <div className="border-b border-[color:var(--border)] bg-sf-raised/35 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="metric-label">Primary action</div>
                <h2 className="font-display mt-2 text-2xl font-bold text-sf-t1">Stake 2 SOL only if the route is safe.</h2>
                <p className="mt-2 text-sm text-sf-t2">
                  This is the full product loop: command, check, verdict, wallet approval.
                </p>
              </div>
              <div className="font-code inline-flex w-fit items-center gap-2 rounded-full border border-sf-ok/25 bg-sf-ok/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] text-sf-ok">
                <ShieldCheck className="h-3.5 w-3.5" />
                Policy active
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="h-12 flex-1 rounded-xl border border-[color:var(--border)] bg-sf-void/60 px-4 text-sm text-sf-t1 outline-none transition focus:border-[color:var(--border-hot)] focus:shadow-[0_0_0_2px_rgba(100,210,255,0.22)]"
              />
              <button
                onClick={runAgent}
                disabled={running}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sf-primary px-5 text-sm font-medium text-sf-void transition hover:bg-sf-t1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {running ? "Running..." : "Run agent"} <Send className="h-4 w-4" />
              </button>
            </div>
            {runMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 rounded-xl border p-3 text-sm ${
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
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item} className="font-code rounded-full border border-[color:var(--border)] bg-sf-surface/70 px-3 py-1.5 text-[11px] text-sf-t3 transition hover:border-sf-primary/35 hover:text-sf-primary">
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {trace.map(([title, body, color], index) => (
                <div key={title} className="rounded-xl border border-[color:var(--border)] bg-sf-deep/75 p-4">
                  <div className="font-code text-[10px] uppercase tracking-[0.12em]" style={{ color }}>
                    {String(index + 1).padStart(2, "0")} · {title}
                  </div>
                  <div className="mt-2 text-sm text-sf-t1">{body}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="rounded-2xl border border-sf-ok/20 bg-sf-ok/10 p-5">
                <div className="font-code flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-sf-ok">
                  <CheckCircle2 className="h-4 w-4" />
                  Recommendation ready
                </div>
                <p className="mt-3 text-sm leading-6 text-sf-t1">
                  Stake 2 SOL via Marinade at 7.4% APY. The route is LOW RISK, within policy, and ready for wallet approval.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 self-end">
                <button className="rounded-full bg-sf-ok px-3 py-3 text-sm font-medium text-sf-void">Approve</button>
                <button className="rounded-full border border-[color:var(--border)] px-3 py-3 text-sm text-sf-t2">Dismiss</button>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-sf-raised/35 p-5">
              <div>
                <div className="metric-label">Sample portfolio</div>
                <p className="mt-2 text-sm text-sf-t2">Preview data shown until live portfolio indexing is connected.</p>
              </div>
              <Wallet className="h-5 w-5 text-sf-primary" />
            </div>
            <div className="divide-y divide-[color:var(--border)]">
              {positions.map(([name, protocol, amount, metric, badge, iconColor, badgeColor], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + index * 0.05 }}
                  className="grid gap-3 p-4 md:grid-cols-[1fr_120px_100px] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 font-code text-[11px] text-sf-void" style={{ background: iconColor }}>
                      {name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-sf-t1">{name}</div>
                      <div className="text-xs text-sf-t3">{protocol}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-code text-sm text-sf-t1">{amount}</div>
                    <div className="font-code mt-1 text-[11px] text-sf-t3">{metric}</div>
                    {name === "LP" && <div className="mt-2 h-1.5 rounded-full bg-sf-void"><div className="h-full w-[68%] rounded-full bg-sf-warn" /></div>}
                  </div>
                  <div className="font-code w-fit rounded-full border border-[color:var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.1em]" style={{ color: badgeColor }}>
                    {badge}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="m-4 rounded-xl border border-sf-x402/20 bg-sf-x402/10 p-3">
              <div className="font-code text-[11px] text-sf-x402">0.004 USDC spent on security today</div>
              <p className="mt-1 text-xs text-sf-t3">Recent security checks are attached to the positions above.</p>
            </div>
          </motion.section>

          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="space-y-5">
            <section className="card p-5">
              <div className="metric-label">Session summary</div>
              <div className="mt-4 space-y-4">
                {metrics.map(([label, value, detail, tone]) => (
                  <div key={label} className="border-b border-[color:var(--border)] pb-3 last:border-b-0 last:pb-0">
                    <div className="font-code text-[10px] uppercase tracking-[0.12em] text-sf-t3">{label}</div>
                    <div className={`font-display mt-1 text-xl font-bold ${tone}`}>{label === "Portfolio score" ? "74" : value}</div>
                    <div className="mt-1 text-xs text-sf-t3">{detail}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-sf-warn/20 bg-sf-warn/5 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-sf-warn" />
                <div>
                  <div className="text-sm font-medium text-sf-t1">LP approaching exit threshold</div>
                  <p className="mt-1 text-sm leading-6 text-sf-t2">SOL-USDC is at 68% impermanent loss. Your policy exits at 70%.</p>
                </div>
              </div>
            </section>
          </motion.aside>
        </div>
      </section>
      </WalletGate>
    </main>
  );
}
