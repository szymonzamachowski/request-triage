import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { audioDuration, ffmpeg } from "./ffmpeg.mjs";

const run = promisify(execFile);

/** Generates scene-N.aiff with macOS `say`, converts to scene-N.m4a and measures it. */
export async function generateVoice(config, outDir) {
  const result = [];
  for (const [i, scene] of config.scenes.entries()) {
    const n = i + 1;
    const aiff = path.join(outDir, `scene-${n}.aiff`);
    const m4a = path.join(outDir, `scene-${n}.m4a`);
    await run("say", ["-v", config.voice, "-r", String(config.rate ?? 175), "-o", aiff, scene.narration]);
    await ffmpeg(["-i", aiff, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", m4a]);
    const audio = await audioDuration(m4a);
    const duration = audio + config.scenePadding;
    result.push({ id: scene.id, n, audioFile: m4a, audio, duration });
    console.log(`  scene ${n} (${scene.id}): audio ${audio.toFixed(3)} s → scene ${duration.toFixed(3)} s`);
  }
  return result;
}
