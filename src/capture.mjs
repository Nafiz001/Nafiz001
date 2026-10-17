// Screenshots the live projects into shots/<slug>.jpg, using the installed
// Chrome with its GPU (several are WebGL). A project whose shot comes from its
// own repository (a game mid-play, say) is listed in FROM_REPO and skipped.
//
//   node capture.mjs            every live project
//   node capture.mjs kirie      just these
import { chromium } from "playwright-core";
import { flagship, projects } from "./projects.mjs";

const FROM_REPO = new Set(["jjk-domain-expansion", "ghostline-threejs", "swarmlight-canvas", "gedis"]);

// Anything a page needs before it shows itself at its best.
const prepare = {
  kirie: async (page) => {
    await page.getByText("Open the book", { exact: true }).click();
    await page.waitForTimeout(5000);
  },
};

const chrome = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({
  executablePath: chrome,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const only = process.argv.slice(2);
for (const p of [flagship, ...projects]) {
  if (FROM_REPO.has(p.slug) || (only.length && !only.includes(p.slug))) continue;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const res = await page.goto(p.live, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(7000);
  await prepare[p.slug]?.(page);
  await page.screenshot({ path: `shots/${p.slug}.jpg`, type: "jpeg", quality: 90 });
  console.log(`${p.slug}: ${res?.status()}${errors.length ? "  page errors: " + errors.length : ""}`);
  await ctx.close();
}
await browser.close();
