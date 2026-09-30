---
title: "LRS-Lite: Compact Summaries and Browser Storage"
description: Explains LRS-Lite, the serverless strategy in which each MicroSim summarizes its own session and each student's record lives in a small browser database, and says which pieces are built.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:32:00
version: 1.10
---

# LRS-Lite: Compact Summaries and Browser Storage

## Summary

Introduces LRS-Lite, the serverless strategy in which each MicroSim summarizes its own session and each student's data lives in a small browser database.

Students learn the volume and size estimates, session summary statements, compact versus full mode, why answers are never folded, and the storage budget and quota rules. After it, they can explain what compaction keeps and what it costs.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| LRS-Lite | 53 |
| Serverless LRS | 24 |
| Statement Volume Estimate | 15 |
| Statement Size Measurement | 14 |
| Full Mode | 4 |
| Loss of Focus Event | 1 |
| Producer-Side Summarization | 11 |
| Browser Database | 19 |
| IndexedDB Storage | 18 |
| 10 MB Budget | 2 |
| Storage Meter | 1 |
| Quota and Eviction | 2 |
| Persistent Storage Request | 1 |
| Session Summary Statement | 10 |
| Compact Mode | 6 |
| Answers Never Folded | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)
- [Chapter 17: Instrumenting MicroSims with the xAPI Runtime](../17-instrumenting-microsims-with-the-xapi-runtime/index.md)
- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)
- [Chapter 21: The Full LRS: Dashboards, Operations and Compliance](../21-the-full-lrs-dashboards-operations-and-compliance/index.md)

---

!!! mascot-welcome "A learning record without a server"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Not every classroom has a server budget, and not every pilot needs one. By the end of this chapter you will be able to size a semester of student data on the back of an envelope and decide what a MicroSim should remember about a visit. Let's bounce it around!

## Why Lite Exists

Chapters 20 and 21 described the full Learning Record Store (LRS): a gateway, an event stream, a processor and several databases, all running around the clock. That design is sized for districts and for thousands of statements per second. A single teacher publishing a textbook from GitHub Pages has none of that: no operations staff, no budget for idle machines, and a class of thirty.

**LRS-Lite** is the alternative for that situation. It keeps the same learning-record model and the same statement shapes, but it removes the always-on infrastructure. Each MicroSim condenses its own session into a few statements, and each student's record lives in a small database inside the browser. The design calls the result a **Serverless LRS**: a learning record store with no process that must stay running, where any backend work runs only when invoked and costs nothing while nobody is studying.

The design's own cost estimates make the contrast concrete. It puts a pilot at "a few dollars a month or less," a single-server tier at $300 to $2,500 a month, and the full-scale tier at about $10,300 a month. These are planning estimates from the design documents, not bills anyone has paid.

Before going further, be clear about what exists. As of the LRS repository's TODO.md dated 2026-09-26, no emitter sends statements to any store, full or lite. What is built for LRS-Lite is the producer side: the compact-session library `lrs-lite-sim.js`, the author API `lrs-sim.js`, four instrumented sims and the chapter quizzes, all with headless-browser tests. The browser database, the storage meter and the sync engine are designed but not written. This chapter teaches the design and marks that line each time it matters.

This chapter covers the producer and the local store. [Chapter 23](../23-lrs-lite-sync-dashboards-and-choosing-full-or-lite/index.md) covers sync, dashboards and the choice between Full and Lite.

## Sizing the Problem: Volume and Size Estimates

A design that removes the server has to prove the data is small enough to live in a browser. That proof has two parts, and the order matters: first count the statements, then measure how many bytes each one occupies.

### Statement Volume Estimate

A **Statement Volume Estimate** is a prediction of how many xAPI statements a student, a class or a semester will generate, built from assumptions about daily activity. It is a model, not a measurement of real students, because no learner data has yet been collected through MicroSims.

The LRS-Lite analysis models a "typical" student on an active study day as six page reads, four sim sessions and fifteen quiz answers. In summary mode each of those produces one statement, so a day yields 25 statements. Over the model's 90 active study days, which the design calls generous, that is 2,250 statements per semester. A "heavy" student doubles every figure, giving 4,500.

Rates follow from the same arithmetic. Thirty students at about 25 statements a day produce roughly 750 statements a day, which the design converts to about 0.009 statements per second. A worse moment is thirty students each submitting a ten-question quiz within one minute: 300 statements in 60 seconds, or about 5 per second. The full LRS gateway and queue exist for 10,000 to 50,000 statements per second, so a pilot sits about six orders of magnitude below that.

