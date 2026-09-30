---
title: Docker Lab Run Flow
description: Follow a Docker Python lab's path from the Run button through docker-lab.js, the local service on port 5001 and a fresh container to the output area, then break it and diagnose which part is missing from the symptom alone.
image: /sims/docker-lab-run-flow/docker-lab-run-flow.png
og:image: /sims/docker-lab-run-flow/docker-lab-run-flow.png
twitter:image: /sims/docker-lab-run-flow/docker-lab-run-flow.png
social:
   cards: false
quality_score: 100
---

# Docker Lab Run Flow

<iframe src="main.html" height="562px" width="100%" scrolling="no"></iframe>

[Run the Docker Lab Run Flow MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **runnable code block** of the **Docker Python Lab Type** shows editable Python with Run and
Reset buttons and an output area. The code does not run in the browser. It travels along a
path of five parts, and a lab fails when any one of them is missing:

1. **Lab page** - the textarea, the Run and Reset buttons and the output area, whose IDs all end
   in the same suffix, such as `-1`
2. **docker-lab.js** - the shared script, listed in `mkdocs.yml`, that defines `runDocker()`
3. **Local service on port 5001** - started with `bash scripts/run-python-docker.sh`
4. **Fresh Docker container** - the **Lab Sandbox**, a new `python:3.11-alpine` container for
   every run, with only the standard library, no standard input and no persistent files
5. **Output area** - where the printed text, or a red error, appears

The arrows show the round trip: **Run clicked**, **code sent**, **container started**, **text
returned** and **output displayed**. Hover any arrow to see exactly what travels along it.

The **Break it** menu offers five failures: the service is not started, the script is missing
from `mkdocs.yml`, the starter program calls `input()`, the starter imports a third-party
package, and the Run button calls the wrong suffix. With **Diagnose first** checked, you see
only the symptom, such as "You click Run and nothing happens," and you click the part you
think is broken. The broken part then turns red and the panel explains the cause and the fix,
for example "run `bash scripts/run-python-docker.sh`, then reload the page." **Mystery:
symptom only** picks a failure at random and hides its name as well.

**Learning objective:** The learner will diagnose why a lab fails to run by identifying which
part of the path from browser to container is missing.

**Bloom's taxonomy level:** Analyze (verb: *diagnose*)

## How to Use

1. Click each of the five parts to read its role and one thing that can break it.
2. Hover each arrow and say what travels along it.
3. Choose a failure in **Break it**. Read the symptom and click the part you think is broken.
   A wrong click gives a hint. A right click shows the red part, the cause and the fix.
4. Uncheck **Diagnose first** to see the answer immediately, or choose **Mystery: symptom
   only** to diagnose without the failure's name.

When the page is narrower than 600 pixels, the five parts form a column.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/docker-lab-run-flow/main.html"
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

- The Runnable Code Blocks and the Lab Sandbox section of Chapter 11
- Basic familiarity with a browser's developer console

### Activities

1. **Trace (3 min):** Hover the five arrows in order and write one line for each describing
   what travels along it.
2. **Diagnose (7 min):** With Diagnose first checked, work through all five failures. Record
   how many took more than one click.
3. **Compare (5 min):** Two failures make Run appear to "do nothing." Explain which clue in
   the symptom (a console error, or none at all) separates the missing script from the
   mismatched suffix.

### Assessment

- Three Mystery rounds diagnosed on the first click.
- A written comparison of the "nothing happens" symptoms and the part each points to.
- Given a new symptom, such as "ModuleNotFoundError: No module named 'requests'", the learner
  names the broken part and a fix.

## References

1. [Docker (software) - Wikipedia](https://en.wikipedia.org/wiki/Docker_(software)) -
   Background on containers, the isolation that makes each lab run a fresh sandbox.
2. [Standard streams - Wikipedia](https://en.wikipedia.org/wiki/Standard_streams) - Standard
   input and output, and why `input()` fails when a program has no standard input.
3. [Python built-in exceptions: EOFError](https://docs.python.org/3/library/exceptions.html#EOFError) -
   The error raised when `input()` reaches the end of its input.
4. [MkDocs configuration: extra_javascript](https://www.mkdocs.org/user-guide/configuration/#extra_javascript) -
   The `mkdocs.yml` setting that loads `docker-lab.js` on every page.
