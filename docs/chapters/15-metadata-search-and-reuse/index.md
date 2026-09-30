---
title: Metadata, Search and Reuse
description: Shows how metadata describes a MicroSim, how a search index and similarity search find it, and how reuse-before-build keeps a library from duplicating itself.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:05:04
version: 1.10
---

# Metadata, Search and Reuse

## Summary

Covers the metadata that describes each MicroSim, the search index built from it, and the reuse-before-build practice that keeps a library of MicroSims from duplicating itself.

Students learn Dublin Core, educational, technical and search metadata, faceted and similarity search, and provenance and licensing. After it, they can describe a MicroSim completely and find an existing one to adapt.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Dublin Core Metadata | 158 |
| Educational Metadata | 37 |
| Technical Metadata | 37 |
| Search Metadata | 47 |
| Metadata Schema | 36 |
| Faceted Search | 10 |
| Search Index | 9 |
| Cross-Book Index | 2 |
| Reuse Before Build | 3 |
| Similarity Search | 3 |
| Adapt Existing MicroSim | 2 |
| Provenance Record | 1 |
| Concept Link Metadata | 22 |
| Version Metadata | 1 |
| Licensing Metadata | 2 |
| MicroSim Submission Guidelines | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What Is a MicroSim](../01-what-is-a-microsim/index.md)
- [Chapter 2: Anatomy of a MicroSim](../02-anatomy-of-a-microsim/index.md)
- [Chapter 3: Learning Objectives and Bloom's Taxonomy](../03-learning-objectives-and-blooms-taxonomy/index.md)
- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)
- [Chapter 13: Quality Assurance and Automated Layout Review](../13-quality-assurance-and-automated-layout-review/index.md)

---

!!! mascot-welcome "A Library You Can Actually Search"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A MicroSim nobody can find might as well not exist, and a MicroSim you rebuild from scratch when one already exists wastes your afternoon. By the end of this chapter you will describe any MicroSim so that a search tool can find it, and you will know how to check the library before you build. Let's bounce it around!

## Why Description Comes Before Reuse

A library of interactive simulations is only as useful as its ability to answer one question: does a MicroSim that teaches this concept already exist? Chapter 1 defined a learning object as a unit of content that can be described, found and reused independently. Chapter 2 showed the file that holds the description. This chapter follows the description outward: how it is structured, how tools index it, and how it changes what an author does before writing the first line of code.

The stakes grow with the size of the collection. The author's own catalog, described later in this chapter, holds thousands of MicroSims across dozens of textbooks, and no person can remember them all. The paper that accompanies this book states the principle bluntly: educators cannot reuse what they cannot find. AI generation sharpens the problem, because a skill can produce a new MicroSim in minutes, which makes duplicating an existing one cheap for the machine and expensive for the library.

## The Metadata Schema

A **metadata schema** is a formal specification of which fields a metadata record must and may contain, what type each field holds, and which values are allowed. Without one, every author invents field names, and a search tool cannot rely on any of them. The MicroSims schema is a JSON Schema, a machine-readable format for describing the shape of a JSON document, stored at `src/microsim-schema/microsim-schema.json` in this repository.

The schema groups fields into sections under a single top-level `microsim` object. Chapter 2 introduced the five required sections and the three optional ones. Four of the required sections are the subject of this chapter: `dublinCore`, `educational`, `technical` and `search`. Each serves a different reader, and the following sections take them in turn. The `userInterface` section, which lists controls, is documented in Chapter 2, and the optional `analytics` section is reserved for the event design of Chapters 16 and 17.

A schema earns its keep through validation. The repository ships `src/microsim-schema/validate.py`, whose docstring gives the usage `python validate.py path/to/metadata.json [more.json ...]`. It exits with status 0 when every file is valid, 1 when any file is invalid and 2 when a file or the schema cannot be loaded. It needs the Python packages `jsonschema` and `rfc3339-validator`, the second being what makes date-time values actually checked. Chapter 13 placed schema conformance inside the quality gate, so a metadata file that fails validation is a defect just as a clipped control is.

