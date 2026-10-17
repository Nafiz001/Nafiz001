// Draws the profile's stats panel: the last year of contributions as a sky,
// one star per day, brighter on busier days; the streaks and totals; and the
// languages across public repositories.
//
//   node stats.mjs ../assets/stats.svg
//
// Reads GitHub's GraphQL API with GITHUB_TOKEN (set in Actions), or, on a
// developer machine, the token the gh CLI is logged in with. Run daily by
// .github/workflows/stats.yml, which publishes the result to the output branch.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const here = dirname(fileURLToPath(import.meta.url));
const LOGIN = "Nafiz001";
// Notebook output and template markup are counted in bytes like code, and
// swamp the languages actually written.
const NOT_LANGUAGES = new Set(["Jupyter Notebook", "HTML", "CSS", "SCSS", "Blade", "EJS", "Handlebars"]);

const token = process.env.GITHUB_TOKEN || execFileSync("gh", ["auth", "token"]).toString().trim();
const query = `query($login: String!) {
  user(login: $login) {
    repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
      totalCount
      nodes { stargazerCount languages(first: 10, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name color } } } }
    }
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "nafiz001-profile" },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!json.data) throw new Error(`GitHub said: ${JSON.stringify(json.errors ?? json)}`);
const user = json.data.user;

// --- numbers ---------------------------------------------------------------
const calendar = user.contributionsCollection.contributionCalendar;
const days = calendar.weeks.flatMap((w) => w.contributionDays);
const max = Math.max(1, ...days.map((d) => d.contributionCount));

let longest = 0;
let run = 0;
for (const d of days) {
  run = d.contributionCount > 0 ? run + 1 : 0;
  longest = Math.max(longest, run);
}
// The current streak may end yesterday: today is not over yet.
let current = 0;
let i = days.length - 1;
if (days[i]?.contributionCount === 0) i--;
for (; i >= 0 && days[i].contributionCount > 0; i--) current++;

const stars = user.repositories.nodes.reduce((n, r) => n + r.stargazerCount, 0);
const langs = new Map();
for (const r of user.repositories.nodes) {
  for (const e of r.languages.edges) {
    if (NOT_LANGUAGES.has(e.node.name)) continue;
    const l = langs.get(e.node.name) ?? { size: 0, color: e.node.color ?? "#8b93b0" };
    l.size += e.size;
    langs.set(e.node.name, l);
  }
}
const totalBytes = [...langs.values()].reduce((n, l) => n + l.size, 0);
const ranked = [...langs.entries()].sort((a, b) => b[1].size - a[1].size);
const top = ranked.slice(0, 7);
const rest = ranked.slice(7).reduce((n, [, l]) => n + l.size, 0);
const bar = [...top.map(([name, l]) => ({ name, share: l.size / totalBytes, color: l.color })),
  ...(rest ? [{ name: "Other", share: rest / totalBytes, color: "#4A5482" }] : [])];

// --- drawing ---------------------------------------------------------------
const W = 1280;
const H = 380;
const C = { top: "#0A0F24", low: "#18234A", ink: "#EFE8D8", soft: "#B4BAD0", faint: "#7D86A8", gold: "#E8C37A" };
const fmt = (n) => n.toLocaleString("en-US");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pct = (s) => (s * 100 >= 10 ? Math.round(s * 100) : (s * 100).toFixed(1)) + "%";
const updated = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(1417);
const mix = (a, b, t) => {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return "#" + pa.map((v, k) => Math.round(v + (pb[k] - v) * t).toString(16).padStart(2, "0")).join("");
};

// The sky: one column per week, one row per weekday, a little jitter so it
// reads as stars rather than a spreadsheet.
const sx = 400;
const sw = 816;
const sy = 82;
const step = sw / calendar.weeks.length;
let sky = "";
let months = "";
let lastMonth = "";
calendar.weeks.forEach((w, col) => {
  const first = w.contributionDays[0];
  const m = new Date(first.date + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  if (m !== lastMonth && col < calendar.weeks.length - 2) {
    months += `<text class="tiny" x="${(sx + col * step).toFixed(1)}" y="${sy - 22}">${m}</text>`;
    lastMonth = m;
  }
  for (const d of w.contributionDays) {
    const row = new Date(d.date + "T00:00:00Z").getUTCDay();
    const x = sx + col * step + step / 2 + (rand() - 0.5) * 3.5;
    const y = sy + row * step + step / 2 + (rand() - 0.5) * 3.5;
    const c = d.contributionCount;
    if (c === 0) {
      sky += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1" fill="#3A4677"/>`;
      continue;
    }
    const level = Math.sqrt(c / max);
    const r = 1.7 + 3.4 * level;
    if (level > 0.62) {
      sky += `<circle class="glow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 3.2).toFixed(1)}" style="animation-delay:-${(rand() * 5).toFixed(1)}s"><title>${d.date}: ${c}</title></circle>`;
    }
    sky += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${mix("9FB0E8", "FFF4D8", level)}"><title>${d.date}: ${c} contributions</title></circle>`;
  }
});

