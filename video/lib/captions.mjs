const MAX_CHARS = 42; // per line
const MAX_LINES = 2;
const MAX_CUE = MAX_CHARS * MAX_LINES;
const CONJ = "and|but|or|so|then|that|which|because|while|where|as";
const CONJUNCTIONS = new RegExp(`\\s(?=(?:${CONJ}) )`, "g");
const STARTS_WITH_CONJ = new RegExp(`^(?:${CONJ}) `);

const words = (s) => s.split(/\s+/).filter(Boolean);

/**
 * Splits a sentence into phrases at commas, colons and semicolons (punctuation stays with the phrase).
 * Phrases of one or two words ("Hi,", "Given,", "Guide payouts,") are glued to the next one,
 * so lists like "Given, When, Then" are never cut apart.
 */
function phrases(sentence) {
  const parts = sentence.split(/(?<=[,;:])\s+/);
  const out = [];
  let carry = "";
  for (const p of parts) {
    const joined = carry ? `${carry} ${p}` : p;
    if (words(p).length <= 2 && p !== parts.at(-1)) carry = joined;
    else {
      out.push(joined);
      carry = "";
    }
  }
  if (carry) out.push(carry);
  return out;
}

/** A phrase that can't fit in one cue is split before a conjunction near its middle, or at the middle word as a last resort. */
function splitLong(phrase) {
  if (phrase.length <= MAX_CUE) return [phrase];
  const mid = phrase.length / 2;
  const candidates = [...phrase.matchAll(CONJUNCTIONS)].map((m) => m.index);
  let cut = candidates.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))[0];
  if (cut === undefined) {
    const w = words(phrase);
    cut = w.slice(0, Math.ceil(w.length / 2)).join(" ").length;
  }
  return [...splitLong(phrase.slice(0, cut).trim()), ...splitLong(phrase.slice(cut).trim())];
}

/** Wraps a cue into at most 2 balanced lines of ≤ MAX_CHARS, preferring a break after a comma. */
function wrap(text) {
  if (text.length <= MAX_CHARS) return [text];
  const w = words(text);
  let best = null;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" ");
    const b = w.slice(i).join(" ");
    if (a.length > MAX_CHARS || b.length > MAX_CHARS) continue;
    const cost = Math.max(a.length, b.length) - (/[,;:]$/.test(a) || STARTS_WITH_CONJ.test(b) ? 8 : 0);
    if (!best || cost < best.cost) best = { cost, lines: [a, b] };
  }
  return best ? best.lines : null;
}

/**
 * Splits narration into caption cues (arrays of 1–2 lines).
 * Cues break only at sentence or phrase boundaries (comma, colon, semicolon);
 * consecutive short phrases of the same sentence are merged while they still fit in 2 lines.
 */
export function toCues(text) {
  const cues = [];
  for (const sentence of text.trim().split(/(?<=[.!?])\s+/)) {
    let current = "";
    for (const phrase of phrases(sentence).flatMap(splitLong)) {
      const merged = current ? `${current} ${phrase}` : phrase;
      if (current && !wrap(merged)) {
        cues.push(wrap(current));
        current = phrase;
      } else {
        current = merged;
      }
    }
    if (current) cues.push(wrap(current) ?? wrap(current.slice(0, MAX_CUE)));
  }
  return cues;
}

const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

/**
 * Builds an SRT file. Within each scene, cues share the scene's audio duration
 * in proportion to their character count.
 * @param scenes [{ narration, offset (s, scene start in the final video), audio (s) }]
 */
export function buildSrt(scenes) {
  const blocks = [];
  for (const scene of scenes) {
    const cues = toCues(scene.narration);
    const total = cues.reduce((n, c) => n + c.join(" ").length, 0);
    let t = scene.offset;
    for (const cue of cues) {
      const d = (cue.join(" ").length / total) * scene.audio;
      blocks.push(`${blocks.length + 1}\n${ts(t)} --> ${ts(t + d)}\n${cue.join("\n")}\n`);
      t += d;
    }
  }
  return blocks.join("\n");
}
