use anchor_lang::prelude::*;

pub mod action_ledger;
pub mod agent_policy;
pub mod vault_router;

use action_ledger::*;
use agent_policy::*;
use vault_router::*;

declare_id!("B5zhRju3oDVLXtX72Tpi8DDTWceDetQqC14eMEheqLQ9");

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

    pub fn set_policy(ctx: Context<SetPolicy>, params: PolicyParams) -> Result<()> {
        require!(params.il_exit_threshold_bps <= 10_000, WalletGuardError::InvalidThreshold);
        require!(params.max_auto_tx_lamports <= 10_000_000_000, WalletGuardError::ExceedsMax);
        require!(params.max_x402_usdc_per_action <= 100_000, WalletGuardError::PaymentTooHigh);

        let policy = &mut ctx.accounts.agent_policy;
        policy.owner = ctx.accounts.owner.key();
        policy.max_auto_tx_lamports = params.max_auto_tx_lamports;
        policy.il_exit_threshold_bps = params.il_exit_threshold_bps;
        policy.auto_yield_rebalance = params.auto_yield_rebalance;
        policy.walletguard_check = params.walletguard_check;
        policy.verdict_registry_program = params.verdict_registry_program;
        policy.auto_quarantine_flagged = params.auto_quarantine_flagged;
        policy.daily_briefing = params.daily_briefing;
        policy.max_x402_usdc_per_action = params.max_x402_usdc_per_action;
        policy.paused = false;
        policy.created_at = Clock::get()?.unix_timestamp;
        policy.bump = ctx.bumps.agent_policy;

        emit!(PolicyUpdated {
            owner: policy.owner,
            timestamp: policy.created_at,
        });

        Ok(())
    }

    pub fn pause_policy(ctx: Context<TogglePolicy>) -> Result<()> {
        ctx.accounts.agent_policy.paused = true;
        Ok(())
    }

    pub fn resume_policy(ctx: Context<TogglePolicy>) -> Result<()> {
        ctx.accounts.agent_policy.paused = false;
        Ok(())
    }

    pub fn log_action(ctx: Context<LogAction>, params: ActionParams, nonce: u64) -> Result<()> {
        let entry = &mut ctx.accounts.action_entry;
        entry.owner = ctx.accounts.owner.key();
        entry.action_type = params.action_type;
        entry.amount_lamports = params.amount_lamports;
        entry.target_wallet = params.target_wallet;
        entry.reason = params.reason;
        entry.tx_signature = params.tx_signature;
        entry.walletguard_score = params.walletguard_score;
        entry.walletguard_label = params.walletguard_label;
        entry.walletguard_verdict_pda = params.walletguard_verdict_pda;
        entry.x402_payment_sig = params.x402_payment_sig;
        entry.x402_amount_usdc = params.x402_amount_usdc;
        entry.nonce = nonce;
        entry.timestamp = Clock::get()?.unix_timestamp;
        entry.bump = ctx.bumps.action_entry;

        emit!(ActionLogged {
            owner: entry.owner,
            action_type: entry.action_type,
            walletguard_score: entry.walletguard_score,
            timestamp: entry.timestamp,
        });

        Ok(())
    }

    pub fn record_allocation(
        ctx: Context<RecordAllocation>,
        protocol: u8,
        amount_lamports: u64,
        apy_bps: u16,
    ) -> Result<()> {
        let allocation = &mut ctx.accounts.vault_allocation;
        allocation.owner = ctx.accounts.owner.key();
        allocation.protocol = protocol;
        allocation.amount_lamports = amount_lamports;
        allocation.apy_bps = apy_bps;
        allocation.allocated_at = Clock::get()?.unix_timestamp;
        allocation.closed_at = 0;
        allocation.active = true;
        allocation.bump = ctx.bumps.vault_allocation;

        Ok(())
    }

    pub fn close_allocation(ctx: Context<CloseAllocation>) -> Result<()> {
        ctx.accounts.vault_allocation.active = false;
        ctx.accounts.vault_allocation.closed_at = Clock::get()?.unix_timestamp;
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
    #[msg("Threshold must be 0-10000 bps")]
    InvalidThreshold,
    #[msg("Exceeds max allowed automation amount")]
    ExceedsMax,
    #[msg("x402 payment limit too high")]
    PaymentTooHigh,
    #[msg("Unauthorized")]
    Unauthorized,
}
