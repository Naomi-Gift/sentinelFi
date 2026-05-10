import crypto from "crypto";

export type X402Receipt = {
  protocol: "x402";
  mode: "local" | "verified";
  txSignature: string;
  amountUsdc: number;
  payTo: string;
  resource: string;
  paidAt: string;
};

export function createLocalX402Receipt(resource: string, amountUsdc = 0.001): X402Receipt {
  const seed = `${resource}:${amountUsdc}:${Date.now()}:${Math.random()}`;

  return {
    protocol: "x402",
    mode: process.env.COINBASE_CDP_API_KEY ? "verified" : "local",
    txSignature: crypto.createHash("sha256").update(seed).digest("hex").slice(0, 64),
    amountUsdc,
    payTo: process.env.SENTINELFI_TREASURY ?? "LocalSentinelFiTreasury111111111111111111111",
    resource,
    paidAt: new Date().toISOString()
  };
}

export function build402Requirement(resource: string, amountMicroUsdc = 1000) {
  return {
    status: 402,
    error: "Payment Required",
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: "solana-devnet",
        maxAmountRequired: String(amountMicroUsdc),
        asset: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        payTo: process.env.SENTINELFI_TREASURY ?? "LocalSentinelFiTreasury111111111111111111111",
        resource,
        description: "SentinelFi security check",
        maxTimeoutSeconds: 60
      }
    ]
  };
}
