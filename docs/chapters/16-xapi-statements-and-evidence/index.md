---
title: xAPI Statements and Evidence
description: Explains the anatomy of an xAPI statement, the three MicroSim verbs, the producer contract, and the evidence classes and thresholds that separate meaningful interaction from noise.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:07:59
version: 1.10
---

# xAPI Statements and Evidence

## Summary

Introduces xAPI statements, the three MicroSim verbs, the producer contract, and the evidence classes that separate meaningful interaction from noise.

Students learn actor, verb, object, result and context, activity identifiers, concept identifiers, and the thresholds below which an interaction does not count. After it, they can say which interactions in a MicroSim are evidence and of what.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| xAPI | 2196 |
| xAPI Statement | 2195 |
| Actor | 7 |
| Verb | 1305 |
| Object | 18 |
| Result | 6 |
| Context | 12 |
| Activity IRI | 17 |
| Answered Verb | 461 |
| Experienced Verb | 424 |
| Interacted Verb | 419 |
| Producer Contract | 413 |
| Canonical Site URL | 15 |
| Concept ID Extension | 11 |
| Result Extensions | 5 |
| Evidence Class | 211 |
| Continuous Parameter Evidence | 3 |
| Discrete Inspection Evidence | 3 |
| Run and Pause Evidence | 2 |
| Page Dwell Evidence | 1 |
| Assessment Evidence | 28 |
| Focus Loss Handling | 2 |
| Non-Evidence Threshold | 9 |
| Hover Threshold | 1 |
| Misclick Threshold | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 6: p5.js MicroSims](../06-p5js-microsims/index.md)
- [Chapter 10: Image Overlays and Comparison Posters](../10-image-overlays-and-comparison-posters/index.md)
- [Chapter 15: Metadata, Search and Reuse](../15-metadata-search-and-reuse/index.md)

---

!!! mascot-welcome "Every Bounce Leaves Evidence"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Up to now you have built MicroSims that learners can play with. This chapter teaches you the language a MicroSim uses to report what a learner actually did, so that you can tell a meaningful interaction from a stray mouse movement. Let's bounce it around!

The first fifteen chapters were about making MicroSims: choosing a type, generating the code, checking the layout, and describing the result with metadata. None of that tells you whether anyone learned anything. A MicroSim that sits in a page and reports nothing is a black box, and the central question of this book, how well does what a learner does inside a MicroSim predict mastery of a concept, cannot even be asked of a black box. This chapter defines the vocabulary of the answer: the statement format a MicroSim uses to describe a learner's action, the small set of rules that keeps every MicroSim's statements consistent, and the classification that decides which interactions deserve to be recorded as evidence.

A note on status before we begin. Everything in this chapter describes a design and a working runtime, not a body of collected data. As of the learning-record-store repository's `TODO.md` dated 2026-09-26, the emitters build well-formed statements and can display them, but no emitter sends statements to a store yet. No learner data has been collected through MicroSims, so whenever this chapter says an interaction is *evidence* of something, it means "designed to be treated as evidence, under a rule we can test," never "shown to predict mastery." Chapter 19 describes how that testing would work.

## xAPI: A Shared Grammar for Learning Events

The **xAPI**, short for Experience API (also called Tin Can), is an open specification for describing learning experiences as machine-readable records and for exchanging those records between systems. The version this book's producer contract targets is 1.0.3, which appears as the `X-Experience-API-Version` header the contract specifies for sending statements. The specification does not say what to teach or how to teach it. It defines a grammar, a fixed shape for saying "someone did something," so that a slider in a MicroSim, a quiz in a learning management system and a simulator on a factory floor can all write to one shared record without agreeing on anything else in advance.

Three roles appear whenever xAPI is discussed. An *activity provider* is any software that observes a learner's action and produces a record of it; in this book, that is a MicroSim. A *learning record store*, abbreviated LRS, is the service that receives, stores and answers queries about those records. A *consumer* is any dashboard, report or model that reads records back out. This chapter concerns the producer side. The stores are the subject of Chapters 20 through 23, and the model that consumes the evidence is the subject of Chapter 18.

Why adopt a standard instead of inventing a private log format? A private format is quicker to write but locks every later tool to your particular field names. With a shared grammar, a dashboard written for one textbook works on another, a store can validate incoming data without knowing the textbook, and a researcher can compare two courses. The cost is that the grammar is strict, and the strictness is what the rest of this chapter is about. For a fuller treatment of the standard itself, see the separate xAPI course book at `/Users/dan/projects/xapi-course`, whose Chapter 2 walks through every field of the statement.

### The xAPI Statement

The unit of xAPI is the **xAPI statement**: one JSON object that records one thing that one learner did, at one moment, to one activity. JSON, short for JavaScript Object Notation, is a plain-text format built from named fields, each holding a value, and it is the format every web tool already reads. A statement is deliberately shaped like a sentence, "the learner answered question 3," and it is that sentence structure that makes statements from unrelated systems comparable.

The specification requires three parts, the subject, the verb and the object, and lets a statement carry two more, a result and a context. We will define all five in turn. Two other top-level fields appear on almost every statement a MicroSim produces: an `id`, a universally unique identifier that names the statement itself, and a `timestamp`, the moment the learner acted, written in ISO 8601 format (a standard way of writing dates and times, such as `2026-07-16T14:22:03Z`). The producer contract adds that the timestamp is the producer's, the time of the event, while the moment a store received the statement is stamped later by the store.

A statement is a record of *behavior*, not of *learning*. Nothing in the format says whether the learner understood anything; it says only what happened. That distinction drives the whole second half of the chapter, because the choice of which behaviors to record, and how much weight to give each, is where instructional judgment enters.

## The Five Parts of a Statement

Before we assemble a complete statement, we define each part separately. Keep the sentence analogy in mind: "Student 42 answered question 3 correctly, in the context of Chapter 5."

### Actor

The **actor** is the learner, or occasionally a group, to whom the statement's action belongs. The xAPI specification requires that an actor be identified by exactly one *inverse functional identifier*, a value that is globally unique on its own with no central registry. The four types the xAPI course book lists are an email address in `mbox` form, a hashed email in `mbox_sha1sum`, an `openid` URI, and an `account`, which pairs a `homePage` (the system the account lives in) with a `name` (the identifier inside that system).

MicroSim statements use the `account` form. A worked example clarifies why. Suppose a school district runs its own learner accounts. The MicroSim would send `homePage` set to the district's address and `name` set to the learner's account name, and the two together identify one person across every book the district uses. The producer contract states the privacy rule that follows: the producer sends the real account name and must not pre-hash it, because the pseudonym is derived once, on the store side, using a per-district salt. In the current runtime the actor is a placeholder: every emitter uses a single account named `demo-student` under the demo address `https://demo.example.edu`, and the contract lists real actor handling as future work rather than a solved problem.

