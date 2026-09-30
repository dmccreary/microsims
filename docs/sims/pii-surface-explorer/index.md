---
title: PII Surface Explorer
description: Classify each field of an illustrative xAPI statement as no PII risk, pseudonymous, direct identifier or uncontrolled free text, check your answers against Chapter 24's analysis, and compare the extra risks of a Full LRS and of LRS-Lite browser storage.
image: /sims/pii-surface-explorer/pii-surface-explorer.png
og:image: /sims/pii-surface-explorer/pii-surface-explorer.png
twitter:image: /sims/pii-surface-explorer/pii-surface-explorer.png
social:
   cards: false
quality_score: 100
---

# PII Surface Explorer

<iframe src="main.html" height="792px" width="100%" scrolling="no"></iframe>

[Run the PII Surface Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The **PII surface** of an instrumented MicroSim is every place where personally identifiable
information can enter, be stored or be shown. Mapping it is the first privacy step, because you
cannot protect a place you have not listed. This explorer shows the illustrative statement from
Chapter 24 one field per box and asks you to put each field into one of four classes:

| Class | Meaning |
|---|---|
| No PII risk | The value cannot point to a person, alone or combined with the other fields |
| Pseudonymous | An identifier that points to one person only for whoever holds the mapping |
| Direct identifier | A value that identifies a learner as sent |
| Uncontrolled free text | A field whose content the designer cannot predict, so anything, including a name, can appear |

The statement uses an invented account (`student-4471`) and simplified identifiers. Chapter 24's
example has no context, so two context fields were added for this exercise: the textbook-version
`grouping` that the producer contract requires on every statement (Chapter 16) and an xAPI
`registration`, a random identifier for one attempt. The names and values are fictional.

After **Check my answers**, a field turns green with a check mark when your class matches the
chapter's analysis, amber with a tilde when your class differs but can be defended, and red with a
cross otherwise. The panel under the statement gives a one-sentence reason. These classes are the
chapter's own analysis, not a legal determination; a district's counsel decides what FERPA, COPPA
or GDPR require.

The **Storage location** setting lists the extra risks of where the statement ends up. In the Full
LRS design the actor is replaced by a pseudonymous `student_key` and small report cells are
suppressed, but those mechanisms are designed and not built, and the free-text response is kept
in the stored raw statement. In LRS-Lite the statements sit in the browser, which adds the
shared-device risk: another user of the same browser profile could read them.

**Learning objective:** The learner will classify each field of an example xAPI statement as no
PII risk, pseudonymous, direct identifier or uncontrolled free text, and explain what protects or
exposes it.

**Bloom's taxonomy level:** Analyze (verb: *classify*)

## How to Use

1. Click a field box to select it (a thick blue border marks the selection). From the keyboard,
   Tab to the statement and use the arrow keys; keys 1 to 4 also choose a class.
2. Press one of the four class buttons below the statement.
3. Classify all eight fields, then press **Check my answers**. Read the reason for every amber or
   red field. Changing a class clears its color until you check again.
4. Hover over a shortened value (ending in an ellipsis) to see it in full; the panel also shows
   the full value of the selected field.
5. Switch **Storage location** between **Full LRS** and **LRS-Lite browser** and compare the
   extra risks listed under the statement.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/pii-surface-explorer/main.html"
        height="792px"
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

- The parts of an xAPI statement (Chapter 16), especially the `account` form of the actor
- The PII surface and the difference between pseudonymous and anonymous (Chapter 24)

### Activities

1. **Classify (6 min):** Classify all eight fields before checking. Write one phrase per field
   saying what exposes or protects it.
2. **Check and defend (5 min):** Press **Check my answers**. For each amber field, write whether
   you would keep your class or switch, and why.
3. **Compare storage (4 min):** Switch between Full LRS and LRS-Lite browser. List which risk is
   new in the browser and which Full LRS protections are only designed.
4. **Minimize (optional, 5 min):** Rewrite the question so that `result.response` is no longer
   free text (for example, a choice among three options), and say which risk disappears.

### Assessment

- The learner's classes match or are defensible for at least seven of the eight fields.
- The learner explains why the account name is a direct identifier even though it looks like a
  code, and why a pseudonym is protection but not anonymity.
- The learner names the shared-device risk of LRS-Lite and one Full LRS mechanism that is
  designed but not built.

## References

1. [xAPI Specification, Part Two: Data (1.0.3)](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) -
   ADL on GitHub. Defines the actor account, `result.response` and `context.registration`.
2. [Personal data](https://en.wikipedia.org/wiki/Personal_data) - Wikipedia. Personally
   identifiable information and why combinations of fields can identify a person.
3. [Pseudonymization](https://en.wikipedia.org/wiki/Pseudonymization) - Wikipedia. Why a
   pseudonym is reversible by whoever holds the mapping.
4. [Family Educational Rights and Privacy Act](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act) -
   Wikipedia. The United States law governing student education records.
5. [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - MDN Web
   Docs. The browser database that LRS-Lite uses, scoped to one origin and browser profile.
