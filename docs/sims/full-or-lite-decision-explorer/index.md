---
title: Full or Lite Decision Explorer
description: Describe a school by roster size, budget and requirements, see which of the Lite, single-server and Full LRS tiers each requirement rules out, and recommend the cheapest tier that still fits.
image: /sims/full-or-lite-decision-explorer/full-or-lite-decision-explorer.png
og:image: /sims/full-or-lite-decision-explorer/full-or-lite-decision-explorer.png
twitter:image: /sims/full-or-lite-decision-explorer/full-or-lite-decision-explorer.png
social:
   cards: false
quality_score: 100
---

# Full or Lite Decision Explorer

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Full or Lite Decision Explorer Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The book describes three ways to run a learning record store: **LRS-Lite** (no always-on
servers, one course of up to about 150 students, an estimated one to five dollars a month), a
**single-server** tier of the full LRS (about 10,000 concurrent active students on one host,
$300 to $2,500 a month) and the **Full** distributed LRS (districts, about $10,300 a month on
demand). The choice turns on what each tier gives up, not only on price:

| Question | Lite | Full or single server |
|---|---|---|
| Always-on servers acceptable? | No servers | Yes, and staff to run them |
| Scale | One course, about 150 students | Many classes, districts |
| Freshness | As of each student's last sync | Server-side, near real time |
| Evidence integrity | Self-reported by the student's browser | Server-authenticated ingestion |
| Cross-class analytics | On demand only, or not supported | Native |
| Push alerts | Scheduled function only | Native |

Describe a school with the controls. Each tier card shows its cost and scale estimates and a
red label for every requirement it fails; a card with no unmet requirement is highlighted, and
the banner recommends the cheapest one. **Show reasoning** lists each requirement and the tiers
it rules out. Hover a card for the source of each figure. All figures are design or
planning-level estimates, and the rule set is a teaching heuristic derived from the trade-off
table, not an official sizing tool.

**Learning objective:** The learner will recommend Full, single-server or Lite for a described
school by weighing scale, freshness, evidence integrity and budget, and will justify the
recommendation against the trade-off table.

**Bloom's taxonomy level:** Evaluate (verb: *recommend*)

## How to Use

1. At the defaults (30 students, $50 a month, nothing checked) the banner recommends Lite.
   Press **Show reasoning** to see why the other two tiers are ruled out.
2. Tick **Grades depend on evidence**. Which tier drops out, and what would it take for another
   tier to fit?
3. Tick **Staff to run servers** and raise the budget until a tier is recommended.
4. Drag **Students** past 150 and then past 10,000. Watch each scale limit rule a tier out.
5. For each scenario below, set the controls, read the recommendation, and write one sentence
   of justification that cites a row of the trade-off table.

Both sliders use a logarithmic scale, so small values are easy to set.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/full-or-lite-decision-explorer/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- The full LRS capacity and cost model (Chapter 21)
- LRS-Lite sync and browser-side dashboards (Chapters 22 and 23)

### Activities

1. **Scenarios (10 min):** Recommend a tier for each school and justify it against the
   table.

    - A single teacher piloting formative sims with 28 students, no IT staff, $20 a month.
    - A high school of 1,200 students whose course grades use MicroSim evidence, with one
      systems administrator and $1,500 a month.
    - A district of 18,000 students that needs real-time at-risk alerts, with an operations
      team and $12,000 a month.
2. **Break the recommendation (5 min):** For the first school, find the single change that
   forces a move away from Lite. Name the row of the trade-off table it corresponds to.
3. **Critique the heuristic (5 min):** Name one factor the rule set ignores (for example high
   availability, migration effort or the Neo4j license) and explain how it could change a
   recommendation.

### Assessment

- The learner recommends a tier for a described school and justifies it with at least two rows
  of the trade-off table.
- The learner identifies which requirement rules out Lite (evidence integrity, cross-class
  analytics, real-time alerts or scale) in a given case.
- The learner explains why the figures are planning estimates and the rule set is a heuristic.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The statement
   format both tiers store, and the role of a learning record store.
2. [xAPI specification](https://github.com/adlnet/xAPI-Spec) - Advanced Distributed Learning
   (ADL) on GitHub. What an LRS must accept and store.
3. [High availability](https://en.wikipedia.org/wiki/High_availability) - Wikipedia. What the
   single-server tier gives up compared with the distributed tier.
4. [Serverless computing](https://en.wikipedia.org/wiki/Serverless_computing) - Wikipedia. The
   pay-per-use model behind LRS-Lite's cost estimate.
5. [p5.js reference: createCheckbox](https://p5js.org/reference/p5/createCheckbox/) - p5.js.
   The control used for the four requirements.