The design consequence is worth stating plainly. The actor is the one place personal identity enters the system, so the contract confines it there and forbids producers from sending several store-side fields at all: `district_id`, `student_key`, `stored_at`, `section_id`, `voided_by` and `provisional`. Chapter 24 returns to what this means for privacy and ethics.

### Verb

The **verb** names the action the actor performed. In xAPI a verb is not a bare word but an identifier in the form of an IRI, an internationalized resource identifier, which is the web-address format (such as `http://adlnet.gov/expapi/verbs/answered`) used as a globally unique name. The statement also carries a `display` map that gives the same verb a human-readable label such as `answered`. Stores index and match on the IRI, never on the label, so two systems that use the same IRI mean the same verb.

The xAPI community publishes vocabularies containing dozens of verbs, and most projects are tempted to use many of them. This book takes the opposite position, and the reasons appear in the section on the three MicroSim verbs below. For now, note that the verb is the field that answers "what kind of evidence is this?", so a small, strict verb set makes every downstream tool simpler.

### Object

The **object** is the thing acted upon. In a MicroSim statement it is always an *activity*: something with an IRI as its identifier, a `definition` that carries a human-readable name, and a `type`. Section "Naming Things" below explains how the identifier is built. The type is more subtle than it looks, because a MicroSim contains several kinds of thing that a learner can act on. The contract distinguishes four, which we list here so the later sections can use the names.

- A **Page** is an ordinary textbook page, typed with the ADL `lesson` activity type.
- A **MicroSim** is an interactive page as a whole, typed `simulation`, with no fragment in its identifier.
- A **Question** is a single checked item, typed `cmi.interaction`.
- A **Control** is a sub-part of a page such as a slider or a diagram node, typed `interaction`.

Notice that `cmi.interaction` (Question) and `interaction` (Control) differ by only four characters yet mean entirely different things. The contract acknowledges this as an unfortunate inheritance from the ADL vocabulary, and the runtime's builder rejects any type other than these four.

### Result

The **result** describes the outcome of the action. It is optional in the xAPI specification but carries the fields that most matter for evidence. The fields MicroSims use are `success` (true or false), `score` with a `scaled` value from 0.0 to 1.0, `response` (what the learner chose or typed), `duration` (how long the action took, written as an ISO 8601 duration such as `PT4M12S`, meaning four minutes and twelve seconds), and `extensions`, a free-form map for anything else. Which fields are required depends on the verb, as the next section shows.

### Context

The **context** places the action in its setting. Its most important part is `contextActivities`, which lists related activities in named buckets. MicroSim statements use two buckets. The `grouping` bucket holds the *textbook version* the learner was reading, and the contract requires it on every statement. The `parent` bucket holds the page a question or control belongs to. The context also holds `extensions`, and the one extension every mapped statement carries is the concept identifier, which we define later in this chapter.

A complete example ties the five parts together. The statement below is the contract's own reference statement, lightly shortened, for a learner answering question 2 on a page of the learning-record-store book. Read it against the definitions above: the actor is an `account`, the verb is `answered`, the object is a `Question` (note the `cmi.interaction` type), the result carries `success`, `score` and `duration`, and the context carries both buckets and one extension.

```json
{
  "actor": {
    "objectType": "Agent",
    "account": {"homePage": "https://demo.example.edu", "name": "student-0042"}
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/answered",
    "display": {"en-US": "answered"}
  },
  "object": {
    "objectType": "Activity",
    "id": "https://dmccreary.github.io/learning-record-store/sims/lrs-data-model/#q2",
    "definition": {
      "type": "http://adlnet.gov/expapi/activities/cmi.interaction",
      "name": {"en-US": "How many PageEngagement vertices exist?"}
    }
  },
  "result": {"score": {"scaled": 0.9}, "success": true, "duration": "PT4M12S"},
  "context": {
    "contextActivities": {
      "grouping": [{"id": "https://dmccreary.github.io/learning-record-store/textbook/lrs/v1.0.0"}],
      "parent":   [{"id": "https://dmccreary.github.io/learning-record-store/sims/lrs-data-model/"}]
    },
    "extensions": {"https://w3id.org/lrs/ext/concept_id": "compression-ratio"}
  },
  "timestamp": "2026-07-16T14:22:03Z"
}
```

The next specification lets you take such a statement apart yourself. Every term it uses, actor, verb, object, result and context, was defined above.

#### Diagram: xAPI Statement Field Explorer

<details markdown="1">
<summary>xAPI Statement Field Explorer</summary>
Type: microsim
**sim-id:** xapi-statement-field-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the five parts of an xAPI statement by selecting a line of a real statement and stating which part it belongs to and what question it answers.

Layout: the left two-thirds of the canvas shows a formatted JSON statement, one line per row, in a monospaced font on an aliceblue background. The right third is an infobox panel. The bottom strip is a white control region.

Data: three built-in statements taken from this chapter's examples: an `answered` statement for a question, an `interacted` statement for a slider, and an `experienced` statement for a run. Each line is tagged with one of the five parts (actor, verb, object, result, context) or "housekeeping" for `id` and `timestamp`.

Controls and interactions:

- Clicking a line highlights the whole part it belongs to, using one color per part, and the infobox shows the part's name, the question it answers ("who", "did what", "to what", "how did it go", "in what setting") and the definition from this chapter.
- Hovering a line shows a one-line tooltip with the field's plain-language meaning.
- A dropdown "Statement" switches between the three built-in statements.
- A checkbox "Quiz me" hides the colors and asks the learner to click the line that carries a named property, such as "the line that says whether the answer was right", and then shows whether the choice was correct.
- A "Score" readout counts correct quiz answers out of attempts.

Default state: the `answered` statement is shown with no line selected and "Quiz me" off.

Responsive design: the canvas width follows the container on every window resize; below 500 pixels the infobox moves under the statement. Sliders and buttons remain visible at 400 pixels wide.

Implementation: p5.js with createSelect and createCheckbox controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Naming Things: Activity IRIs and the Canonical Site URL

A statement is only useful if two statements about the same page use exactly the same identifier for it. That sounds obvious, and the producer contract exists partly because the first attempt at it went wrong, as the next paragraphs show.

The **activity IRI** is the identifier stored in `object.id`. For a page or a MicroSim, the contract's rule is that the identifier is the site's base address plus the page's navigation path, with a trailing slash. An IRI is an *identifier*, not a promise that something will load: it need not resolve at the moment a statement is stored, but it must never change when the site moves.

