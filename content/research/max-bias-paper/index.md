---
title: "The Fragility of Maximisation"
finding: "
Classical Temporal-Difference methods tend to break down under function approximation, non-stationarity, and distribution shift. Chief among the culprits is the overestimation bias induced by the maximization operator. I dived deep into this and tested it with Tabular RL, Deep RL and at the LLM level."
# One of: in-preparation | preprint | under-review | accepted
# The schema will fail the build if you claim a status without its evidence:
#   accepted / under-review  require `venue`
#   preprint                 requires `arxiv`
# Never move a paper down this list before the move has happened in the real world.
status: in-preparation
# venue: NeurIPS 2026
authors:
  - Manas Ganti
# arxiv: https://arxiv.org/abs/...
# code: https://github.com/...
# figure:
#   src: ./main-result.png
#   alt: "[Describe the axes and what the reader should see.]"
#   caption: "[Seeds and error bars. One strong figure beats five weak ones.]"
order: 0
draft: true
---

# Abstract
Classic Temporal Difference techniques are often fragile under function approximation, non-stationarity, and distribution shifts. In particular, maximization-induced overestimation bias is not just a nuisance; it is a mechanism that can amplify
the mismatch between learned value estimates and changing environments. The same structural issues scale to large language
models, where larger capacity often does not translate to better performance. Biases acquired through training can still persist and are often confidently expressed, contradicting the idea that larger capacities support better out-of-distribution generalization. This paper introduces a unified two-metric framework for measuring such failures, Normalized Adaptation Latency and Overestimation Magnitude. We evaluate these metrics across three settings: (i) Tabular reinforcement learning methods in non-stationary grid world environments, (ii) Deep reinforcement learning methods with function approximation under continuous stationarity shifts, and (iii) Large Language model post-training under format-shifted verifiable rewards. Across these settings, we investigate whether a common failure signature emerges and whether it is a fundamental property of the max operator that persists across scales, architectures, and domains.
