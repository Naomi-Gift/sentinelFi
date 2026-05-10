import { CheckCircle2, CircleDollarSign, LockKeyhole, ShieldCheck, WalletCards, type LucideIcon } from "lucide-react";
import { Nav } from "@/components/nav";

const anchors = ["Overview", "First run", "Using SentinelFi", "Security checks", "Payments", "Policy", "History", "Safety"];
const steps = [
  ["01", "Ask", "Tell the agent what you want to do with your portfolio."],
  ["02", "Check", "SentinelFi checks the wallet, contract, or protocol before any action."],
  ["03", "Decide", "You see the risk result and the recommended action."],
  ["04", "Approve", "The action only moves forward when it fits your policy."]
];
const features: Array<[LucideIcon, string, string]> = [
  [WalletCards, "Portfolio dashboard", "See balances, positions, yield opportunities, and warnings in one place."],
  [ShieldCheck, "Security scan", "Check any wallet or contract before you interact with it."],
  [LockKeyhole, "Policy controls", "Set limits for how much the agent can do without asking you first."],
  [CheckCircle2, "Action history", "Review past actions, blocked risks, security results, and receipts."]
];
const policyItems = [
  ["Auto-execution limit", "The most SOL the agent can move without asking for approval."],
  ["LP exit threshold", "When an LP position gets too risky, SentinelFi can recommend exiting."],
  ["Security check spend limit", "The maximum amount the agent can spend on one security check."],
  ["Quarantine flagged tokens", "Blocks or isolates assets that are identified as risky."]
];
const firstRun = [
  ["Connect your wallet", "SentinelFi uses the connected wallet to understand which account and policy the session belongs to."],
  ["Run one command", "Start with a simple request such as “Stake 2 SOL safely.”"],
  ["Review the check", "Look at the security verdict before approving the recommendation."],
  ["Approve or dismiss", "You stay in control. The agent prepares the action, but policy decides when approval is needed."]
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section id={title.toLowerCase().replaceAll(" ", "-")} className="border-t border-[color:var(--border)] py-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-3xl font-bold text-sf-t1">{title}</h2>
      <div className="mt-4 text-[15px] leading-8 text-sf-t2">{children}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="page-shell text-sf-t1">
      <Nav />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="font-code sticky top-24 space-y-1 text-xs text-sf-t3">
            {anchors.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="block rounded-lg px-3 py-2 transition hover:bg-sf-surface hover:text-sf-primary">
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <article className="card overflow-hidden">
          <div className="border-b border-[color:var(--border)] bg-sf-raised/35 p-6 md:p-8">
            <div className="metric-label">Product guide</div>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-sf-t1 md:text-5xl">
              How SentinelFi protects your Solana portfolio.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sf-t2">
              This guide explains the product in plain language. It focuses on what you see, what the agent does, and what stays under your control.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <Section title="Overview">
              <p>
                SentinelFi is an autonomous DeFi assistant for Solana. It watches your portfolio, identifies opportunities and risks, and recommends actions such as staking, rebalancing, exiting risky positions, or blocking suspicious assets.
              </p>
              <p className="mt-4">
                The important difference is that security is built into the action flow. Before SentinelFi recommends or performs an action, it checks the wallet, contract, or protocol involved and shows you the risk result.
              </p>
            </Section>

            <Section title="First run">
              <div className="grid gap-4 md:grid-cols-2">
                {firstRun.map(([title, text], index) => (
                  <div key={title} className="rounded-xl border border-[color:var(--border)] bg-sf-surface/70 p-5">
                    <div className="font-code text-xs text-sf-primary">{String(index + 1).padStart(2, "0")}</div>
                    <h3 className="font-display mt-3 text-xl font-bold text-sf-t1">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-sf-t2">{text}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Using SentinelFi">
              <div className="grid gap-4 md:grid-cols-2">
                {features.map(([Icon, title, text]) => (
                  <div key={title} className="rounded-xl border border-[color:var(--border)] bg-sf-surface/70 p-5">
                    <Icon className="h-5 w-5 text-sf-primary" />
                    <h3 className="font-display mt-4 text-xl font-bold text-sf-t1">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-sf-t2">{text}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Security checks">
              <p>
                A security check is a risk review for a wallet, contract, token, or protocol route. SentinelFi uses it before actions like staking, swapping, rebalancing, or quarantining suspicious assets.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((label, index) => (
                  <div key={label} className="rounded-xl border border-[color:var(--border)] bg-sf-surface/70 p-4">
                    <div className={`font-code text-xs ${index === 0 ? "text-sf-ok" : index === 1 ? "text-sf-warn" : index === 2 ? "text-sf-danger" : "text-sf-critical"}`}>
                      {label}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-sf-t2">
                      {index === 0 && "Looks safe based on the current signal."}
                      {index === 1 && "Worth watching before you proceed."}
                      {index === 2 && "Risky enough to slow down or avoid."}
                      {index === 3 && "Blocked or quarantined by default."}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Payments">
              <p>
                SentinelFi pays for fresh security intelligence when a protected action needs a risk verdict. You see the cost in the interface, and the receipt is attached to the action history.
              </p>
              <div className="mt-5 rounded-xl border border-sf-x402/20 bg-sf-x402/10 p-5">
                <div className="font-code flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-sf-x402">
                  <CircleDollarSign className="h-4 w-4" />
                  Security intelligence payment
                </div>
                <p className="mt-3 text-sm leading-6 text-sf-t2">
                  The agent pays only when it needs a security verdict. That keeps the security check tied to the specific action being considered.
                </p>
              </div>
            </Section>

            <Section title="Policy">
              <p>
                Policy is the rule set that keeps the agent inside your limits. It defines when SentinelFi can recommend, pause, block, or ask you to approve an action.
              </p>
              <div className="mt-5 space-y-3">
                {policyItems.map(([title, text]) => (
                  <div key={title} className="rounded-xl border border-[color:var(--border)] bg-sf-surface/70 p-4">
                    <div className="text-sm font-medium text-sf-t1">{title}</div>
                    <div className="mt-1 text-sm text-sf-t2">{text}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="History">
              <p>
                The history page shows what the agent recommended, what was approved, what was blocked, the security verdict at the time, and the x402 payment receipt. This gives you a readable audit trail for the portfolio.
              </p>
            </Section>

            <Section title="Safety">
              <div className="grid gap-4 md:grid-cols-4">
                {steps.map(([n, title, text]) => (
                  <div key={n} className="rounded-xl border border-[color:var(--border)] bg-sf-surface/70 p-4">
                    <div className="font-code text-xs text-sf-primary">{n}</div>
                    <div className="font-display mt-3 text-lg font-bold text-sf-t1">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-sf-t2">{text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                SentinelFi is designed to make the safest path visible before money moves. The agent can help automate DeFi, but the policy layer and approval flow keep the user in control.
              </p>
            </Section>
          </div>
        </article>
      </div>
    </main>
  );
}
