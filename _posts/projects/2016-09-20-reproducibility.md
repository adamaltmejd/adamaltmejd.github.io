---
layout: project
title: "Reproducibility"
project: Reproducibility
date: 2018-09-11 12:00:03
categories: projects
author: Adam Altmejd
---

In a series of papers, we replicate lab experiments in the social sciences. We also study how accurately replicability can be predicted, by peer scientists in prediction markets, and also by machine learning algorithms.

## Replications
In "Evaluating Replicability of Laboratory Experiments in Economics" we replicated 18 studies in experimental economics published in the American Economic Review and the Quarterly Journal of Economics in 2011-2014. We follow a carefully designed procedure and find a significant effect in the right direction in 11 of the experiments.

"Evaluating the replicability of social science experiments in Nature and Science between 2010 and 2015" is our second replication attempt, where we study 21 high impact experiments published in the journals Nature and Science during 2010-2015. This time we use even larger sample sizes, with up to five times as many subjects as the original experiments. Of the 21 experiments, 13 replicate. Average effect sizes are about half the size of the original studies. Both false positives (where there is no true effect), and true positives contribute to inflated effect sizes. For true positives, the replication effect size is on average 71%.

## Predictability
Replications are very expensive, the work is hard and often not very rewarding. We therefore also study how well replication can be predicted. If a predictive mechanism is accurate enough, we can use it to evaluate which studies to actually replicate and which results we can trust, without having to necessarily conduct replications. A journal could use this information to decide if e.g. a paper needs to be replicated before it can be published.

Both replication studies included prediction markets, where experienced psychologists and experimental economists where given the opportunity to bet on the outcome of our replications before they were conducted. The aggregated beliefs produced by the market are very accurate, as explained in e.g. [The Atlantic](https://www.theatlantic.com/science/archive/2018/08/scientists-can-collectively-sense-which-psychology-studies-are-weak/568630/).

Prediction markets can be used to validate whole departments just as well as individual research papers. In Munafo et. al. (2015) we study how the outcome of the 2014 Research Excellence Framework (REF) evaluation of UK Chemistry departments could be predicted in a market where the traders were faculty members at the participating schools. We show that prediction markets can be a useful tool to complement costly large-scale quality evaluations.

While cheaper than running actual replications, markets require many traders and a large transaction volume to function efficiently. Using market makers to clear trades can end up being quite costly. In comparison, using a statistical model is almost free. In "Predicting Replication" we use machine learning to predict replication outcomes and explore which experimental features drive replicability. The model's [pre-registered](https://osf.io/w2y96/) predictions of the replicability of Science and Nature papers is only slightly worse than those produced by the prediction market.