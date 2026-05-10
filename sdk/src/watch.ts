import { analyzeWallet } from "./analyze";
import { WatchEvent } from "./types";

export function watchWallet(
  address: string,
  onEvent: (event: WatchEvent) => void,
  options?: { intervalMs?: number; apiBase?: string }
): () => void {
  const interval = options?.intervalMs ?? 30_000;
  let lastScore: number | null = null;
  let running = true;

  const poll = async () => {
    while (running) {
      try {
        const verdict = await analyzeWallet(address, {
          storeOnChain: false,
          apiBase: options?.apiBase
        });

        if (lastScore === null) {
          lastScore = verdict.score;
        } else if (verdict.score !== lastScore) {
          const previous = lastScore;
          lastScore = verdict.score;
          onEvent({
            address,
            eventType: "risk-change",
            message: `Risk score ${verdict.score > previous ? "increased" : "decreased"} from ${previous} to ${verdict.score}`,
            timestamp: new Date().toISOString(),
            newVerdict: verdict
          });
        }

        if (verdict.flags.includes("scam-interaction")) {
          onEvent({
            address,
            eventType: "flagged-interaction",
            message: "Flagged: Wallet interacted with a known scam contract",
            timestamp: new Date().toISOString(),
            newVerdict: verdict
          });
        }
      } catch (error) {
        console.error("SentinelFi watch error:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  };

  poll();
  return () => {
    running = false;
  };
}