The base address is the **canonical site URL**, the `site_url` value in the book's `mkdocs.yml`. It is *not* whatever address the learner's browser happens to show. A statement emitted while an author previews the book locally on `127.0.0.1` must still carry the published address, never the local one, so that test traffic and real traffic name the same page. This book's own `mkdocs.yml` gives `https://dmccreary.github.io/microsims` as its `site_url`; the runtime adds the trailing slash if the configuration omits it.

Two mistakes have concrete costs, and the contract records both from its own history. The first is citing `main.html`, the file that holds the iframe payload of a MicroSim. MkDocs renders a MicroSim's `index.md` at `/sims/name/` and copies `main.html` alongside it, so one activity would gain a second identifier. The store's page rollup groups by object identifier, so the same learner's visit would land in two rows that never merge. The second is the trailing slash: `.../sims/x/` and `.../sims/x` are different strings to a store that groups by identifier. The runtime avoids the first mistake by construction. Its `pageIri()` function derives the identifier from the page location, strips a trailing `main.html` or `index.html`, and appends the slash, so an emitter cannot supply a wrong page identifier at all.

Pages are only part of the naming problem. A page can hold several named sub-activities, such as a slider, a diagram node or a quiz question, and each needs an identifier of its own. The contract solves this with a URL fragment, the part after `#`. The rule is that the fragment is the sub-activity's *most stable local name*, and the test for any naming scheme is a single question: would an edit that does not change what the thing *is* change its identifier? If yes, the scheme is wrong. Three cases follow from that test.

| Thing | Fragment style | Example | Why |
|---|---|---|---|
| A control | its slugified name | `#speed-slider` | a control's identity is its name |
| A diagram node | its slugified stable key | `#hypothesis` | reordering the diagram must not re-point the identifier |
| A question in a fixed order | `#q` plus its one-based number | `#q1` | the number the learner sees is the question's identity |
| A question in a shuffled or generated order | `#q-` plus what it asks about | `#q-nucleus` | a position changes on every reload, so it is not an identity |

The one-based numbering has its own history. The first draft of the contract chose zero-based numbers, inferred from a test script, and the inference turned out to be reading a latent off-by-one error: a statement named "the third question" carried `#q2`. The fix was to number questions the way the learner sees them. The shuffled case was found by building a real image-overlay MicroSim whose quiz reshuffled on every load, which would have merged answers about six different structures into six position-keyed rows, a result the contract calls worse than collecting nothing "because it looks like data."

!!! mascot-tip "One Question Names a Fragment"
    Before you invent a fragment, ask: if I reword this label or reorder this list, does it stay the same thing? If yes, name the fragment for what the thing is (`#speed-slider`), never for where it sits (`#control-3`).

The worked example below shows the two fragment styles for a single MicroSim page whose site is the learning-record-store book. The page identifier has no fragment and is typed as a MicroSim, while the slider and the question each get a fragment and a type.

| Object | Identifier | Type |
|---|---|---|
| The page itself | `https://dmccreary.github.io/learning-record-store/sims/animal-cell/` | MicroSim |
| A hotspot the learner inspects | `.../sims/animal-cell/#nucleus` | Control |
| A shuffled quiz item about the same hotspot | `.../sims/animal-cell/#q-nucleus` | Question |

The last two rows share a pixel on screen but are different activities, and the contract's "one object, one type" rule says the user-interface mode never changes an object's type. Inspecting a thing and being asked to find it are different acts, and if two acts need different `result` fields to be honest, they are different objects. An inspection has no `success` to report; an answer must. The two objects meet again at the concept, not at the identifier.

#### Diagram: Activity IRI Builder

<details markdown="1">
<summary>Activity IRI Builder</summary>
Type: microsim
**sim-id:** activity-iri-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: construct): The learner will construct a correct activity IRI for a page, a control and a question, and diagnose why a malformed IRI is wrong.

Layout: a top region shows the IRI being assembled as colored segments (site URL, path, fragment). A middle region shows a preview of how a store would group the result. The bottom white region holds the controls.

Controls and data:

- Text field "site_url" with a default of `https://dmccreary.github.io/microsims`, and a note that a missing trailing slash is added by the runtime.
- Dropdown "Page path" listing five sample paths such as `sims/bouncing-ball/` and `chapters/01-what-is-a-microsim/`.
- Dropdown "Sub-activity" with the options none, control, node, fixed-order question and shuffled question, plus a text field for its name or number.
- Dropdown "Where is the page loaded from" with the options published site, local preview and iframe payload `main.html`.
- Dropdown "Show a mistake" with the options none, uses main.html, missing trailing slash, local origin, zero-based question number, positional fragment for a shuffled quiz.

Interactions: every change rebuilds the IRI live. Clicking a segment shows the rule behind it. When a mistake is chosen, the grouping preview shows one learner's visit splitting into two rows and the offending segment turns red with its reason. The "Where is the page loaded from" choice never changes the correct IRI, which demonstrates that the identifier is independent of the address the browser shows.

Default state: published site, a page with no fragment, no mistake.

Responsive design: the canvas width follows the container on every window resize, and the segment display wraps below 500 pixels. All controls remain visible at 400 pixels wide.

Implementation: p5.js with createInput, createSelect and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Connecting a Statement to a Concept

An identifier tells a store *which page or control* the learner acted on. It does not say which idea the action is evidence about, and a textbook's learning graph is organized by ideas, not by pages. The **concept ID extension** carries that link. It is a single entry in the context's `extensions` map, keyed by `https://w3id.org/lrs/ext/concept_id`, whose value is one concept identifier string.

The identifiers come from the book's learning graph. Every book numbers its concepts 1 to N, so number 42 collides across books. The learning-record-store repository therefore namespaces each identifier with a prefix derived from the repository name, in the form `{conceptPrefix}-{ConceptID}`, giving values such as `learning-record-store-353`. Inside a MicroSim, the runtime's `LRS.conceptId(353)` builds that string from the book's configuration file so that the prefix is never typed by hand. Note that the contract's own reference statement uses a readable slug, `compression-ratio`, and the runtime's demonstration sims use slugs for concepts that are not in a learning graph; the concept-mapping reference warns never to mix the two forms silently inside one sim.

Three rules govern the extension, and each protects against a specific failure. First, a statement carries *one* concept, because the contract's version 1 cannot express several; when a diagram node covers more than one concept, you pick its primary concept and record the others in your notes. Second, the extension is *authoritative* when present, and when it is absent the statement is excluded from the store's per-concept rollup by that rollup's own filter, so the statement still lands in the log but contributes no concept evidence. Third, when no concept matches an object, you leave the concept unset and say so. The concept-mapping reference puts the reason bluntly: a statement with a wrong concept identifier is worse than none, because it silently credits mastery of something the learner never touched.

