import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Returns the verbatim prompt from the first ```text block in data/PROMPT.md. */
export async function getTriagePrompt(): Promise<string> {
  const md = await readFile(path.join(process.cwd(), "data", "PROMPT.md"), "utf8");
  const match = md.match(/```text\n([\s\S]*?)```/);
  if (!match) throw new Error("No ```text block found in data/PROMPT.md");
  return match[1].trim();
}
