# Site update brief — portfolio state as of 2026-09-04

**For:** the agent working in `portfolio-page/manas-ganti/`.
**Source:** a read of every project directory in `../../` (the `portfolio-projects` root),
their READMEs, their `results/` folders on disk, and the GitHub API for repo visibility.

This file exists because **`src/data/projects.ts` has drifted badly**. It describes four
projects; there are now ten directories. One listed project no longer exists, one has been
renamed and substantially reframed, and one has produced its first real results. Everything
below was verified on disk or against the GitHub API on 2026-09-04 — nothing here is
inferred from a plan document.

---

## Rules that still bind (do not relax them for anything in this file)

1. **The proof rule.** A number reaches a page only if it exists on disk in that project's
   repo. Every number in this brief carries a `source:` line saying where it lives. If you
   want a number that has no `source:` line here, it does not exist yet — leave the slot
   empty and let the status say so. See `../../CLAUDE.md`.
2. **`/research` and the paper are Manas's to write.** Never draft the abstract, the
   finding, the venue, or the claims for `content/research/max-bias-paper/`. Scaffold and
   fix mechanics only.
3. **Never invent a repo URL.** `repo: null` when a repo is not public. Verified public
   repos are listed below with their exact current names.
4. `../../CLAUDE.md` marks the project directories **read-only**. Read them for
   material; never edit them.

---

## What changed since `projects.ts` was written

| Site entry | Reality on disk | Action |
|---|---|---|
| `clinical-dashboard` | Still real, but grew an LLM eval harness and multi-provider support. Test count on the card is stale. | Update |
| `vlm-grpo` | **Renamed and reframed.** Repo is now `Visual-reasoning-rlvr`; the model is Qwen2.5-VL-32B, not SmolVLM; the EXIF/metadata-shortcut penalty described on the card **no longer exists in the project**. It has also produced its first complete set of measured results. | Rewrite |
| `self-play-racing` | Exists as `self-play-highwayenv`, reframed as **PPO vs GRPO (critic-free)**, not ELO self-play. Repo is now public. | Rewrite |
| `smart-energy` | **No such directory exists.** The project was dropped. | Delete |
| — | Six new projects exist. | Add (see below) |

Copy consequence: `src/pages/projects.astro` opens with "Four projects, at different
stages." Change that line to match whatever count you end up publishing.

---

## Task list

### P0 — the site currently says things that are false

1. **Rewrite the `vlm-grpo` entry.** Its `hook` describes a metadata-shortcut penalty and
   an EXIF classification shortcut. Neither is in the project any more. Its `repo` URL
   points at the old repo name (it 301-redirects today, but should not be relied on). Its
   `result` is `null` even though the project now has measured results. Use the reference
   block below.
2. **Delete the `smart-energy` entry.** There is no `smart-energy-consumption-RL`
   directory in `portfolio-projects`.
3. **Rewrite `self-play-racing` → `self-play-highwayenv`.** The current `hook` (ELO
   opponent pool with skill-proximity sampling) is not what the project does now. The repo
   is public, so `repo` should no longer be `null`.
4. **Fix the "Four projects" line** in `src/pages/projects.astro`.

### P1 — add what exists

5. Add the new project entries you and Manas decide to publish, from the reference blocks
   below. My recommendation on which to include is at the end.
6. **Update `clinical-dashboard`'s `result`.** The card claims "51 passing tests". That
   number came from `../../CLAUDE.md`'s assessment and predates the eval harness;
   the suite is now 14 test files / 117 test functions by static count. **Do not publish
   117** — a `def test_` count is not a passing-test count, and parametrised tests make the
   two differ. Either run the suite in the project (read-only concerns don't apply to
   running pytest, but confirm with Manas first) and publish the real figure, or replace
   the headline with the non-numeric fact that is now the more interesting one: the 35-case
   graded eval harness for the LLM query layer.

### P2 — mechanics and gaps

