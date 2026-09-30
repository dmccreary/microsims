---
title: "The Full LRS: Architecture and Ingestion"
description: Explains the architecture of the full Learning Record Store, from tenants and pseudonymous identity to the gateway, event stream, processor and storage, and says which pieces are built.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:24:18
version: 1.10
---

# The Full LRS: Architecture and Ingestion

## Summary

Describes the full Learning Record Store built for scale: multi-tenancy, pseudonymous identity, the graph data model and the ingestion pipeline.

Students learn the gateway, statement validation, event streams, ClickHouse and Neo4j roles, and idempotent ingest. After it, they can explain how a statement travels from a MicroSim to durable storage.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Learning Record Store | 245 |
| LRS Architecture | 191 |
| System Context | 1 |
| Multi-Tenancy | 10 |
| District Tenant | 9 |
| Roster and Identity | 6 |
| Property Graph Data Model | 10 |
| Summary Vertex | 8 |
| Ingestion Gateway | 166 |
| Statement Validation | 5 |
| All-or-Nothing Batch | 3 |
| Event Stream | 159 |
| Stream Processor | 84 |
| Redpanda | 1 |
| ClickHouse | 81 |
| Neo4j Graph Database | 1 |
| Twelve Core Functions | 1 |
| Idempotent Ingest | 2 |
| Student Privacy | 17 |
| Pseudonymous Learner ID | 3 |
| Per-District Salt | 1 |
| Partition by Learner | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 16: xAPI Statements and Evidence](../16-xapi-statements-and-evidence/index.md)

---

## Welcome

!!! mascot-welcome "Where Do the Bounces Go?"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every slider you nudge in an instrumented MicroSim leaves a small piece of evidence, and this chapter shows you the machine built to catch it. By the end you can trace one statement from a learner's click to durable storage and explain why nothing gets lost on the way. Let's bounce it around!

Chapters 16 through 19 described the evidence itself: what an xAPI statement says, how a MicroSim emits it, and how a mastery estimate could be computed from it. This chapter turns to the place where that evidence lands. It describes the full Learning Record Store, the version designed for whole school districts, and it follows a single statement through the gateway, the event stream, the processor and the two databases. One warning applies to everything that follows. The design is detailed and parts of it are running code, but the remaining parts are still plans, so each section says which is which.

## What a Learning Record Store Is

A **Learning Record Store** (LRS) is a server that receives xAPI statements, keeps them, and answers questions about them. Chapter 16 defined a statement as a small record of the form actor, verb, object, with an optional result and context. An LRS is the other half of that exchange. A MicroSim or a textbook page produces statements, and the LRS is where they are accepted, stored durably and later retrieved.

The xAPI standard requires only that an LRS accept and return statements. The LRS in this book's companion project does more, and its specification gives it three duties.

- **Accept** statements from thousands of textbooks at once, without dropping any, even when the databases behind it are busy or briefly down.
- **Keep** every statement unchanged, as an immutable log in which corrections are new statements rather than edits.
- **Answer** questions for teachers, authors and administrators, which means turning a very large log into small, fast summaries.

This chapter covers the first two duties and the structures that make the third possible. Chapter 21 covers the dashboards and operations that answer the questions. The book describes two LRS designs, and it helps to name them now. The **full LRS** in this chapter is a multi-service system built for districts with many concurrent classrooms. Chapters 22 and 23 describe LRS-Lite, a compact alternative that summarizes evidence in the browser. Chapter 23 explains how to choose between them.

Because the first duty is the hardest, the specification sets a scale target for it. It asks the full LRS to sustain at least 10,000 statements per second in aggregate, with bursts up to 50,000 per second at the start of class periods across time zones. Those figures are targets from the specification, not measurements. No system has yet been run at that load, and the sections below say so where it matters.

The table below lists what a worked trace will exercise. It is a preview of the chapter and a map you can return to.

| Step | What happens to the statement | Section |
|------|------------------------------|---------|
| 1 | A MicroSim sends it in an HTTP request | The Ingestion Gateway |
| 2 | The gateway checks the token and the contract | The Ingestion Gateway |
| 3 | The gateway places it on a durable queue and replies | The Event Stream |
| 4 | A processor hides the learner's identity and enriches the statement | The Stream Processor |
| 5 | The statement is stored in the log | ClickHouse and Neo4j |
| 6 | A summary is derived and copied to the graph | ClickHouse and Neo4j |

## The Architecture in Five Planes

The **system context** of a software system is the picture of what surrounds it: who sends it data, who reads from it, and what it depends on. For the LRS the context is simple. On one side are intelligent textbooks, potentially thousands of them, each running MicroSims that emit statements. On the other side are three kinds of people, namely instructors reading dashboards, district and system administrators using admin screens, and authors reading content reports. Between them sits the LRS, and that middle region is the subject of the rest of the chapter.

