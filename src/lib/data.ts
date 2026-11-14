import themesJson from "../../data/themes.json";
import requestsJson from "../../data/requests.json";
import decisionsJson from "../../data/decisions.json";
import type { Decision, Request, Theme, ThemeStatus } from "./types";

const themes = themesJson.themes as Theme[];
const requests = requestsJson.requests as Request[];
const decisions = decisionsJson as Decision[];

export const STATUSES: { id: ThemeStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "triaged", label: "Triaged" },
  { id: "in-spec", label: "In spec" },
  { id: "done", label: "Done" },
];

const themeByRequestId = new Map<string, Theme>(
  themes.flatMap((t) => t.requestIds.map((id) => [id, t] as const)),
);

export function getThemes(): Theme[] {
  return themes;
}

export function getTheme(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function getThemeForRequest(requestId: string): Theme | undefined {
  return themeByRequestId.get(requestId);
}

export function getRequests(): Request[] {
  return [...requests].sort((a, b) => b.date.localeCompare(a.date));
}

export function getRequestsForTheme(themeId: string): Request[] {
  const ids = new Set(getTheme(themeId)?.requestIds ?? []);
  return getRequests().filter((r) => ids.has(r.id));
}

export function getDecisions(): Decision[] {
  return [...decisions].sort((a, b) => b.id.localeCompare(a.id));
}
