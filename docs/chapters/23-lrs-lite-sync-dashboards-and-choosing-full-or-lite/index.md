---
title: "LRS-Lite: Sync, Dashboards and Choosing Full or Lite"
description: Explains how LRS-Lite keeps several browsers consistent through object storage, how dashboards run in the browser, and how to choose and migrate between Lite and the full LRS.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:36:25
version: 1.10
---

# LRS-Lite: Sync, Dashboards and Choosing Full or Lite

## Summary

Covers multi-device sync and backup for LRS-Lite, browser-side dashboards, and how to choose between the full LRS and LRS-Lite and migrate between them.

Students learn event identity, clocks, sync cycles, convergence, and what compaction does to predictive fidelity. After it, they can recommend Full or Lite for a given school and plan the move.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Event Identity | 10 |
| Device Sequence Number | 5 |
| Hybrid Logical Clock | 4 |
| Local Summary Vertex | 3 |
| Evidence List | 1 |
| Object Storage Sync | 4 |
| Sync Cycle | 3 |
| Convergent Sync | 2 |
| Multi-Device Backup | 1 |
| Browser-Side Dashboard | 1 |
| Compact Versus Full Fidelity | 3 |
| Information Loss | 1 |
| Full Versus Lite Decision | 2 |
| Lite to Full Migration | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)
- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)
- [Chapter 21: The Full LRS: Dashboards, Operations and Compliance](../21-the-full-lrs-dashboards-operations-and-compliance/index.md)
- [Chapter 22: LRS-Lite: Compact Summaries and Browser Storage](../22-lrs-lite-compact-summaries-and-browser-storage/index.md)

---

## Welcome

!!! mascot-welcome "One record, many browsers"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A student who switches from a school Chromebook to a home laptop should not lose a single answer, and you are about to learn how a design with no server keeps that promise. By the end you can also recommend Full or Lite for a real school and plan the move between them. Let's bounce it around!

The previous chapter left each student with a small, compressed record in one browser. That record is fragile: browsers do not share storage, they may evict it, and a school may wipe a shared Chromebook. This chapter adds the three pieces that turn a local record into a usable system. First comes **sync**, the way several browsers agree on one history through cheap object storage. Second come **dashboards**, which run in the browser instead of on a server. Third is the **decision** a school actually faces: whether LRS-Lite is enough or whether the full LRS is worth its cost.

A note on status applies to everything below. As of the learning-record-store repository's TODO dated 2026-09-26, the compact MicroSim session code (`lrs-lite-sim.js`, `lrs-sim.js`) and the shared statement builder (`lrs-xapi.js`) exist, but no emitter posts statements to any store yet. The sync engine, the S3 deployment, the dashboards and the replay script described here are designs from the LRS-Lite analysis of 2026-09-24. Where a figure appears, it is that design's estimate, not a measurement from real learners.

## What a Summary Rests On

Sync moves events, and dashboards read summaries, so we first fix what the local store holds. A **Local Summary Vertex** is a rollup of all the events at one grain, kept in the browser and named after the corresponding summary vertex in the full LRS so the book teaches one vocabulary. A grain is the key a rollup is computed at. LRS-Lite keeps six: one per concept, per page, per MicroSim, per question, per learning session, and one for the whole book.

Most fields on a local summary vertex are counters, sums, maxima and first or last times. Those are order-independent, so they update incrementally as events arrive. One field is not: the mastery estimate for a concept depends on the order of observations, because right-then-wrong and wrong-then-right end at different probabilities. To keep that field repairable, each concept also keeps an **Evidence List**, a compact list of the observations that touched the concept, sorted by a global clock. The design gives each entry as four values: an ordering key, the kind of evidence (quiz, sim goal, read), a soft correctness value, and a weight, at about 45 bytes each.

The payoff is cheap repair. When a synced segment brings an event that belongs before a concept's newest evidence, only that concept is re-folded, usually from fewer than 50 entries, rather than the whole history. The ordering key on those entries comes from the identity scheme in the next section.

## Event Identity

