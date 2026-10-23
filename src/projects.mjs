// Everything the profile shows. Only projects with a working live deployment
// belong here: build.mjs opens every `live` URL before it writes the README,
// and stops if one is down.

export const person = {
  name: "Md. Nafiz Ahmed",
  role: "Full-stack engineer at EngineFinders (UK, remote)",
  place: "Khulna, Bangladesh",
  summary:
    "I build backend systems from scratch (a SQL database, a Redis, a search engine, a ledger) and ship them live, with the 3D and real-time front ends that run on top.",
  facts: [
    "**2nd runner-up**, BUET CSE Fest 2026",
    "**Champion**, KUET First Byte Datathon 2025",
    "B.Sc. in Computer Science and Engineering, KUET (2023 to now)",
  ],
  email: "nafizahmed000@gmail.com",
  links: [
    ["CV", "https://www.nafizahmed.tech/resume.pdf"],
    ["Portfolio", "https://www.nafizahmed.tech"],
    ["LinkedIn", "https://www.linkedin.com/in/nafiz-ahmed-770a3a273/"],
  ],
};

export const flagship = {
  title: "Vernissage",
  line: "Hang your own exhibition of 8,263 public-domain works from The Met and the Cleveland Museum of Art, then walk through it in 3D with whoever opens the link. One Go binary serves the API, the WebSocket hub and the deep-zoom tiles.",
  stack: "Go, PostgreSQL, Next.js, React Three Fiber, WebSockets",
  live: "https://vernissage-pi.vercel.app",
  code: "https://github.com/Nafiz001/vernissage",
};

// Grouped by what a reader is looking for, not by date.
export const groups = [
  {
    title: "Databases and servers from scratch",
    rows: [
      {
        title: "quill",
        line: "A SQL database in Go: a B+tree on slotted pages, a write-ahead log with crash recovery, and the PostgreSQL wire protocol, so `psql` connects to the live read-only demo.",
        stack: "Go",
        live: "https://quill.130-210-37-18.sslip.io",
        code: "https://github.com/Nafiz001/quill",
      },
      {
        title: "gedis",
        line: "A Redis-compatible store that speaks RESP, so the official `redis-cli` talks to it, with replication, AOF persistence and eviction. A public instance takes connections.",
        stack: "Go",
        live: "https://gedis.130-210-16-198.sslip.io",
        code: "https://github.com/Nafiz001/gedis",
      },
      {
        title: "lumen",
        line: "A search engine with only Go's standard library: a crawler, an inverted index, BM25 ranking and snippets, live over the Go blog's 400 pages.",
        stack: "Go",
        live: "https://lumen.130-210-16-198.sslip.io/?q=goroutines+channels",
        code: "https://github.com/Nafiz001/lumen",
      },
    ],
  },
  {
    title: "Distributed systems and payments",
    rows: [
      {
        title: "Logarithm Warehouse",
        line: "BUET CSE Fest 2026, 2nd runner-up. A fragile monolith rebuilt as Order and Inventory services with a database each, behind Nginx. A shared Redis counter keeps the chaos tests deterministic across three replicas; Prometheus and Grafana watch it.",
        stack: "Node.js, PostgreSQL, Redis, Nginx, Prometheus, Grafana",
        live: "https://warehouse.130-210-37-18.sslip.io",
        code: "https://github.com/Nafiz001/logarithm-warehouse",
      },
      {
        title: "kori",
        line: "A double-entry ledger and payments API: balanced transactions, idempotent retries, and a check that re-derives every balance from the journal. Try to break it in the live sandbox.",
        stack: "TypeScript, PostgreSQL, Redis",
        live: "https://kori.130-210-37-18.sslip.io",
        code: "https://github.com/Nafiz001/kori",
      },
    ],
  },
  {
    title: "Real-time and interactive",
    rows: [
      {
        title: "noctiluca",
        line: "A deep-sea dive lit by strangers' messages. A light's fade is an exponential the database indexes, and other divers appear live over WebSockets.",
        stack: "Django, Channels, Next.js, WebGL",
        live: "https://noctiluca-two.vercel.app",
        code: "https://github.com/Nafiz001/noctiluca",
      },
      {
        title: "kirie",
        line: "A pop-up paper book of the sky over 36 places, lit by the weather there right now, with live readers folding paper cranes.",
        stack: "ASP.NET Core, SignalR, SvelteKit, CSS 3D",
        live: "https://kirie.130-210-16-198.sslip.io",
        code: "https://github.com/Nafiz001/kirie",
      },
      {
        title: "ebru",
        line: "Turkish paper marbling that anyone can work in at once, with the same Rust maths on the server and in the browser, bit for bit.",
        stack: "Rust, axum, WebAssembly, Vue",
        live: "https://ebru.130-210-16-198.sslip.io",
        code: "https://github.com/Nafiz001/ebru",
      },
      {
        title: "Vantage",
        line: "Techathon Nationals 2026. A 6-DOF robot arm driven by joystick, voice, hand gestures or an LLM agent, every command through one IK solver and safety gate.",
        stack: "React Three Fiber, URDF, MediaPipe, Arduino firmware",
        live: "https://logarithm-techathon.vercel.app",
        code: "https://github.com/Nafiz001/logarithm-techathon",
      },
      {
        title: "Asterism",
        line: "A stargazing app: hold your phone to the sky and it names the stars, planets and the ISS. The link is its web build.",
        stack: "Expo, React Native Skia, Reanimated",
        live: "https://asterism.130-210-16-198.sslip.io",
        code: "https://github.com/Nafiz001/asterism",
      },
      {
        title: "Ryōiki Tenkai",
        line: "Jujutsu Kaisen's Domain Expansions as a 2.5D depth tunnel, a clash simulator and a three.js realm, scored with the Web Audio API.",
        stack: "TypeScript, Canvas 2D, three.js, Web Audio",
        live: "https://jjk-domain-expansion.vercel.app",
        code: "https://github.com/Nafiz001/jjk-domain-expansion",
      },
    ],
  },
];

// Working deployments that show breadth but are not headline work.
export const moreLive = [
  ["ShopCircuit", "https://shopcircuit.vercel.app", "E-Commerce-"],
  ["DevEvent", "https://dev-events-nextjs-six.vercel.app", "dev-events-nextjs"],
  ["Shabuj University Finder", "https://shabuj-university-finder.vercel.app", "shabuj-university-finder"],
  ["Employee & Family Registry", "https://employee-family-registry-system.vercel.app", "employee-family-registry-system"],
];
