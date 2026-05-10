"use client";

import Link from "next/link";

export function Nav() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
      <Link href="/" className="font-display flex items-center gap-2 text-xl font-extrabold tracking-[0.02em] text-sf-t1">
        <span className="h-2 w-2 rounded-full bg-sf-primary" />
        <span>◈</span>
        SentinelFi
      </Link>

      <nav className="font-code hidden items-center gap-5 text-xs uppercase tracking-[0.12em] text-sf-t2 md:flex">
        <Link className="transition hover:text-sf-primary" href="/app">
          App
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/chat">
          Chat
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/history">
          History
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/policy">
          Policy
        </Link>
        <Link className="transition hover:text-sf-primary" href="/app/scan">
          Scan
        </Link>
        <Link className="transition hover:text-sf-primary" href="/docs">
          Docs
        </Link>
      </nav>

      <div className="font-code hidden items-center gap-3 text-xs uppercase tracking-[0.12em] md:flex">
        <span className="rounded-full border border-sf-ok/25 bg-sf-ok/10 px-3 py-1.5 text-sf-ok">
          ● Agent active
        </span>
        <span className="text-sf-t2">devnet</span>
        <Link href="/app" className="rounded-md border border-sf-primary/40 px-3 py-1.5 text-sf-primary">
          Launch App
        </Link>
      </div>
    </header>
  );
}
