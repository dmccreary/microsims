---
title: Claim Bucket Sorter
description: Drag twelve invented evidence records into the four verification buckets, VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY and REJECTED, and read the rule that decides each case.
image: /sims/claim-bucket-sorter/claim-bucket-sorter.png
og:image: /sims/claim-bucket-sorter/claim-bucket-sorter.png
twitter:image: /sims/claim-bucket-sorter/claim-bucket-sorter.png
social:
   cards: false
quality_score: 100
---

# Claim Bucket Sorter

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Claim Bucket Sorter MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

**Claim verification** compares each planned poster claim with what its sources actually say
and sorts it into one of four buckets:

| Bucket | Meaning | On the poster |
|---|---|---|
| VERIFIED | A specific number matches a specific paper, with a quoted passage | Use the exact number |
| DIRECTIONAL | The direction is well established but the number differs across studies | Use a range or the best-supported single study |
| QUALITATIVE-ONLY | The effect is supported but not reliably quantified | Use a word such as "lower", with no invented percentage |
| REJECTED | No credible source | Remove it, or replace it with a verified claim |

Each card shows one evidence record: a planned claim, the type of source (peer-reviewed
article, meta-analysis, marketing page, or blog post citing unnamed studies), and a quoted
passage. Drag the card into a bucket, or press the keys 1 to 4. Feedback appears at once and
names the rule that decides the case, for example "a marketing page with no primary paper
cannot verify a number."

The twelve records are **invented practice items** and contain no real statistics. They are
built around the traps the chapter describes: a meta-analysis cited for a number that belongs
to one of its studies, the top of a range printed as if it were the result, a qualitative claim
that cannot be VERIFIED because it has no number, and a peer-reviewed source that contradicts
the claim it is cited for. A meta-analysis's own pooled estimate, by contrast, can be VERIFIED.

A correct sort earns 10 points. **Show rule** reveals the question that decides the record, but
halves its points to 5. After the last record, a summary lists the missed records grouped by
pattern. The records live in `data.json`, so the same sketch can sort a different record set.

**Learning objective:** The learner will classify evidence records for a planned claim as
VERIFIED, DIRECTIONAL, QUALITATIVE-ONLY or REJECTED, and will justify each choice from the quoted
passage and the source type.

**Bloom's taxonomy level:** Evaluate (verb: *classify*)

## How to Use

1. Read the claim, the source type and the quoted passage on the card.
2. Drag the card into the bucket you choose, or press 1, 2, 3 or 4.
3. Read the feedback and the rule. The bucket you chose turns red if it was wrong, and the
   correct bucket turns green.
4. Press **Next record**. If you are unsure before sorting, press **Show rule** first.
5. After the twelfth record, press **See summary**, then **Restart** for a new shuffled round.

The bucket definitions sit in a side panel on wide screens. Below 700 pixels the panel is
hidden and each bucket shows a short definition, and below 500 pixels the buckets reflow into a
two-by-two grid.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/claim-bucket-sorter/main.html"
        height="552px"
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

- The Finding and Verifying Sources section of Chapter 11
- The difference between a primary study and a review or meta-analysis

### Activities

1. **Sort (10 min):** Sort all twelve records. Before each drop, say aloud which words in the
   passage and which source type decide the bucket.
2. **Justify (5 min):** For every missed record in the summary, write one sentence that names
   the rule you should have applied.
3. **Extend (5 min):** In pairs, write one new record for a pattern you missed, with a claim,
   a source type, a passage and the correct bucket, and trade it with another pair.

### Assessment

- Score out of 120 and the number of rules shown.
- Written justifications for missed records, each naming the passage evidence and the source
  type.
- A learner-written record that is sorted correctly by another learner.

## References

1. [Meta-analysis - Wikipedia](https://en.wikipedia.org/wiki/Meta-analysis) - How a
   meta-analysis pools results across studies, and why its pooled estimate differs from any one
   study's number.
2. [Primary source - Wikipedia](https://en.wikipedia.org/wiki/Primary_source) - The distinction
   between original research and sources that report on it.
3. [Fact-checking - Wikipedia](https://en.wikipedia.org/wiki/Fact-checking) - Background on
   verifying claims against sources.
4. [p5.js loadJSON() reference](https://p5js.org/reference/p5/loadJSON/) - The function that
   loads the practice records from data.json.
