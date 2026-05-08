"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Nav } from "@/components/nav";
import type { AnalyzeResponse, BulkResult } from "@/lib/types";
import { riskColor } from "@/lib/risk";

function truncate(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function BulkPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalyzeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addresses = useMemo(
    () =>
      input
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 20),
    [input]
  );

  const summary = useMemo<BulkResult["summary"]>(
    () => ({
      total: results.length,
      low: results.filter((result) => result.label === "LOW").length,
      medium: results.filter((result) => result.label === "MEDIUM").length,
      high: results.filter((result) => result.label === "HIGH").length,
      critical: results.filter((result) => result.label === "CRITICAL").length
    }),
    [results]
  );

  async function analyzeAll() {
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const collected: AnalyzeResponse[] = [];
      for (let i = 0; i < addresses.length; i += 3) {
        const batch = addresses.slice(i, i + 3);
        const batchResults = await Promise.all(
          batch.map(async (address) => {
            const response = await fetch("/api/analyze", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ address, storeOnChain: false })
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error ?? payload.detail ?? `Failed: ${address}`);
            return payload as AnalyzeResponse;
          })
        );
        collected.push(...batchResults);
        setResults([...collected]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Bulk analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="scan-grid min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="rounded-lg border border-guard-border bg-guard-surface/95 p-5 shadow-cyan md:p-7">
          <div className="border-b border-guard-border pb-5">
            <h1 className="font-mono text-3xl font-black uppercase text-white">Bulk Wallet Analyzer</h1>
            <p className="mt-2 text-guard-muted">Analyze up to 20 wallets at once.</p>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste wallet addresses, one per line..."
            className="mt-6 h-52 w-full resize-none rounded-md border border-guard-border bg-[#080B10] p-4 font-mono text-sm text-white outline-none focus:border-guard-cyan focus:shadow-cyan"
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-guard-muted">{addresses.length}/20 queued</span>
            <button onClick={analyzeAll} disabled={loading || addresses.length === 0} className="h-11 rounded-md bg-guard-cyan px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#031014] disabled:opacity-50">
              {loading ? "Analyzing..." : "Analyze All"}
            </button>
          </div>
          {error && <div className="mt-4 rounded-md border border-guard-critical/50 bg-guard-critical/10 p-3 text-guard-text">{error}</div>}

          {results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <div className="mb-4 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.14em]">
                <span className="rounded-full border border-guard-border px-3 py-2 text-guard-text">Summary</span>
                <span className="text-guard-low">{summary.low} Low</span>
                <span className="text-guard-medium">{summary.medium} Medium</span>
                <span className="text-guard-high">{summary.high} High</span>
                <span className="text-guard-critical">{summary.critical} Critical</span>
              </div>
              <div className="overflow-hidden rounded-md border border-guard-border">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-[#080B10] font-mono text-xs uppercase tracking-[0.14em] text-guard-muted">
                    <tr>
                      <th className="p-4">Address</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Label</th>
                      <th className="p-4">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.address} className="border-t border-guard-border">
                        <td className="p-4 font-mono text-sm text-white">{truncate(result.address)}</td>
                        <td className="p-4 font-mono" style={{ color: riskColor(result.label) }}>{result.score}</td>
                        <td className="p-4 font-mono text-xs font-bold" style={{ color: riskColor(result.label) }}>{result.label}</td>
                        <td className="p-4 text-guard-text">{result.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