The worked example below shows the choice. A sine-wave MicroSim has an amplitude slider, a frequency slider and a Start/Pause button. The amplitude slider's movements are evidence of the *amplitude* concept, not of the broader *sine wave* concept, so the slider's statements carry the amplitude concept. The run interval is evidence of engagement with the simulation as a whole, so it carries the page-level concept. A checked question carries the concept it tests, and an inspection and a question about the same thing carry the same concept, which is where they reconverge.

!!! mascot-thinking "Concepts Are Where Acts Meet"
    Notice the pattern: identifiers keep different acts apart, while the concept brings related acts back together. Exploring a hotspot and answering a question about it have different identifiers but one concept, so the evidence adds up in the right place.

## The Result Fields and Result Extensions

We defined the result earlier as the outcome of the action. The producer contract gives each field a job, and understanding the jobs explains why some statements are strict and others are lenient.

`success` is a Boolean, and its presence decides whether the store counts the statement as an attempt. The store's concept rollup counts attempts as the statements whose `success` is present, so a statement without `success` reports zero attempts however many times it occurs. `score.scaled` is a number from 0.0 to 1.0 used when an item is scored partially. `duration` feeds the store's dwell total, the only field that does. `response` holds what the learner chose. Everything that does not fit those four goes into `extensions`.

The **result extensions** are named additions inside `result.extensions`. In code an emitter writes a short key such as `value` or `action`, and the runtime qualifies it to a full IRI under `https://w3id.org/lrs/ext/`, exactly once, so every emitter uses the same namespace. A key that is already an absolute address is passed through unchanged. The examples that appear in the contract and runtime are these.

| Short key | Carried by | Meaning |
|---|---|---|
| `value` and `previous-value` | a slider statement | the value the learner moved to and the value it replaced |
| `action` | a button press | `start` or `pause`, for example |
| `engagement-mode` | an inspection | how the learner engaged: hover, click, pinned, and similar |
| `run-ended-by` | a run's `experienced` statement | why the run ended |

There is a caution here that a careful reader should not skip. The digest of the contract notes that several extension names the runtime emits, including `action`, `engagement-mode` and `run-ended-by`, are not yet listed in the contract's own tables, and it advises against adding new extension names casually because "each one is a future schema entry." Treat these names as the current runtime's vocabulary rather than as a settled standard.

A slider example shows the extensions at work. The statement below records a learner moving a speed slider from 3 to 4 on a bouncing-ball MicroSim. All values are illustrative, chosen to match the shape the contract's digest gives for a slider statement, and the identifiers use the learning-record-store book's site as the reference implementation does.

```json
{
  "verb": {"id": "http://adlnet.gov/expapi/verbs/interacted", "display": {"en-US": "interacted"}},
  "object": {
    "objectType": "Activity",
    "id": "https://dmccreary.github.io/learning-record-store/sims/bouncing-ball/#speed-slider",
    "definition": {
      "name": {"en-US": "Speed Slider"},
      "type": "http://adlnet.gov/expapi/activities/interaction"
    }
  },
  "result": {
    "extensions": {
      "https://w3id.org/lrs/ext/value": 4,
      "https://w3id.org/lrs/ext/previous-value": 3
    }
  }
}
```

The actor, context and timestamp are omitted here so that the extensions stand out. Notice that the statement has no `success` and no `duration`: a slider movement is neither an answer nor an interval, and forcing either field onto it would make the verb carry a meaning it does not have.

## The Three MicroSim Verbs

Now we can explain the decision the contract makes about verbs. Exactly three verbs are valid in version 1 of the contract, and the gateway is specified to reject a statement with any other verb. Each verb has a job, a required result field, and a clear test for when to use it.

### Answered

The **answered verb** (`http://adlnet.gov/expapi/verbs/answered`) records a checked attempt at a question. Its required result field is `success`, a Boolean, with `score.scaled` added when the item is scored. It is the only verb that can report whether the learner was right, and so it is the only one that contributes real attempts to a mastery estimate. Use it whenever the MicroSim checks a response against a right answer, whatever the interface looks like: a multiple-choice item, a drag-to-bin sort, a checked prediction, or a "goal reached" banner all qualify.

The contract explains why `answered` is not merged with the other verbs. A verb called `completed` was considered and left out, because a `completed` statement carries no `success`, so a store's attempt count would read zero for every learner. Adding it later means deciding what it should mean for mastery first. The runtime backs this up: when an `answered` statement lacks `success`, its validator prints a console warning that attempts will stay at zero.

A worked example shows why every attempt is emitted, including the wrong ones. In an image-overlay quiz with six hotspots, a learner who clicks every marker in turn will eventually hit the right one. The contract's log of such a case shows three clicks at one question producing three `answered` statements with `success` values false, false and true. Recording only the final success would make this learner look identical to one who knew the answer at once, one attempt and one success, when in fact the interaction plainly disproves it. The full sequence is what a knowledge-tracing model reads, and Chapter 18 explains how. For a click-to-identify quiz, the contract argues, the sequence "is the signal," not noise around it.

There are two limits on this rule, both stated in the runtime's guidance. Checking the same choice twice is not a new attempt, and neither is a choice made after the correct answer was revealed. Both follow from one principle: do not report success the interaction does not support.

### Experienced

The **experienced verb** (`http://adlnet.gov/expapi/verbs/experienced`) records time spent with a page or a MicroSim. Its required result field is `duration`, the ISO 8601 length of the interval. The object is the page itself, typed as a MicroSim, with no fragment. It is exposure evidence: it says the learner spent time here, and it says nothing about understanding.

The most common use is a *run*, the interval between a learner pressing Start and pressing Pause. The contract's rule is that one Start and Pause pair produces exactly one `experienced` statement, emitted on Pause, carrying the elapsed time. Nothing is emitted on Start, because an interval that never closes is one nothing can score. The contract rejects the more obvious design of a `started` verb and a `paused` verb, reconstructing the duration by pairing them, for three reasons: it doubles the statement volume for no new information, it forces the reader to rebuild the duration (which is unreliable when delivery can repeat or reorder statements), and it leaves unclosed intervals whenever a learner never pauses. The chosen pattern degrades gracefully: the worst case is a missing interval, never a wrong one. The same reasoning explains a rule that seems arbitrary: every MicroSim must load *paused*, because an auto-running MicroSim would emit dwell the learner never chose to spend.

Repeated cycles are simply repeated statements. Start, Pause, Start, Pause emits two `experienced` statements, which the store's page rollup sums into one row.

### Interacted

