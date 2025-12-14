# Revenue Maximum Lesson Plan Development Log

**Date:** 2025-12-14
**MicroSim:** `/docs/sims/revenue-maximum/`
**Task:** Create detailed lesson plan and specify follow-up Profit Maximization MicroSim

---

## Session Summary

This session involved creating a comprehensive lesson plan for the Revenue Maximum MicroSim and designing a specification for a follow-up "Profit Maximization" MicroSim. A key learning moment occurred when the user challenged my initial three-panel design recommendation.

---

## Work Completed

### 1. Lesson Plan Creation

Added comprehensive educational content to `index.md`:

- **Learning Objectives**: 6 objectives aligned with Bloom's Taxonomy
- **Target Audience**: High school economics, AP Micro, college intro courses
- **Key Concepts Table**: Revenue, Demand Curve, Revenue Curve, Maximum Revenue, Price Elasticity
- **Four Detailed Activities**:
  1. Discovery Exploration (10 min)
  2. The Revenue Rectangle (10 min)
  3. Mathematical Connection (15 min)
  4. Real-World Application (15 min)
- **Discussion Questions**: 6 questions exploring the "revenue paradox"
- **Assessment Ideas**: Formative and summative options
- **Extensions**: Non-linear demand, profit vs revenue, dynamic pricing
- **Common Misconceptions Table**: 4 misconceptions with clarifications
- **Teacher Notes**: Timing, technology, differentiation

### 2. Revenue vs. Profit Section

Added a critical distinction section explaining why revenue maximization ≠ profit maximization, with a concrete numerical example showing that at MC = $30:
- Revenue-maximizing price ($100) yields profit of $7,000
- A higher price ($120) yields profit of $7,200

### 3. Profit Maximization MicroSim Specification

Designed specification for a follow-up MicroSim (see design evolution below).

---

## Design Evolution: Three Panels → Two Panels

### Initial Recommendation (Three Panels)

My first specification proposed a three-panel design:

```
┌─────────────────┬─────────────────┬─────────────────┐
│  DEMAND CURVE   │  COST CURVES    │  PROFIT CURVE   │
│                 │                 │                 │
│   (with profit  │   MC, ATC, AVC  │   (parabola)    │
│    rectangle)   │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

**My rationale at the time:**
- Cost curves (MC, ATC, AVC) are standard economics visualizations
- Showing where MC intersects MR demonstrates the classic profit-maximization condition
- Comprehensive coverage of all related concepts

### User Feedback

> "Why did you recommend a three-panel MicroSim, not just a two-panel MicroSim? It seems like the UI might be simpler, but I want your honest objective opinion from the perspective of an instructional designer."

### My Revised Analysis

The user's question prompted genuine reflection. From an instructional design perspective, the three-panel design was **over-engineered**:

**Problems with Three Panels:**

1. **Cognitive Overload**: Students must track three visualizations simultaneously. The "split attention effect" increases mental effort without proportional learning gains.

2. **Misaligned with Learning Objective**: The core insight is simple—*profit-maximizing price ≠ revenue-maximizing price*. A separate cost curves panel teaches a *different* concept (marginal analysis) that deserves its own MicroSim.

3. **No Direct Comparison**: With separate panels, students must mentally synthesize information across visualizations. Overlaying curves on the same axes makes the insight immediately visible.

4. **Breaks Consistency**: The Revenue Maximum MicroSim uses two panels. Matching this structure reduces orientation time.

5. **Practical Issues**: Three panels are cramped on mobile devices and classroom projectors.

### Final Recommendation (Two Panels)

```
┌───────────────────────┬───────────────────────┐
│    DEMAND CURVE       │   REVENUE vs PROFIT   │
│                       │                       │
│   (with profit        │   Both curves overlaid│
│    rectangle,         │   - Revenue (blue)    │
│    green/red)         │   - Profit (green)    │
└───────────────────────┴───────────────────────┘
```

**Why this is better:**

| Criterion | Three Panels | Two Panels |
|-----------|--------------|------------|
| Cognitive load | High (3 views) | Low (2 views) |
| Direct comparison | No | Yes (overlaid curves) |
| Core insight visibility | Indirect | Immediate |
| Consistency with Part 1 | No | Yes |
| Mobile-friendly | Poor | Good |

**Key design decision:** Overlaying revenue and profit curves on the same axes lets students directly see that the peaks occur at different prices. This is far more instructive than mentally synthesizing across separate panels.

---

## Lessons Learned

### 1. Match Complexity to Learning Objective

The learning objective was simple: understand that profit-maximizing price differs from revenue-maximizing price. The UI should be equally simple. I initially fell into the trap of "comprehensive coverage" when "focused clarity" was needed.

### 2. Separate Concepts Deserve Separate MicroSims

Cost curve analysis (MC, ATC, AVC) is an important topic, but it's a *different* topic. It deserves its own focused MicroSim rather than being shoehorned into a profit maximization simulation.

### 3. Direct Visual Comparison > Mental Synthesis

When the goal is to compare two things (revenue vs profit curves), put them on the same axes. Don't make students mentally overlay information from separate panels.

### 4. Value of User Pushback

The user's simple question—"why three panels?"—prompted genuine reflection that led to a better design. This demonstrates the value of questioning initial recommendations, even (especially) from AI assistants.

---

## Files Modified

| File | Changes |
|------|---------|
| `docs/sims/revenue-maximum/index.md` | Added lesson plan, activities, assessments, revenue vs profit section, MicroSim specification |

## Quality Score

- **Before**: 72
- **After**: 92 (added iframe width, copy-paste example, comprehensive lesson plan, references)

---

## Future Work

1. **Build the Profit Maximization MicroSim** following the two-panel specification
2. **Create a Cost Curves MicroSim** as a separate, more advanced simulation for teaching marginal analysis
3. **Link the two MicroSims** as "Part 1" and "Part 2" of an economics sequence

---

## Key Insight for Future MicroSim Design

> **Design Principle**: The complexity of the UI should match the complexity of the learning objective. If the core insight can be stated in one sentence, the visualization should be equally focused.

For this MicroSim:
- **One-sentence insight**: "Profit-maximizing price is higher than revenue-maximizing price when production has costs"
- **Focused visualization**: Two overlaid curves showing the gap between peaks
