# Figures for MicroSims ArXiv Paper

## Created Figures

### 1. Learning Effectiveness Chart ✅
**File**: `effectiveness-chart.pdf` (55KB), `effectiveness-chart.png` (264KB)
**Section**: 9 (Expected Benefits)
**Status**: Complete and integrated into paper
**Figure reference**: `\ref{fig:effectiveness}`

### 2. MicroSim Uniqueness Venn Diagram ✅
**File**: `microsim-uniqueness.png`
**Section**: 4 (Definition), referenced in Section 2 (Introduction)
**Status**: Complete and integrated into paper
**Figure reference**: `\ref{fig:uniqueness}`

**Description**:
Venn diagram showing the three key characteristics that define MicroSims:
- Simplicity (lightweight, focused scope)
- Accessibility (browser-based, universal embedding)
- AI Generation (standardized patterns, prompt-compatible)
The center intersection labeled "MicroSims" represents the unique convergence of these three attributes.

**LaTeX integration**:
```latex
\begin{figure}[htbp]
\centering
\includegraphics[width=0.6\textwidth]{figures/microsim-uniqueness.png}
\caption{MicroSims occupy a unique position at the intersection...}
\label{fig:uniqueness}
\end{figure}
```

### 1. Learning Effectiveness Chart (Details)
**Description**:
Bar chart comparing learning outcomes between traditional instruction and interactive simulations across three key measures:
- Conceptual Understanding Gains: +15% to +25%
- Mastery Time Reduction: -30% to -40%
- Student Engagement Increase: +25% to +35%

**Technical specs**:
- Resolution: 300 DPI
- Size: 10×6 inches
- Format: PDF (vector) for LaTeX, PNG (raster) for preview
- Error bars showing research ranges
- Citations: PhET studies, meta-analyses

**Generation script**: `create_effectiveness_chart.py` (Python/matplotlib)

**LaTeX integration**:
```latex
\begin{figure}[htbp]
\centering
\includegraphics[width=0.95\textwidth]{figures/effectiveness-chart.pdf}
\caption{Learning effectiveness of interactive simulations...}
\label{fig:effectiveness}
\end{figure}
```

---

## Planned Figures (Not Yet Created)

### 2. MicroSim Architecture Diagram
**Priority**: High
**Target Section**: 6 (Technical Architecture)
**Content**: Layered diagram showing p5.js → Canvas → iframe → LMS
**Suggested tool**: draw.io, Lucidchart, or TikZ
**Estimated size**: 1 page width

### 3. Uniqueness Venn Diagram
**Priority**: High
**Target Section**: 1 (Introduction), 4 (Definition)
**Content**: Three circles (Simplicity, Accessibility, AI Generation) with MicroSims at center
**Suggested tool**: Export from existing `microsim-uniqueness` MicroSim
**Estimated size**: 0.6 page width

### 4. Development Workflow Diagram
**Priority**: Medium
**Target Section**: 8 (Workflow)
**Content**: Flowchart from educator prompt → AI generation → testing → deployment
**Suggested tool**: draw.io or Mermaid
**Estimated size**: Full page width

### 5. Responsive Layout Structure
**Priority**: Medium
**Target Section**: 6 (Technical Architecture)
**Content**: Side-by-side comparison of desktop vs mobile layout
**Suggested tool**: Figma or screenshot composition
**Estimated size**: 0.8 page width

### 6. Metadata Schema Hierarchy
**Priority**: Low
**Target Section**: 7 (Metadata)
**Content**: Tree diagram of metadata components
**Suggested tool**: draw.io or yEd
**Estimated size**: 0.7 page width

### 7. High-Impact Application Categories
**Priority**: Medium
**Target Section**: 9 (Expected Benefits)
**Content**: Grid of example MicroSim screenshots by category
**Suggested tool**: Image composition in Figma
**Estimated size**: Full page

---

## Figure Creation Workflow

### For Python/matplotlib figures:
1. Create script in `figures/create_*.py`
2. Run script to generate PDF and PNG
3. Add figure to LaTeX using `\includegraphics`
4. Reference in text using `\ref{fig:label}`
5. Rebuild paper with `./build.sh`

### For diagram figures:
1. Create in draw.io/Lucidchart/TikZ
2. Export as PDF (vector format preferred)
3. Place in `figures/` directory
4. Add to LaTeX document
5. Rebuild and verify

### Quality checklist:
- [ ] Resolution: 300 DPI minimum
- [ ] Format: PDF (vector) preferred, PNG acceptable
- [ ] Size: Appropriate for page layout (typically 0.6-0.95 \textwidth)
- [ ] Labels: Clear, readable text at target size
- [ ] Citations: Data sources noted in caption
- [ ] Accessibility: High contrast, colorblind-friendly palette
- [ ] File size: Reasonable (<1MB for PDF, <500KB for PNG)

---

## Dependencies

Python packages required for figure generation:
```bash
pip3 install matplotlib numpy
```

Current versions:
- matplotlib: 3.10.7
- numpy: 2.3.4

---

Last updated: 2024-10-18
