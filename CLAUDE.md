# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains 100+ educational p5.js simulations (MicroSims) designed for classroom use. Each simulation demonstrates STEM concepts with interactive controls, responsive design, and consistent UI patterns. The site is built with MkDocs and Material theme, hosted on GitHub Pages.

## Development Commands

### Site Management
- `mkdocs serve` - Preview site locally at http://127.0.0.1:8000
- `mkdocs build` - Build static site to ./site/ directory
- `mkdocs gh-deploy` - Deploy to GitHub Pages

### Python Utilities
- `python src/mk-gallery.py` - Generate gallery.md from simulation directories (creates thumbnails)
- `python src/validate-yaml-file.py <yaml-file-path>` - Validate simulation metadata against schema
- `python src/list-sims.py` - List all simulation directories
- `python src/csv-to-json/csv-to-json.py` - Convert CSV data to JSON format

### Installation
```bash
pip install mkdocs mkdocs-material
```

## Code Style Guidelines

### JavaScript/p5.js Conventions
- Canvas setup: Use standard variables `canvasWidth`, `drawHeight`, `controlHeight`, `canvasHeight`, `margin`
- Structure: Global variables → setup() → draw() → helper functions → event handlers
- UI: Drawing area ('aliceblue') + Controls area ('white') with sliders at bottom
- Responsiveness: Implement `windowResized()` and `updateCanvasSize()` for horizontal adaptation
- Naming: Use camelCase for variables/functions, uppercase for constants
- Documentation: Use `describe()` for accessibility; comment simulation purpose and parameters

### Core Layout Structure
All MicroSims should follow a consistent layout paradigm:

```javascript
// Canvas dimensions
let canvasWidth = 400;                      // Initial width that will be updated responsively
let drawHeight = 400;                       // Height of simulation/drawing area
let controlHeight = 50;                     // Height of controls region
let canvasHeight = drawHeight + controlHeight; // Total canvas height
let margin = 25;                            // Margin for visual elements
let sliderLeftMargin = 105;                 // Left margin for slider positioning
let defaultTextSize = 16;                   // Base text size for readability
```

### Canvas Creation Pattern
```javascript
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  describe('My cool MicroSim', LABEL);
}
```

### Responsive Design Implementation
```javascript
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  // Get container width for responsive design
  containerWidth = document.querySelector('main').offsetWidth;
}
```

## Project Architecture

### Directory Structure
```
microsims/
├── docs/                    # MkDocs content
│   ├── sims/               # MicroSims 2.0 simulations (plus graph-viewer and template)
│   │   ├── {sim-name}/    # Each simulation has its own directory
│   │   │   ├── index.md   # Documentation with YAML metadata
│   │   │   ├── {sim-name}.js      # p5.js sketch
│   │   │   ├── {sim-name}.html    # Optional HTML wrapper
│   │   │   └── {sim-name}.png     # Preview image
│   │   └── TODO/          # Diagram specs extracted from the chapters
│   ├── microsims-old/     # The original MicroSims 1.0 collection (moved from sims/;
│   │                      #   plugins/legacy_sims_redirects.py redirects the old /sims/<name>/ URLs)
│   ├── chapters/          # Educational theory documentation
│   ├── setup/             # Getting started guides
│   ├── prompts/           # Prompt engineering guides
│   └── rules/             # Development rules documentation
├── src/                   # Python utilities
│   ├── mk-gallery.py      # Gallery generator (creates thumbnails)
│   ├── validate-yaml-file.py  # YAML metadata validator
│   ├── list-sims.py       # Lists all simulations
│   ├── microsim-schema.json   # JSON Schema for metadata
│   └── csv-to-json/       # CSV conversion utilities
├── .cursor/rules/         # Cursor AI coding rules
│   └── microsims.mdc      # Comprehensive p5.js MicroSim patterns
├── mkdocs.yml            # MkDocs configuration with 100+ nav entries
└── site/                 # Generated site (build artifact, git-ignored)
```

### Simulation Metadata (Dublin Core)
Each `index.md` should include YAML frontmatter following the schema in `src/microsim-schema.json`:

**Required fields:**
- `dublinCore`: title, creator, subject, description, date, type, format, language, rights
- `educational`: gradeLevel, subjectArea, topic, learningObjectives
- `technical`: framework (p5.js), canvasDimensions, dependencies
- `userInterface`: controls array (sliders, buttons with properties)
- `simulation`: model type, variables, equations

