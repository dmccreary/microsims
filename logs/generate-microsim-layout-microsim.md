# Session Log: Generate MicroSim Layout Architecture Diagram

**Date:** 2025-01-26
**Skill Used:** microsim-p5
**MicroSim Name:** microsim-layout
**Title:** MicroSim Layout Architecture

## Task Summary

Created an interactive architecture diagram MicroSim that demonstrates the standard two-region layout pattern used by all MicroSims in the collection.

## Specifications

- **Canvas Size:** 400x450 pixels (responsive width)
- **Drawing Region:** 400px height, alice blue background (#F0F8FF)
- **Control Region:** 50px height, white background (#FFFFFF)
- **Margin:** 25px from edges
- **Bloom's Taxonomy Level:** Remember, Understand

## Components Implemented

1. **Full canvas outline** with labeled dimensions
2. **Drawing Region** (top):
   - Alice blue background with silver border
   - Height label: "drawHeight = 400"
   - Animated bouncing ball with trajectory trail
   - Dashed margin lines showing 25px margins
   - "Drawing Region" label with "Visualization goes here" subtitle

3. **Control Region** (bottom):
   - White background
   - Height label: "controlHeight = 50"
   - Sample slider with label "Speed: 3.0"
   - "Control Region" label with "User controls here" subtitle
   - Silver dividing line between regions

4. **Dimension Annotations:**
   - canvasWidth dimension with arrows (dynamic, shows actual width)
   - canvasHeight dimension with arrows (450)
   - drawHeight dimension with arrows (400)
   - controlHeight label (50)
   - margin annotations with dashed lines (25)
   - Formula: "canvasHeight = drawHeight + controlHeight"

## Files Created

| File | Description |
|------|-------------|
| `docs/sims/microsim-layout/microsim-layout.js` | p5.js visualization code |
| `docs/sims/microsim-layout/main.html` | HTML wrapper with p5.js CDN |
| `docs/sims/microsim-layout/index.md` | Documentation with iframe and learning objectives |
| `docs/sims/microsim-layout/metadata.json` | Dublin Core metadata |

## Navigation Update

Added entry to `mkdocs.yml` in the MicroSims section:
```yaml
- MicroSim Layout: sims/microsim-layout/index.md
```

## Key Features

### Responsive Design
- Canvas width adapts to container using `updateCanvasSize()`
- `windowResized()` handler for browser resize events
- Ball position constrained on resize to stay within margins
- Sample slider width adjusts with canvas width

### Visual Elements
- Animated bouncing ball demonstrates the drawing area
- Trajectory trail shows ball movement path
- Sample slider illustrates control region usage
- Dimension arrows and labels for educational clarity
- Dashed margin lines show safe drawing area

### Code Structure
```javascript
// Standard responsive pattern
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
}

function draw() {
  updateCanvasSize();
  // ... drawing code
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
```

## User Modifications

After initial generation, the user made the following modifications:
1. Updated `index.md` to include p5.js editor link
2. Adjusted `sliderX` from 150 to 180 in `drawSampleSlider()` function

## Testing

To test locally:
```bash
mkdocs serve
```
Then visit: http://localhost:8000/microsims/sims/microsim-layout/

## Embedding

```html
<iframe src="https://dmccreary.github.io/microsims/sims/microsim-layout/main.html"
        height="452px"
        scrolling="no">
</iframe>
```

## Reminder

Create a `microsim-layout.png` screenshot for social media previews.

## Learning Objectives

1. **Remember** the standard canvas dimension variables used in MicroSims
2. **Understand** the purpose of separating drawing and control regions
3. **Apply** this layout pattern when creating new MicroSims