The same model shows what summarizing buys. If sims emitted every interaction (Full mode, defined below), the typical student would produce 17,010 statements a semester, assuming 40 slider drags per sim session. Dividing 17,010 by 90 days and subtracting the 21 reads and answers leaves 168 sim statements a day, or 42 per session. The summary stream is therefore about 7.6 times smaller for a typical sim, and far smaller for drag-heavy ones.

### Statement Size Measurement

Counting statements only helps if we know their size. **Statement Size Measurement** is the practice of serializing representative statements and measuring the bytes, rather than guessing. The earlier LRS-Lite draft assumed about 700 bytes per statement. The revised analysis measured about 970 bytes, and the difference is large enough to matter.

The method is worth knowing because it is repeatable. The analysis generated a semester of synthetic statements using the repository's real chapter paths, sim paths and concept identifiers, built in the same shape as the `lrs-xapi.js` module produces. It serialized them as newline-delimited JSON, meaning one statement per line, and compressed the result with gzip at level 6, grouped one segment per day. Statements averaged 945 to 985 bytes each. The statements are synthetic, so the figures show the scale of the data, not how real students behave.

Here is the worked example for a typical semester in summary mode:

1. Statements: 2,250.
2. Raw size: 2,250 statements times about 980 bytes is about 2.2 MB.
3. After gzip: about 0.22 MB, roughly a tenfold reduction.
4. Headroom under a 10 MB limit: about 45 times.

The table below collects the design's four measured cases, so you can compare summary and full emission.

| Mode | Student | Statements per semester | Raw JSON | Gzip, one segment per day |
|------|---------|------------------------|----------|---------------------------|
| Summary | Typical | 2,250 | 2.2 MB | 0.22 MB |
| Summary | Heavy | 4,500 | 4.4 MB | 0.37 MB |
| Full | Typical (40 drags per sim session) | 17,010 | 16.1 MB | 1.05 MB |
| Full | Heavy (80 drags per sim session) | 62,820 | 59.6 MB | 3.6 MB |

Two levers produce the result. Summarizing inside the MicroSim cuts the statement count, and compression shrinks what remains. Together they fit a heavy semester in under 0.4 MB, so the design's storage limit is a safety rail more than a working constraint.

!!! mascot-thinking "Measure before you architect"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the order of the reasoning: estimate the volume, measure the size, and only then choose the machinery. Had the data been huge, a server might have been justified; because it is small, it was not.

Try the estimate yourself with the interactive specified below.

#### Diagram: Semester Storage Estimator

<details markdown="1">
<summary>Semester Storage Estimator</summary>
Type: chart
**sim-id:** lite-semester-storage-estimator<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Apply, calculate): the learner will calculate the statement count and storage footprint of a semester from activity assumptions, and judge how much headroom remains under a 10 MB limit.

Controls:

- Slider: page reads per active day (0 to 20, default 6).
- Slider: sim sessions per active day (0 to 12, default 4).
- Slider: quiz answers per active day (0 to 40, default 15).
- Slider: active study days (10 to 120, default 90).
- Slider: slider drags per sim session, used only in Full mode (0 to 100, default 40).
- Toggle: emission mode, Summary or Full.

Data and calculation:

- Summary mode statements per day equals reads plus sim sessions plus answers.
- Full mode statements per day equals reads plus answers plus sim sessions times (drags plus 2), an approximation matching the design's model.
- Raw size equals statements times 980 bytes. Gzip size equals raw size divided by 10, labelled as the design's approximate ratio.

Chart: a bar chart with two bars, raw MB and gzipped MB, and a horizontal reference line at 10 MB. Hovering a bar shows the exact value and the formula that produced it. A caption states that the figures are modelled from synthetic statements and not from real learners.

Interaction: every control change re-renders the chart and shows the headroom multiple (10 MB divided by gzipped MB). A "Load design cases" button snaps the controls to each of the four cases in the table.

Layout: chart above, controls below, with the readout to the right on wide screens and beneath on narrow ones. The layout must be width-responsive and redraw on window resize.

Implementation: Chart.js with plain JavaScript controls.
</details>

## Full Mode and Compact Mode