**Example structure:**
```yaml
microsim:
  dublinCore:
    title: "Bouncing Ball"
    creator: ["ChatGPT", "Dan McCreary"]
    subject: ["Physics", "Kinematics"]
    description: "Interactive simulation of ball physics"
```

### Gallery Generation
The `mk-gallery.py` script:
1. Scans `docs/sims/` for subdirectories
2. Extracts title from first `#` heading in `index.md`
3. Finds `{sim-name}.png` preview image
4. Creates 128x128 thumbnail in `docs/sims/thumbnails/`
5. Generates `docs/sims/gallery.md` with 4-column table
6. Each cell: `[title](../sim-name) ![thumbnail](./thumbnails/sim-name.png)`

## Cursor AI Rules Integration
The `.cursor/rules/microsims.mdc` file contains comprehensive coding standards including:

**Layout Types:**
1. **Fixed Layout** - Simple static positioning for basic simulations
2. **Responsive Width Layout** - Horizontal scaling with `windowResized()` and `updateCanvasSize()`
3. **Two-Column Layout** - Simulation area + chart/graph area with `push()/translate()/pop()`

**Key patterns from the rules:**
- Canvas creation: Always use `canvas.parent(document.querySelector('main'))` for MkDocs integration
- Accessibility: Include `describe()` function in `setup()` for screen readers
- Control placement: Position relative to `drawHeight`, labels show current values
- Color scheme: 'aliceblue' drawing area, 'white' control area, 'silver' borders
- Animation control: Start/Pause button with `isRunning` state management
- Responsive sliders: `speedSlider.size(containerWidth - sliderLeftMargin - 15)`

## Important Development Notes

### MicroSim Design Principles
- **Educational Focus**: Designed for classroom use with clear learning objectives
- **p5.js Editor Compatibility**: All simulations must work in p5.js editor without modification
- **Responsive Horizontal Design**: Width adapts to container, height typically fixed
- **Consistent UI Patterns**: Standardized layout, controls, and visual hierarchy across all sims
- **Accessibility**: Use `describe()`, adequate contrast, keyboard navigation support

### Creating New Simulations
1. Copy the template from `docs/sims/template/`
2. Create directory: `docs/sims/{sim-name}/`
3. Required files: `index.md`, `{sim-name}.js`, `{sim-name}.png`
4. Optional: `{sim-name}.html` for standalone version
5. Add YAML metadata to `index.md` following `src/microsim-schema.json`
6. Add navigation entry to `mkdocs.yml`
7. Run `python src/mk-gallery.py` to regenerate gallery
8. Validate metadata: `python src/validate-yaml-file.py docs/sims/{sim-name}/index.md`

### Marking a MicroSim as a "Showcase"
When asked to mark a MicroSim as a "showcase" MicroSim, set the `showcase` flag in that sim's
`metadata.json` (`docs/sims/{sim-name}/metadata.json` or `docs/microsims-old/{sim-name}/metadata.json`).
The schema (`src/microsim-schema/microsim-schema.json`) defines it as an optional Boolean in the
`search` section, false when omitted:

```json
{
  "microsim": {
    "search": {
      "showcase": true
    }
  }
}
```

- Write the JSON literal `true` (lowercase), not Python's `True` or the string `"true"`.
- Put the flag in the file's existing `search` object: `microsim.search` when the file has the
  `microsim` wrapper, or the top-level `search` in the older flat-layout files. If the file has no
  `search` object, add one at the level where the rest of the metadata lives, and tell the user it
  still lacks the `tags` and `visualizationType` fields the schema requires in `search`.
- Change only the `showcase` field; leave the rest of the file and its formatting untouched.
- To remove showcase status, set `"showcase": false`.
- This is a metadata-only change: do not edit `index.md`, the sketch, or `mkdocs.yml` for it.

### Working with MkDocs
- Navigation is manually maintained in `mkdocs.yml` (100+ entries)
- Site uses Material theme with code copy, navigation expansion, search
- Math rendering via MathJax (use `$$` for equations)
- Markdown extensions: admonition, superfences, pymdownx
- Custom CSS: `docs/css/extra.css`, JS: `docs/js/extra.js`
- remember that even static diagrams like mermaid charts can have hovertext that can be logged for future activity logs through the xAPI interfaces

## Content Generation

Before generating content for the chapters, lesson plans, quizzes, FAQ or other student-facing
text, read the `CONTENT-GENERATION-GUIDE.md` file. Note that the teacher guide, instructor guide,
or other instructor-facing content does not use the mascot described in CONTENT-GENERATION-GUIDE.md.