**LRS architecture** is the division of that middle region into parts with one job each. The specification divides it into five planes, where a plane is a group of components that share a responsibility. The ingestion plane accepts statements and puts them on a durable queue. The processing plane validates, enriches and pseudonymizes them, and it also runs the compression that produces summaries. The storage plane holds the log and the graph. The analytics plane runs the queries behind every report. The presentation plane renders dashboards and admin screens.

The design document maps these planes onto concrete components, and it makes one choice that shapes everything else: every process is the same container image, started with a different command such as `lrs gateway` or `lrs processor`. The backing services are unmodified upstream images. The list below names each component that this chapter uses. Each is defined in the paragraphs that follow the diagram, so treat this list as a glossary you can consult.

- **Gateway** (`lrs gateway`): the HTTP endpoint that accepts statements.
- **Processor** (`lrs processor`): the workers that enrich statements and write them to the log.
- **Summarizer** (`lrs summarizer`): the worker that copies compact summaries into the graph.
- **Reconciler** (`lrs reconciler`): the worker that matches never-before-seen textbooks and activities to published metadata.
- **Identity service** (`lrs identity`): the only component allowed to reach the vault of learner identities.

A worked example shows how the planes cooperate. Suppose a student drags a frequency slider in an instrumented sine-wave MicroSim. The runtime from Chapter 17 builds an `interacted` statement and sends it to the gateway, which is the ingestion plane. The gateway checks it and queues it. A processor in the processing plane pulls it from the queue, replaces the learner's identity with a pseudonym and stores it in ClickHouse, which is the storage plane. Roughly a minute later the summarizer copies the changed summary for that student and concept into the graph. Later still, a teacher opens a dashboard, and the analytics plane reads the summary while the presentation plane draws it. Five planes, one statement, and no plane needs to know how the others work internally.

!!! mascot-thinking "Why Split It This Way?"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the gateway as a receiving dock that never turns a truck away, while everything behind it works at its own pace. The split lets the dock stay open even when the warehouse is busy or closed for repairs.

Before you open the first diagram, two terms deserve a sentence each. *Built* means that code for the component exists in the companion repository and has been run. *Designed* means it appears in the design document but has no code yet. The diagram colors each component by that status, using the repository's own TODO file dated 2026-09-26.

#### Diagram: Full LRS Architecture Explorer

<details markdown="1">
<summary>Full LRS Architecture Explorer</summary>
Type: diagram
**sim-id:** lrs-architecture-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the five architectural planes and the components in each, and distinguish built components from designed ones.

Nodes: textbooks (left), then the gateway, the event stream, the processors, ClickHouse, Neo4j, the summarizer, the reconciler, the identity service, the vault, the analytics API and the dashboards. Nodes are grouped in five horizontal bands labeled Ingestion, Processing, Storage, Analytics and Presentation. Directed edges show data flow: textbooks to gateway to event stream to processors to ClickHouse, ClickHouse to summarizer to Neo4j, and processors to reconciler to Neo4j.

Colors: the built component (the gateway) is green, the event stream and the two databases are yellow to mean that infrastructure and schema files exist but the workers that feed them do not, and designed components are light gray with a dashed border. A legend states the meaning.

Interactions: clicking a node opens an information panel with a one-sentence role, its hard dependencies, and its status with the date of the source. Hovering an edge shows what travels along it. A checkbox "Hide designed components" leaves only the built path visible. A "Quiz me" button hides the labels and asks the learner to drag each component into its plane.

Layout: the network fills the container width, with the panel below the network under 600 pixels wide.

Responsive design: the network re-fits on every window resize event, and node labels shrink but never below 11 pixels.

Implementation: vis-network with fixed positions and physics disabled. Node data and status live in a JSON file so the diagram can be updated when the status changes.
</details>

## Tenants, Rosters and Pseudonyms

A single LRS serves many school districts, and the first architectural decision is how to keep them apart. **Multi-tenancy** means one running system serves several independent customers, called tenants, while keeping each tenant's data invisible to the others. In this design the tenant is the school district, so a **district tenant** is the top-level isolation boundary. Under a district sit schools, then courses, then sections (a class period or cohort), and finally enrollments that connect a student to a section. Textbook deployments hang off the district too, so that a textbook version, defined once, can be assigned to many courses.

The specification gives each level a different guarantee. The district boundary is hard: no query may cross it, except an explicit system-administrator action that benchmarks de-identified aggregates above the privacy threshold. School, course and section boundaries are soft, meaning role-based access control decides what a teacher may see and a teacher sees only their own sections. A textbook deployment shares its definition across districts but partitions the events, so each district's event stream stays separate. The table summarizes the three cases.

| Level | Isolation | How it is enforced |
|-------|-----------|--------------------|
| District | Hard | No cross-district query; `district_id` leads the storage keys |
| School, course, section | Soft | Role-based access control at the API |
| Textbook deployment | Shared definition, separate events | Events partitioned by district |

