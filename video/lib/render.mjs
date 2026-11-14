import path from "node:path";
import { ffmpeg } from "./ffmpeg.mjs";

const SUBTITLE_STYLE = [
  "FontName=Helvetica",
  "FontSize=8.5", // SRT is rendered at PlayResY 288 → about 32 px at 1080p
  "PrimaryColour=&H00FFFFFF", // white text
  "BackColour=&H55000000", // box: black, about 67% opaque
  "BorderStyle=4", // one box behind the whole caption (libass)
  "Outline=0",
  "Shadow=0",
  "Alignment=2", // bottom centre
  "MarginV=6", // close to the bottom edge (about 22 px)
].join(",");

/**
 * Trims the recording to the first scene, places each scene's audio at its start,
 * burns in the captions and writes demo.mp4.
 */
export async function render({ recording, timeline, srt, outDir, output = "demo.mp4" }) {
  const lead = timeline[0].start;
  const last = timeline.at(-1);
  // If the last scene overran its plan, keep its full recording.
  const total = last.start - lead + Math.max(last.duration, last.actual);

  const audioInputs = timeline.flatMap((s) => ["-i", path.basename(s.audioFile)]);
  const delays = timeline
    .map((s, i) => `[${i + 1}:a]adelay=${Math.round((s.start - lead) * 1000)}:all=1[a${i}]`)
    .join(";");
  const mixInputs = timeline.map((_, i) => `[a${i}]`).join("");
  const filter = [
    `[0:v]trim=start=${lead.toFixed(3)}:duration=${total.toFixed(3)},setpts=PTS-STARTPTS,fps=30,` +
      `subtitles=${path.basename(srt)}:force_style='${SUBTITLE_STYLE}'[v]`,
    delays,
    `${mixInputs}amix=inputs=${timeline.length}:normalize=0:dropout_transition=0,apad,atrim=0:${total.toFixed(3)}[a]`,
  ].join(";");

  await ffmpeg(
    [
      "-i", path.basename(recording),
      ...audioInputs,
      "-filter_complex", filter,
      "-map", "[v]", "-map", "[a]",
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k",
      "-movflags", "+faststart",
      "-t", total.toFixed(3),
      output,
    ],
    { cwd: outDir },
  );
  return { file: path.join(outDir, output), total };
}
