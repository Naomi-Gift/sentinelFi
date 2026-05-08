"use client";

import { motion } from "framer-motion";

const steps = [
  "Fetching on-chain data...",
  "Analyzing transaction patterns...",
  "Running AI security model...",
  "Writing verdict to Solana..."
];

export function LoadingOverlay({ address }: { address: string }) {
  const short = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "pending";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-guard-bg/92 px-4 backdrop-blur-md"
    >
      <div className="absolute inset-0 scan-grid" />
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-guard-cyan/18 to-transparent"
        animate={{ y: ["-20vh", "110vh"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative w-full max-w-xl rounded-lg border border-guard-border bg-guard-surface/95 p-7 shadow-cyan">
        <div className="mb-6 font-mono text-sm uppercase tracking-[0.24em] text-guard-cyan">
          Scanning: {short}
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center gap-3 font-mono text-sm text-guard-text"
              animate={{ opacity: [0.35, 1, 0.55] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.28 }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-guard-cyan shadow-[0_0_16px_rgba(0,229,255,0.8)]" />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
