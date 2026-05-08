"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Nav } from "@/components/nav";
import type { WatchEvent } from "@/lib/types";

function short(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function WatchPage() {
  const [address, setAddress] = useState("");
  const [watching, setWatching] = useState("");
  const [events, setEvents] = useState<WatchEvent[]>([]);
  const timer = useRef<number | null>(null);
  const lastScore = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  async function poll(target: string) {
    const response = await fetch("/api/watch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address: target, lastScore: lastScore.current })
    });
    const payload = await response.json();
    if (payload.verdict?.score !== undefined) lastScore.current = payload.verdict.score;
    setEvents((current) => [...payload.events, ...current].slice(0, 12));
  }

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = address.trim();
    if (!target) return;
    if (timer.current) window.clearInterval(timer.current);
    setWatching(target);
    setEvents([]);
    lastScore.current = null;
    poll(target);
    timer.current = window.setInterval(() => poll(target), 30_000);
  }

  return (
    <main className="scan-grid min-h-screen">
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <div className="rounded-lg border border-guard-border bg-guard-surface/95 p-5 shadow-cyan md:p-7">
          <div className="border-b border-guard-border pb-5">
            <h1 className="font-mono text-3xl font-black uppercase text-white">Wallet Watcher</h1>
            <p className="mt-2 text-guard-muted">Get alerted when a wallet&apos;s risk changes.</p>
          </div>
          <form onSubmit={start} className="mt-6 flex flex-col gap-3 md:flex-row">
            <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter wallet address..." className="h-14 flex-1 rounded-md border border-guard-border bg-[#080B10] px-4 font-mono text-sm text-white outline-none focus:border-guard-cyan" />
            <button className="h-14 rounded-md bg-guard-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#031014]">Start Watch</button>
          </form>
          {watching && (
            <div className="mt-6 flex items-center gap-3 font-mono text-sm text-guard-low">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-guard-low shadow-[0_0_16px_rgba(0,255,135,0.8)]" />
              LIVE Watching: {short(watching)}
            </div>
          )}
          <div className="mt-6 min-h-72 rounded-md border border-guard-border bg-[#080B10]/80 p-4">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div key={`${event.timestamp}-${event.message}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-b border-guard-border py-3 font-mono text-sm text-guard-text last:border-0">
                  <span className="text-guard-muted">[{new Date(event.timestamp).toLocaleTimeString()}]</span>{" "}
                  <span>{event.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {events.length === 0 && <div className="font-mono text-sm text-guard-muted">Watcher events will appear here.</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
