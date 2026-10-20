/**
 * Single source of truth for the /projects page and the home page's featured cards.
 *
 * THE PROOF RULE: `result` may only contain a number that exists on disk in that
 * project's repo (a committed figure, a logged eval, a passing test count). If a
 * training run hasn't produced it yet, `result` stays null and `status` says so.
 * An unverified number on this site costs more credibility than an empty slot.
 *
 * Last audited against the project directories on 2026-10-14. Each `result` names
 * the file it came from in a comment.
 */

export type ProjectStatus = "shipped" | "training" | "design";

export const statusLabel: Record<ProjectStatus, string> = {
	shipped: "Built & measured",
	training: "Trained; iterating",
	design: "Built; no training run yet",
};

/** Grouped by the skill a project demonstrates, in the order /projects shows them. */
export type ProjectArea = "llm-rl" | "optimum" | "embodied" | "systems";

export const areaLabel: Record<ProjectArea, string> = {
	"llm-rl": "LLM agents: RL environments & evals",
	optimum: "RL against a provable optimum",
	embodied: "Embodied & multi-agent RL",
	systems: "Production ML & LLM systems",
};

export const areaBlurb: Record<ProjectArea, string> = {
	"llm-rl":
		"Environments where the reward can't be gamed, and harnesses where a pass can't be bought.",
	optimum:
		"Finance problems where the right answer is computable, so the learned policy is checked against it.",
	embodied:
		"Simulated robots and vehicles, where the first job is proving the simulator measures what it claims.",
	systems: "Shipped applications and models, where the evaluation protocol is the deliverable.",
};

export interface Project {
	/** Stable id, also used as the anchor on /projects. */
	slug: string;
	title: string;
	/** One line: what it is. No adjectives. */
	tagline: string;
	/** A shorter line for the home page's selected-work list. Featured projects only. */
	summary?: string;
	/**
	 * One line (≤ ~20 words) for the /projects index row: the result, or the honest status when
	 * there is none. Same proof rule as `result`: only numbers already on this card.
	 */
	brief: string;
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
	/**
	 * Published Prime Intellect Environments Hub package, when there is one. `baseline` is a
	 * public vf-eval run of the Hub package (a separate harness from `result`), and it follows
	 * the same proof rule.
	 */
	hub?: {
		url: string;
		baseline: string;
		evals: { label: string; url: string }[];
	};
}