7. `src/data/projects.ts`'s status vocabulary no longer covers the portfolio. Six projects
   are "full environment + test suite + evaluation harness built, nothing trained yet" —
   which `design`'s label ("Design complete, training pending") undersells considerably.
   **Recommendation:** keep the three-status type (no type churn) and retitle the label:
   `design: "Built; no training run yet"`. That reads honestly for
   `self-play-highwayenv`, `healthcare_RL`, `robotics-rl-payload-transport`,
   `alignment-distillation` and `multimodal-doc-ingestion` alike.
8. `content/research/max-bias-paper/index.md` has `code:` commented out, but
   **`https://github.com/Manas-Ganti/Maximisation-Bias-testing` is public** (verified via
   the GitHub API). Adding a `code:` link is a mechanical fix, not a content claim — but
   ask Manas to confirm that repo is the paper's code before you add it.
9. **`CLAUDE.md` says the first blog post is blocked. It no longer is.** The note reads
   that the highest-leverage first post is the VLM-GRPO reward-hacking ablation, "which
   cannot be written until that ablation has actually been run." Two things have changed:
   that pipeline has now completed a full cycle, and — independently —
   `../../healthcare_RL/docs/design-notes.md` contains a post that is **writable today with
   no training run at all**, because its result is methodological. See the dxenv block
   below for the five specific incidents. Suggested angle: *five times the measurement lied,
   and how each one was caught* — every instance is a case where a number looked fine and
   was wrong for a different reason. Raise it with Manas; posts are his to write, but the
   blocker recorded in `CLAUDE.md` is stale and should be corrected either way.
10. `CLAUDE.md`'s "Still to do" list is also partly out of date: `/research` is no longer an
   empty container (the Fragility of Maximisation entry is published), and the home page
   has no Research card at all — `src/pages/index.astro` is bio + `SocialList` only, with
   no featured projects either, despite `featuredProjects` being exported and
   `ProjectCard`'s `compact` mode existing for exactly that. Decide with Manas whether the
   home page should surface featured cards; the machinery is already there and unused.

---

## Reference blocks — verified facts per project

Everything under `source:` was read on disk on 2026-09-04.

### 1. Investigative Visual Reasoning via Verifiable RL (was `vlm-grpo`)

- **Directory:** `../../VLM-RL-aicontent-detection/` (folder name is stale; the project
  calls itself `visual-reasoning-rlvr`)
- **Repo:** `https://github.com/Manas-Ganti/Visual-reasoning-rlvr` — **public, verified**.
  The old `RL-Based-AI-content-detector` URL now 301-redirects.
- **Status:** `training` — one complete distill → SFT → GRPO → eval cycle finished
  2026-09-03; cycle 2 is scoped.
- **What it is now:** an agentic RL environment where a VLM investigates an image under a
  resolution/action budget to judge it real or AI-generated. Two actions only:
  `INSPECT <n>` (sharpen one cell of a 4×4 grid, costs budget) and
  `VERDICT <AI|REAL> confidence=<c>`. The agent must commit a **falsifiable hypothesis
  before each reveal** and reconcile it after.
- **The hook (this is the interesting decision, and it is not the one on the site today):**
  the reward is **mechanically verifiable end to end — no LLM judge anywhere**. It reads
  only machine-checkable fields (`P(fake)`, reconciliation direction, verdict, confidence),
  never the prose. Reasoning is forced *structurally* by partial observability, never
  scored for eloquence.
  A second, equally strong hook if you want the "hard part" to be about measurement rather
  than design: **image dimensions alone predicted the label at 0.850 AUC**, so both
  validation gates were scoring file geometry rather than image content — and the fix was
  to generate a replacement benchmark rather than to patch the metric.
- **Stack:** Qwen2.5-VL-32B, PyTorch, vLLM, HuggingFace TRL (GRPO), PEFT/LoRA, DeepSpeed,
  8×H200 on SLURM (VT ARC).

**Measured numbers, with provenance.** Read the caveat under each before publishing.

