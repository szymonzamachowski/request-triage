import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge, { EffortBadge, PainBadge, channelTone } from "@/components/Badge";
import Flags from "@/components/Flags";
import { COLUMNS, getRequirement, getTheme, getThemes } from "@/lib/data";

type Props = { params: Promise<{ themeId: string }> };

export function generateStaticParams() {
  return getThemes().map((t) => ({ themeId: t.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { themeId } = await params;
  return { title: getTheme(themeId)?.name ?? "Requirement" };
}

function Section({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      {items.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-neutral-400">{empty}</p>
      )}
    </section>
  );
}

export default async function RequirementPage({ params }: Props) {
  const { themeId } = await params;
  const theme = getTheme(themeId);
  if (!theme) notFound();

  const requirement = getRequirement(theme.id);
  const column = COLUMNS.find((c) => c.id === theme.column)?.label ?? theme.column;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <article className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900">
          ← Board
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{theme.name}</h1>
          <Badge tone={theme.column === "now" ? "green" : theme.column === "next" ? "blue" : "neutral"}>{column}</Badge>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          #{theme.rank} · score {theme.score.toFixed(2)} · {theme.operatorsAsking} operators{" "}
          <Flags countries={theme.countries} />
          {requirement && <> · owner: {requirement.owner}</>}
        </p>

        <dl className="mt-5 space-y-2 rounded-md bg-neutral-50 p-4 text-sm">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0">
              <PainBadge value={theme.pain.value} />
            </dt>
            <dd className="text-neutral-600">{theme.pain.reason}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0">
              <EffortBadge value={theme.effort.value} />
            </dt>
            <dd className="text-neutral-600">{theme.effort.reason}</dd>
          </div>
        </dl>

        {requirement ? (
          <div className="mt-8 space-y-7">
            <section>
              <h2 className="text-sm font-semibold text-neutral-900">Problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">{requirement.problem}</p>
            </section>
            <Section title="Goals" items={requirement.goals} empty="No goals defined yet." />
            <Section title="Acceptance criteria" items={requirement.acceptanceCriteria} empty="No acceptance criteria yet." />
            <Section title="Open questions" items={requirement.openQuestions} empty="No open questions." />
          </div>
        ) : (
          <p className="mt-8 text-sm text-neutral-400">No requirement written for this theme yet. Problem: {theme.problem}</p>
        )}
      </article>

      <aside>
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Source requests ({theme.requests.length})
        </h2>
        <ul className="mt-3 space-y-2">
          {theme.requests.map((r) => (
            <li key={r.id} className="rounded-md border border-neutral-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500">{r.id}</span>
                <Badge tone={channelTone[r.channel]}>{r.channel}</Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-800">{r.text}</p>
              <p className="mt-1.5 text-xs text-neutral-500">
                <Flags countries={[r.country]} /> {r.operator} · {r.date}
              </p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
