// Everything the profile shows. Only projects with a working live deployment
// belong here: capture.mjs opens every `live` URL in Chrome before a build.

export const flagship = {
  slug: "vernissage",
  title: "Vernissage",
  sub: "a museum you curate and share",
  line: "Hang your own exhibition of 8,263 public-domain masterpieces from The Met and the Cleveland Museum of Art, then walk through it in 3D with whoever opens the link.",
  stack: "Go · PostgreSQL · Next.js · React Three Fiber · WebSockets",
  live: "https://vernissage-pi.vercel.app",
  code: "https://github.com/Nafiz001/vernissage",
};

export const projects = [
  {
    slug: "jjk-domain-expansion",
    title: "領域展開",
    sub: "Ryōiki Tenkai",
    line: "Jujutsu Kaisen's Domain Expansions as a 2.5D depth tunnel, a clash simulator and a three.js realm, scored with the Web Audio API.",
    stack: "TypeScript · Canvas 2D · three.js · Web Audio",
    live: "https://jjk-domain-expansion.vercel.app",
    code: "https://github.com/Nafiz001/jjk-domain-expansion",
  },
  {
    slug: "logarithm-techathon",
    title: "Vantage",
    sub: "6-DOF arm, digital twin",
    line: "A robot arm driven by joystick, voice, hand gestures or an LLM agent, every command through one IK solver and safety gate.",
    stack: "React Three Fiber · URDF · MediaPipe · Arduino firmware",
    live: "https://logarithm-techathon.vercel.app",
    code: "https://github.com/Nafiz001/logarithm-techathon",
  },
  {
    slug: "ghostline-threejs",
    title: "Ghostline",
    sub: "race your own best lap",
    line: "A hover racer whose physics is deterministic enough to replay a lap from its inputs, so any ghost can be shared as a URL.",
    stack: "TypeScript · three.js · Web Audio · 139 KB gzipped",
    live: "https://nafiz001.github.io/ghostline-threejs/",
    code: "https://github.com/Nafiz001/ghostline-threejs",
  },
  {
    slug: "swarmlight-canvas",
    title: "Swarmlight",
    sub: "a ten minute vigil",
    line: "A survivors-like with 1,500 enemies at 60 fps on one hand-rolled canvas, seeded daily runs, no engine and no dependencies.",
    stack: "TypeScript · Canvas 2D · spatial hashing",
    live: "https://nafiz001.github.io/swarmlight-canvas/",
    code: "https://github.com/Nafiz001/swarmlight-canvas",
  },
  {
    slug: "ebru",
    title: "ebru",
    sub: "a shared marbling tray",
    line: "Turkish paper marbling that anyone can work in at once, with the same Rust maths on the server and in the browser, bit for bit.",
    stack: "Rust · axum · WebAssembly · Vue",
    live: "https://ebru.130-210-16-198.sslip.io",
    code: "https://github.com/Nafiz001/ebru",
  },
  {
    slug: "kirie",
    title: "kirie",
    sub: "切り絵, paper cutting",
    line: "A pop-up paper book of the sky over 36 places, lit by the weather there right now, with live readers folding paper cranes.",
    stack: "ASP.NET Core · SignalR · SvelteKit · CSS 3D",
    live: "https://kirie.130-210-16-198.sslip.io",
    code: "https://github.com/Nafiz001/kirie",
  },
  {
    slug: "asterism",
    title: "Asterism",
    sub: "a stargazing app",
    line: "Hold your phone to the sky and it names what you see: stars, planets, the ISS, and whether tonight is worth going out.",
    stack: "Expo · React Native Skia · Reanimated · astronomy from Meeus",
    live: "https://asterism.130-210-16-198.sslip.io",
    code: "https://github.com/Nafiz001/asterism",
  },
  {
    slug: "lumen",
    title: "lumen",
    sub: "a search engine",
    line: "Crawler, inverted index, BM25 and snippets written from scratch with only Go's standard library, here searching the Go blog.",
    stack: "Go · standard library only",
    live: "https://lumen.130-210-16-198.sslip.io/?q=goroutines+channels",
    code: "https://github.com/Nafiz001/lumen",
  },
  {
    slug: "gedis",
    wide: true,
    title: "gedis",
    sub: "Redis, from scratch",
    line: "A Redis-compatible store that speaks RESP, so the official redis-cli talks to it. A public instance takes connections now.",
    stack: "Go · RESP · replication · AOF",
    live: "https://gedis.130-210-16-198.sslip.io",
    code: "https://github.com/Nafiz001/gedis",
  },
];

// Working deployments that show breadth but are not headline work.
export const moreLive = [
  ["ShopCircuit", "https://shopcircuit.vercel.app", "E-Commerce-"],
  ["DevEvent", "https://dev-events-nextjs-six.vercel.app", "dev-events-nextjs"],
  ["Shabuj University Finder", "https://shabuj-university-finder.vercel.app", "shabuj-university-finder"],
  ["Employee & Family Registry", "https://employee-family-registry-system.vercel.app", "employee-family-registry-system"],
];
