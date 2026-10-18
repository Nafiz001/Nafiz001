// Builds the profile from src/projects.mjs:
//
//   assets/architecture-{light,dark}.svg   how the projects get onto the web
//   assets/vernissage-tour.webp            a short clip of the flagship
//   ../README.md                           the profile itself
//
// The diagram is plain SVG written here, so it needs nothing installed. The
// clip needs ffmpeg on PATH and Vernissage's tour video (downloaded once into
// .cache). Before it writes the README it opens every live link and stops if
// one is down, so the page never links to something dead.
//
//   node build.mjs            everything
//   node build.mjs diagram    one step: diagram | clip | readme
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { flagship, groups, moreLive, person } from "./projects.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const assets = resolve(here, "../assets");
const cache = join(here, ".cache");
mkdirSync(assets, { recursive: true });
mkdirSync(cache, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------------------------------------------------------------------
// The architecture diagram, in GitHub's own light and dark colours
// ---------------------------------------------------------------------------

const palettes = {
  light: { text: "#1f2328", muted: "#59636e", line: "#d1d9e0", panel: "#f6f8fa", accent: "#0969da", accentFill: "#ddf4ff", cloud: "#fff8e6", cloudLine: "#d4a72c" },
  dark: { text: "#e6edf3", muted: "#9198a1", line: "#3d444d", panel: "#151b23", accent: "#4493f8", accentFill: "#0c2d6b", cloud: "#1f1a0d", cloudLine: "#9e6a03" },
};

function diagram(theme) {
  const P = palettes[theme];
  const sans = `-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`;
  const box = (x, y, w, h, fill = P.panel, stroke = P.line) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
  const text = (x, y, s, { size = 13, weight = 400, fill = P.text, anchor = "start" } = {}) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
  const arrow = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${P.muted}" stroke-width="1.4" marker-end="url(#a)"/>`;

  // Top row: GitHub, Actions, registry.
  const top = [
    [24, 160, "GitHub", ["12 projects, code public", "tests on every push"]],
    [224, 180, "GitHub Actions", ["builds each project for", "amd64 and arm64"]],
    [444, 140, "ghcr.io", ["one multi-arch", "image per project"]],
  ];
  const topBoxes = top
    .map(([x, w, title, lines]) =>
      box(x, 40, w, 92) + text(x + 16, 66, title, { size: 15, weight: 600 }) +
      lines.map((l, i) => text(x + 16, 90 + i * 18, l, { fill: P.muted })).join(""))
    .join("");

  // Vercel front ends.
  const names = ["Vernissage", "noctiluca", "Vantage", "Ryōiki Tenkai"];
  let cx = 44;
  const chips = names
    .map((n) => {
      const w = Math.round(n.length * 7.4 + 24);
      const out = box(cx, 316, w, 30, P.accentFill, P.accent) + text(cx + w / 2, 336, n, { anchor: "middle" });
      cx += w + 10;
      return out;
    })
    .join("");
  const vercel =
    box(24, 236, 560, 144) + text(44, 264, "Vercel", { size: 15, weight: 600 }) +
    text(44, 286, "Next.js and Vite front ends, rebuilt on every push", { fill: P.muted }) + chips;

  // Oracle Cloud.
  const ampere = ["Vernissage API + PostgreSQL", "Logarithm Warehouse, 10 containers", "noctiluca, Django + Channels", "kori + PostgreSQL + Redis", "quill, SQL database"];
  const micro = ["ebru, Rust + WebAssembly", "kirie, ASP.NET Core", "lumen, search engine", "gedis, Redis-compatible", "asterism, Expo web"];
  const server = (y, h, title, items) =>
    box(676, y, 244, h) + text(692, y + 24, title, { size: 14, weight: 600 }) +
    items.map((s, i) => text(692, y + 48 + i * 20, s, { size: 12.5, fill: P.muted })).join("");
  const oracle =
    box(660, 24, 276, 384, P.cloud, P.cloudLine) +
    text(676, 50, "Oracle Cloud, Always Free", { size: 15, weight: 600 }) +
    text(676, 68, "Docker, with Caddy for HTTPS", { size: 12.5, fill: P.muted }) +
    server(84, 148, "Ampere A1, 2 CPU, 12 GB", ampere) +
    server(248, 148, "AMD micro, 1 GB", micro);

  const small = (x, y, lines) =>
    lines.map((l, i) => text(x, y + i * 14, l, { size: 11, fill: P.muted, anchor: "middle" })).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 432" font-family="${sans}" role="img" aria-labelledby="t d">
<title id="t">How the projects reach the web</title>
<desc id="d">A push to GitHub runs tests and builds a multi-arch container image for each project in GitHub Actions and publishes it to ghcr.io. Two Oracle Cloud Always Free servers pull new images every ten minutes and serve the back ends behind Caddy. The Next.js and Vite front ends are rebuilt by Vercel on every push and call the back ends over HTTP and WebSockets.</desc>
<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${P.muted}"/></marker></defs>
${topBoxes}
${arrow(184, 86, 224, 86)}${arrow(404, 86, 444, 86)}${arrow(584, 86, 660, 86)}
${small(622, 106, ["servers pull", "every 10 min"])}
${arrow(104, 132, 104, 236)}
${text(116, 190, "a push also deploys the front ends", { size: 11, fill: P.muted })}
${vercel}
${arrow(584, 316, 660, 316)}
${small(622, 336, ["API and", "WebSocket", "calls"])}
${oracle}
</svg>
`;
}

function writeDiagrams() {
  for (const theme of ["light", "dark"]) {
    writeFileSync(join(assets, `architecture-${theme}.svg`), diagram(theme));
    console.log(`architecture-${theme}.svg`);
  }
}

// ---------------------------------------------------------------------------
// A clip of the flagship: four moments of Vernissage's tour, sped up, with
// rounded corners cut into the video itself
// ---------------------------------------------------------------------------

async function writeClip() {
  const tour = join(cache, "tour.mp4");
  if (!existsSync(tour)) {
    console.log("downloading Vernissage's tour video");
    const res = await fetch("https://raw.githubusercontent.com/Nafiz001/vernissage/main/docs/tour.mp4");
    writeFileSync(tour, Buffer.from(await res.arrayBuffer()));
  }
  // The front page's reveal, looking by colour, deep zoom, and walking into a
  // room where someone else already is.
  const cuts = [[0.6, 4.8], [18.5, 23.5], [40, 44.5], [56.5, 66]];
  const parts = cuts.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[c${i}]`).join(";");
  const joined = cuts.map((_, i) => `[c${i}]`).join("") + `concat=n=${cuts.length}:v=1[v]`;
  const R = 12;
  const round = `geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='if(gt(abs(X-W/2),W/2-${R})*gt(abs(Y-H/2),H/2-${R}),if(lte(hypot(abs(X-W/2)-(W/2-${R}),abs(Y-H/2)-(H/2-${R})),${R}),255,0),255)'`;
  const filter = `${parts};${joined};[v]setpts=PTS/1.6,fps=10,scale=880:-2:flags=lanczos,format=yuva420p,${round}[out]`;
  const out = join(assets, "vernissage-tour.webp");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tour, "-filter_complex", filter, "-map", "[out]",
    "-c:v", "libwebp_anim", "-quality", "60", "-compression_level", "5", "-loop", "0", "-an", out], { stdio: ["ignore", "ignore", "inherit"] });
  console.log(`vernissage-tour.webp  ${(readFileSync(out).length / 1024).toFixed(0)} KB`);
}

