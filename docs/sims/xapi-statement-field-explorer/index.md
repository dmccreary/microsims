---
title: xAPI Statement Field Explorer
description: Click the lines of three real-shaped xAPI statements to tell the actor, verb, object, result and context apart, name the question each part answers, and quiz yourself on where a property lives.
image: /sims/xapi-statement-field-explorer/xapi-statement-field-explorer.png
og:image: /sims/xapi-statement-field-explorer/xapi-statement-field-explorer.png
twitter:image: /sims/xapi-statement-field-explorer/xapi-statement-field-explorer.png
social:
   cards: false
quality_score: 100
---

# xAPI Statement Field Explorer

<iframe src="main.html" height="672px" width="100%" scrolling="no"></iframe>

[Run the xAPI Statement Field Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

An xAPI statement is one JSON object that records one thing one learner did, shaped like a
sentence: "student-0042 answered question 2 correctly, in the context of the LRS book." This
explorer shows a statement one line per row and colors every line by the part it belongs to:

| Part | Question it answers | Example line |
|---|---|---|
| Actor | who? | `"name": "student-0042"` |
| Verb | did what? | `"id": "http://adlnet.gov/expapi/verbs/answered"` |
| Object | to what? | `"type": "http://adlnet.gov/expapi/activities/cmi.interaction"` |
| Result | how did it go? | `"success": true` |
| Context | in what setting? | `"grouping": [{"id": ".../textbook/lrs/v1.0.0"}]` |
| Housekeeping | which statement, and when? | `"id"` (a UUID) and `"timestamp"` |

The xAPI specification (version 1.0.3, the version this book's producer contract targets)
requires the actor, verb and object; the result and context are optional but carry most of the
evidence. The `id` and `timestamp` are not parts of the sentence; they name the statement and
record when the learner acted.

Three statements are built in. The **answered** statement is the producer contract's reference
statement from Chapter 16 (question 2 on the `lrs-data-model` page), with an `id` added and the
account written over three lines. The **interacted** statement is the chapter's speed-slider
example (value 4, previous value 3) with the actor, context and timestamp that the chapter
omitted filled in. The **experienced** statement records one Start-and-Pause run of the same
page, with the `duration` that the verb requires and the runtime's `run-ended-by` extension.
Identifiers use the learning-record-store book's site, as the reference implementation does.
In the interacted and experienced statements, the `id`, timestamps and concept identifiers
(`velocity`, `kinematics`) are illustrative values in the shapes the chapter describes.

Long addresses are shortened in the middle with an ellipsis so each line fits; click a line to
see it in full in the panel.

**Learning objective:** The learner will differentiate the five parts of an xAPI statement by
selecting a line of a real statement and stating which part it belongs to and what question
it answers.

**Bloom's taxonomy level:** Analyze (verb: *differentiate*)

## How to Use

1. Click any line. The whole part it belongs to is highlighted, and the panel shows the part's
   name, the question it answers, what this line means and the chapter's definition.
2. Hover over a line for a one-line meaning.
3. Use the **Statement** menu to switch between the answered, interacted and experienced
   statements. Compare which result fields each verb carries.
4. Check **Quiz me**. The colors disappear and the panel asks for a line, such as "the line
   that says whether the answer was right". Click it; the correct line is outlined in green and
   a wrong pick in red. Press **Next** for another question. The score counts correct answers
   out of attempts.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/xapi-statement-field-explorer/main.html"
        height="672px"
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

- JSON objects, keys and values
- The five parts of a statement defined in Chapter 16

### Activities

1. **Label by question (5 min):** For the answered statement, click one line in each part and
   say its question aloud: who, did what, to what, how did it go, in what setting.
2. **Compare the verbs (5 min):** Switch to interacted and then experienced. Write which result
   fields each carries and why: `success` for answered, none for interacted, `duration` for
   experienced.
3. **Quiz (5 min):** With **Quiz me** on, answer at least eight questions across the three
   statements.
4. **Spot the look-alikes (optional, 3 min):** Five lines of the answered statement contain
   `"id"`. Say which part each belongs to, and which one is the activity identifier.

### Assessment

- The learner assigns any clicked line to the correct part and names the question it answers.
- The learner scores at least 80 percent in a quiz round.
- The learner explains why `cmi.interaction` and `interaction` mark different kinds of object.

## References

1. [xAPI Specification, Part Two: Data (1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) -
   ADL on GitHub. The statement structure: actor, verb, object, result, context, timestamp, id.
2. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. Background on
   xAPI and learning record stores.
3. [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) - Wikipedia. The format of the
   `timestamp` and of durations such as `PT4M12S`.
4. [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) -
   Wikipedia. The format of the statement `id`.
