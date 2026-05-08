use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod walletguard {
    use super::*;

    pub fn store_verdict(
        ctx: Context<StoreVerdict>,
        risk_score: u8,
        risk_label: u8,
    ) -> Result<()> {
        require!(risk_score <= 100, WalletGuardError::InvalidScore);
        require!(risk_label <= 3, WalletGuardError::InvalidLabel);

        let record = &mut ctx.accounts.verdict_record;
        record.analyzed_wallet = ctx.accounts.analyzed_wallet.key();
        record.risk_score = risk_score;
        record.risk_label = risk_label;
        record.timestamp = Clock::get()?.unix_timestamp;
        record.bump = ctx.bumps.verdict_record;

        msg!(
            "WalletGuard verdict stored: wallet={}, score={}, label={}",
            record.analyzed_wallet,
            record.risk_score,
            record.risk_label
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreVerdict<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + VerdictRecord::INIT_SPACE,
        seeds = [b"verdict", analyzed_wallet.key().as_ref()],
        bump
    )]
    pub verdict_record: Account<'info, VerdictRecord>,

    /// CHECK: This is the wallet being analyzed, not a signer.
    pub analyzed_wallet: UncheckedAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct VerdictRecord {
    pub analyzed_wallet: Pubkey,
    pub risk_score: u8,
    pub risk_label: u8,
    pub timestamp: i64,
    pub bump: u8,
}

#[error_code]
pub enum WalletGuardError {
    #[msg("Risk score must be between 0 and 100")]
    InvalidScore,
    #[msg("Risk label must be 0 (LOW), 1 (MEDIUM), 2 (HIGH), or 3 (CRITICAL)")]
    InvalidLabel,
}
