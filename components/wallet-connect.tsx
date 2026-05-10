"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ExternalLink, LogOut, Wallet } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect?: () => Promise<void>;
  on?: (event: string, handler: () => void) => void;
  off?: (event: string, handler: () => void) => void;
};

declare global {
  interface Window {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
  }
}

const WALLET_KEY = "sentinelfi-wallet";
const CHANGE_EVENT = "sentinelfi-wallet-changed";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the best available Solana provider — Phantom preferred. */
function getProvider(): SolanaProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return window.phantom?.solana ?? window.solana;
}

export function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWalletConnection() {
  const [address, setAddress] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const syncState = useCallback(() => {
    const saved = window.localStorage.getItem(WALLET_KEY) ?? "";
    setAddress(saved);
  }, []);

  useEffect(() => {
    syncState();
    setReady(true);

    window.addEventListener(CHANGE_EVENT, syncState);

    const provider = getProvider();

    const handleAccountChange = () => {
      if (!provider?.publicKey) {
        window.localStorage.removeItem(WALLET_KEY);
      } else {
        window.localStorage.setItem(WALLET_KEY, provider.publicKey.toString());
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    };

    provider?.on?.("accountChanged", handleAccountChange);
    provider?.on?.("disconnect", handleAccountChange);

    return () => {
      window.removeEventListener(CHANGE_EVENT, syncState);
      provider?.off?.("accountChanged", handleAccountChange);
      provider?.off?.("disconnect", handleAccountChange);
    };
  }, [syncState]);

  // ── connect ────────────────────────────────────────────────────────────────

  const connect = useCallback(async (): Promise<string> => {
    setError("");
    const provider = getProvider();

    if (!provider) {
      setError("No Solana wallet found. Install Phantom or another Solana wallet extension.");
      return "";
    }

    try {
      const response = await provider.connect();
      const next = response.publicKey.toString();
      window.localStorage.setItem(WALLET_KEY, next);
      setAddress(next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return next;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Wallet connection was cancelled.";
      setError(msg);
      return "";
    }
  }, []);

  // ── disconnect ─────────────────────────────────────────────────────────────

  const disconnect = useCallback(async () => {
    try {
      await getProvider()?.disconnect?.();
    } catch {
      // ignore provider errors
    }
    window.localStorage.removeItem(WALLET_KEY);
    setAddress("");
    setError("");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { address, ready, error, connect, disconnect };
}

// ─── WalletLaunchButton ───────────────────────────────────────────────────────

export function WalletLaunchButton({
  href = "/app",
  className = "",
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const { address, error, connect, disconnect } = useWalletConnection();
  const [busy, setBusy] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Compact nav button — show address + disconnect dropdown when connected
  if (compact) {
    if (address) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className={
              className ||
              "font-code inline-flex items-center gap-1.5 rounded-full border border-sf-primary/35 px-3 py-1.5 text-sf-primary transition hover:bg-sf-primary hover:text-sf-void"
            }
          >
            <Wallet className="h-3.5 w-3.5" />
            {shortAddress(address)}
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-[color:var(--border)] bg-sf-surface p-1 shadow-xl">
                <div className="px-3 py-2 font-code text-[10px] text-sf-t3 uppercase tracking-widest">
                  {shortAddress(address)}
                </div>
                <div className="my-1 h-px bg-[color:var(--border)]" />
                <button
                  onClick={async () => {
                    setShowMenu(false);
                    await disconnect();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-sf-t2 transition hover:bg-sf-raised hover:text-sf-danger"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    // Not connected — compact connect button
    return (
      <button
        onClick={async () => {
          setBusy(true);
          try { await connect(); } finally { setBusy(false); }
        }}
        disabled={busy}
        className={
          className ||
          "font-code inline-flex items-center gap-1.5 rounded-full border border-sf-primary/35 px-3 py-1.5 text-sf-primary transition hover:bg-sf-primary hover:text-sf-void disabled:opacity-60"
        }
      >
        <Wallet className="h-3.5 w-3.5" />
        {busy ? "Connecting..." : "Connect"}
      </button>
    );
  }

  // Full launch button (landing page)
  async function handleLaunch() {
    setBusy(true);
    try {
      const connected = address || (await connect());
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
        {busy
          ? "Connecting..."
          : address
          ? `Open app · ${shortAddress(address)}`
          : "Connect wallet"}
        {!compact && <ArrowRight className="h-4 w-4" />}
      </button>
      {error && (
        <div className="flex max-w-sm flex-col gap-1 text-xs leading-5 text-sf-warn">
          <span>{error}</span>
          {error.includes("No Solana wallet") && (
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sf-primary underline underline-offset-2"
            >
              Get Phantom <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WalletGate ───────────────────────────────────────────────────────────────

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { address, ready, error, connect } = useWalletConnection();
  const [busy, setBusy] = useState(false);

  // Wait for localStorage hydration to avoid flash
  if (!ready) return null;

  if (address) return <>{children}</>;

  async function handleConnect() {
    setBusy(true);
    try {
      await connect();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-sf-primary/30 bg-sf-primary/10 text-sf-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold text-sf-t1">
          Connect your wallet to continue.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sf-t2">
          SentinelFi ties your policy, approvals, security receipts, and action
          history to your Solana wallet. Connect to get started.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleConnect}
            disabled={busy}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sf-primary px-8 text-sm font-medium text-sf-void transition hover:bg-sf-t1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wallet className="h-4 w-4" />
            {busy ? "Connecting..." : "Connect wallet"}
          </button>
          {error && (
            <div className="flex flex-col items-center gap-1 text-sm text-sf-warn">
              <span>{error}</span>
              {error.includes("No Solana wallet") && (
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sf-primary underline underline-offset-2"
                >
                  Install Phantom <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