The **interacted verb** (`http://adlnet.gov/expapi/verbs/interacted`) records a learner manipulating or inspecting a control. It requires no result field; the values go in the result extensions. It was added to the contract on 2026-07-16 because the other two verbs could not describe what MicroSims already did. A slider movement is not an answer, since it has no `success`, and it is not dwell, since it has no interval.

`interacted` statements are real evidence, but of a weaker kind. They carry a concept identifier, so they count toward the concept's compression total in the store's rollup, yet they contribute zero attempts. A quick summary of the three verbs follows, now that each has been explained.

| Verb | Object | Required result | What it can say |
|---|---|---|---|
| answered | Question | `success` | the learner was right or wrong on a checked item |
| experienced | MicroSim or Page | `duration` | the learner spent this long with it |
| interacted | Control | none | the learner touched this control, with these values |

!!! mascot-thinking "Only One Verb Can Say Right or Wrong"
    Think of the three verbs as a ladder of strength. Time and touches show that a learner was present; only a checked answer shows what they could do. Any claim about understanding has to rest on `answered`.

The next specification asks you to classify events by verb, which is the skill this section teaches.

#### Diagram: Three Verb Classifier

<details markdown="1">
<summary>Three Verb Classifier</summary>
Type: microsim
**sim-id:** three-verb-classifier<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: classify): The learner will classify learner actions in a described MicroSim into the correct verb, object type and required result field, and explain any action that needs no statement.

Layout: an upper scene panel shows a small mock MicroSim (a slider, a Start/Pause button, a diagram with three nodes and a one-question check). A lower panel holds three verb bins labeled answered, experienced and interacted, plus a fourth bin labeled "no statement".

Data: twelve scripted learner events, for example "moves the speed slider from 3 to 4", "presses Start, waits 40 seconds, presses Pause", "picks option B on the checked prediction, which is wrong", "presses Start and Pause 100 milliseconds later", "clicks the same wrong option a second time" and "sweeps the pointer across four nodes in under half a second".

Controls and interactions:

- Each event card can be dragged into a bin, or selected and assigned with a button, so the task works by keyboard.
- After placement, an infobox shows the correct verb, the object type (Page, MicroSim, Question or Control), the required result field and one sentence of reasoning drawn from this chapter.
- A "Show statement" button renders the resulting statement's verb, object and result in JSON.
- A running score and a "Try again" button that reshuffles the twelve events.

Default state: events shuffled, all bins empty, score 0 of 12.

Responsive design: the canvas width follows the container on every window resize; the bins stack vertically below 500 pixels. All buttons remain visible at 400 pixels wide.

Implementation: p5.js with drag handling in mousePressed, mouseDragged and mouseReleased, keyboard-accessible button alternatives, and a describe() call for accessibility.
</details>

## The Producer Contract

You have now met most of the individual rules. The **producer contract** is the document that gathers them into one binding specification for everything that emits statements. The repository's `docs/specs/xapi-producer-contract-v1.md` is its normative text, version 1.0.0, last updated 2026-07-16 in the copy this chapter used, and it is marked as binding for the minimum viable product. It exists because the store's design deliberately left the producer side undefined, so the store's data definitions consumed fields that nothing was obliged to send.

Each rule in the contract carries a tag that tells you how firm it is: *ratified* (already true in code, now binding), *resolved* (a real disagreement settled with evidence), *new* (the design was silent, so the contract decides) and *open* (needs a decision). That tagging is itself good practice for a standard that will change. The table below summarizes the rules an instrumented MicroSim must never break, using the section numbers of the contract's own digest.

| Section | Rule in one line | Where enforced |
|---|---|---|
| 1 | A page's IRI is the canonical site URL plus the navigation path, with a trailing slash; never `main.html`, never local | derived by `LRS.pageIri()`, checked by a validator warning |
| 2 | A sub-activity's fragment is its stable local name; fixed-order questions are `#q{N}`, one-based | the author, because the runtime cannot know whether a key is stable |
| 3 | Exactly three verbs; `answered` needs `success`, `experienced` needs `duration` | the builder throws on other verbs and warns on missing fields |
| 4 | `grouping[0]` is the textbook version IRI on every statement; `parent[0]` is the page for answers and controls | the builder, from the book's configuration |
| 5 | Four object types: Page, MicroSim, Question, Control; one object, one type | the builder throws on other types |
| 6 | One concept identifier per statement, in the concept ID extension | the author, through a `concept` option on every handle |
| 7 | One `experienced` per run, emitted on Pause; nothing under 250 ms | the runtime's run handle |
| 8 | Producers never send `district_id`, `student_key`, `stored_at`, `section_id`, `voided_by` or `provisional` | the builder does not set them |
| 9 | Transport is a JSON array sent by POST, accepted or rejected as a whole | not built yet |

Two of these need a further sentence. The grouping rule in section 4 means every statement can be attributed to a specific *version* of a textbook, so that a statement can later be replayed against the content it described; its form is the site URL, then `textbook/`, then a textbook identifier, then a version. For this book the identifier and version come from the book's `lrs-config.js` file, which the installer generates from `mkdocs.yml`. And section 9's transport rule reads: the request is a POST to `/xapi/statements` with a JSON array body, and the whole batch is rejected if any statement in it is invalid. The design keeps `id` optional for now, but the contract warns that a producer that omits `id` cannot be deduplicated if the store later adds retry protection.

The contract is honest about what it has not settled, and a reader relying on it should be as well. Its open items include the fact that multi-concept statements cannot be expressed, that the same MicroSim embedded in two textbooks merges in every rollup because the store's rollups do not key on the textbook, and that a control's duration currently reaches no rollup. The second item has a sharp consequence the contract states directly: "a student skimming because they already met the material in physics looks identical to a student who did not engage," so low engagement is not evidence of low mastery.

The most important open caveat concerns the contract's own validation. The runtime file `lrs-xapi.js` enforces the rules, and the contract calls that "the producer marking its own homework": until a store validates statements on receipt, "conforms to the contract" means "conforms to one JavaScript file's reading of it." No statement produced by a MicroSim has yet been sent to a store, and this chapter should be read with that in mind.

The following worked example uses the contract to audit a malformed statement. Suppose a hand-written emitter produces an `interacted` statement with the object identifier `http://127.0.0.1:8000/sims/sine-wave/main.html`, typed `simulation`, and no grouping in its context. Checking the table gives four violations at once: the identifier is not the published canonical address (section 1), it is not absolute HTTPS and it names the payload file (section 1 again), a slider is a Control whose identifier must carry a fragment and whose type should be `interaction` rather than `simulation` (sections 2 and 5), and the required grouping is missing (section 4). The contract's own history shows this is not contrived: the older sine-wave emitter was found to be wrong twice in its identifier, and fixing it uncovered five more wrong URLs in the same file.