!!! mascot-tip "Validate as You Write"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the validator every time an AI skill edits a `metadata.json`, not only at the end. A missing required field found ten seconds after the edit is a one-line fix, and the same field found across fifty files is an afternoon.

## Dublin Core Metadata

**Dublin Core metadata** is a small, internationally used vocabulary of fifteen generic elements for describing any digital resource: title, creator, subject, description, publisher, contributor, date, type, format, identifier, source, language, relation, coverage and rights. It was designed for libraries and repositories, so a MicroSim that carries it can be catalogued by systems that know nothing about MicroSims. In the schema, the `dublinCore` section implements these elements, and it is the most important section because every other tool in this chapter starts from it.

Not every element is mandatory. The schema requires eight: `title`, `creator`, `subject`, `description`, `date`, `type`, `format` and `rights`. The rest are optional, though `identifier` and `language` are worth including because they let a tool distinguish two MicroSims that share a title. Some fields are constrained. The schema allows only three values for `type` (`Interactive Simulation`, `Educational MicroSim` and `Infographic`) and three for `format` (`text/javascript`, `application/javascript` and `text/html`). The `creator`, `subject` and `contributor` fields hold arrays, since a resource often has several.

A **worked example** makes the elements concrete. The H-Bridge Circuit MicroSim from the STEM Robots textbook, the specimen from Chapter 2, carries the following abridged `dublinCore` section. Read the comments after the block, which explain what each field does for a searcher.

```json
"dublinCore": {
  "title": "H-Bridge Circuit",
  "creator": ["Dan McCreary"],
  "subject": ["H-Bridge", "DC Motors", "Motor Direction", "Robotics"],
  "description": "An interactive H-bridge with four clickable knife switches around a DC motor. ...",
  "publisher": "STEM Robots Intelligent Textbook",
  "contributor": ["Claude (Anthropic)"],
  "date": "2026-09-29T00:00:00Z",
  "type": "Interactive Simulation",
  "format": "text/html",
  "identifier": "https://dmccreary.github.io/stem-robots/sims/h-bridge/",
  "language": "en",
  "rights": "CC BY-NC-SA 4.0"
}
```

The `title` and `description` are what a full-text search matches against, so the description should state what the learner does and what they discover, as this one does. The `subject` list places the MicroSim in topical categories. The `identifier` is the published address, which doubles as a stable key that other tools can use, as the similarity files later in this chapter do. The `contributor` field records that an AI assistant helped, which is a small piece of provenance we return to shortly. The `rights` string states the license.

The paper describing the framework says the `subject` field should employ controlled vocabularies, so that "math" and "mathematics" land together. The schema itself types `subject` only as an array of strings and does not enforce a vocabulary. Consistency therefore depends on authors and on the tools that normalize values afterward.

Before the interactive specification below, one more term. A *section explorer* here means a diagram in which each section of the metadata file is a node you can click to read what the section holds. The specification follows.

#### Diagram: Metadata Section Explorer

<iframe src="../../sims/metadata-section-explorer/main.html" width="100%" height="502px" scrolling="no"></iframe>

[Run the Metadata Section Explorer MicroSim Fullscreen](../../sims/metadata-section-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Metadata Section Explorer</summary>
Type: diagram
**sim-id:** metadata-section-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Understand; verb: classify): The learner will classify each field of the H-Bridge `metadata.json` under the correct section (`dublinCore`, `search`, `educational`, `technical`, `userInterface`) and tell required fields from optional ones.

Data: nodes and edges are built from a copy of the H-Bridge metadata file stored as `data.json` beside the MicroSim, with the required-field lists taken from `microsim-schema.json`. Do not invent field values; every value shown is read from those two files.

Visual elements: a root node labeled `microsim` in the center, five section nodes around it (the five required sections, each in a different color), and three smaller gray nodes for the optional sections `simulation`, `analytics` and `usage`. Clicking a section node expands it into field nodes; required fields have a solid border and optional fields a dashed border.

Interactions:

- Click a section node: expand or collapse its fields, and show an infobox at the right with the section's purpose in one sentence and the H-Bridge values for that section
- Click a field node: show the field's type, whether the schema requires it, and its H-Bridge value
- Hover any node: show a tooltip with the schema description of the field
- Checkbox "Required fields only": hide optional fields
- Button "Quiz me": hide the section labels on field nodes and ask the learner to click the section a highlighted field belongs to; report correct or incorrect immediately

Layout: a network canvas 700 pixels wide by 450 pixels tall with an infobox region below it. Physics is on for the initial layout and off after the first stabilization so that nodes stay where the learner drags them.

Responsive design: the canvas width follows the container width on every window resize, the infobox moves below the canvas at widths under 500 pixels, and node labels never fall below 12 pixels.

Implementation: vis-network with click and hover handlers, plain HTML for the infobox and checkbox, and an aria-label on each interactive element for accessibility.
</details>

## Educational Metadata

**Educational metadata** describes who a MicroSim is for and what it teaches, so that a teacher can judge fit without running it. In the schema it lives in the `educational` section. Four fields are required: `gradeLevel`, `subjectArea`, `topic` and `learningObjectives`. Optional fields include `bloomsTaxonomy`, `prerequisites`, `duration`, `difficulty` (one of Beginner, Intermediate or Advanced), `misconceptions` and `learningTheory`.

The link to earlier chapters is direct. Chapter 3 taught you to write a learning objective with a Bloom verb and level; this section is where that objective is recorded in a form a tool can filter on. The H-Bridge file lists four objectives, beginning with "Explain how closing diagonally opposite switches (S1 + S4 or S2 + S3) sets the direction of current through a DC motor", and declares the levels `Understand`, `Apply` and `Analyze`. The verbs match the levels: explain is an Understand verb, predict an Apply verb and analyze an Analyze verb.

The H-Bridge also shows the richest optional field, `misconceptions`. Each entry pairs a misconception with a correction and the evidence a learner can see in the MicroSim. One entry states that closing more switches does not give the motor more power, and that closing both switches on one side creates a short circuit, which the MicroSim shows by flashing the shorted wires red. A teacher reading this entry learns what the MicroSim is designed to confront, which no title or tag would reveal.

!!! mascot-warning "Declared Levels Drift"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A Bloom level typed into metadata is a claim, and nothing checks it against the objectives. When you edit an objective, edit the level in the same pass, and compare the verbs to Chapter 3's list before you trust the field.

The drift is not hypothetical. In the merged catalog described below, the top-level `bloomLevel` field holds mixed forms: strings such as `Understand (L2)`, lists such as `["Understand", "Apply"]`, and 271 records that simply say `TBD`. A facet built on such a field needs cleaning before it can filter reliably.

## Technical Metadata

**Technical metadata** describes how a MicroSim is built and what it needs to run, so that a person deploying it can judge compatibility. It lives in the `technical` section, where `framework` and `canvasDimensions` are required. The `framework` value must be one of `p5.js`, `vanilla-js`, `d3.js`, `three.js` or `other`. Optional fields cover `version`, `dependencies`, `browserCompatibility`, `performance`, `deviceRequirements` and `accessibility`.

The H-Bridge shows the typical content. Its canvas is 700 pixels wide and 530 tall and is marked responsive, which agrees with the height rule of Chapter 12: a 480-pixel drawing region plus a 50-pixel control region is 530. Its `dependencies` entry reads `p5.js 1.11.10 (jsDelivr CDN)`. Its `deviceRequirements` report a minimum screen width of 360 pixels, touch support, no keyboard or mouse requirement and a network requirement, which follows from loading the library from a CDN. Its `accessibility` block declares screen reader support, keyboard navigation, color contrast and alternative text.

A **worked example** shows the payoff. A school has tablets but a filtered network that blocks CDNs. Because each MicroSim declares `networkRequired`, the school can exclude the H-Bridge and every other CDN-dependent MicroSim before a teacher plans a lesson around one. Without the field the only test is trying each MicroSim on a tablet, which does not scale.

!!! mascot-warning "Two Different Versions"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The H-Bridge lists `technical.version` as 2.0.0 and its p5.js dependency as 1.11.10, and these are unrelated numbers. The schema describes `version` as the version of the MicroSim, so keep library versions in `dependencies` and never in `version`.

