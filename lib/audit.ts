import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import type { Idl } from "@coral-xyz/anchor";
import type { AuditTrail, WalletVerdict } from "@/lib/types";

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

export async function recordLookupAudit(
  walletAddress: string,
  verdict: WalletVerdict
): Promise<AuditTrail> {
  if (!process.env.ANCHOR_AUDIT_PROGRAM_ID || !process.env.ANCHOR_AUDIT_KEYPAIR_JSON) {
    const configuredProgram = process.env.NEXT_PUBLIC_VERDICT_REGISTRY_ID;
    const derivedPda = configuredProgram
      ? PublicKey.findProgramAddressSync(
          [Buffer.from("verdict"), new PublicKey(walletAddress).toBuffer()],
          new PublicKey(configuredProgram)
        )[0].toBase58()
      : undefined;

    return {
      attempted: false,
      status: "skipped",
      onChainPDA: derivedPda,
      reason: "Set ANCHOR_AUDIT_PROGRAM_ID and ANCHOR_AUDIT_KEYPAIR_JSON to record lookups on-chain."
    };
  }

  try {
    const anchor = await import("@coral-xyz/anchor");
    const keypairBytes = JSON.parse(process.env.ANCHOR_AUDIT_KEYPAIR_JSON) as number[];
    const authority = Keypair.fromSecretKey(Uint8Array.from(keypairBytes));
    const connection = new Connection(rpcUrl(), "confirmed");
    const wallet = new anchor.Wallet(authority);
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed"
    });
    const programId = new PublicKey(process.env.ANCHOR_AUDIT_PROGRAM_ID);
    const analyzedWallet = new PublicKey(walletAddress);
    const [verdictRecord] = PublicKey.findProgramAddressSync(
      [Buffer.from("verdict"), analyzedWallet.toBuffer()],
      programId
    );

    const idl = {
      address: programId.toBase58(),
      metadata: {
        name: "verdict_registry",
        version: "0.1.0",
        spec: "0.1.0"
      },
      instructions: [
        {
          name: "store_verdict",
          discriminator: [161, 219, 6, 11, 91, 51, 113, 188],
          accounts: [
            { name: "verdict_record", writable: true, pda: { seeds: [] } },
            { name: "analyzed_wallet" },
            { name: "payer", writable: true, signer: true },
            { name: "system_program", address: "11111111111111111111111111111111" }
          ],
          args: [
            { name: "risk_score", type: "u8" },
            { name: "risk_label", type: "u8" },
            { name: "x402_payment_sig", type: { array: ["u8", 64] } }
          ]
        }
      ]
    };

    const program = new anchor.Program(idl as Idl, provider);
    const labelCode = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }[verdict.label];
    const paymentSig = Array.from(new Uint8Array(64));
    const signature = await (program.methods as any)
      .storeVerdict(verdict.score, labelCode, paymentSig)
      .accounts({
        verdictRecord,
        analyzedWallet,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    return {
      attempted: true,
      status: "recorded",
      onChainPDA: verdictRecord.toBase58(),
      signature
    };
  } catch (error) {
    return {
      attempted: true,
      status: "failed",
      onChainPDA: process.env.ANCHOR_AUDIT_PROGRAM_ID
        ? PublicKey.findProgramAddressSync(
            [Buffer.from("verdict"), new PublicKey(walletAddress).toBuffer()],
            new PublicKey(process.env.ANCHOR_AUDIT_PROGRAM_ID)
          )[0].toBase58()
        : undefined,
      reason: error instanceof Error ? error.message : "Unknown Anchor audit failure."
    };
  }
}
