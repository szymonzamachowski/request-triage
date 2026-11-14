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
}

export interface UnclusteredRequest {
  id: string;
  operator: string;
  text: string;
  reason: string;
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
  date: string;
  title: string;
  context: string;
  decision: string;
}

/** A theme enriched with its requests, ready for the UI. */
export interface ThemeView extends TriageTheme {
  rank: number;
  column: Column;
  countries: string[];
  requests: Request[];
}