export const projects: Project[] = [
	{
		slug: "visual-reasoning-rlvr",
		title: "Investigative Visual Reasoning via Verifiable RL",
		tagline:
			"A 32B vision-language agent inspects parts of an image under a budget to decide whether it's a real photo or AI-generated.",
		summary:
			"A 32B vision-language agent inspects an image under a budget to decide whether it is real or AI-generated. The reward is checked mechanically, with no LLM judge.",
		status: "training",
		area: "llm-rl",
		brief:
			"GRPO built discrimination (gap −3.4% → +15.8%) but held-out accuracy stayed at chance, for a structural reason.",
		hook: "I first checked the benchmark for shortcuts (image size alone predicted the label at 0.850 AUC), then built a size-matched dataset to remove that shortcut, and the reward scores only structured fields, with no LLM judge.",
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
				"GRPO taught the policy to discriminate (separation gap −3.4% → +15.8% over 600 steps), but held-out accuracy stayed at chance, and I traced why",
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
			"An LLM agent chooses which diagnostic tests are worth their cost, then gives a probability for each of 149 conditions (synthetic, not clinical guidance).",
		summary:
			"An LLM agent decides which diagnostic tests are worth their cost. A Bayes-optimal ceiling flags any run that beats it as a leak. Published on the Prime Intellect Environments Hub.",
		status: "training",
		area: "llm-rl",
		brief:
			"Test ordering rose from 0.79 to 3.5 per episode with no reward for testing; the policy is still below the floor.",
		hook: "The environment computes the best score possible from the same evidence, so an agent that beats it gets flagged for using leaked information.",
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
				"With no reward for testing, 99 GRPO steps raised test ordering from 0.79 to 3.5 per episode: the policy learned that tests can pay for themselves",
			detail:
				"Tests only ever subtract reward (invariant I5), so the only route was for tests to pay for themselves. The environment result is real. The policy is still poor: it sits below the blank-record floor, and the curve is a fast correction followed by a plateau. Gate B was measured three times (prompted: fail; SFT: pass; GRPO: fail) and each verdict is reported.",
		},
		post: null,
		featured: true,
		// prime-hub: environments/dxenv-diagnostician/outputs/evals/*--3656063f (ARC, 2026-10-19).
		hub: {
			url: "https://app.primeintellect.ai/dashboard/environments/manasganti/dxenv-diagnostician",
			baseline:
				"Published as a verifiers v1 package, with the free-reward exploit found in the pre-release audit fixed. Untrained Qwen2.5-7B scores −0.602 ± 0.015 over 50 episodes, below the −0.019 floor of reporting the prior.",
			evals: [
				{
					label: "Baseline eval",
					url: "https://app.primeintellect.ai/dashboard/evaluations/bs08z0hgluai2b23g3ait4c5",
				},
			],
		},
	},
	{
		slug: "long-context-navigator",
		title: "Long-Context Navigation under a Hard Context Ceiling",
		tagline:
			"An agent answers multi-hop questions over documents far larger than the 600 tokens it's allowed to hold, choosing what to read, summarise and drop.",
		summary:
			"An agent answers multi-hop questions over documents far larger than the 600 tokens it may hold. SFT reaches 0.630 in-distribution and collapses to 0.050 at longer hop counts.",
		status: "training",
		area: "llm-rl",
		brief: "SFT reaches 0.630 in-distribution and collapses to 0.050 at longer hop counts.",
		hook: "The limit is a hard rule rather than a penalty: going over it ends the episode, so there's no penalty weight to tune.",
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
		// prime-hub: environments/long-context-navigator/outputs/evals/*--3a22cfe7, *--d9e6c9c7 (ARC, 2026-10-19).
		hub: {
			url: "https://app.primeintellect.ai/dashboard/environments/manasganti/long-context-navigator",
			baseline:
				"Published as a verifiers v1 package that regenerates the source repo's splits exactly. Untrained Qwen2.5-7B answers 0 of 50 correctly in-distribution and 0 of 50 out-of-distribution, breaking the 600-token ceiling in 66% and 90% of episodes.",
			evals: [
				{
					label: "Baseline eval (2–3 hops)",
					url: "https://app.primeintellect.ai/dashboard/evaluations/zf5z737cx5350oiaf7mmi82z",
				},
				{
					label: "Baseline eval (4–5 hops)",
					url: "https://app.primeintellect.ai/dashboard/evaluations/cjk9jb3ggyfq47tvyxq39117",
				},
			],
		},
	},
	{
		slug: "bond-duration-allocation",
		title: "Duration-Aware Bond Allocation, Verified against a DP Optimum",
		tagline:
			"An agent moves a Treasury portfolio between 2-, 7- and 20-year bonds as interest rates change, under trading limits and costs.",
		status: "shipped",
		area: "optimum",
		brief:
			"The learned policy matches the exact DP optimum (paired difference 0.00 bp/yr); on real curves the edge is not detectable.",
		hook: "It trains only on simulated rates, is checked against the exact optimal policy first, and sees real historical rates only at the end, for evaluation.",
		stack: [
			"Fitted Q-iteration",
			"Dynamic programming",
			"NumPy",
			"Ornstein-Uhlenbeck curve model",
			"FRED data",
			"pytest",
		],
		repo: "https://github.com/Manas-Ganti/bond-duration-allocation",
		// results/metrics.json (seed 20261014, 2026-10-14), tabulated in README.md.
		result: {
			headline:
				"Learned policy matches the DP optimum: both beat the static allocation by 49.9 bp/yr, paired difference 0.00 (95% CI ±0.51)",
			detail:
				"98.4% of long-bucket weights land within one grid step of DP, and both develop the same no-trade band under costs (Jaccard 0.81). On real Treasury curves 1977–2026 the edge is not detectable (+49.8 bp/yr, CI −50 to +154), and fitting the model to history shows why: the policy trades on level mean reversion, and history reverts about half as fast as the training world assumes.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "optimal-stopping",
		title: "Learned Optimal Stopping for American Options",
		tagline:
			"An agent decides on each date whether to exercise an American put option or keep holding it.",
		status: "shipped",
		area: "optimum",
		brief:
			"Learned exercise boundary within 0.015 S/K of Longstaff-Schwartz; option values agree to 0.1%.",
		hook: "The right answer is computable here, so I checked the policy against two standard pricing methods before testing it on unfamiliar market dynamics and 25 years of real prices.",
		stack: [
			"Fitted Q-iteration",
			"Longstaff-Schwartz",
			"CRR lattice",
			"Merton / Heston simulators",
			"Gymnasium",
			"pytest",
		],
		repo: "https://github.com/Manas-Ganti/optimal-stopping-rl",
		// results/metrics.json and results/gates.json (seed 20261014, 2026-10-14), tabulated in README.md.
		result: {
			headline:
				"Learned exercise boundary within 0.015 S/K of Longstaff-Schwartz on average (0.024 worst); option values agree to 0.1%",
			detail:
				"200,000 common paths; the exact Bermudan lattice shows where each method is wrong. Off-model the two break in opposite places: under Merton jumps the learned policy loses less than half what GBM-fitted LSM loses, under Heston it is the one that degrades. Both regrets stay under 1.5% of option value. On 384 real one-year puts (16 tickers, 2001–2025) they stop on the same date 85% of the time and the pooled difference is indistinguishable from zero.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "clinical-dashboard",
		title: "Clinical Intelligence Dashboard",
		tagline: "An LLM answers plain-English questions over 1,171 synthetic patient records.",
		summary:
			"An LLM answers clinical questions only through typed service tools, never generated SQL, with a 35-case eval harness that grades every tool call.",
		status: "shipped",
		area: "systems",
		brief: "A 35-case eval harness that grades every LLM tool call mechanically.",
		hook: "It can only call typed tools and never writes SQL, so the type system is the safety boundary, and the same tools run on Claude or on self-hosted open models.",
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
		tagline: "Ask a database a question in plain English and see the SQL before it runs.",
		status: "shipped",
		area: "systems",
		brief:
			"95% execution accuracy with the full schema; 85% with retrieved tables at 29% fewer tokens.",
		hook: "The generated SQL is treated as untrusted: it's parsed and checked (a single SELECT, real tables and columns, no restricted fields) before it runs on a read-only database, and every number in the answer is checked against the returned rows.",
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
		slug: "mind-the-gap-recsys",
		title: "Mind the Gap: a Two-Stage Recommender with an Honest Evaluation Protocol",
		tagline:
			"A two-stage news recommender (retrieval, then ranking) on MIND click logs, where the evaluation method is the main deliverable.",
		status: "shipped",
		area: "systems",
		brief:
			"A random split inflates the two-tower model's NDCG@10 36×; on a temporal split it ranks last of four.",
		hook: "Every model is scored under both random and time-based splits and both evaluation protocols, against properly tuned baselines, because the usual shortcuts each inflate results.",
		stack: [
			"PySpark",
			"PyTorch (two-tower)",
			"LightGBM lambdarank",
			"RP3beta",
			"FAISS (HNSW / IVF)",
			"SLURM",
		],
		repo: "https://github.com/Manas-Ganti/mind-the-gap-recsys",
		// results/mind_small/metrics.json + gates.json (ARC job 1133598, seed 42, 2026-10-13).
		result: {
			headline:
				"A random split inflates the two-tower model's NDCG@10 36×; on the temporal split it scores lowest of the four retrievers",
			detail:
				"MIND-small, 20,000 eval users, seeds 42–44. Under full-catalog evaluation tuned popularity beats every learned retriever, while sampled negatives rank the two-tower second (retrieval-order Kendall τ = 0.00 between protocols). Retrieval is the bottleneck: candidate recall is 0.43, so retrieval loses more of Recall@10 than ranking does (0.57 vs 0.33). The neural listwise ranker reaches 0.066 NDCG@10 end to end. All four pre-stated gates pass.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "arcode",
		title: "arcode: a Minimal Coding Agent with an Eval Harness",
		tagline:
			"A small terminal coding agent for any OpenAI-compatible model that logs every session with a reward, so sessions can be reused as eval or RL data.",
		status: "shipped",
		area: "llm-rl",
		brief:
			"38–42 of 42 hidden-test tasks resolved per model. The set is near its ceiling, so harder tasks are next.",
		hook: "Its eval harness hides the grading tests until the agent finishes and flags any edit to test files.",
		stack: [
			"TypeScript",
			"Node 20",
			"OpenAI-compatible API",
			"MCP (stdio)",
			"GLM / DeepSeek / gpt-oss",
		],
		repo: "https://github.com/Manas-Ganti/arcode",
		// evals/results/m2-baseline/results.jsonl (committed): 3 models × 42 tasks, one sample each.
		result: {
			headline:
				"A 42-task hidden-test eval, run across three models: 38–42 of 42 resolved per model",
			detail:
				"34 Aider polyglot exercises (public, possibly memorised) and 8 new hand-written multi-file tasks, one sample per model. The set is near its ceiling, so it does not separate models yet. That finding is why harder tasks, more samples and paired statistics are next.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "ctr-stream",
		title: "ctr-stream: Ad Click Prediction with Streaming Features",
		tagline:
			"An ad click-prediction model fed by matching batch and streaming feature pipelines, built to measure how much the two disagree and what that costs.",
		status: "design",
		area: "systems",
		brief: "Code-complete; not yet run on Criteo.",
		hook: "It reports calibration before AUC, because AUC can't detect probabilities that are 2× too high.",
		stack: [
			"Spark Structured Streaming",
			"LightGBM",
			"DeepFM",
			"Hashed LR",
			"Isotonic / Platt calibration",
			"pytest",
		],
		repo: null,
		// No result: README.md status (2026-10-12) is code-complete, not yet run on Criteo; results/ is empty.
		result: null,
		post: null,
		featured: false,
	},
	{
		slug: "credit-risk",
		title: "Credit Risk PD Model with Regulatory-Grade Validation",
		tagline:
			"A loan-default model on Lending Club data, where the validation (calibration, stability, fairness, explainability, leakage) is the deliverable.",
		status: "shipped",
		area: "systems",
		brief:
			"Out-of-time AUC 0.671 (scorecard) vs 0.693 (LightGBM) on 283,026 loans; both under-predict defaults by ~10%.",
		hook: "Every input column is tagged by when it becomes known, so no future information leaks in, and the models are tested on a later time period rather than a random split.",
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
		slug: "ppo-vs-grpo-racing",
		title: "Critic-Free RL under Competitive Distribution Shift",
		tagline:
			"PPO and GRPO (an LLM post-training method with no critic) each learn to drive a racetrack through traffic alone, then race each other head to head.",
		status: "training",
		area: "embodied",
		brief:
			"Environment validation: lap completion 0.00 → 0.48 / 0.72 after fixing the observation. Gate not yet passed.",
		hook: "They share every component except how they estimate advantage, with matched tuning budgets, so any difference comes from the algorithm.",
		stack: [
			"highway-env",
			"PettingZoo",
			"PyTorch (custom PPO + GRPO)",
			"Stable-Baselines3",
			"rliable",
			"Weights & Biases",
			"SLURM (CPU)",
		],
		repo: "https://github.com/Manas-Ganti/self-play-highwayenv",
		// report/log.md, "Phase 1 pilot #1" and "pilots #2a/#2b" (committed 2026-09-28; W&B
		// qqdbcyk0, 1t62mcey, zykjm5kt). Environment-validation pilots, not PPO-vs-GRPO results.
		result: {
			headline:
				"Environment validation, gate not yet passed: lap completion 0.00 → 0.48 / 0.72 (two seeds) after diagnosing the observation",
			detail:
				"SB3 PPO pilots, 2M steps, 50 eval episodes against a ≥0.90 gate. The first policy learned full throttle, straight ahead, because the kinematics observation carries no road information. A zero-steer script leaves the road at the same point. Switching to the on-road occupancy grid fixed cornering; the remaining failures are collisions (0.30 / 0.26), which the reward had made a rational trade: a 5-point crash cost against roughly 174 points of lap progress. The penalties were raised before the reward is frozen, and pilot #3 is next. No PPO-vs-GRPO comparison has run yet.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "payload-transport",
		title: "Robust Payload-Transport Navigation under Terrain & Dynamics Shift",
		tagline:
			"A wheeled robot learns to carry loads of varying weight over sloped terrain in simulation, and is compared with a classical planner (Nav2) on the same tests.",
		status: "training",
		area: "embodied",
		brief:
			"The first evaluation exposed two physics bugs, now fixed and guarded by probes. No valid result yet.",
		hook: "It's tested one condition at a time on settings outside its training range, with physics checks that confirm each condition really changes the simulation.",
		stack: [
			"Isaac Sim 4.5 / Isaac Lab 2.1",
			"PPO (rsl_rl)",
			"PyTorch",
			"Nav2 baseline",
			"Weights & Biases",
			"SLURM (L40S)",
		],
		repo: "https://github.com/Manas-Ganti/robotics-rl-payload-transport",
		// No numbers: the first eval's numbers live only on ARC (results/ is gitignored) and were
		// invalidated by the friction and wheel-radius fixes (commits 3eae625, f555417). The
		// finding below is those two fixes, not a measured score.
		result: {
			headline:
				"The first evaluation exposed two physics bugs that would have read as robustness; no valid score yet",
			detail:
				"The friction axis was inert: the wheel's own low-friction material won PhysX's min-combine, so the sampled ground friction never reached the tyre. The slope axis's \"catastrophic\" cliff sat at a grade the robot's wheel torque cannot climb. Both are now caught by physics probes in the smoke test and a torque-derived feasibility check.",
		},
		post: null,
		featured: false,
	},
	{
		slug: "drone-maze",
		title: "Drone Maze Speed-Navigation: Safe Route or Fast Route",
		tagline:
			"A vision-based drone policy flies 3D mazes that each have a slow, safe route and a fast, risky one, to measure whether it picks the fast route more often as its flying improves.",
		status: "design",
		area: "embodied",
		brief: "Environment and maze validator built and checked offline; not yet trained.",
		hook: "A validator proves the fast route really is riskier, and rewards are set from each maze's break-even crash rate rather than by feel.",
		stack: [
			"Isaac Lab",
			"PPO (rsl_rl) + CNN actor-critic",
			"PyTorch",
			"Analytic SDF collision",
			"SLURM (L40S)",
		],
		repo: "https://github.com/Manas-Ganti/maze-navigation-drone",
		// README.md Status: environment validated offline, not yet trained; results/ holds only maze checks.
		result: null,
		post: null,
		featured: false,
	},
];

export const featuredProjects = projects.filter((p) => p.featured);
