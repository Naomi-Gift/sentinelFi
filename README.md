# SentinelFi

> Autonomous DeFi agent for Solana. Security built in. Every check paid via x402. Every verdict stored on-chain.

Dev3pack submission notes, demo script, and judging hooks are in [`SUBMISSION.md`](./SUBMISSION.md).

## What It Does

SentinelFi is an autonomous DeFi agent that monitors your Solana portfolio and acts within rules you define on-chain. Before every action — stake, swap, rebalance, or quarantine — it runs a built-in AI security check on the target wallet or contract, pays for that intelligence via x402, and stores the verdict on Solana.

Security is not a separate product. It is the foundation every agent decision is built on.

```text
User asks SentinelFi to act
  → Agent reads on-chain policy
  → Agent pays 0.001 USDC via x402 for a fresh risk verdict
  → AI scores the target: LOW / MEDIUM / HIGH / CRITICAL
  → Verdict stored on-chain as a PDA
  → Agent allows or blocks the action
  → Action + verdict + payment receipt logged to Action Ledger
```

## On-Chain Programs — Solana Devnet

| Program | ID | Purpose |
|---|---|---|
| Verdict Registry | `YOUR_PROGRAM_ID_1` | Stores AI risk score + verdict per wallet as a PDA |
| Agent Policy | `YOUR_PROGRAM_ID_2` | User automation rules and x402 spend limits |
| Action Ledger | `YOUR_PROGRAM_ID_3` | Immutable log of every action + verdict + x402 receipt |
| Vault Router | `YOUR_PROGRAM_ID_4` | Active DeFi allocations by protocol and APY |

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/app` | Main agent dashboard |
| `/app/chat` | Natural language agent commands |
| `/app/history` | On-chain action log |
| `/app/policy` | Agent policy configuration |
| `/app/scan` | Security scanner utility |
| `/docs` | Product documentation |

## API Reference

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/agent` | Run agent — triggers security check internally before every action |
| `POST` | `/api/analyze` | Run security check |
| `POST` | `/api/watch` | Watch a wallet and emit risk-change events |
| `POST` | `/api/x402/pay` | Autonomous payment handler |

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Deploy Contracts

```bash
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

## Contract Source

```text
programs/walletguard/src/
├── lib.rs
├── agent_policy.rs
├── action_ledger.rs
└── vault_router.rs
```

## License

MIT
