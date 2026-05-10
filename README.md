# SentinelFi

Autonomous DeFi execution for Solana, with security checks built into every action.

SentinelFi monitors a portfolio, reads user-defined policy on-chain, checks wallet and contract risk before execution, pays for risk intelligence through x402, and records the decision trail on Solana.

## Why It Matters

Autonomous agents can move funds faster than users can manually review counterparties, contracts, routes, and token risk. SentinelFi turns security into a required step in the execution loop instead of an optional dashboard afterthought.

Before the agent stakes, swaps, rebalances, or quarantines assets, it runs a fresh risk check against the target. The check produces a score, label, reasons, flags, x402 payment receipt, and on-chain verdict PDA. The agent then allows, blocks, or escalates the action according to policy.

```text
User intent
  -> on-chain policy
  -> x402-paid security check
  -> risk verdict PDA
  -> agent action or block
  -> action ledger entry with verdict + receipt
```

## Product Surface

| Area | Purpose |
|---|---|
| `/` | Product overview and execution loop |
| `/app` | Portfolio dashboard and agent command center |
| `/app/chat` | Natural-language DeFi commands |
| `/app/history` | On-chain-style action and security log |
| `/app/policy` | User policy controls |
| `/app/scan` | Manual wallet or contract security scan |
| `/docs` | API, x402, and contract documentation |

## On-Chain Programs

All programs are written in Rust with Anchor and target Solana devnet.

| Program | Program ID | Source | Purpose |
|---|---|---|---|
| Verdict Registry | `B5zhRju3oDVLXtX72Tpi8DDTWceDetQqC14eMEheqLQ9` | `programs/sentinelfi/verdict_registry/src/lib.rs` | Stores risk score, label, x402 proof, timestamp, and version per target PDA |
| Agent Policy | `8hsKs8eBYwUqGmim6PcstpS75YFWpinGugrBv7gdvD1T` | `programs/sentinelfi/agent_policy/src/lib.rs` | Stores user automation limits, security-check toggle, and x402 spend cap |
| Action Ledger | `AnGfz5kMTCqxnKtEciDc6QUqZvaHhqh1nyAjd8GcrMGH` | `programs/sentinelfi/action_ledger/src/lib.rs` | Logs agent actions with attached verdict PDA and x402 receipt |
| Vault Router | `213i6h266zzchmxs5wKFcAfwkwAy9dgYQhGg8EZTE66r` | `programs/sentinelfi/vault_router/src/lib.rs` | Tracks active DeFi allocations by owner, protocol, amount, and APY |

Explorer links:

```text
https://explorer.solana.com/address/B5zhRju3oDVLXtX72Tpi8DDTWceDetQqC14eMEheqLQ9?cluster=devnet
https://explorer.solana.com/address/8hsKs8eBYwUqGmim6PcstpS75YFWpinGugrBv7gdvD1T?cluster=devnet
https://explorer.solana.com/address/AnGfz5kMTCqxnKtEciDc6QUqZvaHhqh1nyAjd8GcrMGH?cluster=devnet
https://explorer.solana.com/address/213i6h266zzchmxs5wKFcAfwkwAy9dgYQhGg8EZTE66r?cluster=devnet
```

## x402 Flow

SentinelFi models paid machine-to-machine intelligence. The agent requests a security verdict, receives an HTTP 402 payment requirement, pays the required USDC amount, retries with payment proof, and records the receipt alongside the action.

```text
GET /api/analyze
<- 402 Payment Required
-> x402 payment proof
<- verdict JSON
-> store verdict PDA
-> log action + verdict + receipt
```

Local development uses deterministic local receipts when live Coinbase CDP verification is not configured. The payment boundary is isolated in `lib/x402.ts` so live verification can be enabled without changing the agent flow.

## API

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/agent` | Runs the agent and triggers security checks before recommended actions |
| `POST` | `/api/analyze` | Runs a wallet or contract security check |
| `POST` | `/api/watch` | Watches a wallet for risk changes |
| `POST` | `/api/x402/pay` | Creates an autonomous x402 payment receipt |

## Contract Development

Build all programs:

```bash
cargo build-sbf --manifest-path programs/sentinelfi/verdict_registry/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/agent_policy/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/action_ledger/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/vault_router/Cargo.toml --sbf-out-dir target/deploy
```

Deploy:

```bash
solana config set --url devnet
solana program deploy target/deploy/verdict_registry.so --program-id target/deploy/verdict_registry-keypair.json
solana program deploy target/deploy/agent_policy.so --program-id target/deploy/agent_policy-keypair.json
solana program deploy target/deploy/action_ledger.so --program-id target/deploy/action_ledger-keypair.json
solana program deploy target/deploy/vault_router.so --program-id target/deploy/vault_router-keypair.json
```

Verify:

```bash
cargo test --workspace
cargo check
npm run lint
npm run build
```

## Local App Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Important environment variables:

```env
HELIUS_RPC_URL=
ANTHROPIC_API_KEY=
COINBASE_CDP_API_KEY=
NEXT_PUBLIC_VERDICT_REGISTRY_ID=
NEXT_PUBLIC_AGENT_POLICY_ID=
NEXT_PUBLIC_ACTION_LEDGER_ID=
NEXT_PUBLIC_VAULT_ROUTER_ID=
ANCHOR_AUDIT_PROGRAM_ID=
ANCHOR_AUDIT_KEYPAIR_JSON=
```

## Architecture

```text
app/                         Next.js application and API routes
components/                  Shared UI
lib/                         Agent, Solana, x402, risk, and audit logic
programs/sentinelfi/         Rust Anchor programs
sdk/                         Client SDK surface
target/deploy/               Built SBF artifacts and program keypairs
```

## License

MIT
