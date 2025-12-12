# Triangle Type Explorer - MicroSim Installation Guide

## Quick Start

Congratulations! Your **Triangle Type Explorer** MicroSim has been generated and is ready for deployment.

### Installation Steps

```bash
cd /docs/sims
unzip triangle-type.zip
```

### Local Testing

```bash
# From the project root directory
mkdocs serve

# Open your browser to:
# http://localhost:8000/intro-to-trig/sims/triangle-type/
```

### Deployment to GitHub Pages

```bash
# Build and deploy
mkdocs gh-deploy
```

## File Structure

```
docs/sims/triangle-type/
├── index.md                          # Full documentation and lesson plan
├── main.html                         # Standalone executable HTML
├── triangle-type.js                  # p5.js sketch (fully editable)
├── metadata.json                     # Educational metadata
└── README.md                         # This file
```

## What's Included

### Documentation (`index.md`)
- Complete lesson plan for educators
- 4 ready-to-use classroom activities
- Learning objectives aligned to Bloom's Taxonomy
- Common misconceptions addressed
- Assessment strategies
- Standards alignment (CCSS)
- Troubleshooting guide

### Interactive Simulation (`triangle-type-explorer.js`)
- Three draggable vertices (A, B, C)
- Real-time triangle classification:
  - By sides: Equilateral, Isosceles, Scalene
  - By angles: Acute, Right, Obtuse
  - Combined classification (e.g., "Isosceles Right")
- Real-time measurements (side lengths and angles)
- Keyboard reset (R key)
- Responsive design for all screen sizes

### Metadata (`metadata.json`)
- Dublin Core elements
- Educational standards mapping
- Learning objectives
- Technical specifications
- Pedagogical guidance
- Usage tips for educators

## Key Features

✓ **Interactive Exploration** - Students drag vertices to create different triangle types
✓ **Real-Time Feedback** - Classification and measurements update instantly
✓ **Accessible** - High contrast, large fonts, keyboard support
✓ **Responsive** - Works on desktop, tablet, and mobile
✓ **Well-Documented** - Comprehensive lesson plan and educator guide
✓ **Standards-Aligned** - CCSS.MATH.CONTENT.7.G.A.2, 7.G.A.3, HSG.CO.B.8, HSG.SRT.A.1
✓ **Editable** - Code can be modified directly in p5.js editor

## Usage

### For Students
1. Open `main.html` in a web browser
2. Click and drag the red vertices (A, B, C)
3. Watch the triangle type update in real-time
4. Create specific triangle types as instructed
5. Press 'R' to reset to the starting position

### For Educators
1. Use the activities in `index.md` for lesson planning
2. Project `main.html` during class for guided exploration
3. Assign student activities from the documentation
4. Use assessment strategies provided in `index.md`
5. Modify code in p5.js editor for customization

## Classroom Activities

The documentation includes 4 complete classroom activities:

1. **Triangle Type Creation Challenge** (10 min)
   - Students race to create specific triangle types
   - Great for formative assessment

2. **Prediction and Verification** (15 min)
   - Students predict triangle properties
   - Use simulator to verify
   - Builds conceptual understanding

3. **Constraint Investigation** (12 min)
   - Answer constraint-based questions
   - Explore impossible combinations
   - Deep conceptual engagement

4. **Real-World Triangle Hunting** (20 min)
   - Connect to architecture and nature
   - Classify real-world triangles
   - Interdisciplinary connections

## Technical Details

**Framework**: p5.js v1.11.10  
**Size**: 32 KB total (uncompressed)  
**Browser Support**: Chrome, Firefox, Safari, Edge (all modern versions)  
**No Server Required**: Runs entirely in the browser  
**No External Dependencies**: Only p5.js library from CDN  

## Embedding in Other Sites

### Simple iframe Embed
```html
<iframe src="https://iowerx.github.io/intro-to-trig/sims/triangle-type/main.html" 
        height="512" 
        scrolling="no"></iframe>
```

### Canvas Height Calculation
- Drawing area: 400px
- Control area: 110px
- Total iframe height: 512px (400 + 110 + 2 for borders)

### Responsive Width
The MicroSim automatically adapts to container width.  
Minimum recommended width: 300px  
Optimal width: 500-800px

## Customization

The p5.js code is fully editable and can be customized for:

- **Different colors**: Change 'aliceblue', 'white', 'silver', 'red' color values
- **Different initial triangle**: Modify v1, v2, v3 initial positions
- **Additional measurements**: Add perimeter, area, or other calculations
- **Special triangles**: Highlight when 30-60-90 or 45-45-90 triangles are created
- **Tolerance values**: Adjust 5px side tolerance or 5° angle tolerance
- **Canvas size**: Change drawHeight, controlHeight, or canvasWidth constants

### Editing in p5.js Editor

1. Go to https://editor.p5js.org/
2. Create a new sketch
3. Copy entire contents of `triangle-type-explorer.js`
4. Paste into the editor
5. Modify as desired
6. Save to your p5.js account

## Before Going Live

1. **Create a thumbnail image**
   - File: `triangle-type-explorer.png`
   - Size: 400×512 pixels
   - Show example triangle with labels
   - Used for social sharing and documentation

2. **Test locally**
   ```bash
   mkdocs serve
   # Test all functionality, responsiveness, and interactions
   ```

3. **Update mkdocs.yml**
   ```yaml
   nav:
     - Sims:
       - Triangle Type Explorer: sims/triangle-type/
   ```

4. **Commit to version control**
   ```bash
   git add docs/sims/triangle-type/
   git commit -m "Add triangle-type MicroSim"
   git push origin main
   ```

5. **Deploy**
   ```bash
   mkdocs gh-deploy
   ```

## Support and Feedback

If you encounter issues or have suggestions:

1. Check the **Troubleshooting** section in `index.md`
2. Review the **Technical Details** section
3. Verify all files are in the correct location
4. Check browser console for JavaScript errors (F12)
5. Try the p5.js editor version for comparison
6. Check the p5.js reference at https://p5js.org/reference/

## Learning Outcomes

After using this MicroSim, students should be able to:

- Identify triangles by side length classification
- Recognize triangles by angle classification
- Understand relationships between sides and angles
- Explain why certain classifications are impossible
- Apply classification knowledge to new triangles
- Understand that angles in a triangle sum to 180°

## Standards

**Common Core State Standards:**
- CCSS.MATH.CONTENT.7.G.A.2
- CCSS.MATH.CONTENT.7.G.A.3
- CCSS.MATH.CONTENT.HSG.CO.B.8
- CCSS.MATH.CONTENT.HSG.SRT.A.1

**Grade Levels**: 6-8 (Middle School), 9-12 (High School)

## Next Steps

1. ✓ Extract the zip file
2. ✓ Review the documentation in `index.md`
3. ✓ Open `main.html` in a browser to test
4. ✓ Try the classroom activities
5. ✓ Create a screenshot for social sharing
6. ✓ Update your mkdocs.yml navigation
7. ✓ Deploy to your website

## Questions?

Refer to the comprehensive documentation in `index.md` for:
- Detailed usage instructions
- Lesson plans and activities
- Assessment strategies
- Standards alignment
- Troubleshooting guide
- Pedagogical guidance
- Extension activities

---

**Enjoy using Triangle Type Explorer!** 🔺

This MicroSim was generated using the p5.js Educational MicroSim Framework and is ready for immediate deployment in educational settings.
