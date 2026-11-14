export type ThemeStatus = "new" | "triaged" | "in-spec" | "done";
export type Channel = "call" | "ticket" | "email";

export interface Requirement {
  problem: string;
  goals: string[];
  acceptanceCriteria: string[];
  openQuestions: string[];
}

export interface Theme {
  id: string;
  name: string;
  summary: string;
  status: ThemeStatus;
  owner: string;
  requestIds: string[];
  requirement: Requirement;
}

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

export interface Decision {
  id: string;
  date: string;
  title: string;
  context: string;
  decision: string;
}
