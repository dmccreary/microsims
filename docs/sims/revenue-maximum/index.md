---
title: Revenue Maximum
description: An interactive MicroSim demonstrating how revenue changes with price and the concept of maximum revenue.
quality_score: 92
image: revenue-maximum.png
social:
    cards: false
---

# Revenue Maximum

<iframe src="main.html" width="100%" height="450px" scrolling="no"></iframe>

```html
<iframe src="https://dmccreary.github.io/microsims/sims/revenue-maximum/main.html" width="100%" height="450px" scrolling="no"></iframe>
```

[Run Revenue Maximum Fullscreen](main.html){ .md-button .md-button--primary }

[Edit in p5.js Editor](https://editor.p5js.org/dmccreary/sketches/atfbM4MTM)

## About This MicroSim

This two-panel MicroSim demonstrates the fundamental economic relationship between price, quantity demanded, and total revenue.

**Left Panel: Demand Curve**

- Shows the inverse relationship between price and quantity
- The shaded rectangle represents total revenue (Price × Quantity)
- As price increases, quantity demanded decreases

**Right Panel: Revenue Curve**

- Shows how total revenue varies with price
- Revenue = Price × Quantity = Price × (MaxQuantity - Price)
- This creates a parabolic curve
- Maximum revenue occurs at the midpoint price (Price = 100)
- The orange vertical line marks the maximum revenue point

### How to Use

1. Move the **Price slider** to adjust the selling price (0-200)
2. Observe how quantity changes on the left panel (demand curve)
3. Watch the shaded revenue rectangle grow and shrink
4. Find the price that maximizes revenue (peak of the parabola)
5. Notice the orange line marking the maximum revenue point at Price = 100

## Lesson Plan

### Learning Objectives

By the end of this lesson, students will be able to:

1. **Define** revenue as the product of price and quantity sold
2. **Explain** the inverse relationship between price and quantity demanded
3. **Identify** the price point that maximizes total revenue
4. **Analyze** why neither the highest nor lowest price generates maximum revenue
5. **Apply** the concept of revenue optimization to real-world pricing decisions
6. **Connect** the geometric representation (rectangle area) to the algebraic formula

### Target Audience

- High school economics students (grades 10-12)
- AP Microeconomics students
- College introductory economics courses
- Business and entrepreneurship classes

### Prerequisites

- Basic algebra (multiplication, variables)
- Understanding of graphs and coordinate systems
- Concept of supply and demand (helpful but not required)

### Key Concepts

| Concept | Definition |
|---------|------------|
| **Revenue** | Total income from sales: Revenue = Price × Quantity |
| **Demand Curve** | Graph showing inverse relationship between price and quantity demanded |
| **Revenue Curve** | Parabolic graph showing revenue at each price point |
| **Maximum Revenue** | The highest possible revenue, occurring at the optimal price |
| **Price Elasticity** | How sensitive quantity demanded is to price changes |

### Lesson Activities

#### Activity 1: Discovery Exploration (10 minutes)

**Instructions for students:**

1. Start with the slider at Price = 0. What is the revenue? Why?
2. Move to Price = 200. What is the revenue now? Why?
3. Slowly move the slider from 0 to 200. At what price is revenue highest?
4. Record your observations in a table:

| Price | Quantity | Revenue |
|-------|----------|---------|
| 0 | ? | ? |
| 50 | ? | ? |
| 100 | ? | ? |
| 150 | ? | ? |
| 200 | ? | ? |

#### Activity 2: The Revenue Rectangle (10 minutes)

**Focus on the left panel:**

1. Notice the shaded blue rectangle under the demand curve
2. The width represents quantity, the height represents price
3. The area of the rectangle equals revenue (length × width = P × Q)
4. Find the price where the rectangle has the maximum area
5. **Discussion**: Why does the rectangle get smaller at extreme prices?

#### Activity 3: Mathematical Connection (15 minutes)

**Deriving the revenue formula:**

Given the demand function: Q = 200 - P

Revenue = P × Q = P × (200 - P) = 200P - P²

This is a downward-opening parabola! The maximum occurs at:

$$P = \frac{200}{2} = 100$$

Maximum Revenue = 100 × (200 - 100) = 100 × 100 = **10,000**

**Verify with calculus (for advanced students):**

$$\frac{dR}{dP} = 200 - 2P = 0$$

$$P = 100$$

#### Activity 4: Real-World Application (15 minutes)

**Scenario: Movie Theater Pricing**

A movie theater has a demand curve where:

- At $0, 1000 people would attend
- At $20, nobody would attend
- Demand decreases linearly with price

**Questions:**

1. Write the demand equation: Q = 1000 - 50P
2. Write the revenue equation: R = P × (1000 - 50P)
3. What price maximizes revenue?
4. What is the maximum revenue?
5. Should the theater charge this price? What other factors matter?

### Discussion Questions

1. **The Revenue Paradox**: Why doesn't the highest possible price generate the most revenue?

2. **Zero Revenue Points**: The revenue curve touches zero at two points. What do these represent economically?

3. **Business Strategy**: If you were a business owner, would you always charge the revenue-maximizing price? What other factors might influence your decision?

4. **Elasticity Connection**: How does this simulation relate to the concept of price elasticity of demand?

5. **Real Examples**: Can you think of products where companies seem to price at the revenue-maximizing point? Products where they don't?

6. **Shape of the Curve**: Why is the revenue curve a parabola (symmetric curve) in this simulation? Would it always be symmetric in real life?

### Assessment Ideas

#### Formative Assessment

- Exit ticket: "At what price is revenue maximized in our simulation, and why?"
- Partner discussion: Explain to your partner why revenue is zero at both P=0 and P=200

#### Summative Assessment

**Problem**: A concert venue has the following demand relationship:

- Maximum capacity: 5000 seats
- At $0, all 5000 seats would be filled
- At $100, no one would attend
- Demand is linear

Calculate:

1. The demand equation (5 points)
2. The revenue equation (5 points)
3. The revenue-maximizing price (5 points)
4. The maximum revenue (5 points)
5. Explain why the answer makes intuitive sense (5 points)

### Extensions

#### For Advanced Students

1. **Non-linear demand**: What if demand doesn't decrease linearly? How would the revenue curve change?

2. **Cost consideration**: Revenue isn't profit! If each unit costs $30 to produce, what price maximizes profit?

3. **Multiple products**: How would a company balance prices across multiple related products?

4. **Dynamic pricing**: Research how airlines and hotels use demand-based pricing

#### Cross-Curricular Connections

- **Mathematics**: Quadratic functions, optimization, calculus derivatives
- **Business**: Pricing strategy, market research, profit maximization
- **Psychology**: Consumer behavior, price perception
- **Data Science**: Demand forecasting, regression analysis

### Common Misconceptions

| Misconception | Clarification |
|---------------|---------------|
| "Higher prices always mean more revenue" | Revenue depends on BOTH price AND quantity sold |
| "The demand curve IS the revenue curve" | They're related but different—revenue is the AREA under the demand curve |
| "Maximum revenue = maximum profit" | Profit also considers costs, not just revenue |
| "This is how all real markets work" | This is a simplified model; real demand curves are rarely perfectly linear |

### Teacher Notes

- **Time required**: 45-60 minutes for full lesson
- **Technology needs**: Projector/smartboard for demonstration, student devices for exploration
- **Differentiation**: Pair struggling students with peers; provide extension problems for advanced students
- **Prior knowledge check**: Review multiplication and graph reading before starting

## Revenue Maximization vs. Profit Maximization

!!! warning "Important Distinction"
    **Revenue maximization is NOT the same as profit maximization!** This MicroSim teaches revenue concepts, but businesses ultimately care about profit—what remains after costs are subtracted.

!!! tip "Next Steps"
    Ready to explore profit maximization? Continue to the [Profit Maximum MicroSim](../profit-maximum/index.md) to see how production costs change the optimal pricing decision.

### Why Revenue ≠ Profit

| Metric | Formula | What It Measures |
|--------|---------|------------------|
| **Revenue** | Price × Quantity | Total income from sales |
| **Cost** | Fixed Costs + (Variable Cost × Quantity) | Total expenses to produce goods |
| **Profit** | Revenue - Cost | Actual money earned |

In our Revenue Maximum MicroSim, the optimal price is $100, generating revenue of $10,000. But what if each unit costs $30 to produce? At Price = $100, we sell 100 units:

- Revenue = $10,000
- Cost = 100 × $30 = $3,000
- Profit = $7,000

But at Price = $120, we sell 80 units:

- Revenue = $9,600 (lower!)
- Cost = 80 × $30 = $2,400
- Profit = $7,200 (higher!)

**The profit-maximizing price is different from the revenue-maximizing price when costs are considered.**

### Proposed MicroSim: Profit Maximization

A natural extension of this MicroSim would add production costs to demonstrate true profit optimization. The key design principle: **keep the familiar two-panel structure** to reduce cognitive load and enable direct visual comparison.

#### Two-Panel Design (Recommended)

```
┌───────────────────────┬───────────────────────┐
│    DEMAND CURVE       │   REVENUE vs PROFIT   │
│                       │                       │
│   Price               │   $                   │
│     │╲                │         ∩ Revenue     │
│     │ ╲               │        ╱ ╲  (blue)    │
│     │  ╲  Profit      │       ╱   ╲           │
│     │   ╲ Rectangle   │   ∩  ╱     ╲          │
│     │    ╲ (green)    │  ╱ ╲╱ Profit (green)  │
│     └─────────────    │  └────────────────    │
│        Quantity       │        Price          │
└───────────────────────┴───────────────────────┘
              Controls
   [Price]  [Marginal Cost]  [Toggle Revenue Curve]
```

#### Why Two Panels Instead of Three?

From an instructional design perspective:

1. **Reduced cognitive load**: Students track two visualizations, not three
2. **Direct comparison**: Overlaying revenue and profit curves on the same axes makes the key insight immediately visible—the peaks occur at *different* prices
3. **Familiar structure**: Matches the Revenue Maximum MicroSim, so students spend less time orienting and more time learning
4. **Better responsiveness**: Works well on mobile devices and classroom projectors

!!! tip "Design Principle"
    The core learning objective is simple: *profit-maximizing price ≠ revenue-maximizing price*. The UI should be equally simple. Save cost curve analysis (MC, ATC, AVC) for a separate, more advanced MicroSim.

#### Panel Descriptions

**Left Panel: Demand Curve with Profit Rectangle**

- Same demand curve as Revenue Maximum MicroSim
- Shaded area now shows **PROFIT**, not revenue
- Profit rectangle = (Price - Marginal Cost) × Quantity
- **Green** when profit > 0, **Red** when operating at a loss
- Horizontal dashed line shows the marginal cost level

**Right Panel: Revenue and Profit Curves (Overlaid)**

- **Blue curve**: Revenue (same parabola as Revenue Maximum)
- **Green curve**: Profit (shifted down and right)
- **Blue vertical line**: Revenue-maximizing price (always at P = 100)
- **Green vertical line**: Profit-maximizing price (shifts based on marginal cost)
- Students can visually see the gap between the two optimal prices

#### Interactive Controls

| Control | Range | Purpose |
|---------|-------|---------|
| **Price Slider** | $0 - $200 | Set selling price |
| **Marginal Cost Slider** | $0 - $80 | Adjust per-unit production cost |
| **Show Revenue Curve** | Toggle | Compare profit curve to revenue curve |

#### Key Learning Moments

1. **The Gap**: When MC = $30, revenue peaks at P = 100, but profit peaks at P = 115
2. **Why the Shift**: Higher costs mean you need higher prices to maintain margins
3. **Break-even Points**: Two prices where profit = 0 (too low or too high)
4. **Loss Region**: Red shading when price is below marginal cost
5. **Special Case**: When MC = 0, both curves peak at the same price

#### Mathematical Foundation

**Profit Function:**

$$\pi(P) = P \cdot Q(P) - MC \cdot Q(P) = (P - MC) \cdot Q(P)$$

With our demand function $Q(P) = 200 - P$:

$$\pi(P) = (P - MC)(200 - P)$$

$$\pi(P) = 200P - P^2 - 200 \cdot MC + MC \cdot P$$

$$\pi(P) = -P^2 + (200 + MC)P - 200 \cdot MC$$

**Optimal Price (using calculus):**

$$\frac{d\pi}{dP} = -2P + 200 + MC = 0$$

$$P^* = \frac{200 + MC}{2} = 100 + \frac{MC}{2}$$

| Marginal Cost | Revenue-Max Price | Profit-Max Price | Difference |
|---------------|-------------------|------------------|------------|
| $0 | $100 | $100 | $0 |
| $20 | $100 | $110 | $10 |
| $40 | $100 | $120 | $20 |
| $60 | $100 | $130 | $30 |

**Key insight**: The profit-maximizing price is always $100 + \frac{MC}{2}$, which is higher than the revenue-maximizing price whenever production has a cost.

#### Classroom Applications

1. **What-if scenarios**: "What happens to optimal price if our supplier raises costs by $10?"
2. **Visual proof**: "Why doesn't the highest price give the most profit?"
3. **Break-even planning**: "At what prices do we just cover our costs?"
4. **Comparison exercise**: Toggle the revenue curve on/off to see the relationship

This Profit Maximization MicroSim would serve as the natural "Part 2" to the Revenue Maximum MicroSim, completing the economic picture of business decision-making while maintaining a simple, learnable interface.

## References

1. [Khan Academy - Revenue and Pricing](https://www.khanacademy.org/economics-finance-domain/microeconomics/firm-economic-profit/economic-profit-tutorial/v/economic-profit-vs-accounting-profit) - Video explanations of revenue concepts
2. [Principles of Economics - OpenStax](https://openstax.org/details/books/principles-economics-3e) - Free economics textbook
3. [Revenue Optimization in Practice](https://hbr.org/2016/08/a-quick-guide-to-value-based-pricing) - Harvard Business Review article on pricing strategy
4. [Desmos Graphing Calculator](https://www.desmos.com/calculator) - Tool for exploring quadratic revenue functions
