# MicroSims ArXiv Paper

## Overview

This directory contains the LaTeX source files for the academic paper "MicroSims: A Framework for AI-Generated, Scalable Educational Simulations with Universal Embedding and Adaptive Learning Support" intended for submission to arXiv.org.

## Paper Status

**Current State**: Framework established with complete structure. Content extraction from source documentation in progress.

### Completed Sections
- ✅ Main LaTeX document structure (main.tex)
- ✅ Abstract (01-abstract.tex) - Complete
- ✅ Introduction (02-introduction.tex) - Complete
- ✅ Related Work (03-related-work.tex) - Complete
- ⚠️ Definition (04-definition.tex) - Structure with TODOs
- ⚠️ Design Framework (05-design-framework.tex) - Structure with TODOs
- ⚠️ Technical Architecture (06-architecture.tex) - Structure with TODOs
- ⚠️ Metadata (07-metadata.tex) - Structure with TODOs
- ⚠️ Workflow (08-workflow.tex) - Structure with TODOs
- ⚠️ Effectiveness (09-effectiveness.tex) - Partial content with TODOs
- ⚠️ Discussion (10-discussion.tex) - Structure with TODOs
- ✅ Conclusion (11-conclusion.tex) - Complete draft
- ⚠️ References (references.bib) - Partial, needs expansion

## Directory Structure

```
paper/
├── main.tex                    # Main LaTeX document
├── sections/
│   ├── 01-abstract.tex         # Paper abstract
│   ├── 02-introduction.tex     # Introduction and motivation
│   ├── 03-related-work.tex     # Literature review and positioning
│   ├── 04-definition.tex       # MicroSims definition
│   ├── 05-design-framework.tex # Design principles and framework
│   ├── 06-architecture.tex     # Technical implementation
│   ├── 07-metadata.tex         # Metadata and discovery
│   ├── 08-workflow.tex         # Development workflow
│   ├── 09-effectiveness.tex    # Empirical evidence
│   ├── 10-discussion.tex       # Discussion and implications
│   ├── 11-conclusion.tex       # Conclusion and future work
│   └── references.bib          # BibTeX references
├── figures/                    # Directory for figures (currently empty)
│   ├── (TODO: architecture-diagram.pdf)
│   ├── (TODO: venn-diagram.pdf)
│   ├── (TODO: responsive-design.pdf)
│   ├── (TODO: workflow-diagram.pdf)
│   └── (TODO: effectiveness-chart.pdf)
└── README.md                   # This file
```

## Compilation Instructions

### Local Compilation

Requirements:
- LaTeX distribution (TeX Live, MiKTeX, or MacTeX)
- pdflatex
- bibtex

