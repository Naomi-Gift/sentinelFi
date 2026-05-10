import { Nav } from "@/components/nav";

const anchors = ["Overview", "How it works", "Security checks", "x402 payments", "Contracts", "API reference", "Setup"];
const steps = [
  ["01", "Command", "User asks SentinelFi to act — stake, swap, rebalance, or protect."],
  ["02", "Security check", "Agent pays 0.001 USDC via x402 for a fresh verdict."],
  ["03", "Verdict", "AI scores the target and stores the result as a PDA."],
  ["04", "Action", "Agent acts within policy and logs verdict + receipt."]
];
const contracts = [
  ["Verdict Registry", "src/lib.rs", "Risk score + PDA per wallet"],
  ["Agent Policy", "src/agent_policy.rs", "User rules + x402 spend cap"],
  ["Action Ledger", "src/action_ledger.rs", "Action + verdict + receipt"],
  ["Vault Router", "src/vault_router.rs", "DeFi allocation tracking"]
];
const api = [
  ["POST", "/api/agent", "Run agent — triggers security check internally before every action"],
  ["POST", "/api/analyze", "Run security check — x402 required"],
  ["POST", "/api/watch", "Watch a wallet for risk changes"],
  ["POST", "/api/x402/pay", "Autonomous payment handler"]
];

function Code({ children }: { children: string }) {
  return <pre className="rounded-lg border border-[color:var(--border)] bg-sf-surface p-4 font-code text-[13px] leading-6 text-sf-t2"><code>{children}</code></pre>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section id={title.toLowerCase().replaceAll(" ", "-")} className="border-t border-[color:var(--border)] py-9 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[22px] font-bold text-sf-t1">{title}</h2>
      <div className="mt-4 text-[15px] leading-[1.8] text-sf-t2">{children}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-sf-void text-sf-t1">
      <Nav />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-6 md:px-8 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <nav className="font-code sticky top-6 space-y-1 text-xs text-sf-t3">
            {anchors.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="block rounded-md px-3 py-2 hover:text-sf-primary">{item}</a>)}
          </nav>
        </aside>
        <article className="card p-6 md:p-8">
          <h1 className="font-display text-5xl font-extrabold text-sf-t1">SentinelFi Docs</h1>
          <Section title="Overview">
            <p>SentinelFi is an autonomous DeFi agent for Solana. It monitors portfolios, executes protective actions within user-defined policy, and runs a built-in AI security check before every action. Security is not a separate product — it is the foundation every agent decision is built on.</p>
          </Section>
          <Section title="How it works">
            <div className="grid gap-3 md:grid-cols-4">{steps.map(([n, title, text]) => <div key={n} className="rounded-lg border border-[color:var(--border)] bg-sf-surface p-4"><div className="font-code text-sf-primary">{n}</div><div className="font-display mt-3 text-lg font-bold text-sf-t1">{title}</div><p className="mt-2 text-sm text-sf-t2">{text}</p></div>)}</div>
          </Section>
          <Section title="Security checks">
            <p>The built-in risk engine analyzes any Solana wallet or contract. Results include LOW / MEDIUM / HIGH / CRITICAL, score 0-100, plain-English verdict, reasons, flags, and on-chain PDA address. Every check is paid via x402 and stored in the Verdict Registry.</p>
          </Section>
          <Section title="x402 payments">
            <p>The agent pays for security intelligence autonomously. No API keys. No accounts. Machine-to-machine micropayments. Each check costs 0.001 USDC on Solana devnet, and payment receipts are stored in the Action Ledger PDA.</p>
            <Code>{`GET /api/analyze/WALLET_ADDRESS
← 402 Payment Required
→ Agent pays 0.001 USDC on Solana
→ Retries with X-Payment header
← 200 OK — verdict JSON`}</Code>
          </Section>
          <Section title="Contracts">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead className="font-code text-xs text-sf-t3"><tr><th className="border-b border-[color:var(--border)] p-3">Program</th><th className="border-b border-[color:var(--border)] p-3">File</th><th className="border-b border-[color:var(--border)] p-3">Purpose</th></tr></thead>
              <tbody>{contracts.map(([program, file, purpose]) => <tr key={program}><td className="border-b border-[color:var(--border)] p-3 text-sf-t1">{program}</td><td className="font-code border-b border-[color:var(--border)] p-3 text-xs text-sf-t3">{file}</td><td className="border-b border-[color:var(--border)] p-3">{purpose}</td></tr>)}</tbody>
            </table>
          </Section>
          <Section title="API reference">
            <div className="space-y-2">{api.map(([method, route, desc]) => <div key={route} className="grid gap-2 rounded-lg border border-[color:var(--border)] bg-sf-surface p-3 md:grid-cols-[90px_180px_1fr]"><div className="font-code text-sf-primary">{method}</div><div className="font-code text-xs text-sf-t1">{route}</div><div>{desc}</div></div>)}</div>
          </Section>
          <Section title="Setup">
            <Code>{`git clone https://github.com/YOUR_USERNAME/sentinelfi
cd sentinelfi
npm install
cp .env.example .env.local
anchor deploy --provider.cluster devnet
npm run dev`}</Code>
          </Section>
        </article>
      </div>
    </main>
  );
}