| Number | Source |
|---|---|
| Substrate: 1,570 paired 1024px images, DIV2K photos vs SDXL renderings of their own captions, geometry matched by construction | `results/substrate_synth1024.md` (committed) |
| Ceiling AUC 0.930 [0.89, 0.97] / floor AUC 0.591 [0.50, 0.68] | `results/substrate_synth1024.md` (committed) |
| Geometry confound: 0.850 AUC → 0.500 after rebuild | `results/geometry_confound.md` (committed) |
| GRPO discrimination gap −3.4% → **+15.8%** over 600 steps; mean reward −0.032 → +0.183; correct rate 48.3% → 57.9% | `results/grpo_run1.md` (committed) |
| Held-out accuracy 0.545 vs 0.513 base (seen generator, p=0.23); 0.532 vs 0.519 (unseen, FLUX, p=0.68); budget-limited probe 0.731 calibrated acc | `../../resume-visual-reasoning-rlvr.md` (dated 2026-09-03, kept outside the repo on purpose) — **see caveat** |
| Distillation keep rate 19.4% → 77.2%, 1,444 SFT trajectories | same doc |

> **Caveat you must respect.** `results/grpo_run1.md` in the repo still shows the held-out
> eval as `PENDING (job 7283097 / 7283103)` — it was written 2026-08-26, before the eval
> returned. The final eval numbers live in `../../resume-visual-reasoning-rlvr.md`, which
> states they are measured as of 2026-09-03 and that nothing in it is projected. They are
> therefore real, but they are **not yet written into a committed `results/` file**.
> **Ask Manas to confirm before any of the final-eval numbers go on the site.** The
> substrate and GRPO-run numbers above are safe — they are committed in the repo.

The honest headline here is not an accuracy figure. It is: *GRPO moved the policy from
anti-correlated to genuinely discriminating while held-out accuracy stayed at chance, and
the cause is structural — within-group advantage cancels across balanced data and cannot
shift a class prior.* That is a stronger portfolio claim than a number would be, and it is
the sort of thing `WEBSITE_BLOG_PLAN.md` says a depth post should be anchored to. There is
also a demo GIF at `docs/trajectory_demo.gif` and per-turn stills in `docs/frames/` — the
first real visual asset any of these projects has. Ask Manas before copying it in.

### 2. Clinical Intelligence Dashboard (`clinical-dashboard`) — update in place

- **Directory:** `../../clinical_dashboard/` · **Repo:**
  `https://github.com/Manas-Ganti/Clinical-Intelligence-Dashboard` — public, verified.
- **Status:** `shipped`. Unchanged, and still the most job-ready asset.
- **What's new since the card was written:**
  - Runs against **1,171 real Synthea patients — 53k encounters, 150k findings, 995 derived
    alerts**. `source:` README.md, stated as what the committed screenshot is running
    against; `docs/dashboard.png` is the artifact.
  - **A 35-case graded eval harness** for the LLM query layer (`evals/`), scoring tool
    *selection*, *arguments*, *chaining*, *refusal*, honest *zero* reporting, and
    *sampling*. Graded mechanically on the structured tool call, not by another model.
    `source:` README.md + `evals/cases.py`, `evals/harness.py`, `evals/run_eval.py` on disk.
  - The Ask layer now runs on **Claude or on VT ARC-hosted open models** (gpt-oss, GLM,
    Kimi, DeepSeek) behind one identical tool surface — which is what turns "can we swap in
    a cheaper model?" into a number.
- **Suggested `result` replacement:** lead with the eval harness rather than the test count.
  The existing hook (the type system as the safety boundary) is still accurate — keep it.

### 3. PPO vs GRPO under competitive distribution shift (replaces `self-play-racing`)

- **Directory:** `../../self-play-highwayenv/` · **Repo:**
  `https://github.com/Manas-Ganti/self-play-highwayenv` — **public, verified** (was `null`
  on the site).
- **Status:** `design` — "Phase 0 complete (scaffold, tests, throughput profile). Phases
  1–7 not started." `source:` README.md Status section. `results/` is empty.
