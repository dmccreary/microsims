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

A natural extension of this MicroSim would add cost curves to demonstrate true profit optimization. Here's a detailed specification:

#### Three-Panel Design

```
┌─────────────────┬─────────────────┬─────────────────┐
│  DEMAND CURVE   │  COST CURVES    │  PROFIT CURVE   │
│                 │                 │                 │
│   Price         │   Cost          │   Profit        │
│     │╲          │      ╱ MC       │       ∩         │
│     │ ╲         │     ╱           │      ╱ ╲        │
│     │  ╲        │  ──────── ATC   │     ╱   ╲       │
│     │   ╲       │                 │    ╱     ╲      │
│     └────────   │   └──────────   │   └───────────  │
│       Quantity  │     Quantity    │      Price      │
└─────────────────┴─────────────────┴─────────────────┘
                    Controls
  [Price Slider]  [Marginal Cost Slider]  [Fixed Cost Slider]
```

#### Panel Descriptions

**Left Panel: Demand Curve with Profit Rectangle**

- Same as current MicroSim
- Shaded area now shows PROFIT (not revenue)
- Profit rectangle = (Price - Average Cost) × Quantity
- Color coding: Green for profit, Red for loss

**Center Panel: Cost Curves**

- **Marginal Cost (MC)**: Cost to produce one additional unit
- **Average Total Cost (ATC)**: Total cost divided by quantity
- **Average Variable Cost (AVC)**: Variable costs per unit
- Shows the relationship between production level and costs
- Highlights where MC intersects demand (profit-maximizing point)

**Right Panel: Profit Curve**

- Profit = Revenue - Total Cost
- Shows profit at each price point
- Maximum occurs where Marginal Revenue = Marginal Cost
- Displays break-even points (where profit = 0)

#### Interactive Controls

| Control | Range | Purpose |
|---------|-------|---------|
| **Price Slider** | $0 - $200 | Set selling price |
| **Marginal Cost Slider** | $0 - $100 | Adjust per-unit production cost |
| **Fixed Cost Slider** | $0 - $5000 | Set overhead costs (rent, equipment) |

#### Key Learning Moments

1. **Break-even Analysis**: Find the prices where profit = 0
2. **Profit vs Revenue**: See that maximum profit occurs at a DIFFERENT price than maximum revenue
3. **Cost Impact**: Watch how changing marginal cost shifts the optimal price
4. **Fixed Cost Effect**: Fixed costs shift the profit curve down but don't change the optimal price
5. **Loss Region**: Visualize when the business operates at a loss (red shading)

#### Mathematical Foundation

**Profit Function:**

$$\pi(P) = P \cdot Q(P) - C(Q)$$

Where:

- $\pi$ = Profit
- $P$ = Price
- $Q(P) = 200 - P$ (demand function)
- $C(Q) = FC + MC \cdot Q$ (cost function)

**Expanded:**

$$\pi(P) = P(200-P) - FC - MC(200-P)$$

$$\pi(P) = 200P - P^2 - FC - 200 \cdot MC + MC \cdot P$$

$$\pi(P) = -P^2 + (200 + MC)P - FC - 200 \cdot MC$$

**Optimal Price (using calculus):**

$$\frac{d\pi}{dP} = -2P + 200 + MC = 0$$

$$P^* = \frac{200 + MC}{2} = 100 + \frac{MC}{2}$$

Notice: When MC = 0, optimal price = 100 (same as revenue maximization). When MC > 0, optimal price is HIGHER than 100.

#### Visual Features

- **Color-coded regions**: Green = profit, Red = loss
- **Animated transitions**: Smooth updates as sliders move
- **Comparison mode**: Toggle to overlay revenue curve on profit curve
- **Tooltips**: Hover over any point to see exact values
- **Formula display**: Show current profit calculation in real-time

#### Classroom Applications

1. **What-if scenarios**: "What happens to profit if our supplier raises prices?"
2. **Competitive analysis**: "If a competitor lowers prices, should we match them?"
3. **Scale decisions**: "Should we produce more units at a lower margin?"
4. **Break-even planning**: "How many units must we sell to cover fixed costs?"

This Profit Maximization MicroSim would serve as the natural "Part 2" to the Revenue Maximum MicroSim, completing the economic picture of business decision-making.

## References

1. [Khan Academy - Revenue and Pricing](https://www.khanacademy.org/economics-finance-domain/microeconomics/firm-economic-profit/economic-profit-tutorial/v/economic-profit-vs-accounting-profit) - Video explanations of revenue concepts
2. [Principles of Economics - OpenStax](https://openstax.org/details/books/principles-economics-3e) - Free economics textbook
3. [Revenue Optimization in Practice](https://hbr.org/2016/08/a-quick-guide-to-value-based-pricing) - Harvard Business Review article on pricing strategy
4. [Desmos Graphing Calculator](https://www.desmos.com/calculator) - Tool for exploring quadratic revenue functions
