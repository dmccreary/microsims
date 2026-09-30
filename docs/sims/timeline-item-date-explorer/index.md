---
title: Timeline Item and Date Explorer
description: Place fictional course-schedule events on a vis-timeline from the template's JSON event format, then see how the month off-by-one bug and group values change what is displayed.
image: /sims/timeline-item-date-explorer/timeline-item-date-explorer.png
og:image: /sims/timeline-item-date-explorer/timeline-item-date-explorer.png
twitter:image: /sims/timeline-item-date-explorer/timeline-item-date-explorer.png
social:
   cards: false
quality_score: 0
---

# Timeline Item and Date Explorer

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Timeline Item and Date Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim shows the two halves of a timeline side by side: the JSON event you write and the
item vis-timeline draws from it. Its data file, [data.json](data.json), holds eight invented
events from a fictional course schedule ("MicroSims 101"), in the timeline template's format:

```json
{
  "start_date": { "year": "2026", "month": "3", "day": "16" },
  "text": { "headline": "Midterm MicroSim lab", "text": "Learners build ..." },
  "group": "Teaching",
  "notes": "Full date: \"month\": \"3\" is March; the script passes 2 to new Date()."
}
```

The events mix the three kinds of date the template accepts: year only (placed at January 1),
year and month (placed on the 1st), and a full date. Each event becomes a vis-timeline item whose
`content` is the headline, whose `start` is a JavaScript `Date`, and whose tooltip `title` is the
`notes` text. The `group` value sets the item's color and drives the filter buttons, which clear
the dataset and re-add only the events whose group matches exactly.

The detail panel shows the selected event twice: as a formatted headline, date and description,
and as its JSON with the `month` and `group` values highlighted, followed by the `new Date(...)`
call the script makes. The **Show month numbering bug** checkbox rebuilds every date without
subtracting 1 from the month, so each dated event slides one month later while the year-only
events stay put. You can also type a new month for the selected event and press **Update** to
watch it move.

**Learning objective:** The learner will use the JSON event format to place events on a timeline
and will identify how month numbering and group values change what is displayed.

**Bloom's taxonomy level:** Apply (verb: *use*)

## How to Use

1. Hover over an event to read its `notes` in a tooltip.
2. Click an event to show its headline, formatted date, description and JSON below the timeline.
3. Press **All**, **Planning**, **Teaching** or **Assessment** to filter by group.
4. Check **Show month numbering bug** and watch the dated events jump one month later. Read the
   caption and the red `new Date(...)` line to see why.
5. Select an event, type a month from 1 to 12, and press **Update** (or Enter). Try 12 with the
   bug turned on.
6. Use the arrow, **+**, **−** and **Fit All** buttons to navigate. The mouse wheel scrolls the
   page, not the timeline; add `?enable-interaction=true` to the page address to allow dragging
   and wheel zoom.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/timeline-item-date-explorer/main.html"
        height="652px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development). Some familiarity with JSON
is helpful but not required.

### Duration

15 to 20 minutes

### Prerequisites

- JSON objects, keys and string values (Chapter 1)
- The timeline template's event format and date handling (Chapter 9, "Timelines with vis-timeline")

### Activities

1. **Read an event (3 min):** Click three events: one year-only, one year-and-month and one with
   a full date. For each, predict the displayed date from the JSON before reading the panel.
2. **Break the months (4 min):** Turn on the month numbering bug. List which events moved and
   which did not, and explain the difference in one sentence.
3. **Place an event (5 min):** Choose an event and use the month field to move it to a target
   month your partner names. With the bug on, find the month value that lands in January of the
   following year and explain why.
4. **Group values (3 min):** Use the filters. Then explain what would happen if an event's group
   were spelled "teaching" instead of "Teaching", given that the filter compares values exactly.
5. **Write your own (5 min):** On paper, write the JSON for a new event on April 30 in the
   Assessment group, and state the `new Date(...)` call the script would make for it.

### Assessment

- The learner writes a correct JSON event for a given date and group, including a month value
  in 1-12 form.
- The learner explains why the month is reduced by 1 before calling `new Date()` and predicts
  the symptom when it is not.
- The learner explains how the `group` value controls both the color and the filter result.

## References

1. [vis-timeline documentation](https://visjs.github.io/vis-timeline/docs/timeline/) - vis.js.
   Items, DataSet, the `setWindow` method and the `zoomable` and `moveable` options.
2. [Date() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) -
   MDN Web Docs. Documents the zero-based `monthIndex` argument behind the off-by-one bug.
3. [TimelineJS3 JSON format](https://timeline.knightlab.com/docs/json-format.html) - Knight Lab.
   The event structure (`start_date`, `text`, `group`) the template's data format follows.
4. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia. The data format used for `data.json`.
