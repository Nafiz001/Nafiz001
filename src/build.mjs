// Builds the profile's images into ../assets:
//
//   hero.svg              the night sky: name, a line about the work, and a
//                         constellation whose stars are the projects. Animated
//                         with CSS (lines draw in, stars twinkle) and still
//                         for anyone who prefers reduced motion. Fonts are
//                         subset and embedded, so it renders the same anywhere.
//   cards/<slug>.webp     one card per project, from HTML rendered by Chrome
//   cards/vernissage.webp the flagship card, animated from Vernissage's tour
//
// Needs Chrome (CHROME=path to override) and ffmpeg on PATH.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import subsetFont from "subset-font";
import { makePanels } from "./panels.mjs";
import { flagship, links as contact, moreLive, projects, stack } from "./projects.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const assets = resolve(here, "../assets");
const cache = join(here, ".cache");
mkdirSync(join(assets, "cards"), { recursive: true });
mkdirSync(cache, { recursive: true });

const fontFile = {
  fell: "im-fell-english/400Regular/IMFellEnglish_400Regular.ttf",
  fellItalic: "im-fell-english/400Regular_Italic/IMFellEnglish_400Regular_Italic.ttf",
  hanken: "hanken-grotesk/400Regular/HankenGrotesk_400Regular.ttf",
  hankenMedium: "hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
};
const fontPath = (k) => join(here, "node_modules/@expo-google-fonts", fontFile[k]);

// The palette, from Asterism: a night sky, star gold, warm paper white.
const C = {
  skyTop: "#0A0F24",
  skyLow: "#18234A",
  ink: "#EFE8D8",
  soft: "#B4BAD0",
  faint: "#7D86A8",
  gold: "#E8C37A",
  line: "#E8C37A",
};

// ---------------------------------------------------------------------------
// hero.svg
// ---------------------------------------------------------------------------

const W = 1280;
const H = 560;

// Ten stars, one per project; the flagship is the brightest. Positions are
// laid out by hand so the lines read as one figure. `side` says where the
// label sits.
const stars = [
  { name: "Vernissage", x: 1012, y: 132, r: 5.2, side: "top", flagship: true },
  { name: "Ryōiki Tenkai", x: 1138, y: 212, r: 3.2, side: "right" },
  { name: "Vantage", x: 1188, y: 330, r: 3.0, side: "right" },
  { name: "Ghostline", x: 1090, y: 418, r: 3.4, side: "bottom" },
  { name: "Swarmlight", x: 952, y: 380, r: 2.8, side: "bottom" },
  { name: "ebru", x: 884, y: 252, r: 3.6, side: "left" },
  { name: "kirie", x: 790, y: 168, r: 3.0, side: "top" },
  { name: "Asterism", x: 764, y: 298, r: 3.4, side: "left" },
  { name: "lumen", x: 800, y: 404, r: 2.8, side: "left" },
  { name: "gedis", x: 744, y: 488, r: 3.0, side: "left" },
];
// The figure: a loop through the visual work, and a tail down through the
// systems projects.
const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7], [7, 8], [8, 9]];

