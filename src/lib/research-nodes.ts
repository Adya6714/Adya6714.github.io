export type ResearchStatus = "published" | "preprint" | "in-progress" | "survey" | "applied";

export type ResearchNode = {
  id: string;
  title: string;
  shortLabel: string;
  depth: number; // 1–5, sizes the node
  status: ResearchStatus;
  year?: number;
  venue?: string;
  abstract: string;
  methods: string[];
  href: string;
  artifacts?: { label: string; href: string }[];
  related: string[];
  x: number; // 0–100 layout coords
  y: number;
};

export const researchNodes: ResearchNode[] = [
  {
    id: "same-score",
    title: "Same Score, Different Strategy",
    shortLabel: "Same Score",
    depth: 5,
    status: "published",
    year: 2026,
    venue: "CAISc 2026",
    abstract:
      "Models that match on aggregate accuracy often diverge in reasoning strategy. We show how score-equivalent systems take systematically different paths through multi-step problems, and why that matters for evaluation.",
    methods: ["behavioral probes", "trajectory clustering", "error typology"],
    href: "/research#same-score",
    artifacts: [
      { label: "Paper", href: "/writing/same-score-different-strategy" },
      { label: "Code", href: "https://github.com/adyasrivastava" },
    ],
    related: ["reasoning-probes", "mech-interp"],
    x: 48,
    y: 28,
  },
  {
    id: "reasoning-probes",
    title: "LLM Reasoning Probes",
    shortLabel: "Reasoning Probes",
    depth: 4,
    status: "in-progress",
    abstract:
      "A three-probe framework spanning faithfulness, consistency, and compositional generalization, evaluated across five frontier and open-weight models.",
    methods: ["probe design", "cross-model eval", "consistency suites"],
    href: "/research#reasoning-probes",
    artifacts: [{ label: "Notes", href: "/writing/probe-design-notes" }],
    related: ["same-score", "mech-interp"],
    x: 72,
    y: 42,
  },
  {
    id: "mech-interp",
    title: "Mechanistic Interpretability Track",
    shortLabel: "Mech Interp",
    depth: 4,
    status: "in-progress",
    abstract:
      "Circuit-level analysis of reasoning failures: locating where models abandon intermediate constraints and how that maps to surface-level fluency.",
    methods: ["activation patching", "circuit discovery", "feature attribution"],
    href: "/research#mech-interp",
    related: ["same-score", "reasoning-probes", "quantum-survey"],
    x: 28,
    y: 48,
  },
  {
    id: "diffusion-ppo",
    title: "Diffusion Volatility Surfaces + PPO Hedging",
    shortLabel: "Diffusion × PPO",
    depth: 3,
    status: "preprint",
    year: 2025,
    abstract:
      "Diffusion-generated NIFTY 50 volatility surfaces paired with PPO-based hedging policies under realistic transaction costs and regime shifts.",
    methods: ["diffusion models", "PPO", "market sim"],
    href: "/research#diffusion-ppo",
    related: ["fraud-graph", "quantum-survey"],
    x: 18,
    y: 72,
  },
  {
    id: "quantum-survey",
    title: "Hybrid Quantum-Classical Paradigms",
    shortLabel: "Quantum Survey",
    depth: 3,
    status: "survey",
    year: 2025,
    abstract:
      "A structured survey of hybrid quantum-classical learning pipelines, with emphasis on where classical bottlenecks dominate and where quantum subroutines may help.",
    methods: ["literature synthesis", "taxonomy", "gap analysis"],
    href: "/research#quantum-survey",
    related: ["mech-interp", "diffusion-ppo"],
    x: 42,
    y: 78,
  },
  {
    id: "fraud-graph",
    title: "Graph ML + XGBoost Fraud Detection",
    shortLabel: "Fraud Graph",
    depth: 3,
    status: "applied",
    year: 2024,
    abstract:
      "Heterogeneous graph features fused with gradient-boosted tabular models for transaction fraud, balancing precision under severe class imbalance.",
    methods: ["GNN embeddings", "XGBoost", "calibration"],
    href: "/research#fraud-graph",
    related: ["diffusion-ppo", "applied-eng"],
    x: 68,
    y: 70,
  },
  {
    id: "applied-eng",
    title: "Applied Engineering Track",
    shortLabel: "Applied Eng",
    depth: 2,
    status: "applied",
    abstract:
      "Agentic CloudWatch tooling, document VLM OCR evaluation harnesses, and OmniMesh — an offline mesh networking stack for constrained environments.",
    methods: ["agents", "VLM eval", "mesh networking"],
    href: "/research#applied-eng",
    artifacts: [
      { label: "OmniMesh", href: "https://github.com/adyasrivastava" },
      { label: "OCR eval notes", href: "/writing/probe-design-notes" },
    ],
    related: ["fraud-graph", "reasoning-probes"],
    x: 88,
    y: 55,
  },
];

export const statusLabel: Record<ResearchStatus, string> = {
  published: "Published",
  preprint: "Preprint",
  "in-progress": "In progress",
  survey: "Survey",
  applied: "Applied",
};
