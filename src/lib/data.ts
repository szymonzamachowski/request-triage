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
const decisions = decisionsJson as Decision[];

export const COLUMNS: { id: Column; label: string; hint: string }[] = [
  { id: "inbox", label: "Inbox", hint: "Lower score and unclustered requests" },
  { id: "next", label: "Next", hint: "Themes ranked 2–4" },
  { id: "now", label: "Now", hint: "Top-scoring theme" },
];

function columnForRank(rank: number): Column {
  if (rank === 1) return "now";
  if (rank <= 4) return "next";
  return "inbox";
}

const byDateDesc = (a: Request, b: Request) => b.date.localeCompare(a.date);

const themeViews: ThemeView[] = triageThemes.map((t, i) => {
  const themeRequests = t.requestIds
    .map((id) => requestById.get(id))
    .filter((r): r is Request => Boolean(r))
    .sort(byDateDesc);
  return {
    ...t,
    rank: i + 1,
    column: columnForRank(i + 1),
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

export function getRequests(): Request[] {
  return [...requests].sort(byDateDesc);
}

export function getRequirement(themeId: string): Requirement | undefined {
  return requirements.find((r) => r.themeId === themeId);
}

export function getDecisions(): Decision[] {
  return [...decisions].sort((a, b) => b.id.localeCompare(a.id));
}
