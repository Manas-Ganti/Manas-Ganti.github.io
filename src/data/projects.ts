/**
 * Single source of truth for the /projects page and the home page's featured cards.
 *
 * THE PROOF RULE: `result` may only contain a number that exists on disk in that
 * project's repo (a committed figure, a logged eval, a passing test count). If a
 * training run hasn't produced it yet, `result` stays null and `status` says so.
 * An unverified number on this site costs more credibility than an empty slot.
 *
 * Last audited against the project directories on 2026-09-23. Each `result` names
 * the file it came from in a comment.
 */

export type ProjectStatus = "shipped" | "training" | "design";

export const statusLabel: Record<ProjectStatus, string> = {
	shipped: "Built & measured",
	training: "Trained; iterating",
	design: "Built; no training run yet",
};

export type ProjectArea = "rl" | "systems";

export const areaLabel: Record<ProjectArea, string> = {
	rl: "RL environments & post-training",
	systems: "Applied ML & LLM systems",
};

export interface Project {
	/** Stable id, also used as the anchor on /projects. */
	slug: string;
	title: string;
	/** One line: what it is. No adjectives. */
	tagline: string;
	status: ProjectStatus;
	area: ProjectArea;
	/** The senior design decision — the reason this project is interesting. */
	hook: string;
	stack: string[];
	/** null when the repo isn't public yet — do not invent a URL. */
	repo: string | null;
	/**
	 * A measured outcome, or null. Never a projected or hoped-for number.
	 * `detail` should say how it was verified.
	 */
	result: { headline: string; detail: string } | null;
	/** Blog post slug, once the post anchored to this result exists. */
	post: string | null;
	featured: boolean;
}

