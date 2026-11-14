import themesJson from "../../data/themes.json";
import requestsJson from "../../data/requests.json";
import decisionsJson from "../../data/decisions.json";
import type { Decision, Request, Theme, ThemeStatus } from "./types";

const themes = themesJson as Theme[];
const requests = requestsJson as Request[];
const decisions = decisionsJson as Decision[];

export const STATUSES: { id: ThemeStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "triaged", label: "Triaged" },
  { id: "in-spec", label: "In spec" },
  { id: "done", label: "Done" },
];

export function getThemes(): Theme[] {
  return themes;
}

export function getTheme(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function getRequests(): Request[] {
  return [...requests].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

export function getRequestsForTheme(themeId: string): Request[] {
  return getRequests().filter((r) => r.themeId === themeId);
}

export function getDecisions(): Decision[] {
  return [...decisions].sort((a, b) => b.id.localeCompare(a.id));
}
