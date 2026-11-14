import type { Metadata } from "next";
import { getDecisions } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

const steps = [
  { title: "Collect", text: "Client requests arrive by call, ticket and email from tour operators." },
  { title: "Group", text: "Requests are grouped into themes by meaning, not keywords. One-offs stay unclustered." },
  { title: "Score", text: "Score = operators asking × pain × log₁₀(total bookings) ÷ effort (S=1, M=2, L=3)." },
  { title: "Prioritise", text: "The top theme goes to Now, themes 2–4 to Next, the rest to Inbox. Each theme has a requirement doc." },
];

export default function AboutPage() {
  const decisions = getDecisions();

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight">How it works</h1>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-xs font-medium text-neutral-400">Step {i + 1}</p>
            <p className="mt-1 text-sm font-medium text-neutral-900">{step.title}</p>
            <p className="mt-1 text-sm text-neutral-600">{step.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-lg font-semibold tracking-tight">Decisions log</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Kept in <code className="font-mono text-xs">data/decisions.json</code>.
      </p>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {decisions.map((d) => (
          <li key={d.id} className="p-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium text-neutral-900">
                <span className="mr-2 font-mono text-xs text-neutral-400">{d.id}</span>
                {d.title}
              </p>
              <time className="shrink-0 text-xs tabular-nums text-neutral-500">{d.date}</time>
            </div>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="inline font-medium text-neutral-700">Context: </dt>
                <dd className="inline text-neutral-600">{d.context}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-neutral-700">Decision: </dt>
                <dd className="inline text-neutral-600">{d.decision}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
