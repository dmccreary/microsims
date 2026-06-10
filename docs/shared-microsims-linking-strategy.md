# Shared MicroSims Linking Strategy

This guide explains how MicroSims that are **shared across more than one
intelligent textbook** are stored, mounted, and linked — and exactly how links
must be updated when a MicroSim becomes shared. Read this before moving a
MicroSim into the shared library or before editing links to one.

!!! note "Two repositories, don't confuse them"
    - **[`microsims`](https://github.com/dmccreary/microsims)** (this site) — the
      broad public library of 110+ general-purpose educational MicroSims.
    - **[`shared-microsims`](https://github.com/dmccreary/shared-microsims)** — a
      small, **flat** repository holding only the MicroSims that are shared
      between specific AI/strategy textbooks. It is consumed by those books as a
      **git submodule**. This guide is about `shared-microsims`.

## TL;DR

- Shared MicroSims live once, in `dmccreary/shared-microsims` (flat: one dir per
  sim at the repo root).
- Each textbook mounts that repo as a git **submodule at `docs/sims/shared/`**.
- Inside a book, a shared sim is therefore referenced as **`sims/shared/<name>/`**
  (it used to be `sims/<name>/`).
- Because shared sims now sit **one directory deeper**, any link a shared sim
  makes *back up into a book's own pages* needs **one extra `../`**.

---

## Why this change was made

Several textbooks embed the **same** MicroSims (the idea funnel, Moore's Law,
the CLD viewer, etc.). Historically each book kept its **own copy** under
`docs/sims/<name>/`. That caused the classic problem:

> Fix a bug or improve a sim in one book, and every other copy silently goes
> stale. There is no single source of truth, and the copies drift apart.

We evaluated three ways to fix this:

| Option | Verdict |
|--------|---------|
| **Copy** sims into each book (status quo) | ❌ Drift — N copies, no source of truth. |
| **Cross-site iframe** to another book's published sim URL | ❌ Runtime coupling — a book breaks if the host site renames/removes a sim or goes private; breaks local `mkdocs serve`; no version pinning. |
| **Git submodule of a central repo** | ✅ Single source of truth, each book pins its own version, deploys fully self-contained (the built `gh-pages` branch has plain files, no runtime dependency). |

We also rejected submoduling **this `microsims` repo** directly: git cannot
submodule a *subdirectory*, and `microsims` keeps its sims at `docs/sims/`, so a
book would have ended up with the ugly nested path
`docs/sims/shared/docs/sims/<name>/` plus ~160 MB of unrelated history and 110+
unrelated sims built into it. A **dedicated flat repo** (`shared-microsims`)
mounts cleanly at `docs/sims/shared/<name>/` with no baggage.

We deliberately **did not** preserve the old `sims/<name>/` URLs — the change
date the URLs moved to `sims/shared/<name>/` was 2026-06-10, and link stability
for the old paths was not required.

---

## The architecture

```text
shared-microsims/            ← the central repo (flat)
├── shared-libs/             ← libraries used by several sims (diagram.js, style.css)
├── templates/               ← starter template for new sims
├── idea-funnel/
├── cld-viewer/
│   └── examples/*.json      ← CLD data files loaded via ?file=
└── … one directory per sim

<book>/                      ← e.g. tracking-ai-course, ai-strategy-for-education
└── docs/
    └── sims/
        ├── shared/          ← git submodule → dmccreary/shared-microsims
        │   ├── idea-funnel/
        │   └── …
        ├── learning-graph/  ← BOOK-SPECIFIC, stays a normal directory
        └── index.md         ← MicroSim gallery
```

A shared sim is served from a book at `/<book>/sims/shared/<name>/`.

---

## How to update links for a shared MicroSim

When a MicroSim moves from `docs/sims/<name>/` to the submodule at
`docs/sims/shared/<name>/`, **every reference to it gains a `shared/` segment**,
and **links the sim makes back into the book gain one `../`**. There are five
patterns. The first three are in the *book*; the last two are in the *sim* (and
therefore live in the `shared-microsims` repo).

### Pattern A — references in book content (the common case)

Anything that contains the path segment `sims/<name>/` — chapter prose, iframes,
`mkdocs.yml` nav, slides, `slide-viewer.html`:

```diff
- sims/idea-funnel/main.html
+ sims/shared/idea-funnel/main.html

- ../../sims/cld-viewer/examples/winner-takes-all-cld.json
+ ../../sims/shared/cld-viewer/examples/winner-takes-all-cld.json
```

This single rule (`sims/<name>/` → `sims/shared/<name>/`) covers every prefix
form: `../../sims/`, `./sims/`, `/sims/`, `docs/sims/`, and bare `sims/`.

### Pattern B — the MicroSim gallery (`docs/sims/index.md`)

The gallery uses **bare relative** links to its siblings (`./<name>/`), with no
`sims/` segment:

```diff
- [Idea Funnel](./idea-funnel/index.md)
+ [Idea Funnel](./shared/idea-funnel/index.md)
- ![Idea Funnel](./idea-funnel/idea-funnel.png)
+ ![Idea Funnel](./shared/idea-funnel/idea-funnel.png)
```

### Pattern C — sibling links from a *kept* book-specific page

A page that stays under `docs/sims/` (e.g. the `learning-graph` MicroSim Quality
Report) links to sibling sims with `../<name>/`. Those siblings moved into
`shared/`:

```diff
- [AI Causes](../ai-causes/index.md)
+ [AI Causes](../shared/ai-causes/index.md)
```

### Pattern D — back-links *from a shared sim* into book content (the depth gotcha)

This is the one that's easy to miss. A shared sim's `index.md` lives at
`docs/sims/shared/<name>/` — **one level deeper** than before. Any link it makes
up to a book's root content (`articles/…`, `glossary.md`) needs **one more `../`**:

```diff
  <!-- inside e.g. cld-viewer/index.md -->
- [Winner Takes All article](../../articles/winner-takes-all.md)
+ [Winner Takes All article](../../../articles/winner-takes-all.md)
- [glossary](../../glossary.md#frozen-in-time)
+ [glossary](../../../glossary.md#frozen-in-time)
```

!!! warning "Back-links into book-specific pages are a content smell"
    A shared sim should not assume a *specific* book's pages exist. The
    `../../../articles/winner-takes-all.md` links above resolve in
    `tracking-ai-course` but **will break in any other book** that adopts the sim
    without that article. When a second book adopts one of these sims, either add
    the target page to that book or **remove/genericize the back-link** in
    `shared-microsims`.

### cld-viewer specifics

`cld-viewer` is the richest case. In addition to Patterns A–D:

- **`?file=` query params** are preserved through the rewrite:
  `sims/shared/cld-viewer/main.html?file=ai-flywheel-cld&menu=true`.
  (MkDocs may emit a benign "target not found" warning for query-string links to
  a static `main.html`; the file is present in the build and works at runtime.)
- **Example CLD data** lives at `cld-viewer/examples/*.json` inside the submodule
  and is referenced as `sims/shared/cld-viewer/examples/<name>-cld.json`.
- **GitHub source links** inside `cld-viewer/index.md` were retargeted from the
  old book repo to the shared repo, e.g.
  `https://github.com/dmccreary/shared-microsims/tree/main/cld-viewer/examples`.

---

## MicroSims impacted by this change

### Moved into `shared-microsims` (27 sims)

These were relocated from `tracking-ai-course/docs/sims/<name>/` to
`shared-microsims/<name>/` and are now mounted in consuming books at
`docs/sims/shared/<name>/`:

| | | | |
|---|---|---|---|
| ai-benchmarks-timeline | ai-causes | ai-cmm | ai-doubling-rate |
| ai-flywheel | ai-pace-accelerating | ai-task-horizons | autoregressive |
| blooms-taxonomy | book-gen-workflow | book-levels | cld-viewer |
| eight-ai-forces | four-futures | hype-cycle | idea-funnel |
| lm-arena-timeline | mmlu-timeline | moores-law | porters-five-forces |
| power-wall | projecting-ai | swot | technology-adoption |
| timeline | tokenizer | winner-takes-all-cld | |

Plus two shared **helper** directories: `shared-libs/` (used via
`../shared-libs/diagram.js` and `../shared-libs/style.css`) and `templates/`.

### Required the Pattern D back-link depth fix (4 sims)

These contained `../../` links into book content that were bumped to `../../../`:

- **`cld-viewer`** → `articles/winner-takes-all.md`
- **`eight-ai-forces`** → `articles/winner-takes-all.md`
- **`timeline`** → `glossary.md#frozen-in-time`
- **`winner-takes-all-cld`** → `articles/winner-takes-all.md`

### NOT shared — left as book-specific directories

These stay under each book's own `docs/sims/` and were **not** moved (they read
each book's own data and are not reusable):

- **`learning-graph`** — in `tracking-ai-course` (reads `tracking-ai*.json`)
- **`graph-viewer`** — in `ai-strategy-for-education`

---

## Sharing a NEW MicroSim (checklist)

1. Build/generate the sim. Keep any shared-library reference as
   `../shared-libs/diagram.js` (never an absolute path).
2. Add the sim directory to the **`shared-microsims`** repo root; commit + push.
3. In each consuming book, pull the update (below) and reference it as
   `sims/shared/<name>/` (Pattern A) and in the gallery as `./shared/<name>/`
   (Pattern B).
4. If the sim links back to book content, use `../../../` (Pattern D) — and
   prefer **not** to hard-link into one book's pages at all.

## Maintainer update workflow

Edit a shared sim **in the `shared-microsims` repo**, never inside a book's
`docs/sims/shared/` (that leaves the submodule on a detached HEAD):

```bash
# 1. fix it upstream
cd ~/Documents/ws/shared-microsims
#   …edit…; git commit -am "…"; git push

# 2. pull into each book, on your schedule
cd ~/Documents/ws/<book>/docs/sims/shared
git checkout main && git pull
cd ../../..
git add docs/sims/shared        # record the new pinned commit
git commit -m "Update shared MicroSims"
mkdocs gh-deploy
```

Each book stays pinned to a specific commit until you do this, so shared-sim
changes never reach a published site unexpectedly.

## Clone & CI notes

- Clone a consuming book with `git clone --recurse-submodules`, or run
  `git submodule update --init docs/sims/shared` afterward — otherwise
  `docs/sims/shared/` is empty and the sims 404.
- In GitHub Actions, set `actions/checkout` with `submodules: recursive`.
- `mkdocs gh-deploy` builds from the working tree, so the submodule must be
  checked out first; the deployed `gh-pages` branch then contains plain files
  with no runtime submodule dependency.

## Consuming textbooks

| Textbook | Submodule path | Live site |
|----------|----------------|-----------|
| `tracking-ai-course` | `docs/sims/shared/` | <https://dmccreary.github.io/tracking-ai-course/> |
| `ai-strategy-for-education` | `docs/sims/shared/` | <https://dmccreary.github.io/ai-strategy-for-education/> |

Add a row whenever a new book starts consuming shared MicroSims.
