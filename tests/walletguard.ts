import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

describe("walletguard", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Walletguard as Program;

  it("stores a verdict PDA", async () => {
    const analyzedWallet = PublicKey.unique();
    const [verdictRecord] = PublicKey.findProgramAddressSync(
      [Buffer.from("verdict"), analyzedWallet.toBuffer()],
      program.programId
    );

    await program.methods
      .storeVerdict(74, 2)
      .accounts({
        verdictRecord,
        analyzedWallet,
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const record = await program.account.verdictRecord.fetch(verdictRecord);
    anchor.assert.equal(record.riskScore, 74);
    anchor.assert.equal(record.riskLabel, 2);
    anchor.assert.ok(record.analyzedWallet.equals(analyzedWallet));
  });
});