```bash
cd paper
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

### Overleaf Setup

1. Go to https://www.overleaf.com
2. Create new project → Upload Project
3. Upload all files from `paper/` directory
4. Set main document to `main.tex`
5. Set compiler to pdfLaTeX
6. Compile

Overleaf Link: (TODO: Create and add Overleaf project link)

## Content Extraction TODOs

The following sections require content extraction from the source documentation:

### Section 4: Definition (04-definition.tex)
**Source**: `docs/chapters/what-is-a-microsim.md`

**Extract**:
- Formal definition with key attributes
- Technical architecture overview (browser-based, p5.js, server-free)
- Educational purpose and learning objectives
- Generative AI integration capabilities
- Accessibility and extensibility features
- What MicroSims are NOT (important distinctions)
- Metadata strategy (Dublin Core)

### Section 5: Design Framework (05-design-framework.tex)
**Source**: `docs/chapters/microsim-design.md`

**Extract**:
- Design principles (responsive architecture, accessibility, standards-based)
- Pedagogical foundations
- Learning objectives alignment with Bloom's Taxonomy
- Cognitive load management strategies
- Adaptive and personalized learning support
- Implementation standards and guidelines
- Quality assurance and testing protocols

### Section 6: Technical Architecture (06-architecture.tex)
**Sources**:
- `docs/chapters/width-responsive-design.md`
- `docs/chapters/microsim-design.md` (technical sections)

**Extract**:
- p5.js foundation and rationale
- Width-responsive design implementation details
- Canvas layout structure (draw height, control height, margins)
- iframe integration and security model
- Responsive design patterns (windowResized(), updateCanvasSize())
- Browser compatibility considerations
- Example code listings

### Section 7: Metadata (07-metadata.tex)
**Source**: `docs/chapters/describing-a-microsim.md`

**Extract**:
- Problem statement about AI-generated content organization
- Dublin Core metadata framework
- Educational metadata components
- Technical specifications for integration
- Simulation model documentation approach
- Learning analytics support
- Discovery and personalization capabilities
- JSON Schema structure examples

### Section 8: Workflow (08-workflow.tex)
**Source**: `docs/chapters/microsim-dev-workflow.md`

**Extract**:
- Repository discovery and initial search
- Faceted search for subject/grade level
- Template-based MicroSim generation
- Customization prompts for generative AI
- Iterative development with preview/refinement cycles
- Metadata generation for cataloging
- Testing, feedback, and validation
- LMS integration procedures
- xAPI integration for learning analytics

### Section 9: Effectiveness (09-effectiveness.tex)
**Source**: `docs/why/deep-research-final.md`

**Extract** (this is the most data-rich section):
- PhET usage statistics (45M+ annual runs)
- Meta-analysis findings (30-40% improvement rates)
- Student engagement data (25-35% increase in on-task time)
- Conceptual understanding gains (15-25% higher scores)
- Effectiveness across grade levels (5th grade to college)
- Common characteristics of effective MicroSims:
  * Intuitive interfaces
  * Familiar contexts and analogies
  * Making invisible visible
  * Interactive responsive feedback
  * Appropriate challenge and scaffolding
- High-impact application categories:
  * Physics and Engineering examples
  * Chemistry and Molecular Science examples
  * Biology and Life Science examples
  * Mathematics and Computational Thinking examples
  * Complex Systems and Systems Thinking examples
- Research citations from PhET, ERIC, MDPI studies

### Section 10: Discussion (10-discussion.tex)
**Sources**:
- `docs/why/uniqueness.md`
- `docs/why/motivation.md`
- `docs/chapters/advanced-topics.md`

**Extract**:
- Educational equity implications (cost barriers, language adaptation)
- Network effects of standardization
- Limitations and challenges
- Quality control in AI-generated content
- Integration with adaptive learning systems
- Scalability considerations
- Future directions (MicroSim sequences, intelligent textbooks, xAPI)

## References To Add (references.bib)

Additional citations needed from source documents:

From `docs/why/motivation.md`:
- Dale, E. (1969) - Audiovisual methods
- World Bank (2023) - Learning pyramid
- Additional usability studies

From `docs/why/deep-research-final.md`:
- ERIC database studies
- MDPI journal articles
- Additional PhET research papers

From `docs/chapters/microsims-in-the-ed-tech-landscape.md`:
- Pearson MyLab references
- McGraw-Hill Connect references
- Canvas, Blackboard, Moodle LMS references
- Labster and Beyond Labz references

## Figures To Create

Priority figures for the paper:

1. **Architecture Diagram** (High Priority)
   - Show: p5.js → HTML5 Canvas → iframe → LMS/Platform
   - Include: sandboxed security, responsive scaling
   - Suggested tool: draw.io, Lucidchart, or TikZ

2. **Venn Diagram** (High Priority)
   - Three circles: Simplicity, Accessibility, AI Generation
   - Center intersection: "MicroSims"
   - Can export from the microsim-uniqueness MicroSim!

3. **Responsive Design Comparison** (Medium Priority)
   - Side-by-side: Fixed layout vs. Width-responsive
   - Show how MicroSims adapt to different screen widths

4. **Development Workflow** (Medium Priority)
   - Flowchart: Educator → AI Prompt → Generation → Testing → Refinement → Deployment
   - Include feedback loops

5. **Effectiveness Data Visualization** (High Priority)
   - Bar chart or graph showing learning outcome improvements
   - Data from PhET studies and meta-analyses
   - Compare simulation vs. traditional instruction

6. **Metadata Schema Visualization** (Low Priority)
   - Hierarchical diagram of Dublin Core + Educational extensions
   - Show relationships between metadata components

7. **High-Impact Categories** (Medium Priority)
   - Pie chart or bar chart showing MicroSim distribution across subject areas
   - Or: Grid of example MicroSims by category

## Compilation Checklist

Before final submission to arXiv:

- [ ] All TODO comments addressed
- [ ] All source content extracted and converted
- [ ] All figures created and included
- [ ] All references added to BibTeX with DOIs
- [ ] References compiled correctly (bibtex main)
- [ ] No undefined citations
- [ ] No orphaned headings
- [ ] Consistent terminology throughout
- [ ] Abstract under 250 words
- [ ] Page count appropriate (target: 15-18 pages)
- [ ] All math notation properly formatted
- [ ] Code listings properly formatted
- [ ] Figures referenced in text
- [ ] Figure captions descriptive
- [ ] Acknowledgments complete
- [ ] Author affiliations correct
- [ ] License selected (recommend CC BY 4.0)
- [ ] PDF compiles without errors
- [ ] Final proofreading complete

## ArXiv Submission Requirements

### Category Selection
Primary: **cs.CY** (Computers and Society)
Secondary: **cs.HC** (Human-Computer Interaction)
Optional: **cs.AI** (Artificial Intelligence)

### File Requirements
- Single PDF or source files (LaTeX preferred)
- All figures as separate files or embedded
- File size limit: 50MB total, 10MB per figure
- Supported formats: PDF (figures), PNG, JPEG, EPS

### Metadata Requirements
- Title (check for proper capitalization)
- Author names and affiliations
- Abstract (250 words max)
- Comments field (optional, for describing paper purpose)
- MSC/ACM classification codes (optional)
- License (CC BY 4.0 recommended for open access)

### Before Upload
1. Compile final PDF locally
2. Check PDF renders correctly
3. Verify all figures display properly
4. Test all hyperlinks
5. Review author information
6. Prepare submission statement (explains research contributions)

## Contact and Collaboration

For questions or to contribute to content extraction:
- Email: dan.mccreary@gmail.com
- GitHub: https://github.com/dmccreary/microsims

## Timeline Estimate

Content Extraction and Completion:
- Section 4-8 content extraction: 4-6 hours
- Section 9 detailed research data: 2-3 hours
- Section 10 synthesis: 1-2 hours
- Figure creation: 3-4 hours
- References completion: 1-2 hours
- Final review and editing: 2-3 hours
- **Total estimated: 13-20 hours**

## Next Steps

1. Extract content from source files section by section
2. Create priority figures (Venn diagram, Architecture, Effectiveness chart)
3. Complete BibTeX references with DOIs
4. Upload to Overleaf for collaborative editing
5. Conduct thorough review and proofreading
6. Prepare arXiv submission package
7. Submit to arXiv
8. Share preprint link with educational technology community

## Notes

- The paper framework is designed to be ArXiv-compatible
- Current structure follows standard academic paper format
- All source content is available in `docs/chapters/` and `docs/why/`
- The MicroSim framework itself demonstrates the concepts described in the paper
- Consider creating a companion website with live MicroSim examples

---

Last Updated: 2024
Status: In Progress
Target Completion: TBD
