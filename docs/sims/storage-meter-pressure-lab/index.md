---
title: Storage Meter Pressure Lab
description: Set the size, backup age and unsynced age of an LRS-Lite browser database, predict which pressure level (Normal, Offer, Reclaim or Protect) the storage meter triggers, then see which slices the library discards first.
image: /sims/storage-meter-pressure-lab/storage-meter-pressure-lab.png
og:image: /sims/storage-meter-pressure-lab/storage-meter-pressure-lab.png
twitter:image: /sims/storage-meter-pressure-lab/storage-meter-pressure-lab.png
social:
   cards: false
quality_score: 100
---

# Storage Meter Pressure Lab

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Storage Meter Pressure Lab Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

LRS-Lite keeps each student's record in an IndexedDB database under a self-imposed **10 MB
budget**. The design's **storage meter** shows how full the local record is and how safe it
is, and it drives four **pressure levels**:

| Level | Condition | Behavior |
|-------|-----------|----------|
| Normal | below 60% | Nothing beyond the meter |
| Offer | 60% or more, or 7 days since the last backup, or unsynced events older than 24 hours | A backup card appears |
| Reclaim | 80% or more | Drop mirrored segments from other devices first, then this device's covered segments |
| Protect | 95% or more with unsynced data | Force all sims into summary mode and fold the oldest unsynced statements into summaries (`truncated_statements: N`) |

Summaries and evidence are never pruned, because they are the student's state. This device's
segments can only be dropped once they are synced **and** covered by a verified checkpoint.

The lab hides the level until you predict it. Set the sliders, pick **Normal**, **Offer**,
**Reclaim** or **Protect**, and the lab reveals the level, the rule that fired, and an "after"
bar showing which slices shrink and in what order. Hover a slice or a legend entry to see
whether it may be pruned. **Advance 10 days** grows the database at the design's heavy-student
rate for the chosen emission mode (0.37 MB per semester in Summary mode, 3.6 MB in Full mode).
**Keep my record on this device** simulates a persistent storage request; it protects against
eviction but does not change the level.

The meter, the slices and the levels are a design that has not been built. The split of the
total into slices and the growth rates are illustrative.

**Learning objective:** The learner will predict which pressure level a given storage state
triggers and which data the library discards first.

**Bloom's taxonomy level:** Apply (verb: *predict*)

## How to Use

1. At the defaults (0.34 MB, backup 2 days ago, nothing unsynced), predict the level. Check
   the rule that fired.
2. Press **Advance 10 days** once and predict again. Why does the level change although the
   database barely grew?
3. Drag **Database size** to 8.5 MB and predict. Read the discard order in the "after" bar.
4. Now drag it to 9.7 MB with **Oldest unsynced** at 0 h, predict, then set unsynced to 30 h
   and predict again. What does the "with unsynced data" condition add?
5. Choose each persistence scenario and press **Keep my record on this device**. Does the
   level change?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/storage-meter-pressure-lab/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- IndexedDB storage and the five object stores (Chapter 22)
- The 10 MB budget and its slices (Chapter 22)
- The difference between syncing and a verified backup (Chapter 23 preview)

### Activities

1. **Predict five states (6 min):** Work through the five How to Use steps, predicting before
   each reveal. Aim for five correct predictions in a row.
2. **Order the discards (4 min):** Without the lab, write the order in which Reclaim and
   Protect free space and name the one slice that is never pruned. Check with the lab.
3. **Summary versus Full (3 min):** From the defaults, count how many times you must press
   Advance 10 days in each mode to reach Offer by size alone (60%). Explain what this says
   about a summary-mode pilot.
4. **Discuss (2 min):** Why does a granted persistence request not change the pressure level?

### Assessment

- Given a size, a backup age and an unsynced age, the learner names the level and the rule
  that decides it, including when a higher level overrides a lower one.
- The learner states that mirrored segments go first, covered local segments second, and
  summaries never.
- The learner explains that Protect needs both 95% fullness and unsynced data.

## References

1. [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - MDN Web
   Docs. The browser database LRS-Lite uses for the local record.
2. [Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) -
   MDN Web Docs. How browsers limit and evict an origin's data.
3. [StorageManager: persist() method](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) -
   MDN Web Docs. The persistent storage request behind "Keep my record on this device".
4. [p5.js reference: createSlider](https://p5js.org/reference/p5/createSlider/) - p5.js. The
   control used for the three storage sliders.