- **What it actually is:** train PPO and GRPO *independently* on solo racetrack driving with
  IDM traffic, then evaluate them head-to-head on a track neither saw as multi-agent. GRPO
  here means group-relative advantage **without a critic**, ported from LLM fine-tuning into
  dense-reward continuous control.
- **The hook:** the observation contains **no feature distinguishing IDM traffic from a
  rival agent** — at evaluation the rival must appear as "an unusually capable traffic
  vehicle", so the distribution shift is *behavioural*, not *structural*. It is enforced by
  test (`tests/test_env.py::TestObservationInvariants`) and there is no config knob that can
  disable it. That is the sentence to publish; it is a much better hook than the ELO one it
  replaces.
- **Stack:** PyTorch, highway-env, Gymnasium, W&B. (The old card's PettingZoo /
  Stable-Baselines3 line may no longer be accurate — check `requirements.txt` before
  publishing a stack list.)
- **Verified:** 5 test files / 59 test functions on disk. README claims 61 tests; don't
  publish either number without running the suite.

### 4. dxenv — a diagnostic RLVR environment (new)

**The most detailed section here, because this is the deepest RL project on disk and the
only one whose engineering record is itself publishable material.** It is also the most
recently pushed repo on the account (2026-09-04).

- **Directory:** `../../healthcare_RL/` · **Repo:**
  `https://github.com/Manas-Ganti/healthcare-RL` — **public, verified.**
- **Status:** `design`. README's own words, in bold: **"Nothing here has been trained."**
  Phases 0–5 are complete as code and run end to end; the GPU paths (`VLLMBackend`,
  `sft.train_lora`, `TorchLoRAUpdater`) are written and lazily imported but have never
  executed. Gate B evaluates but does not pass, and **cannot yet** — see below.
- **What it is:** a multi-turn RL environment where an LLM agent plays diagnostician over
  synthetic patient records. Each episode it sees a filtered view of a patient, decides
  which tests are worth their cost, and terminates by reporting a probability distribution
  over 149 conditions — or by abstaining. It is scored once, at the end, against hidden
  ground truth. **The contribution is the environment, not the policy.**

**Publishing note, non-negotiable.** The README carries an explicit disclaimer that this is
a synthetic research environment, not a clinical decision tool, not validated against real
patients, and that no artifact from it may be presented as clinical guidance — severity
weights, likelihoods and contraindication rules are simulation parameters chosen for RL
dynamics, not clinical recommendations. **Carry that onto the page.** It is not optional
framing, and on a site that already has one healthcare project the distinction between the
two matters more, not less.

#### The hook — three candidates, all genuinely senior

Pick one for the card; the others are blog material.

1. **A computable Bayes-optimal ceiling that doubles as a reward-hacking detector.** The
   environment knows the best score achievable by perfect reasoning over the same evidence,
   so an agent that *beats* it has information it should not have, and training halts on a
   suspected leak (invariant I9). This is the one I'd put on the card — it is one sentence,
   it is unusual, and it inverts the normal relationship between a baseline and a policy.
2. **Twelve invariants, one test file each** (`tests/invariants/test_i1…test_i12`, all
   twelve present on disk), built because the generator leaks the diagnosis in about six
   places — and the record's *sparsity pattern* leaks it in a seventh. I4: every test
   returns a value for every patient, so "unavailable" carries no signal. I5: ordering a
   test can never produce positive reward under any shaping term. I7: terminal scoring uses
   a strictly proper rule (Brier), which rules out hedging mathematically. I12: the eval
   split is frozen and hash-verified, and training never reads it.
3. **The environment produces no reward at all.** `env.step()` returns trajectories; a
   separate reward engine scores them — which is what makes offline rescoring free. Import
   rules are enforced by a test that *parses the source*, so a violation is caught even
   inside a function: `reward/` never imports `policy/` or `train/`, `env/` never imports
   `reward/`. `env/bayes.py` takes the scoring rule as an **injected callable** so that
   `env/` can compute the ceiling without importing `reward/`, and there is still exactly
   one implementation of the rule.