// Background stars, fainter than the data.
let field = "";
for (let k = 0; k < 90; k++) {
  field += `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * H).toFixed(0)}" r="${(0.3 + rand() * 0.7).toFixed(2)}" opacity="${(0.15 + rand() * 0.35).toFixed(2)}"/>`;
}

// The language bar and its legend.
const by = 254;
let x = sx;
let segments = "";
let legend = "";
bar.forEach((b, k) => {
  const w = Math.max(2, b.share * sw);
  segments += `<rect x="${x.toFixed(1)}" y="${by}" width="${(w - 2).toFixed(1)}" height="9" rx="2" fill="${b.color}"/>`;
  x += w;
  const lx = sx + (k % 4) * (sw / 4);
  const ly = by + 40 + Math.floor(k / 4) * 30;
  legend += `<circle cx="${lx + 5}" cy="${ly - 5}" r="5" fill="${b.color}"/><text class="small" x="${lx + 17}" y="${ly}">${esc(b.name)} <tspan class="dim">${pct(b.share)}</tspan></text>`;
});

const numbers = [
  [fmt(longest), longest === 1 ? "day, longest streak" : "days, longest streak"],
  [fmt(current), current === 1 ? "day, current streak" : "days, current streak"],
  [fmt(user.repositories.totalCount), "public repositories"],
];
let stats = "";
numbers.forEach(([n, label], k) => {
  const y = 232 + k * 44;
  stats += `<text class="mid" x="118" y="${y}" text-anchor="end">${n}</text><text class="small" x="134" y="${y - 3}">${label}</text>`;
});

const text = { fell: fmt(calendar.totalContributions) + numbers.map((n) => n[0]).join(""), hanken: "" };
const sans = [
  "contributions in the last year", ...numbers.map((n) => n[1]), ...bar.map((b) => b.name + " " + pct(b.share)),
  "Languages in public repositories, by size, without notebooks and markup", `Updated ${updated}`,
  ...months.match(/>[A-Z][a-z]{2}</g).map((m) => m.slice(1, -1)), "contributions 0123456789: -",
].join("");
const font = async (file, glyphs) => {
  const buf = await subsetFont(readFileSync(join(here, "node_modules/@expo-google-fonts", file)), [...new Set(glyphs)].join(""), { targetFormat: "woff2" });
  return `data:font/woff2;base64,${Buffer.from(buf).toString("base64")}`;
};
const medium = await font("hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf", text.fell + "0123456789,");
const hanken = await font("hanken-grotesk/400Regular/HankenGrotesk_400Regular.ttf", sans);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${fmt(calendar.totalContributions)} contributions in the last year</title>
<desc id="d">Longest streak ${longest} days, current streak ${current} days, ${user.repositories.totalCount} public repositories, ${stars} stars. Languages: ${bar.map((b) => `${b.name} ${pct(b.share)}`).join(", ")}.</desc>
<style>
@font-face{font-family:HankenMedium;src:url(${medium}) format("woff2")}
@font-face{font-family:Hanken;src:url(${hanken}) format("woff2")}
.big{font:500 68px HankenMedium,sans-serif;fill:${C.ink};letter-spacing:-.01em}
.mid{font:500 28px HankenMedium,sans-serif;fill:${C.ink}}
.label{font:21px Hanken,sans-serif;fill:${C.soft}}
.small{font:18px Hanken,sans-serif;fill:${C.soft}}
.dim{fill:${C.faint}}
.tiny{font:15px Hanken,sans-serif;fill:${C.faint}}
.field circle{fill:${C.ink}}
.glow{fill:url(#glow);animation:breathe 4.5s ease-in-out infinite alternate}
@keyframes breathe{from{opacity:.35}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.glow{animation:none}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.top}"/><stop offset="1" stop-color="${C.low}"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#FFE7AE" stop-opacity=".5"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<g class="field">${field}</g>
<text class="big" x="62" y="120">${fmt(calendar.totalContributions)}</text>
<text class="label" x="66" y="158">contributions in the last year</text>
${stats}
${months}
${sky}
<text class="tiny" x="${sx}" y="${by - 16}">Languages in public repositories, by size, without notebooks and markup</text>
${segments}
${legend}
<text class="tiny" x="${sx + sw}" y="${H - 22}" text-anchor="end">Updated ${updated}</text>
</g>
</svg>
`;

const out = process.argv[2] ?? join(here, "../assets/stats.svg");
writeFileSync(out, svg);
console.log(`${out}: ${fmt(calendar.totalContributions)} contributions, streaks ${longest}/${current}, ${(svg.length / 1024).toFixed(0)} KB`);
