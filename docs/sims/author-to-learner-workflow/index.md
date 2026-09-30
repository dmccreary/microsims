---
title: From Author to Learner
description: A clickable workflow that traces a MicroSim from the author's files through mkdocs serve, Git, GitHub, mkdocs gh-deploy and GitHub Pages to the learner's browser.
image: /sims/author-to-learner-workflow/author-to-learner-workflow.png
og:image: /sims/author-to-learner-workflow/author-to-learner-workflow.png
twitter:image: /sims/author-to-learner-workflow/author-to-learner-workflow.png
social:
   cards: false
quality_score: 100
---

# From Author to Learner

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the From Author to Learner MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A MicroSim is only useful once a learner can reach it. This top-to-bottom workflow traces the
path from an author's files to a learner's browser in seven steps and four phases:

1. **Author writes files** (Markdown, HTML, JavaScript) - authoring
2. **Local preview with `mkdocs serve`** - authoring
3. **Commit to Git** - version control
4. **Push to the GitHub repository** - version control
5. **`mkdocs gh-deploy` builds the site** - publishing
6. **GitHub Pages serves the pages** - publishing
7. **The learner's browser loads the page, the iframe, and the library from a CDN** - the
   learner

Clicking a step shows the command or tool used there and one thing that commonly goes wrong.
Hovering an arrow shows the artifact passed to the next step, such as the source files, a
commit, or the built HTML pages.

**Learning objective:** The learner will summarize the path a MicroSim takes from an author's
files to a learner's browser.

**Bloom's taxonomy level:** Understand (verb: *summarize*)

## How to Use

1. Read the default panel for a one-paragraph summary of the path.
2. Click each step from top to bottom. Note the command or tool and the failure it warns
   about.
3. Hover over each arrow to see what that step hands to the next one.
4. Use the color key at the top of the panel to group the steps into authoring, version
   control, publishing and the learner.

On screens narrower than 560 pixels the panel moves below the diagram.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/author-to-learner-workflow/main.html"
        height="602px"
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

- The Publishing section of Chapter 1 (MkDocs, Git and GitHub Pages)
- The meaning of an iframe and a CDN

### Activities

1. **Walk the path (4 min):** Click all seven steps and write the command or tool for each one
   in a two-column table.
2. **Follow the artifact (3 min):** Hover each arrow and write what is passed along. Which
   arrow is the first one that carries HTML pages instead of source files?
3. **Summarize (4 min):** Write a three-sentence summary of the path, one sentence each for
   authoring, version control and publishing.
4. **Diagnose (3 min):** A learner reports that a MicroSim works on the author's laptop but its
   iframe is blank on the published site. Name two steps where the problem could have started.

### Assessment

- The learner produces a correct summary that names all four phases in order.
- The learner matches each command (`mkdocs serve`, `git commit`, `git push`,
  `mkdocs gh-deploy`) to its step.
- Given a failure (a clipped iframe, a rejected push, an absolute path), the learner names the
  step where it is introduced.

## References

1. [MkDocs](https://www.mkdocs.org/) - The static site generator that previews (`mkdocs serve`)
   and builds the textbook.
2. [MkDocs deploying your docs](https://www.mkdocs.org/user-guide/deploying-your-docs/) -
   MkDocs user guide. Explains `mkdocs gh-deploy` and the gh-pages branch.
3. [Git](https://en.wikipedia.org/wiki/Git) - Wikipedia. The version control system used to
   commit and push changes.
4. [GitHub Pages documentation](https://docs.github.com/en/pages) - GitHub. How a repository's
   static site is published.
5. [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) - Mermaid. The
   diagram language used here, including click directives.