The two ways a MicroSim can report are called modes, and the whole chapter turns on the difference between them.

**Full Mode** means the sim emits one statement per meaningful interaction: every slider step beyond its deadband, every Start or Pause run, every node the student studies. Nothing is lost, and the statement stream is rich enough for the full LRS to analyze in detail. It is also large, which is why the previous section's Full rows are so much heavier.

**Compact Mode** means the sim folds those same interactions into an in-memory session and emits a single summary statement when the session ends. The runtime library `lrs-lite-sim.js` implements it. Compact mode is the default: a sim with no policy at all is compact, as the design puts it, "not silent about the data, and not verbose."

Compact mode changes how many statements exist, not what any statement means. Each summary is still a valid producer-contract statement, so a school that later adopts the full LRS can ingest the archive unchanged. The cost is honest and stated: in compact mode the fine-grained sequence of interactions cannot be reconstructed, because no server log stands behind it.

The evidence-class reference used by the instrumentation skill gives a small worked example. A student drags a slider through 5 steps, presses Start, waits, presses Pause, then leaves the tab.

| | Full mode | Compact mode |
|---|-----------|--------------|
| Slider steps | 5 `interacted` statements | folded into the session |
| Start and Pause presses | 2 `interacted` statements | folded into the session |
| The run between them | 1 `experienced` statement | recorded as one run of the session |
| Leaving the tab | nothing extra | ends the session and emits 1 summary |
| **Total** | **8 statements** | **1 statement** |

The one compact statement carries `statements_represented: 8`, so the compression stays observable. A wider example in the design compares a session of three sim uses (40, 25 and 60 drags), two page reads and ten quiz answers: about 143 statements in Full mode against about 16 in summary mode, roughly nine times fewer.

Which mode a sim uses comes from layered configuration. A `compact` key in a sim's own `metadata.json` `xapi` block overrides the book-wide default in `lrs-config.js`, and both fall back to compact. A URL switch such as `?xapi=full` overrides everything for one visit, which lets a developer compare the two streams. Chapter 17 covers this precedence in detail.

A note on naming avoids a common confusion. "Full mode" is a per-sim emission mode, while the "Full LRS" of Chapters 20 and 21 is a whole architecture. A school can run compact sims against the full LRS, and the design expects a school that migrates to move its sims toward Full mode.

!!! mascot-warning "Two different fulls"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Watch out for "full": Full mode is how a sim emits, and the Full LRS is where statements go. They vary independently, so name the one you mean when you write a requirement.

## Producer-Side Summarization

A full LRS compresses statements on the server, because a district needs the raw log for audit. LRS-Lite has no server, so compression moves to the only computer available, the page that produced the interaction. **Producer-Side Summarization** is the practice of condensing interactions into summaries at the emitting component, before any statement is stored or sent.

Three producers do this in the design: the MicroSim, the chapter page reader and the quiz. A MicroSim keeps its session state in memory: which controls were touched, how often, over what range. A chapter page tracks active reading time, maximum scroll depth and sections viewed. Quizzes already emit at the right grain, one statement per attempt, and pass through unchanged. Of these, only the MicroSim's compact session is built.

What is lost is the per-drag sequence. What is kept is every outcome that mastery estimates depend on, which is why the next two sections matter. The producer also decides when to stop folding, and that moment has its own name.

### Loss of Focus Event

A **Loss of Focus Event** is any browser condition indicating that the student has stopped engaging with a MicroSim, and it is the trigger that closes a compact session and emits its summary. "Focus" has several meanings in a browser, and no single event catches every way a student can leave, so the library watches for several. When a session is open, any one of these ends it:

| Signal | Mechanism | What it catches |
|--------|-----------|-----------------|
| Scrolled away | `IntersectionObserver` reports under 25% of the frame visible for 10 seconds | The student reads on past the sim |
| Tab hidden | `visibilitychange` becomes hidden | Tab switch, minimize, phone lock |
| Page left | `pagehide` | Navigation or closing the page |
| Idle | No pointer, key or wheel input for 90 seconds while the sim is not running | A sim left open |
| Blurred | The frame loses keyboard focus for 30 seconds | Clicking into surrounding text and staying there |
| Explicit end | The sim calls `end()`, for example from a Done button | Sims with a natural finish |

