"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, DatabaseZap, ExternalLink, Radar, Search, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Nav } from "@/components/nav";

const demoWallets = [
  {
    label: "Known Scammer",
    address: "Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRPU1S9oVrPJpi"
  },
  {
    label: "Dead Wallet",
    address: "3a7zZQjEfgbLz4P7mGLZxgT4WZ2CK8Djq7QULGrn8J2V"
  },
  {
    label: "Clean",
    address: "11111111111111111111111111111111"
  }
];

const stats = [
  { icon: DatabaseZap, label: "On-chain Registry" },
  { icon: Activity, label: "Real-time Data" },
  { icon: Sparkles, label: "AI Verdicts" }
];

export default function Home() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState("");

  function run(addressToAnalyze: string) {
    const trimmed = addressToAnalyze.trim();
    if (!trimmed) return;
    setLoadingAddress(trimmed);
    router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(address);
  }

  return (
    <main className="scanline scan-grid relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,11,16,0.08),#080B10_94%)]" />
      <Nav />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl flex-col items-center justify-center px-4 pb-14 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-guard-border bg-guard-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-guard-cyan">
            <Radar className="h-4 w-4" />
            Devnet Verdict Registry
          </div>
          <h1 className="mx-auto max-w-5xl font-mono text-4xl font-black uppercase leading-tight text-white md:text-7xl">
            Know who you&apos;re dealing with.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-guard-text md:text-xl">
            AI risk verdicts for every Solana wallet. Stored permanently on-chain.
          </p>

          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-full border border-guard-border bg-guard-surface/90 p-3 shadow-cyan backdrop-blur md:flex-row">
            <label className="sr-only" htmlFor="wallet-address">
              Solana wallet address
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-guard-muted" />
              <input
                id="wallet-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter Solana wallet address..."
                className="h-16 w-full rounded-full border border-transparent bg-[#080B10] pl-14 pr-4 font-mono text-sm text-white outline-none transition placeholder:text-guard-muted focus:border-guard-cyan focus:shadow-[0_0_0_2px_#00E5FF,0_0_24px_rgba(0,229,255,0.15)] md:text-base"
              />
            </div>
            <button className="h-16 rounded-full bg-guard-cyan px-8 font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#031014] transition hover:shadow-[0_0_32px_rgba(0,229,255,0.55)]">
              Analyze
            </button>
          </form>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-3">
            {stats.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-guard-border bg-guard-surface/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.13em] text-guard-muted">
                <Icon className="h-3.5 w-3.5 text-guard-cyan" />
                {label}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-guard-muted">
              <span className="h-px flex-1 bg-guard-border" />
              Or try a demo
              <span className="h-px flex-1 bg-guard-border" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {demoWallets.map((demo) => (
                <button
                  key={demo.label}
                  onClick={() => run(demo.address)}
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-guard-border bg-guard-surface/80 px-4 font-mono text-xs uppercase tracking-[0.13em] text-guard-text transition hover:border-guard-cyan hover:text-guard-cyan"
                >
                  {demo.label} <ExternalLink className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      <AnimatePresence>{loadingAddress && <LoadingOverlay address={loadingAddress} />}</AnimatePresence>
    </main>
  );
}
