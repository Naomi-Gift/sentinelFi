"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Wallet } from "lucide-react";

type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect?: () => Promise<void>;
};

const PREVIEW_WALLET = "SentinelPreview111111111111111111111111111111";

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

export function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function useWalletConnection() {
  const [address, setAddress] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function syncWalletState() {
      const saved = window.localStorage.getItem("sentinelfi-wallet");
      const savedMode = window.localStorage.getItem("sentinelfi-wallet-mode");
      setAddress(saved ?? "");
      setIsPreview(savedMode === "preview");
    }

    syncWalletState();
    window.addEventListener("sentinelfi-wallet-changed", syncWalletState);
    setReady(true);
    return () => window.removeEventListener("sentinelfi-wallet-changed", syncWalletState);
  }, []);

  async function connect() {
    setError("");
    if (!window.solana) {
      return connectPreview();
    }

    try {
      const response = await window.solana.connect();
      const nextAddress = response.publicKey.toString();
      window.localStorage.setItem("sentinelfi-wallet", nextAddress);
      window.localStorage.setItem("sentinelfi-wallet-mode", "wallet");
      setAddress(nextAddress);
      setIsPreview(false);
      window.dispatchEvent(new Event("sentinelfi-wallet-changed"));
      return nextAddress;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Wallet connection was cancelled.");
      return "";
    }
  }

  function connectPreview() {
    window.localStorage.setItem("sentinelfi-wallet", PREVIEW_WALLET);
    window.localStorage.setItem("sentinelfi-wallet-mode", "preview");
    setAddress(PREVIEW_WALLET);
    setIsPreview(true);
    setError("");
    window.dispatchEvent(new Event("sentinelfi-wallet-changed"));
    return PREVIEW_WALLET;
  }

  async function disconnect() {
    await window.solana?.disconnect?.();
    window.localStorage.removeItem("sentinelfi-wallet");
    window.localStorage.removeItem("sentinelfi-wallet-mode");
    setAddress("");
    setIsPreview(false);
    window.dispatchEvent(new Event("sentinelfi-wallet-changed"));
  }

  return { address, ready, error, isPreview, connect, connectPreview, disconnect };
}

export function WalletLaunchButton({
  href = "/app",
  className = "",
  compact = false
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const { address, error, isPreview, connect } = useWalletConnection();
  const [busy, setBusy] = useState(false);

  async function handleLaunch() {
    setBusy(true);
    try {
      const connected = address || await connect();
      if (connected) router.push(href);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleLaunch}
        disabled={busy}
        className={
          className ||
          "font-code inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sf-primary px-5 text-[11px] font-medium uppercase tracking-[0.1em] text-sf-void transition hover:bg-sf-t1 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        <Wallet className="h-4 w-4" />
        {busy ? "Connecting..." : address ? (compact ? (isPreview ? "Preview" : shortAddress(address)) : `Open app · ${isPreview ? "preview" : shortAddress(address)}`) : "Connect wallet"}
        {!compact && <ArrowRight className="h-4 w-4" />}
      </button>
      {error && !compact && <div className="max-w-sm text-xs leading-5 text-sf-warn">{error}</div>}
    </div>
  );
}

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { address, ready, error, connect, connectPreview } = useWalletConnection();
  const [busy, setBusy] = useState(false);

  async function handleConnect() {
    setBusy(true);
    try {
      await connect();
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;
  if (address) return <>{children}</>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-sf-primary/30 bg-sf-primary/10 text-sf-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold text-sf-t1">Connect your wallet to launch SentinelFi.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sf-t2">
          SentinelFi uses your wallet to tie policy settings, approvals, security receipts, and transactions to the right Solana account. If this browser does not expose a wallet extension, you can open a read-only preview.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleConnect}
            disabled={busy}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sf-primary px-6 text-sm font-medium text-sf-void transition hover:bg-sf-t1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wallet className="h-4 w-4" />
            {busy ? "Connecting..." : "Connect wallet"}
          </button>
          <button
            onClick={connectPreview}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] px-6 text-sm font-medium text-sf-t2 transition hover:border-sf-primary/35 hover:text-sf-primary"
          >
            Open preview
          </button>
        </div>
        {error && <div className="mx-auto mt-4 max-w-md text-sm leading-6 text-sf-warn">{error}</div>}
      </div>
    </section>
  );
}