## Search Metadata

**Search metadata** is the section of the file written for discovery rather than description. It lives in the `search` section, where `tags` and `visualizationType` are required. Where Dublin Core says what a MicroSim is, search metadata says how people are likely to look for it. The optional fields are `searchKeywords`, `interactionLevel`, `complexity`, `relatedConcepts` and `applicationDomains`.

Several fields are constrained so that they can serve as facets later. The `visualizationType` array draws from thirteen allowed values, among them `simulation`, `chart`, `diagram`, `timeline`, `network` and `map`. The `interactionLevel` is one of five values from `passive` to `very-high`. The `complexity` is an integer from 1 to 10, and `applicationDomains` draws from eight values such as `education`, `training` and `assessment`. Chapter 4 taught you to choose a MicroSim type; `visualizationType` is where that choice is recorded so that others can filter on it.

The distinction between `subject`, `tags` and `searchKeywords` confuses newcomers, so consider what each is for. The `subject` field in Dublin Core names the topical category and should be stable. The `tags` are freer labels that add specific handles, and the H-Bridge lists seven, including `shoot-through` and `knife switch`. The `searchKeywords` are phrases a person might type, such as "reverse a dc motor". A teacher who does not know the word "H-bridge" can still find the MicroSim through that phrase.

## Concept Link Metadata

**Concept link metadata** connects a MicroSim to the ideas around it, so that a tool can recommend a neighbor or warn that a prerequisite is missing. The schema carries three kinds of link. The `relatedConcepts` array in the `search` section names concepts for recommendation. The `prerequisites` array in the `educational` section names what a learner should already know. The Dublin Core `relation` field points to related resources such as curriculum standards or textbooks.

The H-Bridge lists five related concepts: Conventional Current, Complete Circuit, Motor Driver IC, Braking vs Coasting and Transistor as a Switch. Its prerequisites are three plain sentences, for example "A circuit needs a complete loop from + to - for current to flow". Both are free-text strings. The schema does not require that a related concept match a label in any learning graph, so a textbook's concept graph and a MicroSim's links can drift apart without anything failing. Making the two agree, for instance by requiring each link to be a graph label, would be a design change and is not something the current schema does.

## Version, Licensing and Provenance

Three small concepts complete the description of a MicroSim over time and across owners. Each is a few fields, but each answers a question that a serious reuser asks.

**Version metadata** records which edition of a MicroSim you are looking at. The schema offers `technical.version`, a string described as the version number of the MicroSim, and the Dublin Core `date`, a timestamp. Together they answer "is this the current one?". The H-Bridge records version 2.0.0 and a date of 2026-09-29. Library versions are separate and belong in `dependencies`, as the warning above noted.

**Licensing metadata** states the terms under which a MicroSim may be reused. It is carried by the required Dublin Core `rights` field, which the schema types as free text. The H-Bridge says `CC BY-NC-SA 4.0`, a Creative Commons license introduced in Chapter 1 that requires attribution, forbids commercial use and requires adaptations to carry the same terms. This chapter is not legal advice, and an institution planning wide reuse should read the license text itself.

A **provenance record** is the trail showing where a MicroSim came from and who has handled it. The schema has no dedicated provenance section. The nearest fields are `creator`, `contributor`, the Dublin Core `source`, and `identifier`. The H-Bridge's contributor entry naming an AI assistant is one modest example. The catalog builder adds another, described next: each catalog record carries a `_source` object naming the repository and folder it was collected from. Records of which AI skill and which prompt produced a MicroSim would be useful, but the current schema does not have a field for them.

The measured state of licensing metadata in the catalog is instructive. In the merged catalog file of the search project, checked for this chapter, 3,764 records exist and 1,441 of them have no `rights` value at all. Of the 2,323 that do, the most common values are `CC BY-NC-SA 4.0` (1,157 records), `CC BY 4.0` (920), `CC BY-NC 4.0` (129) and `All rights reserved` (57). The file does not say why the others are blank, so the count shows a gap in the metadata and not a gap in the licensing itself. A reuser who finds a blank should ask the author instead of assuming permission.