!!! mascot-warning "The Fix Is Rarely One Line"
    A wrong identifier usually hides a wrong kind of thing, not just a wrong address. When the contract's authors fixed a bad `main.html` address, they found a page URL sitting where the textbook version belonged, and a search-and-replace would have made it look correct while staying wrong. Recheck every field of a statement against the table, not only the field you were fixing.

The next specification turns that audit into a practice exercise.

#### Diagram: Contract Violation Finder

<details markdown="1">
<summary>Contract Violation Finder</summary>
Type: microsim
**sim-id:** contract-violation-finder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: critique): The learner will critique a candidate xAPI statement against the producer contract's rules and justify each violation by section number.

Layout: the upper region shows one candidate statement as formatted JSON, one field per row. The right panel lists the nine contract rules as a checklist. The bottom white region holds the controls.

Data: eight candidate statements, each valid or containing one to three planted violations drawn from the rules in this chapter: a `main.html` identifier, a missing trailing slash, a local origin, a verb outside the three (for example `completed`), an `answered` with no `success`, an `experienced` with no `duration`, a missing `grouping`, a slider typed as a MicroSim, a shuffled quiz question with an ordinal fragment, and a run under 250 milliseconds that still produced an `experienced`.

Controls and interactions:

- Clicking a JSON row flags it as suspect; clicking a rule in the checklist links the flag to that rule.
- A "Check my answer" button reveals the planted violations, marks each flag correct, missed or false alarm, and explains the correct rule in one sentence.
- A "Next statement" button advances; a "Show hint" button highlights the section of the statement in which a violation lies without naming it.
- A score readout counts violations found, missed and falsely flagged across the set.

Default state: the first statement is shown with no flags.

Responsive design: the canvas width follows the container on every window resize; the rule checklist moves below the statement under 600 pixels. All controls remain visible at 400 pixels wide.

Implementation: p5.js with createButton controls and click hit-testing on rows, keyboard-focusable alternatives, and a describe() call for accessibility.
</details>

## Evidence Classes

The contract says how a statement must look. It does not say *which learner actions deserve a statement at all*, and that question determines how meaningful the entire record is. Recording every mouse movement would produce a mountain of statements from which no conclusion could be drawn, while recording nothing but quiz answers would waste what the learner did in between. The answer this book uses is a classification.

An **evidence class** is a category of learner interaction, defined by what the interaction can show and by how the runtime turns it into statements. Every interaction in a MicroSim is assigned to exactly one class, or it is judged not to be evidence at all. The class is library-independent: a slider in a p5.js sketch and a slider in a Plotly chart are the same class, even though the code that detects them differs. The following classes are the ones the instrumentation skill defines, and we take them from the least to the most informative about knowledge.

Two abbreviations appear in the class table and are used again in Chapters 20 through 23. *Full mode* means the runtime emits one statement per interaction, the stream a full learning record store would receive. *Compact mode* means the runtime folds exposure evidence into one summary statement per session, the design of the lighter LRS-Lite store. Both modes are designs; the compact one is developed in Chapter 22. Full and Compact treat answers identically, as the assessment section below explains.

| # | Class | What counts | Full stream | Compact |
|---|---|---|---|---|
| 1 | Continuous parameter | slider, zoom, numeric input | `interacted` per step | counts, min, max, last value, reversals |
| 2 | Discrete inspection | click, hover of 600 ms or more, pin, select | `interacted` with engagement mode and duration | counts, modes and time |
| 3 | Run and pause | Start/Pause, Play/Stop | a press `interacted`; one `experienced` per run | run time plus a press touch |
| 3a | Discrete press | Reset, Randomize, Step | `interacted` with an action | a touch with modes |
| 4 | Page dwell | time on a MicroSim with no Run control | `experienced` on focus loss, if one second or more | carried by the session summary |
| 5 | Assessment | quiz item, checked prediction, goal reached | `answered` with `success` | passes through unchanged |
| 6 | Focus loss | tab hidden, scroll away, idle, blur | closes the open interval | ends the session summary |

Class 3a, the discrete press, is a variant of class 3, so we treat it inside the run-and-pause discussion below. The classification itself rests on a set of questions the instrumentation skill asks in order, and using them is the quickest way to place any interaction.

1. Does it check a response against a right answer? Then it is assessment, whatever it looks like.
2. Does it change a numeric parameter continuously? Then it is a continuous parameter.
3. Does it start or stop time passing in the MicroSim? Then it is run and pause, and the interval is the evidence.
4. Is it a one-shot action such as Reset? Then it is a discrete press.
5. Is it the learner looking at, opening, selecting or pinning something? Then it is discrete inspection.
6. Does the MicroSim have no Run control at all? Then add page dwell so that time on the MicroSim is still recorded.
7. Did the program fire the event rather than the learner? Then it is not evidence.

A worked example applies the questions to a small p5.js MicroSim that has a gravity slider, a Start/Pause button, a Reset button and a checked prediction. Moving the slider is class 1. Pressing Start begins a run and pressing Pause ends it, which is class 3, with the interval carried by one `experienced` statement. Pressing Reset is class 3a. Choosing "higher, lower or the same" and having the MicroSim check it is class 5. If the learner leaves the tab open and walks away mid-run, that is class 6, and the runtime closes the interval by itself. The sequence's cost in statements matches what the skill states for a comparable case: dragging a slider through five steps, pressing Start and Pause, and leaving the tab produces eight Full-mode statements (five slider, two press and one run) or, in Compact mode, a single summary that records `statements_represented: 8`.

Exposure evidence, which is classes 1 through 4, contributes zero attempts to a mastery estimate by design. Only class 5 carries `success`. The skill states the consequence outright: if a MicroSim is meant to measure *understanding*, it needs an assessment, and you should say so rather than implying that hover data measures knowledge. That is a modeling stance, not a measured result, and Chapter 19 describes how to test whether exposure evidence adds any predictive value at all.

!!! mascot-thinking "Classify the Act, Not the Widget"
    A button is not automatically a press. A canvas-drawn "Check my prediction" button checks an answer, so it is assessment; a Reset button does not, so it is a press. The class comes from what the interaction *does*, not from how it looks.

The next specification lets you practice the classification on a set of cases.

#### Diagram: Evidence Class Sorter

<details markdown="1">
<summary>Evidence Class Sorter</summary>
Type: microsim
**sim-id:** evidence-class-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish the evidence classes by assigning each interaction in a described MicroSim to its class and explaining the deciding question.

Layout: the left panel shows a mock MicroSim with a gravity slider, Start/Pause, Reset, a three-node diagram and a checked prediction. The right panel shows the seven-question decision list, and a bottom strip shows the class bins: continuous parameter, discrete inspection, run and pause, page dwell, assessment, focus loss and not evidence.

