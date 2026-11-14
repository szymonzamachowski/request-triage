import type { Metadata } from "next";
import Link from "next/link";
import { getDecisions } from "@/lib/data";
import { getTriagePrompt } from "@/lib/prompt";

export const metadata: Metadata = { title: "About" };

const REPO = "https://github.com/szymonzamachowski/request-triage";

const steps = [
  {
    title: "Collect",
    text: "Client requests from tour operators arrive by call, ticket and email. Each request records the operator, their country, their size (bookings per month), the channel and the client's own words.",
  },
  {
    title: "Group by meaning",
    text: "An LLM groups the requests into themes by what clients need, not by the words they use. Requests that match no other request stay unclustered.",
  },
  {
    title: "Score",
    text: "Each theme gets a pain rating (1–3) and an effort rating (S/M/L), each with a one-sentence reason. Code then computes score = operators asking × pain × log₁₀(total bookings) ÷ effort weight.",
  },
  {
    title: "Prioritise",
    text: "The board puts theme #1 in Now, themes #2–4 in Next, and the rest plus unclustered requests in Inbox.",
  },
  {
    title: "Specify",
    text: "The top theme gets a full requirement doc: problem with client quotes, who is affected, user story, scope, Given/When/Then criteria, Definition of Done, a 30-day success metric and open questions.",
  },
];

const limitations = [
  "Read-only. Changing anything means editing the files in /data and redeploying. You can't edit, re-triage or comment in the UI.",
  "The grouping and the pain and effort ratings were produced once by an LLM and saved. They are judgment calls, not computed facts, and a new run could produce different results.",
  "The dataset is tiny (22 requests) and the score has never been checked against real outcomes. Total bookings stands in for impact; it doesn't measure revenue.",
  "Only the top theme has a full requirement doc. The others have short notes.",
  "No accounts or permissions. Everything is public.",
  "Country flags are emoji, so Windows shows them as letter codes (e.g. IS, GB).",
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-6 text-lg font-semibold tracking-tight text-neutral-900">
      {children}
    </h2>
  );
}

export default async function AboutPage() {
  const decisions = getDecisions();
  const prompt = await getTriagePrompt();

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight">About request-triage</h1>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Data is fictional.</p>
        <p className="mt-1">
          All tour operators, requests and quotes in this app are made up for demonstration. Any resemblance to real
          companies is coincidental. Bokun is a real booking platform and is mentioned only as an integration
          clients talk about.
        </p>
      </div>

      <H2 id="what">What it is</H2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        A small tool that turns a pile of client requests into a ranked list of themes and a requirement doc for the
        top one. It shows the whole path from &ldquo;what clients said&rdquo; to &ldquo;what we build next and
        how we&rsquo;ll know it worked&rdquo;. Every number on the board can be traced back to the requests behind it.
      </p>

      <H2 id="who">Who it&rsquo;s for</H2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700">
        <li>Product managers and founders of booking software for tour operators.</li>
        <li>Anyone who gets feature requests from many clients across support, sales and email and has to decide what comes first.</li>
        <li>Teams that want prioritisation decisions to be explainable: which clients asked, how much it hurts, and how hard it is to build.</li>
      </ul>

      <H2 id="how">How it works</H2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-900">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-neutral-500">
        Built with Next.js 15 (App Router), TypeScript and Tailwind CSS. Pages are prerendered as static HTML.
      </p>

      <H2 id="prompt">The prompt</H2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        This exact prompt produced <code className="font-mono text-xs">data/triage.json</code>. The model wrote the
        grouping, problem statements and the pain and effort ratings. A script computed the counts and scores.
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-neutral-100">
        {prompt}
      </pre>
      <p className="mt-2 text-xs text-neutral-500">
        Source:{" "}
        <a href={`${REPO}/blob/main/data/PROMPT.md`} className="underline underline-offset-2 hover:text-neutral-900">
          data/PROMPT.md
        </a>
      </p>

      <H2 id="decisions">Decisions log</H2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {decisions.map((d) => (
          <li key={d.id} className="p-4">
            <p className="text-sm font-medium text-neutral-900">
              <span className="mr-2 font-mono text-xs text-neutral-400">{d.id}</span>
              {d.title}
            </p>
            <dl className="mt-2 space-y-1 text-sm leading-relaxed">
              <div>
                <dt className="inline font-medium text-neutral-700">Why: </dt>
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

      <H2 id="limitations">Limitations</H2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-700">
        {limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
        Source code on{" "}
        <a href={REPO} className="text-neutral-900 underline underline-offset-2">
          GitHub
        </a>
        . Start at the <Link href="/" className="text-neutral-900 underline underline-offset-2">board</Link>.
      </p>
    </div>
  );
}
