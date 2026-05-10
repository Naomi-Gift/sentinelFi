"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, Wallet } from "lucide-react";

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

const PREVIEW_WALLET = "SentinelPreview111111111111111111111111111111";
const WALLET_KEY = "sentinelfi-wallet";
const MODE_KEY = "sentinelfi-wallet-mode";
const CHANGE_EVENT = "sentinelfi-wallet-changed";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the best available Solana provider (Phantom preferred). */
function getProvider(): SolanaProvider | undefined {
  if (typeof window === "undefined") return undefined;
  // Phantom injects under window.phantom.solana in newer versions
  return window.phantom?.solana ?? window.solana;
}

export function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWalletConnection() {
  const [address, setAddress] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  // ready = hydration complete (localStorage has been read)
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  // Sync state from localStorage — called on mount and on custom change event
  const syncState = useCallback(() => {
    const saved = window.localStorage.getItem(WALLET_KEY) ?? "";
    const mode = window.localStorage.getItem(MODE_KEY) ?? "";
    setAddress(saved);
    setIsPreview(mode === "preview");
  }, []);

  useEffect(() => {
    syncState();
    setReady(true);

    window.addEventListener(CHANGE_EVENT, syncState);

    // Also sync when the wallet extension fires an accountChanged event
    const provider = getProvider();
    const handleAccountChange = () => {
      // If the extension disconnected or switched accounts, clear state
      if (!provider?.publicKey) {
        window.localStorage.removeItem(WALLET_KEY);
        window.localStorage.removeItem(MODE_KEY);
      } else {
        const next = provider.publicKey.toString();
        window.localStorage.setItem(WALLET_KEY, next);
        window.localStorage.setItem(MODE_KEY, "wallet");
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
      return connectPreview();
    }

    try {
      const response = await provider.connect();
      const next = response.publicKey.toString();
      window.localStorage.setItem(WALLET_KEY, next);
      window.localStorage.setItem(MODE_KEY, "wallet");
      setAddress(next);
      setIsPreview(false);
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return next;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Wallet connection was cancelled.";
      setError(msg);
      return "";
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── connectPreview ─────────────────────────────────────────────────────────

  const connectPreview = useCallback((): string => {
    window.localStorage.setItem(WALLET_KEY, PREVIEW_WALLET);
    window.localStorage.setItem(MODE_KEY, "preview");
    setAddress(PREVIEW_WALLET);
    setIsPreview(true);
    setError("");
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return PREVIEW_WALLET;
  }, []);

  // ── disconnect ─────────────────────────────────────────────────────────────

  const disconnect = useCallback(async () => {
    try {
      await getProvider()?.disconnect?.();
    } catch {
      // ignore provider errors on disconnect
    }
    window.localStorage.removeItem(WALLET_KEY);
    window.localStorage.removeItem(MODE_KEY);
    setAddress("");
    setIsPreview(false);
    setError("");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { address, ready, error, isPreview, connect, connectPreview, disconnect };
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
  const { address, error, isPreview, connect, disconnect } = useWalletConnection();
  const [busy, setBusy] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // If already connected and compact (nav button), show address + disconnect menu
  if (address && compact) {
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
          {isPreview ? "Preview" : shortAddress(address)}
        </button>
        {showMenu && (
          <>
            {/* backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-xl border border-[color:var(--border)] bg-sf-surface p-1 shadow-xl">
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
          ? `Open app · ${isPreview ? "preview" : shortAddress(address)}`
          : "Connect wallet"}
        {!compact && <ArrowRight className="h-4 w-4" />}
      </button>
      {error && !compact && (
        <div className="max-w-sm text-xs leading-5 text-sf-warn">{error}</div>
      )}
    </div>
  );
}

// ─── WalletGate ───────────────────────────────────────────────────────────────

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

  // Don't render anything until localStorage has been read (avoids flash)
  if (!ready) return null;

  if (address) return <>{children}</>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-sf-primary/30 bg-sf-primary/10 text-sf-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold text-sf-t1">
          Connect your wallet to launch SentinelFi.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-sf-t2">
          SentinelFi uses your wallet to tie policy settings, approvals, security
          receipts, and transactions to the right Solana account. If this browser
          does not expose a wallet extension, you can open a read-only preview.
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
        {error && (
          <div className="mx-auto mt-4 max-w-md text-sm leading-6 text-sf-warn">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
