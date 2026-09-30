---
title: MicroSims Milestones Timeline
description: A zoomable timeline of the milestones from the first MicroSims 1.0 commit in 2023 to the start of the MicroSims 2.0 rewrite in 2026, grouped by book, paper, tools and Anthropic announcements.
image: /sims/microsims-milestones-timeline/microsims-milestones-timeline.png
og:image: /sims/microsims-milestones-timeline/microsims-milestones-timeline.png
twitter:image: /sims/microsims-milestones-timeline/microsims-milestones-timeline.png
social:
   cards: false
quality_score: 100
---

# MicroSims Milestones Timeline

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the MicroSims Milestones Timeline Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This timeline places eleven milestones of the MicroSims project in order, from the first commit
of MicroSims 1.0 in November 2023 to the day the original book was tagged `v1.0` and the
MicroSims 2.0 rewrite began in September 2026. Each milestone belongs to one of four themes:

| Date | Milestone | Theme |
|---|---|---|
| November 4, 2023 | The term "MicroSim" is coined ([Medium article](https://dmccreary.medium.com/micro-simulations-for-education-6989eae8d85d)) | Book |
| November 21, 2023 | First commit of MicroSims 1.0 | Book |
| December 3, 2024 | First commit of the intelligent-textbooks project | Book |
| February 24, 2025 | Anthropic introduces Claude Code | Anthropic Announcements |
| March 17, 2025 | First use of Claude Code | Tools |
| October 2025 | First arXiv-style paper draft (v0.02) | Paper |
| October 16, 2025 | Anthropic introduces Agent Skills | Anthropic Announcements |
| November 2025 | Paper draft v0.06 | Paper |
| December 10, 2025 | First MicroSim generator skill | Tools |
| September 26, 2026 | Skill for adding xAPI events to a MicroSim (v0.2) | Tools |
| September 30, 2026 | Tag v1.0 marks the original book; the rewrite begins | Book |

The spacing of the events is part of the lesson: almost a year separates the first commit of MicroSims 1.0
from the next event, most of the tooling milestones fall within 2025, and the last two milestones fall within four days of each other.
Zooming in on September 2026 separates them.

**Learning objective:** The learner will identify the major milestones between MicroSims 1.0
and MicroSims 2.0 and order them in time.

**Bloom's taxonomy level:** Remember (verb: *identify*)

## How to Use

1. Click any milestone box to read a two-sentence description in the panel below the
   timeline, including its position in the sequence ("milestone 10 of 11").
2. Drag the timeline left or right to pan.
3. To zoom, click a milestone and press **+ Zoom** (zooming centers on the selected
   milestone) or **− Zoom**. **Fit all** shows every milestone again.
4. Use **Group by** to switch between one row per theme (Book, Paper, Tools, Anthropic Announcements) and a single
   track.
5. When the timeline is opened on its own with the fullscreen button, the mouse wheel also
   zooms the time axis. Inside a textbook page the wheel scrolls the page instead.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsims-milestones-timeline/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10 minutes

### Prerequisites

- The MicroSims 1.0 and MicroSims 2.0 section of Chapter 1

### Activities

1. **Scan (3 min):** With **Fit all** and grouping by theme, name the theme that has the
   earliest milestone and the theme with the most recent one.
2. **Zoom (3 min):** Click the xAPI skill milestone and zoom in until the two September
   2026 events separate. Write them in order with their dates.
3. **Order from memory (4 min):** Close the timeline and write the eleven milestones in order.
   Reopen it, switch to **Single track**, and check your order.

### Assessment

- The learner lists the eleven milestones in the correct chronological order.
- The learner identifies which milestone marks the end of MicroSims 1.0 as the current book
  (the `v1.0` tag) and which milestone introduced instrumentation (the xAPI skill).

## References

1. [vis-timeline documentation](https://visjs.github.io/vis-timeline/docs/timeline/) -
   vis.js. The library used to draw, zoom and pan the timeline.
2. [Git](https://en.wikipedia.org/wiki/Git) - Wikipedia. The version control system whose
   tags, such as `v1.0`, preserve earlier versions of a project.
3. [arXiv](https://en.wikipedia.org/wiki/ArXiv) - Wikipedia. The open preprint server whose
   paper format the project's research drafts follow.
4. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI
   standard behind the skill for adding xAPI events to a MicroSim.
