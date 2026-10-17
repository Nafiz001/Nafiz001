// The two smaller pieces of the profile, as SVGs with their fonts embedded:
//
//   links/<name>.svg   the contact buttons under the hero
//   stack.svg          what the projects are built with, grouped, in the
//                      night palette rather than each brand's colours
//
// Icons: brand marks from Simple Icons (CC0), others from Lucide (ISC).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as si from "simple-icons";
import subsetFont from "subset-font";

const C = { top: "#0A0F24", low: "#18234A", panel: "#121A3C", ink: "#EFE8D8", soft: "#B4BAD0", faint: "#7D86A8", gold: "#E8C37A" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function makePanels(here, assets) {
  const fontFile = (f) => readFileSync(join(here, "node_modules/@expo-google-fonts", f));
  const embed = async (f, text) => {
    const buf = await subsetFont(fontFile(f), [...new Set(text)].join(""), { targetFormat: "woff2" });
    return `data:font/woff2;base64,${Buffer.from(buf).toString("base64")}`;
  };
  const lucide = (name) =>
    readFileSync(join(here, "node_modules/lucide-static/icons", `${name}.svg`), "utf8")
      .replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  // A Simple Icons mark (24-unit filled path) or a Lucide icon (24-unit strokes).
  const icon = (ref, x, y, size, color) => {
    const k = size / 24;
    if (ref.startsWith("lucide:")) {
      return `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${lucide(ref.slice(7))}</g>`;
    }
    if (ref === "custom:linkedin") {
      return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="2" y="2" width="20" height="20" rx="4.5" fill="none" stroke="${color}" stroke-width="1.8"/><path d="M7.2 10.2v6.6M7.2 7.3v.1M11 16.8v-6.6M11 13.2c0-1.9 1.1-3 2.7-3s2.6 1 2.6 3v3.6" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/></g>`;
    }
    const mark = si["si" + ref[0].toUpperCase() + ref.slice(1)];
    if (!mark) throw new Error(`no Simple Icons mark "${ref}"`);
    return `<g transform="translate(${x} ${y}) scale(${k})"><path d="${mark.path}" fill="${color}"/></g>`;
  };

  // --- links ---------------------------------------------------------------
  async function links(list) {
    mkdirSync(join(assets, "links"), { recursive: true });
    const hanken = await embed("hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf", list.map((l) => l.label).join(""));
    const W = 220, H = 56;
    for (const l of list) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(l.label)}">
<style>@font-face{font-family:H;src:url(${hanken}) format("woff2")}text{font:500 19px H,sans-serif;fill:${C.ink}}</style>
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18214A"/><stop offset="1" stop-color="${C.top}"/></linearGradient></defs>
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="${(H - 1.5) / 2}" fill="url(#g)" stroke="${C.gold}" stroke-opacity=".38" stroke-width="1.5"/>
${icon(l.icon, 26, 16, 24, C.gold)}
<text x="64" y="35">${esc(l.label)}</text>
</svg>
`;
      writeFileSync(join(assets, "links", `${l.slug}.svg`), svg);
    }
    console.log(`links/  ${list.map((l) => l.slug).join(", ")}`);
  }

  // --- stack ---------------------------------------------------------------
  async function stack(rows) {
    const W = 1280;
    const left = 268;
    const cell = 86;
    const rowH = 104;
    const H = 72 + rows.length * rowH;
    const names = rows.flatMap((r) => r.items.map((i) => i[1]));
    const fellItalic = await embed("im-fell-english/400Regular_Italic/IMFellEnglish_400Regular_Italic.ttf", rows.map((r) => r.label).join(""));
    const hanken = await embed("hanken-grotesk/400Regular/HankenGrotesk_400Regular.ttf", names.join(""));
    let body = "";
    rows.forEach((r, k) => {
      const y = 56 + k * rowH;
      body += `<text class="row" x="64" y="${y + 30}">${esc(r.label)}</text>`;
      if (k > 0) body += `<line x1="64" x2="${W - 64}" y1="${y - 18}" y2="${y - 18}" stroke="${C.gold}" stroke-opacity=".12"/>`;
      r.items.forEach(([ref, name], j) => {
        const cx = left + j * cell + cell / 2;
        body += icon(ref, cx - 15, y, 30, C.ink);
        body += `<text class="name" x="${cx}" y="${y + 60}" text-anchor="middle">${esc(name)}</text>`;
      });
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t">
<title id="t">Built with: ${esc(rows.map((r) => `${r.label}: ${r.items.map((i) => i[1]).join(", ")}`).join(". "))}</title>
<style>
@font-face{font-family:FellItalic;src:url(${fellItalic}) format("woff2")}
@font-face{font-family:Hanken;src:url(${hanken}) format("woff2")}
.row{font:30px FellItalic,serif;fill:${C.gold}}
.name{font:15px Hanken,sans-serif;fill:${C.soft}}
</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.top}"/><stop offset="1" stop-color="${C.low}"/></linearGradient></defs>
<rect width="${W}" height="${H}" rx="28" fill="url(#sky)"/>
${body}
</svg>
`;
    writeFileSync(join(assets, "stack.svg"), svg);
    console.log(`stack.svg  ${(svg.length / 1024).toFixed(0)} KB`);
  }

  return { links, stack };
}
