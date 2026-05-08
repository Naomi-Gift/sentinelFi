import { analyzeWallet } from "./analyze";
import { BulkResult, WalletVerdict } from "./types";

export async function analyzeBulk(
  addresses: string[],
  options?: { concurrency?: number; storeOnChain?: boolean; apiBase?: string }
): Promise<BulkResult> {
  const concurrency = options?.concurrency ?? 3;
  const results: WalletVerdict[] = [];

  for (let i = 0; i < addresses.length; i += concurrency) {
    const batch = addresses.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((address) =>
        analyzeWallet(address, {
          storeOnChain: options?.storeOnChain ?? false,
          apiBase: options?.apiBase
        })
      )
    );
    results.push(...batchResults);
  }

  return {
    results,
    summary: {
      total: results.length,
      low: results.filter((result) => result.label === "LOW").length,
      medium: results.filter((result) => result.label === "MEDIUM").length,
      high: results.filter((result) => result.label === "HIGH").length,
      critical: results.filter((result) => result.label === "CRITICAL").length
    }
  };
}
