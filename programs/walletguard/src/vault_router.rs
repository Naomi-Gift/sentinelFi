use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(protocol: u8)]
pub struct RecordAllocation<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + VaultAllocation::INIT_SPACE,
        seeds = [b"vault", owner.key().as_ref(), &[protocol]],
        bump
    )]
    pub vault_allocation: Account<'info, VaultAllocation>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseAllocation<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref(), &[vault_allocation.protocol]],
        bump = vault_allocation.bump,
        has_one = owner
    )]
    pub vault_allocation: Account<'info, VaultAllocation>,

    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct VaultAllocation {
    pub owner: Pubkey,
    pub protocol: u8,
    pub amount_lamports: u64,
    pub apy_bps: u16,
    pub allocated_at: i64,
    pub closed_at: i64,
    pub active: bool,
    pub bump: u8,
}