The three durations, 10 seconds, 90 seconds and 30 seconds, are the defaults for the `offscreenMs`, `idleMs` and `blurMs` policy keys. The library deliberately avoids `unload` and `beforeunload` because they are unreliable. A running Start and Pause sim counts as busy and never goes idle. When the student re-engages, a new session begins, so ten minutes of alternating between reading and a sim produces a handful of summaries, not hundreds of statements.

## The Session Summary Statement

A **Session Summary Statement** is the single `experienced` statement a compact session emits on a loss of focus. Before reading its JSON, three terms are needed. `active_ms` is the time the student was plausibly engaged, meaning the sim was visible and had input within the last 30 seconds, or was running. `interaction_count` is how many interactions were folded. `statements_represented` is how many Full-mode statements the summary stands for.

The example below is trimmed from the design and omits the actor, identifiers and timestamps. The `controls` extension keeps, for each control, how many times it was touched and the range of values.

```json
{
  "verb": {"id": "http://adlnet.gov/expapi/verbs/experienced"},
  "object": {"id": "https://dmccreary.github.io/learning-record-store/sims/bkt-four-parameters-explorer/",
             "definition": {"type": "http://adlnet.gov/expapi/activities/simulation"}},
  "result": {
    "duration": "PT3M12S",
    "extensions": {
      "https://w3id.org/lrs/ext/active_ms": 141000,
      "https://w3id.org/lrs/ext/interaction_count": 57,
      "https://w3id.org/lrs/ext/controls": {"slip": {"n": 22, "min": 0.02, "max": 0.41},
                                             "guess": {"n": 18, "min": 0.1, "max": 0.5}},
      "https://w3id.org/lrs/ext/end_reason": "scrolled-away",
      "https://w3id.org/lrs/ext/xapi_mode": "compact"
    }
  },
  "context": {"extensions": {"https://w3id.org/lrs/ext/concept_id": "slip-parameter",
                             "https://w3id.org/lrs/ext/statements_represented": 57}}
}
```

Reading the example: this student spent 3 minutes 12 seconds on the page, was engaged for 141 seconds, and touched two controls 22 and 18 times, ending the session by scrolling away. The `statements_represented` value of 57 says that Full mode would have produced 57 statements. The implementation also records `session_ms`, the wall-clock length, and `runs` for Start and Pause sims. The extension names under `w3id.org/lrs/ext/` are part of the design and, per the design, must still be added to the producer contract's extension table so the full LRS can fold them on replay.

The activity below lets you produce these statements yourself and compare the two streams.

#### Diagram: Compact Session Folding Lab

<details markdown="1">
<summary>Compact Session Folding Lab</summary>
Type: microsim
**sim-id:** compact-session-folding-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Analyze, distinguish): the learner will distinguish which interactions Compact mode folds into a session summary, which pass through as their own statements, and which Loss of Focus Event ends the session.

Canvas layout: a left pane holds a small practice MicroSim (one slider, a Start/Pause button, a two-choice question with a Check button). Two columns to the right list statements as they arrive, headed "Full mode stream" and "Compact mode stream". A row of buttons beneath the practice sim triggers focus-loss signals.

Controls:

- The slider, Start/Pause and Check button in the practice sim.
- Buttons: "Hide tab", "Scroll away 10 s", "Sit idle 90 s", "Click Done".
- Button: "Reset lab".

Behavior:

- Every slider step past a deadband, every press and every run appends a statement to the Full column. The same events increase counters inside a visible open-session card in the Compact column (interaction count, per-control n, min and max, run count).
- A Check press appends an `answered` statement to both columns immediately, showing its success value. It is never added to the session card, and the card's statements_represented counter does not change.
- A focus-loss button closes the session: the session card becomes one `experienced` summary with its end_reason and statements_represented, and a running total compares statement counts (for example, 8 versus 1).
- If the learner only pressed Check and never touched a control, ending the session produces a summary with statements_represented 0, matching the runtime's behavior.
- Hovering any statement shows a tooltip explaining its verb and why it was or was not folded.

Default state: session closed, both columns empty.

Instructional Rationale: a side-by-side step-through with concrete statements is appropriate because the Analyze objective needs learners to see what disappears and what survives; a description alone would hide the difference.

Responsive design: the panes stack vertically below 700 px width, and the canvas redraws on window resize.

Implementation: p5.js with DOM buttons; no network calls.
</details>

## Answers Never Folded

