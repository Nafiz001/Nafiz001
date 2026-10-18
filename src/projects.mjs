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
    slug: "logarithm-warehouse",
    title: "Warehouse",
    sub: "BUET prize winner",
    line: "A monolith rebuilt as microservices behind Nginx, with a Redis counter that keeps chaos tests deterministic across replicas.",
    stack: "Node.js · PostgreSQL · Redis · Nginx · Prometheus · Grafana",
    live: "https://warehouse.130-210-37-18.sslip.io",
    code: "https://github.com/Nafiz001/logarithm-warehouse",
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

// The buttons under the hero.
export const links = [
  { slug: "portfolio", label: "Portfolio", icon: "lucide:globe", href: "https://nafiz-ahmed-xi.vercel.app" },
  { slug: "linkedin", label: "LinkedIn", icon: "custom:linkedin", href: "https://www.linkedin.com/in/nafiz-ahmed-770a3a273/" },
  { slug: "email", label: "Email", icon: "lucide:mail", href: "mailto:nafizahmed000@gmail.com" },
  { slug: "cv", label: "CV", icon: "lucide:file-user", href: "https://nafiz-ahmed-xi.vercel.app/resume.pdf" },
];

// What the projects are built with: only what the public repositories use.
// [Simple Icons slug or lucide:<name>, label]
export const stack = [
  { label: "Languages", items: [["go", "Go"], ["rust", "Rust"], ["typescript", "TypeScript"], ["javascript", "JavaScript"], ["dotnet", "C# / .NET"], ["python", "Python"], ["c", "C"], ["cplusplus", "C++"], ["openjdk", "Java"], ["php", "PHP"], ["dart", "Dart"]] },
  { label: "Front end", items: [["react", "React"], ["nextdotjs", "Next.js"], ["svelte", "Svelte"], ["vuedotjs", "Vue"], ["angular", "Angular"], ["threedotjs", "three.js"], ["tailwindcss", "Tailwind"], ["flutter", "Flutter"], ["expo", "Expo"], ["webassembly", "WebAssembly"]] },
  { label: "Back end, data", items: [["nodedotjs", "Node.js"], ["django", "Django"], ["laravel", "Laravel"], ["spring", "Spring"], ["fastapi", "FastAPI"], ["postgresql", "PostgreSQL"], ["mongodb", "MongoDB"], ["mysql", "MySQL"], ["redis", "Redis"], ["sqlite", "SQLite"], ["firebase", "Firebase"]] },
  { label: "Shipping it", items: [["docker", "Docker"], ["githubactions", "GitHub Actions"], ["linux", "Linux"], ["caddy", "Caddy"], ["vercel", "Vercel"], ["lucide:cloud", "Oracle Cloud"], ["git", "Git"]] },
];
