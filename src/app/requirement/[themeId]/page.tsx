import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge, { priorityTone, statusTone } from "@/components/Badge";
import { STATUSES, getRequestsForTheme, getTheme, getThemes } from "@/lib/data";

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

  const requests = getRequestsForTheme(theme.id);
  const statusLabel = STATUSES.find((s) => s.id === theme.status)?.label ?? theme.status;
  const { requirement } = theme;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <article className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900">
          ← Board
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{theme.name}</h1>
          <Badge tone={statusTone[theme.status]}>{statusLabel}</Badge>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Owner: {theme.owner} · {requests.length} linked request{requests.length === 1 ? "" : "s"}
        </p>

        <div className="mt-8 space-y-7">
          <section>
            <h2 className="text-sm font-semibold text-neutral-900">Problem</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{requirement.problem}</p>
          </section>
          <Section title="Goals" items={requirement.goals} empty="No goals defined yet." />
          <Section title="Acceptance criteria" items={requirement.acceptanceCriteria} empty="No acceptance criteria yet." />
          <Section title="Open questions" items={requirement.openQuestions} empty="No open questions." />
        </div>
      </article>

      <aside>
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Source requests</h2>
        <ul className="mt-3 space-y-2">
          {requests.map((r) => (
            <li key={r.id} className="rounded-md border border-neutral-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500">{r.id}</span>
                <Badge tone={priorityTone[r.priority]}>{r.priority}</Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-900">{r.title}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {r.requester} · {r.source} · {r.receivedAt}
              </p>
            </li>
          ))}
          {requests.length === 0 && <li className="text-sm text-neutral-400">No linked requests.</li>}
        </ul>
      </aside>
    </div>
  );
}
