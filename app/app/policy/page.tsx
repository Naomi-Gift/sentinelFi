"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";

function Row({ title, sub, value, accent = "var(--primary)", toggle }: { title: string; sub: string; value?: string; accent?: string; toggle?: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-4">
        <div><div className="text-[13px] text-sf-t1">{title}</div><div className="mt-1 text-[11px] text-sf-t3">{sub}</div></div>
        {toggle ? <div className="h-6 w-11 rounded-full bg-sf-ok p-1"><div className="ml-auto h-4 w-4 rounded-full bg-sf-void" /></div> : <div className="font-code text-[13px]" style={{ color: accent }}>{value}</div>}
      </div>
      {!toggle && <div className="mt-4 h-1.5 rounded-full bg-sf-deep"><div className="h-full rounded-full" style={{ width: value?.includes("70") ? "70%" : value?.includes("0.001") ? "22%" : "40%", background: accent }} /></div>}
    </div>
  );
}

export default function PolicyPage() {
  const [saved, setSaved] = useState(false);
  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <section className="mx-auto max-w-[640px] px-4 pb-14 pt-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-sf-t1">Agent policy</h1>
        <p className="mt-3 text-sm leading-7 text-sf-t2">Your policy controls when SentinelFi can recommend, pause, or ask for approval.</p>
        <div className="mt-6 space-y-4">
          <Row title="Auto-execution limit" sub="Max SOL agent moves without your approval" value="1.0 SOL" />
          <Row title="Exit LP at impermanent loss" sub="Agent auto-exits liquidity positions at this threshold" value="70%" accent="var(--warn)" />
          <Row title="Security check spend limit" sub="Max USDC per check · current: 0.001 USDC" value="0.001 USDC" accent="var(--x402)" />
          <Row title="Auto yield rebalance" sub="Agent moves funds to highest yield automatically" toggle />
          <Row title="Quarantine flagged tokens" sub="Block incoming tokens flagged by security check" toggle />
        </div>
        <button onClick={() => setSaved(true)} className="mt-5 w-full rounded-md bg-sf-primary px-5 py-3 text-sm font-medium text-sf-void">
          {saved ? "✓ Policy saved on-chain" : "Save policy to Solana"}
        </button>
        <div className="font-code mt-3 text-[10px] text-sf-t3">{saved ? "Policy saved for connected wallet" : "Policy will be tied to your connected wallet"}</div>
      </section>
    </main>
  );
}
