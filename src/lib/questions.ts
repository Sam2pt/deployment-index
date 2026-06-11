import type { Industry, Question } from "./types";

// The 5 scoring questions (PRD §06). Each option awards one point to the
// archetype named beside it in the PRD. Q6 (industry) is handled separately
// in `INDUSTRIES` because it routes ranking only, not archetype scoring.

export const QUESTIONS: Question[] = [
  {
    number: 1,
    prompt: "Your default move when a new AI tool lands in your category:",
    options: [
      { id: "a", tag: "Audit it", label: "Audit it against the existing stack and the deployment roadmap", archetype: "architect" },
      { id: "b", tag: "Pilot it now", label: "Pilot it within a week to see what it can really do", archetype: "pioneer" },
      { id: "c", tag: "Wait for ROI", label: "Wait for the ROI case before committing", archetype: "operator" },
      { id: "d", tag: "Loop in IT", label: "Loop in IT and data before forming a view", archetype: "connector" },
      { id: "e", tag: "Try it myself", label: "Try it personally first to understand it deeply", archetype: "renaissance" },
    ],
  },
  {
    number: 2,
    prompt: "When your team talks about AI, the conversation is mostly:",
    options: [
      { id: "a", tag: "Integrate it", label: "Where we're integrating it into the operating model next", archetype: "architect" },
      { id: "b", tag: "What's new", label: "What's new this week and what to test", archetype: "pioneer" },
      { id: "c", tag: "Time & spend", label: "What it's saving us in time and spend", archetype: "operator" },
      { id: "d", tag: "Get aligned", label: "How to align marketing, data, and technology", archetype: "connector" },
      { id: "e", tag: "Everywhere", label: "Everywhere from creative to performance to ops", archetype: "renaissance" },
    ],
  },
  {
    number: 3,
    prompt: "Your team's relationship to data is best described as:",
    options: [
      { id: "a", tag: "In production", label: "Governed, accessible, and feeding decisions in production", archetype: "architect" },
      { id: "b", tag: "Experimental", label: "Lots of experiments, sometimes ahead of governance", archetype: "pioneer" },
      { id: "c", tag: "Reported weekly", label: "Reported on weekly, tied to spend and outcomes", archetype: "operator" },
      { id: "d", tag: "Getting joined up", label: "Spread across teams, working on better integration", archetype: "connector" },
      { id: "e", tag: "Daily driver", label: "A daily working environment for the whole function", archetype: "renaissance" },
    ],
  },
  {
    number: 4,
    prompt: "Your CFO would describe your marketing investment in AI as:",
    options: [
      { id: "a", tag: "Infrastructure", label: "Compounding into infrastructure", archetype: "architect" },
      { id: "b", tag: "A good bet", label: "Worth the bet, still proving out", archetype: "pioneer" },
      { id: "c", tag: "Tightly managed", label: "Tightly managed against returns", archetype: "operator" },
      { id: "d", tag: "Cross-functional", label: "Increasingly cross-functional", archetype: "connector" },
      { id: "e", tag: "Reshaping work", label: "Reshaping how the whole function works", archetype: "renaissance" },
    ],
  },
  {
    number: 5,
    prompt: "Your team's biggest focus right now:",
    options: [
      { id: "a", tag: "Go to production", label: "Production AI doing what humans used to", archetype: "architect" },
      { id: "b", tag: "Faster pilots", label: "Faster pilots without losing rigor", archetype: "pioneer" },
      { id: "c", tag: "Prove the ROI", label: "Proving ROI on what's already deployed", archetype: "operator" },
      { id: "d", tag: "Move in sync", label: "Getting tech, data, and marketing to move at the same pace", archetype: "connector" },
      { id: "e", tag: "Keeping pace", label: "Keeping pace with the breadth of where AI is showing up", archetype: "renaissance" },
    ],
  },
];

// Q6 — industry. Drop-down, ranking only (PRD §06).
export const INDUSTRIES: Industry[] = [
  { id: "cpg", label: "CPG" },
  { id: "beauty", label: "Beauty" },
  { id: "apparel", label: "Apparel" },
  { id: "finserv", label: "Financial Services" },
  { id: "tech", label: "Tech & SaaS" },
  { id: "hospitality", label: "Hospitality & Travel" },
  { id: "health", label: "Health & Wellness" },
  { id: "media", label: "Media & Entertainment" },
  { id: "retail", label: "Retail" },
  { id: "automotive", label: "Automotive" },
  { id: "other", label: "Other" },
];

export const TOTAL_QUESTIONS = QUESTIONS.length + 1; // 5 scored + 1 industry = 6
