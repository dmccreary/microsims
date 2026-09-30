---
title: Capacity and Cost Explorer
description: Estimate daily statements and storage from the number of active students, then judge whether the full LRS's single-server tier or distributed tier fits, using the design's capacity assumptions and the draft hardware specification's cost ranges.
image: /sims/capacity-cost-explorer/capacity-cost-explorer.png
og:image: /sims/capacity-cost-explorer/capacity-cost-explorer.png
twitter:image: /sims/capacity-cost-explorer/capacity-cost-explorer.png
social:
   cards: false
quality_score: 100
---

# Capacity and Cost Explorer

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Capacity and Cost Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Before anyone buys hardware for a Learning Record Store, someone has to turn "how many students?"
into rates, storage and money. This explorer applies the design's **capacity model**, the
assumptions quoted in Chapter 21:

- about 0.1 statements per second per active student,
- a duty cycle of about 40 percent of peak, over about 10 active hours a day,
- about 1.5 KB per statement, and a ClickHouse columnar ratio of about 10.

The **left chart** shows the resulting statements per day, raw JSON per day and ClickHouse
storage per day. The **right chart** shows the monthly cost ranges of the two tiers in the
companion hardware specification (a draft dated 2026-07-15): a single server sized for 1,000
statements per second (about $300 to $800 a month for dedicated hosting or $1,000 to $2,500
rented, or $8,000 to $15,000 upfront to buy), and a distributed deployment sized for 10,000
statements per second (about $10,300 a month on demand, toward $6,500 to $7,500 with reserved
pricing). The dashed outline marks the tier whose stated limits contain your estimated rate, and
the message names it and warns as the load nears the 3,000 to 5,000 statements per second band
where the specification advises moving to the distributed design.

**Include Neo4j license placeholder** adds the specification's rough $3,000 to $8,000 a month
for a clustered Neo4j license to the distributed tier. **Show burst (5x)** reports the burst rate;
the design absorbs bursts in the queue, so the sustained rate decides the tier. Every dollar
figure is a planning-level estimate from public cloud pricing, not a quote, and excludes
engineering time and support. Hover a bar to see its arithmetic and source.

**Learning objective:** The learner will judge which deployment tier fits a school or district by
estimating daily statements and storage from the number of active students and comparing the
result with the design's two published cost tiers.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. At the default 3,000 students, check the chapter's worked example: 300 statements per second,
   4.32 million statements and about 6.5 GB of raw JSON per day, 0.65 GB in ClickHouse.
2. Drag **Active students at peak** up (the scale is logarithmic) and watch the dashed outline
   move from the single-server tier to the distributed tier. Note where the warning appears.
3. Change **Duty cycle**. Which numbers change, and which do not?
4. Check **Show burst (5x)** and read how the design treats bursts.
5. Check **Include Neo4j license placeholder** and compare the distributed tier's total with the
   single-server tier.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/capacity-cost-explorer/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15-20 minutes

### Prerequisites

- The capacity model and cost model sections of Chapter 21
- Converting a per-second rate into a per-day total
- The difference between a sustained rate and a burst

### Activities

1. **Size three deployments (6 min):** For one school of 800 active students, a district of 8,000
   and a state consortium of 80,000, record the sustained rate, statements per day, raw storage per
   day and the tier the explorer names.
2. **Find the boundary (4 min):** Find the student count where the warning first appears and the
   count where the distributed tier fits. Explain why the move is advised before the single server
   is literally full.
3. **Judge and defend (7 min):** For the district of 8,000, write a recommendation of three to
   four sentences naming a tier and a pricing option. Include one risk the cost range does not
   capture, such as the single server being a single point of failure or the unknown Neo4j license.

### Assessment

- The learner computes rate, daily statements and daily storage from a student count with the
  design's assumptions and matches the explorer's numbers.
- The learner names the tier that fits and justifies it against the tier's stated limits and the
  3,000 to 5,000 statements per second advice.
- The learner treats every cost as a planning estimate and names at least one excluded cost or
  open question.

## References

1. [Capacity planning](https://en.wikipedia.org/wiki/Capacity_planning) - Wikipedia. Turning expected load into resource requirements.
2. [Total cost of ownership](https://en.wikipedia.org/wiki/Total_cost_of_ownership) - Wikipedia. Why purchase, hosting and hidden costs must be compared together.
3. [High availability](https://en.wikipedia.org/wiki/High_availability) - Wikipedia. The redundancy the single-server tier gives up.
4. [Chart.js floating bars](https://www.chartjs.org/docs/latest/samples/bar/floating.html) - Chart.js documentation. The range-bar technique used for the cost chart.
5. [Chart.js documentation](https://www.chartjs.org/docs/latest/) - Chart.js. The charting library used by this MicroSim.