The **roster and identity** layer answers a different question: who are the learners? A roster is the list of students enrolled in each section. The LRS never creates that list. It imports rosters from the district through the OneRoster standard, as CSV files or a REST endpoint, or through a student information system, and the district remains the authoritative source of identity. Inside the LRS the roster becomes enrollment relationships in the graph. In the repository, no roster import code exists yet. What exists is a seeder, `lrs seed`, that loads demonstration districts and learners into Neo4j and marks them `seeded: true` so they are never mistaken for real data.

### Student Privacy and the Pseudonym

**Student privacy** is the requirement that the analytics system should not reveal who a learner is to anyone without a legitimate reason. The specification states that it is aligned with FERPA, COPPA and GDPR, and it commits to specific mechanisms: pseudonymous identifiers, a separate vault for real identities, a minimum group size for disaggregated results (default 10), and erasure on request. That list of mechanisms is a design commitment, and a district still needs its own legal review. Nothing in this book is legal advice.

The central mechanism is the **pseudonymous learner ID**, a stable identifier derived from the learner's real identity that reveals nothing on its own. Every statement identifies its actor with an account, made of a home page URL and a name, for example `https://school.example.edu` and `learner-17`. The identity service combines the two with a secret and produces an opaque `student_key`. That key is what every analytics store sees. The mapping between real roster identities and keys lives in the vault, a separate PostgreSQL instance that only the identity service can reach. The design deliberately uses two separate instances rather than two schemas, because a shared instance would make the privacy boundary one permissions mistake deep.

The secret in that derivation is a **per-district salt**: a random value, unique to each district, that is mixed into the calculation. The design document specifies HMAC-SHA256 over the home page and name, keyed with the salt. Because each district has its own salt, the same learner appearing in two districts receives two unrelated keys. A worked example makes this concrete. Suppose learner `learner-17` at `https://school.example.edu` is enrolled in District A and, after moving, in District B. Each district's salt is different, so the statements from the two districts carry different keys, say `KEY-A` and `KEY-B`, that share nothing. Someone with read access to the analytics store, but not the vault, cannot link them. Erasure follows the same logic in reverse. Deleting the vault row and the salt makes the key permanently underivable, and the aggregates that remain are genuinely de-identified.

| Property | With a per-district salt | Without one (a global salt) |
|----------|--------------------------|------------------------------|
| Same learner in two districts | Two unrelated keys | One key, linkable |
| Compromised analytics reader | Cannot link across districts | Can link across districts |
| Erasure by deleting the salt | Key becomes underivable | Key stays derivable for every district |

Here the honest status matters. The gateway is built and deliberately holds no salt. The identity service and the processor, where the pseudonym is computed, are designed and not yet built. The TODO file also states a rule worth adopting: until the identity service exists, the processor must not invent a salt, because a hardcoded value would make the privacy boundary look tested when it is not.

!!! mascot-warning "The Raw Column Loophole"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The original design stored each statement's original JSON verbatim, and that JSON contains the learner's real account name, so anyone who could read the log could re-identify every student. The repository's DDL fixes this by requiring the processor to replace the actor block with the derived key before the insert, and a smoke test is meant to check it on every run.

The tenancy hierarchy and the pseudonym both come together in the next diagram. Click a district to see how the same learner is keyed in each, and click a level to see who may cross it.

#### Diagram: Tenant Isolation and Pseudonym Explorer

<details markdown="1">
<summary>Tenant Isolation and Pseudonym Explorer</summary>
Type: microsim
**sim-id:** tenant-pseudonym-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: explain): The learner will explain why a per-district salt gives one learner two unrelated pseudonymous keys, and which boundaries are hard or soft.

Layout: the drawing region shows a tree, System at the top, two districts below, then schools, courses and sections, and one student node at the bottom of each district. The control region below has a text field for a learner name, a drop-down for salt handling, and a button "Derive keys".

Controls:

- Text field "Learner account name", default learner-17
- Radio buttons "Per-district salt" (default) and "One global salt"
- Button "Derive keys" that shows each district's key as a short illustrative token, clearly labeled "illustrative, not a real hash"
- Toggle "Attacker view" that hides the vault and shows only the analytics side

Behavior: with per-district salts, the two districts show different tokens, and in attacker view the learner cannot be linked. With a global salt the tokens match and the link appears as a red line. Clicking a level of the tree shows whether its boundary is hard or soft and the text of the rule.

Responsive design: the canvas width follows the container width on every window resize, with a fixed drawing height of 380 pixels and a 100 pixel control region, and every control stays visible at 400 pixels wide.

Implementation: p5.js with createInput, createRadio and createButton positioned relative to the drawing height. Tokens come from a simple non-cryptographic hash and are labeled as illustrative. Include a describe() call for accessibility.
</details>

## The Ingestion Gateway

The **ingestion gateway** is the front door of the LRS: the one HTTP service that MicroSims and textbook pages send statements to. Its address in the specification is `POST /xapi/statements`, which accepts a single statement or an array of them, and the specification also lists a `PUT` form in which the client supplies its own statement identifier. In the repository the gateway is a Python FastAPI service, and its code defines a `POST` route and a `/health` route. The `app.py` file has no `PUT` or `GET` route, so those are specified rather than built.

