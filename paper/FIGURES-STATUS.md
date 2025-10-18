# Figures Status for MicroSims ArXiv Paper

**Last Updated**: 2024-10-18

## Policy
**All figures must be in PNG format (no PDF files)**

---

## ✅ Completed Figures (2/10)

### Figure 1: MicroSim Uniqueness Venn Diagram
- **File**: `figures/microsim-uniqueness.png` (97KB)
- **Location**: Section 4 (Definition), referenced in Section 2 (Introduction)
- **Label**: `\ref{fig:uniqueness}`
- **Status**: ✅ Integrated and verified
- **Description**: Three-circle Venn diagram showing Simplicity, Accessibility, and AI Generation with MicroSims at the center intersection

### Figure 2: Learning Effectiveness Chart
- **File**: `figures/effectiveness-chart.png` (264KB)
- **Location**: Section 9 (Expected Benefits)
- **Label**: `\ref{fig:effectiveness}`
- **Status**: ✅ Integrated and verified
- **Description**: Bar chart showing +15-25% conceptual gains, -30-40% time reduction, +25-35% engagement increase
- **Generation**: Python/matplotlib script available (`create_effectiveness_chart.py`)

---

## 📋 Remaining High-Priority Figures (3)

### Figure 3: MicroSim Architecture Diagram
- **Priority**: HIGH
- **Target Section**: 6 (Technical Architecture)
- **Format**: PNG (300 DPI)
- **Content**: Layered diagram showing:
  - Bottom: p5.js library + HTML5 Canvas
  - Middle: MicroSim (draw area + control area)
  - Top: iframe wrapper → LMS/Platform
  - Annotations: responsive design, sandboxing, cross-platform
- **Suggested Tool**: draw.io, Lucidchart, or Figma
- **Estimated Size**: 0.8-0.9 textwidth

### Figure 4: Development Workflow Diagram
- **Priority**: HIGH
- **Target Section**: 8 (Workflow)
- **Format**: PNG (300 DPI)
- **Content**: Flowchart showing:
  1. Educator specifies requirements (natural language)
  2. AI generates code using rules
  3. Preview in browser
  4. Iterative refinement
  5. Metadata generation
  6. Deployment to LMS/textbook
  - Include feedback loops
- **Suggested Tool**: draw.io or Mermaid
- **Estimated Size**: Full page width (0.95 textwidth)

### Figure 5: Responsive Layout Structure
- **Priority**: MEDIUM
- **Target Section**: 6 (Technical Architecture)
- **Format**: PNG (300 DPI)
- **Content**: Side-by-side comparison:
  - Left: Desktop view (wider canvas)
  - Right: Mobile view (narrower canvas)
  - Each showing draw area (400px) + control area (50px)
  - Annotate dimensions and responsive elements
- **Suggested Tool**: Screenshot composition or Figma
- **Estimated Size**: 0.8 textwidth

---

## 📋 Optional Medium/Low Priority Figures (5)

### Figure 6: Metadata Schema Hierarchy
- **Priority**: MEDIUM
- **Target Section**: 7 (Metadata)
- **Format**: PNG
- **Content**: Tree/hierarchy showing Dublin Core + Educational + Technical + Analytics metadata

### Figure 7: High-Impact Application Categories
- **Priority**: MEDIUM
- **Target Section**: 9 (Expected Benefits)
- **Format**: PNG
- **Content**: Grid (2×3) of example MicroSim screenshots by category

### Figure 8: PhET Usage Statistics Map
- **Priority**: LOW
- **Target Section**: 9 (Expected Benefits)
- **Format**: PNG
- **Content**: World map showing 175 countries, 45M runs/year

### Figure 9: Bloom's Taxonomy Integration
- **Priority**: LOW
- **Target Section**: 5 (Design Framework)
- **Format**: PNG
- **Content**: Pyramid showing how MicroSims support each level

### Figure 10: Code Example with Annotations
- **Priority**: LOW
- **Target Section**: 6 (Technical Architecture)
- **Format**: Inline LaTeX listing (not a separate figure)
- **Content**: Annotated code showing standard structure

---

## Current Paper Statistics

- **Total Figures**: 2 completed
- **PDF Size**: 488KB
- **Sections with Figures**: 2, 4, 9
- **All Figures Format**: PNG ✅
- **All Cross-References Working**: Yes ✅

---

## Next Steps

### Immediate (for minimal viable paper):
1. Create Architecture Diagram (Figure 3)
2. Create Workflow Diagram (Figure 4)

### Soon (for complete paper):
3. Create Responsive Layout figure (Figure 5)
4. Consider adding Metadata Schema or Application Categories

### Optional (if time permits):
5. Add supplementary figures (PhET map, Bloom's taxonomy, etc.)

---

## Figure Creation Commands

### For Python figures:
```bash
cd paper/figures
python3 create_effectiveness_chart.py
```

### After creating any figure:
```bash
cd paper
./build.sh
```

### Verify figure in paper:
```bash
open main.pdf
```

---

## Quality Standards

All figures must meet:
- ✅ PNG format (required)
- ✅ 300 DPI minimum resolution
- ✅ Clear, readable text at print size
- ✅ High contrast for accessibility
- ✅ File size < 1MB per figure
- ✅ Proper citation in caption
- ✅ Cross-referenced in text

---

## Notes

- The effectiveness chart script generates both PDF and PNG, but only PNG is used
- PDF versions can be kept for reference but should not be included in LaTeX
- ArXiv accepts PNG figures without issue
- PNG ensures consistent rendering across different LaTeX distributions