Two browsers can only merge histories if every event can be recognized, deduplicated and placed in order. **Event Identity** is the set of fields that give each statement a globally unique name and a position in one shared timeline. The design attaches three identities to every statement, each answering a different question.

| Identity | Field | Question it answers |
|---|---|---|
| Statement ID | xAPI `id` (a UUID) | Have I already stored this event? |
| Device and sequence | `device_id` and `seq` extensions | Which events from that device do I still lack? |
| Clock | `hlc` extension | Which event came first, across devices? |

Only the first is standard xAPI. The producer contract already requires producer-supplied IDs, and the xAPI specification tells an LRS that receives a duplicate ID not to modify the stored statement, so an xAPI stream already behaves like a set that can only grow. The other two are LRS-Lite extensions, and the design notes that their extension IRIs must still be added to the producer contract's extension table so the full LRS can process them.

### Device Sequence Number

A **Device Sequence Number** is a counter that each device increments for every sealed segment it writes, so the pair of device ID and sequence number is unique and gap-free per device. Its job is bookkeeping. Each replica keeps a **version vector**, a map from device ID to the highest sequence number it has ingested from that device.

A worked example shows the mechanics. The Firefox laptop, device `f2`, holds the version vector `{c7: 38, f2: 12}`. When it opens the book it reads the Chromebook's small `head.json` file and learns `c7` has reached sequence 41. It therefore fetches segments 39, 40 and 41 and nothing else. If segment 40 were missing, the gap would be visible at once, because the vector cannot advance past a hole. If the fetch dies halfway, the vector stays at the last fully ingested segment, so the next attempt resumes there.

### Hybrid Logical Clock

Wall clocks disagree: a Chromebook may run two minutes fast. A **Hybrid Logical Clock** (HLC) fixes ordering without trusting either clock. It takes the larger of the device's physical clock and the largest clock value it has seen so far, then adds a counter to break ties. The result stays close to real time but never runs backward after a sync.

Consider illustrative numbers in milliseconds. The Chromebook, running fast, stamps an answer `1000200-0` (time, counter). The laptop, whose own clock reads `1000000`, pulls that segment, then records an answer. It takes the maximum of `1000000` and `1000200`, which is `1000200`, and adds a counter: `1000200-1`. The laptop's answer, made after seeing the Chromebook's, sorts after it even though its wall clock is behind. The standard xAPI `timestamp` still holds the device's wall-clock time, as the contract requires. The HLC orders evidence only.

!!! mascot-thinking "Three names, three jobs"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that no single identifier could do all three jobs. A UUID says "same event", a device counter says "what am I missing", and the clock says "which came first". Ask which question you are answering and the right field picks itself.

## Object Storage Sync

With identities settled, we need somewhere every browser can reach. **Object Storage Sync** treats a cheap object store, Amazon S3 in the design, as the system of record and every browser as a rebuildable replica. The record lives in one prefix per student, and the layout follows from three rules: history is never rewritten, each object has exactly one writer where possible, and derived data can always be rebuilt.

```text
students/{identity_id}/
  devices/{device_id}/seg/{seq}.jsonl.gz   immutable; written once
  devices/{device_id}/head.json            one writer: its own device
  checkpoints/{hlc}-{device_id}.json.gz    immutable snapshot + version vector
  latest.json                              pointer to newest checkpoint
  summary.json                             teacher-facing projection
```

A **segment** is a batch of events from one device, sealed as gzip-compressed newline-delimited JSON. Segments are the truth. A **checkpoint** is a snapshot of all summaries, evidence lists and the version vector, and like a summary vertex it is a projection that any device can rebuild. Two S3 features supply all the coordination. A create-if-absent write (`If-None-Match: *`, available since August 2024) guarantees that a segment is written once, and among concurrent writers the first wins while the rest receive `412 Precondition Failed`. A compare-and-swap write (`If-Match: <etag>`, since November 2024) lets several devices safely move the single `latest.json` pointer. Neither needs a server the school runs.