The gateway does five things per request, in this order, and the order carries meaning. It authenticates the caller with a bearer token that maps to a district. It validates the statements. It assigns identifiers and a `stored_at` timestamp. It places the statements on the durable queue. Finally it replies, and it does so only after the queue has acknowledged the write, never after any later processing. That last rule decouples the producer's wait from the rest of the system, so a slow database never slows a classroom.

The design goes further and makes a promise that it treats as the most important property of the service: the gateway's only hard dependency is the queue. The module's own comment states that nothing in it may import a ClickHouse, Neo4j or Redis client. If the analytics database restarts, the gateway must still answer with success, because otherwise a classroom loses a lesson's worth of telemetry each time a database restarts.

### Statement Validation

**Statement validation** is the gateway's check that each incoming statement is well formed and follows the producer contract from Chapter 16. The specification describes two tiers. The synchronous tier at the gateway checks structure: valid JSON, an actor, a verb, an object and a parseable timestamp. The asynchronous tier in the processor handles semantic surprises such as unknown activities, which are accepted and flagged for later reconciliation rather than rejected.

The built gateway is stricter than the first tier. Its `validation.py` module enforces the whole producer contract, and its own comment gives the reason: the log is append-only, and a statement that breaks the contract does not fail loudly later, it fails silently and permanently. For example, an `answered` statement without `result.success` would make the concept report zero attempts forever, looking exactly like a student who never tried. Its checks include the following.

- Exactly three verbs are valid: `answered`, `experienced` and `interacted`.
- The object type must be one of four activity types, and page-level objects need a trailing slash and no fragment.
- `answered` requires a boolean `result.success`, and `experienced` requires an ISO-8601 `result.duration`.
- The actor needs an account with both a home page and a name.
- The first `grouping` entry must be a textbook version IRI of the form `{site_url}textbook/{textbook_id}/{version_id}`.

This strictness is a documented tension with the specification. The specification says unknown verbs are accepted under schema-on-read, while the producer contract says any other verb is rejected at the gateway. The code follows the contract, and the design document's own principle is that where the two disagree, the contract wins.

### The All-or-Nothing Batch

An **all-or-nothing batch** is a batch of statements that the gateway either accepts in full or rejects in full. This is an xAPI conformance rule. If one statement in a `POST` array is invalid, the gateway stores none of them and returns a `400` response. The gateway does not stop at the first problem. It collects every violation across the whole batch, so the author of a producer fixes everything in one round trip.

Before the example, note the fields the response uses. `index` is the position of the statement in the posted array, counting from zero. `field` is the dotted path inside the statement, and `contract` names the section of the producer contract that decides the rule. The example below is real output, produced by running the repository's `validate_batch` function on a batch of three statements, where statement 0 is valid, statement 1 uses the verb `completed`, and statement 2 is an `answered` statement with an empty result.

```json
[
  {
    "index": 1,
    "field": "verb.id",
    "contract": "§3",
    "message": "'http://adlnet.gov/expapi/verbs/completed' is not one of the three v1 verbs (answered, experienced, interacted)."
  },
  {
    "index": 2,
    "field": "result.success",
    "contract": "§3",
    "message": "`answered` requires result.success (bool). ..."
  }
]
```

The valid statement at index 0 is not stored either, since the batch as a whole is refused. The repository's TODO file reports that this rule was checked against a live queue, with two valid statements and one invalid producing zero queued messages, and a positive control showing that three valid statements produced three. The same file records that its first attempt at that test was a false pass, because it read the wrong column, which is why the positive control exists.

!!! mascot-tip "Read the Whole List"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a batch comes back rejected, sort the violations by `index` and fix every one before you resend. The gateway told you everything wrong in one response, so a second round trip means you skipped some of it.

The gateway returns different codes for different failures, and knowing them lets you debug from the network tab alone. The table restates what the code does.

| Situation | Response |
|-----------|----------|
| Missing or unrecognized bearer token | `401` |
| Missing or non-1.0.x `X-Experience-API-Version` header | `400` |
| Body is not valid JSON, or fails validation | `400`, with the violation list for validation |
| Queue full and broker unreachable | `503` with `Retry-After: 5`, described as page-worthy |
| Any other queueing failure | `500` |
| Whole batch durably queued | `200` with the array of statement ids |

The next specification lets you build a batch and watch the gateway's checks run.

#### Diagram: Gateway Request Simulator

<details markdown="1">
<summary>Gateway Request Simulator</summary>
Type: microsim
**sim-id:** gateway-request-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: demonstrate): The learner will demonstrate the gateway's five request steps and predict whether a batch is accepted or rejected in full.

Layout: the drawing region shows a batch of up to five statement cards on the left, five gateway step boxes in a column in the middle (authenticate, validate, assign ids, produce, respond) and a queue on the right. The control region below holds the controls.

Controls:

- Buttons "Add valid statement" and "Add broken statement" with a drop-down for the defect: wrong verb, answered without success, missing grouping, page IRI with a fragment
- Checkbox "Token is valid" (default on) and checkbox "Broker reachable" (default on)
- Button "Send batch" and button "Reset"
- A "Predict first" checkbox (default on) that asks "Accepted or rejected?" before the result is revealed

Behavior: sending the batch animates each card through the steps. If any statement is broken, all cards turn red at the validate step, the violation list appears with the index and field, and zero cards reach the queue. If the token is invalid the batch stops at 401. If the broker is unreachable and the local queue is full, the response is 503 with a Retry-After of 5.

Responsive design: the canvas width follows the container width on every window resize, the step column collapses to a vertical list under 500 pixels, and controls stay visible at 400 pixels wide.

Implementation: p5.js with createButton, createSelect and createCheckbox controls. Include a describe() call for accessibility. The rules mirror validation.py so the simulator can reuse its message text.
</details>

## The Event Stream

An **event stream** is an ordered, durable sequence of events that many independent readers can consume at their own pace. In the LRS, the stream is a log-based message queue: the gateway appends statements to it, and downstream workers read them. The stream sits between the ingestion plane and everything else for two reasons. It lets the gateway reply as soon as a statement is safely stored, and it lets slow consumers catch up later, or replay old events, without pushing back on producers.

The design uses **Redpanda** in development and Apache Kafka in production. Redpanda speaks the Kafka protocol, ships as a single binary and starts in about a second on a laptop, so the same client code runs against both. The stream is organized into topics, and each topic into partitions. A partition is one ordered lane of a topic: Kafka guarantees order within a partition and makes no promise across partitions. Because ordering is per lane, the choice of which lane a statement goes to matters a great deal.

The design defines six topics. The table summarizes them after this paragraph, so read the prose first. The raw topic carries live statements. A bulk topic carries backfill and replay, so that a district re-importing history never competes with live classroom traffic. A dead-letter topic is meant to hold rejected statements for inspection. A reconcile topic carries tasks for unknown textbooks and activities. A mastery-state topic checkpoints learner-model state. An audit topic carries the audit feed.

| Topic | Purpose | Design partitions | Retention |
|-------|---------|-------------------|-----------|
| `xapi.statements.raw` | Live ingest | 48 | 7 days |
| `xapi.statements.bulk` | Backfill and replay | 12 | 7 days |
| `xapi.statements.dlq` | Dead letters | 12 | 30 days |
| `lrs.reconcile` | Reconciliation tasks | 12 | 7 days |
| `lrs.mastery.state` | Learner-model checkpoints (compacted) | 48 | compacted |
| `lrs.audit` | Audit feed | 12 | 400 days |

Two status notes qualify the table. The TODO file says the development bootstrap creates the raw topic with 6 partitions, reduced from the design's 48. And although the topic exists, the gateway code logs a rejected batch and returns the violation list; it does not write rejected statements to the dead-letter topic.

### Partition by Learner

**Partition by learner** means choosing the message key so that every statement from one learner goes to the same partition. The gateway builds the key as the district id, a colon, and the learner's raw account identity, which is the home page and name joined by a vertical bar. The gateway holds no salt and never hashes, so the key uses the raw identity. The design's own words for why this matters: the ordering is what makes mastery estimation correct, not only what balances load. Sequential Bayesian updates do not commute, so "wrong, wrong, right" and "right, wrong, wrong" produce different estimates, as Chapter 18 showed. Keeping one learner's statements in one lane preserves the order they were produced in.

The specification originally said to partition by district, with the learner as a sub-key. The design document rejects that as a deviation, recorded as D-3 and still open. A single partition takes all of one key's traffic, so keying by district would put a 200,000-student district onto one lane, which is exactly the single-tenant hotspot the specification forbids. Keying by district and learner spreads traffic evenly while keeping per-learner order. Fairness between districts then comes from broker quotas, which bound each district's throughput.

A worked example uses three learners and two partitions. Learner A's statements always hash to partition 0, learner B's to partition 1, and learner C's to partition 0. A's five statements arrive in order at partition 0 and a processor reads them in that order. Interleaved with them are C's statements, which are unrelated and harmless. If the key were only the district, all three learners would share one partition, and a large district would saturate it.

!!! mascot-thinking "Order Is Evidence"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A learner who fails twice and then succeeds looks very different from one who succeeds and then fails twice. The partition key is what keeps those two stories from being shuffled together.

#### Diagram: Partition Key Simulator

<details markdown="1">
<summary>Partition Key Simulator</summary>
Type: microsim
**sim-id:** partition-key-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: compare): The learner will compare keying by district with keying by district and learner, in terms of per-partition load and per-learner ordering.

Layout: the drawing region shows a stream of colored statement dots (one color per learner) entering from the left, a row of partition lanes in the middle (default 6) and a consumer on the right that reads each lane in order. A load bar under each lane shows how many statements it holds. The control region is below.

Controls:

