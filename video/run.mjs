#!/usr/bin/env node
// Builds the demo video end to end: voice → recording → captions → render → open.
// Usage: npm run video [-- --no-open]   (VIDEO_BASE_URL overrides scenes.json baseUrl)
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSrt } from "./lib/captions.mjs";
import { record } from "./lib/record.mjs";
import { render } from "./lib/render.mjs";
import { generateVoice } from "./lib/voice.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "out");
const config = JSON.parse(await readFile(path.join(root, "scenes.json"), "utf8"));
if (process.env.VIDEO_BASE_URL) config.baseUrl = process.env.VIDEO_BASE_URL;
await mkdir(outDir, { recursive: true });

console.log(`1/4 Voice (say -v "${config.voice}" -r ${config.rate ?? 175})`);
const voice = await generateVoice(config, outDir);

console.log(`2/4 Recording ${config.baseUrl} (Chromium 1920×1080)`);
const { file: recording, timeline } = await record(config, voice, outDir);

console.log("3/4 Captions");
const lead = timeline[0].start;
const srt = path.join(outDir, "captions.srt");
await writeFile(
  srt,
  buildSrt(timeline.map((t, i) => ({ narration: config.scenes[i].narration, offset: t.start - lead, audio: t.audio }))),
);
await writeFile(path.join(outDir, "timeline.json"), JSON.stringify({ lead, scenes: timeline }, null, 2));

console.log("4/4 Render");
const { file, total } = await render({ recording, timeline, srt, outDir });
console.log(`\nDone: ${path.relative(process.cwd(), file)} (${total.toFixed(1)} s)`);
if (total >= 120) console.warn(`! Video is ${total.toFixed(1)} s – over the 2-minute target. Shorten the narration in scenes.json.`);

if (!process.argv.includes("--no-open") && process.platform === "darwin") {
  execFile("open", [file]);
}
