use anchor_lang::prelude::*;

declare_id!("213i6h266zzchmxs5wKFcAfwkwAy9dgYQhGg8EZTE66r");

#[program]
pub mod vault_router {
    use super::*;

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allocation_space_matches_fields() {
        assert_eq!(VaultAllocation::INIT_SPACE, 61);
    }

    #[test]
    fn program_id_matches_declared_address() {
        assert_eq!(ID.to_string(), "213i6h266zzchmxs5wKFcAfwkwAy9dgYQhGg8EZTE66r");
    }
}
