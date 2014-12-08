---
layout: page
title: Adam Altmejd
slug: adam-altmejd
lead: "PhD. Student"
description: "The homepage of Adam Altmejd, PhD. student in economics at Stockholm School of Economics"
---

Hi! My name is Adam Altmejd and I am a PhD. student in Economics at Stockholm School of Economics.

<i class="fa fa-quote-left fa-2x pull-left"></i>
Use a few styles together and you'll have easy pull quotes or a great introductory article icon.

<div id="home">
  <h1>Posts</h1>
  <ul class="posts">
  {% for post in site.posts %}
    <li>
      <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ul>
  <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>
</div>
