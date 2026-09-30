# Central (orchestrator) findings

## [skill-gap] microsim-generator SKILL.md — UTILS path is wrong
Step 0.1 sets `UTILS="$HOME/Documents/ws/ibook-skills/src/microsim-utils"`; the scripts live at
`~/projects/ibook-skills/src/microsim-utils`. The fallback ("check the project's own src/microsim-utils/")
also misses. Suggest resolving via the skill's own symlink target (`~/.claude/skills/microsim-generator`
→ repo root) or `$BK_HOME`, and failing loudly if not found.

## [skill-gap] $BK_HOME is referenced but never set
Steps 6C and 9 use `$BK_HOME/skills/microsim-utils/...`; the variable is unset in this environment.

## [tool-bug] extract-sim-specs.py mislabels Bloom level as "Create" (109 of 112)
This book's specs write `Learning objective (Bloom level: Understand; verb: summarize): ...`. The extractor
returned `bloom_level: "Create"` for 109/112 sims (probably matching the word "create" elsewhere in the
spec text). The microsim-utils TODO extractor (create-microsim-todo-json-files.py) needed the same format
support; it was patched in this session (extract_qualifier_bloom). The two extractors should share one parser.

## [tool-bug] Two scaffolders with different outputs
microsim-utils `scaffold-microsims-from-todo.py` writes a placeholder main.html (no library CDN, no
schema meta, no `<main>`, Segoe UI font) and an index.md containing the full spec; microsim-generator
`generate-sim-scaffold.py` writes a proper main.html + validator-shaped index.md but drops the spec and
objective. The microsim-utils SKILL.md recommends the former as "the natural next step" after TODO
extraction, but the generator then expects the latter. Pick one scaffolder (or make both produce the same
files) and document the hand-off.

## [tool-bug] generate-sim-scaffold.py hardcodes a High-School-Geometry audience
index.md "Grade Level: 9-12 (High School Geometry)", metadata subject "High School Geometry",
subjectArea "Mathematics", learningObjectives ["TODO: Add learning objectives"] even though the spec
carries the objective. Should read audience/subject from the course description or mkdocs.yml and carry
the spec's learning objective, Bloom level and verb through.

## [tool-bug] generate-sim-scaffold.py silently falls back to p5.js for unrecognized library strings
Specs use free-text library values: "Custom HTML table with JavaScript", "HTML and CSS", "HTML and
JavaScript", "Mermaid with a click directive on every node", "venn.js". The scaffold maps anything not in
LIBRARY_CDNS to p5.js without a warning. Needs a normalization step (fuzzy map to the canonical
generator names) and a warning when it falls back.

## [tool-bug] update-mkdocs-nav.py would destroy a curated nav
Dry run: "Would replace lines 71-205 (135 lines) with 228 lines" — it flattens the hand-organized
MicroSims section (subgroups such as "Basic Microsims") into one alphabetical list. The skill marks this
step MANDATORY with "Do NOT manually edit". Needs an additive mode (append new sims under a named
subgroup, e.g. by chapter) or detection of nested groups before replacing.

## [spec-gap] Instrumentation is never specified
The book's central claim is instrumented MicroSims (xAPI), and 20 specs are *about* xAPI, but no spec
says whether the sim itself should emit xAPI statements, which verbs, or which runtime to load. There is
no xapi-runtime in the repo. The spec template should have an "Instrumentation" field (verbs, evidence
class, concept IRIs) or an explicit "none".

## [tool-bug] test-iframe-heights.py has no browser fallback
Crashes when Playwright's bundled Chromium isn't installed; bk-capture-screenshot already falls back to
the system Chrome (`channel='chrome'`). Several agents independently wrote the same shim. The tester
should share the screenshot script's launch logic.

## [skill-gap] Iframe height is only correct at one width
Heights are sized for the ~700–800px chapter column. At <600px, controls wrap and panels stack, so
most DOM-based sims outgrow a fixed-height iframe. The skill should either require the postMessage
auto-height protocol (microsim-utils iframe-auto-height.md) for DOM-layout sims, or test at two widths.

## [tool-bug] sync-iframe-heights.py rewrites iframes inside fenced code blocks
It matches any `sims/<id>/main.html` iframe in any page, including worked examples inside ``` fences.
In this book, ch 12 line ~186 is a teaching example ("400 + 50 = 450 → 452px") that references the real
bouncing-ball-gravity-lab; the tool rewrote it to 502px and broke the arithmetic. It should skip fenced
code blocks (and probably indented code), or at least report them separately.

## [spec-gap] Chapter prose uses a real sim as a hypothetical example
Ch 12 (lines ~175–186, 253, 388) uses bouncing-ball-gravity-lab with CANVAS_HEIGHT 450; the ch 1 spec
for that sim asks for a 100px control region, so the built sim is 500. Either the chapter examples should
use a hypothetical sim-id, or the spec generator should cross-check numbers the chapter states about a sim.

## [tool-bug] add-iframes-to-chapter.py only looks *below* the heading for an existing iframe
Ch 8 embeds the reused graph-viewer with the iframe + fullscreen button placed *above*
`#### Diagram: Learning Graph Viewer`. The script searches only the 40 lines after the heading, so its
dry run plans a duplicate iframe for graph-viewer. It should also check a few lines above the heading
and skip specs with `**Status:** Reused` or a `**Source:**` field. It also has no --exclude/--sim option.

## [tool-bug] add-iframes --fix-heights reads createCanvas(), not the CANVAS_HEIGHT comment
The skill says the `// CANVAS_HEIGHT:` comment is the single source of truth, but add-iframes'
--fix-heights parses createCanvas() height (wrong for non-p5 sims and for p5 sims whose canvas height is a
variable). Insert with a placeholder and let sync-iframe-heights.py set the height, or share its resolver.