#### Verified numbers, with provenance

| Number | Source |
|---|---|
| Gate A: 10,000 patients, 149 labels, majority-class rate 0.0381 | `runs/phase0/results.json` (committed) |
| Probe ladder — blank record 0.0072 bal. acc → vitals+complaint 0.2743 → vitals+all tests 0.7099; positive control with the label injected 0.9286 | `runs/phase0/results.json`, tabulated in `docs/design-notes.md` |
| **V − F = +0.267** (bar ≥ 0.08) and **T − V = +0.436** (bar ≥ 0.20) — both pass. "T − V is the size of the entire prize." | `docs/design-notes.md` |
| Phase 3 prompted baseline, 200 patients, k=8: prior −0.018 · vitals-only Bayes **+0.675** (the Gate B bar) · greedy Bayes +1.183 (5.76 tests) · `random_schema` −0.385, best@8 −0.044, group std **0.322** | `runs/phase3/prompted_baseline.json` (committed) + `docs/design-notes.md` |
| Grammar produced **100% parseable output over 1,600 generations** | `docs/design-notes.md` |
| λ = 0.004, calibrated from measured marginal value per cost unit (0.041 → 0.0062 → 0.0010), putting the optimum at 3–6 tests | `docs/design-notes.md` |
| Audit suite: all seven probes pass; counterfactual perturbation 200/200 after correction | `docs/design-notes.md` |
| `ruff` and `mypy --strict` clean; CI runs fast suite + lint + types per commit, corpus-wide nightly | README.md |
| 27 test files / 318 `def test_` on disk; README states "294 fast + 5 slow tests" | static count + README |

**On the test count:** as everywhere else in this brief, do not publish a `def test_` count
as a passing-test count. The `ruff`/`mypy --strict` clean claim and the "one test file per
invariant" structure are the publishable rigour signals — both are verifiable by looking at
the repo, which is the point.

#### The material that makes this worth a blog post rather than a card

`docs/design-notes.md` is the strongest single document in the entire portfolio. It is an
engineering record of **five occasions where a measurement lied and the author caught it**,
each with the correction and the reasoning. Per `WEBSITE_BLOG_PLAN.md`'s rule that a depth
post must be anchored to a result, this is the rare case where the *result being anchored
to is a methodological one* and the post can be written today, without a training run:

- **Gate A's first run reported T − V = −0.002 (chance).** That was the detector, not the
  environment — it ordinal-encoded categorical analytes ("an index into an unordered
  vocabulary is not a number") and handed 149 classes to gradient boosting on too few
  samples each. The Bayes posterior on the same data reached top-1 0.91 with tests, which is
  what identified the harness as the problem. **The encoding was fixed; no threshold was
  touched.** Thresholds were committed *before* the probe ran, and a test enforces that
  ordering from git history — "because that enforcement is the only thing that makes a gate
  a gate."
- **One Gate A criterion fails as literally written and was superseded rather than edited.**
  It required the blank probe to land near the majority-class rate while declaring
  *balanced* accuracy as the metric; those floors differ (0.0381 vs 1/149 = 0.0067), so it
  could never pass on its own metric. `gate_a.yaml` is left untouched, `gate_a2.yaml`
  records the correction, both verdicts are reported, and a test asserts the amendment moved
  no substantive threshold.
- **The de-leaking check the spec asked for does not work as written.** The literal reading
  — reasoning must not name the condition — rejected **19 of 20 clean traces** and would
  forbid the model from ever writing a differential, which is the entire content of
  diagnostic reasoning. Replaced with a counterfactual test (is the condition named because
  the teacher knew, or because the evidence ranked it?) across three checks of increasing
  strength: literal substring fires 252 findings on a privileged trace and 0 on a de-leaked
  one (the positive control — it *must* fire); the grounding filter 56 vs 0; the
  rank-matched ablation gap **+0.732 vs +0.036**.
- **And the obvious version of that ablation is wrong.** Comparing against a uniformly
  random condition reports a gap of +0.63 on a de-leaker that is label-blind *by
  construction* — because the true condition really is usually near the top. Drawing the
  null from the visible posterior holds rank fixed and the gap collapses to +0.036. "A
  check that fails on correct behaviour is a check that gets switched off."
- **Two bugs of the same shape:** `leak_strings` contained "mi" and "all", and substring
  matching fired them inside "com**mi**t" and "at **all**", rejecting three-quarters of a
  clean SFT set.
- **Two probes in the audit suite failed on first run, and both failures were the probe.**
  Counterfactual perturbation ranked candidates by an analyte's *mean* when Bayes moves mass
  by *likelihood at the observed value*; the blank-record baseline read −0.28 against an
  analytic floor of +0.001 because it truncated its report to a top-8. **"Every probe that
  could pass trivially carries a positive control. An audit suite that would not catch a
  real failure is worse than none, because it manufactures confidence."**

There is a second post in the **two ceilings** distinction: `hard_ceiling` (a perfectly
confident correct report) is sound on every realisation and safe to assert per episode and
halt on; `expected_ceiling` is the tight number worth reporting, but **a single lucky
rollout can exceed it**, because a proper scoring rule only guarantees truthful reporting
wins *on average*. Asserting it per episode would fire on luck, "and a detector that cries
wolf gets switched off" — so it is checked on running means instead.

And a third in **the shaping tension**: potential-based shaping with Φ = −H(posterior)
telescopes to total information gain, which is exactly what I5 prohibits paying for. They
reconcile only below `scale ≤ 0.0008`, at which point the contribution is under 0.004
against a diagnosis term spanning ±6. So the machinery is built and fully tested —
telescoping, closed-loop-zero, policy invariance on a brute-forced toy MDP — **and it ships
off**, with `validate_reward_config` raising by design if enabled at a meaningful scale.
The design notes flag this as "the open question most worth your attention."

#### Be careful how you frame Gate B

The honest reading, in the repo's own words: Gate B evaluates but **does not pass, and
cannot yet** — the subject row is a uniform grammar sampler with no policy behind it, which
clears the vitals-only bar on 1% of patients. Five of six criteria pass on it (spread,
calibration, headroom, schema validity); pass@k does not, because there is no policy, and
the checker says so explicitly rather than printing a bare FAIL. **Do not present Gate B as
passed or as pending-but-expected.** What that row does establish is worth stating, though:
the grammar parses 100% of the time and produces real within-group spread (0.322), which is
the precondition GRPO needs and the thing that would be missing if the schema
over-constrained the model.

#### Known gaps the README states, which the card must not contradict

Nothing trained. Gate B not evaluated against a model. `data/snomed_map.yaml` is empty, so
real Synthea output cannot be ingested yet. Comorbidity is declared in the curriculum but
unimplemented — the generator emits one condition per patient. Likelihood parameters are
invented: consistent and leak-free, but not drawn from published likelihood ratios.

### 5. AlignDistill — does alignment survive distillation? (new)

- **Directory:** `../../alignment-distillation/` · **Repo:**
  `https://github.com/Manas-Ganti/alignment-distillation-test` — public, verified. (The
  `-test` suffix looks like a scratch name; **ask Manas whether to link it or rename it
  first.** A URL ending in `-test` undercuts the entry.)
- **Status:** `design`. README: "Pipeline and evaluation harness built; training runs not
  yet executed, so `results/` is empty and the report is still a skeleton." Confirmed —
  `results/` is empty; `report/report.md` is a skeleton; `ckpts/` holds two empty dirs.
- **What it is:** five checkpoints across two model scales (SD3.5-Large 8B, SDXL 2.6B)
  measuring what a step-distilled student retains of its teacher's preference alignment, and
  whether **align→distill** beats **distill→align** at matched alignment-stage compute.
- **The hook:** the distillation data is generated *by the teacher being distilled* — that
  is the mechanism under test. If the aligned teacher's preferences aren't in the
  distillation signal, there is no channel through which alignment could transfer at all.
  M1/M4's alignment stages are identical in data, adapter config, batch and step count, and
  M2/M3's distillation stages likewise; that identity is what makes it an ordering question
  rather than a compute question.
- **Also worth surfacing:** "the deliverable is the filled matrix, not a particular
  conclusion" — an ATR near zero is a finding, not a failure.
- **Only 1 test file / 6 test functions.** Thinnest test suite in the portfolio; don't make
  rigour claims about this one.

### 6. Robust payload-transport navigation under terrain & dynamics shift (new)

- **Directory:** `../../robotics-rl-payload-transport/` · **Repo:**
  `https://github.com/Manas-Ganti/robotics-rl-payload-transport` — public, verified. Single
  commit, `results/` empty → **status `design`**.
- **What it is:** train a mobile robot to transport a variable-mass payload across
  parameterised sloped terrain, then measure how far the policy generalises to OOD terrain,
  friction and payload — against a classical **Nav2** baseline run through the *same*
  harness, grid, seeds and metric code.
- **The hook:** the train/OOD split is **asserted at config load**
  (`env/config.py::assert_no_train_ood_overlap`); touching endpoints count as overlap and a
  contaminated grid cannot run. Paired with it: every episode passes an A* check *with
  robot-radius clearance* before spawn, and budget exhaustion raises rather than falling
  back to something unsolvable.
- **A detail worth a line of copy:** payload mass replaces the usual gravity randomisation,
  because a robot carrying an unknown load is a real deployment condition and a robot on a
  different planet is not — and the prohibition is enforced by a config-tree walk that
  rejects any gravity-randomisation key.
- **Stack:** check `requirements.txt`; the README implies a physics sim + Nav2 + W&B +
  Docker. 3 test files / 112 test functions on disk.

### 7. DocRAG-10K — grounded QA over SEC filings (new)

- **Directory:** `../../multimodal-doc-ingestion/` · **Repo: none — no git repo in the
  directory at all.** `repo: null`, and do not link anything.
- **Status:** `design`. README's own header: "**Status: Week 1 of 6.** … there are no
  results yet — `results/` is empty and the hero table below is a placeholder, not a
  claim." Confirmed on disk: `results/` holds only `.gitkeep`.
- **The hook, and it is the best one in the portfolio for a "how I work" story:** the
  project was designed around charts — a VLM captioning pass and a headline of *"VLM
  captions lifted chart accuracy by X points."* **Measuring that premise against the real
  corpus on day 1 killed it.** The median 10-K contains 2 images and 123 tables; MSFT and
  AMZN contain zero images; and the one chart every 10-K must carry prints its own values in
  a table directly beneath it. So the multimodal axis moved from charts to tables, and the
  hero comparison became *does a VLM reading the picture of a table beat parsing that table
  into markup?* — with flat tables kept as a **control**, because a lift in both would only
  mean the VLM added searchable text.
  `source:` README.md; decision record at `notes/decisions/001-multimodal-pivot.md`.
- **Corpus fact (safe to publish):** 45 10-Ks, 15 companies, FY2021–23, frozen in
  `data/manifest.json`.

### 8. Multi-Room MiniGrid (new, weakest of the research set)

- **Directory:** `../../multiroom-minigrid/` · **No git repo.** `repo: null`.
- **Status:** `design`, arguably `training` — there is one PPO checkpoint on disk
  (`checkpoints/ppo_keys1_seed0_1786126676/final.pt`, 2026-08-07) but **no results beyond
  two environment figures** (`results/layouts.png`, `results/observation_keys3.png`).
- **The hook:** multi-key doors are custom, not native MiniGrid — `toggle` *consumes* the
  carried key and increments a counter, and the door opens only at `required_keys`. Combined
  with MiniGrid's single-item carry limit, a 3-key door costs three separate fetch trips;
  removing the carry limit would collapse room 3 into "pick up three things, walk to a door".
  The 7×7 egocentric view is deliberately smaller than a 9×9 room, so the agent cannot see a
  room at once and must remember key locations.
- **Publishable verified number:** optimal step counts (17.8 / 57.5 / 115.4) are means over
  30 seeds of the scripted BFS solver in `tests/test_env.py`, which also asserts every config
  is solvable inside its step budget. That's a real measured number with a named source.
- **My take:** without a repo and without training results, this adds breadth but not proof.
  Recommend holding it until it has either.

### 9–10. jobsearch-agent and resume-tailor (tools, not research)

- **jobsearch-agent** — `../../jobsearch-agent/`, repo
  `https://github.com/Manas-Ganti/jobsearch-agent`, public, verified. Fetches ~80 job boards
  daily and funnels **9,700 postings → 15 LLM calls** through regex filtering, sponsorship
  checks and embedding ranking; self-hosted open models only, nothing leaves the machine.
  The funnel diagram in the README is the whole design and it is genuinely good systems
  thinking. 7 test files / 70 test functions.
- **resume-tailor** — `../../resume-tailor-agent/`, **no git repo**, `repo: null`. Tailors a
  resume from a fixed fact base and may never generate a new fact; every bullet carries the
  `fact_id` it came from, checked mechanically in Stage 5 with no LLM involved, and a resume
  with any ungrounded claim fails and is never rendered. The README documents a real catch:
  a local 7B model invented a "LLM APIs" skill line and filed a project bullet under a
  company heading; nothing was written to disk. 14 test files / 237 test functions.
- **Both of these are about Manas's own job search.** Publishing them is a judgement call
  about what he wants a hiring manager to see, not a technical one. **Ask him.** If they do
  go up, jobsearch-agent's funnel and resume-tailor's mechanical grounding check are the
  parts worth showing — both are the same instinct as the proof rule this whole site runs on.

---

## What I'd actually publish

Ten cards would dilute the page. The proof rule is what makes this site persuasive, and a
page of nine "no result yet" cards inverts the effect it's meant to have.

**Recommended: six.** Clinical Dashboard (shipped, with the eval harness as the headline),
Visual Reasoning RLVR (the only project with a real research result — this should lead),
**dxenv (this should sit second)**, PPO-vs-GRPO, payload transport, and DocRAG-10K. That's
one shipped system, one project with results, and four environments where the *hook* is
genuinely senior-grade and the status line is honest about the rest.

**On dxenv's placement:** it is untrained, so by the proof rule it gets no result and a
`design` status — but it is the deepest environment in the portfolio and the only unrun
project carrying a full set of *measured* numbers anyway (Gate A's probe ladder, the Phase 3
baseline table, the λ calibration, the audit suite). "Nothing has been trained, and here is
the measured evidence that the environment is sound" is a much stronger card than the other
unrun projects can offer, and it is exactly the posture the proof rule is designed to
reward. Its twelve-invariants hook also pairs with the Clinical Dashboard's typed-contract
hook to make the healthcare pair read as one line of thinking rather than two overlapping
projects — worth ordering them adjacently on the page.

**Hold:** multiroom-minigrid (no repo, no results), alignment-distillation (thin tests, and
a repo URL ending in `-test`), and the two job-search tools (ask Manas first).

If Manas wants the page shorter still, the three that carry the most weight are Visual
Reasoning RLVR, Clinical Dashboard, and dxenv.

---

## Open questions for Manas — ask before publishing

1. Can the final held-out eval numbers from `resume-visual-reasoning-rlvr.md` go on the
   site, given they aren't in a committed `results/` file yet?
2. Can `docs/trajectory_demo.gif` be copied into the site as the first real project visual?
3. Should `alignment-distillation-test` be renamed before it's linked?
4. Is `Maximisation-Bias-testing` the code for the Fragility of Maximisation paper — and
   should `code:` be filled in on that research entry?
5. Do the two job-search tools belong on a public portfolio?
6. Should the home page surface featured project cards? The machinery (`featuredProjects`,
   `ProjectCard compact`) exists and is currently unused.
