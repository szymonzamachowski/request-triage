import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

/** Runs ffmpeg and resolves with { stdout: Buffer, stderr: string }. */
export function ffmpeg(args, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, ["-hide_banner", "-y", ...args], { cwd });
    const out = [];
    let err = "";
    p.stdout.on("data", (d) => out.push(d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve({ stdout: Buffer.concat(out), stderr: err }) : reject(new Error(`ffmpeg exited ${code}\n${err.slice(-2000)}`)),
    );
  });
}

/**
 * Exact duration in seconds: decodes the file to raw 48 kHz mono PCM and counts samples.
 * More precise than container metadata (which can include AAC priming/padding).
 */
export async function audioDuration(file) {
  const rate = 48000;
  const { stdout } = await ffmpeg(["-i", file, "-f", "s16le", "-ac", "1", "-ar", String(rate), "-"]);
  return stdout.length / 2 / rate;
}
