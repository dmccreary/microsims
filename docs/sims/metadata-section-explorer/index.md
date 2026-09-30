---
title: Metadata Section Explorer
description: Expand the sections of the H-Bridge metadata.json as a network, classify each field under dublinCore, search, educational, technical or userInterface, and tell required fields from optional ones.
image: /sims/metadata-section-explorer/metadata-section-explorer.png
og:image: /sims/metadata-section-explorer/metadata-section-explorer.png
twitter:image: /sims/metadata-section-explorer/metadata-section-explorer.png
social:
   cards: false
quality_score: 100
---

# Metadata Section Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Metadata Section Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Every MicroSim's `metadata.json` groups its fields into sections under one `microsim` object.
This explorer draws the H-Bridge Circuit file from the STEM Robots textbook, the specimen used
in Chapters 2 and 15, as a network. The `microsim` root sits in the center, the five required
sections surround it in five colors, and the three optional sections (`simulation`,
`analytics`, `usage`) are small gray nodes on dashed edges.

Click a section to fan out its fields. A field with a **solid border** is required by the
schema; a **dashed border** means optional. The panel beside the network shows the section's
purpose, the fields the schema requires and every H-Bridge value in that section. Click a field
to see its type, whether it is required and its exact value. Hover any node for the schema's own
description.

Nothing here is invented. The field values are read from `data.json`, an unmodified copy of
the STEM Robots `docs/sims/h-bridge/metadata.json`, and the required lists, types and
descriptions are read from `microsim-schema.json`, an unmodified copy of this repository's
`src/microsim-schema/microsim-schema.json`. Where the schema gives a field no description, the
tooltip says so and lists the sub-fields it defines. The H-Bridge file has no optional
sections, so their fields come from the schema alone and carry no values.

**Learning objective:** The learner will classify each field of the H-Bridge `metadata.json`
under the correct section (`dublinCore`, `search`, `educational`, `technical`,
`userInterface`) and tell required fields from optional ones.

**Bloom's taxonomy level:** Understand (verb: *classify*)

## How to Use

1. Click a colored section node to expand its fields; click it again (or **Collapse all**) to
   fold them away. One section is open at a time.
2. Click a field node to read its type, whether the schema requires it and its H-Bridge value.
3. Hover any node for the schema description.
4. Check **Required fields only** to hide the optional fields and see the minimum a valid file
   must contain.
5. Press **Quiz me**. A yellow field node appears without its section. Click the section node
   it belongs to; the answer is marked at once, with a green or red edge. Press **Next field**
   in the panel for the next of eight fields.
6. Use the navigation buttons in the corners to pan and zoom. You can drag nodes; they stay
   where you drop them.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/metadata-section-explorer/main.html"
        height="502px"
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

- The five required and three optional sections introduced in Chapter 2
- The Dublin Core element list in Chapter 15

### Activities

1. **Predict the sections (3 min):** Before expanding anything, write where you would expect
   `tags`, `rights`, `canvasDimensions`, `prerequisites` and `controls` to live. Then check.
2. **Required versus optional (4 min):** With **Required fields only** on, expand each section
   and list the required fields. Compare `dublinCore` (eight required) with `search` (two).
3. **Quiz (5 min):** Complete one quiz round of eight fields. For every miss, write the
   question that section answers (what it is, how to find it, who it is for, how it runs,
   what the learner touches).
4. **Discuss (3 min):** `version` and `dependencies` are both in `technical`. Why must a
   library version never go in `version`?

### Assessment

- The learner places at least seven of eight quiz fields in the correct section.
- Given a field name, the learner states whether the schema requires it.
- The learner explains why `subject`, `tags` and `searchKeywords` live in different sections.

## References

1. [Dublin Core](https://en.wikipedia.org/wiki/Dublin_Core) - Wikipedia. The fifteen-element
   vocabulary behind the `dublinCore` section.
2. [JSON Schema](https://json-schema.org/) - Official site of the schema language used by
   `microsim-schema.json`.
3. [vis-network documentation](https://visjs.github.io/vis-network/docs/network/) - The
   network library used to draw and expand the sections.