const name = "Md. Nafiz Ahmed";
const about = [
  "I build databases, servers and compilers from scratch,",
  "and the 3D and multiplayer things that run on top of them.",
];
const note = "Every star here is a project, running live below.";
const tech = "Go  ·  Rust  ·  TypeScript  ·  C#  ·  Python  ·  C";
const place = "Khulna, Bangladesh";

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function embed(key, text) {
  const glyphs = [...new Set(text)].join("");
  const woff2 = await subsetFont(readFileSync(fontPath(key)), glyphs, { targetFormat: "woff2" });
  return `data:font/woff2;base64,${Buffer.from(woff2).toString("base64")}`;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function hero() {
  const labels = stars.map((s) => s.name);
  const fell = await embed("fell", name);
  const fellItalic = await embed("fellItalic", note + "Vernissage");
  const hanken = await embed("hanken", about.join("") + tech + place + labels.join(""));

  const rand = rng(20261017);
  let field = "";
  for (let i = 0; i < 170; i++) {
    const x = (rand() * W).toFixed(1);
    const y = (rand() * H).toFixed(1);
    const r = (0.35 + rand() ** 3 * 1.3).toFixed(2);
    const o = (0.25 + rand() * 0.6).toFixed(2);
    // A third of them twinkle, each on its own clock.
    const tw = rand() < 0.33
      ? ` class="tw" style="animation-duration:${(2.5 + rand() * 4).toFixed(1)}s;animation-delay:-${(rand() * 6).toFixed(1)}s"`
      : "";
    field += `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"${tw}/>`;
  }

  let lines = "";
  edges.forEach(([a, b], i) => {
    const s = stars[a], t = stars[b];
    lines += `<line class="ln" pathLength="1" x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" style="animation-delay:${(0.5 + i * 0.28).toFixed(2)}s"/>`;
  });

  let points = "";
  let names = "";
  stars.forEach((s, i) => {
    const delay = (0.4 + i * 0.22).toFixed(2);
    if (s.flagship) points += `<circle class="halo" cx="${s.x}" cy="${s.y}" r="30"/>`;
    points += `<circle class="st" cx="${s.x}" cy="${s.y}" r="${s.r}" style="animation-delay:${delay}s"/>`;
    const gap = s.r + 10;
    const at = {
      top: [s.x, s.y - gap - 4, "middle"],
      bottom: [s.x, s.y + gap + 14, "middle"],
      left: [s.x - gap, s.y + 5, "end"],
      right: [s.x + gap, s.y + 5, "start"],
    }[s.side];
    const cls = s.flagship ? "lb flag" : "lb";
    names += `<text class="${cls}" x="${at[0]}" y="${at[1]}" text-anchor="${at[2]}" style="animation-delay:${(Number(delay) + 0.3).toFixed(2)}s">${esc(s.name)}</text>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(name)}</title>
<desc id="d">${esc(about.join(" "))} A night sky whose constellation names ten live projects: ${esc(labels.join(", "))}.</desc>
<style>
@font-face{font-family:Fell;src:url(${fell}) format("woff2")}
@font-face{font-family:FellItalic;src:url(${fellItalic}) format("woff2")}
@font-face{font-family:Hanken;src:url(${hanken}) format("woff2")}
.field circle{fill:${C.ink}}
.tw{animation:tw ease-in-out infinite alternate}
@keyframes tw{to{opacity:.08}}
.ln{stroke:${C.line};stroke-opacity:.55;stroke-width:1.2;stroke-dasharray:1;stroke-dashoffset:0;animation:draw 1.1s ease-out both}
@keyframes draw{from{stroke-dashoffset:1}}
.st{fill:#FFF6E0;transform-box:fill-box;transform-origin:center;animation:pop .7s cubic-bezier(.2,.7,.3,1.4) both}
@keyframes pop{from{opacity:0;transform:scale(.1)}}
.halo{fill:url(#halo);transform-box:fill-box;transform-origin:center;animation:breathe 4s ease-in-out .6s infinite alternate both}
@keyframes breathe{from{opacity:.55;transform:scale(.8)}to{opacity:1;transform:scale(1.1)}}
.lb{font:15px Hanken,sans-serif;fill:${C.soft};animation:fade 1s ease-out both}
.lb.flag{font:22px FellItalic,serif;fill:${C.gold}}
@keyframes fade{from{opacity:0}}
.name{font:76px Fell,serif;fill:${C.ink}}
.about{font:22px Hanken,sans-serif;fill:${C.soft}}
.note{font:23px FellItalic,serif;fill:${C.gold}}
.small{font:15px Hanken,sans-serif;fill:${C.faint}}
@media (prefers-reduced-motion:reduce){.tw,.ln,.st,.halo,.lb{animation:none}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyTop}"/><stop offset="1" stop-color="${C.skyLow}"/></linearGradient>
<radialGradient id="glow" cx="0.74" cy="0.5" r="0.5"><stop offset="0" stop-color="#2B3A78" stop-opacity=".55"/><stop offset="1" stop-color="#2B3A78" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#FFE7AE" stop-opacity=".55"/><stop offset=".45" stop-color="${C.gold}" stop-opacity=".18"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g class="field">${field}</g>
<g fill="none">${lines}</g>
${points}
${names}
<text class="name" x="72" y="214">${esc(name)}</text>
<text class="about" x="74" y="266">${esc(about[0])}</text>
<text class="about" x="74" y="298">${esc(about[1])}</text>
<text class="note" x="74" y="366">${esc(note)}</text>
<text class="small" x="74" y="470">${esc(tech)}</text>
<text class="small" x="74" y="498">${esc(place)}</text>
</g>
</svg>
`;
  writeFileSync(join(assets, "hero.svg"), svg);
  console.log(`hero.svg  ${(svg.length / 1024).toFixed(0)} KB`);
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

const shotFor = (slug) => {
  for (const ext of ["jpg", "png"]) {
    const p = join(here, "shots", `${slug}.${ext}`);
    if (existsSync(p)) return pathToFileURL(p).href;
  }
  return null;
};

// gedis has nothing to look at in a browser; its card shows a real session
// against the public instance instead.
const gedisTerminal = `<div class="term"><div class="bar"><i></i><i></i><i></i><span>redis-cli</span></div><pre><b>$</b> redis-cli -h gedis.130-210-16-198.sslip.io -p 6380
<em>gedis.130-210-16-198.sslip.io:6380&gt;</em> PING
PONG
<em>gedis.130-210-16-198.sslip.io:6380&gt;</em> SET greeting hello
OK
<em>gedis.130-210-16-198.sslip.io:6380&gt;</em> ZADD scores 10 ada 7 grace
(integer) 2
<em>gedis.130-210-16-198.sslip.io:6380&gt;</em> ZRANGE scores 0 -1 WITHSCORES
1) "grace"
2) "7"
3) "ada"
4) "10"
<em>gedis.130-210-16-198.sslip.io:6380&gt;</em> CONFIG GET dir
<u>(error) ERR unknown command 'CONFIG', with args
beginning with: "GET", "dir"</u></pre></div>`;

const css = `
@font-face{font-family:Fell;src:url(${pathToFileURL(fontPath("fell")).href})}
@font-face{font-family:Fell;font-style:italic;src:url(${pathToFileURL(fontPath("fellItalic")).href})}
@font-face{font-family:Hanken;src:url(${pathToFileURL(fontPath("hanken")).href})}
@font-face{font-family:Hanken;font-weight:500;src:url(${pathToFileURL(fontPath("hankenMedium")).href})}
*{box-sizing:border-box}
body{margin:0;padding:24px;background:transparent;display:flex;flex-direction:column;gap:24px;align-items:flex-start}
.card{width:900px;padding:18px 18px 0;border-radius:26px;color:${C.ink};font-family:Hanken,sans-serif;
  background:radial-gradient(1px 1px at 14% 92%,#fff6 50%,transparent 51%),radial-gradient(1px 1px at 63% 96%,#fff5 50%,transparent 51%),radial-gradient(1.4px 1.4px at 88% 88%,#fff7 50%,transparent 51%),linear-gradient(180deg,#141C40,#0C1230);
  border:1px solid rgba(232,195,122,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.shot{border-radius:16px;overflow:hidden;aspect-ratio:16/9;background:#05070f;box-shadow:0 0 0 1px rgba(255,255,255,.07),0 18px 40px -18px #000}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.meta{height:282px;padding:24px 8px 0}
.head{display:flex;align-items:baseline;gap:14px}
h2{font-family:Fell,"Yu Mincho","Hiragino Mincho ProN",serif;font-weight:400;font-size:66px;line-height:1;margin:0;letter-spacing:.005em}
.sub{font-family:Fell,serif;font-style:italic;font-size:32px;color:${C.gold}}
.live{margin-left:auto;font-size:22px;color:${C.gold};white-space:nowrap}
.line{font-size:28px;line-height:1.42;color:${C.soft};margin:14px 0 0}
.stack{font-size:21px;color:${C.faint};margin:12px 0 0}
.term{height:100%;background:#0b0f1d;font:16.5px/1.42 "Cascadia Mono",Consolas,"DejaVu Sans Mono",monospace;color:#d7dbe8}
.bar{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#141a2e;color:${C.faint};font:14px Hanken,sans-serif}
.bar i{width:11px;height:11px;border-radius:50%;background:#2c3555}
.bar span{margin-left:8px}
.term pre{margin:0;padding:16px 22px;font:inherit;white-space:pre}
.term b{color:${C.faint};font-weight:400}
.term em{font-style:normal;color:${C.gold}}
.term u{text-decoration:none;color:#e58a7a}
/* the flagship */
.wide{width:1240px;display:flex;gap:30px;padding:20px}
.wide .shot{width:800px;flex:none}
.wide .meta{height:auto;padding:12px 0 0;display:flex;flex-direction:column}
.wide h2{font-size:64px}
.wide .sub{display:block;margin-top:10px;font-size:26px}
.wide .line{font-size:23px;line-height:1.5;margin-top:22px}
.wide .stack{font-size:19px;margin-top:16px;line-height:1.55}
.wide .live{margin:auto 0 6px;font-size:20px}
`;

const card = (p, inner) => `<div class="card" id="${p.slug}">
<div class="shot">${inner}</div>
<div class="meta"><div class="head"><h2>${esc(p.title)}</h2><span class="sub">${esc(p.sub)}</span><span class="live">✦ live</span></div>
<p class="line">${esc(p.line)}</p><p class="stack">${esc(p.stack)}</p></div></div>`;

const wideCard = (p, inner, id = "") => `<div class="card wide" id="${p.slug}">
<div class="shot"${id ? ` id="${id}"` : ""}>${inner}</div>
<div class="meta"><h2>${esc(p.title)}</h2><span class="sub">${esc(p.sub)}</span>
<p class="line">${esc(p.line)}</p><p class="stack">${esc(p.stack)}</p>
<span class="live">✦ live at ${esc(new URL(p.live).host)}</span></div></div>`;

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "ignore", "inherit"] });

async function cards() {
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style>
${wideCard(flagship, `<img src="${shotFor(flagship.slug)}">`, "video-hole")}
${projects.map((p) => (p.wide ? wideCard : card)(p, p.slug === "gedis" ? gedisTerminal : `<img src="${shotFor(p.slug)}">`)).join("\n")}`;
  const page_ = join(cache, "cards.html");
  writeFileSync(page_, html);

  const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const scale = 2;
  const page = await browser.newPage({ viewport: { width: 1320, height: 900 }, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(page_).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  for (const p of projects) {
    const png = join(cache, `${p.slug}.png`);
    await page.locator(`#${p.slug}`).screenshot({ path: png, omitBackground: true });
    const out = join(assets, "cards", `${p.slug}.webp`);
    sh("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", "86", "-compression_level", "6", out]);
    console.log(`cards/${p.slug}.webp  ${(readFileSync(out).length / 1024).toFixed(0)} KB`);
  }

  // The flagship: the card rendered once, then Vernissage's tour played into
  // the picture frame, with the frame's rounded corners cut into the video.
  const wide = page.locator(`#${flagship.slug}`);
  const box = await wide.boundingBox();
  const hole = await page.locator("#video-hole").boundingBox();
  const bg = join(cache, "vernissage-card.png");
  await wide.screenshot({ path: bg, omitBackground: true });
  await browser.close();

  const k = 0.5; // the 2x render at 1x: about as wide as GitHub shows it
  const cw = Math.round(box.width * scale * k / 2) * 2;
  const ch = Math.round(box.height * scale * k / 2) * 2;
  const vx = Math.round((hole.x - box.x) * scale * k);
  const vy = Math.round((hole.y - box.y) * scale * k);
  const vw = Math.round(hole.width * scale * k / 2) * 2;
  const vh = Math.round(hole.height * scale * k / 2) * 2;
  const R = Math.round(16 * scale * k);

  const tour = join(cache, "tour.mp4");
  if (!existsSync(tour)) {
    console.log("downloading Vernissage's tour video");
    const res = await fetch("https://raw.githubusercontent.com/Nafiz001/vernissage/main/docs/tour.mp4");
    writeFileSync(tour, Buffer.from(await res.arrayBuffer()));
  }
  // Four moments: the front page's reveal, looking by colour, deep zoom, and
  // walking into a room where someone else already is.
  const cuts = [[0.6, 4.8], [18.5, 23.5], [40, 44.5], [56.5, 66]];
  const parts = cuts.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[c${i}]`).join(";");
  const join_ = cuts.map((_, i) => `[c${i}]`).join("") + `concat=n=${cuts.length}:v=1[v]`;
  const round = `geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='if(gt(abs(X-W/2),W/2-${R})*gt(abs(Y-H/2),H/2-${R}),if(lte(hypot(abs(X-W/2)-(W/2-${R}),abs(Y-H/2)-(H/2-${R})),${R}),255,0),255)'`;
  const filter = `${parts};${join_};[v]setpts=PTS/1.6,fps=10,scale=${vw}:${vh}:flags=lanczos,format=yuva420p,${round}[clip];` +
    `[1:v]scale=${cw}:${ch}:flags=lanczos,format=rgba[card];[card][clip]overlay=${vx}:${vy}:shortest=1,format=yuva420p[out]`;
  const out = join(assets, "cards", `${flagship.slug}.webp`);
  sh("ffmpeg", ["-y", "-loglevel", "error", "-i", tour, "-loop", "1", "-i", bg, "-filter_complex", filter, "-map", "[out]",
    "-c:v", "libwebp_anim", "-quality", "62", "-compression_level", "5", "-loop", "0", "-an", out]);
  console.log(`cards/${flagship.slug}.webp  ${(readFileSync(out).length / 1024).toFixed(0)} KB (animated)`);
}

// ---------------------------------------------------------------------------
// README.md, from the same data, so the cards, the table and the links agree
// ---------------------------------------------------------------------------

const links = {
  portfolio: "https://nafiz-ahmed-xi.vercel.app",
  linkedin: "https://www.linkedin.com/in/nafiz-ahmed-770a3a273/",
  email: "nafizahmed000@gmail.com",
};

function readme() {
  const img = (p, width) =>
    `<a href="${p.live}"><img src="assets/cards/${p.slug}.webp" width="${width}" alt="${esc(p.title)}: ${esc(p.line)}"></a>`;
  const pairs = projects.filter((p) => !p.wide);
  const wides = projects.filter((p) => p.wide);
  const rows = [];
  for (let i = 0; i < pairs.length; i += 2) {
    rows.push(`<p>\n  ${pairs.slice(i, i + 2).map((p) => img(p, "49%")).join("\n  ")}\n</p>`);
  }
  const table = [flagship, ...projects].map((p) =>
    `| **${p.title}**${p.sub ? ` · ${p.sub}` : ""} | ${p.stack} | [live](${p.live}) | [source](${p.code}) |`).join("\n");
  const more = moreLive.map(([name, live, repo]) =>
    `[${name}](${live}) ([source](https://github.com/Nafiz001/${repo}))`).join(" · ");

  return `<!-- Generated by src/build.mjs from src/projects.mjs. Edit those, then run npm run build in src/. -->

<a href="${links.portfolio}"><img src="assets/hero.svg" width="100%" alt="Md. Nafiz Ahmed. I build databases, servers and compilers from scratch, and the 3D and multiplayer things that run on top of them."></a>

<p align="center">
  ${contact.map((l) => `<a href="${l.href}"><img src="assets/links/${l.slug}.svg" height="44" alt="${l.label}"></a>`).join("&nbsp;\n  ")}
</p>

${img(flagship, "100%")}

${rows.join("\n\n")}

${wides.map((p) => img(p, "100%")).join("\n\n")}

<img src="https://raw.githubusercontent.com/Nafiz001/Nafiz001/output/stats.svg" width="100%" alt="Contributions in the last year as a sky of stars, one per day, with streaks and the languages in my public repositories. Redrawn daily.">

<img src="assets/stack.svg" width="100%" alt="Built with: ${stack.map((r) => r.items.map((i) => i[1]).join(", ")).join("; ")}.">

### Live, with source

| Project | Built with | Try it | Code |
|---|---|---|---|
${table}

More live work: ${more}.

The Go, Rust and .NET projects run on two Oracle Cloud Always Free servers. GitHub Actions builds every project for amd64 and arm64 on each push, and the servers pull the new images within ten minutes: [portfolio-deploy](https://github.com/Nafiz001/portfolio-deploy). Every link above was opened in a browser before this page was built.

Open to full-time roles and freelance work: [${links.email}](mailto:${links.email}).
`;
}

const only = process.argv[2];
if (!only || only === "hero") await hero();
if (!only || only === "cards") await cards();
if (!only || only === "panels") {
  const panels = makePanels(here, assets);
  await panels.links(contact);
  await panels.stack(stack);
}
if (!only || only === "readme") {
  writeFileSync(resolve(here, "../README.md"), readme());
  console.log("README.md");
}
rmSync(join(cache, "cards.html"), { force: true });
