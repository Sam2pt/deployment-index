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
      "Pioneers move first. You're the one who said yes to ChatGPT in 2022, ran the first AI pilot before anyone had budget for it, and you still test things on Friday nights. The rest of the company catches up to where you've already been.",
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
  renaissance: {
    key: "renaissance",
    index: "05",
    name: "The Renaissance Lead",
    short: "Renaissance Lead",
    tagline: "Curious. Breadth-first. AI-fluent across the function.",
    paragraph:
      "Renaissance Leads see AI everywhere: creative briefs, paid media, customer journeys, brand strategy, ops. You're not specialized in any of it because you're fluent in all of it. The teams around you learn fastest because you make connections others miss.",
    nextMoves: [
      "Pick one domain to compound into",
      "Build a small in-house AI capability",
      "Publish your perspective externally",
    ],
    servicePath: "Strategy & Diagnostic (broad) → multi-domain pod",
    percentile: { min: 72, max: 90 },
    palette: { c1: "#14E0C8", c2: "#FFC93C", c3: "#22D3EE", accent: "#5BEAD9" },
    stats: [
      { label: "Range", value: 96 },
      { label: "Curiosity", value: 90 },
      { label: "Vision", value: 80 },
      { label: "Adaptability", value: 78 },
    ],
  },
};

export const ARCHETYPE_ORDER: ArchetypeKey[] = [
  "architect",
  "pioneer",
  "operator",
  "connector",
  "renaissance",
];
