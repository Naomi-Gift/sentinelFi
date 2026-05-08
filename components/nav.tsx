"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Nav() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
      <Link href="/" className="flex items-center gap-3 font-mono text-lg font-bold tracking-[0.08em] text-white">
        <span className="grid h-9 w-9 place-items-center rounded-md border border-guard-cyan/60 bg-guard-cyan/10 shadow-cyan">
          <ShieldCheck className="h-5 w-5 text-guard-cyan" />
        </span>
        WalletGuard AI
      </Link>

      <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-[0.16em] text-guard-muted md:flex">
        <Link className="transition hover:text-guard-cyan" href="/">
          Analyze
        </Link>
        <Link className="transition hover:text-guard-cyan" href="/bulk">
          Bulk
        </Link>
        <Link className="transition hover:text-guard-cyan" href="/watch">
          Watch
        </Link>
        <a className="transition hover:text-guard-cyan" href="#docs">
          Docs
        </a>
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <span className="rounded-full border border-guard-medium/50 bg-guard-medium/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-guard-medium">
          ● Devnet
        </span>
        <button className="h-10 rounded-md border border-guard-border px-4 font-mono text-xs uppercase tracking-[0.14em] text-guard-text transition hover:border-guard-cyan hover:text-guard-cyan">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
