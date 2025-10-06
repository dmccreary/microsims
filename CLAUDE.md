# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Preview site: `mkdocs serve`
- Build site: `mkdocs build`
- Generate gallery: `python src/mk-gallery.py`
- Validate YAML: `python src/validate-yaml-file.py <yaml-file-path>`
- Convert CSV to JSON: `python src/csv-to-json/csv-to-json.py`

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
- **docs/**: MkDocs documentation and simulation content
  - **sims/**: Individual simulation directories, each containing:
    - `index.md`: Main documentation page
    - `{sim-name}.js`: p5.js simulation code
    - `{sim-name}.html`: HTML wrapper (optional)
    - `{sim-name}.png`: Preview image
- **src/**: Python utilities and tools
  - `mk-gallery.py`: Generates gallery.md from simulation directories
  - `validate-yaml-file.py`: Validates YAML metadata against schema
  - `microsim-schema.json`: JSON schema for simulation metadata
- **site/**: Generated MkDocs output (build artifact)

### Metadata Schema
Each simulation should include YAML metadata following the Dublin Core standard defined in `src/microsim-schema.json`, including:
- `title`: Simulation name
- `description`: Educational purpose and content
- `subject`: Topic keywords and subject areas
- `gradeLevel`: Target educational level
- `parameters`: Configurable simulation parameters

### File Organization
- Each simulation: directory with index.md, .js file, main.html file, and optional .png preview
- YAML metadata requires: Name, Description, SubjectArea, Topic, Parameters, GradeLevel

## Cursor AI Rules Integration
The project includes comprehensive Cursor AI rules in `.cursor/rules/microsims.mdc` that define:
- Standardized p5.js coding patterns
- Responsive layout requirements
- Educational simulation best practices
- UI component positioning and styling
- Accessibility requirements (describe() function usage)

## Important Development Notes
- MicroSims are educational p5.js simulations designed for classroom use
- All simulations should work in the p5.js editor without modifications
- Focus on responsive horizontal design (height is typically fixed)
- Use consistent naming conventions and UI patterns across simulations
- Include accessibility features and clear educational documentation
- Follow the established canvas setup and responsive design patterns