Summaries are safe to fold because they carry exposure evidence: the student looked at, moved or explored something. **Answers Never Folded** is the rule that a checked answer, a prediction or a reached goal is never merged into a summary. Each one is emitted as its own `answered` statement at the moment it happens, in both Full and Compact mode.

The design gives three reasons, and each is worth internalizing.

- **Order matters to the estimate.** Chapter 18 introduced Bayesian Knowledge Tracing, which reads attempts in sequence. The attempts wrong, wrong, right and right, wrong, wrong contain the same counts but end in different estimated mastery, so folding them into a count would destroy the information the estimate needs.
- **Each answer keeps its question identity.** A statement names the question it answers, so per-question rollups, such as which quiz items students miss, remain possible.
- **Replay stays possible.** The rollups can be rebuilt from the stored statements, which the full LRS design requires.

The storage cost is small. The size model already budgets about fifteen answers a day, and an answer is a single statement of roughly a kilobyte.

A worked case shows the rule at work. A student drags a slider 30 times, then answers a checked question wrong, then right. Compact mode emits two `answered` statements as they happen and, when the student leaves, one summary with `interaction_count: 30`. The two answers do not appear inside that summary, and they do not increase `statements_represented`. The student's slider work is recorded as exposure, while the two attempts remain distinct pieces of assessed evidence.

One refinement was added on 2026-09-26. An answer still opens the session, because answering is engagement with the sim. Before that fix, a student who went straight to a drilldown's three questions left three answers and no record of time on the sim. Now such a visit ends in one summary with `statements_represented: 0`, `interaction_count: 0` and empty `controls`, which is true, since nothing was folded, and still carries the duration. A visit with neither interactions nor answers emits nothing.

!!! mascot-warning "Never fold the evidence"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A tempting shortcut is to store "3 of 5 correct" inside the summary to save a few statements. Resist it: you lose the order of attempts, and the estimate cannot be rebuilt. If a sim checks an answer, emit it as its own statement.

## The Browser as a Small Database

With statements condensed, the next question is where they live before any upload. In LRS-Lite the answer is a database inside the student's own browser.

A **Browser Database** is a structured, persistent data store that web pages can read and write on the user's device, scoped to the site's origin. It survives closing the tab, works with no network, and needs no server. Its limits matter as much as its strengths: a browser database belongs to one browser profile, so Chrome and Firefox on the same laptop hold separate copies, and the browser may delete it. For that reason the LRS-Lite design treats the browser database as a working copy and an object store as the system of record; Chapter 23 covers that arrangement.

### IndexedDB Storage

**IndexedDB Storage** is the browser database LRS-Lite chose: the asynchronous, transactional database built into every major browser. The design rejects `localStorage` for three reasons. It is synchronous, so it can block the main thread that a sim is animating on. It stores only strings. And the design notes it is capped near 5 MB in several browsers, which is below the intended budget before any overhead. IndexedDB is asynchronous, structured and indexable, and it needs no library download. The design also rejected SQLite compiled to WebAssembly, whose fast storage backend needs response headers that GitHub Pages cannot set.

The design divides the database into five object stores, and one rule ties them together: a statement write updates the events, summaries, evidence and meta stores in a single IndexedDB transaction. A crash therefore cannot leave an event stored without its summary, or the reverse.

| Store | Holds | Used for |
|-------|-------|----------|
| `events` | Unsealed statements from the current session | Cheap appends while studying |
| `segments` | Sealed, gzip-compressed batches of statements | The compressed stream, and copies of other devices' segments |
| `summaries` | One rollup per analytical grain (concept, page, sim, question, session, book) | What every screen reads |
| `evidence` | An ordered list of compact evidence tuples per concept | Re-folding one concept when an event arrives out of order |
| `meta` | Device identity, counters, sync state | Sync and meter state |

Two more design decisions shape the database. The design uses one database per book, named `lrs-lite::{book_id}`, because every GitHub Pages project site under one account shares a single origin, a single quota and a single eviction fate. A separate `lrs-lite::_identity` database lets a student sign in once across books. MicroSims run in same-origin iframes, so a sim's script opens the book's database directly.

None of this code exists yet. The repository has no `lrs-lite-db.js`; the compact session's `record()` function currently appends to an in-memory array named `LRSLite.statements`, which tests read. Treat the store as a specification.

!!! mascot-tip "Ask where the truth lives"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When you evaluate any browser-storage design, ask one diagnostic question: if this browser deleted everything tonight, what would be lost? Whatever the answer is, that data is not yet safe.