- Radio buttons "Key: district only" and "Key: district and learner" (default the second)
- Slider "Learners" from 3 to 60, default 12, and slider "Districts" from 1 to 4, default 2
- Slider "Partitions" from 2 to 12, default 6
- Button "Send burst" that emits 60 statements, and a "Pause" button

Behavior: each dot is routed by hashing the chosen key. With the district-only key, all of a district's dots land in one lane and its load bar overflows a red threshold line. With the learner key, load spreads evenly, and each learner's dots stay in one lane in their original order. Clicking a learner highlights the order in which the consumer read that learner's statements.

Responsive design: the canvas width follows the container width on every window resize, lane count adapts to the width, and controls remain visible at 400 pixels wide.

Implementation: p5.js with createRadio, createSlider and createButton positioned relative to the drawing height, and a simple deterministic string hash. Include describe() for accessibility.
</details>

## The Stream Processor

A **stream processor** is a worker that reads events from a stream, does work on each, and writes the results somewhere else. The LRS processor consumes the raw topic in batches of up to 1,000 statements or 200 milliseconds, whichever comes first, and runs a six-step sequence on each batch. The first step pseudonymizes the actor, using the salt fetched from the identity service. The second resolves the activity IRIs to known objects, and on a miss it emits a reconcile task and carries on, never blocking; that is how the design lets a textbook ship before its metadata is registered. The third enriches the statement with the section, version and concept identifiers. The fourth updates the learner's mastery estimate. The fifth writes the batch to ClickHouse in one insert. The sixth commits the queue offset, and only after the database has acknowledged the write.

That final ordering is the processor's safety rule. If the processor crashes after writing to ClickHouse but before committing the offset, the batch will be delivered again, and the store must cope. That leads to the property this chapter calls idempotent ingest, which we define next. The processor, like the identity service, is designed and not yet built. The TODO file is explicit that this is the critical path: with the gateway working and the processor absent, the ingest smoke test now fails one check later than it used to, at the point where the statement should appear in the log.

### Idempotent Ingest

**Idempotent ingest** means that receiving the same statement more than once has the same effect as receiving it once. It is necessary because the stream guarantees at-least-once delivery: a statement is never lost, but it may be delivered twice after a crash or a retry. The design achieves idempotency in two places. In the log, a ClickHouse table engine called ReplacingMergeTree keeps one row per statement id, which removes duplicates at merge time. And in the graph, the summarizer writes absolute values rather than increments.

A worked example shows why the second choice matters. Suppose a learner's concept summary reads 10 statements. Two new statements arrive and the summarizer writes the result. If it wrote `count = count + 2` and the batch was redelivered, the count would become 14, and nothing could reveal the error afterward. If it writes `count = 12`, computed from the log, then redelivery writes 12 again and the graph is unchanged. The design calls this rule "recompute absolutes, never increment", and it makes retries, replays and crashes safe by construction.

Deduplication in the log has a caveat that the design flags as a real correctness detail. ReplacingMergeTree removes duplicates eventually, when parts are merged, so readers go through a view that applies the engine's final-merge behavior. The repository's DDL defines that view as `lrs.statements_deduped`. The TODO file also records an unresolved defect nearby: a comment claiming that voided statements drop out of the rollups automatically is wrong, because a ClickHouse materialized view fires only on inserts and not on updates to stored rows. A retraction therefore needs a recompute of the affected key, and that path is not yet decided.

!!! mascot-encourage "Two Copies, One Effect"
    ![Bounce encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If at-least-once delivery feels slippery, that is normal, because most people need two passes at it. Try the simulation below with redelivery switched on and compare the "add" and "set" writers side by side before you read on.

#### Diagram: Redelivery and Idempotency Lab

<details markdown="1">
<summary>Redelivery and Idempotency Lab</summary>
Type: microsim
**sim-id:** redelivery-idempotency-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: justify): The learner will justify why writing absolute values, not increments, keeps a summary correct when statements are redelivered.

Layout: the drawing region shows a queue of numbered statements on the left, a processor in the middle, a log table with a deduplication indicator, and two summary counters on the right, one labeled "Writer A: count += 1" and one labeled "Writer B: count = recomputed from log". A truth line shows the correct count. The control region is below.

Controls:

- Button "Deliver next statement"
- Slider "Redelivery chance" from 0 to 50 percent, default 20
- Button "Crash before commit" that forces the last batch to be redelivered
- Checkbox "Deduplicate log by statement id" (default on)
- Button "Reset"

Behavior: each delivered statement adds one row to the log if its id is new. Writer A increments its counter on every delivery. Writer B recomputes its counter from the deduplicated log. After a redelivery, Writer A drifts above the truth line, and Writer B does not. With deduplication off, Writer B also drifts, and a message explains which layer failed.

Responsive design: the canvas width follows the container width on every window resize, and the counters stack vertically under 500 pixels wide, with controls visible at 400 pixels.

Implementation: p5.js with createButton, createSlider and createCheckbox controls. Include describe() for accessibility.
</details>