Controls and interactions:

- Clicking any element of the mock MicroSim highlights it and selects it as the item to classify.
- The learner picks a bin; the infobox then names the deciding question in the decision list and the statement the Full mode would emit, for example one `interacted` per deadband step.
- A "Full or Compact" toggle changes the infobox to show the folded Compact summary fields for the same item, and shows that a class 5 item is unchanged by the toggle.
- Hovering a bin shows its definition from this chapter.
- A "Challenge" button presents eight unlabeled events (such as "the pointer crosses the diagram in 300 milliseconds") to classify, with a score.

Default state: nothing selected, Full mode shown, Challenge off.

Responsive design: the canvas width follows the container on every window resize; the panels stack under 600 pixels. Buttons remain visible at 400 pixels wide.

Implementation: p5.js with createButton and createCheckbox controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

### Continuous Parameter Evidence

**Continuous parameter evidence** comes from a control that sets a number along a range: a slider, a zoom, a numeric input. A slider fires an event for every pixel of drag, and hundreds of those events are not hundreds of decisions. The runtime therefore applies a *deadband*, a minimum change that must accumulate before a new statement is emitted. The default is the slider's range divided by 60, giving about sixty statements for one full sweep whatever the numeric range, and a control with a natural step can override it (the bouncing-ball's integer speed uses a deadband of one). When the learner releases the slider, the runtime always reports the value where they let go, even inside the deadband, so the final value is never lost. Values are reported in the units the learner sees, rounded as displayed. In Compact mode the slider folds into a count, a minimum, a maximum, the last value and the number of reversals.

### Discrete Inspection Evidence

**Discrete inspection evidence** comes from a learner looking at, opening, selecting or pinning one identifiable thing: a diagram node, a map marker, a legend entry, a data point. The `interacted` statement carries a mode (hover, click, pinned, select, legend or keyboard) and a duration. The deciding principle is to instrument the act the MicroSim was *designed* for, because hover does not exist on touch devices, and device type correlates with school funding. Two input paths that reach the same object are one act. A learner who hovers a node and then clicks it produces one engagement, and if click is a separate designed act such as pinning, it suppresses the hover in progress. Marker and label for one thing are one object, and a learner who steps through objects with a Next button and a learner who clicks them are doing the same thing. The eight-hour-entrepreneur batch of 20 MicroSims used that last rule in ten explorers, because a design that recorded only button presses would give a learner who only ever pressed Next no per-object evidence at all.

### Run and Pause Evidence

**Run and pause evidence** is the interval between a learner starting and stopping a MicroSim's time. The contract's rule from the verbs section applies: one `experienced` statement per run, on Pause, plus an optional `interacted` statement for each press carrying an `action` extension. The press statements never claim to measure duration, and a press event must never fire on an automatic flush, since the learner clicked nothing. A full Start-to-Pause cycle therefore emits three statements, not one.

### Page Dwell Evidence

**Page dwell evidence** covers a MicroSim that has no Run control, such as a static diagram, where time on the page is otherwise unrecorded. The runtime, when configured with `pageDwell: true`, records one `experienced` statement on focus loss, but only if the visit lasted at least one second. The instrumentation notes flag an unresolved runtime issue: in Full mode, page dwell times from the moment the iframe loads until the tab hides and ignores scroll-away and idle, so a chart halfway down a long chapter could be credited with the whole visit. It is listed as a runtime fix, not something to work around per MicroSim, and it is one more reason to treat dwell as weak evidence.

### Assessment Evidence

**Assessment evidence** is any interaction that checks a response against a right answer. It is the only class that reports `success`, and so it is what a mastery model reads. The classification rule is broad on purpose: a quiz item, a checked prediction, a drag-to-bin sort and a goal-reached banner are all assessments, and every deliberate attempt is emitted, including the wrong ones.

Two design decisions make assessment special. First, *answers are never folded*. In Compact mode the runtime merges exposure evidence into one session summary, but an `answered` statement passes through as its own statement at the moment it happens, in both modes, because a knowledge-tracing model reads the order of attempts and a fold would erase it. Second, an answer opens the Compact session without being counted in it. The contract records a fixed defect here: before 2026-09-26 a visit made only of answers left no summary and no time on the MicroSim. Such a summary now carries `statements_represented: 0` and only the time. Chapter quiz pages, which are not MicroSims, never emit a summary.

The worked example is the six-hotspot quiz again. A learner who answers wrongly twice and then correctly leaves three `answered` statements against one identifier, in either mode. In Compact mode they also leave one `experienced` summary for the visit, which represents no folded interactions if they only answered. The contract leaves one question open, whether within-question retries should count as one opportunity or several for mastery estimation, because a guess-then-correct sequence is not the same evidence as two attempts a week apart.

!!! mascot-warning "Do Not Hide the Wrong Answers"
    It is tempting to record only the final correct answer, because it looks tidy. But a learner who brute-forced six options and one who knew the answer would then look identical, so emit every deliberate attempt and de-duplicate only a repeat of the same choice.

### Focus Loss Handling

**Focus loss handling** is how the runtime closes an interval when the learner stops paying attention without pressing anything: the tab is hidden, the MicroSim scrolls out of view, the learner goes idle, or the window loses focus. The runtime handles this class itself, and a MicroSim author writes no code for it. In Full mode it closes the open run or page interval and emits the `experienced` statement then. The contract's reasoning is that starting a MicroSim and closing the tab is the *common* case, so without a flush the typical learner would emit nothing. It requires the `visibilitychange` event, not `beforeunload`, since only the former fires reliably on mobile Safari. In Compact mode a focus loss ends the session and produces its one summary. The Compact session ends after 90 seconds idle, 10 seconds off screen or 30 seconds of blur, by default, and tests shorten those values. A flush emits the interval's `experienced` statement but never a synthetic press, which would misrepresent a timeout as a deliberate act.

## What Does Not Count: Non-Evidence Thresholds

Every threshold in this chapter exists for one reason: to keep noise out of the record. The instrumentation skill states the principle in a sentence worth remembering: "If you emit them, dashboards will believe them." A statement in a store looks equally authoritative whether it came from a deliberate decision or from a mouse that happened to cross a diagram.

A **non-evidence threshold** is a minimum duration or size below which an interaction is not recorded as evidence. The runtime defines three, plus the programmatic-event filter described in the next paragraph, and they are constants in `lrs-sim.js` that authors reference and never change.

| Constant | Value | Applies to | Reason |
|---|---|---|---|
| `HOVER_MS` | 600 ms | discrete inspection by hover | a pointer crossing a tall diagram enters a dozen nodes in a few hundred milliseconds |
| `MISCLICK_MS` | 250 ms | a run | a run this short is a mis-click, and would add zero-length rows |
| `GLANCE_MS` | 1000 ms | page dwell | under one second on a page is a glance |

