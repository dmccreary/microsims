# MicroSims JSON Metadata Schema

This directory contains the comprehensive JSON Schema for Educational MicroSims metadata, designed to support search, discovery, documentation, and educational analytics.

## Files

- `microsim-schema.json` - Complete JSON Schema definition (draft-07)
- `example-bouncing-ball.json` - Comprehensive example metadata (validates against the schema)
- `validate.py` - Command-line validator for metadata.json files
- `microsim-schema-v1.json` - Legacy v1 schema, kept for reference only
- `README.md` - This documentation file

A copy of `microsim-schema.json` ships with the intelligent-textbook skills at
`skills/microsim-utils/assets/microsim-schema.json` in the
[ibook-skills](https://github.com/dmccreary/ibook-skills) repo. Keep the two files identical.

## Schema Overview

The enhanced schema provides comprehensive metadata for Educational MicroSims across multiple dimensions:

### Core Sections

1. **Dublin Core** - Standard resource description metadata (required)
2. **Search & Discovery** - Enhanced findability and categorization (required)
3. **Educational** - Pedagogical metadata and learning design (required)
4. **Technical** - Architecture, performance, and compatibility (required)
5. **User Interface** - Controls, layout, and interaction design (required)
6. **Simulation** - Model specifications and variables (optional)
7. **Analytics** - Learning analytics and data collection (optional)
8. **Usage** - Pedagogical recommendations and assessment (optional)

## Key Enhancements

### Search & Discovery
- **Tags & Keywords**: Comprehensive tagging for improved search
- **Visualization Types**: Categorize by visualization style (animation, chart, graph, etc.)
- **Interaction Level**: Scale of required user interaction (passive to very-high)
- **Complexity Score**: 1-10 rating for filtering and recommendation
- **Application Domains**: Primary use cases (education, research, training, etc.)

### Enhanced User Interface Documentation
- **Layout Types**: Fixed, responsive-width, two-column, multi-panel, dashboard
- **Color Schemes**: Standardized color palette documentation
- **Responsive Breakpoints**: Width-based adaptation points
- **Control Specifications**: Detailed UI element properties including:
  - Extended control types (range-slider, toggle-button, multi-select, etc.)
  - Accessibility features (keyboard shortcuts, ARIA labels)
  - Validation rules and error handling
  - Control dependencies and relationships
  - Responsive behavior specifications

### Educational Metadata
- **Cognitive Load Theory**: Intrinsic, extraneous, and germane load assessment
- **Scaffolding**: Type, adaptability, and removal strategies
- **Misconceptions**: Common misconceptions addressed with evidence
- **Transfer Skills**: Skills that transfer to other domains
- **Assessment Rubrics**: Detailed evaluation criteria
- **Learning Theories**: Theoretical foundations informing design

### Technical Architecture
- **Performance Metrics**: Frame rate, memory usage, computational complexity
- **Device Requirements**: Minimum specifications and compatibility
- **Data Flow**: Input sources, processing steps, output targets
- **State Management**: Type of state handling and persistence
- **Accessibility**: Comprehensive accessibility features including:
  - Screen reader scripts and keyboard navigation
  - Alternative input methods and sensory alternatives
  - Detailed accessibility compliance documentation

### Learning Analytics
- **Event Categorization**: Structured event tracking with importance levels
- **Learning Indicators**: Behavioral evidence of learning with measurement methods
- **Engagement Metrics**: Quantified engagement assessment
- **Progress Tracking**: Milestone-based progress monitoring
- **Adaptive Elements**: System adaptation based on student performance
- **Privacy & Security**: Comprehensive data protection specifications

## Usage Instructions

### Validating Metadata
Use `validate.py` to check one or more metadata.json files against the schema.
It uses the `jsonschema` package with draft-07 rules and format checking.
`rfc3339-validator` is needed to check `date-time` values; without it they are
silently accepted, and the script prints a warning.

```bash
pip install jsonschema rfc3339-validator
python src/microsim-schema/validate.py docs/sims/bouncing-ball/metadata.json
```

Each file prints `OK` or `FAIL` followed by one line per error, giving the JSON
path and the problem. The script exits with status 0 when every file is valid,
1 when any file is invalid, and 2 when a file or the schema can't be loaded.
Use `--schema` to validate against a different schema file.

Note that the whole document must be wrapped in a top-level `microsim` object,
as in `example-bouncing-ball.json`.

### Dates
`dublinCore.date` accepts either an ISO 8601 date (`2026-09-29`) or a full
RFC 3339 date-time (`2026-09-29T00:00:00Z`). The skill documentation recommends
the `YYYY-MM-DD` form.

### Required Fields
The schema requires these top-level sections:
- `dublinCore` - Basic resource information
- `search` - Discovery and categorization
- `educational` - Learning objectives and pedagogy
- `technical` - Technical specifications
- `userInterface` - Interface and control documentation

### Optional Sections
- `simulation` - Model and variable specifications
- `analytics` - Learning analytics specifications
- `usage` - Pedagogical recommendations

## Search & Discovery Features

The enhanced schema supports advanced search and filtering:

### By Complexity
```json
"complexity": 3  // 1=simple, 10=very complex
```

### By Interaction Level
```json
"interactionLevel": "moderate"  // passive, low, moderate, high, very-high
```

### By Visualization Type
```json
"visualizationType": ["animation", "simulation"]
```

### By Application Domain
```json
"applicationDomains": ["education", "demonstration"]
```

## Control Documentation

The schema provides detailed control specifications:

### Control Types Supported
- `slider`, `range-slider` - Continuous value inputs
- `button`, `toggle-button` - Action triggers
- `checkbox`, `radio` - Boolean/option selections
- `dropdown`, `multi-select` - Option lists
- `text-input`, `number-input` - Text entry
- `color-picker`, `file-upload`, `date-picker` - Specialized inputs

### Control Properties
Each control requires `id`, `type` and `label`, and may include:
- Position and size (with responsive behavior)
- Accessibility features (keyboard shortcuts, ARIA labels)
- Validation rules and constraints
- Dependencies and effects on other elements
- Control-specific `properties`, checked according to the control's `type`:

| Control `type` | `properties` fields |
|----------------|---------------------|
| `slider` | `min`, `max`, `default` (all required numbers), `step`, `units`, `logarithmic`, `showValue` |
| `button`, `toggle-button` | `text`, `action`, `toggleable`, `style` (`primary`, `secondary`, `danger`, `success`) |
| `checkbox`, `radio` | `checked`, `value` |
| `dropdown`, `multi-select` | `options` (list of `{value, label, disabled}`), `default` (string or list of strings), `multiple` |
| `text-input`, `number-input` | `placeholder`, `default` (string or number), `maxLength`, `autocomplete` |
| `range-slider`, `color-picker`, `file-upload`, `date-picker` | any object (not yet specified) |

## Educational Integration

### Cognitive Load Assessment
Document the cognitive load imposed by the simulation:
```json
"cognitiveLoad": {
  "intrinsic": "low",     // Inherent material complexity
  "extraneous": "low",    // Interface-imposed load
  "germane": "moderate"   // Schema construction load
}
```

### Scaffolding Documentation
Specify learning support provided:
```json
"scaffolding": {
  "type": ["guided-discovery", "feedback"],
  "adaptability": "fixed",
  "removal": "user-controlled"
}
```

### Assessment Integration
Include assessment rubrics and questions:
```json
"assessmentQuestions": [
  {
    "question": "What happens when speed is set to 0?",
    "type": "prediction",
    "level": "Understand"
  }
]
```

## Analytics & Privacy

### Learning Analytics
Document data collection for educational insights:
```json
"events": [
  {
    "name": "speed_adjusted",
    "category": "interaction",
    "importance": "important",
    "xAPIverb": "adjusted"
  }
]
```

### Privacy Compliance
Specify data handling and privacy measures:
```json
"privacy": {
  "piiCollected": false,
  "dataRetention": "Session only",
  "complianceStandards": ["FERPA", "GDPR"]
}
```

## Best Practices

1. **Completeness**: Fill in all required fields and relevant optional fields
2. **Consistency**: Use consistent terminology and formatting across simulations
3. **Accuracy**: Ensure technical specifications match actual implementation
4. **Educational Alignment**: Align metadata with actual learning objectives
5. **Accessibility**: Document all accessibility features comprehensively
6. **Privacy**: Clearly specify data collection and privacy measures

## Validation

The schema includes extensive validation rules:
- Required field enforcement
- Enumerated value constraints
- Format validation (dates, URLs, etc.)
- Logical consistency checks
- Range validations for numeric values

## Integration with Existing Tools

This schema is designed to work with:
- MkDocs site generation
- Gallery generation scripts
- Search and discovery systems
- Learning management systems
- Educational analytics platforms
- Accessibility assessment tools

## Contributing

When extending the schema:
1. Maintain backward compatibility
2. Add comprehensive documentation
3. Include validation rules
4. Update examples and tests
5. Consider educational and technical implications