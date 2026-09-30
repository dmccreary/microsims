---
title: Faceted Filter Lab
description: Narrow a 300-record sample of the MicroSim catalog with Subject, Framework and Bloom level facets, and predict how switching OR to AND within a facet changes the count.
image: /sims/faceted-filter-lab/faceted-filter-lab.png
og:image: /sims/faceted-filter-lab/faceted-filter-lab.png
twitter:image: /sims/faceted-filter-lab/faceted-filter-lab.png
social:
   cards: false
quality_score: 100
---

# Faceted Filter Lab

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Faceted Filter Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Faceted search narrows a collection by choosing values along several independent dimensions at
once. This lab runs it on real data: 300 records drawn from the MicroSim catalog
`docs/search/microsims-data.json` in the `search-microsims` repository (3,764 records when the
sample was taken on 2026-09-30). The records are stored unchanged in `sample.json` beside the
MicroSim, so the lab needs no network call.

Three facets are shown as columns of value chips: **Subject**, **Framework** and **Bloom level**.
Each chip shows how many records it would match. The rules are the ones the chapter describes
for the catalog's search page:

- Different facets always combine with **AND**: choosing a subject and a framework keeps only
  records that satisfy both.
- Within one facet, the toggle chooses **OR** (the catalog's `conjunction: false`, the default)
  or **AND**. With OR, choosing p5.js and Mermaid keeps records that use either. With AND, a
  record must carry every chosen value, which is only possible in a facet where a record can
  hold several values, such as Subject or Bloom level.
- A chip whose count is zero is gray and cannot be selected.

The sample shows the catalog's metadata problems on purpose. Records with no value are counted
under **(missing)**: in this sample, 140 of 300 have no `bloomLevel`, and 22 more say `TBD`.
Values were normalized only for case, version numbers ("p5.js 1.11" counts as p5.js) and level
labels ("Understand (L2)" counts as Understand). The Subject and Framework chips show the most
common values only; a record whose subject is not on a chip is still counted whenever no
subject is selected. Some subjects are plainly wrong (a 3D-printing MicroSim tagged "dementia",
for example), because the lab shows what the metadata says, not what it should say.

**Learning objective:** The learner will use facet selections to narrow a sample of the
MicroSim catalog to a short list, and will predict how switching a facet between OR and AND
logic changes the count before checking the result.

**Bloom's taxonomy level:** Apply (verb: *use*)

## How to Use

1. Click chips to select values. Selected chips turn green, and every other chip's count updates.
   The bar and the sentence above the list show how many records remain and the query in words.
2. Hover over a title in the list to read its description.
3. Press **Within a facet: OR** to switch to AND (and back).
4. Press **Predict first**. The counts, the bar and the list are hidden. Type the number of
   records you expect after your next change in the box, then click one chip or flip OR/AND.
   The lab shows your prediction, the actual count and the difference.
5. **Reset filters** clears every selection.
6. Keyboard: click in the chip area (or Tab to the canvas), then use **Tab** and **Shift+Tab**
   to move between chips and **Space** to toggle one.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/faceted-filter-lab/main.html"
        height="652px"
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

- Faceted search and the search index in Chapter 15
- Bloom's taxonomy levels (Chapter 3)

### Activities

1. **Narrow to a short list (5 min):** Find the p5.js MicroSims at the Apply level about
   mathematics. How many clicks did it take to get under ten records?
2. **Predict OR versus AND (7 min):** Select two Bloom levels. Before flipping the toggle to AND,
   press **Predict first** and write your prediction. Repeat with two frameworks and explain why
   AND within Framework gives zero.
3. **Metadata quality (5 min):** Select **(missing)** under Bloom level. What share of the sample
   would a teacher filtering by Bloom level never see? Suggest one fix at the source.
4. **Reflect (3 min):** Which facet in this sample would you trust least, and why?

### Assessment

- The learner reaches a list of ten or fewer relevant records using at least two facets.
- The learner's predictions for an OR-to-AND switch are in the right direction (fewer or equal).
- The learner explains why AND within a single-valued facet always returns zero records.

## References

1. [Faceted search](https://en.wikipedia.org/wiki/Faceted_search) - Wikipedia. Filtering a
   collection along independent dimensions with counts per value.
2. [Boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra) - Wikipedia. The AND and OR
   operations that combine facet selections.
3. [ItemsJS](https://github.com/itemsapi/itemsjs) - GitHub. The client-side search library the
   catalog's search page uses, whose `conjunction` setting chooses AND or OR within a facet.
4. [p5.js loadJSON() reference](https://p5js.org/reference/p5/loadJSON/) - p5.js. How the lab
   loads `sample.json`.
