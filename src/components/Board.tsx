"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Badge, { EffortBadge, PainBadge, channelTone } from "@/components/Badge";
import DispositionLabel from "@/components/Disposition";
import Flags from "@/components/Flags";
import { FirstStep, OverrideBadge, OverrideReason } from "@/components/Override";
import type { Column, Disposition, Request, ThemeView } from "@/lib/types";

export type UnclusteredItem = { id: string; reason: string; disposition?: Disposition; request: Request };

type Selection = { kind: "theme"; id: string } | { kind: "request"; id: string } | null;

interface Props {
  columns: { id: Column; label: string; hint: string }[];
  themes: ThemeView[];
  unclustered: UnclusteredItem[];
}

export default function Board({ columns, themes, unclustered }: Props) {
  const top = themes.find((t) => t.column === "now");
  const [selected, setSelected] = useState<Selection>(top ? { kind: "theme", id: top.id } : null);
  const panelRef = useRef<HTMLElement>(null);

  function select(next: Selection) {
    setSelected(next);
    // On narrow screens the panel sits below the columns, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const selectedTheme = selected?.kind === "theme" ? themes.find((t) => t.id === selected.id) : undefined;
  const selectedRequest = selected?.kind === "request" ? unclustered.find((u) => u.id === selected.id) : undefined;

  return (
    <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_340px]">
      {columns.map((col) => {
        const colThemes = themes.filter((t) => t.column === col.id);
        const colUnclustered = col.id === "inbox" ? unclustered : [];
        const count = colThemes.length + colUnclustered.length;
        return (
          <section
            key={col.id}
            aria-labelledby={`col-${col.id}`}
            className={`rounded-lg p-3 ${col.id === "now" ? "bg-neutral-900/[0.04] ring-1 ring-neutral-900/10" : "bg-neutral-100/70"}`}
          >
            <header className="mb-3 px-1">
              <h2
                id={`col-${col.id}`}
                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-600"
              >
                {col.label}
                <span className="tabular-nums font-normal text-neutral-400">{count}</span>
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">{col.hint}</p>
            </header>

            <ul className="space-y-2">
              {colThemes.map((t) => {
                const active = selected?.kind === "theme" && selected.id === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => select({ kind: "theme", id: t.id })}
                      className={`block w-full rounded-md border bg-white p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                        active ? "border-neutral-900 shadow-sm" : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                        <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-neutral-900" title="Score">
                          {t.score.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500">{t.rankNote}</p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-neutral-500">
                        <span>
                          {t.operatorsAsking} operator{t.operatorsAsking === 1 ? "" : "s"}
                        </span>
                        <Flags countries={t.countries} />
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <PainBadge value={t.pain.value} />
                        <EffortBadge value={t.effort.value} />
                        {t.override && <OverrideBadge override={t.override} />}
                      </div>
                      {t.override && <OverrideReason override={t.override} className="mt-2.5" />}
                      {t.firstStep && <FirstStep text={t.firstStep} className="mt-2" />}
                    </button>
                  </li>
                );
              })}

              {colUnclustered.map((u) => {
                const active = selected?.kind === "request" && selected.id === u.id;
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => select({ kind: "request", id: u.id })}
                      className={`block w-full rounded-md border border-dashed bg-white/60 p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                        active ? "border-neutral-900" : "border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <DispositionLabel disposition={u.disposition} className="font-medium" />
                        <Flags countries={[u.request.country]} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-700">{u.request.text}</p>
                      <p className="mt-1 text-xs text-neutral-500">{u.request.operator}</p>
                      {u.disposition?.reason && <p className="mt-1.5 text-xs text-neutral-600">{u.disposition.reason}</p>}
                    </button>
                  </li>
                );
              })}

              {count === 0 && <li className="px-1 py-4 text-xs text-neutral-400">Empty</li>}
            </ul>
          </section>
        );
      })}

      <aside ref={panelRef} aria-live="polite" className="scroll-mt-4 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          {selectedTheme ? (
            <ThemeDetail theme={selectedTheme} />
          ) : selectedRequest ? (
            <UnclusteredDetail item={selectedRequest} />
          ) : (
            <p className="text-sm text-neutral-400">Select a card to see its requests.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function ThemeDetail({ theme }: { theme: ThemeView }) {
  return (
    <div>
      <p className="text-xs text-neutral-500">
        {theme.rankNote} · score <span className="font-mono tabular-nums text-neutral-700">{theme.score.toFixed(2)}</span>
      </p>
      <h3 className="mt-1 text-base font-semibold tracking-tight text-neutral-900">{theme.name}</h3>
      <p className="mt-1 text-sm text-neutral-600">{theme.problem}</p>

      {theme.override && (
        <div className="mt-3 space-y-2">
          <OverrideBadge override={theme.override} />
          <OverrideReason override={theme.override} />
        </div>
      )}
      {theme.firstStep && <FirstStep text={theme.firstStep} className="mt-2" />}

      <dl className="mt-3 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0">
            <PainBadge value={theme.pain.value} />
          </dt>
          <dd className="text-neutral-600">{theme.pain.reason}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0">
            <EffortBadge value={theme.effort.value} />
          </dt>
          <dd className="text-neutral-600">{theme.effort.reason}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-neutral-500">
        {theme.operatorsAsking} operators · {theme.totalBookings.toLocaleString("en-US")} bookings/mo combined
      </p>

      <Link
        href={`/requirement/${theme.id}`}
        className="mt-3 inline-flex rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
      >
        Open requirement →
      </Link>

      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Requests ({theme.requests.length})
      </h4>
      <ul className="mt-2 space-y-2">
        {theme.requests.map((r) => (
          <RequestItem key={r.id} request={r} />
        ))}
      </ul>
    </div>
  );
}

function UnclusteredDetail({ item }: { item: UnclusteredItem }) {
  return (
    <div>
      <DispositionLabel disposition={item.disposition} className="text-xs font-medium uppercase tracking-wide" />
      {item.disposition?.reason && (
        <p className="mt-2 text-sm text-neutral-700">
          {item.disposition.reason} <span className="text-neutral-400">— {item.disposition.by}</span>
        </p>
      )}
      {item.disposition?.type === "support" && (
        <p className="mt-2 text-sm text-neutral-700">
          Handled by support, not by product. <span className="text-neutral-400">— {item.disposition.by}</span>
        </p>
      )}
      <p className="mt-2 text-sm text-neutral-500">Triage note: {item.reason}</p>
      <ul className="mt-3">
        <RequestItem request={item.request} />
      </ul>
    </div>
  );
}

function RequestItem({ request: r }: { request: Request }) {
  return (
    <li className="rounded-md bg-neutral-50 p-2.5">
      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
        <span>
          <Flags countries={[r.country]} /> {r.operator}
        </span>
        <Badge tone={channelTone[r.channel]}>{r.channel}</Badge>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-800">{r.text}</p>
      <p className="mt-1 font-mono text-[11px] text-neutral-400">
        {r.id} · {r.date}
      </p>
    </li>
  );
}