## The 10 MB Budget and the Storage Meter

Storage in a browser is finite and can be taken away, so LRS-Lite sets its own limit and shows the student how close they are.

### 10 MB Budget

The **10 MB Budget** is the design's self-imposed ceiling on one book's local database, enforced by the library rather than by the browser. It is a policy, not a browser limit: the library adds up the compressed bytes of segments and the serialized size of the other stores, instead of waiting for a `QuotaExceededError`. The meter's numbers are then exact and identical across browsers, while the browser's own `navigator.storage.estimate()` reports approximate, engine-specific on-disk overhead.

The budget is divided into slices, and the sizes are the design's estimates.

| Slice | Typical semester | Hard cap | Pruned? |
|-------|------------------|----------|---------|
| Summaries and evidence | 50 to 150 KB | 1 MB | Never |
| Unsealed events | under 20 KB | 0.5 MB | Sealed every few minutes |
| Sealed segments, this device | 0.2 to 0.4 MB | none | Only after synced and covered by a verified checkpoint |
| Mirrored segments, other devices | 0 to 0.4 MB | none | First to go under pressure |
| **Total** | **about 0.3 to 0.9 MB** | **10 MB** | |

Summaries are never pruned because they are the student's state. Set against the size measurements earlier, a typical semester uses roughly 3 to 9 percent of the budget.

### Storage Meter

The **Storage Meter** is a small header component that shows the student how full the local record is and how safe it is. The design sketches four elements: a fill bar with a text percentage and a status word, so meaning never depends on color alone; a sync line showing time since the last sync and the number of events waiting to upload; a devices line showing other devices that have synced; and a "What is stored about me?" control that opens a readable view of the summaries and a download of the raw statements. The sync line matters most, because events not yet uploaded are the real risk. The meter is a design and has not been built.

The meter also drives behavior. The design defines four pressure levels, each triggered by fullness or by time.

| Level | Condition | Behavior |
|-------|-----------|----------|
| Normal | below 60% | Nothing beyond the meter |
| Offer | 60% or more, or 7 days since the last backup, or unsynced events older than 24 hours | A backup card appears at the end of the next section |
| Reclaim | 80% or more | Drop mirrored segments from other devices first, then this device's covered segments |
| Protect | 95% or more with unsynced data | Force all sims into summary mode, and fold the oldest unsynced statements into summaries, recording `truncated_statements: N` so the loss is visible |

At the measured rate of 0.2 to 0.4 MB per semester, the Protect level is a correctness path that a summary-mode pilot should never reach. It matters mostly for Full mode, where a heavy student produces about 3.6 MB compressed per semester.

Use the following lab to see how the levels respond.

#### Diagram: Storage Meter Pressure Lab

<details markdown="1">
<summary>Storage Meter Pressure Lab</summary>
Type: microsim
**sim-id:** storage-meter-pressure-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Apply, predict): the learner will predict which pressure level a given storage state triggers and which data the library discards first.

Controls:

- Slider: local database size (0 to 10 MB, default 0.34 MB).
- Slider: days since last backup (0 to 30, default 2).
- Slider: age of oldest unsynced event in hours (0 to 72, default 0).
- Toggle: emission mode, Summary or Full, which sets a per-day growth rate for an optional "advance 10 days" button.
- Button: "Keep my record on this device", which simulates a persistence request with a Granted or Denied outcome chosen from a dropdown (Firefox prompt, Chrome silent grant, Chrome silent denial).
- Button: "Advance 10 days" and "Reset".