## The Search Index

Metadata is only a promise until a tool reads it. A **search index** is a data structure, built ahead of time from many metadata records, that lets a search interface answer queries quickly without opening every MicroSim. In this project the index is a single JSON file, `docs/search/microsims-data.json`, in the `search-microsims` repository, which a browser loads and searches entirely on the client with the ItemsJS library. No server is involved, which suits GitHub Pages hosting.

Each record in the file is a flat, normalized summary of one MicroSim. Its top-level fields include `title`, `description`, `library`, `bloomLevel`, `url` and `_source`, as well as many optional ones. Normalization matters because the source files differ: some use the nested `microsim` layout of the current schema, and older ones are flat. The search page's script reads a Bloom value from several possible paths in turn, among them `microsim.educational.bloomsTaxonomy`, `educational.bloomsTaxonomy` and a bare `bloomsTaxonomy`. The index is therefore a merge, and a merge inherits every inconsistency of its sources.

We can measure the index instead of trusting a description of it. The counts below come from a short script run against the file for this chapter, and they will change when the catalog is refreshed. The table summarizes them after the prose has defined every column.

| Measure | Value in the checked file |
|---------|---------------------------|
| Records | 3,764 |
| Distinct source repositories | 90 |
| Records with a `library` value | 2,066 |
| Records with a `bloomLevel` value | 1,834 |
| Records with a `description` | 3,762 |

The coverage gap is the lesson. The `library` field is present in only 2,066 records, yet a separate `framework` field is present in 3,644 and reports `p5.js` for 2,641 of them, against 1,414 for `library`. Two fields meant to hold the same idea have different coverage, so a filter on one silently omits records that only the other describes. Good index hygiene means picking one field, filling it everywhere and retiring the duplicate.

!!! mascot-thinking "An Index Is a Merge"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of the index as a librarian's card catalog compiled from ninety different handwriting styles. Search quality is limited by the messiest hand, so the cheapest way to improve search is to fix metadata at the source, not to make the search cleverer.

## Faceted Search

**Faceted search** lets a user narrow a collection by choosing values along several independent dimensions at once, each called a facet, instead of typing one query. Each facet corresponds to a metadata field with a small set of values, and the interface shows how many records each value would leave. The paper's example is a teacher who filters by grade level, subject, topic, Bloom level and tablet compatibility together to get a short, relevant list.

The search page configures six facets: Subject Area, Grade Level, Bloom's Taxonomy, Difficulty, Framework and Visualization. Its full-text search covers the fields `title`, `description`, `concepts` and `subjectArea`. Every facet is configured with `conjunction: false`, which in ItemsJS means OR logic inside a facet: choosing p5.js and Chart.js shows MicroSims that use either. Different facets combine with AND, so choosing Physics and p5.js shows only MicroSims that satisfy both.

A **worked example** reproduces this on the real file. The following script applies two facet choices to the catalog. It defines a helper because some fields hold a single string and others a list, then filters records whose `subject` includes Physics, then narrows by `framework`. Run it from the root of the `search-microsims` repository.

```python
import json

with open("docs/search/microsims-data.json", encoding="utf-8") as f:
    catalog = json.load(f)

def as_list(value):
    """Treat a missing field as [], a single string as [string]."""
    if value is None:
        return []
    return value if isinstance(value, list) else [value]

physics = [r for r in catalog
           if any(str(s).lower() == "physics" for s in as_list(r.get("subject")))]
p5 = [r for r in physics if r.get("framework") == "p5.js"]
network = [r for r in physics if r.get("framework") == "vis-network"]

print("records in catalog:", len(catalog))
print("subject = Physics:", len(physics))
print("  and framework = p5.js:", len(p5))
print("  and framework = vis-network:", len(network))
```

Run against the checked file, the script printed 3,764 records, 104 with the subject Physics, 92 of those built with p5.js and 1 with vis-network. Ninety-two of 104 is a useful narrowing, and a teacher can now scan the list. The single vis-network result also shows the limit of a facet: it only counts what the metadata says, and a Physics MicroSim whose subject was spelled differently would be missing from all of these numbers.

