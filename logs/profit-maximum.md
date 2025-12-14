# Profit Maximum MicroSim Development Log

**Date:** 2025-12-14
**MicroSim:** `/docs/sims/profit-maximum/`
**Prerequisite:** Revenue Maximum MicroSim

---

## Session Summary

Created a new "Profit Maximum" MicroSim as Part 2 to the existing Revenue Maximum simulation. This MicroSim demonstrates why profit-maximizing price differs from revenue-maximizing price when production costs are considered.

---

## Design Decision: Two Panels vs Three Panels

This MicroSim was designed based on learnings from the Revenue Maximum lesson plan session, where we determined that a **two-panel design** is superior to three panels for this learning objective.

### Why Two Panels?

| Criterion | Three Panels | Two Panels |
|-----------|--------------|------------|
| Cognitive load | High (3 views) | Low (2 views) |
| Direct comparison | No | Yes (overlaid curves) |
| Core insight visibility | Indirect | Immediate |
| Consistency with Part 1 | No | Yes |
| Mobile-friendly | Poor | Good |

**Key insight:** The core learning objective is simple—*profit-maximizing price ≠ revenue-maximizing price*. Overlaying both curves on the same axes makes this immediately visible.

---

## Files Created

```
docs/sims/profit-maximum/
├── main.html           # HTML wrapper with p5.js CDN
├── profit-maximum.js   # Two-panel p5.js simulation
├── index.md            # Documentation with lesson plan
└── metadata.json       # Dublin Core metadata
```

---

## Two-Panel Layout

### Left Panel: Demand Curve with Profit Rectangle

- Diagonal demand line (higher prices → fewer sales)
- **Green rectangle**: Profit when Price > Marginal Cost
- **Red rectangle**: Loss when Price < Marginal Cost
- Orange dashed line showing Marginal Cost level
- Current point on demand curve

### Right Panel: Revenue vs Profit Curves (Overlaid)

- **Blue curve**: Total Revenue (same parabola as Revenue Maximum)
- **Green curve**: Total Profit (revenue minus costs)
- **Blue dashed line**: Revenue-maximizing price (always $100)
- **Green dashed line**: Profit-maximizing price (shifts with MC)
- Zero line for reference
- Current points on both curves

### Controls

| Control | Range | Purpose |
|---------|-------|---------|
| Price Slider | $0-$200 | Set selling price |
| Marginal Cost Slider | $0-$80 | Adjust per-unit production cost |
| Show Revenue Curve | Checkbox | Toggle revenue curve visibility |

---

## Bug Fixes During Development

### Bug 1: Profit Curve Extending Below Drawing Area

**Problem:** When marginal cost was high (e.g., MC=80), the left side of the profit curve extended below the drawing area.

**Cause:** Fixed scaling used `-maxValue * 0.3` for the minimum, but actual minimum profit at MC=80 is:
```
minProfit = (0 - 80) × 200 = -16,000
```
Which exceeded the fixed scale of -3,300.

**Fix:** Calculate actual minimum profit based on current MC:
```javascript
let minProfitValue = -marginalCost * maxQuantity;
let profitScale = Math.max(Math.abs(minProfitValue), maxValue);
```

### Bug 2: Revenue and Profit Curves Not Aligned When MC=0

**Problem:** When MC=0, revenue and profit should be identical, but the profit curve peak appeared ~10 pixels higher than the revenue curve peak.

**Cause:** Different vertical scaling:
- Revenue: `map(rev, 0, maxValue, ...)`
- Profit: `map(prof, -profitScale, +profitScale, ...)`

With symmetric scaling, profit values mapped to different Y positions than identical revenue values.

**Fix:** Use same top scale for both curves:
```javascript
// Use same top scale as revenue (maxValue) so curves align when MC=0
// Extend bottom to accommodate negative profits
let profitMin = Math.min(minProfitValue, 0);
let profitMax = maxValue;  // Same as revenue scale top
```

Now:
- When MC=0: `profitMin=0`, both curves use `0 to maxValue` → perfect overlap
- When MC>0: `profitMin<0` extends scale for losses, but peaks still align

---

## Key Formula Demonstrated

$$P^* = 100 + \frac{MC}{2}$$

| Marginal Cost | Revenue-Max Price | Profit-Max Price | Difference |
|---------------|-------------------|------------------|------------|
| $0 | $100 | $100 | $0 |
| $20 | $100 | $110 | $10 |
| $40 | $100 | $120 | $20 |
| $60 | $100 | $130 | $30 |

---

## Lesson Plan Highlights

**Target Audience:** High school economics students (grades 10-12)

**Learning Objectives:**
1. Distinguish between revenue and profit
2. Calculate profit using: Profit = Revenue - Total Cost
3. Explain why profit-maximizing price differs from revenue-maximizing price
4. Predict how marginal cost changes affect optimal pricing
5. Identify break-even points
6. Apply concepts to real-world business decisions

**Key Activities (no time estimates per user request):**
1. Connecting to Revenue Maximum (MC=0 case)
2. Discovering the Shift (increase MC gradually)
3. Understanding the Profit Rectangle
4. Finding Break-Even Points
5. Exploring the Loss Zone

**Common Misconceptions Addressed:**
- "Just add a markup to cost" → Optimal markup depends on demand elasticity
- "Sell as many as possible" → Volume isn't always better; margin matters
- "Revenue and profit move together" → They peak at DIFFERENT prices when MC > 0

---

## Integration

- Added to `mkdocs.yml` navigation in alphabetical order
- Links to Revenue Maximum as prerequisite (Part 1)
- Cross-references in both MicroSims

---

## Quality Score

**92/100** (missing only screenshot image `profit-maximum.png`)

---

## Design Principles Applied

1. **Match complexity to learning objective**: Simple insight → simple UI
2. **Direct visual comparison**: Overlaid curves show the gap immediately
3. **Consistency**: Same two-panel structure as Revenue Maximum
4. **Progressive disclosure**: Checkbox to show/hide revenue curve
5. **Color coding**: Green=profit, Red=loss, Blue=revenue

---

## Future Enhancements

1. Add screenshot image for social media preview
2. Create p5.js editor link for code exploration
3. Consider adding "Cost Curves" as a separate, more advanced MicroSim for teaching MC/ATC/AVC relationships
