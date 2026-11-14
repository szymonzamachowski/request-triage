export type Channel = "call" | "ticket" | "email";
export type Effort = "S" | "M" | "L";
export type Column = "now" | "next" | "inbox";

export interface Request {
  id: string;
  operator: string;
  country: string;
  /** Bookings per month */
  operatorSize: number;
  channel: Channel;
  date: string;
  text: string;
}

export interface TriageTheme {
  id: string;
  name: string;
  problem: string;
  requestIds: string[];
  operatorsAsking: number;
  operators: string[];
  totalBookings: number;
  pain: { value: 1 | 2 | 3; reason: string };
  effort: { value: Effort; reason: string };
  score: number;
  /** Manual product decision that places the theme in a column regardless of score. */
  override?: { column: Column; by: string; reason: string };
  firstStep?: string;
}

export interface Disposition {
  type: "support" | "backlog";
  label: string;
  by: string;
  reason?: string;
}

export interface UnclusteredRequest {
  id: string;
  operator: string;
  text: string;
  reason: string;
  disposition?: Disposition;
}

export interface Requirement {
  themeId: string;
  owner: string;
  problem: string;
  goals: string[];
  acceptanceCriteria: string[];
  openQuestions: string[];
}

export interface Decision {
  id: string;
  author?: string;
  date: string;
  title: string;
  context: string;
  decision: string;
}

/** A theme enriched with its requests, ready for the UI. */
export interface ThemeView extends TriageTheme {
  /** Rank by score (1 = highest), regardless of overrides. */
  rank: number;
  column: Column;
  /** e.g. "#1 by score · spec ready, next up" */
  rankNote: string;
  hasSpec: boolean;
  countries: string[];
  requests: Request[];
}
