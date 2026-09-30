# Brief: generate a batch of MicroSims (shared by all batch agents)

You are one of several agents working in parallel. Each agent owns a batch of
8 MicroSims. Build every sim in your batch to "definition of done" (below),
record specification/skill gaps, and return a short report.

## Paths

- PROJECT = /Users/dan/projects/microsims  (MkDocs site, contains mkdocs.yml)
- Generator skill: /Users/dan/.claude/skills/microsim-generator/SKILL.md
  (read it first) and its guides in .../microsim-generator/references/
- UTILS = /Users/dan/projects/ibook-skills/src/microsim-utils
  (the SKILL.md says ~/Documents/ws/... — that path is WRONG, use this one)
- TESTER = /Users/dan/projects/ibook-skills/skills/microsim-utils/scripts/test-iframe-heights.py
  ($BK_HOME is unset; use this absolute path). Playwright's bundled Chromium
  is NOT installed on this machine, so run the tester through the shared shim
  instead: `python3 SCRATCH/tester-chrome-shim.py --sims-dir $PROJECT/docs/sims --sim <id>`
  (same arguments; falls back to the installed Google Chrome).
- Layout review: /Users/dan/projects/ibook-skills/skills/microsim-utils/references/layout-reviewer.md,
  visual-checklist.md, common-fixes.md (same folder)
- Screenshot: `bk-capture-screenshot <sim-dir> 3 <iframe-height>` (on PATH;
  picks a free port, so it is safe to run in parallel)
- SCRATCH = /private/tmp/claude-501/-Users-dan-projects-microsims/32e6281a-ba0e-49a4-bc96-b9becf14c812/scratchpad

## Source of truth for each sim

`PROJECT/docs/sims/TODO/<sim-id>.json` — fields `specification` (full spec
text), `learning_objective`, `bloom_level`, `bloom_verb`, `library`,
`chapter_dir`. Also read the surrounding section of
`PROJECT/docs/chapters/<chapter_dir>/index.md` (search for the sim-id) so the
sim uses the chapter's terminology and examples.

## Book context

