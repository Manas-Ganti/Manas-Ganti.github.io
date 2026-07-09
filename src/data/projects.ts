/**
 * Single source of truth for the /projects page and the home page's featured cards.
 *
 * THE PROOF RULE: `result` may only contain a number that exists on disk in that
 * project's repo (a committed figure, a logged eval, a passing test count). If a
 * training run hasn't produced it yet, `result` stays null and `status` says so.
 * An unverified number on this site costs more credibility than an empty slot.
 */

export type ProjectStatus = "shipped" | "training" | "design";

export const statusLabel: Record<ProjectStatus, string> = {
	shipped: "Built & running",
	training: "Training in progress",
	design: "Design complete, training pending",
};

export interface Project {
	/** Stable id, also used as the anchor on /projects. */
	slug: string;
	title: string;
	/** One line: what it is. No adjectives. */
	tagline: string;
	status: ProjectStatus;
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
		slug: "clinical-dashboard",
		title: "Clinical Intelligence Dashboard",
		tagline:
			"A full-stack clinical data platform where an LLM answers natural-language questions without ever writing SQL.",
		status: "shipped",
		hook: "The LLM operates the system only through typed service tools — constrained function calling against a Pydantic domain model, never freeform text or generated SQL. In a regulated domain, the type system is the safety boundary.",
		stack: [
			"FastAPI",
			"Pydantic v2",
			"PostgreSQL + pgvector",
			"React + TypeScript",
			"Claude (function calling)",
			"Docker",
		],
		repo: "https://github.com/Manas-Ganti/Clinical-Intelligence-Dashboard",
		result: {
			headline: "51 passing tests across domain, ingestion, service, API, and LLM layers",
			detail:
				"Multi-source ingestion (CSV, FHIR, SQL, DICOM/NIfTI) reconciled into one typed domain model with a deterministic canonical-ID merge and a logged transformation trail.",
		},
		post: null,
		featured: true,
	},
	{
		slug: "vlm-grpo",
		title: "Active-Perception VLM for AI-Image Detection",
		tagline:
			"A vision-language model learns to investigate an image — zooming, requesting metadata — before judging whether it is AI-generated.",
		status: "training",
		hook: "The reward is multi-signal by necessity. A metadata-shortcut penalty exists because the agent will otherwise ignore the image entirely and classify on EXIF alone. The interesting result isn't the accuracy — it's what collapses when you remove that penalty.",
		stack: ["PyTorch", "HuggingFace TRL", "GRPO", "SmolVLM", "PEFT/LoRA", "Gymnasium"],
		repo: "https://github.com/Manas-Ganti/RL-Based-AI-content-detector",
		// Checkpoints and completion parquets exist on disk from a partial run,
		// but no final eval / McNemar test has been produced yet.
		result: null,
		post: null,
		featured: true,
	},
	{
		slug: "self-play-racing",
		title: "Competitive Self-Play on a Parameterised Racetrack",
		tagline:
			"Two agents learn to race each other from scratch, with no instructions about what racing tactics are.",
		status: "design",
		hook: "A frozen-checkpoint ELO opponent pool with skill-proximity sampling — agents train against opponents near their own rating rather than the current policy, which is what keeps self-play from collapsing into a degenerate equilibrium.",
		stack: ["Stable-Baselines3 (PPO/SAC)", "PettingZoo", "highway-env", "Weights & Biases"],
		repo: null,
		result: null,
		post: null,
		featured: false,
	},
	{
		slug: "smart-energy",
		title: "Smart Energy Control with a Perfect-Foresight LP Baseline",
		tagline:
			"An RL agent schedules a building's battery, HVAC, and grid draw against time-of-use pricing — and against an oracle that already knows the future.",
		status: "design",
		hook: "Most RL control projects compare against a heuristic. This one solves the same problem as a linear program with perfect foresight, which establishes the true cost ceiling — so the policy's optimality gap can be measured rather than guessed at.",
		stack: ["Stable-Baselines3 (PPO/SAC)", "Gymnasium", "SciPy (linprog)", "Pandas"],
		repo: null,
		result: null,
		post: null,
		featured: false,
	},
];

export const featuredProjects = projects.filter((p) => p.featured);