## ClickHouse and Neo4j

The LRS keeps two databases because they do two different jobs. **ClickHouse** is a column-oriented analytical database, and it is the system of record: every statement lands in it at full fidelity, and it answers aggregate queries over very large tables quickly. The **Neo4j Graph Database** is a graph store, and it holds structure and compact summaries, meaning the tenancy tree, the textbook contents, the concept prerequisite graph, experiments and the summary vertices described below. This division is the design's first and most consequential decision, recorded as ADR-001. The log is the truth, and the graph is a projection that can be rebuilt from it.

Three properties of the ClickHouse log table matter here. It is ordered by district first, then learner, then time, so every district-scoped query prunes on the primary key and cannot accidentally scan another district. It is partitioned by month, so retention becomes dropping a partition rather than rewriting data. And it stores a `raw` column holding the original statement, with the actor block replaced by the pseudonym, so any summary can be rebuilt by replaying the log. The design estimates roughly 22 GB per day of stored data at its target volume, about 4 TB for a 180-day school year, and about 28 TB at seven years of retention. Those are design estimates derived from assumed statement sizes and compression, not measurements.

The graph side needs three definitions. The **property graph data model** stores data as vertices with labels, edges with types, and properties on both. In this LRS, vertices include District, School, Course, Section, Student, Textbook, Page, MicroSim and Concept, and edges include `ENROLLED_IN`, `CONTAINS`, `COVERS` and `DEPENDS_ON`. The model holds exactly two kinds of thing: structure and compressed summaries. It deliberately has no statement vertex.

A **summary vertex** is a single graph vertex that compresses every statement at one analytical grain into one record. A grain is the key a summary is computed at. The specification defines six.

| Summary vertex | One vertex per |
|----------------|----------------|
| `ConceptMastery` | student and concept |
| `PageEngagement` | student and page |
| `MicroSimEngagement` | student and MicroSim |
| `QuestionResponse` | student and question |
| `LearningSession` | student and session |
| `SectionRollup` | section and concept |

Every summary vertex carries a `statements_compressed` count, so a report can always say how much evidence a number rests on. Summary vertices are projections, not sources of truth, and if one disagrees with the log, the log wins and the summary is rebuilt.

A worked example follows one grain. A student attempts a quiz question about a concept, watches a MicroSim on it and dwells on its page, generating perhaps 100 statements over a semester. In ClickHouse they are 100 rows. In the graph they become one `ConceptMastery` vertex, linked by `HAS_MASTERY` from the student and by `OF_CONCEPT` to the concept, with `statements_compressed = 100`. The design estimates about 100 to 1 for this grain, and it estimates section rollups near 3,000 to 1. Both are estimates from assumed usage, since no learner data has been collected through MicroSims yet.

The reason for the compression is write rate, and the numbers come from the design. At its target the LRS would receive about 144 million statements a day, and materializing each as a vertex would demand roughly 50,000 graph writes per second, which the design says no property graph sustains. Summarizing on a 60-second cadence, the design estimates about 2,500 upserts per second, and that figure barely moves during a fivefold burst, because a burst makes each active student emit more events, not more students exist.

The compressor is a set of ClickHouse materialized views, which are insert-triggered aggregations that update a small table as rows arrive. The summarizer reads changed rows and writes absolute values to Neo4j. The design's Cypher for one grain shows the shape. `MERGE` means "find the vertex with this key or create it", and the composite key is the grain itself.

```cypher
UNWIND $rows AS row
MERGE (s:Student {student_key: row.student_key})
MERGE (c:Concept {concept_id: row.concept_id})
MERGE (s)-[:HAS_MASTERY]->(m:ConceptMastery {student_key: row.student_key,
                                             concept_id:  row.concept_id})
MERGE (m)-[:OF_CONCEPT]->(c)
SET m.statements_compressed = row.statements_compressed   // absolute, never +=
```

A uniqueness constraint on each grain's key enforces the rule in the database. Because `(student_key, concept_id)` must be unique, the summarizer can only ever upsert one vertex per grain, and code that tried to write per-statement vertices would fail at its first write. The DDL and constraint files exist in the repository, but the TODO file says applying them is still done by hand: the `--apply-ddl` and `--apply-constraints` options of `lrs bootstrap` report "not implemented". And the summarizer is designed, not built.

!!! mascot-warning "A Summary Is Not the Evidence"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A count on a summary vertex tells you how much evidence was compressed, not what the evidence said. Anything the rollup drops, such as the engagement mode of a click, is gone from the graph and lives only in the log, so query the log when the detail matters.

#### Diagram: Log and Graph Compression Lab

<details markdown="1">
<summary>Log and Graph Compression Lab</summary>
Type: chart
**sim-id:** log-graph-compression-lab<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: examine): The learner will examine how summary vertices decouple graph write rate from ingest rate, using the design's published estimates as inputs.

