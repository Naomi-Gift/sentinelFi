use anchor_lang::prelude::*;

declare_id!("B5zhRju3oDVLXtX72Tpi8DDTWceDetQqC14eMEheqLQ9");

#[program]
pub mod verdict_registry {
    use super::*;

    pub fn store_verdict(
        ctx: Context<StoreVerdict>,
        risk_score: u8,
        risk_label: u8,
        x402_payment_sig: [u8; 64],
    ) -> Result<()> {
        require!(risk_score <= 100, VerdictRegistryError::InvalidScore);
        require!(risk_label <= 3, VerdictRegistryError::InvalidLabel);

        let record = &mut ctx.accounts.verdict_record;
        record.analyzed_wallet = ctx.accounts.analyzed_wallet.key();
        record.risk_score = risk_score;
        record.risk_label = risk_label;
        record.x402_payment_sig = x402_payment_sig;
        record.timestamp = Clock::get()?.unix_timestamp;
        record.version = record.version.saturating_add(1);
        record.bump = ctx.bumps.verdict_record;

        emit!(VerdictStored {
            wallet: record.analyzed_wallet,
            score: record.risk_score,
            label: record.risk_label,
            timestamp: record.timestamp,
        });

        Ok(())
    }

    pub fn query_verdict(ctx: Context<QueryVerdict>) -> Result<VerdictResult> {
        let record = &ctx.accounts.verdict_record;
        Ok(VerdictResult {
            risk_score: record.risk_score,
            risk_label: record.risk_label,
            timestamp: record.timestamp,
            version: record.version,
        })
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
    /// CHECK: This is the wallet or contract being analyzed.
    pub analyzed_wallet: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct QueryVerdict<'info> {
    #[account(
        seeds = [b"verdict", analyzed_wallet.key().as_ref()],
        bump = verdict_record.bump
    )]
    pub verdict_record: Account<'info, VerdictRecord>,
    /// CHECK: This is the wallet or contract being queried.
    pub analyzed_wallet: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct VerdictRecord {
    pub analyzed_wallet: Pubkey,
    pub risk_score: u8,
    pub risk_label: u8,
    pub x402_payment_sig: [u8; 64],
    pub timestamp: i64,
    pub version: u16,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VerdictResult {
    pub risk_score: u8,
    pub risk_label: u8,
    pub timestamp: i64,
    pub version: u16,
}

#[event]
pub struct VerdictStored {
    pub wallet: Pubkey,
    pub score: u8,
    pub label: u8,
    pub timestamp: i64,
}

#[error_code]
pub enum VerdictRegistryError {
    #[msg("Risk score must be between 0 and 100")]
    InvalidScore,
    #[msg("Risk label must be 0, 1, 2, or 3")]
    InvalidLabel,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verdict_record_space_matches_fields() {
        assert_eq!(VerdictRecord::INIT_SPACE, 109);
    }

    #[test]
    fn program_id_matches_declared_address() {
        assert_eq!(ID.to_string(), "B5zhRju3oDVLXtX72Tpi8DDTWceDetQqC14eMEheqLQ9");
    }
}
