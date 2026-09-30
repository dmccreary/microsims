---
title: Two-Browser Convergence Lab
description: Run the Chromebook and home-laptop scenario under a last-writer-wins merge and an append-only event-set merge, and identify which of the seven attempts each approach loses.
image: /sims/two-browser-convergence-lab/two-browser-convergence-lab.png
og:image: /sims/two-browser-convergence-lab/two-browser-convergence-lab.png
twitter:image: /sims/two-browser-convergence-lab/two-browser-convergence-lab.png
social:
   cards: false
quality_score: 100
---

# Two-Browser Convergence Lab

<iframe src="main.html" height="662px" width="100%" scrolling="no"></iframe>

[Run the Two-Browser Convergence Lab Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

LRS-Lite keeps a student's record in each browser they use and syncs those copies through an
S3 prefix with no server. The chapter's motivating scenario: on **Monday morning** the
Chromebook (`c7`) records three answers on one concept, two right, but the Wi-Fi drops before
it syncs. That **evening** the home laptop (`f2`) records four answers, all right, and syncs.
On **Tuesday** the Chromebook reconnects.

The lab runs that scenario under two merge rules:

- **Event set (union):** each device seals its answers into an immutable segment, pushes the
  segments it has not uploaded, then pulls every other device's segments past its version
  vector. Merging is set union by statement `id`, sorted by the Hybrid Logical Clock (HLC).
  Every replica ends with all seven attempts and the same summary.
- **Last writer wins:** each device keeps a whole-record snapshot stamped with its newest HLC.
  A sync pushes the snapshot only if it is newer than the one in S3, then pulls the S3
  snapshot if that is newer and replaces the local record with it. One device's attempts are
  silently discarded; they are shown as struck-through ghost tiles.

Each tile shows an HLC value, a device ID and a check or cross for the answer; hover a tile
for its `id`, `device_id`, `seq` and `hlc`. The HLC values are illustrative, chosen so the
laptop's answers sort after the Chromebook's. After both devices have synced, a banner says
whether the two summaries are identical and how many of the seven attempts each counts.

**Learning objective:** The learner will compare a last-writer-wins merge with an append-only
event-set merge by running the Chromebook and laptop scenario and identifying which attempts
each approach loses.

**Bloom's taxonomy level:** Analyze (verb: *compare*)

## How to Use

1. With **Event set (union)** selected, press **Chromebook: answer 3 (2 right)**, then tick
   **Chromebook offline**.
2. Press **Laptop: answer 4 (4 right)** and **Sync laptop**. Watch the segment move to S3.
3. Untick **Chromebook offline** and press **Sync Chromebook**: it pushes its segment and pulls
   the laptop's. Sync the laptop again and read the banner.
4. Switch the merge rule to **Last writer wins** (the lab resets) and run the same steps.
   Which attempts does the banner list as lost for good?
5. Try a different order, such as syncing the Chromebook before the laptop answers. Does the
   union ever lose an attempt? Does last writer wins ever keep all seven?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/two-browser-convergence-lab/main.html"
        height="662px"
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

- Event identity: statement ID, device sequence number and Hybrid Logical Clock (Chapter 23)
- Why attempt order matters to a mastery estimate (Chapter 18)

### Activities

1. **Run the scenario twice (6 min):** Follow How to Use steps 1-4. Record each device's
   attempt and success counts after every sync, under each rule.
2. **Identify the losses (4 min):** For last writer wins, list the HLC values of the lost
   attempts and explain why the laptop's snapshot won.
3. **Vary the order (4 min):** Find a sync order under last writer wins in which the laptop's
   four attempts are lost instead of the Chromebook's three.
4. **Explain convergence (3 min):** In two sentences, explain why set union converges
   regardless of order, using the words "commutative" and "idempotent".

### Assessment

- The learner states that the event-set merge keeps all seven attempts on both devices, and
  that last writer wins keeps only one device's record.
- Given a sync order, the learner predicts which attempts last writer wins discards.
- The learner explains the roles of the statement ID, the version vector and the HLC in the
  union merge.

## References

1. [Conflict-free replicated data type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) -
   Wikipedia. Grow-only sets and why set union converges.
2. [Eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency) - Wikipedia. The
   convergence property the event-set merge provides.
3. [Version vector](https://en.wikipedia.org/wiki/Version_vector) - Wikipedia. How each replica
   tracks which segments it has ingested.
4. [Lamport timestamp](https://en.wikipedia.org/wiki/Lamport_timestamp) - Wikipedia. The logical
   clock idea that the Hybrid Logical Clock extends.
5. [p5.js reference: createRadio](https://p5js.org/reference/p5/createRadio/) - p5.js. The
   control used for the merge rule.
