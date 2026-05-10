# SentinelFi Dev3pack Submission

## One-liner

SentinelFi is an autonomous Solana DeFi agent that checks risk before every action, pays for that intelligence with x402, and records the decision trail on-chain.

## Problem

DeFi agents can move funds faster than humans can review risk. If an agent stakes, swaps, lends, or rebalances without a security gate, one bad counterparty can turn automation into an exploit path.

## Solution

SentinelFi makes security part of the agent loop:

1. User gives the agent an intent, such as stake SOL or move USDC to better yield.
2. Agent loads the user's policy and x402 spend limit.
3. Before acting, the agent pays 0.001 USDC for a wallet or contract risk verdict.
4. The risk engine returns LOW, MEDIUM, HIGH, or CRITICAL with reasons and flags.
5. Verdict and action receipt are stored in the on-chain ledger.
6. Safe actions go to approval. Risky actions are blocked or quarantined.

## Why This Can Win

- Strong Solana fit: Anchor programs model policy, verdict registry, action ledger, and vault routing.
- Strong sponsor fit: x402 is not decorative; it is the payment rail for every machine-to-machine risk check.
- Clear demo: one clean route gets approved, one flagged route gets blocked, both show receipts and verdicts.
- Useful beyond the hackathon: wallets, trading bots, DAOs, and DeFi frontends all need pre-transaction risk checks.
- Built as a product, not just a script: app dashboard, agent chat, scanner, docs, SDK, API, and Anchor source.

## Demo Flow

Target length: 2 minutes.

1. Open `/`.
   - Say: "SentinelFi is a Solana DeFi agent with a security check built into every action."
2. Open `/app`.
   - Run: `Stake 2 SOL only if security check passes.`
   - Say: "The agent loads policy, pays for risk intelligence with x402, checks the target, then recommends or blocks."
3. Open `/app/scan`.
   - Click `Known flagged wallet`.
   - Say: "A risky counterparty is scored HIGH/CRITICAL and the agent blocks it before execution."
   - Click `Clean system account`.
   - Say: "A clean target produces a lower-risk verdict and can continue through approval."
4. Open `/app/history`.
   - Say: "Every action stores the decision, risk label, x402 payment, and verdict PDA in the action ledger."
5. Open `/docs`.
   - Say: "The app exposes API routes and an SDK so other agents can call the same security primitive."

## What To Submit

- Project name: SentinelFi
- Tagline: Autonomous DeFi agents with security built in.
- Short description: SentinelFi is a Solana DeFi agent that runs paid x402 risk checks before every action and logs each verdict on-chain with Anchor.
- Tracks/sponsors to emphasize: Solana, x402, autonomous agents, AI safety/security.
- Demo URL: deployed Next.js app URL.
- Repo URL: GitHub repository.
- Video: 2-minute walkthrough following the demo flow above.

## Build Checklist

- [x] Landing page explains the agent loop.
- [x] App dashboard can run the agent API.
- [x] Scanner calls the live `/api/analyze` route.
- [x] Preset scan buttons support a reliable demo.
- [x] History view shows action ledger style records.
- [x] Docs explain x402, API, and Anchor contract surface.
- [ ] Deploy to Vercel or another public host.
- [ ] Record 2-minute demo video.
- [ ] Replace placeholder program IDs in README after deploy, if contracts are deployed.

