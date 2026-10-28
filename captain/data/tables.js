/* Result tables for the CaPtain project page.
   Numbers are copied verbatim from the paper (Tables 1-3 and the appendix LIBERO-family table).
   Cell format: number | null (not reported) | {v: number, approx?: true, fn: "a,g"}  (fn = footnote marks)
   tone: "ours" | "api" (frontier-API agent) | "train" (trained/developed on the benchmark) | "" (other) */
window.CAPTAIN_TABLES = {

  /* Table 1: SFT vs. RL on the LIBERO family (host / strict success %). */
  main: {
    rows: [
      { bench: "LIBERO (official states 11–16)", n: 240, base: [0.0, 0.0], sft: [55.4, 52.1], rl: [73.8, 67.5], d: ["+18.3", "+15.4"], p: ["4×10⁻⁸", "7×10⁻⁶"] },
      { bench: "LIBERO-PRO Pos+Task, 6-cell", n: 600, base: [0.3, 0.2], sft: [59.5, 56.7], rl: [78.5, 71.5], d: ["+19.0", "+14.8"], p: ["10⁻²⁰", "2×10⁻¹⁴"] },
      { bench: "LIBERO-PRO Pos+Task, 8-cell", n: 800, base: [0.2, 0.1], sft: [49.2, 45.1], rl: [68.6, 58.9], d: ["+19.4", "+13.8"], p: ["8×10⁻²⁸", "10⁻¹⁶"] },
      { bench: "LIBERO-Plus (7 dims)", n: 700, base: [0.0, 0.0], sft: [48.6, 44.6], rl: [66.1, 59.0], d: ["+17.6", "+14.4"], p: ["8×10⁻²¹", "5×10⁻¹⁵"] },
      { bench: "LIBERO-PRO, 4 categories", n: 160, base: [0.0, 0.0], sft: [48.8, 48.1], rl: [68.8, 60.6], d: ["+20.0", "+12.5"], p: ["4×10⁻⁷", "3×10⁻³"] },
      { bench: "LIBERO-MAX Dynamic", n: 80, base: [0.0, 0.0], sft: [40.0, 40.0], rl: [61.2, 50.0], d: ["+21.2", "+10.0"], p: ["2×10⁻³", "0.15"] },
      { bench: "LIBERO-MAX Base", n: 80, base: [0.0, 0.0], sft: [51.2, 45.0], rl: [70.0, 63.8], d: ["+18.8", "+18.8"], p: ["2×10⁻³", "4×10⁻³"] }
    ]
  },

  boards: [
    /* Table 2: LIBERO-PRO Pos+Task with disclosure of model, skills and training data. */
    {
      id: "pro",
      title: "LIBERO-PRO",
      subtitle: "Pos+Task, 6-cell / 8-cell success (%). Comparison with published systems, with disclosure of model, skills and training data.",
      columns: [
        { key: "system", label: "System", type: "text" },
        { key: "model", label: "Policy model", type: "text" },
        { key: "frontier", label: "Frontier at test", type: "bool" },
        { key: "skills", label: "Skills / extra signals", type: "text", hideSm: true },
        { key: "data", label: "Training data", type: "text", hideSm: true },
        { key: "c6", label: "Pos+Task 6c", type: "num", bar: true, sortDefault: true },
        { key: "c8", label: "8c", type: "num" }
      ],
      rows: [
        { system: "OpenRUA", family: "CaP", tone: "api", model: "Claude Opus 5", frontier: true, skills: "ROS 2 terminal", data: "none", c6: { v: 91.8, fn: "a,g" }, c8: 87.0 },
        { system: "Harness VLA", family: "CaP", tone: "train", model: "Opus 4.7", frontier: true, skills: "frozen π0.5 (LIBERO-130)", data: "memory on seed 0", c6: { v: 87.7, fn: "b" }, c8: 82.4 },
        { system: "AgenticRoboRL", family: "CaP", tone: "train", model: "Qwen3.5-9B SFT+RL", frontier: false, skills: "frozen π_RLinf", data: "PRO tasks, other states", c6: { v: 81.3, fn: "g,h" }, c8: 71.0 },
        { system: "CaPtain-4B", family: "CaP", tone: "ours", bold: true, model: "Qwen3.5-4B", frontier: false, skills: "22-cap. API, SAM3/Molmo", data: "+ RL on orig. LIBERO tasks", c6: 78.5, c8: 68.6 },
        { system: "K1", family: "CaP", tone: "api", model: "Gemini 3.7 Flash", frontier: true, skills: "SAM3, GraspGen", data: "none", c6: { v: 77.2, fn: "b,f" }, c8: null },
        { system: "WAA", family: "CaP", tone: "api", model: "Gemini 3.7 Flash", frontier: true, skills: "rehearsal", data: "none", c6: { v: 75.6, fn: "c" }, c8: null },
        { system: "ASPIRE", family: "CaP", tone: "train", model: "Opus 4.6", frontier: true, skills: "CaP-X API", data: "per-task dev seeds", c6: { v: 71.7, fn: "d" }, c8: null },
        { system: "SPARK", family: "CaP", tone: "train", model: "Qwen3.8-27B", frontier: false, skills: "keypoint BT", data: "primitives dev. on PRO", c6: { v: 66.8, fn: "c,d,e" }, c8: null },
        { system: "CaPtain-4B-SFT", family: "CaP", tone: "ours", model: "Qwen3.5-4B", frontier: false, skills: "22-cap. API, SAM3/Molmo", data: "agent traces, orig. LIBERO tasks", c6: 59.5, c8: 49.2 },
        { system: "RLinf π0.5 (via Harness VLA)", family: "VLA", tone: "train", model: "VLA", frontier: false, skills: "–", data: "LIBERO-130 demos", c6: 56.2, c8: 50.0 },
        { system: "RACaP", family: "CaP", tone: "api", model: "GPT-5.5", frontier: true, skills: "6 mid-level APIs", data: "LIBERO-90 dev", c6: { v: 45.0, fn: "e,f" }, c8: null },
        { system: "RATs", family: "CaP", tone: "train", model: "Gemini 3.1 Pro", frontier: true, skills: "play + verifier", data: "play in PRO env", c6: { v: 43.8, fn: "b" }, c8: null },
        { system: "Guava", family: "CaP", tone: "", model: "Qwen3.5-4B SFT (+GRPO)", frontier: false, skills: "manipulation API", data: "agent traces (+ GRPO on 2 tasks)", c6: { v: 41, approx: true }, c8: null },
        { system: "CaP-Agent0", family: "CaP", tone: "api", model: "3-model ensemble", frontier: true, skills: "CaP-X API", data: "none", c6: { v: 18.2, fn: "d" }, c8: null },
        { system: "π0.5", family: "VLA", tone: "train", model: "VLA", frontier: false, skills: "–", data: "LIBERO demos", c6: { v: 12.8, fn: "d" }, c8: 10.8 }
      ],
      footnotes: {
        a: "latched success",
        b: "test-time oracle or memory from test seeds",
        c: "privileged simulator geometry or ground-truth depth",
        d: "50 trials per task",
        e: "T = 0",
        f: "30 episodes per cell",
        g: "wider budget (100–500 turns)",
        h: "our recomputation of the six-cell average from the paper's per-cell numbers"
      },
      note: "Frontier at test: whether a frontier model is queried while the robot acts. Other baseline numbers are copied from the papers."
    },

    /* Appendix table: full LIBERO-family comparison. */
    {
      id: "family",
      title: "LIBERO family",
      subtitle: "Published results on standard LIBERO, LIBERO-PRO, LIBERO-Plus and LIBERO-MAX for VLAs, world-action models (WAMs) and code-as-policy (CaP) agents (success %).",
      columns: [
        { key: "system", label: "Method", type: "text" },
        { key: "family", label: "Family", type: "text", hideSm: true },
        { key: "frontier", label: "Frontier at test", type: "bool" },
        { key: "demos", label: "LIBERO demos", type: "bool", hideSm: true },
        { key: "libero", label: "LIBERO", type: "num", bar: true },
        { key: "c6", label: "PRO 6c", type: "num", sortDefault: true },
        { key: "c8", label: "PRO 8c", type: "num" },
        { key: "plus", label: "Plus", type: "num" },
        { key: "maxb", label: "MAX Base", type: "num" },
        { key: "maxd", label: "MAX Dyn.", type: "num" },
        { key: "ret", label: "Plus / LIBERO", type: "num", dec: 0 }
      ],
      rows: [
        { system: "CaPtain-4B (ours)", family: "CaP", tone: "ours", bold: true, frontier: false, demos: false, libero: 73.8, c6: 78.5, c8: 68.6, plus: 66.1, maxb: 70.0, maxd: 61.2, ret: 90 },
        { system: "CaPtain-4B-SFT (ours)", family: "CaP", tone: "ours", frontier: false, demos: false, libero: 55.4, c6: 59.5, c8: 49.2, plus: 48.6, maxb: 51.2, maxd: 40.0, ret: 88 },
        { system: "Qwen3.5-4B (base)", family: "CaP", tone: "ours", frontier: false, demos: false, libero: 0.0, c6: 0.3, c8: 0.2, plus: 0.0, maxb: 0.0, maxd: 0.0, ret: null },
        { system: "OpenVLA", family: "VLA", tone: "", frontier: false, demos: true, libero: 76.5, c6: 0.0, c8: 0.0, plus: 15.6, maxb: null, maxd: null, ret: 20 },
        { system: "OpenVLA-OFT", family: "VLA", tone: "", frontier: false, demos: true, libero: 97.1, c6: null, c8: null, plus: 69.6, maxb: 64.3, maxd: 43.2, ret: 72 },
        { system: "RIPT-VLA", family: "VLA", tone: "", frontier: false, demos: true, libero: 97.5, c6: null, c8: null, plus: 68.4, maxb: null, maxd: null, ret: 70 },
        { system: "π0", family: "VLA", tone: "", frontier: false, demos: true, libero: 94.2, c6: 0.0, c8: { v: 0.3, fn: "†" }, plus: 53.6, maxb: null, maxd: null, ret: 57 },
        { system: "π0-FAST", family: "VLA", tone: "", frontier: false, demos: true, libero: 85.5, c6: null, c8: null, plus: 61.6, maxb: null, maxd: null, ret: 72 },
        { system: "π0.5", family: "VLA", tone: "", frontier: false, demos: true, libero: 96.9, c6: { v: 12.8, fn: "d" }, c8: 10.8, plus: { v: 84.4, fn: "†" }, maxb: 79.7, maxd: 65.7, ret: 87 },
        { system: "UniVLA", family: "VLA", tone: "", frontier: false, demos: true, libero: 95.2, c6: null, c8: 2.5, plus: 42.9, maxb: null, maxd: null, ret: 45 },
        { system: "GR00T N1.6 / N1.7", sysFn: "k", family: "VLA", tone: "", frontier: false, demos: true, libero: { v: 97.0, fn: "†" }, c6: null, c8: null, plus: null, maxb: 69.3, maxd: 50.0, ret: null },
        { system: "MolmoAct2", family: "VLA", tone: "", frontier: false, demos: true, libero: null, c6: { v: 18.6, fn: "†" }, c8: null, plus: null, maxb: 80.3, maxd: 66.9, ret: null },
        { system: "Cosmos-Policy", family: "WAM", tone: "", frontier: false, demos: true, libero: 98.5, c6: null, c8: null, plus: { v: 82.2, fn: "†" }, maxb: 77.4, maxd: 59.3, ret: 83 },
        { system: "Fast-WAM", family: "WAM", tone: "", frontier: false, demos: true, libero: { v: 97.6, fn: "†" }, c6: null, c8: null, plus: { v: 51.5, fn: "†" }, maxb: 42.0, maxd: 24.0, ret: 53 },
        { system: "GE-Act + Robust-WAM", family: "WAM", tone: "", frontier: false, demos: true, libero: 97.3, c6: null, c8: null, plus: 80.9, maxb: null, maxd: null, ret: 83 },
        { system: "OpenWAM-α", family: "WAM", tone: "", frontier: false, demos: true, libero: 99.3, c6: null, c8: null, plus: 69.2, maxb: null, maxd: null, ret: 70 },
        { system: "OpenRUA", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 91.8, fn: "a,g" }, c8: 87.0, plus: null, maxb: null, maxd: null, ret: null },
        { system: "Harness VLA (Opus 4.7)", family: "CaP", tone: "", frontier: true, demos: true, libero: 96.0, c6: { v: 87.7, fn: "b" }, c8: 82.4, plus: null, maxb: null, maxd: null, ret: null },
        { system: "AgenticRoboRL", family: "CaP", tone: "", frontier: false, demos: true, libero: null, c6: { v: 81.3, fn: "g,h,i" }, c8: 71.0, plus: 72.2, maxb: null, maxd: null, ret: null },
        { system: "K1", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 77.2, fn: "b,f" }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "WAA", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 75.6, fn: "c" }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "ASPIRE", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 71.7, fn: "b,d" }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "SPARK", family: "CaP", tone: "", frontier: false, demos: false, libero: null, c6: { v: 66.8, fn: "c,d,e" }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "RACaP", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 45.0, fn: "e,f" }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "Guava", family: "CaP", tone: "", frontier: false, demos: false, libero: null, c6: { v: 41, approx: true }, c8: null, plus: null, maxb: null, maxd: null, ret: null },
        { system: "CaP-Agent0", family: "CaP", tone: "", frontier: true, demos: false, libero: null, c6: { v: 18.2, fn: "d" }, c8: null, plus: null, maxb: null, maxd: null, ret: null }
      ],
      footnotes: {
        a: "latched success",
        b: "test-time success oracle, or memory or programs built on other seeds of the test tasks",
        c: "privileged simulator geometry or ground-truth depth",
        d: "50 trials per task",
        e: "T = 0",
        f: "30 episodes per cell",
        g: "budget of 100–500 turns",
        h: "six-cell average recomputed from the per-cell numbers",
        i: "planner trained on the LIBERO-PRO test tasks with other initial states",
        k: "LIBERO for N1.6, LIBERO-MAX for N1.7",
        "†": "evaluated by a later paper: Harness VLA (π0 PRO 8c), OpenWAM-α (LIBERO-Plus of π0.5, Cosmos-Policy and Fast-WAM; LIBERO of GR00T N1.6 and Fast-WAM), SPARK (MolmoAct2)"
      },
      note: "Bold: best among methods that use neither a frontier model at test time nor LIBERO demonstrations. Plus / LIBERO: LIBERO-Plus success as a percentage of standard LIBERO success. Ours: host success; LIBERO on the held-out official initial states 11–16 (240 episodes); LIBERO-PRO Pos+Task with initial states 1–10, 100 episodes per cell; LIBERO-Plus on a stratified 700-case sample; LIBERO-MAX on the 80 Lite cases. Baselines: LIBERO with 500 episodes per suite (Harness VLA: 100); LIBERO-Plus on the full 10,030 instances; LIBERO-MAX on 8,000 pairs, with Dynamic replaying the Base prefix."
    },

    /* Table 3: zero-shot transfer. */
    {
      id: "transfer",
      title: "Zero-shot transfer",
      subtitle: "RoboTwin 2.0, SimplerEnv and CaP-Bench: success %; RoboDojo: leaderboard Score (footnote d).",
      groups: [
        { key: "robotwin", label: "RoboTwin 2.0", note: "randomized scenes" },
        { key: "robodojo", label: "RoboDojo-Sim", note: "dual ARX X5 · Score", fn: "d" },
        { key: "simplerenv", label: "SimplerEnv", note: "WidowX (Bridge), visual matching" },
        { key: "capbench", label: "CaP-Bench", note: "Cube Lift and Cube Stack", fn: "e" }
      ],
      columns: [
        { key: "system", label: "System", type: "text" },
        { key: "family", label: "Family", type: "text" },
        { key: "model", label: "Policy model", type: "text" },
        { key: "trained", label: "Training data", type: "text", hideSm: true },
        { key: "all", label: "All", type: "num", bar: true, sortDefault: true },
        { key: "single", label: "Single-arm", type: "num" }
      ],
      rows: [
        { group: "robotwin", system: "CaPtain-4B", family: "CaP", tone: "ours", bold: true, model: "Qwen3.5-4B", frontier: false, trained: "LIBERO", all: { v: 22.6, fn: "b" }, single: 30.0 },
        { group: "robotwin", system: "X-VLA", family: "VLA", tone: "train", model: "–", frontier: false, trained: "clean demos", all: { v: 20.9, fn: "b" }, single: null },
        { group: "robotwin", system: "Xiaomi-Robotics-0", family: "VLA", tone: "train", model: "–", frontier: false, trained: "clean demos", all: { v: 18.2, fn: "b" }, single: null },
        { group: "robotwin", system: "RDT", family: "VLA", tone: "train", model: "–", frontier: false, trained: "50 clean demos per task", all: { v: 13.7, fn: "b" }, single: { v: 14.0, fn: "c" } },
        { group: "robotwin", system: "π0", family: "VLA", tone: "train", model: "–", frontier: false, trained: "50 clean demos per task", all: { v: 16.3, fn: "b" }, single: { v: 18.3, fn: "c" } },
        { group: "robotwin", system: "π0.5", family: "VLA", tone: "train", model: "–", frontier: false, trained: "2,500 clean demos", all: { v: 46.0, fn: "b" }, single: { v: 45.8, fn: "c" } },
        { group: "robotwin", system: "OpenWAM-α", family: "WAM", tone: "train", model: "–", frontier: false, trained: "clean demos", all: { v: 48.7, fn: "b" }, single: null },
        { group: "robotwin", system: "PyRUA-Lean Coder-4B", family: "CaP", tone: "train", model: "Qwen3.5-4B", frontier: false, trained: "RoboTwin demos (VLA tool)", all: { v: 52.4, fn: "a" }, single: null },

        { group: "robodojo", system: "RoboDojo agent", family: "CaP", tone: "api", model: "GPT-6 Astra", frontier: true, trained: "–", all: 29.0, single: { v: 31.9, fn: "c" } },
        { group: "robodojo", system: "RoboDojo agent", family: "CaP", tone: "api", model: "DeepSeek-Flash", frontier: true, trained: "–", all: 3.0, single: null },
        { group: "robodojo", system: "CaPtain-4B", family: "CaP", tone: "ours", bold: true, model: "Qwen3.5-4B", frontier: false, trained: "LIBERO", all: 1.7, single: 2.0 },
        { group: "robodojo", system: "RoboDojo agent", family: "CaP", tone: "api", model: "GPT-5.5", frontier: true, trained: "–", all: 1.1, single: null },
        { group: "robodojo", system: "RDT", family: "VLA", tone: "train", model: "–", frontier: false, trained: "RoboDojo training set", all: 0.5, single: null },
        { group: "robodojo", system: "OpenVLA-OFT", family: "VLA", tone: "train", model: "–", frontier: false, trained: "RoboDojo training set", all: 0.2, single: null },

        { group: "simplerenv", system: "ManiAgent", family: "Agent", tone: "api", model: "GPT-5", frontier: true, trained: "–", all: 86.8, single: null },
        { group: "simplerenv", system: "CaPtain-4B", family: "CaP", tone: "ours", bold: true, model: "Qwen3.5-4B", frontier: false, trained: "LIBERO", all: 83.3, single: null },
        { group: "simplerenv", system: "ManiAgent", family: "Agent", tone: "api", model: "Grok-4", frontier: true, trained: "–", all: 83.0, single: null },
        { group: "simplerenv", system: "PhysBrain 1.0", family: "VLA", tone: "train", model: "–", frontier: false, trained: "Bridge demos", all: { v: 80.2, fn: "g" }, single: null },
        { group: "simplerenv", system: "SoFar", family: "Agent", tone: "", model: "–", frontier: false, trained: "–", all: 58.3, single: null },
        { group: "simplerenv", system: "π0.5", family: "VLA", tone: "train", model: "–", frontier: false, trained: "Bridge demos", all: { v: 57.1, fn: "g" }, single: null },

        { group: "capbench", system: "CaPtain-4B", family: "CaP", tone: "ours", bold: true, model: "Qwen3.5-4B", frontier: false, trained: "LIBERO", all: 75.0, single: null },
        { group: "capbench", system: "CaP-X M2", family: "CaP", tone: "api", model: "Gemini-3-Pro", frontier: true, trained: "–", all: 73.5, single: null },
        { group: "capbench", system: "CaP-RL", family: "CaP", tone: "train", model: "Qwen2.5-Coder-7B", frontier: false, trained: "RL on CaP-Bench tasks", all: { v: 62.0, fn: "f" }, single: null },
        { group: "capbench", system: "CaP-X M2", family: "CaP", tone: "api", model: "GPT-5.2", frontier: true, trained: "–", all: 55.5, single: null },
        { group: "capbench", system: "CaP-X M2", family: "CaP", tone: "api", model: "Claude Opus 4.5", frontier: true, trained: "–", all: 54.0, single: null },
        { group: "capbench", system: "CaP-X S2", family: "CaP", tone: "", model: "Qwen2.5-Coder-7B", frontier: false, trained: "–", all: { v: 14.5, fn: "f" }, single: null }
      ],
      footnotes: {
        a: "250 randomized scenes, latched success, native Aloha-AgileX",
        b: "official Hard (clean-to-randomized) protocol, 100 trials per task; baselines trained on clean demonstrations and run on Aloha-AgileX, CaPtain-4B on the same instances with a dual-Franka embodiment",
        c: "our average of the per-task leaderboard results over the single-arm tasks",
        d: "42 tasks, official layouts and action budget, leaderboard Score (mean of five dimensions); CaPtain-4B on 15 layouts per task",
        e: "mean success on Cube Lift and Cube Stack, the two tasks reported for every model, at CaP-Gym's step horizon; 20 trials per task (baselines: 100)",
        f: "single-turn S2 setting",
        g: "with the official step limit, as reported by PhysBrain 1.0"
      },
      note: "Policy model: the language model that writes the actions; – for end-to-end policies. Single-arm subsets: RoboTwin tasks whose expert program moves one arm at a time and holds each object with a single arm (33 of 50); RoboDojo tasks with no simultaneous two-arm action, handover or navigation (32 of 42)."
    }
  ]
};
