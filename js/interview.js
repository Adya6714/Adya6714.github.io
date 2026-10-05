/* Interview room question bank (Part D8). Edit answers here; run npm run kb after changes. */
window.CONTENT.interview = {
  "intro": "Hi, I'm the guardian of this river. Interview Adya through me. Ask about her research, internships, projects, skills, or what she's looking for next. I answer only from her own notes and papers.",
  "tracks": [
    {
      "id": "start",
      "name": "Start here",
      "questions": [
        {
          "id": "me",
          "q": "Tell me about yourself.",
          "short": "I'm Adya, an engineer who genuinely enjoys building things from scratch and figuring out how they work along the way. I'm especially interested in AI and ML, but what keeps me excited is the engineering and research around them: taking a vague question, digging into it, experimenting, breaking things, and eventually turning an idea into something that actually works.",
          "long": "I usually end up learning what I need, building a first version, breaking it, and then going deeper into why it behaves the way it does.\n\nOver time that pulled me toward AI and ML — there's this interesting combination of engineering and research. I like building systems, but I also really enjoy asking whether the thing I built is actually doing what I think it is doing.\n\nThat's probably why my work ranges from multimodal systems and AI applications to research around reasoning and evaluation. I'm currently looking for opportunities where I can do both sides seriously: hard engineering problems while continuing to develop as a researcher.",
          "next": ["looking", "why-ml"]
        },
        {
          "id": "looking",
          "q": "What are you currently looking for?",
          "short": "Roles where I can work closely on hard AI/ML problems — research and research engineering — and keep talking to people who are building and experimenting.",
          "long": "I want a place where evaluation is taken seriously, where shipping and questioning the meter aren't treated as opposite jobs. Ideal day: write code, run a probe, argue about what the result means, then ship the next thin slice.\n\nI'm also here for conversations. If you're working on something interesting, have a different way of looking at AI/ML, or think there's something I should know — I'd genuinely love to hear from you.",
          "next": ["why-ml", "team"]
        },
        {
          "id": "why-ml",
          "q": "Why AI/ML?",
          "short": "Because it sits at an exciting intersection of building systems and chasing questions that don't have obvious answers.",
          "long": "Engineering gives me the satisfaction of making something real. Research gives me permission to doubt whether the thing I made is doing what I think. AI/ML is where those two habits collide every week — you can ship a model and still be wrong about why it works.\n\nThat tension is what keeps me interested, not the hype cycle.",
          "next": ["why-research", "scratch"]
        },
        {
          "id": "why-research",
          "q": "Why do you like research?",
          "short": "Research is how I chase questions that don't have a clean answer yet — and then force myself to make the answer checkable.",
          "long": "I don't think of research as only papers. It's the habit of asking: what would convince me I'm wrong? What confound am I pretending isn't there? Can someone else regenerate this from the code?\n\nThat's also why my papers lean on probes and ablations. I want the claim to survive a change that should not matter.",
          "next": ["scratch", "curious"]
        },
        {
          "id": "scratch",
          "q": "Why do you like building things from scratch?",
          "short": "Starting from a blank page forces me to understand the pieces — not just call an API and hope.",
          "long": "When I trained a small OCR model from scratch for Reading Without Looking, it wasn't because scratch is romantic. It was so I could blank the image, scramble it, and turn the vision pathway off. You can't run those counterfactuals on a closed API.\n\nSame instinct shows up in systems work: if I built the pipeline, I know where it breaks.",
          "next": ["curious", "ocr-why-scratch"]
        },
        {
          "id": "curious",
          "q": "What are you unusually curious about right now?",
          "short": "Where retrieval and computation split inside language models — and how to measure that without kidding ourselves.",
          "long": "Same Score, Different Strategy is phase one of a longer program. I want better instruments than behaviour alone: where in the network the split lives, what training produces it, and how it scales.\n\nI'm also still chewing on grounding-aware confidence after the OCR work — meters that look good in-sample and fall apart when the page changes.",
          "next": ["rvc-what", "now"]
        },
        {
          "id": "team",
          "q": "What kind of team do you want to work with?",
          "short": "People who want the failure case early, write things down so results are checkable, and treat demos as evidence — not theatre.",
          "long": "I like clear write-ups and small demos. I ask for the failure case early. I'm comfortable moving between research and engineering as long as nobody pretends those are different moral categories.\n\nIdeal teammates argue about whether the meter means what we think it means — then go fix the experiment together.",
          "next": ["looking", "hire"]
        },
        {
          "id": "noconstraints",
          "q": "What would you want to work on if there were no constraints?",
          "short": "A serious measurement stack for how models solve problems — not another leaderboard number — plus the systems to run it at scale.",
          "long": "I'd push the retrieval-vs-computation program into mechanism: where the split lives, what training induces it, and whether you can intervene. In parallel I'd keep shipping production-shaped systems that stress those instruments in the wild.\n\nAnd I'd leave room for weird side questions. The blank-page OCR confidence result came from refusing to trust a meter that looked fine.",
          "next": ["curious", "compute"]
        }
      ]
    },
    {
      "id": "projects",
      "name": "Projects",
      "questions": [
        {
          "id": "rvc-what",
          "q": "What is Retrieval vs Computation?",
          "short": "A way to tell whether an AI model actually worked a problem out or recalled something similar it had seen. Benchmark scores can't separate the two, so I built probes that can.",
          "long": "Benchmarks tell you if the answer is correct. They don't tell you how the model got there. Two models with the same score can fail in very different ways once you change names, inject a wrong intermediate, or move off the training distribution.\n\nI built three probes — entity rename, plan-versus-execution consistency, and closeness to training data — across 219 problems and five models, with exact checkers and a pipeline you can regenerate from code.",
          "next": ["rvc-found", "rvc-artifacts"]
        },
        {
          "id": "rvc-found",
          "q": "What did you actually discover?",
          "short": "Models with the same score fail in very different ways. o3-mini went from a perfect score to zero on a scheduling task after only the names changed.",
          "long": "The same rename helped some models, left others at the floor, and even reversed direction across subtypes. On arithmetic, Gemini held up when numbers were regenerated but fell hard when only names changed.\n\nInjecting a wrong state mid-solve: models accepted it 88–100% of the time, yet accuracy after injection often stayed close to uninterrupted performance — so compliance is not the same as derailment.",
          "next": ["rvc-artifacts", "wrong"]
        },
        {
          "id": "rvc-artifacts",
          "q": "Could your probes themselves introduce artifacts?",
          "short": "Yes — and that risk is why verifier audits and multiple probe families matter.",
          "long": "A rename could accidentally change difficulty. An injection format could bias compliance. I try to keep interventions minimal and problem-preserving, then check whether effects are probe-specific or convergent.\n\nIf a result only appears under one quirky probe wording, I don't trust it.",
          "challenge": "Gold-in / gold-out checks: if the probe itself created the effect, fixing the labels or restoring gold answers would collapse the gap. It didn't.",
          "next": ["convincing", "confounders"]
        },
        {
          "id": "ocr-what",
          "q": "What is Reading Without Looking?",
          "short": "A controlled study asking whether OCR confidence on Indic scripts actually tracks what the model sees.",
          "long": "Document systems auto-accept high-confidence pages. That only works if confidence means evidence. I trained a 19.6M OCR model from scratch so I could run counterfactuals an API won't allow.",
          "next": ["ocr-why-scratch"]
        },
        {
          "id": "ocr-why-scratch",
          "q": "Why train your own OCR model instead of testing a big one?",
          "short": "So I could blank the image, scramble it, and turn vision off — counterfactuals a closed API will not let you run.",
          "long": "When I trained a small OCR model from scratch for Reading Without Looking, it wasn't because scratch is romantic. It was so I could blank the image, scramble it, and turn the vision pathway off. You can't run those counterfactuals on a closed API.\n\nSame instinct shows up in systems work: if I built the pipeline, I know where it breaks.",
          "next": ["ocr-what", "scratch"]
        },
        {
          "id": "ddpm-why",
          "q": "Why diffusion models for market data?",
          "short": "To generate new, diverse surfaces with fewer arbitrage violations than naïvely resampling history.",
          "long": "The generator's arbitrage penalty landed around 0.005 vs about 0.009 on market data. That matters if you're going to train an agent on synthetic worlds — garbage worlds teach garbage hedges.",
          "next": ["ddpm-contrib"]
        },
        {
          "id": "ddpm-contrib",
          "q": "How much of the gain came from the data versus the agent?",
          "short": "The draft frames it as model-risk decomposition: separate the lift from better surfaces and from a better hedging agent.",
          "long": "End-to-end the stack is surface dataset, conditional diffusion generator, PPO hedging agent, and evaluation that tries to attribute gain. It's a research draft with code — meant to make the claim inspectable, not just a chart in a slide.",
          "next": ["ddpm-why"]
        },
        {
          "id": "omnimesh-why",
          "q": "Why offline-first for disaster response?",
          "short": "Because \"we'll sync later\" is the only honest architecture when the tower is down.",
          "long": "Online-first apps silently become bricks. Offline-first means local triage and mesh routing are the default; cloud is an optimisation when it reappears.",
          "next": []
        },
        {
          "id": "fraudsense-fp",
          "q": "How do you avoid flagging honest candidates?",
          "short": "No single signal can flag anyone. At least three independent signal types have to agree.",
          "long": "FraudSense AI combines writing signals, typing behaviour and an LLM judge. A single detector is too noisy for a live interview, so the system only raises a flag when independent channels agree. That keeps honest candidates from being dinged by one brittle cue.",
          "next": ["fraudscope-arch"]
        },
        {
          "id": "fraudscope-arch",
          "q": "How does FraudScope360 combine its five detectors?",
          "short": "Ingest → feature and graph views → module scores → combined decision via FastAPI.",
          "long": "Each module produced a signal; the combiner turned them into something actionable. Identity fraud and ring detection were first-class paths, not afterthoughts.",
          "next": ["fraudsense-fp"]
        },
        {
          "id": "nurix-learned",
          "q": "What did you learn that projects didn't teach you?",
          "short": "That production failure modes show up in integration seams — and that a thin working slice beats a perfect offline metric.",
          "long": "Also: communication bandwidth. Clear write-ups and demos matter when the model is one piece of a speech stack.",
          "next": ["failure"]
        }
      ]
    },
    {
      "id": "research",
      "name": "Research",
      "questions": [
        {
          "id": "questions",
          "q": "How do you come up with research questions?",
          "short": "I notice a meter people trust, then ask what would have to be true for that trust to be deserved.",
          "long": "Accuracy as reasoning. Confidence as evidence. Synthetic markets as training truth. If a claim is doing a lot of work in a system, I want a probe that can kill it.\n\nQuestions usually start as irritations, not as literature gaps.",
          "next": ["convincing", "now"]
        },
        {
          "id": "convincing",
          "q": "How do you know an experiment is convincing?",
          "short": "If a sceptical peer can regenerate it, name the confounders, and still see the effect under the interventions that should matter.",
          "long": "Gold-in/gold-out checks, held-out splits, pre-registered comparisons when I can. A pretty chart without a killing intervention is not convincing to me.",
          "next": ["confounders", "benchmark"]
        },
        {
          "id": "confounders",
          "q": "How do you handle confounders?",
          "short": "Name them early, design interventions that isolate them when possible, and refuse a clean story when isolation fails.",
          "long": "In RvC, exposure and difficulty can move together — so I say so. Ambiguous instances stay ambiguous. Pretending otherwise is how papers become fiction.",
          "next": ["wrong", "rvc-artifacts"]
        },
        {
          "id": "wrong",
          "q": "Tell me about a hypothesis that turned out wrong.",
          "short": "I thought acceptance of an injected mid-solve error would derail final answers more reliably than it did.",
          "long": "The data disagreed. Being wrong there improved the paper: we separated compliance from derailment instead of smuggling them together.",
          "next": ["failure", "selfcritique"]
        },
        {
          "id": "benchmark",
          "q": "What makes a benchmark good?",
          "short": "Exact checkers, clear interventions, and honesty about what the score does not mean.",
          "long": "Bigger isn't better if you can't verify answers or interpret failures. I'd rather have 219 problems with exact checkers than a giant set that only supports vibes.",
          "next": ["rvc-what", "convincing"]
        },
        {
          "id": "now",
          "q": "What are you researching now?",
          "short": "Extending the retrieval-vs-computation program toward mechanism, plus finishing the volatility/hedging draft story.",
          "long": "Behavioural probes were phase one. Next is where the split lives and what training induces it. OCR confidence left me with unfinished business on grounding-aware meters too.",
          "next": ["curious", "compute"]
        }
      ]
    },
    {
      "id": "behavioural",
      "name": "Behavioural",
      "questions": [
        {
          "id": "failure",
          "q": "Tell me about a failure.",
          "short": "I've over-built evaluation harnesses before a thin demo existed — which delayed learning from real users of the idea.",
          "long": "It's the shadow side of caring about measurement. The fix I'm practicing: vertical slice first, deepen probes second. Nurix reinforced that. Some research restarts still tempt me the other way.",
          "next": ["decision", "weak"]
        },
        {
          "id": "decision",
          "q": "Tell me about a difficult technical decision.",
          "short": "Training OCR from scratch instead of only probing a closed API — slower upfront, necessary for counterfactuals.",
          "long": "We could have written a weaker paper faster with black-box scores. We wouldn't have been able to blank vision or scramble inputs meaningfully. The decision traded timeline for levers.",
          "next": ["ocr-why-scratch", "new"]
        },
        {
          "id": "new",
          "q": "How do you learn something completely new?",
          "short": "Build a tiny version, break it, read until the break makes sense, then rebuild.",
          "long": "I use papers and lectures, but they stick when attached to a failing artifact. The study module on my shelf is that process written down.",
          "next": ["ambiguity", "scratch"]
        },
        {
          "id": "ambiguity",
          "q": "How do you deal with ambiguity?",
          "short": "I try to turn it into a measurable disagreement — what would we see if A were true vs B?",
          "long": "If we can't name that, I keep the claim soft. Ambiguous instances in RvC stayed labelled ambiguous on purpose.",
          "next": ["confounders", "weak"]
        },
        {
          "id": "weak",
          "q": "What are you trying to improve?",
          "short": "Faster thin slices, clearer one-page explanations, and more comfort showing unfinished work early.",
          "long": "Same theme as getting better generally — shipping the probeable prototype before the perfect narrative.",
          "next": ["failure", "resume-weak"]
        }
      ]
    },
    {
      "id": "hard",
      "name": "Hard questions",
      "questions": [
        {
          "id": "resume-weak",
          "q": "What is the weakest part of your resume?",
          "short": "Some project rows look broader than the depth I can defend in twenty minutes — breadth from hacking and coursework.",
          "long": "I'd rather you open Ask and pressure-test RvC, OCR, FraudScope, OmniMesh, DDPM or Nurix than treat every repo as equal. The strongest work can take a challenge. The thinner rows shouldn't pretend otherwise.",
          "next": ["weak", "selfcritique"]
        },
        {
          "id": "overhyped",
          "q": "What's overhyped in AI? What's underrated?",
          "short": "Treating benchmark crowns and peak confidence as if they were process understanding. Boring instruments: exact checkers, counterfactuals, harness tests, and writing down what would falsify you.",
          "long": "Leaderboards are useful. They are not a theory of mind for the model. Confidence is useful. It is not automatically evidence. A lot of product risk comes from that category error.\n\nAlso: engineers who can move between research doubt and production constraints without cosplaying only one of them.",
          "next": ["benchmark", "selfcritique"]
        },
        {
          "id": "selfcritique",
          "q": "What would you challenge about your own research?",
          "short": "Behavioural probes still leave many instances ambiguous — behaviour alone won't finish the retrieval/computation story.",
          "long": "That's why mechanism work is next. I'd also challenge anyone (including me) who over-reads a single rename collapse without the confounder discussion.",
          "next": ["now", "compute"]
        },
        {
          "id": "compute",
          "q": "What would you do with 10× compute?",
          "short": "Widen problem families with exact checkers, push mechanistic follow-ups on RvC, and run fuller generator/agent sweeps on the hedging stack.",
          "long": "I wouldn't spend it on a vanity leaderboard climb. I'd spend it on interventions and ablations that are currently budget-bound.",
          "next": ["noconstraints", "hire"]
        },
        {
          "id": "hire",
          "q": "Why should someone hire you?",
          "short": "Because I ship and I distrust meters — a CAISc paper, production speech wins at Nurix, systems that won national recognition — and I can explain the failure case.",
          "long": "I design probes and ablations, not only dashboards. I'm comfortable being interviewed hard on assumptions. If you want someone who only polishes accuracy curves, I'm a bad fit. If you want someone who asks whether the curve means anything, I'm a good one.",
          "next": ["looking", "team"]
        }
      ]
    }
  ]
};
