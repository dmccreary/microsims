---
title: Reuse Threshold Explorer
description: Move the reuse and template thresholds of the find-similar-templates reuse check and judge where they should sit, using only the score ranges the tool's author reported.
image: /sims/reuse-threshold-explorer/reuse-threshold-explorer.png
og:image: /sims/reuse-threshold-explorer/reuse-threshold-explorer.png
twitter:image: /sims/reuse-threshold-explorer/reuse-threshold-explorer.png
social:
   cards: false
quality_score: 100
---

# Reuse Threshold Explorer

<iframe src="main.html" height="677px" width="100%" scrolling="no"></iframe>

[Run the Reuse Threshold Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The `find-similar-templates.py` tool in the `search-microsims` project has a `reuse` mode that
compares a new concept with every MicroSim in the catalog and sorts the best match into one of
three bands by its WHAT similarity score:

| Band | Default rule | Action |
|---|---|---|
| `reuse` | 0.75 or higher | Embed the existing MicroSim |
| `template` | 0.60 to below 0.75 | Write a new specification, borrowing structure |
| `generate` | below 0.60 | Write a new specification from scratch |

Where should those two lines sit? This explorer uses only the numbers in the tool's README,
recalibrated on 2026-07-15 against a 1,411-MicroSim catalog. Same-concept matches scored 0.73
to 0.86, related but different concepts 0.53 to 0.69, and absent concepts 0.43 to 0.51. A
genuine same-concept probe about Coulomb's law scored 0.730. These are drawn as three colored
bars and a diamond on a score axis from 0.40 to 0.90, with the bands shaded behind them. The
ranges are reported by the tool's author; no other data is added.

Moving a threshold changes which parts of each range land in the wrong band. The panel names
the two errors that matter most:

- **Missed reuse:** a same-concept match sent to template or generate, so a duplicate gets built.
- **False reuse:** a related-but-different MicroSim sent to reuse, so the wrong sim gets embedded.

The tool's source code explains why the author kept the reuse threshold at 0.75 even though the
Coulomb's law probe falls just below it: a false reuse, the wrong MicroSim embedded in a
published book, costs more than regenerating one.

**Learning objective:** The learner will judge where the reuse and template thresholds should
sit by moving them and observing which documented example scores are misclassified, and will
justify why a conservative reuse threshold trades missed reuse for fewer false reuse.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. Drag **Reuse threshold** (0.60 to 0.90) and **Template threshold** (0.40 to 0.75). The
   reuse threshold can never go below the template threshold.
2. Watch the shaded bands and the headline: **Missed reuse** and **False reuse**.
3. Keep **Show misclassified** checked to outline the wrong-band parts of each bar in red and
   read one sentence per problem, such as "Coulomb's law probe would be sent to template, not
   reuse".
4. Hover over a bar or the diamond for its description.
5. Press **Reset to defaults** to return to 0.75 and 0.60.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/reuse-threshold-explorer/main.html"
        height="677px"
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

- Similarity search, WHAT and HOW embeddings and the reuse-before-build practice (Chapter 15)
- The idea of false positives and false negatives

### Activities

1. **Find the clean gap (5 min):** Move the reuse threshold until neither missed reuse nor false
   reuse appears. Record the interval of values that works, and note how narrow it is.
2. **Test the author's choice (5 min):** Return to 0.75. Which documented item is misrouted,
   and which kind of error is it?
3. **Judge (7 min):** Write a short recommendation for the reuse threshold. Weigh the narrow
   clean gap, the small number of documented probes, and the cost of each error.
4. **Template line (3 min):** Where does the template threshold stop sending related concepts
   to generate? Why is a missed template cheaper than a false reuse?

### Assessment

- The learner identifies the range of reuse thresholds that separates the documented ranges.
- The learner classifies each misrouting as missed reuse, false reuse, missed template or
  false template.
- The learner justifies a threshold with the asymmetric cost of false reuse and missed reuse,
  and notes that the ranges are the author's report, not a validated benchmark.

## References

1. [Cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) - Wikipedia. The score
   the reuse check compares with the thresholds.
2. [False positives and false negatives](https://en.wikipedia.org/wiki/False_positives_and_false_negatives) -
   Wikipedia. The two kinds of error a threshold trades against each other.
3. [Sentence Transformers: all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) -
   Hugging Face. The embedding model the search project uses.
4. [p5.js createSlider() reference](https://p5js.org/reference/p5/createSlider/) - p5.js. The
   control used for both thresholds.
