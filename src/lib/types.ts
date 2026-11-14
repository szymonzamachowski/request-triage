export type ThemeStatus = "new" | "triaged" | "in-spec" | "done";
export type Priority = "low" | "medium" | "high";
export type Source = "email" | "slack" | "support" | "sales";

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
  requirement: Requirement;
}

export interface Request {
  id: string;
  title: string;
  source: Source;
  requester: string;
  receivedAt: string;
  priority: Priority;
  themeId: string | null;
}

export interface Decision {
  id: string;
  date: string;
  title: string;
  context: string;
  decision: string;
}