Book: "MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive
Learning Objects with AI". Audience: teachers, instructional designers,
learning-technology developers and learning-analytics practitioners (college
undergraduate and professional development). Many sims are *about* MicroSim
engineering (iframes, specs, xAPI, LRS, Bloom's taxonomy), so their data is
conceptual — make it concrete, correct and consistent with the chapter text.

## Already done centrally — do NOT repeat

- Steps 1, 2 (spec extraction and scaffolding): every sim dir already has a
  generator-scaffolded `main.html`, `index.md`, `metadata.json`. The scaffold
  hardcodes wrong defaults ("9-12 High School Geometry", "Mathematics",
  "TODO" objectives) — you must replace them.
- Steps 5 and 7 (chapter iframes, mkdocs nav) are run centrally AFTER all
  agents finish.

## Hard rules

- Only write inside `PROJECT/docs/sims/<sim-id>/` for sims in YOUR batch.
  Never edit chapter files, mkdocs.yml, docs/sims/index.md, gallery files,
  other sims, the TODO JSONs, or anything in ibook-skills.
  (Exception: `sync-iframe-heights.py --sim <id>` may update a chapter that
  already embeds that sim — that is fine.)
- Do not git add/commit/push. Do not run mkdocs gh-deploy.
- You cannot ask the user questions. Where the skill says "ask the user"
  (e.g. Step 3.4 animation vs step-through), make the call yourself, follow
  the skill's recommendation, and record the decision in your gap notes.
- Pinned CDN libraries only (keep the versions the scaffold/guides use). No
  textFont('Segoe UI'). Keep `<meta name="schema" ...>` and `<main>` in main.html.
- Do not fabricate references. Use real, stable URLs (Wikipedia, official
  library docs such as p5js.org/reference, chartjs.org, visjs.github.io,
  mermaid.js.org, leafletjs.com, plotly.com, xAPI spec on GitHub/ADL). If
  unsure a URL exists, leave it out.
- Do not fetch runtime data from third-party hosts; keep data local to the
  sim folder, and prefer embedding small datasets in the .js so the sim also
  works under file:// (the tester loads file:// URLs). If you do use a
  data.json, verify over HTTP and make sure the screenshot isn't a "Loading"
  frame (call redraw() after load in noLoop sketches).
- Use a color-blind-safe palette for categorical/diverging color encodings.
- No mascot admonitions on sim pages. Every Markdown list needs a blank line
  before it.

## Per-sim workflow (definition of done)

1. Read the TODO JSON + chapter context.
2. Step 3 Instructional Design Checkpoint. Put the 5-line "Instructional
   Design Check" block in your gap notes (not in index.md).
3. Route to the guide (Step 4.1 table; the spec's `library` field is the
   strong hint) and read that guide (once per library per batch is enough).
4. Write `<sim-id>.js` with `// CANVAS_HEIGHT: <int>` within the first 10
   lines. Adjust `main.html` as the guide requires for the library (container
   divs, CSS, CDN), still loading `<sim-id>.js`. For p5.js follow the guide's
   conventions (canvas.parent(document.querySelector('main')),
   updateCanvasSize(), builtin p5 controls, describe()).
5. Rewrite `index.md`: frontmatter (title, a real one-sentence description,
   image/og:image/twitter:image, social cards false, quality_score),
   `# Title`, iframe `src="main.html"` height = CANVAS_HEIGHT+2 with
   scrolling="no", fullscreen button, "Edit in the p5.js Editor" link ONLY for
   p5.js sims, then sections: About This MicroSim (state the learning
   objective + Bloom level/verb), How to Use, Iframe Embed Code (keep the
   copy-paste code block, correct height), Lesson Plan (audience above;
   duration, prerequisites, activities, assessment), References.
6. Rewrite `metadata.json` with correct subject/audience/objectives/Bloom,
   framework, canvas height (and top-level "canvasHeight": <int>).
7. `python3 $UTILS/validate-sims.py --project-dir $PROJECT --sim <id> --verbose`
   → fix issues until score ≥ 85 (the 5 screenshot points arrive in step 10).
8. `python3 $UTILS/sync-iframe-heights.py --project-dir $PROJECT --sim <id>`
9. `python3 $TESTER --sims-dir $PROJECT/docs/sims --sim <id>` → must PASS.
10. `bk-capture-screenshot $PROJECT/docs/sims/<id> 3 <iframe-height>` →
    creates `<id>.png`. Also make sure there are no JS console errors (a blank
    or half-drawn screenshot usually means one; a quick Playwright
    page.on('console') check is fine).
11. Step 9 layout review: Read the PNG, walk visual-checklist.md, patch FAILs
    per common-fixes.md, re-capture; max 3 cycles. Report residue honestly.

## Gap notes (the user explicitly wants these)

Write `SCRATCH/gaps/batch-NN.md` (NN = your batch number). One `## <sim-id>`
section per sim containing:

- The Instructional Design Check block.
- Bullets tagged `[spec-gap]`: details the specification left out that you had
  to invent or guess (e.g. unspecified dataset values, number of quiz items,
  canvas height/aspect, color mapping, what "feedback" should say, missing
  labels, ambiguous interaction, conflicting requirements). Say what you
  chose.
- Bullets tagged `[skill-gap]`: places where the microsim-generator skill,
  its guides or its utility scripts were missing guidance, wrong, or broke —
  beyond the known issues below. Be specific (file, step, what happened).
- Bullets tagged `[decision]`: any deviation from the spec and why.

Known issues — don't re-report unless you find something new about them:
UTILS path in SKILL.md is wrong; extract-sim-specs.py mislabels Bloom levels
as "Create"; generate-sim-scaffold.py hardcodes High-School-Geometry
audience/subject and "TODO" objectives; $BK_HOME unset; generate-sim-scaffold
falls back to p5.js for unrecognized library strings; test-iframe-heights.py
crashes without Playwright's bundled Chromium (use the shim) and its
CANVAS_HEIGHT regex expects "=" not ":"; validate-sims detect_library can
misfire on the text "p5.js" inside a non-p5 page; update-mkdocs-nav.py would
flatten the curated nav; validate-sims misses the copy-paste iframe block
when another language-tagged fence (e.g. ```json) precedes it — put the
"Iframe Embed Code" section before any other fenced block in index.md;
sync-iframe-heights.py also rewrites iframes inside fenced code blocks in
chapters (report any chapter it touches rather than hand-editing);
describe(..., LABEL) renders visible text under the canvas (use describe()
without LABEL); p5 createCheckbox/createButton labels are raw HTML, so
escape "<"/">" in label text; pin Mermaid to an exact version (10.9.8), not
@10.

## Final report (your return message — keep under 350 words)

A table: sim-id | library | CANVAS_HEIGHT | validator score | Playwright |
layout review (clean / fixed N / residue) — then one line per unresolved
problem, then the path of your gap-notes file.