// ---------------------------------------------------------------------------
// README.md
// ---------------------------------------------------------------------------

async function checkLinks() {
  const urls = [flagship, ...groups.flatMap((g) => g.rows)].map((p) => p.live).concat(moreLive.map((m) => m[1]));
  const bad = [];
  await Promise.all(urls.map(async (url) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(25000) });
        if (res.ok) return;
        if (attempt === 2) bad.push(`${url} answered ${res.status}`);
      } catch (e) {
        if (attempt === 2) bad.push(`${url} ${e.cause?.code ?? e.message}`);
      }
    }
  }));
  if (bad.length) throw new Error(`These live links are down, so the README was not written:\n  ${bad.join("\n  ")}`);
  console.log(`${urls.length} live links answered`);
}

function readme() {
  const rows = (g) =>
    g.rows.map((p) => `| **${p.title}** | ${p.line}<br><sub>${p.stack}</sub> | [live](${p.live}) · [code](${p.code}) |`).join("\n");
  const more = moreLive.map(([name, live, repo]) => `[${name}](${live}) ([code](https://github.com/Nafiz001/${repo}))`).join(" · ");
  const alt = "How the projects reach the web: a push to GitHub runs tests and builds a multi-arch image in GitHub Actions, which goes to ghcr.io. Two Oracle Cloud servers pull new images every ten minutes and serve the back ends; Vercel rebuilds the front ends on every push.";

  return `<!-- Generated by src/build.mjs from src/projects.mjs. Edit those, then run node build.mjs in src/. -->

# ${person.name}

${person.role}, based in ${person.place}.

${person.summary}

${person.facts.join(" · ")}

${person.links.map(([label, href]) => `[${label}](${href})`).join(" · ")} · [Email](mailto:${person.email})

## Everything here runs live

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/architecture-dark.svg">
  <img src="assets/architecture-light.svg" width="100%" alt="${alt}">
</picture>

GitHub Actions builds every project for amd64 and arm64 on each push, and the servers pull the new images within ten minutes. The setup is in [portfolio-deploy](https://github.com/Nafiz001/portfolio-deploy). Every link below was opened before this page was built.

## Selected work

### ${flagship.title}

${flagship.line}

<a href="${flagship.live}"><img src="assets/vernissage-tour.webp" width="100%" alt="A short tour of Vernissage: choosing works by colour, zooming into a painting, and walking into a 3D room with other visitors."></a>

<sub>${flagship.stack}</sub> · [live](${flagship.live}) · [code](${flagship.code})

${groups.map((g) => `### ${g.title}\n\n| Project | What it is | Links |\n|---|---|---|\n${rows(g)}`).join("\n\n")}

More live work: ${more}.

Open to remote full-time roles: [${person.email}](mailto:${person.email}).
`;
}

const only = process.argv[2];
if (!only || only === "diagram") writeDiagrams();
if (!only || only === "clip") await writeClip();
if (!only || only === "readme") {
  await checkLinks();
  writeFileSync(resolve(here, "../README.md"), readme());
  console.log("README.md");
}
