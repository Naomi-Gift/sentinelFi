"use client";

import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Nav } from "@/components/nav";
import { ResultsCard } from "@/components/results-card";
import type { AnalyzeResponse } from "@/lib/types";

export default function AnalyzePage() {
  const params = useParams<{ address: string }>();
  const address = decodeURIComponent(params.address);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function analyze() {
      setError("");
      setResult(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ address, storeOnChain: true })
        });
        const payload = await response.json();

        if (!response.ok) throw new Error(payload.error ?? payload.detail ?? "Analysis failed.");
        if (!cancelled) setResult(payload);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Analysis failed.");
      }
    }

    analyze();
    return () => {
      cancelled = true;
    };
  }, [address]);

  return (
    <main className="scanline scan-grid min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,rgba(8,11,16,0.12),#080B10_92%)]" />
      <Nav />
      <section className="relative z-10 px-4 py-10 md:px-8">
        {error && (
          <div className="mx-auto max-w-3xl rounded-md border border-guard-critical/60 bg-guard-critical/10 p-5 text-guard-text">
            {error}
          </div>
        )}
        {result && <ResultsCard result={result} />}
      </section>
      <AnimatePresence>{!result && !error && <LoadingOverlay address={address} />}</AnimatePresence>
    </main>
  );
}
