import type { Archetype, ArchetypeKey } from "./types";

// Archetype definitions, verbatim from PRD §07. Each carries the copy used
// across the reveal, the gated PDF, and the share card, plus the v1 static
// percentile range from PRD §08.

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  architect: {
    key: "architect",
    index: "01",
    name: "The Architect",
    short: "Architect",
    tagline: "Strategic. Deliberate. You build for compounding returns.",
    paragraph:
      "Architects don't chase shiny tools. They design systems. You think in operating models, not features. Your team trusts you because you connect today's decision to next year's leverage. AI is infrastructure, not novelty.",
    nextMoves: [
      "Deepen the deployment portfolio",
      "Build the platform layer beneath the agents",
      "Transfer ownership in-house",
    ],
    servicePath: "Custom Deployments → Enterprise Infrastructure",
    percentile: { min: 78, max: 94 },
    palette: { c1: "#2E5BFF", c2: "#00E0FF", c3: "#6D9CFF", accent: "#5FD9FF" },
    stats: [
      { label: "Systems", value: 95 },
      { label: "Rigor", value: 88 },
      { label: "Alignment", value: 78 },
      { label: "Velocity", value: 62 },
    ],
  },
  pioneer: {
    key: "pioneer",
    index: "02",
    name: "The Pioneer",
    short: "Pioneer",
    tagline: "Early. Bold. Often ahead of the rest of the org.",
    paragraph:
      "Pioneers move first. You're the one who said yes to ChatGPT in 2022, ran the first AI pilot before anyone had budget for it, and still test things on Friday nights. The rest of the company catches up to where you've already been.",
    nextMoves: [
      "Convert pilots into production",
      "Get the data foundation right",
      "Bring the CFO along",
    ],
    servicePath: "Strategy & Diagnostic → Custom Deployments",
    percentile: { min: 65, max: 88 },
    palette: { c1: "#FF2D7E", c2: "#FF8A00", c3: "#FF4D4D", accent: "#FF9E57" },
    stats: [
      { label: "Velocity", value: 96 },
      { label: "Vision", value: 90 },
      { label: "Range", value: 78 },
      { label: "Rigor", value: 58 },
    ],
  },
  operator: {
    key: "operator",
    index: "03",
    name: "The Operator",
    short: "Operator",
    tagline: "Disciplined. KPI-led. Runs a tight ship.",
    paragraph:
      "Operators measure everything. Your AI conversations are about ROAS, retention, cost-to-serve, time-to-decision. You're not anti-novelty, you just won't deploy until the math works. When you commit, the rest of the function follows your numbers.",
    nextMoves: [
      "Pressure-test the cost case on existing AI",
      "Identify the next deployment with the highest leverage",
      "Negotiate harder on the agency line",
    ],
    servicePath: "Strategy & Diagnostic → Custom Deployments (performance-first)",
    percentile: { min: 70, max: 92 },
    palette: { c1: "#00E08A", c2: "#B4FF39", c3: "#16C784", accent: "#7CF59E" },
    stats: [
      { label: "Rigor", value: 95 },
      { label: "ROI Sense", value: 92 },
      { label: "Discipline", value: 88 },
      { label: "Velocity", value: 66 },
    ],
  },
  connector: {
    key: "connector",
    index: "04",
    name: "The Connector",
    short: "Connector",
    tagline: "Builds coalitions. Bridges marketing, data, and tech.",
    paragraph:
      "Connectors make AI happen in the org, not just in the deck. You know the CTO's first name, the data lead respects you, and procurement returns your emails. The real bottleneck in AI deployment is rarely technology, it's alignment. You move that.",
    nextMoves: [
      "Codify the operating model",
      "Get the platform contract in place",
      "Run the first joint marketing-and-tech deployment",
    ],
    servicePath: "Enterprise Infrastructure → Adoption & Transfer",
    percentile: { min: 68, max: 86 },
    palette: { c1: "#7C3AED", c2: "#EC4899", c3: "#A855F7", accent: "#D58BFF" },
    stats: [
      { label: "Alignment", value: 96 },
      { label: "Influence", value: 90 },
      { label: "Systems", value: 74 },
      { label: "Velocity", value: 68 },
    ],
  },
  bandit: {
    key: "bandit",
    index: "05",
    name: "The Bandit",
    short: "Bandit",
    tagline: "Hoards the budget. Blocks the rollout. Rides off into the sunset.",
    paragraph:
      "Bandits don't deploy, they delay. While the rest of the market ships, you're still \"evaluating.\" The pilot's been \"next quarter\" for three quarters running, and you guard the status quo like it's gold in a vault. The good news: every great comeback starts with a villain arc. One approved rollout and you're a hero.",
    nextMoves: [
      "Green-light one pilot you've been sitting on",
      "Retire \"let's wait and see\" for a quarter",
      "Let the team ship before a competitor does",
    ],
    servicePath: "Strategy & Diagnostic → Custom Deployments (time to actually ship)",
    // The joke class: deliberately rock-bottom, unlike everyone else's flattering band.
    percentile: { min: 2, max: 11 },
    palette: { c1: "#E63946", c2: "#FF6B35", c3: "#C1121F", accent: "#FF5A5A" },
    stats: [
      { label: "Foot-dragging", value: 96 },
      { label: "Budget guard", value: 90 },
      { label: "Vision", value: 24 },
      { label: "Velocity", value: 18 },
    ],
  },
};

export const ARCHETYPE_ORDER: ArchetypeKey[] = [
  "architect",
  "pioneer",
  "operator",
  "connector",
  "bandit",
];
