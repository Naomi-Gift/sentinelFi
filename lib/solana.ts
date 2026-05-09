import {
  Connection,
  ParsedAccountData,
  PublicKey,
  type ConfirmedSignatureInfo,
  type ParsedTransactionWithMeta
} from "@solana/web3.js";
import { KNOWN_FLAGGED_ADDRESSES } from "@/lib/flagged-addresses";
import type { WalletSignals } from "@/lib/types";

function rpcUrl() {
  if (process.env.HELIUS_RPC_URL) {
    return process.env.HELIUS_RPC_URL;
  }

  if (process.env.HELIUS_API_KEY) {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" ? "devnet" : "mainnet";
    return `https://${network}.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
  }

  return process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
}

function endpointLabel(): WalletSignals["rpcEndpoint"] {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet" ? "mainnet" : "devnet";
  if (process.env.HELIUS_RPC_URL || process.env.HELIUS_API_KEY) {
    return network === "mainnet" ? "helius-mainnet" : "helius-devnet";
  }

  return network === "mainnet" ? "solana-mainnet" : "solana-devnet";
}

function dateFromBlockTime(blockTime?: number | null) {
  return blockTime ? new Date(blockTime * 1000).toISOString() : null;
}

function daysSince(iso: string | null) {
  if (!iso) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

function accountKeyToString(key: unknown) {
  if (typeof key === "string") return key;
  if (key && typeof key === "object" && "pubkey" in key) {
    const pubkey = (key as { pubkey: PublicKey }).pubkey;
    return pubkey.toBase58();
  }

  return String(key);
}

function extractAccounts(tx: ParsedTransactionWithMeta | null) {
  if (!tx) return [];
  const messageAccounts = tx.transaction.message.accountKeys.map(accountKeyToString);
  const loadedAccounts = tx.meta?.loadedAddresses
    ? [
        ...tx.meta.loadedAddresses.readonly.map((key) => key.toBase58()),
        ...tx.meta.loadedAddresses.writable.map((key) => key.toBase58())
      ]
    : [];

  return [...messageAccounts, ...loadedAccounts];
}

async function fetchSignatures(connection: Connection, publicKey: PublicKey) {
  const signatures: ConfirmedSignatureInfo[] = [];
  let before: string | undefined;

  for (let page = 0; page < 3; page += 1) {
    const batch = await connection.getSignaturesForAddress(publicKey, {
      before,
      limit: 1_000
    });

    signatures.push(...batch);
    if (batch.length < 1_000) break;
    before = batch[batch.length - 1]?.signature;
  }

  return signatures;
}

export async function getWalletSignals(address: string): Promise<WalletSignals> {
  const publicKey = new PublicKey(address);
  const connection = new Connection(rpcUrl(), "confirmed");
  const collectionWarnings: string[] = [];

  const [signatures, tokenAccounts] = await Promise.all([
    fetchSignatures(connection, publicKey),
    connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    })
  ]);

  if (signatures.length >= 3_000) {
    collectionWarnings.push("Transaction count is capped at the latest 3,000 signatures for latency.");
  }

  const firstSignature = signatures[signatures.length - 1];
  const lastSignature = signatures[0];
  const firstTransactionAt = dateFromBlockTime(firstSignature?.blockTime);
  const lastTransactionAt = dateFromBlockTime(lastSignature?.blockTime);

  const recentSignatures = signatures.slice(0, 20).map((signature) => signature.signature);
  const transactions =
    recentSignatures.length > 0
      ? await connection.getParsedTransactions(recentSignatures, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0
        })
      : [];

  const flaggedSet = new Set(KNOWN_FLAGGED_ADDRESSES);
  const flaggedInteractions = Array.from(
    new Set(
      transactions
        .flatMap(extractAccounts)
        .filter((account) => account !== address && flaggedSet.has(account))
    )
  );

  const nonZeroTokenAccountCount = tokenAccounts.value.filter((account) => {
    const parsed = account.account.data as ParsedAccountData;
    const amount = parsed.parsed.info.tokenAmount?.uiAmount ?? 0;
    return amount > 0;
  }).length;

  return {
    address,
    rpcEndpoint: endpointLabel(),
    transactionCount: signatures.length,
    walletAgeDays: daysSince(firstTransactionAt),
    firstTransactionAt,
    lastTransactionAt,
    recentActivityDaysAgo: daysSince(lastTransactionAt),
    tokenAccountCount: tokenAccounts.value.length,
    nonZeroTokenAccountCount,
    flaggedInteractions,
    knownFlaggedAddressesChecked: KNOWN_FLAGGED_ADDRESSES.length,
    sampledTransactionCount: transactions.filter(Boolean).length,
    collectionWarnings
  };
}

export function getDegradedWalletSignals(address: string, reason: string): WalletSignals {
  return {
    address,
    rpcEndpoint: endpointLabel(),
    transactionCount: 0,
    walletAgeDays: null,
    firstTransactionAt: null,
    lastTransactionAt: null,
    recentActivityDaysAgo: null,
    tokenAccountCount: 0,
    nonZeroTokenAccountCount: 0,
    flaggedInteractions: [],
    knownFlaggedAddressesChecked: KNOWN_FLAGGED_ADDRESSES.length,
    sampledTransactionCount: 0,
    collectionWarnings: [
      "Live RPC collection failed; verdict was generated from degraded availability signals.",
      reason
    ]
  };
}