The same features enforce the append-only rule on the server side. The design's student role has no delete permission, and a bucket-policy statement rejects any segment write that lacks the create-if-absent header, so even a modified client can add segments but not alter or remove one. The design's cost model estimates about $0.77 per month for 150 students, using AWS list prices it checked on 2026-09-24. That is an estimate, not a bill.

### Sync Cycle

A **Sync Cycle** is one round of pushing local segments to the store and pulling other devices' segments back. The pseudocode below is a shortened form of the design's sketch, not shipped code. Before reading it, note two terms. A **Web Lock** (`navigator.locks`) is a browser feature that lets only one tab run a piece of code at a time, so one tab per browser acts as sync leader. **Sealing** means compressing the still-open events into an immutable segment.

```js
await navigator.locks.request(`lrs-lite-sync:${bookId}`, async () => {
  await db.sealOpenEvents();                       // PUSH: compress open events
  for (const seg of await db.unsyncedLocalSegments()) {
    const r = await s3.put(segKey(me, seg.seq), seg.bytes, { 'If-None-Match': '*' });
    if (r.status === 412) await onCollision(seg);  // same bytes: already stored
    await db.markSynced(seg.seq);
  }
  for (const [dev, head] of await readHeads(s3)) { // PULL: fetch what we lack
    for (let n = (vv[dev] ?? -1) + 1; n <= head.seq; n++)
      await db.ingestRemoteSegment(dev, n, await s3.get(segKey(dev, n)));
  }
});
```

Every step is safe to repeat. A retried upload that already succeeded returns `412`, and the client checks that the stored object matches its own bytes before marking it synced. If the stored bytes differ, the browser profile was cloned onto another machine, and the copy rotates to a new device ID. Local state is marked synced only after S3 confirms the write. The design schedules a small sync when the book opens, about every five minutes while events are waiting, when the tab is hidden, and when it becomes visible after a gap.

### Convergent Sync

**Convergent Sync** means that any number of replicas, syncing in any order and any number of times, end with identical summaries. It holds because the replicated state is a grow-only set: merging is set union, which is commutative, associative and idempotent, and summaries are a deterministic fold of the sorted set. The design lists four conditions the guarantee depends on: events are never modified, IDs are never reused, the fold is deterministic including tie-breaking, and every replica runs the same summarizer version.

The scenario that motivated the design makes this concrete. On Monday morning the Chromebook records three answers on one concept, two right, but Wi-Fi drops before sync. That evening the laptop records four answers, all right, and syncs. On Tuesday the Chromebook reconnects. A last-writer-wins snapshot keeps one device's record and silently discards the other's, losing either three or four attempts. Under set union both devices end with all seven attempts, sort them by HLC, and compute the same mastery estimate. The design's proposed test, not yet run, is a property test: three simulated devices with random events, random sync order and injected failures must end with byte-identical summaries.

#### Diagram: Two-Browser Convergence Lab

<iframe src="../../sims/two-browser-convergence-lab/main.html" width="100%" height="662px" scrolling="no"></iframe>

[Run the Two-Browser Convergence Lab MicroSim Fullscreen](../../sims/two-browser-convergence-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Two-Browser Convergence Lab</summary>
Type: microsim
**sim-id:** two-browser-convergence-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: compare): The learner will compare a last-writer-wins merge with an append-only event-set merge by running the Chromebook and laptop scenario and identifying which attempts each approach loses.

Layout: three columns on an aliceblue drawing region: "Chromebook (c7)" on the left, "S3 student prefix" in the center, "Home laptop (f2)" on the right. Each device column shows its local event list as small tiles, each tile labeled with an HLC value, a device ID and a green check or red cross for the answer. The S3 column shows uploaded segment tiles. Below each device is a summary readout: attempts counted and successes counted. A white control region sits below with a silver border line.

Controls:

- Button "Chromebook: answer 3 (2 right)" and button "Laptop: answer 4 (4 right)", each adding tiles to that device only
- Toggle "Chromebook offline" that blocks that device's Sync button (default off)
- Buttons "Sync Chromebook" and "Sync laptop" that run one push then pull, animating tiles moving to or from S3
- Radio "Merge rule": "Last writer wins" or "Event set (union)" (default event set)
- Button "Reset"

