---
title: Roadmap Status Board
description: Sort the MicroSims roadmap into built, designed and hoped-for items by opening fourteen near-term and long-term cards from Chapter 26 and reading each one's source, required test and main way it could fail.
image: /sims/roadmap-status-board/roadmap-status-board.png
og:image: /sims/roadmap-status-board/roadmap-status-board.png
twitter:image: /sims/roadmap-status-board/roadmap-status-board.png
social:
   cards: false
quality_score: 100
---

# Roadmap Status Board

<iframe src="main.html" height="762px" width="100%" scrolling="no"></iframe>

[Run the Roadmap Status Board MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A chapter about the future invites overclaiming, so Chapter 26 gives every item one of three
labels:

- **Built:** working code exists and a check has run.
- **Designed:** a written design exists, but the piece is unbuilt or unproven.
- **Hoped for:** a plausible idea with no design and no data.

This board puts fourteen items on two lanes of cards. The **near-term** lane holds the five
roadmap items for about the next year (verified adapters, the end-to-end POST path, closed-loop
generation, automated layout repair and shared sim libraries). Each traces to a written source:
the MicroSims 2.0 plan or the `learning-record-store` repository's `TODO.md` dated 2026-09-26.
The **long-term** lane holds the five long-term ideas (fun and engagement, diagnostic interaction
design, guess-resistant probes, adaptive difficulty and learning from aggregate data) and the four
open problem areas (privacy, validity, equity and evaluation). None of those has a source; each
card shows "No source: speculative" and the test that would have to pass before anyone relies on
it.

Card color encodes the label: dark steel blue for built, amber for designed, and grey with a
dashed border for hoped for. The label word is also printed on each card, so the meaning never
depends on color alone. The chapter's table calls verified adapters and shared sim libraries
"partly built" and the POST path "designed, partly built"; the cards show the first two as Built
and the POST path as Designed, each marked "(partly built)".

**Learning objective:** The learner will distinguish what is built, designed and hoped for among
the near-term and long-term items by opening each item and reading its source and its test.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Hover over a card to see its label in one line.
2. Click a card, or Tab to the board and use the arrow keys, to open it in the information panel:
   its label, its source (or "No source: speculative"), the test that would show it worked, and
   the main way it could fail.
3. Use the **Built**, **Designed** and **Hoped for** checkboxes to show only the cards with those
   labels.
4. Press **Quiz me**. Colors and labels disappear, and five cards (three near-term and two
   long-term) are numbered. For each one, outlined in orange, press **Built**, **Designed** or
   **Hoped for** (keys B, D and H also work when the board has focus). After the fifth answer the
   labels return with a check or a cross on each quiz card.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/roadmap-status-board/main.html"
        height="762px"
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

- The built, designed and hoped-for labels introduced at the start of Chapter 26
- The xAPI runtime and the Full LRS design (Chapters 17 and 20)

### Activities

1. **Read the near term (5 min):** Open all five near-term cards. For each, write the source it
   traces to and whether its test has run yet.
2. **Read the long term (5 min):** Open the long-term cards. For two of them, rewrite the
   required test as a concrete study you could run with your own portfolio.
3. **Quiz (5 min):** Complete two quiz rounds. For every miss, reopen the card and say what
   evidence would have told you the label.
4. **Challenge a label (optional, 5 min):** Pick one card whose label you would change and argue
   for it using the chapter's definitions.

### Assessment

- The learner labels at least four of five quiz cards correctly in a round.
- The learner explains why no long-term item can be labeled designed or built today.
- The learner names the test that would move one near-term item from designed to built.

## References

1. [Technology roadmap](https://en.wikipedia.org/wiki/Technology_roadmap) - Wikipedia. Planning
   near-term and long-term technology work.
2. [Technology readiness level](https://en.wikipedia.org/wiki/Technology_readiness_level) -
   Wikipedia. A related scale for stating how mature a technology is.
3. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. Background on the
   xAPI statements that the roadmap's POST path would deliver to a store.
4. [describe()](https://p5js.org/reference/p5/describe/) - p5.js reference. The screen-reader
   description kept current by this MicroSim.
