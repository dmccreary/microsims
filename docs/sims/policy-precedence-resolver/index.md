---
title: Policy Precedence Resolver
description: Set the book config, page option, metadata.json and ?xapi= URL switch layers, predict the resolved compact and teaching values, then watch the runtime's five-layer precedence resolve them key by key.
image: /sims/policy-precedence-resolver/policy-precedence-resolver.png
og:image: /sims/policy-precedence-resolver/policy-precedence-resolver.png
twitter:image: /sims/policy-precedence-resolver/policy-precedence-resolver.png
social:
   cards: false
quality_score: 100
---

# Policy Precedence Resolver

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Policy Precedence Resolver MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

An instrumented MicroSim's xAPI policy has two main keys: `compact` (fold exposure evidence into
one summary per session, or send the Full stream) and `teaching` (show the statement log panel,
or stay silent). Five places can set them. The runtime consults them in a fixed order, lowest
priority first:

1. the runtime's built-in defaults (`compact: true`, `teaching: false`)
2. the book's `lrs-config.js` `xapi` block
3. the `policy` option a page passes to `LRSSim.create`
4. the MicroSim's own `metadata.json` `xapi` block
5. the `?xapi=` URL switch, for one visit only

Resolution is per key: the highest layer that sets a key wins that key, and a layer that sets
only `teaching` leaves `compact` to the layers below. The URL tokens are `teaching`,
`production`, `full` and `compact`, and they combine; a lone `?xapi=teaching` also starts the
panel on Full, exactly as the runtime's `urlPolicy()` does.

Set the layers, predict both values and the layer that supplies each, then press **Resolve**.
A highlight climbs from the bottom bar, overwriting the running value wherever a layer sets a
key. **Worked example** loads the case from Chapter 17: the book says `compact: true, teaching:
false`, the MicroSim's `metadata.json` says `compact: false, teaching: true`, and the reader
opens the page with `?xapi=production`.

**Learning objective:** The learner will determine the final `compact` and `teaching` values
for a MicroSim by applying the five policy layers in order, and will identify which layer
supplied each value.

**Bloom's taxonomy level:** Apply (verb: *determine*)

## How to Use

1. Choose a value for each layer with the **Book config**, **Page option**, **metadata.json**
   and **URL switch** dropdowns. The runtime defaults are fixed.
2. Write down your prediction for `compact` and `teaching`, and the layer each comes from.
3. Press **Resolve** and watch the climb. Check **Show which layer won** to label each value
   with its source layer and ring the winning boxes in gold.
4. Hover any bar to see which file that layer lives in.
5. **Reset** returns every layer to its starting state (the reference book's
   `compact: true, teaching: false` and nothing else set).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/policy-precedence-resolver/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- Full and Compact modes (Chapter 16)
- The LRS config file and teaching mode (Chapter 17)

### Activities

1. **Worked example (3 min):** Load the worked example, predict, then resolve. Explain why
   `compact` comes from `metadata.json` while `teaching` comes from the URL switch.
2. **Per-key practice (5 min):** Set `metadata.json` to `teaching true` only and the book to
   `compact false`. Predict and resolve. Then add `?xapi=teaching,compact`.
3. **Design a policy (5 min):** A teacher wants every MicroSim silent and compact, except one
   that teaches xAPI and should open on Full with the panel. Decide which files to change, set
   the layers, and verify with Resolve.

### Assessment

- The learner predicts both resolved values and their source layers correctly for three new
  layer settings.
- The learner explains why a lone `?xapi=teaching` also sets `compact` to false.
- The learner names the file to edit for a change to one MicroSim, to the whole book, and to a
  single visit.

## References

1. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI standard the runtime's statements follow.
2. [Query string](https://en.wikipedia.org/wiki/Query_string) - Wikipedia. The `?xapi=` part of the URL that carries the switch.
3. [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) - MDN. The browser API the runtime uses to read the switch.
4. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) - p5.js. The dropdown control used for each layer.
