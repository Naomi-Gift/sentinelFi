use anchor_lang::prelude::*;

declare_id!("AnGfz5kMTCqxnKtEciDc6QUqZvaHhqh1nyAjd8GcrMGH");

#[program]
pub mod action_ledger {
    use super::*;

    pub fn log_action(ctx: Context<LogAction>, params: ActionParams, nonce: u64) -> Result<()> {
        require!(params.security_score <= 100, ActionLedgerError::InvalidScore);
        require!(params.security_label <= 3, ActionLedgerError::InvalidLabel);

        let entry = &mut ctx.accounts.action_entry;
        entry.owner = ctx.accounts.owner.key();
        entry.action_type = params.action_type;
        entry.amount_lamports = params.amount_lamports;
        entry.target_wallet = params.target_wallet;
        entry.reason = params.reason;
        entry.tx_signature = params.tx_signature;
        entry.security_score = params.security_score;
        entry.security_label = params.security_label;
        entry.verdict_pda = params.verdict_pda;
        entry.x402_payment_sig = params.x402_payment_sig;
        entry.x402_amount_usdc = params.x402_amount_usdc;
        entry.nonce = nonce;
        entry.timestamp = Clock::get()?.unix_timestamp;
        entry.bump = ctx.bumps.action_entry;

        emit!(ActionLogged {
            owner: entry.owner,
            action_type: entry.action_type,
            security_score: entry.security_score,
            timestamp: entry.timestamp,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ActionParams {
    pub action_type: u8,
    pub amount_lamports: u64,
    pub target_wallet: Pubkey,
    pub reason: [u8; 64],
    pub tx_signature: [u8; 64],
    pub security_score: u8,
    pub security_label: u8,
    pub verdict_pda: Pubkey,
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
    pub security_score: u8,
    pub security_label: u8,
    pub verdict_pda: Pubkey,
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
    pub security_score: u8,
    pub timestamp: i64,
}

#[error_code]
pub enum ActionLedgerError {
    #[msg("Security score must be between 0 and 100")]
    InvalidScore,
    #[msg("Security label must be 0, 1, 2, or 3")]
    InvalidLabel,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn action_entry_space_matches_fields() {
        assert_eq!(ActionEntry::INIT_SPACE, 320);
    }

    #[test]
    fn program_id_matches_declared_address() {
        assert_eq!(ID.to_string(), "AnGfz5kMTCqxnKtEciDc6QUqZvaHhqh1nyAjd8GcrMGH");
    }
}
