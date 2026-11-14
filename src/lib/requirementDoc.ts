import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "requirements");

/**
 * Reads data/requirements/<themeId>.md if it exists.
 * Returns the document body starting at the first "## " section; the title and
 * meta lines above it are already shown in the page header.
 */
export async function getRequirementDoc(themeId: string): Promise<string | null> {
  if (!/^[a-z0-9-]+$/.test(themeId)) return null;
  try {
    const md = await readFile(path.join(DIR, `${themeId}.md`), "utf8");
    const start = md.search(/^## /m);
    return start === -1 ? md : md.slice(start);
  } catch {
    return null;
  }
}
