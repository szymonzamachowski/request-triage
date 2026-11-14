import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import requestsJson from "../../data/requests.json";
import triageJson from "../../data/triage.json";
import requirementsJson from "../../data/requirements.json";
import decisionsJson from "../../data/decisions.json";
import type {
  Column,
  Decision,
  Request,
  Requirement,
  ThemeView,
  TriageTheme,
  UnclusteredRequest,
} from "./types";

const requests = requestsJson.requests as Request[];
const requestById = new Map(requests.map((r) => [r.id, r]));
const triageThemes = [...(triageJson.themes as TriageTheme[])].sort((a, b) => b.score - a.score);
const unclustered = triageJson.unclustered as UnclusteredRequest[];
const requirements = requirementsJson.requirements as Requirement[];
const decisions = decisionsJson as { product: Decision[]; technical: Decision[] };

export const COLUMNS: { id: Column; label: string; hint: string }[] = [
  { id: "inbox", label: "Inbox", hint: "Everything else, incl. one-off requests" },
  { id: "next", label: "Next", hint: "Up to 3 themes, next by score" },
  { id: "now", label: "Now", hint: "1 theme – manual override or top score" },
];

/** How many themes each column holds before the rest overflow into Inbox. */
const CAPACITY: Record<Column, number> = { now: 1, next: 3, inbox: Infinity };
const FILL_ORDER: Column[] = ["now", "next", "inbox"];

/**
 * Themes with a manual override go to their override column first.
 * The remaining themes follow the score and fill Now → Next → Inbox up to each column's capacity.
 */
function assignColumns(themes: TriageTheme[]): Map<string, Column> {
  const placed = new Map<string, Column>();
  const used: Record<Column, number> = { now: 0, next: 0, inbox: 0 };
  for (const t of themes) {
    if (t.override) {
      placed.set(t.id, t.override.column);
      used[t.override.column]++;
    }
  }
  for (const t of themes) {
    if (placed.has(t.id)) continue;
    const column = FILL_ORDER.find((c) => used[c] < CAPACITY[c]) ?? "inbox";
    placed.set(t.id, column);
    used[column]++;
  }
  return placed;
}

const columnLabel = (c: Column) => COLUMNS.find((x) => x.id === c)?.label ?? c;
const hasSpecDoc = (id: string) => existsSync(path.join(process.cwd(), "data", "requirements", `${id}.md`));
const byDateDesc = (a: Request, b: Request) => b.date.localeCompare(a.date);

const columns = assignColumns(triageThemes);

const themeViews: ThemeView[] = triageThemes.map((t, i) => {
  const rank = i + 1;
  const column = columns.get(t.id) ?? "inbox";
  const hasSpec = hasSpecDoc(t.id);
  const themeRequests = t.requestIds
    .map((id) => requestById.get(id))
    .filter((r): r is Request => Boolean(r))
    .sort(byDateDesc);

  let rankNote = `#${rank} by score`;
  if (t.override) rankNote += ` · moved to ${columnLabel(t.override.column)} by manual override`;
  else if (hasSpec && column === "next") rankNote += " · spec ready, next up";
  else if (hasSpec) rankNote += " · spec ready";

  return {
    ...t,
    rank,
    column,
    rankNote,
    hasSpec,
    countries: [...new Set(themeRequests.map((r) => r.country))],
    requests: themeRequests,
  };
});

const themeByRequestId = new Map(themeViews.flatMap((t) => t.requestIds.map((id) => [id, t] as const)));

export function getThemes(): ThemeView[] {
  return themeViews;
}

export function getTheme(id: string): ThemeView | undefined {
  return themeViews.find((t) => t.id === id);
}

export function getThemeForRequest(requestId: string): ThemeView | undefined {
  return themeByRequestId.get(requestId);
}

export function getUnclustered(): (UnclusteredRequest & { request: Request })[] {
  return unclustered.flatMap((u) => {
    const request = requestById.get(u.id);
    return request ? [{ ...u, request }] : [];
  });
}

export function getUnclusteredFor(requestId: string): UnclusteredRequest | undefined {
  return unclustered.find((u) => u.id === requestId);
}

export function getRequests(): Request[] {
  return [...requests].sort(byDateDesc);
}

export function getRequirement(themeId: string): Requirement | undefined {
  return requirements.find((r) => r.themeId === themeId);
}

export function getDecisions(): { product: Decision[]; technical: Decision[] } {
  return decisions;
}
