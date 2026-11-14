"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Badge, { channelTone } from "@/components/Badge";
import Flags from "@/components/Flags";
import type { Request } from "@/lib/types";

export type RequestRow = Request & { theme: { id: string; name: string } | null };

type SortKey = "id" | "operator" | "operatorSize" | "channel" | "theme" | "date";
type Dir = "asc" | "desc";

const columns: { key: SortKey | null; label: string; className?: string }[] = [
  { key: "id", label: "ID" },
  { key: "operator", label: "Operator" },
  { key: "operatorSize", label: "Bookings/mo", className: "text-right" },
  { key: null, label: "Request" },
  { key: "channel", label: "Channel" },
  { key: "theme", label: "Theme" },
  { key: "date", label: "Date" },
];

function value(row: RequestRow, key: SortKey): string | number | null {
  if (key === "theme") return row.theme?.name ?? null;
  return row[key];
}

export default function RequestsTable({ rows }: { rows: RequestRow[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir }>({ key: "date", dir: "desc" });

  const sorted = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a, sort.key);
      const vb = value(b, sort.key);
      // Rows without a value (unclustered) always go last.
      if (va === null && vb === null) return a.id.localeCompare(b.id);
      if (va === null) return 1;
      if (vb === null) return -1;
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return cmp * factor || a.id.localeCompare(b.id);
    });
  }, [rows, sort]);

  function toggle(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "date" || key === "operatorSize" ? "desc" : "asc" },
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            {columns.map((c) => {
              const active = c.key !== null && sort.key === c.key;
              return (
                <th
                  key={c.label}
                  scope="col"
                  aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={`px-4 py-2.5 font-medium ${c.className ?? ""}`}
                >
                  {c.key ? (
                    <button
                      type="button"
                      onClick={() => toggle(c.key as SortKey)}
                      className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-neutral-900 ${active ? "text-neutral-900" : ""}`}
                    >
                      {c.label}
                      <span aria-hidden className={active ? "" : "text-neutral-300"}>
                        {active ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 align-top">
          {sorted.map((r) => (
            <tr key={r.id} className="hover:bg-neutral-50">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <p className="text-neutral-900">{r.operator}</p>
                <p className="text-xs text-neutral-500">
                  <Flags countries={[r.country]} /> {r.country}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-neutral-600">
                {r.operatorSize.toLocaleString("en-US")}
              </td>
              <td className="max-w-md px-4 py-3 leading-relaxed text-neutral-700">{r.text}</td>
              <td className="px-4 py-3">
                <Badge tone={channelTone[r.channel]}>{r.channel}</Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {r.theme ? (
                  <Link href={`/requirement/${r.theme.id}`} className="text-neutral-900 underline-offset-2 hover:underline">
                    {r.theme.name}
                  </Link>
                ) : (
                  <span className="text-neutral-400">Unclustered</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 tabular-nums text-neutral-500">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