Layout: two charts side by side above a control region. The left chart is a bar chart of ClickHouse rows and graph vertices for one simulated semester. The right chart is a line chart of graph upserts per second against ingest rate in statements per second, with a second line for "if every statement were a vertex".

Controls:

- Slider "Ingest rate" from 1,000 to 50,000 statements per second, default 10,000
- Slider "Sync cadence" from 5 to 300 seconds, default 60
- Drop-down "Grain" listing the six summary vertices
- Checkbox "Show design estimates" that overlays the design document's 5-second, 60-second and 300-second rows

Data: the per-grain ratios and cadence rows are the design document's estimates, labeled "design estimate, not measured". Hovering a bar or point shows the value and its source section.

Behavior: raising the ingest rate lifts the "every statement a vertex" line steeply and moves the summary line very little, and a note explains that a burst increases statements per grain, not the number of grains.

Responsive design: both charts resize with the container on every window resize event, stacking vertically under 600 pixels wide.

Implementation: Chart.js with a controls panel built in HTML and event listeners that update the datasets. Provide alternative text through aria-label on each canvas.
</details>

## The Twelve Core Functions

The specification lists its **twelve core functions** as F-1 through F-12, plus an extra row, F-7b, for statement compression, so the table actually has thirteen rows. Chapter 9 of the companion LRS textbook covers all of them. This chapter touches the ones on the ingestion path.

| Function | Where this chapter meets it |
|----------|-----------------------------|
| F-1 Statement storage | The processor's write to ClickHouse |
| F-4 Actor pseudonymization | The identity service and processor |
| F-5 Activity resolution | The processor's cache lookup and reconcile task |
| F-7b Statement compression | The rollups and the summarizer |
| F-10 Reconciliation | The reconciler matching provisional stubs |

The remaining functions, retrieval, voiding, concept mapping, mastery, progress, experiments, export and retention, mostly run after ingestion, and Chapter 21 picks up the reporting side of them.

## What Is Built, Designed and Hoped For

It is easy to read a detailed design and assume a running system. This section corrects that. The table separates three things, following the honesty rule that runs through the whole book.

| Component | Status, per the repository TODO dated 2026-09-26 |
|-----------|-------------------------------------------------|
| Gateway (auth, contract validation, ids, produce, respond) | Built, verified against a live Redpanda, with 28 contract tests reported |
| Topic bootstrap, ClickHouse DDL, Neo4j constraint file | Built as files; applying the DDL and constraints is manual |
| Demo seeder for districts and learners | Built; writes summary vertices directly and marks them seeded |
| Processor, identity service, summarizer, reconciler | Designed, not built |
| Analytics API and dashboards | Designed, not built |
| Emitters POSTing statements to the gateway | Not built |

That last row deserves a plain statement. The shared runtime from Chapter 17 has a transport seam and no network call by design, so no MicroSim currently sends a statement to any store, and the TODO file records that, when last inspected, the statement table in the development database held zero rows. It also warns that older notes reading "verified against live ClickHouse" meant that a person copied an emitted statement shape into a manual insert to test the DDL, which tests the schema and not the path from producer to store. The hoped-for part is the reason to build the chain at all: the hypothesis from Chapter 18 that these statements carry enough signal to predict mastery. That is untested. The scale targets, storage sizes and compression ratios are estimates from the design. Only the gateway's behavior has been measured, and only against a local development stack.

## Chapter Summary

- A **Learning Record Store** accepts, keeps and answers questions about xAPI statements, and the full LRS splits that work into five planes: ingestion, processing, storage, analytics and presentation.
- **Multi-tenancy** makes the school district the hard isolation boundary, with soft, role-based isolation below it, and rosters come from the district rather than the LRS.
- **Student privacy** is served by pseudonymous learner IDs derived with a per-district salt, kept apart from the analytics stores by a separate vault. The pseudonymizing components are designed, not built.
- The **ingestion gateway** authenticates, validates, assigns ids, queues durably and replies only after the queue acknowledges, and its only hard dependency is the queue.
- **Statement validation** in the built gateway enforces the whole producer contract, and an **all-or-nothing batch** returns every violation at once.
- The **event stream** (Redpanda in development, Kafka in production) is keyed by district and learner, so each learner's statements keep their order.
- The **stream processor** enriches statements and writes them to the log, and **idempotent ingest** comes from deduplication in the log plus absolute writes to the graph.
- **ClickHouse** holds every statement, the **Neo4j graph database** holds structure and **summary vertices**, one per grain, in a **property graph data model** with no statement vertex.
- Only the gateway, the DDL and constraint files, the topic bootstrap and a demo seeder exist. No emitter posts to it yet, and the numbers quoted are design estimates.

!!! mascot-celebration "You Can Trace a Statement"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now follow one xAPI statement from a slider drag through the gateway's all-or-nothing check, the learner-keyed stream, idempotent ingest and the log, down to a single summary vertex. You can also say which of those pieces are built and which are still plans.

The next chapter turns from ingestion to the people who use the results, covering the dashboards, operations and compliance work that make the stored evidence useful to teachers and administrators.

