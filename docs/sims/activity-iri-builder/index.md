---
title: Activity IRI Builder
description: Construct the activity IRI for a page, a control, a diagram node or a question from the canonical site_url, and diagnose five common mistakes by watching one learner's visit split into two rows in a store.
image: /sims/activity-iri-builder/activity-iri-builder.png
og:image: /sims/activity-iri-builder/activity-iri-builder.png
twitter:image: /sims/activity-iri-builder/activity-iri-builder.png
social:
   cards: false
quality_score: 100
---

# Activity IRI Builder

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Activity IRI Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Every xAPI statement names what the learner acted on in `object.id`, the **activity IRI**. Two
statements about the same thing must use exactly the same string, because a learning record
store groups its page rollup by that identifier. The producer contract in Chapter 16 builds the
IRI from three segments:

| Segment | Rule | Example |
|---|---|---|
| Site URL | the canonical `site_url` from `mkdocs.yml`, with a trailing slash | `https://dmccreary.github.io/microsims/` |
| Page path | the navigation path where MkDocs renders `index.md`, with a trailing slash | `sims/bouncing-ball/` |
| Fragment (optional) | the sub-activity's most stable local name | `#speed-slider`, `#dublin-core`, `#q3`, `#q-nucleus` |

The builder shows the IRI as three colored segments, the browser's address bar above it, the
object type the IRI names (Page, MicroSim, Control or Question) and a preview of how a store
would group one learner's visit. Click any segment to read its rule.

The **Loaded from** menu changes only the address bar. Whether the page is the published site,
a local `mkdocs serve` preview on `127.0.0.1`, or the `main.html` iframe payload, the correct
IRI stays the same: the identifier is independent of the address the browser shows.

The **Show a mistake** menu applies one of the five errors the contract records from its own
history: citing `main.html`, dropping the trailing slash, using the local origin, numbering
questions from zero, and naming a shuffled question by its position. The offending segment
turns red with its reason, and the grouping preview splits one learner's visit into two rows
that a store will never merge.

**Learning objective:** The learner will construct a correct activity IRI for a page, a control
and a question, and diagnose why a malformed IRI is wrong.

**Bloom's taxonomy level:** Apply (verb: *construct*)

## How to Use

1. Start from the default: the published site, the page `sims/bouncing-ball/`, no fragment and
   no mistake. The IRI names the MicroSim itself.
2. Choose a **Sub-activity** and type its name or number: a control ("Speed Slider" becomes
   `#speed-slider`), a node, a fixed-order question (`#q3`) or a shuffled question
   (`#q-nucleus`). Watch the object type change.
3. Change **Loaded from** and confirm that only the address bar changes.
4. Edit **site_url**. Remove the trailing slash and see that the runtime adds it back.
5. Pick each entry in **Show a mistake**, read the red reason, and look at the two rows in the
   grouping preview. Choosing a question mistake switches the sub-activity to the matching
   kind of question.
6. Press **Reset** to return to the defaults.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/activity-iri-builder/main.html"
        height="642px"
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

- The object part of an xAPI statement and its four types (Chapter 16)
- The `site_url` setting in `mkdocs.yml`

### Activities

1. **Construct three IRIs (6 min):** Write, then build and check, the IRI for the chapter page
   `chapters/16-xapi-statements-and-evidence/`, for a slider named "Frequency Slider" on
   `sims/bouncing-ball/`, and for the third question of a fixed-order quiz on the same page.
2. **Diagnose (6 min):** For each of the five mistakes, write one sentence saying which segment
   is wrong and what the store sees.
3. **Apply the test (5 min):** For each fragment style, ask the chapter's question: would an edit
   that does not change what the thing is change its identifier? Use it to explain why
   `#control-3` is a poor name.

### Assessment

- The learner constructs correct IRIs for a page, a control and a question without the tool.
- Given a malformed IRI, the learner names the mistake and its consequence for grouping.
- The learner explains why the address in the browser's bar must not be copied into `object.id`.

## References

1. [Internationalized Resource Identifier](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) -
   Wikipedia. The identifier format used for xAPI verbs and activities.
2. [xAPI Specification, Part Two: Data (1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) -
   ADL on GitHub. The Activity object and its `id`.
3. [MkDocs configuration: site_url](https://www.mkdocs.org/user-guide/configuration/#site_url) -
   MkDocs documentation for the canonical address the IRI starts from.
4. [p5.js createInput() reference](https://p5js.org/reference/p5/createInput/) - p5.js. The
   control used for `site_url` and the sub-activity name.
