use anchor_lang::prelude::*;

declare_id!("8hsKs8eBYwUqGmim6PcstpS75YFWpinGugrBv7gdvD1T");

#[program]
pub mod agent_policy {
    use super::*;

    pub fn set_policy(ctx: Context<SetPolicy>, params: PolicyParams) -> Result<()> {
        require!(params.il_exit_threshold_bps <= 10_000, AgentPolicyError::InvalidThreshold);
        require!(params.max_auto_tx_lamports <= 10_000_000_000, AgentPolicyError::ExceedsMax);
        require!(params.max_x402_usdc_per_action <= 100_000, AgentPolicyError::PaymentTooHigh);

        let policy = &mut ctx.accounts.agent_policy;
        policy.owner = ctx.accounts.owner.key();
        policy.max_auto_tx_lamports = params.max_auto_tx_lamports;
        policy.il_exit_threshold_bps = params.il_exit_threshold_bps;
        policy.auto_yield_rebalance = params.auto_yield_rebalance;
        policy.security_check = params.security_check;
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

    pub fn pause(ctx: Context<TogglePolicy>) -> Result<()> {
        ctx.accounts.agent_policy.paused = true;
        Ok(())
    }

    pub fn resume(ctx: Context<TogglePolicy>) -> Result<()> {
        ctx.accounts.agent_policy.paused = false;
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PolicyParams {
    pub max_auto_tx_lamports: u64,
    pub il_exit_threshold_bps: u16,
    pub auto_yield_rebalance: bool,
    pub security_check: bool,
    pub verdict_registry_program: Pubkey,
    pub auto_quarantine_flagged: bool,
    pub daily_briefing: bool,
    pub max_x402_usdc_per_action: u32,
}

#[derive(Accounts)]
pub struct SetPolicy<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + AgentPolicy::INIT_SPACE,
        seeds = [b"policy", owner.key().as_ref()],
        bump
    )]
    pub agent_policy: Account<'info, AgentPolicy>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TogglePolicy<'info> {
    #[account(
        mut,
        seeds = [b"policy", owner.key().as_ref()],
        bump = agent_policy.bump,
        has_one = owner @ AgentPolicyError::Unauthorized
    )]
    pub agent_policy: Account<'info, AgentPolicy>,
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AgentPolicy {
    pub owner: Pubkey,
    pub max_auto_tx_lamports: u64,
    pub il_exit_threshold_bps: u16,
    pub auto_yield_rebalance: bool,
    pub security_check: bool,
    pub verdict_registry_program: Pubkey,
    pub auto_quarantine_flagged: bool,
    pub daily_briefing: bool,
    pub max_x402_usdc_per_action: u32,
    pub paused: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[event]
pub struct PolicyUpdated {
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum AgentPolicyError {
    #[msg("Threshold must be between 0 and 10000 bps")]
    InvalidThreshold,
    #[msg("Exceeds max allowed automation amount")]
    ExceedsMax,
    #[msg("x402 payment limit too high")]
    PaymentTooHigh,
    #[msg("Unauthorized")]
    Unauthorized,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn policy_space_matches_fields() {
        assert_eq!(AgentPolicy::INIT_SPACE, 92);
    }

    #[test]
    fn program_id_matches_declared_address() {
        assert_eq!(ID.to_string(), "8hsKs8eBYwUqGmim6PcstpS75YFWpinGugrBv7gdvD1T");
    }
}
