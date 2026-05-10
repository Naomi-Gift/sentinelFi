# SentinelFi

**Autonomous DeFi execution for Solana — with security checks built into every action.**

SentinelFi is an AI-powered portfolio agent that monitors positions, enforces user-defined on-chain policy, and runs a paid risk check against every target before money moves. The result is a verifiable decision trail: score, verdict, x402 receipt, and on-chain PDA — attached to every action the agent takes.

---

## How It Works

```
User intent
  → on-chain policy check
  → x402-paid security verdict
  → risk score + label + flags
  → agent action or block
  → action ledger entry (verdict + receipt on-chain)
```

Before the agent stakes, swaps, rebalances, or quarantines assets it runs a fresh risk check against the target. The check returns a score (0–100), a label (LOW / MEDIUM / HIGH / CRITICAL), reasons, flags, an x402 payment receipt, and a verdict PDA stored on Solana. The agent then allows, blocks, or escalates according to the wallet's active policy.

---

## Product Surface

| Route | Purpose |
|---|---|
| `/` | Landing page and execution loop overview |
| `/app` | Portfolio dashboard and agent command center |
| `/app/chat` | Natural-language DeFi commands |
| `/app/scan` | Manual wallet or contract security scan |
| `/app/history` | On-chain-style action and security log |
| `/app/policy` | User policy controls |
| `/docs` | API, x402, and contract reference |

---

## On-Chain Programs

All programs are written in Rust with the [Anchor](https://www.anchor-lang.com/) framework and target Solana devnet.

| Program | Source | Purpose |
|---|---|---|
| **Verdict Registry** | `programs/sentinelfi/verdict_registry/` | Stores risk score, label, x402 proof, timestamp, and version per target PDA |
| **Agent Policy** | `programs/sentinelfi/agent_policy/` | Stores user automation limits, security-check toggle, and x402 spend cap |
| **Action Ledger** | `programs/sentinelfi/action_ledger/` | Logs agent actions with attached verdict PDA and x402 receipt |
| **Vault Router** | `programs/sentinelfi/vault_router/` | Tracks active DeFi allocations by owner, protocol, amount, and APY |

Program IDs are set via environment variables (see [Environment Variables](#environment-variables)) so they can be updated after each deploy without touching source code.

---

## x402 Payment Flow

SentinelFi models paid machine-to-machine intelligence. The agent requests a security verdict, receives an HTTP 402 response, pays the required USDC amount autonomously, retries with payment proof, and records the receipt alongside the action.

```
GET /api/analyze
← 402 Payment Required
→ x402 payment proof header
← verdict JSON
→ store verdict PDA on-chain
→ log action + verdict + receipt
```

Local development uses deterministic local receipts when live Coinbase CDP verification is not configured. The payment boundary is isolated in `lib/x402.ts` — enabling live verification requires only a CDP key, no changes to the agent flow.

---

## API Reference

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/agent` | Run the agent — triggers policy check, security verdict, and recommendation |
| `POST` | `/api/analyze` | Run a wallet or contract security check |
| `POST` | `/api/watch` | Watch a wallet for risk changes |
| `POST` | `/api/x402/pay` | Create an autonomous x402 payment receipt |

### `POST /api/analyze`

**Request**
```json
{ "address": "<solana-wallet-or-contract>" }
```

**Response**
```json
{
  "address": "...",
  "score": 12,
  "label": "LOW",
  "verdict": "Active, well-known protocol with consistent usage.",
  "reasons": ["..."],
  "flags": [],
  "onChainPDA": "...",
  "analyzedAt": "2025-01-01T00:00:00.000Z"
}
```

### `POST /api/agent`

**Request**
```json
{ "userMessage": "Stake 2 SOL only if the route is safe" }
```

**Response**
```json
{ "briefing": "Stake 2 SOL via Marinade at 7.4% APY. Route is LOW RISK, within policy." }
```

---

## SDK

A lightweight client SDK is published from the `sdk/` directory.

```bash
npm install sentinelfi-sdk
```

```ts
import { analyze, watch } from "sentinelfi-sdk";

// Run a security check
const verdict = await analyze("TARGET_ADDRESS");
console.log(verdict.score, verdict.label);

// Watch a wallet for risk changes
await watch("WALLET_ADDRESS", (update) => {
  console.log(update.label);
});
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Rust + `cargo-build-sbf` (for contract development)
- Solana CLI (for deployment)

### App Setup

```bash
npm install
cp .env.example .env.local
# fill in .env.local (see Environment Variables below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# Solana RPC
HELIUS_RPC_URL=

# AI
ANTHROPIC_API_KEY=

# x402 payments (leave blank to use local dev receipts)
COINBASE_CDP_API_KEY=

# On-chain program IDs (set after deploy)
NEXT_PUBLIC_VERDICT_REGISTRY_ID=
NEXT_PUBLIC_AGENT_POLICY_ID=
NEXT_PUBLIC_ACTION_LEDGER_ID=
NEXT_PUBLIC_VAULT_ROUTER_ID=

# Anchor audit signer (local keypair path or JSON)
ANCHOR_AUDIT_PROGRAM_ID=
ANCHOR_AUDIT_KEYPAIR_JSON=
```

---

## Contract Development

### Build

```bash
cargo build-sbf --manifest-path programs/sentinelfi/verdict_registry/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/agent_policy/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/action_ledger/Cargo.toml --sbf-out-dir target/deploy
cargo build-sbf --manifest-path programs/sentinelfi/vault_router/Cargo.toml --sbf-out-dir target/deploy
```

### Deploy to Devnet

```bash
solana config set --url devnet
solana program deploy target/deploy/verdict_registry.so --program-id target/deploy/verdict_registry-keypair.json
solana program deploy target/deploy/agent_policy.so --program-id target/deploy/agent_policy-keypair.json
solana program deploy target/deploy/action_ledger.so --program-id target/deploy/action_ledger-keypair.json
solana program deploy target/deploy/vault_router.so --program-id target/deploy/vault_router-keypair.json
```

After deploying, copy the program IDs into `.env.local`.

### Verify

```bash
cargo test --workspace
cargo check
npm run lint
npm run build
```

---

## Project Structure

```
app/                    Next.js pages and API routes
  api/                  Agent, analyze, watch, x402 endpoints
  app/                  Authenticated app shell (dashboard, chat, scan, history, policy)
components/             Shared UI components (nav, wallet, logo, results)
lib/                    Core logic — agent, Solana, x402, risk scoring, audit trail
programs/sentinelfi/    Rust Anchor programs
  verdict_registry/     Risk verdict storage
  agent_policy/         User policy enforcement
  action_ledger/        Action + receipt logging
  vault_router/         DeFi allocation tracking
sdk/                    Client SDK (analyze, watch, bulk)
tests/                  Integration tests
```

---

## License

MIT