Before the specification below, note that it uses a *sample* of the catalog: a few hundred records copied into a data file at build time, so the MicroSim runs without a network call.

#### Diagram: Faceted Filter Lab

<iframe src="../../sims/faceted-filter-lab/main.html" width="100%" height="652px" scrolling="no"></iframe>

[Run the Faceted Filter Lab MicroSim Fullscreen](../../sims/faceted-filter-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Faceted Filter Lab</summary>
Type: microsim
**sim-id:** faceted-filter-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: use): The learner will use facet selections to narrow a sample of the MicroSim catalog to a short list, and will predict how switching a facet between OR and AND logic changes the count before checking the result.

Data: a sample of 300 records drawn at build time from `microsims-data.json` (title, subject, framework, bloomLevel, url), stored as `sample.json` next to the MicroSim. Records with a missing field are kept and counted under a value named "(missing)" so the learner sees the effect of incomplete metadata.

Layout: a drawing region above a control region. The left third of the drawing region lists three facets (Subject, Framework, Bloom level) as columns of value chips with counts; the right two thirds show a bar of "records remaining" and a scrolling list of up to 12 matching titles.

Controls:

- Clicking a value chip toggles that value in its facet; selected chips turn green and counts on all other chips update immediately
- Toggle "Within a facet: OR / AND" (default OR)
- Button "Predict first": before applying a change, the learner types or selects an expected count, then sees the actual count and the difference
- Button "Reset filters"
- Hovering a title shows its description in a tooltip

Behavior: different facets always combine with AND. Within a facet the toggle chooses OR or AND. A chip whose count would be zero is drawn in gray and cannot be selected.

Responsive design: the canvas width follows the container width on every window resize; at widths under 500 pixels the facet columns stack vertically and the list moves below them.

Implementation: p5.js with DOM-free canvas drawing for chips and list, a describe() call for accessibility, and a keyboard alternative in which Tab moves between chips and Space toggles one.
</details>

## The Cross-Book Index

A **cross-book index** is a single index built across the MicroSims of many separate textbooks, so that a search in one place finds a MicroSim published in another. This is the situation the author's catalog addresses: the checked file draws on 90 source repositories, each a textbook with its own `docs/sims` folder. The original crawler, now deprecated in the repository's own notes, gathered `metadata.json` files by scanning the `dmccreary` GitHub account for `docs/sims/*/metadata.json`.

Crossing books creates an identity problem. A `url` that is a short sim name is unique only inside one book. In the checked file, 1,153 records have a relative `url` and 2,611 an absolute address, and three of the relative values are shared by more than one record. More broadly, 114 sim names occur in more than one record. The dependable key is the pair of repository and sim name. Every one of the 3,764 records is unique on that pair, and each record carries it in its `_source` object with a `github_url`. That object is the provenance record for the catalog entry: it is added by the catalog builder, not written by the MicroSim's author, and it is what lets you go from a search hit back to the code that produced it.

## Similarity Search

Facets only find what the metadata says explicitly. **Similarity search** finds MicroSims that teach related content even when the wording differs, by comparing meaning instead of matching words. The search project converts each MicroSim's text into an embedding, a list of numbers produced by a language model so that texts with similar meaning have similar lists. It uses the `all-MiniLM-L6-v2` Sentence Transformers model, which produces 384-number embeddings. Two embeddings are compared by cosine similarity, a score that is higher when the lists point in a more similar direction.

The project builds two embeddings per MicroSim. The WHAT embedding summarizes what it teaches, using title, description, topic, subjects, grade level, learning objectives and related fields. The HOW embedding summarizes how it is built, using visualization type, framework and interaction style. Keeping them apart matters for reuse: a MicroSim that teaches the right concept in a different library is still reusable through an iframe, so the reuse check compares only WHAT.

The result is a precomputed file, `similar-microsims.json`, that lists the ten most similar MicroSims for each entry. Its own metadata says it was generated on 2026-07-15 for 3,746 MicroSims, while the catalog checked for this chapter holds 3,764 records, so the two files are 18 records out of step and would need regeneration to agree. For the first sim in the file, `ai-in-am-pipeline`, the top neighbor scores 0.6596 and the second 0.5962. Those numbers show that even a best match need not be a near-duplicate.

