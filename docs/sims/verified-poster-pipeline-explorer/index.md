---
title: Verified Poster Pipeline Explorer
description: Explore the nine steps of the verified poster route, from claim plan to overlay, see the file each step writes and what fails when a step is skipped, then put the shuffled steps back in order.
image: /sims/verified-poster-pipeline-explorer/verified-poster-pipeline-explorer.png
og:image: /sims/verified-poster-pipeline-explorer/verified-poster-pipeline-explorer.png
twitter:image: /sims/verified-poster-pipeline-explorer/verified-poster-pipeline-explorer.png
social:
   cards: false
quality_score: 100
---

# Verified Poster Pipeline Explorer

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Verified Poster Pipeline Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **fact-verified poster** is a static poster whose every numeric claim has been traced to a
cited source and a quoted passage before any pixel is rendered. The generator skill's
verified-infographic guide organizes the work as eight phases plus a ninth overlay step. This
explorer draws the route as a chain that reads left to right and wraps like lines of text:

1. Claim plan (`01-claim-plan.yaml`)
2. Source discovery (source records go into the verification report)
3. Verification (`02-verification-report.md`)
4. User checkpoint (approves the report; writes nothing new)
5. Layout spec (`03-layout-spec.yaml`)
6. Prompt assembly (`04-image-prompt.md`)
7. Render (`poster.png`)
8. Render audit (`sources.md`)
9. Overlay (`data.json` and `main.html`)

Two steps are colored. **Step 4, the User checkpoint** (orange), is the mandatory human
checkpoint: nothing is laid out or rendered until the requester approves the claim set. **Step 7,
Render** (purple), is the only step that calls the image model. A dashed red arrow from step 8
back to step 7 is the retry loop: when the audit finds drift, the poster is rendered again, up
to three attempts before escalating to the user. A green bracket marks steps 1 to 4 as reusable
on their own, because a verified claim set can feed an interactive chart or table with no
poster at all.

Click a step to read a two-sentence description, the file it writes, and the question "What
goes wrong if this step is skipped?" Hover an arrow to see what passes along it. The **Skip a
step** menu greys out one step and shows the failure the guide anticipates, such as unverified
numbers reaching the prompt. The **Sequence quiz** shuffles the unnumbered steps: click them in
order, then pick the checkpoint and the image-model step.

**Learning objective:** The learner will sequence the nine steps of the verified poster route,
and will explain which step is the mandatory human checkpoint and which step alone calls the
image model.

**Bloom's taxonomy level:** Understand (verb: *sequence*)

## How to Use

1. Read the chain from step 1 to step 9. Hover each arrow to see what the next step receives.
2. Click a step. Before pressing **Show the answer**, predict what goes wrong if it is skipped.
3. Choose a step in **Skip a step** to grey it out and read the failure it would cause. Choose
   **(none)** to restore the chain.
4. Press **Sequence quiz**. Click the nine shuffled steps in order; out-of-order clicks are
   counted. Then click the mandatory checkpoint and the image-model step. Press **Explore** to
   return.

When the page is narrower than 600 pixels, the information panel moves below the chain.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/verified-poster-pipeline-explorer/main.html"
        height="562px"
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

- The Fact-Verified Poster section of Chapter 11
- Grid overlays and comparison posters from Chapter 10

### Activities

1. **Trace (4 min):** Hover every forward arrow and write one line naming what each step hands
   to the next.
2. **Predict and skip (6 min):** For steps 3, 4, 6 and 8, predict the failure before choosing
   the step in Skip a step. Compare your prediction with the failure shown.
3. **Sequence (5 min):** Complete the Sequence quiz. Record out-of-order clicks and whether you
   found the checkpoint and the image-model step on the first try.

### Assessment

- Out-of-order clicks in the Sequence quiz (zero is the goal).
- In one or two sentences, the learner explains why step 4 must come before step 5 and why no
  step other than step 7 calls the image model.
- Given a poster with a misprinted number, the learner names the step that should have caught
  it (step 8) and the step that the retry loop returns to (step 7).

## References

1. [Fact-checking - Wikipedia](https://en.wikipedia.org/wiki/Fact-checking) - Background on
   verifying factual claims against sources before publication.
2. [Infographic - Wikipedia](https://en.wikipedia.org/wiki/Infographic) - Posters that present
   information and data visually.
3. [Text-to-image model - Wikipedia](https://en.wikipedia.org/wiki/Text-to-image_model) - The
   kind of model called once, in step 7.
4. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - The network
   library used to draw the pipeline.
