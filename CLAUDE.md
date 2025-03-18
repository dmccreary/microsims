# MicroSims Project Reference Guide

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

### File Organization
- Each simulation: directory with index.md, .js file, main.html file, and optional .png preview
- YAML metadata requires: Name, Description, SubjectArea, Topic, Parameters, GradeLevel