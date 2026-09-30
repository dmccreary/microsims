---
title: Iframe Resize Message Stepper
description: Step through the iframe auto-height protocol and compare a fixed height, a runtime resize message and a pinned infobox by watching where the controls land.
image: /sims/iframe-resize-message-stepper/iframe-resize-message-stepper.png
og:image: /sims/iframe-resize-message-stepper/iframe-resize-message-stepper.png
twitter:image: /sims/iframe-resize-message-stepper/iframe-resize-message-stepper.png
social:
   cards: false
quality_score: 100
---

# Iframe Resize Message Stepper

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Iframe Resize Message Stepper MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A static iframe height cannot follow content that changes after the page loads. The **iframe auto-height protocol** from Chapter 12 lets the MicroSim (the child) measure itself and send `{ type: 'microsim-resize', height }` to the chapter page (the parent) with `window.parent.postMessage`. A listener on the parent compares `event.source` with each iframe's `contentWindow` and resizes the matching iframe.

This MicroSim puts the two windows side by side. The child is a miniature overlay whose infobox is 110, 140 or 240 pixels tall depending on the callout, the numbers used in the generator skill's pinning reference. The parent shows the iframe as a black outline, the chapter text below it, and the messages it received. Step through the five steps, then change the callout and compare three modes:

- **Fixed height only**: the iframe keeps `height="402px"`; the long callout pushes the controls below the edge, and a red clipped-region marker appears.
- **Runtime message without pinning**: every callout change re-reports the height; the iframe follows, but the controls jump (up to 130 px) under the reader's cursor.
- **Runtime message with pinning**: the infobox keeps its worst-case height, so the controls stay put and a gray band shows the reserved whitespace.

Untick **Parent listener installed** to see a message sent with nobody to receive it: *no listener: iframe height unchanged*. As Chapter 12 notes, this book's own `extra.js` does not yet contain the listener.

**Learning objective:** The learner will differentiate the outcomes of a fixed iframe height, a runtime resize message, and a pinned infobox, by stepping through the protocol and observing where the controls land.

**Bloom level:** Analyze. **Bloom verb:** differentiate.

## How to Use

1. Press **Next step** five times and read each step in the blue banner: default height, measurement, postMessage, event.source match, height change.
2. Change the **Callout** to *Long description with tip* and watch the controls in both panels.
3. Switch **Mode** and repeat. The readout under the child shows where the controls sit and how far they jumped.
4. Untick **Parent listener installed** and step through again.
5. Click a message in the list to see its fields; click again to return to the list.
6. Move the **Iframe border allowance** slider (0 to 40 px, default 30) to change the breathing room added to scrollHeight.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/iframe-resize-message-stepper/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Iframe height and the CANVAS_HEIGHT + 2 rule (Chapter 12)
- Overlay MicroSims and their infobox (Chapter 10)

### Activities

1. **Walk the protocol (5 min):** Step through all five steps in the runtime mode and say, for each, which window acts.
2. **Compare three outcomes (8 min):** For each mode, choose the long callout, then the short one. Record the iframe height and the controls position each time in a table.
3. **Break it (4 min):** Remove the listener. Explain why the message is still sent and why nothing changes.
4. **Decide (3 min):** For an overlay whose infobox text varies, argue which mode a textbook should use and why.

### Assessment

- The learner completes a table of iframe height and controls position for the three modes and two callouts.
- The learner explains why pinning trades whitespace for stable controls.
- Exit question: "A MicroSim posts the message but the iframe never changes. Name two possible causes."

## References

1. [Chapter 12: Width-Responsive Design and Iframe Heights](../../chapters/12-width-responsive-design-and-iframe-heights/index.md) — the auto-height protocol, postMessage resize and overlay height pinning.
2. [Window.postMessage() (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) — the browser method that carries the message and the target-origin argument.
3. [Element.scrollHeight (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight) — the measurement the child sends.
4. [ResizeObserver (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) — how a child re-reports when its height changes after load.
5. [p5.js createRadio() reference](https://p5js.org/reference/p5/createRadio/) — the built-in control used for the Mode choice.