!!! mascot-thinking "Similar Is a Score, Not a Verdict"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a similarity score as a measured distance on a map, not a yes or no. Where you draw the line between "reuse" and "build new" is a judgment, and you can only make it well if you see what different scores look like.

## Reuse Before Build

**Reuse before build** is the practice of searching the existing library for a MicroSim that already teaches the target concept before specifying or generating a new one. It matters more with AI generation than without it, because generation makes duplication effortless, and every duplicate must later be tested, height-checked, quality-scored and maintained. Chapter 14 showed how many MicroSims a batch can produce; this practice keeps that number from being padded with copies.

The search project's `find-similar-templates.py` supports this in a `reuse` mode. Its argument list defines `--mode` (choices `template` or `reuse`), `--query` for a plain description of the target concept, `--top` for the number of results, `--min-score`, `--json` and `--quiet`. The README states that reuse mode ranks on pure WHAT similarity and sorts each result into a recommendation band, summarized below after the following explanation of the three outcomes.

A `reuse` result means an existing MicroSim already teaches the concept, so embed it with an iframe rather than writing a specification. A `template` result means the concept is not covered but a similar MicroSim's structure is worth borrowing, so write a new specification and cite the match. A `generate` result means nothing close exists, so specify from scratch.

| Band | WHAT score | Action |
|------|------------|--------|
| `reuse` | 0.75 or higher | Embed the existing MicroSim |
| `template` | 0.60 to below 0.75 | Write a new specification, borrowing structure |
| `generate` | Below 0.60 | Write a new specification from scratch |

These thresholds are the tool's own calibration and are worth reading skeptically. The README reports that, on a 1,411-MicroSim catalog after objectives were rewritten, same-concept matches scored 0.73 to 0.86, related but different concepts 0.53 to 0.69 and absent concepts 0.43 to 0.51. It also reports that a genuine same-concept probe about Coulomb's law scored 0.730, just under the 0.75 reuse threshold, and that the author kept the threshold conservative because a false reuse recommendation is costlier than a missed one. The material reviewed for this chapter reports no comparison of the bands against teachers' own judgments, so the bands are a working heuristic, not a validated classifier. The command itself was not run while this chapter was written, because the tool's environment is not available here.

The chapter-content-generator skill that produced this chapter is designed to use this check. When it finds a match, it writes the specification with `**Status:** Reused`, and the batch tools of Chapter 14 skip such specifications because the MicroSim is already deployed elsewhere.

#### Diagram: Reuse Threshold Explorer

<iframe src="../../sims/reuse-threshold-explorer/main.html" width="100%" height="677px" scrolling="no"></iframe>