Interactions: hovering a tile shows its `id`, `device_id`, `seq` and `hlc`. Hovering a summary readout explains how it was computed. After both devices have synced, a banner states whether the two summaries are identical and how many of the seven attempts each device counts.

Data: the seven attempts from the Monday and Tuesday scenario. The HLC values are illustrative, chosen so the laptop's answers sort after the Chromebook's first three.

Responsive design: the three columns scale to the container width on every window resize and stack vertically below 500 pixels wide. Text stays at least 14 pixels, and the canvas height is a fixed drawing height plus a control region.

Implementation: p5.js with createButton and createRadio controls positioned relative to drawHeight. Include a describe() call for accessibility.
</details>

### Multi-Device Backup

Sync and backup are different operations, and the design separates them on purpose. **Multi-Device Backup** is an explicit, student-approved act that publishes a verified checkpoint to the store and then reclaims local space. Verified means the browser uploads the checkpoint, downloads it again and compares hashes. The table summarizes the two operations after the prose above.

| | Sync | Backup |
|---|---|---|
| What moves | Newest small segment, other devices' segments | A verified checkpoint |
| Typical size | 1 to 10 KB | 20 to 200 KB |
| Trigger | Automatic, as described above | Offered: weekly, at 60% full, when unsynced data is over 24 hours old, before sign-out on a shared device |
| Consent | One-time notice, or ask every time | Every time |

The split resolves a tension between requirements. A backup that can be declined would leave the second browser a day behind, so freshness comes from automatic sync. Backup exists for durability and to shrink the local copy. A school that wants no automatic transmission can set the design's `sync.mode` to `"ask"`, at the cost that another browser is only as current as the last accepted prompt.

!!! mascot-warning "A tab closing is not a data loss"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Do not design around the leave-time upload as if it were the only safety net. Every event is committed to the local database before any upload, and the upload is idempotent, so a lost final PUT simply goes up on the next visit. The real exposure is a device wiped before it reconnects.

## Dashboards in the Browser

A **Browser-Side Dashboard** computes its views in the viewer's browser from summary data, with no dashboard server. Chapter 21 described the full LRS's server-rendered dashboards, and the contrast is the point here. The student dashboard reads the local summaries, so it is instant, current to the latest event, and works offline. The design also sets rules for student-facing views: compare a student only with their own past, show how much evidence stands behind a color and how old it is, and never encode meaning by color alone.

The teacher dashboard needs every student's summaries. The design estimates one student's whole-book summary snapshot at about 11 KB gzipped, so a class of 30 is roughly 0.3 MB and 150 students roughly 1.7 MB. The teacher's browser fetches each `summary.json` in parallel and computes the class heatmap, completion funnel and at-risk list itself. The design puts 150 students at about one to four seconds and adds an on-demand rollup function above roughly 100 students. Each row shows an "as of" time, since freshness is only as good as each student's last sync. Applied to the report catalog, the design scores most single-teacher reports as fully supported, idle alerts and the at-risk roster as degraded, and real-time views and cross-district benchmarks as unavailable.

#### Diagram: Class Dashboard Load Estimator

<iframe src="../../sims/class-dashboard-load-estimator/main.html" width="100%" height="542px" scrolling="no"></iframe>

[Run the Class Dashboard Load Estimator MicroSim Fullscreen](../../sims/class-dashboard-load-estimator/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Class Dashboard Load Estimator</summary>
Type: chart
**sim-id:** class-dashboard-load-estimator<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: calculate): The learner will calculate the download size and load-time band for a teacher dashboard at a given roster size and decide whether the design's rollup function is needed.

