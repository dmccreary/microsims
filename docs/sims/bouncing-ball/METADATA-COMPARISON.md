# Metadata Comparison: Bouncing Ball MicroSim

## File Comparison

| File | Lines | Purpose |
|------|-------|---------|
| `metadata.json` | 275 | Full comprehensive metadata with all optional fields |
| `metadata-minimal.json` | 54 | **Minimal metadata with only required fields** |

**Reduction**: 80% smaller (221 lines removed)

---

## Required Fields by Section

Based on `/src/microsim-schema/microsim-schema.json`, these are the REQUIRED fields:

### 1. `microsim.dublinCore` (9 required fields)

```json
{
  "title": "string",
  "creator": ["array of strings"],
  "subject": ["array of strings"],
  "description": "string",
  "date": "ISO 8601 datetime",
  "type": "Interactive Simulation | Educational MicroSim",
  "format": "text/javascript | application/javascript | text/html",
  "language": "ISO 639-1 code (e.g., 'en')",
  "rights": "string"
}
```

### 2. `microsim.search` (4 required fields)

```json
{
  "tags": ["array of strings"],
  "visualizationType": ["animation", "chart", "graph", etc.],
  "interactionLevel": "passive | low | moderate | high | very-high",
  "complexity": 1-10
}
```

### 3. `microsim.educational` (4 required fields)

```json
{
  "gradeLevel": ["K", "1", "2", ..., "12", "Undergraduate", "Graduate", "Adult"],
  "subjectArea": ["Mathematics", "Science", "Physics", etc.],
  "topic": ["array of strings"],
  "learningObjectives": ["array of strings"]
}
```

### 4. `microsim.technical` (2 required fields)

```json
{
  "framework": "p5.js | vanilla-js | d3.js | three.js | other",
  "canvasDimensions": {
    "width": integer,
    "height": integer,
    "responsive": boolean
  }
}
```

### 5. `microsim.userInterface` (1 required field)

```json
{
  "controls": [
    {
      "id": "string",
      "type": "slider | button | checkbox | etc.",
      "label": "string",
      "properties": {
        // Varies by control type
        // For slider: min, max, default required
      }
    }
  ]
}
```

### 6. `microsim.simulation` (0 required fields)

```json
{
  // Can be empty object: {}
}
```

---

## Top-Level Required Sections

According to line 820 of the schema:

```json
"required": ["dublinCore", "search", "educational", "technical", "userInterface", "simulation"]
```

All 6 sections must be present, even if some (like `simulation`) can be empty.

---

## Minimal Example for Bouncing Ball

The `metadata-minimal.json` file contains exactly the required fields:

```json
{
  "microsim": {
    "dublinCore": { /* 9 required fields */ },
    "search": { /* 4 required fields */ },
    "educational": { /* 4 required fields */ },
    "technical": { /* 2 required fields including nested canvasDimensions */ },
    "userInterface": {
      "controls": [ /* At least one control with required properties */ ]
    },
    "simulation": {} /* Empty but required */
  }
}
```

**Total Required Fields**: 21 fields minimum
- dublinCore: 9 fields
- search: 4 fields
- educational: 4 fields
- technical: 2 fields (framework + canvasDimensions with 3 sub-fields)
- userInterface: 1 field (controls array, with each control having 4 required fields)
- simulation: 0 fields (empty object acceptable)

---

## Optional Sections Not Included in Minimal

These sections are completely optional:
- `analytics` - Learning analytics and xAPI integration
- `usage` - Pedagogical recommendations and assessment questions

---

## Optional Fields Within Required Sections

Many fields within required sections are optional, for example:

### In `dublinCore` (optional):
- publisher
- contributor
- identifier
- source
- relation
- coverage

### In `educational` (optional):
- bloomsTaxonomy
- prerequisites
- duration
- difficulty
- curriculumStandards
- cognitiveLoad
- scaffolding
- misconceptions
- transferSkills
- assessmentRubric
- learningTheory

### In `technical` (optional):
- version
- regions
- dependencies
- browserCompatibility
- performance
- deviceRequirements
- dataFlow
- stateManagement
- accessibility

### In `userInterface` (optional):
- layoutType
- layoutPattern
- colorScheme
- responsiveBreakpoints
- visualElements

### In `simulation` (all optional):
- model
- variables
- scenarios

---

## Validation

To validate either file against the schema:

```bash
python src/validate-yaml-file.py docs/sims/bouncing-ball/metadata-minimal.json
```

Or using a JSON schema validator:

```bash
npm install -g ajv-cli
ajv validate -s src/microsim-schema/microsim-schema.json -d docs/sims/bouncing-ball/metadata-minimal.json
```

---

## Use Cases

**Full metadata (`metadata.json`)**:
- Production deployments
- LMS integration
- Learning analytics
- Comprehensive cataloging
- Accessibility compliance documentation

**Minimal metadata (`metadata-minimal.json`)**:
- Quick prototyping
- Development/testing
- Understanding schema requirements
- Template for new MicroSims
- Minimal viable metadata

---

## Key Insights

1. **80% of fields are optional** - The schema is very flexible
2. **21 minimum required fields** - Mostly basic descriptive metadata
3. **Educational metadata is concise** - Only 4 required fields
4. **Technical specs are minimal** - Framework + dimensions only
5. **Controls must be documented** - At least one control with properties
6. **Simulation section can be empty** - Flexibility for various sim types

---

## Recommended Workflow

1. **Start with minimal** - Use `metadata-minimal.json` as template
2. **Add as needed** - Gradually expand with optional fields
3. **Prioritize by use case**:
   - Adding to LMS? → Add `analytics` section
   - Need accessibility? → Add `technical.accessibility`
   - Want recommendations? → Add `usage` section
   - Complex model? → Fill out `simulation.model`

---

Last updated: 2024-10-18