[Run the Reuse Threshold Explorer MicroSim Fullscreen](../../sims/reuse-threshold-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Reuse Threshold Explorer</summary>
Type: microsim
**sim-id:** reuse-threshold-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge where the reuse and template thresholds should sit by moving them and observing which documented example scores are misclassified, and will justify why a conservative reuse threshold trades missed reuse for fewer false reuse.

Data: only values stated in the `find-similar-templates` README are used: the default thresholds 0.75 and 0.60; the observed score ranges 0.73 to 0.86 (same concept), 0.53 to 0.69 (related but different) and 0.43 to 0.51 (absent); and one probe scoring 0.730 (Coulomb's law). Nothing else is invented, and the panel labels the ranges as "reported by the tool's author".

Visual elements: a horizontal score axis from 0.40 to 0.90 with three colored range bars for the documented ranges, one marker for the Coulomb's law probe, and two vertical threshold lines colored by band (reuse, template, generate regions shaded behind).

Controls:

- Slider "Reuse threshold" from 0.60 to 0.90 in steps of 0.01, default 0.75
- Slider "Template threshold" from 0.40 to 0.75 in steps of 0.01, default 0.60
- Button "Reset to defaults"
- Toggle "Show misclassified": highlights any part of a range that falls in the wrong band and prints a sentence such as "Coulomb's law probe would be sent to template, not reuse"
- Hover a range bar or the probe to read its description

Behavior: the shaded band regions and the misclassification readout update on every slider change. The reuse threshold can never be set below the template threshold.

Responsive design: the canvas width follows the container width on every window resize; sliders stay visible at 400 pixels wide and the axis labels shrink to a minimum of 12 pixels.

Implementation: p5.js with createSlider and createButton positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## Adapting an Existing MicroSim

**Adapt existing MicroSim** names the middle path between embedding and building: copy a MicroSim that is close but not exact, then change what differs. It is the right response to a `template` band result, or to a `reuse` result whose subject or controls do not quite fit your course.

Adaptation is a metadata task as much as a coding task, and skipping the metadata is the usual failure. After copying the directory, give it a new kebab-case sim-id, and update the folder name, the iframe paths and the `identifier` together, as Chapter 2 warned. Rewrite the title, description and learning objectives to describe the new behavior. Update the `date` and `technical.version`. Keep the original author in `creator` or `contributor` and point the Dublin Core `source` at the original. Preserve the license: a CC BY-NC-SA 4.0 MicroSim must be attributed and any adaptation must carry the same terms, and this is not legal advice.

Then rerun the validator and the quality chain of Chapter 13, because the copy inherits the original's height constant, tests and screenshot, all of which may now be wrong.

## MicroSim Submission Guidelines

**MicroSim submission guidelines** tell outside contributors how to add a MicroSim to a shared library so that it arrives complete. This repository's version is `docs/submission-guidelines.md`. It offers two routes: newcomers open a GitHub Issue with a short description and code, and experienced users submit a pull request. It lists ten usability tips, including copying the template, providing a background in `index.md`, adding a preview image, linking to the running MicroSim, placing controls below the drawing region, and using an aliceblue drawing background with white controls.

Read against this chapter, the guidelines have a gap: none of the ten tips mentions `metadata.json`. A submission that follows them faithfully would still be invisible to the search index. A reasonable extension, proposed here and not yet adopted in the repository, would add a checklist of what a search index needs.

| Check | Why it matters |
|-------|----------------|
| `metadata.json` present and passes `validate.py` | The index and facets read it |
| All eight required Dublin Core fields, with a specific description | Full-text search matches on it |
| `rights` set to an explicit license | Reusers need permission terms |
| `bloomsTaxonomy` consistent with the objectives | Bloom facets filter on it |
| `dependencies` and `deviceRequirements` filled in | Deployers judge compatibility |
| A search for the concept was run before building | Prevents duplicates |

## Chapter Summary

- A **metadata schema** fixes field names, types and allowed values so tools can rely on them, and `validate.py` turns the schema into an automatic check.
- Dublin Core supplies the generic description of a MicroSim; the schema requires eight of its fifteen elements, and `rights` and `identifier` carry licensing and stable identity.
- Educational metadata records audience, objectives, Bloom levels and misconceptions; technical metadata records framework, canvas, dependencies and device needs; search metadata records tags, keywords, visualization type, interaction level and complexity.
- Concept links, version, license and provenance describe a MicroSim over time and across owners, but the schema stores concept links as free text and has no dedicated provenance section.
- A search index merges many sources, so its quality is limited by the messiest source; the checked catalog holds 3,764 records from 90 repositories, with 1,441 lacking a `rights` value.
- Faceted search combines facets with AND and values within a facet with OR, and a cross-book index needs repository plus sim name as its key.
- Similarity search compares WHAT embeddings by cosine similarity; the reuse bands of 0.75 and 0.60 are a documented heuristic, not a validated result.
- Reuse before build, and adapting with fresh metadata, keep a library of AI-generated MicroSims from filling with duplicates.

!!! mascot-celebration "You Can Describe and Find a MicroSim"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now write a complete `metadata.json`, read a faceted search result critically, and run the reuse-before-build check that decides whether to embed, adapt or generate. That skill saves more time than any single MicroSim you will ever build.

Metadata makes a MicroSim findable, but it says nothing about what learners do inside one, and Chapter 16 begins the design of the xAPI statements that will describe exactly that.
