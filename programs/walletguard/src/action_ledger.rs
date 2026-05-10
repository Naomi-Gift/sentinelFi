use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ActionParams {
    pub action_type: u8,
    pub amount_lamports: u64,
    pub target_wallet: Pubkey,
    pub reason: [u8; 64],
    pub tx_signature: [u8; 64],
    pub walletguard_score: u8,
    pub walletguard_label: u8,
    pub walletguard_verdict_pda: Pubkey,
    pub x402_payment_sig: [u8; 64],
    pub x402_amount_usdc: u32,
}

#[derive(Accounts)]
#[instruction(params: ActionParams, nonce: u64)]
pub struct LogAction<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + ActionEntry::INIT_SPACE,
        seeds = [b"action", owner.key().as_ref(), &nonce.to_le_bytes()],
        bump
    )]
    pub action_entry: Account<'info, ActionEntry>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ActionEntry {
    pub owner: Pubkey,
    pub action_type: u8,
    pub amount_lamports: u64,
    pub target_wallet: Pubkey,
    pub reason: [u8; 64],
    pub tx_signature: [u8; 64],
    pub walletguard_score: u8,
    pub walletguard_label: u8,
    pub walletguard_verdict_pda: Pubkey,
    pub x402_payment_sig: [u8; 64],
    pub x402_amount_usdc: u32,
    pub nonce: u64,
    pub timestamp: i64,
    pub bump: u8,
}

#[event]
pub struct ActionLogged {
    pub owner: Pubkey,
    pub action_type: u8,
    pub walletguard_score: u8,
    pub timestamp: i64,
}