export const projects: Project[] = [
	{
		slug: "visual-reasoning-rlvr",
		title: "Investigative Visual Reasoning via Verifiable RL",
		tagline:
			"An agentic RL environment where a 32B vision-language model investigates an image under an inspection budget (committing a falsifiable hypothesis before each reveal) to decide whether it is a real photo or AI-generated.",
		status: "training",
		area: "rl",
		hook: "The reward is mechanically verifiable end to end, with no LLM judge anywhere: it reads only machine-checkable fields (belief, reconciliation direction, verdict, confidence), never the prose. Getting there meant measuring the benchmark first. Image dimensions alone predicted the label at 0.850 AUC, so the fix was a new geometry-matched substrate (1,570 paired images, confound back to 0.500), not a patched metric.",
		stack: [
			"Qwen2.5-VL-32B",
			"PyTorch",
			"HuggingFace TRL (GRPO)",
			"vLLM",
			"PEFT/LoRA",
			"DeepSpeed",
			"SLURM (8×GPU)",
		],
		repo: "https://github.com/Manas-Ganti/Visual-reasoning-rlvr",
		// results/grpo_run1.md, results/grpo_run3.md, results/what_we_know.md (committed).
		result: {
			headline:
				"GRPO took the policy from anti-correlated to discriminating (separation gap −3.4% → +15.8% over 600 steps), while held-out accuracy stayed at chance",
			detail:
				"0.545 vs 0.513 base (McNemar p=0.23). The cause is structural: group-relative advantage cancels across balanced data, so GRPO cannot move a class prior. Three cycles later, trajectory analysis over 988 rollouts found that the verdict matches the belief after one inspection 80.1% of the time. The investigation confirms a first impression instead of testing it, which sets up the next experiment.",
		},
		post: null,
		featured: true,
	},
	{
		slug: "dxenv",
		title: "dxenv: a Diagnostic RLVR Environment",
		tagline:
			"A multi-turn RL environment where an LLM agent decides which tests are worth their cost and reports a distribution over 149 conditions. It is a synthetic research environment, not a clinical tool, and none of its outputs are clinical guidance.",
		status: "training",
		area: "rl",
		hook: "The environment computes a Bayes-optimal ceiling over the same evidence the agent sees, so an agent that beats it must have information it shouldn't, and training halts on a suspected leak. That is one of twelve invariants, each with its own test file. Test ordering can never earn positive reward, scoring uses a strictly proper rule so hedging can't pay, and the eval split is hash-frozen.",
		stack: [
			"Qwen2.5-7B + LoRA",
			"GRPO",
			"vLLM",
			"Grammar-constrained decoding",
			"PyTorch",
			"mypy --strict",
			"SLURM",
		],
		repo: "https://github.com/Manas-Ganti/healthcare-RL",
		// README.md Status + docs/design-notes.md; curve at runs/grpo/steps.jsonl (committed).
		result: {
			headline:
				"99 GRPO steps took test ordering from 0.79 to 3.5 per episode, with no reward term for testing",
			detail:
				"Tests only ever subtract reward (invariant I5), so the only route was for tests to pay for themselves. The environment result is real. The policy is still poor: it sits below the blank-record floor, and the curve is a fast correction followed by a plateau. Gate B was measured three times (prompted: fail; SFT: pass; GRPO: fail) and each verdict is reported.",
		},
		post: null,
		featured: true,
	},
	{
		slug: "long-context-navigator",
		title: "Long-Context Navigation under a Hard Context Ceiling",
		tagline:
			"A verifiable RL environment where an agent answers multi-hop questions over documents far larger than the 600 tokens it may hold. It chooses what to read, compress, and drop, and exceeding the ceiling ends the episode.",
		status: "training",
		area: "rl",
		hook: "The ceiling is a constraint, not a cost term, so there is no α to tune until the intended behaviour appears. The policy is stateless between steps, which means its own COMPRESS summary is the only way to carry a bridge entity forward. Every instance is validated from the text and rejected if any distractor path reaches the answer. A real-text substrate (MuSiQue) was built, de-confounded five times, then rejected by a gate set before the numbers were seen.",
		stack: ["Qwen2.5-7B-Instruct", "SFT + GRPO (LoRA)", "PyTorch", "Pydantic", "SLURM"],
		repo: "https://github.com/Manas-Ganti/long-context-navigator",
		// README.md "Results so far": 600 held-out instances, commands listed alongside.
		result: {
			headline:
				"SFT: 0.630 in-distribution (2–3 hops), 0.050 out-of-distribution (4–5 hops); the untrained base scores 0.000",
			detail:
				"SFT learned the hard constraint outright (zero in-distribution ceiling violations), but only as a routine for the lengths it saw. At 4–5 hops, summary fact retention drops from 0.98 to 0.60 and the policy runs out of steps re-reading what it lost. The first GRPO run did not move the policy (KL 0.007) and is kept as a control.",
		},
		post: null,
		featured: true,
	},
	{
		slug: "clinical-dashboard",
		title: "Clinical Intelligence Dashboard",
		tagline:
			"A full-stack clinical data platform where an LLM answers natural-language questions without ever writing SQL, running on 1,171 Synthea patients (53k encounters, 150k findings).",
		status: "shipped",
		area: "systems",
		hook: 'The LLM operates the system only through typed service tools: constrained function calling against a Pydantic domain model, never freeform text or generated SQL. In a regulated domain, the type system is the safety boundary. The same tool surface runs on Claude or on self-hosted open models, which turns "can we swap in a cheaper model?" into a measurable question.',
		stack: [
			"FastAPI",
			"Pydantic v2",
			"PostgreSQL + pgvector",
			"React + TypeScript",
			"Claude / open models (function calling)",
			"Docker",
		],
		repo: "https://github.com/Manas-Ganti/Clinical-Intelligence-Dashboard",
		// README.md + evals/cases.py, evals/harness.py.
		result: {
			headline: "A 35-case graded eval harness for the LLM query layer",
			detail:
				"Scores tool selection, arguments, chaining, refusal, honest zero-result reporting and sampling. It grades the structured tool call mechanically, not with another model. Multi-source ingestion (CSV, FHIR, SQL, DICOM/NIfTI) is reconciled into one typed domain model with a logged transformation trail.",
		},
		post: null,
		featured: true,
	},
	{
		slug: "nl-sql-agent",
		title: "NL → SQL Analytics Agent",
		tagline:
			"Ask a database a question in plain English, read the SQL before anything runs, then get the answer, with every number in the explanation checked against the returned rows.",
		status: "shipped",
		area: "systems",
		hook: "The model's SQL is treated as untrusted input. It is parsed into a syntax tree and checked (one SELECT only, every table and column exists, restricted columns blocked) before it touches a database that is opened read-only anyway. The server re-validates on Run because the browser could have changed the query. Retrieval, validation, execution and the number check are plain local code, testable without an API key.",
		stack: ["Python", "sqlglot", "Pydantic", "gpt-oss-120b / Claude", "Schema retrieval"],
		repo: "https://github.com/Manas-Ganti/NL-SQL-agent",
		// results/results_full.md, results/results_retrieved.md (committed, run 2026-09-14).
		result: {
			headline:
				"95% execution accuracy with the full schema, 85% with retrieved tables, and 29% fewer tokens",
			detail:
				"55 hand-written questions across six categories, graded on whether the result rows match rather than the SQL text (gpt-oss-120b). Every retrieval miss was a refusal, not a guess. 0 of 110 generated queries failed validation. Vague questions are the weak spot (33%), because the model answers instead of asking.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "credit-risk",
		title: "Credit Risk PD Model with Regulatory-Grade Validation",
		tagline:
			"A probability-of-default model on Lending Club loans where the validation framework (calibration, stability, fairness, explainability, leakage) is the deliverable.",
		status: "shipped",
		area: "systems",
		hook: "Every one of the 151 raw columns is classified by when it becomes known, and an unclassified column raises, so a data refresh can't silently add a feature. The out-of-time split does the rest of the work. A random split looks almost perfectly calibrated (ECE 0.002). Out of time, both models under-predict defaults by about 10% relative, and that is the problem that matters for a PD used in pricing.",
		stack: ["scikit-learn", "LightGBM", "SHAP", "WOE scorecard", "statsmodels", "Pandas"],
		repo: "https://github.com/Manas-Ganti/credit-risk-model",
		// artifacts/validation_results.json (seed 42), tabulated in README.md.
		result: {
			headline:
				"Out-of-time AUC 0.671 (WOE scorecard) vs 0.693 (LightGBM) on 283,026 loans from 2015",
			detail:
				"Bootstrap 95% CIs don't overlap. The GBM's in-sample AUC of 0.754 overstates its lead, and its per-vintage AUC drops from 0.75 to 0.69 at the first out-of-sample quarter while the scorecard holds at 0.66–0.67. Both score distributions are stable (PSI < 0.01). Adding the lender's own grade raises AUC by 1–2 points and makes calibration and stability worse.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "payload-transport",
		title: "Robust Payload-Transport Navigation under Terrain & Dynamics Shift",
		tagline:
			"A mobile robot learns to carry a variable-mass payload across parameterised sloped terrain, measured for out-of-distribution generalisation against a classical Nav2 baseline run through the same harness.",
		status: "design",
		area: "rl",
		hook: "The train/OOD split is asserted at config load, and touching endpoints count as overlap, so a contaminated grid cannot run. Payload mass replaces the usual gravity randomisation, because an unknown load is a real deployment condition and a different planet is not. A config-tree walk rejects any gravity-randomisation key.",
		stack: ["PyTorch", "Isaac Sim / Isaac Lab", "Nav2 baseline", "Weights & Biases", "Docker"],
		repo: "https://github.com/Manas-Ganti/robotics-rl-payload-transport",
		result: null,
		post: null,
		featured: false,
	},
];

export const featuredProjects = projects.filter((p) => p.featured);
