use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PolicyParams {
    pub max_auto_tx_lamports: u64,
    pub il_exit_threshold_bps: u16,
    pub auto_yield_rebalance: bool,
    pub walletguard_check: bool,
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
        has_one = owner
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
    pub walletguard_check: bool,
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
