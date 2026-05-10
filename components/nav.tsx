"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { WalletLaunchButton } from "@/components/wallet-connect";
import { SentinelLogo } from "@/components/logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-sf-void/82 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
      <Link href="/" className="font-display flex items-center gap-2.5 text-lg font-extrabold text-sf-t1">
        <SentinelLogo size={32} />
        <span>SentinelFi</span>
      </Link>

      <nav className="font-code hidden items-center gap-1 rounded-full border border-[color:var(--border)] bg-sf-surface/70 p-1 text-[11px] uppercase tracking-[0.08em] text-sf-t2 md:flex">
        <Link className="transition hover:text-sf-primary" href="/">
          <span className="block rounded-full px-3 py-1.5">Home</span>
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app">
          <span className="block rounded-full px-3 py-1.5">App</span>
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/history">
          <span className="block rounded-full px-3 py-1.5">History</span>
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/policy">
          <span className="block rounded-full px-3 py-1.5">Policy</span>
        </Link>
        <Link className="transition hover:text-sf-primary" href="/docs">
          <span className="block rounded-full px-3 py-1.5">Docs</span>
        </Link>
      </nav>

      <div className="font-code hidden items-center gap-2 text-[11px] uppercase tracking-[0.08em] md:flex">
        <span className="inline-flex items-center gap-2 rounded-full border border-sf-ok/25 bg-sf-ok/10 px-3 py-1.5 text-sf-ok">
          <ShieldCheck className="h-3.5 w-3.5" />
          Protected
        </span>
        <WalletLaunchButton
          compact
          className="inline-flex items-center gap-1.5 rounded-full border border-sf-primary/35 px-3 py-1.5 text-sf-primary transition hover:bg-sf-primary hover:text-sf-void disabled:opacity-60"
        />
      </div>
      </div>
    </header>
  );
}