The fourth filter is not a number. Events the program fires on itself, such as an automatic resize, a programmatic view change, or a range change during an animation, are not the learner's acts, and the adapter for each library must filter them out. The sim's load-time selection is likewise not evidence.

The reasoning behind each number is design judgment, not measurement. The sources give the *reason* for each constant but do not cite any study or dataset from which the values were fitted, and no learner data has been collected. Treat 600, 250 and 1000 milliseconds as reasonable starting points that Chapter 19's evaluation method could test, for example by asking whether changing a threshold changes a model's predictions.

A worked example shows the thresholds at work on a short session. A learner's pointer crosses five nodes in 400 ms, then rests on a sixth for 900 ms, presses Start and Pause 120 ms apart, presses Start again, and hides the tab after 40 seconds. Applying the rules gives the following.

| Event | Rule | Statement emitted |
|---|---|---|
| pointer crosses five nodes in 400 ms | each hover under 600 ms | none: the skill says sweeping five nodes quickly must emit 0 |
| pointer rests on the sixth node for 900 ms | hover of at least 600 ms | one `interacted` with mode `hover` and duration |
| Start then Pause 120 ms later | run under 250 ms | two press `interacted` statements if press evidence is on; no `experienced` |
| Start, then tab hidden after 40 seconds | focus loss flushes the run | one Start press and one `experienced` of about 40 seconds, and no Pause press |

### Hover Threshold

The **hover threshold** is the 600 millisecond minimum a pointer must rest on one object before the runtime treats the hover as inspection. Below it, the pointer is moving across the object, not attending to it. The threshold applies only where hover is the designed act. Sweeping five nodes quickly must emit zero statements. When click merely serves touch devices as the same act, hover and click are one engagement and are not thresholded against each other.

### Misclick Threshold

The **misclick threshold** is the 250 millisecond minimum length of a run before the runtime counts it as dwell. A Start and Pause pair closer together than that is almost certainly an accidental press. It emits no `experienced` statement, because zero-length rows would pollute the dwell total, though the press statements still fire, since the clicks did happen.

A short warning belongs here because the thresholds are easy to misunderstand as a way of removing "bad" learners.

!!! mascot-warning "Thresholds Filter Acts, Not Learners"
    A threshold removes a single sub-threshold act, never a person. A learner who moves quickly through a MicroSim still leaves whatever above-threshold acts and answers they made, so check that a fast pace is not being read as absence.

The last specification lets you feel how the thresholds change the record.

#### Diagram: Evidence Threshold Lab

<details markdown="1">
<summary>Evidence Threshold Lab</summary>
Type: microsim
**sim-id:** evidence-threshold-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: justify): The learner will justify a choice of hover, misclick and glance thresholds by observing how each changes the number and kind of statements produced from a fixed, scripted session.

Layout: the upper region is a timeline of a scripted 60-second learner session drawn as labeled bars: eight quick hovers of 100 to 500 ms, three hovers of 700 to 1200 ms, one 120 ms run, one 40 second run, a 700 ms page visit and an answered question. The lower left region shows the resulting statement list. The bottom white region holds the sliders.

Controls:

- Slider "Hover threshold (ms)" from 0 to 2000 in steps of 50, default 600
- Slider "Misclick threshold (ms)" from 0 to 1000 in steps of 50, default 250
- Slider "Glance threshold (ms)" from 0 to 3000 in steps of 100, default 1000
- Checkbox "Show statements that were filtered out" (default off)
- Button "Reset to runtime defaults"

Behavior: moving a slider immediately recomputes which bars in the timeline produce statements, coloring emitted acts green and filtered acts gray. The statement list updates with the verb and object of each emitted statement, and a counter shows the total, with the answered statement highlighted as unaffected by any threshold.

Interactions: hovering a bar shows its duration and the rule that admitted or removed it. Setting the hover threshold to 0 shows the flood of crossings, and setting it very high shows genuine attention being discarded, which the readout notes as a cost of an over-strict threshold.

Default state: runtime defaults, filtered acts hidden.

Responsive design: the canvas width follows the container on every window resize. Sliders resize to the container width minus the label margin and remain visible at 400 pixels wide.

Implementation: p5.js with createSlider, createCheckbox and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Putting It Together

Return to the question from the opening. A MicroSim can now describe what a learner did in a fixed grammar: five parts, three verbs, identifiers built from the canonical site URL, one concept per statement, and a classification that decides what is recorded and what is dropped. That grammar is what lets a store, a dashboard or a model treat the output of thousands of different MicroSims alike.

The grammar has two honest limits. First, exposure evidence describes attendance, not understanding, and only checked answers can carry a mastery signal. Second, the thresholds and classes are design decisions that have not been tested against learner data. The chapters that follow keep those limits in view: Chapter 17 shows how to wire a MicroSim to this grammar using the shared runtime, Chapter 18 shows how a mastery model would read the stream, and Chapter 19 describes how to check whether the stream predicts anything.

!!! mascot-celebration "You Can Read the Evidence"
    You can now take an xAPI statement apart into actor, verb, object, result and context, name the right verb and identifier for an interaction, and decide which interactions are evidence and of what class. Every bounce leaves evidence, and you know which ones count.

## Chapter Summary

- **xAPI** is a shared grammar for learning events, and an **xAPI statement** is one JSON record of one learner action, shaped like a sentence.
- A statement has an actor, a verb, an object, a result and a context; the actor is an account, the verb an IRI, the object an activity, the result the outcome fields and the context the setting.
- The activity IRI is the canonical site URL plus the page path with a trailing slash; sub-activities add a fragment named for their stable local identity, and questions use `#q{N}` (one-based) only when their order is fixed.
- The concept ID extension attaches exactly one concept identifier to a statement; a wrong concept is worse than none.
- The three verbs are `answered` (needs `success`), `experienced` (needs `duration`) and `interacted` (needs nothing, values go in result extensions); only `answered` can say right or wrong.
- The producer contract binds every emitter to these rules, and its own open items, including the untested consumer side, are part of what you should know.
- Evidence classes place each interaction as continuous parameter, discrete inspection, run and pause, page dwell, assessment or focus loss, or as non-evidence.
- Non-evidence thresholds of 600 ms for hover, 250 ms for a run and one second for page dwell keep noise out; they are design judgments awaiting evaluation.
- All of this describes a design and a working runtime that builds and displays statements; nothing yet sends them to a store, and no learner data has been collected.

The next chapter shows how to put this grammar into a real MicroSim with the shared xAPI runtime, without changing how the MicroSim behaves.