Visuals: a meter bar with percentage, status word and a synced line as in the design sketch; a stack of slices (summaries, unsealed events, this device's segments, mirrored segments) that shrinks in the order the level prescribes; a level badge (Normal, Offer, Reclaim, Protect).

Interaction: before revealing the level, the learner picks a predicted level from four buttons and receives feedback that explains the rule that fired. Hovering a slice explains whether it may be pruned.

Responsive design: bar and slices scale to the container width, with controls wrapping beneath on narrow screens; redraw on window resize.

Implementation: p5.js with DOM controls.
</details>

### Quota and Eviction

**Quota and Eviction** are the two browser-side mechanisms that can reduce a local database regardless of the budget. Quota is the per-origin storage limit the browser enforces, and eviction is the browser's deletion of an origin's data under pressure. The design's research, gathered on 2026-09-24, reaches a conclusion that surprises many readers: quota is not the threat. Ten megabytes is about 0.01 percent of a typical per-origin quota. Eviction is the threat, and it works by removing all of an origin's data at once.

The design lists three concrete risks. Storage is best effort unless the origin is granted persistence, and eviction under pressure is least-recently-used by origin. Safari deletes script-writable storage after seven days of browser use without an interaction with the site, and Home Screen web apps are exempt. Managed Chromebooks may run ephemeral or guest sessions that clear site data at sign-out. Whether the seven-day rule also applies inside Chrome or Firefox on iOS is unverified in the design. Because every book on a GitHub Pages account shares one origin, one eviction wipes every book's local copy together.

The lesson for design is that a bigger budget cannot protect the record. Only a second copy elsewhere can, which is the subject of Chapter 23.

### Persistent Storage Request

A **Persistent Storage Request** is a call to `navigator.storage.persist()` that asks the browser to exempt the origin's data from eviction. Browsers answer differently. Firefox shows the user a permission prompt, while Chrome and Safari decide silently by their own heuristics, and the design cites a 2025 test finding Chrome's grants unreliable.

Because of the Firefox prompt, the design does not call `persist()` automatically at sign-in, which would confuse students with an unexplained dialog. Instead, the meter offers a "Keep my record on this device" button, so the request follows a deliberate user action. The design also does not depend on the answer. When persistence is denied, the meter says the browser may clear the local copy while the synced record is safe, and on iPads it suggests adding the book to the Home Screen, which removes Safari's seven-day deletion.

!!! mascot-thinking "A cache with a memory"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the browser database as a notebook you carry that a janitor may tidy away overnight. You keep working in it for speed, but you photocopy the pages somewhere safe.

## Putting the Pieces Together

The concepts in this chapter form one chain. Producer-side summarization in Compact mode shrinks the statement stream, and a Loss of Focus Event decides when each summary is cut. Answers Never Folded protects the evidence that mastery estimates need. The small resulting record fits easily in IndexedDB under the 10 MB budget, the Storage Meter makes its state visible, and the Persistent Storage Request, together with an off-device copy, answers Quota and Eviction.

Note the distinction between three kinds of claim. The volume and size figures are measured on synthetic statements, so they are "measured" only in the sense of size, not student behavior. The compact session, the answer rule and the author API are built and tested. The database, the meter and the pressure levels are designed. And whether compact summaries preserve enough evidence to support the mastery predictions of Chapters 18 and 19 is a hypothesis: no learner data has been collected, so it awaits the evaluation method described there.

## Chapter Summary

- **LRS-Lite** is a Serverless LRS: the learning-record model with no always-on server, in which each MicroSim summarizes its session and each student's record lives in a browser database. The design estimates a pilot at a few dollars a month.
- A **Statement Volume Estimate** for a typical student is 25 statements per active day, or 2,250 per semester in summary mode, about 7.6 times fewer than Full mode.
- **Statement Size Measurement** found about 970 bytes per statement, and gzip cuts a typical semester to about 0.22 MB. These figures come from synthetic statements.
- **Full Mode** emits every interaction. **Compact Mode** folds them into a session and emits one **Session Summary Statement**, which records how many statements it represents.
- **Producer-Side Summarization** happens in the MicroSim, and a **Loss of Focus Event** (scrolled away, tab hidden, page left, idle, blurred, or an explicit end) closes each session.
- **Answers Never Folded**: every checked answer is its own `answered` statement, because attempt order, question identity and replay all depend on it.
- A **Browser Database** built on **IndexedDB Storage** holds a working copy under a **10 MB Budget** that the library enforces, shown by the **Storage Meter**.
- **Quota and Eviction** mean the browser can delete an origin's data, so a **Persistent Storage Request** helps but cannot be relied on.
- Built: the compact session and author API. Designed: the database, meter and pressure levels. Hoped for: that summaries preserve enough evidence to predict mastery.

!!! mascot-celebration "Compaction, sized and understood"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now estimate a semester of statements, explain what Compact mode keeps and what it costs, and say why answers are never folded. That is the producer half of LRS-Lite, and it is one of the trickiest trade-offs in the book.

The next chapter shows how that small local record is synced to object storage, rendered on dashboards, and weighed against the full LRS.