Controls: a slider "Students" from 10 to 300 in steps of 10 (default 30), and a slider "Summary size (KB gzipped)" from 5 to 30 (default 11, the design's estimate).

Chart: a bar chart with two bars, "Total download (MB)" computed as students times summary size divided by 1000, and "Rollup download (one file)" drawn as a thin reference bar. A horizontal line marks 100 students, the design's approximate threshold for using the rollup function. Below the chart, a text panel states the number of downloads, the total size, and one of three messages: "Browser aggregation is comfortable", "Expect a few seconds", or "Use the rollup function".

Interactions: hovering a bar shows its exact value and formula. Data note: the 11 KB figure and the 100-student threshold are the design's estimates, and the panel says so.

Responsive design: the chart and sliders resize with the container on every window resize, sliders remain usable at 400 pixels wide, and labels wrap rather than overflow.

Implementation: Chart.js bar chart with HTML range inputs, updating on the input event.
</details>

## Compact Versus Full Fidelity

Compaction is what makes the small record possible, so its cost must be stated plainly. **Compact Versus Full Fidelity** is the trade between a stream that summarizes each MicroSim session in one statement and a stream that keeps every interaction. Chapter 22 defined the two modes. In the design's worked comparison, one session with three sim uses, two page reads and ten answers produces about 143 statements in Full mode and about 16 in Compact mode.

**Information Loss** is what Compact mode cannot give back: the per-drag sequence inside a session. A summary keeps the count of interactions, the range of each control explored, active time and how many statements it represents. It does not keep the order in which a student moved the sliders. The design's own scorecard records the consequence: a time-on-task timeline is supported at session grain, but detail inside a session is summarized, not replayable. What survives intact is what mastery estimation reads, because answers, predictions and goals are never folded.

Whether the lost sequence matters for predicting mastery is not known. Research the design cites suggests the quality of exploration, such as varying one factor at a time, can predict learning better than its quantity, and a summary that records only counts and ranges may miss that. No learner data has been collected through MicroSims yet, so this is a hypothesis. The method to test it is the evaluation approach of Chapter 19: compare predictions built from Compact-stream features against those built from Full-stream features once both exist.

!!! mascot-tip "Keep Full mode as your control group"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Before you claim Compact loses nothing, run a few pilot sims in Full mode and compare. A sim that teaches xAPI can switch modes from its teaching panel, and a URL parameter switches the stream for one visit without editing any file.

## Full Versus Lite Decision

The **Full Versus Lite Decision** asks which architecture fits a given school. The design offers three tiers: the full LRS, a single-server tier of the full LRS, and LRS-Lite. The hardware requirements document estimates the full tier at about $10,300 per month and the single-server tier at $300 to $2,500 per month, both planning-level estimates. The single-server tier serves roughly 10,000 concurrent active students on one host with no high availability. LRS-Lite targets one course of up to about 150 students at an estimated one to five dollars per month.

The decision turns on what each tier gives up, not only on price. The table below summarizes the trade-offs discussed in this chapter and the previous ones.

| Question | Lite | Full or single server |
|---|---|---|
| Always-on servers acceptable? | No servers | Yes, and staff to run them |
| Scale | One course, about 150 students | Many classes, districts |
| Freshness | As of each student's last sync | Server-side, near real time |
| Evidence integrity | Self-reported by the student's browser | Server-authenticated ingestion |
| Cross-class or cross-district analytics | On demand only, or not supported | Native |
| Push alerts | Scheduled function only | Native |

A practical rule follows. Choose Lite when one teacher or a small team runs a pilot, freshness measured in minutes is acceptable, and evidence is formative. Choose Full when grades or compliance depend on tamper-resistant evidence, when analytics must span classes or districts, or when real-time alerts matter. The single-server tier is a middle option, and its own document notes it stops fitting near 3,000 to 5,000 statements per second.

#### Diagram: Full or Lite Decision Explorer

<iframe src="../../sims/full-or-lite-decision-explorer/main.html" width="100%" height="642px" scrolling="no"></iframe>

[Run the Full or Lite Decision Explorer MicroSim Fullscreen](../../sims/full-or-lite-decision-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Full or Lite Decision Explorer</summary>
Type: microsim
**sim-id:** full-or-lite-decision-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: recommend): The learner will recommend Full, single-server or Lite for a described school by weighing scale, freshness, evidence integrity and budget, and will justify the recommendation against the trade-off table.

Controls:

- Slider "Students" from 10 to 20000 on a logarithmic scale (default 30)
- Checkboxes: "Grades depend on evidence", "Need cross-class analytics", "Need real-time alerts", "Staff to run servers"
- Slider "Monthly budget (USD)" from 0 to 12000 (default 50)
- Button "Show reasoning" and button "Reset"

Visual elements: three tier cards (Lite, Single server, Full) each showing its design estimate for cost per month, scale target and the requirements it fails. A card is dimmed with a red label for each unmet requirement and highlighted when nothing is unmet. A recommendation banner names the cheapest card with no unmet requirement, or states that no tier fits.

Interactions: hovering a card shows the source of each figure, labeled as a design or planning estimate. "Show reasoning" lists each requirement and which tier it rules out.

Behavior: the rule set is a teaching heuristic derived from the trade-off table, not an official sizing tool, and the banner says so.

Responsive design: cards sit in a row above 600 pixels wide and stack below it, resizing on every window resize, with controls remaining reachable at 400 pixels wide.

Implementation: p5.js with createSlider and createCheckbox controls positioned relative to drawHeight. Include a describe() call for accessibility.
</details>

## Lite to Full Migration

A school that outgrows Lite does not start over. **Lite to Full Migration** is the planned path of replaying a student's stored segments into the full LRS. It works because every statement LRS-Lite stores is a valid producer-contract statement, and segments are plain gzip newline-delimited JSON in a per-student prefix, which the design describes as the export.

The design specifies a script, `scripts/lrs-lite-replay.mjs`, planned for its final hardening phase. It rebuilds summaries from a prefix, diffs them against the stored checkpoint, and replays the statements into the full gateway. Its stated exit test is zero differences on dry-run prefixes. The script does not exist yet, and neither does a full LRS that receives emitter traffic.

Two limits deserve honesty. First, the migration carries what Lite recorded. Session summaries arrive as summary statements, so the dropped per-drag history is not recovered. Second, the full LRS's processor must learn the new extension fields, which is a listed contract change. The migration path is therefore a design with a sound basis, not a tested procedure.

!!! mascot-warning "Migrate the choice, not just the data"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Moving to Full does not restore fidelity you never recorded. If you may later want per-interaction analysis, run a slice of your sims in Full mode from the start, so the history exists to migrate.

## Chapter Summary

- **Event Identity** combines a UUID for deduplication, a **Device Sequence Number** for version vectors and gap detection, and a **Hybrid Logical Clock** for one order across devices despite clock skew.
- A **Local Summary Vertex** rolls events up at one grain, and an **Evidence List** keeps the ordered observations so one concept can be re-folded cheaply.
- **Object Storage Sync** makes S3 the system of record using immutable segments, create-if-absent writes and one compare-and-swap pointer. A **Sync Cycle** pushes and pulls under a per-browser lock, and every step is safe to repeat.
- **Convergent Sync** follows from a grow-only event set and deterministic summaries, so the two-browser case loses no attempts. The property test that would demonstrate it is designed, not run.
- **Multi-Device Backup** is an offered, verified checkpoint, separate from automatic sync.
- A **Browser-Side Dashboard** computes student and class views locally. The design estimates about 11 KB per student summary and adds a rollup function above roughly 100 students.
- **Compact Versus Full Fidelity** trades detail for size. **Information Loss** is the per-drag sequence, and its effect on predicting mastery is a hypothesis awaiting data.
- The **Full Versus Lite Decision** weighs scale, freshness, evidence integrity, analytics scope and cost, and **Lite to Full Migration** replays stored statements into the full LRS.
- Built: compact session code and the statement builder. Designed: sync, dashboards, S3 deployment, replay. Hoped for: that compact evidence predicts mastery.

!!! mascot-celebration "Sync, dashboards and the Full or Lite call"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now explain how three identity fields let browsers merge histories without a server, and you can recommend Full or Lite for a school and defend the choice. That closes the LRS architecture story, and it is one of the harder trade-off judgments in the book.

The next chapter turns from architecture to people, asking how pedagogy, accessibility and ethics should govern what these records are used for.
