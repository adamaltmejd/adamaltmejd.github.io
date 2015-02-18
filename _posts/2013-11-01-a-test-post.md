---
layout: post
title:  "Code highlighting in R"
subtitle: "In this post I look at some examples of code highlighting and how it works for different types of R code and also other programming languages. I also test if i can use markdown in the metadata of this subtitle."
date:   2013-11-01 11:47:00
categories: test
---

> This is a nice little test post.

I give this plugin two :+1:!

{% highlight r %}
set.seed(12345)  # set RNG seed for reproducability
runExperiment <- function(obs) {
	experiment <- rbinom(obs,1,0.5)
	average = cumsum(experiment) / seq_along(experiment)
	df <- data.frame(x = 1:obs, y = average)
	print(
		ggplot(df, aes(x,y)) +
		geom_point() +
		ylim(0,1) + xlim(0,obs) + labs(x='', y='', title=paste('Obs:', obs, ' Average:', average[obs]))
	)
}
{% endhighlight %}
