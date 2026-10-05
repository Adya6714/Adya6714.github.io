/* Async interview content for the Ask stop. Edit answers here. */
window.CONTENT.ask = {
  title: "Ask",
  kicker: "A little more than a FAQ.",
  blurb: "If you want to understand how I think, build, research, or approach problems, start here. Pick a thread and walk through it like an interview.",
  still: {
    title: "Still have a question?",
    blurb: "I've tried to answer the questions I'm most often asked, but there's a good chance I've missed yours. Ask anything about my work, research, or how I approach problems — or leave something you think I should be thinking about."
  },
  layers: [
    { id: "me", label: "Start with me", kind: "list", ids: ["me-yourself", "me-looking", "me-aiml", "me-research", "me-scratch", "me-excite", "me-curious", "me-better", "me-team", "me-unconstrained"] },
    {
      id: "work", label: "My work", kind: "projects",
      projects: [
        {
          id: "rvc", title: "Retrieval vs Computation", tag: "Research · reasoning · evaluation",
          sections: [
            { label: "Start here", ids: ["rvc-what", "rvc-why", "rvc-hyp", "rvc-find", "rvc-surprise", "rvc-bench"] },
            { label: "Go deeper", ids: ["rvc-bench-build", "rvc-219", "rvc-probes", "rvc-confound", "rvc-fragility", "rvc-falsify", "rvc-next"] },
            { label: "Challenge me", ids: ["rvc-just-bench", "rvc-diff", "rvc-artifact", "rvc-process", "rvc-restart"] }
          ]
        },
        {
          id: "fraud", title: "FraudScope360", tag: "Multimodal · fraud · production-style",
          sections: [
            { label: "Start here", ids: ["fr-what", "fr-why", "fr-multi", "fr-hard", "fr-built"] },
            { label: "Go deeper", ids: ["fr-arch", "fr-graph", "fr-change"] },
            { label: "Challenge me", ids: ["fr-real", "fr-overfit"] }
          ]
        },
        {
          id: "mesh", title: "OmniMesh", tag: "Multimodal systems · edge · disaster",
          sections: [
            { label: "Start here", ids: ["om-what", "om-why", "om-offline", "om-hard"] },
            { label: "Go deeper", ids: ["om-arch", "om-agents", "om-next"] },
            { label: "Challenge me", ids: ["om-realworld", "om-latency"] }
          ]
        },
        {
          id: "ddpm", title: "DDPM volatility + RL hedging", tag: "Generative · quant · RL",
          sections: [
            { label: "Start here", ids: ["dd-what", "dd-why-diff", "dd-why-rl", "dd-result"] },
            { label: "Go deeper", ids: ["dd-data", "dd-contrib", "dd-learn"] },
            { label: "Challenge me", ids: ["dd-model-risk", "dd-market"] }
          ]
        },
        {
          id: "ocr", title: "Reading Without Looking", tag: "Vision-language · calibration",
          sections: [
            { label: "Start here", ids: ["ocr-what", "ocr-why", "ocr-find"] },
            { label: "Go deeper", ids: ["ocr-probes", "ocr-auroc"] },
            { label: "Challenge me", ids: ["ocr-prod", "ocr-trust"] }
          ]
        },
        {
          id: "nurix", title: "Nurix / ML engineering", tag: "Production speech · shipping",
          sections: [
            { label: "Start here", ids: ["nu-what", "nu-ship", "nu-learn"] },
            { label: "Go deeper", ids: ["nu-wer", "nu-prod"] },
            { label: "Challenge me", ids: ["nu-vs-research"] }
          ]
        }
      ]
    },
    { id: "research", label: "Research", kind: "list", ids: ["rs-questions", "rs-convincing", "rs-confound", "rs-benchmark", "rs-changed", "rs-now"] },
    { id: "behavioural", label: "Behavioural", kind: "list", ids: ["bh-failure", "bh-decision", "bh-scratch", "bh-wrong", "bh-learn", "bh-ambiguity", "bh-bad", "bh-improve"] },
    { id: "hard", label: "Hard questions", kind: "list", ids: ["hd-weak", "hd-overhyped", "hd-underrated", "hd-challenge", "hd-compute", "hd-unlimited", "hd-hire"] }
  ],
  qa: {
    /* ---------- Start with me ---------- */
    "me-yourself": {
      q: "Tell me about yourself.",
      short: "I'm an engineer who really likes building things from scratch. A lot of what I've done started with being curious about something and not really knowing how to build it yet.",
      deep: "I usually end up learning what I need, building a first version, breaking it, and then going deeper into why it behaves the way it does.\n\nOver time that pulled me toward AI and ML — there's this interesting combination of engineering and research. I like building systems, but I also really enjoy asking whether the thing I built is actually doing what I think it is doing.\n\nThat's probably why my work ranges from multimodal systems and AI applications to research around reasoning and evaluation. I'm currently looking for opportunities where I can do both sides seriously: hard engineering problems while continuing to develop as a researcher.",
      next: ["me-aiml", "me-looking", "me-scratch"]
    },
    "me-looking": {
      q: "What are you currently looking for?",
      short: "Roles where I can work closely on hard AI/ML problems — research and research engineering — and keep talking to people who are building and experimenting.",
      deep: "I want a place where evaluation is taken seriously, where shipping and questioning the meter aren't treated as opposite jobs. Ideal day: write code, run a probe, argue about what the result means, then ship the next thin slice.\n\nI'm also here for conversations. If you're working on something interesting, have a different way of looking at AI/ML, or think there's something I should know — I'd genuinely love to hear from you.",
      next: ["me-team", "me-excite", "hd-hire"]
    },
    "me-aiml": {
      q: "Why AI/ML?",
      short: "Because it sits at an exciting intersection of building systems and chasing questions that don't have obvious answers.",
      deep: "Engineering gives me the satisfaction of making something real. Research gives me permission to doubt whether the thing I made is doing what I think. AI/ML is where those two habits collide every week — you can ship a model and still be wrong about why it works.\n\nThat tension is what keeps me interested, not the hype cycle.",
      next: ["me-research", "me-scratch", "rs-questions"]
    },
    "me-research": {
      q: "Why do you like research?",
      short: "Research is how I chase questions that don't have a clean answer yet — and then force myself to make the answer checkable.",
      deep: "I don't think of research as only papers. It's the habit of asking: what would convince me I'm wrong? What confound am I pretending isn't there? Can someone else regenerate this from the code?\n\nThat's also why my papers lean on probes and ablations. I want the claim to survive a change that should not matter.",
      next: ["rs-convincing", "rs-questions", "bh-wrong"]
    },
    "me-scratch": {
      q: "Why do you like building things from scratch?",
      short: "Starting from a blank page forces me to understand the pieces — not just call an API and hope.",
      deep: "When I trained a small OCR model from scratch for Reading Without Looking, it wasn't because scratch is romantic. It was so I could blank the image, scramble it, and turn the vision pathway off. You can't run those counterfactuals on a closed API.\n\nSame instinct shows up in systems work: if I built the pipeline, I know where it breaks.",
      next: ["bh-scratch", "ocr-probes", "me-yourself"]
    },
    "me-excite": {
      q: "What kind of problems excite you?",
      short: "Problems where the benchmark number isn't the whole story — where two systems can look equally good and fail for totally different reasons.",
      deep: "Matched accuracy with different strategies. Confidence that doesn't track evidence. Hedging agents that inherit a market model's blind spots. Fraud that only appears in the graph of accounts, not in a single row.\n\nIf the interesting failure lives one layer under the metric people usually watch, I'm interested.",
      next: ["rvc-bench", "ocr-what", "rs-benchmark"]
    },
    "me-curious": {
      q: "What are you unusually curious about right now?",
      short: "Where retrieval and computation split inside language models — and how to measure that without kidding ourselves.",
      deep: "Same Score, Different Strategy is phase one of a longer program. I want better instruments than behaviour alone: where in the network the split lives, what training produces it, and how it scales.\n\nI'm also still chewing on grounding-aware confidence after the OCR work — meters that look good in-sample and fall apart when the page changes.",
      next: ["rvc-next", "rs-now", "hd-compute"]
    },
    "me-better": {
      q: "What are you trying to get better at?",
      short: "Landing a thin vertical slice first, then deepening the probes — instead of over-investing in the evaluation story before anything runs end to end.",
      deep: "I can get precious about measurement. That's a strength until it delays learning from a rough prototype. Production work at Nurix helped: you ship, you watch failure modes, you iterate.\n\nI'm also trying to get sharper at explaining tradeoffs in one page, not ten.",
      next: ["bh-improve", "hd-weak", "nu-learn"]
    },
    "me-team": {
      q: "What kind of team do you want to work with?",
      short: "People who want the failure case early, write things down so results are checkable, and treat demos as evidence — not theatre.",
      deep: "I like clear write-ups and small demos. I ask for the failure case early. I'm comfortable moving between research and engineering as long as nobody pretends those are different moral categories.\n\nIdeal teammates argue about whether the meter means what we think it means — then go fix the experiment together.",
      next: ["me-looking", "bh-decision", "hd-hire"]
    },
    "me-unconstrained": {
      q: "What would you want to work on if there were no constraints?",
      short: "A serious measurement stack for how models solve problems — not another leaderboard number — plus the systems to run it at scale.",
      deep: "I'd push the retrieval-vs-computation program into mechanism: where the split lives, what training induces it, and whether you can intervene. In parallel I'd keep shipping production-shaped systems that stress those instruments in the wild.\n\nAnd I'd leave room for weird side questions. The blank-page OCR confidence result came from refusing to trust a meter that looked fine.",
      next: ["hd-unlimited", "hd-compute", "rvc-next"]
    },

    /* ---------- RvC ---------- */
    "rvc-what": {
      q: "What is Retrieval vs Computation?",
      short: "A measurement toolkit for asking whether an LLM that got the answer right actually computed it — or recalled something that looked like solving.",
      deep: "Benchmarks tell you if the answer is correct. They don't tell you how the model got there. Two models with the same score can fail in very different ways once you change names, inject a wrong intermediate, or move off the training distribution.\n\nI built three probes — entity rename, plan-versus-execution consistency, and closeness to training data — across 219 problems and five models, with exact checkers and a pipeline you can regenerate from code.",
      next: ["rvc-why", "rvc-find", "rvc-bench"]
    },
    "rvc-why": {
      q: "Why did you start this research?",
      short: "I got interested in the gap between getting an answer right and actually solving the problem.",
      deep: "In interviews and papers people talk about \"reasoning\" as if accuracy implied a strategy. I wanted instruments that can show two models with matched scores behaving differently under small, controlled changes that leave the problem identical.\n\nIf a rename collapses a perfect score to zero, the capability story we told ourselves was incomplete.",
      next: ["rvc-hyp", "rvc-surprise", "me-excite"]
    },
    "rvc-hyp": {
      q: "What was the original hypothesis?",
      short: "That matched benchmark accuracy can hide different strategies — and that behavioural probes can surface that split.",
      deep: "The working idea: if a model is mostly retrieving a familiar template, small surface changes that preserve structure should hurt it differently than if it's computing. If it's computing from its own steps, injecting a wrong intermediate should derail it more cleanly.\n\nWe also expected many instances to stay ambiguous under strict thresholds — and they did (~61.6%). The probes are calibration points, not a final verdict.",
      next: ["rvc-find", "rvc-falsify", "rs-convincing"]
    },
    "rvc-find": {
      q: "What did you actually discover?",
      short: "Matched accuracy hid large differences. The starkest case: o3-mini went from 1.00 to 0.00 on weighted interval scheduling after a rename.",
      deep: "The same rename helped some models, left others at the floor, and even reversed direction across subtypes. On arithmetic, Gemini held up when numbers were regenerated but fell hard when only names changed.\n\nInjecting a wrong state mid-solve: models accepted it 88–100% of the time, yet accuracy after injection often stayed close to uninterrupted performance — so compliance is not the same as derailment.",
      next: ["rvc-surprise", "rvc-fragility", "rvc-diff"]
    },
    "rvc-surprise": {
      q: "What surprised you?",
      short: "How differently the same surface change moved different models — and that accepting an injected error didn't cleanly predict a wrong final answer.",
      deep: "I expected more uniformity if \"retrieval\" were one shared mechanism. The spread suggests model-specific strategies under similar scores.\n\nAlso: my harness caught my own verifier bugs via gold-in/gold-out checks before any result shipped. That surprised me in a good way — the instrument was fragile enough that auditing it had to be part of the experiment.",
      next: ["rvc-find", "bh-wrong", "rs-confound"]
    },
    "rvc-bench": {
      q: "Why isn't benchmark accuracy enough?",
      short: "Because two models can share a score and fail for completely different reasons once the world shifts a little.",
      deep: "Deployment cares about strategy, not just the number. If a model memorised a template, a rename that shouldn't matter can erase the capability. If confidence or a score is used for routing, you need to know what the meter is measuring.\n\nAccuracy is necessary. It is not a process claim.",
      next: ["rvc-what", "rs-benchmark", "ocr-trust"]
    },
    "rvc-bench-build": {
      q: "How did you construct the benchmark?",
      short: "219 problems across arithmetic, planning and optimisation, five models, exact checkers, ~20k API calls, fully regenerable pipeline.",
      deep: "Every answer has an exact checker. Raw runs, derived metrics, paper tables and tests regenerate from code. Probes include rewording/renaming, plan-versus-execution consistency, and closeness to training data.\n\nThe point wasn't a bigger leaderboard — it was controlled interventions you can re-run.",
      next: ["rvc-219", "rvc-probes", "rvc-confound"]
    },
    "rvc-219": {
      q: "Why 219 problems?",
      short: "Enough breadth across problem types to see strategy differences, small enough to keep checkers exact and runs auditable.",
      deep: "I cared more about exact verification and clean interventions than about dumping tens of thousands of noisy items. Breadth across arithmetic, planning and optimisation mattered so a single subtype couldn't define the story.",
      next: ["rvc-bench-build", "rvc-probes"]
    },
    "rvc-probes": {
      q: "How did you separate retrieval from computation?",
      short: "I didn't claim a perfect separator — I used multiple behavioural probes and treated labels as calibration under strict thresholds.",
      deep: "Rename/reword stress surface familiarity. Plan-versus-execution checks consistency of intermediate structure. Closeness to training data looks at exposure.\n\nUnder strict thresholds, most instances stayed ambiguous. That's honest: behaviour alone rarely gives a clean per-instance verdict. The probes still show where matched accuracy is lying to you.",
      next: ["rvc-confound", "rvc-falsify", "rvc-artifact"]
    },
    "rvc-confound": {
      q: "What are the major confounders?",
      short: "Distribution shift that isn't pure strategy change, verifier bugs, and the fact that exposure and difficulty often move together.",
      deep: "On some subtypes, rename difficulty and exposure are entangled — so a collapse alone can't say which factor dominated. Injected-error compliance can look like derailment when it isn't.\n\nThat's why gold-in/gold-out verifier checks and pre-registered comparisons matter. The paper is as much about instrument hygiene as about model behaviour.",
      next: ["rvc-probes", "rs-confound", "rvc-artifact"]
    },
    "rvc-fragility": {
      q: "What does “structural fragility” actually mean?",
      short: "Capability that looks solid on the original surface but breaks under small structural-preserving changes.",
      deep: "It's not \"the model is bad at hard problems.\" It's \"the competence we measured was tied to surface features we didn't think were load-bearing.\" A perfect score that dies under rename is fragile structure, not missing arithmetic talent.",
      next: ["rvc-find", "rvc-bench"]
    },
    "rvc-falsify": {
      q: "What would falsify your hypothesis?",
      short: "If controlled surface changes that preserve the problem never differentially move models with matched accuracy — or if probes always collapse into one trivial factor like length.",
      deep: "Also: if after cleaning confounders, rename effects lined up perfectly with a single known difficulty measure and nothing else. Or if injected-error behaviour cleanly predicted final accuracy in a way that made the \"compliance ≠ derailment\" claim unnecessary.\n\nI'm happier when a result can die cleanly.",
      next: ["rvc-hyp", "rs-convincing", "hd-challenge"]
    },
    "rvc-next": {
      q: "What would the next paper be?",
      short: "Where the split lives in the network, what training produces it, and how it scales — mechanism, not only behaviour.",
      deep: "Phase one was behavioural measurement. The planned papers push toward internals and training dynamics: can we localise retrieval-like vs compute-like processing, and can we intervene?\n\nWith 10× compute I'd also enlarge the problem families while keeping exact checkers — breadth without giving up auditability.",
      next: ["hd-compute", "me-curious", "rvc-restart"]
    },
    "rvc-just-bench": {
      q: "Isn't this just another benchmark?",
      short: "No — the point is interventions and checkers, not a new leaderboard to climb.",
      deep: "A benchmark asks \"how often right?\" This asks \"does the rightness survive changes that shouldn't matter, and do two models fail the same way?\" If you strip the probes and only keep accuracy, you've thrown away the paper.\n\nChallenge accepted: if someone only cites the headline scores and ignores the interventions, they're misreading it — and I'd say so.",
      next: ["rvc-diff", "rvc-bench", "hd-challenge"]
    },
    "rvc-diff": {
      q: "How is this different from existing reasoning evaluations?",
      short: "Most reasoning evals still optimise for a score. I optimise for differential behaviour under controlled, regenerable probes.",
      deep: "Exact checkers, gold-in/gold-out harness tests, and explicit confounder discussion are part of the method. I'm less interested in crowning a winner than in showing that winners can be differently fragile.",
      next: ["rvc-just-bench", "rvc-probes"]
    },
    "rvc-artifact": {
      q: "Could your probes themselves introduce artifacts?",
      short: "Yes — and that risk is why verifier audits and multiple probe families matter.",
      deep: "A rename could accidentally change difficulty. An injection format could bias compliance. I try to keep interventions minimal and problem-preserving, then check whether effects are probe-specific or convergent.\n\nIf a result only appears under one quirky probe wording, I don't trust it.",
      next: ["rvc-confound", "rs-confound", "rvc-falsify"]
    },
    "rvc-process": {
      q: "Why should anyone care about process if the final answer is correct?",
      short: "Because production shifts the surface. Process is what survives the shift.",
      deep: "Correct-once is cheap. Correct-under-rename, correct-under-injection, correct-off-distribution is what you actually buy when you deploy. If you only score finals, you will ship fragile strategies and not notice until users change the names.",
      next: ["rvc-bench", "ocr-trust", "hd-overhyped"]
    },
    "rvc-restart": {
      q: "What would you change if you started again?",
      short: "I'd register more subtype-level exposure metrics earlier, and I'd ship a thinner public demo of one probe before expanding the suite.",
      deep: "The evaluation story was strong; the first vertical slice could have been more public sooner. I'd also invest earlier in visualising per-model strategy spreads — the surprise is easier to feel when you can see it.",
      next: ["me-better", "rvc-next", "bh-failure"]
    },

    /* ---------- FraudScope ---------- */
    "fr-what": {
      q: "What is FraudScope360?",
      short: "A five-module fraud engine combining graph ML, anomaly detection and XGBoost — national winner of the Citi Campus Innovation Challenge.",
      deep: "Fraud rarely looks suspicious one account at a time. It shows up in connections between accounts, identities and behaviour. The system covers fraud rings and identity fraud and serves decisions through FastAPI.",
      next: ["fr-why", "fr-multi", "fr-built"]
    },
    "fr-why": {
      q: "What problem were you solving?",
      short: "Single-row classifiers miss ring structure and identity links that fraud teams actually hunt.",
      deep: "We wanted several weak signals — graph structure, anomalies, engineered features — combined into one decision closer to how investigators think than a lone score.",
      next: ["fr-multi", "fr-graph"]
    },
    "fr-multi": {
      q: "Why multimodal / multi-module?",
      short: "Because each detector is weak alone; the interesting cases live in the combination.",
      deep: "Graph embeddings catch rings. Anomaly detectors catch weird behaviour. Boosted trees use engineered features. Wiring them together mattered more than any single model being fancy.",
      next: ["fr-arch", "fr-hard"]
    },
    "fr-hard": {
      q: "What was difficult?",
      short: "Making heterogeneous signals agree enough to be useful without collapsing into one noisy vote.",
      deep: "Also: designing modules that could be reasoned about separately — so a failure mode in the graph path didn't silently poison everything. Hackathon time pressure made prioritisation brutal.",
      next: ["fr-built", "bh-decision"]
    },
    "fr-built": {
      q: "What did you personally build?",
      short: "Core of the multi-module engine and the FastAPI serving path that tied graph, anomaly and XGBoost pieces together.",
      deep: "I cared about a decision surface teams could actually call — not a notebook. The win was national-level recognition that the architecture matched how fraud work feels in practice.",
      next: ["fr-arch", "fr-change"]
    },
    "fr-arch": {
      q: "How did the system work end to end?",
      short: "Ingest → feature and graph views → module scores → combined decision via FastAPI.",
      deep: "Each module produced a signal; the combiner turned them into something actionable. Identity fraud and ring detection were first-class paths, not afterthoughts.",
      next: ["fr-graph", "fr-real"]
    },
    "fr-graph": {
      q: "Why graph ML?",
      short: "Fraud rings are literally graphs. Flattening them into independent rows throws away the crime.",
      deep: "Embeddings over account/identity relations surface structure a tabular model never sees. That was the conceptual bet behind the project.",
      next: ["fr-multi", "fr-overfit"]
    },
    "fr-change": {
      q: "What would you change now?",
      short: "Stronger online evaluation and clearer calibration of the combined score under shifting fraud tactics.",
      deep: "Hackathon systems prove the idea. Production fraud needs continuous adversary adaptation and better story for false positives. I'd invest there first.",
      next: ["fr-real", "me-better"]
    },
    "fr-real": {
      q: "Would this survive real bank traffic?",
      short: "As a prototype architecture, yes as a starting point — not as a drop-in replacement for a bank's full stack.",
      deep: "Real deployment needs latency budgets, case-management UX, feedback loops from investigators, and constant drift monitoring. FraudScope360 is the shape of the solution, not the finished ops system.",
      next: ["fr-change", "nu-prod"]
    },
    "fr-overfit": {
      q: "How do you know you didn't overfit the challenge data?",
      short: "By separating module signals and caring about structure that should generalise — but challenge wins are still challenge wins.",
      deep: "I'd want held-out time periods and adversarial red-teaming before claiming production robustness. I'm not going to pretend a competition dataset is the world.",
      next: ["rs-convincing", "hd-challenge"]
    },

    /* ---------- OmniMesh ---------- */
    "om-what": {
      q: "What is OmniMesh?",
      short: "An offline-first disaster-response mesh: phones as triage nodes, plus a multi-agent AI backend.",
      deep: "When internet and cell networks fail, responders still need to coordinate. Android nodes form a peer-to-peer mesh; a six-agent FastAPI service serves Gemma-2-9B with vLLM on an AMD GPU and syncs when connectivity returns.",
      next: ["om-why", "om-offline", "om-arch"]
    },
    "om-why": {
      q: "Why this problem?",
      short: "Infrastructure fails first in disasters — exactly when coordination matters most.",
      deep: "I wanted edge-capable triage that doesn't assume the cloud is there, while still using stronger models when a local/relay GPU is available. Built for AMD Developer Hackathon ACT II and entered in Google Solution Challenge 2025.",
      next: ["om-offline", "om-hard"]
    },
    "om-offline": {
      q: "Why offline-first?",
      short: "Because \"we'll sync later\" is the only honest architecture when the tower is down.",
      deep: "Online-first apps silently become bricks. Offline-first means local triage and mesh routing are the default; cloud is an optimisation when it reappears.",
      next: ["om-arch", "om-latency"]
    },
    "om-hard": {
      q: "What were the engineering challenges?",
      short: "Mesh reliability on phones, agent orchestration, and serving an LLM under edge constraints.",
      deep: "Getting vLLM + Gemma useful on AMD hardware, keeping six agents coherent, and designing sync that doesn't corrupt state after partitions — those were the sharp edges.",
      next: ["om-agents", "om-next"]
    },
    "om-arch": {
      q: "How does the architecture work?",
      short: "Phone mesh for local triage ↔ FastAPI multi-agent backend ↔ optional cloud sync.",
      deep: "Devices act as nodes. The backend coordinates specialised agents around the LLM. When the network returns, state reconciles upward instead of assuming constant connectivity.",
      next: ["om-agents", "om-realworld"]
    },
    "om-agents": {
      q: "Why six agents?",
      short: "Disaster triage isn't one prompt — different roles need different tools and context.",
      deep: "Splitting responsibilities keeps prompts tighter and failures more local. It's the same instinct as modular fraud detectors: don't make one blob do everything.",
      next: ["om-arch", "om-hard"]
    },
    "om-next": {
      q: "What would you build next?",
      short: "Better partition tolerance tests, lighter on-device models for triage, and field drills with real responders.",
      deep: "Hackathon demos convince engineers. Field reality needs radio-like failure testing and UX that works with gloves and stress.",
      next: ["om-realworld", "me-better"]
    },
    "om-realworld": {
      q: "Has this been used in a real disaster?",
      short: "Not as a deployed emergency system — it's a serious prototype aimed at that setting.",
      deep: "I'm careful not to overclaim. The architecture is shaped by real constraints; operational validation with agencies would be the next honest milestone.",
      next: ["om-next", "hd-challenge"]
    },
    "om-latency": {
      q: "Isn't LLM triage too slow offline?",
      short: "That's why the mesh and local triage matter — the big model is a backend capability, not the only path.",
      deep: "Critical path should degrade: local heuristics and human protocol first, LLM assistance when the relay can serve it. Latency is a product constraint, not an afterthought.",
      next: ["om-offline", "om-arch"]
    },

    /* ---------- DDPM ---------- */
    "dd-what": {
      q: "What is the DDPM volatility + RL hedging project?",
      short: "A diffusion model that generates NIFTY 50 volatility surfaces, then a PPO agent that hedges barrier options on those scenarios.",
      deep: "History doesn't give enough market scenarios to train a hedging agent, and an agent trained on one market model inherits that model's blind spots. I built 1,268 surfaces from 912K+ NSE option rows, trained a conditional diffusion generator, and compared hedging against Black-Scholes and a Heston-trained RL baseline.",
      next: ["dd-why-diff", "dd-result", "dd-contrib"]
    },
    "dd-why-diff": {
      q: "Why diffusion models?",
      short: "To generate new, diverse surfaces with fewer arbitrage violations than naïvely resampling history.",
      deep: "The generator's arbitrage penalty landed around 0.005 vs about 0.009 on market data. That matters if you're going to train an agent on synthetic worlds — garbage worlds teach garbage hedges.",
      next: ["dd-data", "dd-model-risk"]
    },
    "dd-why-rl": {
      q: "Why RL for hedging?",
      short: "Barrier options and path-dependent risk don't fit neatly into a single closed-form hedge you can trust out of sample.",
      deep: "RL lets the agent learn a policy over simulated trajectories. The research angle is separating how much performance comes from the generator versus the agent — model risk, not just a leaderboard hedge error.",
      next: ["dd-result", "dd-learn"]
    },
    "dd-result": {
      q: "What were the results?",
      short: "About 60.1% lower CVaR(95%) hedging error versus Black-Scholes, with comparisons to a Heston-trained RL baseline.",
      deep: "I care as much about the decomposition — generator vs agent — as the headline reduction. Otherwise you can't tell what you actually improved.",
      next: ["dd-contrib", "dd-model-risk"]
    },
    "dd-data": {
      q: "What did the dataset look like?",
      short: "1,268 NIFTY implied-vol surfaces (2018–2026) built from 912K+ NSE option rows.",
      deep: "Cleaning and surface construction were a big part of the work. Generative modelling on finance data fails quietly if the surfaces are incoherent going in.",
      next: ["dd-why-diff", "dd-contrib"]
    },
    "dd-contrib": {
      q: "What did you actually contribute?",
      short: "End-to-end: surface dataset, conditional diffusion generator, PPO hedging agent, and evaluation framed as model-risk decomposition.",
      deep: "It's a research draft with code — meant to make the claim inspectable, not just a chart in a slide.",
      next: ["dd-learn", "dd-result"]
    },
    "dd-learn": {
      q: "What did you learn?",
      short: "That synthetic data for control problems is a modelling claim — and you have to measure the generator's sins separately from the agent's.",
      deep: "Also: quant research rewards boring hygiene. Surface construction and arbitrage checks decided more outcomes than fancy architecture tweaks.",
      next: ["dd-model-risk", "rs-convincing"]
    },
    "dd-model-risk": {
      q: "Isn't the agent just overfitting your generator?",
      short: "That's the central risk — which is why I compare generators and baselines instead of reporting one number.",
      deep: "If performance vanishes under a Heston world or under market surfaces, you learned a simulator exploit. The paper's point is to keep that failure mode visible.",
      next: ["dd-why-rl", "hd-challenge"]
    },
    "dd-market": {
      q: "Would you trade this live?",
      short: "Not from this draft alone — it's a research system for studying hedging under generated scenarios.",
      deep: "Live trading needs market microstructure, execution, risk limits and governance this project doesn't claim. I'm explicit about that boundary.",
      next: ["dd-model-risk", "hd-weak"]
    },

    /* ---------- OCR ---------- */
    "ocr-what": {
      q: "What is Reading Without Looking?",
      short: "A controlled study asking whether OCR confidence on Indic scripts actually tracks what the model sees.",
      deep: "Document systems auto-accept high-confidence pages. That only works if confidence means evidence. I trained a 19.6M OCR model from scratch so I could run counterfactuals an API won't allow.",
      next: ["ocr-why", "ocr-find", "ocr-probes"]
    },
    "ocr-why": {
      q: "Why this question?",
      short: "Because routing on peak confidence is common — and dangerous if the meter is about output peakedness, not vision.",
      deep: "Indic scripts make evaluation harder and more honest. If confidence fails here, you shouldn't casually trust it in production routing.",
      next: ["ocr-find", "rvc-bench"]
    },
    "ocr-find": {
      q: "What did you find?",
      short: "Confidence stayed ~0.9 while the correct first character had ~1e-11 probability; blank pages scored almost like text.",
      deep: "Blank/noise/scrambled images barely moved confidence. Killing the vision pathway changed ~8% of predictions while confidence stayed flat. In-sample AUROC ~0.84 fell to ~0.57 held out.",
      next: ["ocr-probes", "ocr-auroc", "ocr-trust"]
    },
    "ocr-probes": {
      q: "What probes did you run?",
      short: "Blank, noise, scrambled images; removing the vision pathway; plus a transfer test on a production OCR API.",
      deep: "Training from scratch was the enabling move. Counterfactuals need levers. Grapheme-level scoring and HarfBuzz rendering kept Indic evaluation honest.",
      next: ["ocr-find", "me-scratch"]
    },
    "ocr-auroc": {
      q: "Isn't AUROC 0.84 good?",
      short: "In-sample, sure. Held-out it fell to ~0.57 with terrible calibration — so the meter looked trustworthy until it mattered.",
      deep: "That's the whole cautionary tale: good-looking metrics on familiar lines can be close to useless for routing new pages.",
      next: ["ocr-trust", "rs-benchmark"]
    },
    "ocr-prod": {
      q: "Does this attack production OCR unfairly?",
      short: "I also ran a transfer-style check on a production API — the research model exists so probes are possible.",
      deep: "The claim isn't \"all OCR is useless.\" It's \"don't route on peak confidence without grounding checks.\" Production systems should hear that as a design constraint.",
      next: ["ocr-trust", "rvc-process"]
    },
    "ocr-trust": {
      q: "So when should we trust confidence?",
      short: "When it demonstrably tracks evidence under counterfactuals and held-out shifts — not when it merely looks peaked.",
      deep: "I argue for grounding-aware confidence. If blanking the image doesn't move the meter, the meter isn't about the image.",
      next: ["ocr-find", "rvc-bench", "hd-overhyped"]
    },

    /* ---------- Nurix ---------- */
    "nu-what": {
      q: "What did you do at Nurix?",
      short: "ML engineering on production speech/NLP: voicemail detection, turn-end detection, and a WER-cutting correction pipeline.",
      deep: "Jul–Dec 2025. TinyBERT + NN voicemail detector at 95% precision with backend integration; semantic parsing for turn-end in a transformer STT stack; Word2Vec + phonetic normalisation + LLM scoring that cut WER ~40%.",
      next: ["nu-ship", "nu-wer", "nu-learn"]
    },
    "nu-ship": {
      q: "What does “shipped” mean here?",
      short: "Integrated into the real backend path — not a slide-deck model.",
      deep: "Precision targets, pipeline latency, and living with other engineers' constraints. That's a different muscle from research probes, and I wanted both.",
      next: ["nu-prod", "nu-vs-research"]
    },
    "nu-learn": {
      q: "What did you learn that projects didn't teach you?",
      short: "That production failure modes show up in integration seams — and that a thin working slice beats a perfect offline metric.",
      deep: "Also: communication bandwidth. Clear write-ups and demos matter when the model is one piece of a speech stack.",
      next: ["me-better", "bh-decision", "nu-vs-research"]
    },
    "nu-wer": {
      q: "How did you cut WER by ~40%?",
      short: "A correction pipeline combining Word2Vec cues, phonetic normalisation and LLM scoring on top of the STT output.",
      deep: "It wasn't one magic model. It was layered correction that targeted the error modes we actually saw in the pipeline.",
      next: ["nu-what", "nu-prod"]
    },
    "nu-prod": {
      q: "What is different about production ML?",
      short: "Constraints are real: latency, precision targets, other people's APIs, and on-call style failure modes.",
      deep: "Research lets you design the probe. Production tells you which probe you forgot. I like that pressure when the team still cares about whether the metric means something.",
      next: ["nu-learn", "fr-real"]
    },
    "nu-vs-research": {
      q: "Do you prefer research or engineering?",
      short: "I want both — seriously. Research without shipping gets dreamy; shipping without questioning the meter gets brittle.",
      deep: "Nurix scratched the shipping itch. RvC and OCR scratch the measurement itch. The career I'm aiming at sits on the seam.",
      next: ["me-looking", "me-aiml", "hd-hire"]
    },

    /* ---------- Research layer ---------- */
    "rs-questions": {
      q: "How do you come up with research questions?",
      short: "I notice a meter people trust, then ask what would have to be true for that trust to be deserved.",
      deep: "Accuracy as reasoning. Confidence as evidence. Synthetic markets as training truth. If a claim is doing a lot of work in a system, I want a probe that can kill it.\n\nQuestions usually start as irritations, not as literature gaps.",
      next: ["rs-convincing", "me-excite", "rvc-why"]
    },
    "rs-convincing": {
      q: "How do you know an experiment is convincing?",
      short: "If a sceptical peer can regenerate it, name the confounders, and still see the effect under the interventions that should matter.",
      deep: "Gold-in/gold-out checks, held-out splits, pre-registered comparisons when I can. A pretty chart without a killing intervention is not convincing to me.",
      next: ["rs-confound", "rvc-falsify", "ocr-auroc"]
    },
    "rs-confound": {
      q: "How do you handle confounders?",
      short: "Name them early, design interventions that isolate them when possible, and refuse a clean story when isolation fails.",
      deep: "In RvC, exposure and difficulty can move together — so I say so. Ambiguous instances stay ambiguous. Pretending otherwise is how papers become fiction.",
      next: ["rvc-confound", "rs-convincing"]
    },
    "rs-benchmark": {
      q: "What makes a benchmark good?",
      short: "Exact checkers, clear interventions, and honesty about what the score does not mean.",
      deep: "Bigger isn't better if you can't verify answers or interpret failures. I'd rather have 219 problems with exact checkers than a giant set that only supports vibes.",
      next: ["rvc-bench", "ocr-trust", "hd-overhyped"]
    },
    "rs-changed": {
      q: "Tell me about a hypothesis that changed.",
      short: "I expected injected-error compliance to track derailment more cleanly than it did.",
      deep: "Models often accepted wrong intermediates yet finished near uninterrupted accuracy. That pushed me to treat compliance and derailment as separate measurements — a sharper claim than the one I started with.",
      next: ["rvc-surprise", "bh-wrong"]
    },
    "rs-now": {
      q: "What are you researching now?",
      short: "Extending the retrieval-vs-computation program toward mechanism, plus finishing the volatility/hedging draft story.",
      deep: "Behavioural probes were phase one. Next is where the split lives and what training induces it. OCR confidence left me with unfinished business on grounding-aware meters too.",
      next: ["rvc-next", "me-curious", "dd-what"]
    },

    /* ---------- Behavioural ---------- */
    "bh-failure": {
      q: "Tell me about a failure.",
      short: "I've over-built evaluation harnesses before a thin demo existed — which delayed learning from real users of the idea.",
      deep: "It's the shadow side of caring about measurement. The fix I'm practicing: vertical slice first, deepen probes second. Nurix reinforced that. Some research restarts still tempt me the other way.",
      next: ["me-better", "rvc-restart", "bh-improve"]
    },
    "bh-decision": {
      q: "Tell me about a difficult technical decision.",
      short: "Training OCR from scratch instead of only probing a closed API — slower upfront, necessary for counterfactuals.",
      deep: "We could have written a weaker paper faster with black-box scores. We wouldn't have been able to blank vision or scramble inputs meaningfully. The decision traded timeline for levers.",
      next: ["ocr-probes", "me-scratch"]
    },
    "bh-scratch": {
      q: "Tell me about something you built from scratch.",
      short: "The 19.6M Indic OCR model and harness for Reading Without Looking — and the RvC probe pipeline with exact checkers.",
      deep: "Scratch isn't a personality brand. It's how I get instruments. Same spirit shows up in systems prototypes when I need to own the failure surface.",
      next: ["me-scratch", "ocr-what", "rvc-bench-build"]
    },
    "bh-wrong": {
      q: "Tell me about a time you were wrong.",
      short: "I thought acceptance of an injected mid-solve error would derail final answers more reliably than it did.",
      deep: "The data disagreed. Being wrong there improved the paper: we separated compliance from derailment instead of smuggling them together.",
      next: ["rs-changed", "rvc-surprise"]
    },
    "bh-learn": {
      q: "How do you learn something completely new?",
      short: "Build a tiny version, break it, read until the break makes sense, then rebuild.",
      deep: "I use papers and lectures, but they stick when attached to a failing artifact. The study module on my shelf is that process written down.",
      next: ["me-scratch", "bh-improve"]
    },
    "bh-ambiguity": {
      q: "How do you deal with ambiguity?",
      short: "I try to turn it into a measurable disagreement — what would we see if A were true vs B?",
      deep: "If we can't name that, I keep the claim soft. Ambiguous instances in RvC stayed labelled ambiguous on purpose.",
      next: ["rs-confound", "rvc-probes"]
    },
    "bh-bad": {
      q: "What are you bad at?",
      short: "Stopping early when the measurement story is seductive — and sometimes writing too long before I write too clear.",
      deep: "I'm actively compressing explanations and forcing earlier demos. Those are skill gaps I'm not romantic about.",
      next: ["hd-weak", "me-better", "bh-improve"]
    },
    "bh-improve": {
      q: "What are you trying to improve?",
      short: "Faster thin slices, clearer one-page explanations, and more comfort showing unfinished work early.",
      deep: "Same theme as getting better generally — shipping the probeable prototype before the perfect narrative.",
      next: ["me-better", "bh-failure"]
    },

    /* ---------- Hard questions ---------- */
    "hd-weak": {
      q: "What is the weakest part of your resume?",
      short: "Some project rows look broader than the depth I can defend in twenty minutes — breadth from hacking and coursework.",
      deep: "I'd rather you open Ask and pressure-test RvC, OCR, FraudScope, OmniMesh, DDPM or Nurix than treat every repo as equal. The strongest work can take a challenge. The thinner rows shouldn't pretend otherwise.",
      next: ["hd-challenge", "fr-real", "om-realworld"]
    },
    "hd-overhyped": {
      q: "What's overhyped in AI?",
      short: "Treating benchmark crowns and peak confidence as if they were process understanding.",
      deep: "Leaderboards are useful. They are not a theory of mind for the model. Confidence is useful. It is not automatically evidence. A lot of product risk comes from that category error.",
      next: ["rvc-process", "ocr-trust", "hd-underrated"]
    },
    "hd-underrated": {
      q: "What's underrated in AI?",
      short: "Boring instruments: exact checkers, counterfactuals, harness tests, and writing down what would falsify you.",
      deep: "Also: engineers who can move between research doubt and production constraints without cosplaying only one of them.",
      next: ["rs-convincing", "nu-vs-research"]
    },
    "hd-challenge": {
      q: "What would you challenge about your own research?",
      short: "Behavioural probes still leave many instances ambiguous — behaviour alone won't finish the retrieval/computation story.",
      deep: "That's why mechanism work is next. I'd also challenge anyone (including me) who over-reads a single rename collapse without the confounder discussion.",
      next: ["rvc-falsify", "rvc-next", "rvc-artifact"]
    },
    "hd-compute": {
      q: "What would you do with 10× compute?",
      short: "Widen problem families with exact checkers, push mechanistic follow-ups on RvC, and run fuller generator/agent sweeps on the hedging stack.",
      deep: "I wouldn't spend it on a vanity leaderboard climb. I'd spend it on interventions and ablations that are currently budget-bound.",
      next: ["rvc-next", "me-unconstrained"]
    },
    "hd-unlimited": {
      q: "What would you build with unlimited resources?",
      short: "A public, regenerable laboratory for strategy measurement in LLMs — probes, checkers, and mechanism tools teams can actually run.",
      deep: "Plus field-grade offline triage that has survived real drills, not only hackathon stages. Ambition is fine; unverifiable ambition isn't.",
      next: ["me-unconstrained", "om-next"]
    },
    "hd-hire": {
      q: "Why should someone hire you?",
      short: "Because I ship and I distrust meters — a CAISc paper, production speech wins at Nurix, systems that won national recognition — and I can explain the failure case.",
      deep: "I design probes and ablations, not only dashboards. I'm comfortable being interviewed hard on assumptions. If you want someone who only polishes accuracy curves, I'm a bad fit. If you want someone who asks whether the curve means anything, I'm a good one.",
      next: ["me-looking", "me-team", "nu-vs-research"]
    }
  }
};
