import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const W = 1920;
const H = 1080;
const CURSOR_SCRIPT = fileURLToPath(new URL("./cursor.js", import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Plays every scene in one recorded browser session.
 * Each scene lasts exactly its planned duration (audio + padding): after its actions run,
 * the script waits out the rest. Returns when each scene actually started, in seconds
 * from the start of the recording.
 */
export async function record(config, voice, outDir) {
  const rawDir = path.join(outDir, "raw");
  const browser = await chromium.launch();
  try {
    return await recordWith(browser, config, voice, outDir, rawDir);
  } finally {
    await browser.close();
  }
}

async function recordWith(browser, config, voice, outDir, rawDir) {
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: rawDir, size: { width: W, height: H } },
  });
  await context.addInitScript({ path: CURSOR_SCRIPT });
  const page = await context.newPage();
  const t0 = performance.now(); // the recording starts with the page
  const now = () => performance.now() - t0;
  const mouse = { x: W / 2, y: H / 2 };

  const url = (u) => new URL(u, config.baseUrl).toString();
  async function goto(u) {
    await page.goto(url(u), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(mouse.x, mouse.y);
  }

  async function moveTo(x, y, ms = 650) {
    const from = { ...mouse };
    const steps = Math.max(1, Math.round(ms / 16));
    for (let i = 1; i <= steps; i++) {
      const k = ease(i / steps);
      mouse.x = from.x + (x - from.x) * k;
      mouse.y = from.y + (y - from.y) * k;
      await page.mouse.move(mouse.x, mouse.y);
      await sleep(16);
    }
  }

  function locate(text, exact = false) {
    return page.getByText(text, { exact }).filter({ visible: true }).first();
  }

  /** Smoothly animates window scroll to targetY over ms using requestAnimationFrame. */
  async function smoothScroll(targetY, ms) {
    await page.evaluate(
      ({ targetY, ms }) =>
        new Promise((resolve) => {
          const max = document.scrollingElement.scrollHeight - innerHeight;
          const to = Math.max(0, Math.min(max, targetY));
          const from = scrollY;
          const start = performance.now();
          const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
          const step = (ts) => {
            const t = Math.min(1, (ts - start) / ms);
            scrollTo(0, from + (to - from) * ease(t));
            t < 1 ? requestAnimationFrame(step) : resolve();
          };
          requestAnimationFrame(step);
        }),
      { targetY, ms },
    );
  }

  async function scrollTarget(to) {
    if (to === "bottom") return page.evaluate(() => document.scrollingElement.scrollHeight);
    if (to === "top") return 0;
    if (typeof to === "number") return to;
    const el = locate(to.text, to.exact);
    return el.evaluate((node, offset) => node.getBoundingClientRect().top + scrollY - offset, to.offset ?? 140);
  }

  /** Returns the element's bounding box, smoothly scrolling it into view first if needed. */
  async function centreOf(text, exact) {
    const el = locate(text, exact);
    await el.waitFor({ state: "visible", timeout: 10_000 });
    let box = await el.boundingBox();
    if (box.y < 80 || box.y + box.height > H - 160) {
      const y = await el.evaluate((n) => n.getBoundingClientRect().top + scrollY - innerHeight / 3);
      await smoothScroll(y, 900);
      box = await el.boundingBox();
    }
    return box;
  }

  // Hover just left of the text so the cursor never covers it; click inside the element.
  const hoverPoint = (box) =>
    box.x > 24 ? { x: box.x - 14, y: box.y + box.height / 2 } : { x: box.x + box.width / 2, y: box.y + box.height + 10 };
  const clickPoint = (box) => ({ x: box.x + Math.min(box.width / 2, 120), y: box.y + box.height / 2 });

  async function runAction(a) {
    const started = performance.now();
    switch (a.type) {
      case "navigate":
        if (page.url() !== url(a.url)) await goto(a.url);
        break;
      case "pause":
        await sleep(a.ms);
        break;
      case "scroll":
        await smoothScroll(await scrollTarget(a.to), a.ms ?? 2500);
        break;
      case "hover": {
        const c = hoverPoint(await centreOf(a.text, a.exact));
        await moveTo(c.x, c.y);
        await sleep((a.ms ?? 1200) - (performance.now() - started));
        break;
      }
      case "click": {
        const c = clickPoint(await centreOf(a.text, a.exact));
        await moveTo(c.x, c.y);
        await sleep(180);
        await page.mouse.down();
        await sleep(90);
        await page.mouse.up();
        await sleep(350);
        break;
      }
      default:
        throw new Error(`Unknown action type: ${a.type}`);
    }
  }

  // Warm-up outside the timed scenes: load the first page so the video doesn't start blank.
  await goto(config.scenes[0].url);

  const timeline = [];
  for (const [i, scene] of config.scenes.entries()) {
    const planned = voice[i].duration * 1000;
    const start = now();
    for (const action of scene.actions) await runAction(action);
    const used = now() - start;
    if (used > planned) {
      console.warn(`  ! scene ${i + 1} (${scene.id}) actions took ${(used / 1000).toFixed(2)} s, planned ${(planned / 1000).toFixed(2)} s`);
    }
    await sleep(planned - used);
    timeline.push({ ...voice[i], start: start / 1000, actual: (now() - start) / 1000 });
    console.log(`  scene ${i + 1} (${scene.id}) recorded at ${(start / 1000).toFixed(2)} s`);
  }

  const video = page.video();
  await context.close();
  const file = path.join(outDir, "recording.webm");
  await video.saveAs(file);
  await rm(rawDir, { recursive: true, force: true });
  return { file, timeline };
}
