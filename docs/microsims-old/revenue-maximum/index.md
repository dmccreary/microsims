---
title: Revenue Maximum
description: Drag the price along a demand curve and trace the revenue curve to find the price that brings in the most total revenue. A shaded rectangle shows that revenue is price times quantity.
quality_score: 100
image: /microsims-old/revenue-maximum/revenue-maximum.png
og:image: /microsims-old/revenue-maximum/revenue-maximum.png
twitter:image: /microsims-old/revenue-maximum/revenue-maximum.png
social:
   cards: false
status: implemented
---

# Revenue Maximum

<iframe src="main.html" width="100%" height="477px" scrolling="no"></iframe>

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/microsims/microsims-old/revenue-maximum/main.html" width="100%" height="477px" scrolling="no"></iframe>
```

[Run the Revenue Maximum MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

[Edit in the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/atfbM4MTM)

## About This MicroSim

This MicroSim asks one question: **what price brings in the most money?**

A seller faces a straight-line demand curve, `quantity = 200 − price`. At a price of $0 the
seller gives away 200 units and takes in nothing. At a price of $200 nobody buys, so the seller
again takes in nothing. The price with the most revenue is somewhere in between, and the
learner's job is to find it.

**Left panel: Demand Curve**

- Price is on the vertical axis and quantity sold is on the horizontal axis.
- The blue rectangle under the current point is as tall as the price and as wide as the
  quantity, so **its area is the revenue**.
- A high price gives a tall, narrow rectangle. A low price gives a short, wide one.

**Right panel: Revenue Curve**

- Revenue is on the vertical axis and price is on the horizontal axis.
- The curve is **not drawn when the MicroSim loads**. It appears as the price changes, so the
  learner builds the hill and finds its top.
- An orange ring marks the highest revenue found so far.
- The height of the blue point always equals the area of the rectangle in the left panel.

The line under the charts shows the calculation with the current numbers, such as
`Revenue = Price × Quantity = $50 × 150 = $7,500`. The line below it reports the highest
revenue found so far.

**Learning objective:** The learner will identify the price that gives the most total revenue
on a straight-line demand curve and explain why revenue falls at prices above and below it.

**Bloom's taxonomy level:** Analyze (verbs: *identify*, *explain*)

### How to Use

1. **Change the price.** Drag the blue point along the demand curve, drag across the revenue
   chart, or move the **Price** slider.
2. **Watch the rectangle.** Its area is the revenue. The same number is the height of the point
   on the revenue chart.
3. **Find the top of the hill.** Keep changing the price until the revenue stops going up.
4. **Press Sweep Price** to clear the traced curve and watch the price move from $0 to $200.
   Press the button again to pause, and again to resume. The sweep only runs while the mouse
   is over the MicroSim, so it will not distract a reader who has moved on to the text.
5. **Check Show Maximum** to reveal the whole curve, the peak, and the dashed orange outline of
   the largest rectangle that fits under the demand curve.
6. **Press Reset** to return the price to $50, clear the traced curve and uncheck the box.

### Keyboard Shortcuts

Click the MicroSim once so it has the keyboard focus.

| Key | Action |
|-----|--------|
| **→** and **←** | Raise or lower the price by $1 |
| **Shift** + **→** or **←** | Raise or lower the price by $10 |
| **S** | Start, pause or resume the sweep |
| **M** | Show or hide the maximum |
| **R** | Reset |

### What the Colors Mean

| What you see | What it means |
|--------------|---------------|
| Crimson line | The demand curve: the quantity sold at each price |
| Blue rectangle | Revenue as an area: price (height) × quantity (width) |
| Blue curve | The part of the revenue curve traced so far |
| Black labels on the axes | The current price and the current quantity |
| Blue label on the revenue axis | The current revenue |
| Orange ring | The highest revenue found so far |
| Dashed orange lines | With **Show Maximum** checked: the peak of the revenue curve and the largest rectangle |

### What to Try

- Set the price to $40 and then to $160. Both give a revenue of $6,400. Use the two rectangles
  to explain why.
- Start at $50 and raise the price $10 at a time. Write down how much revenue you gain on each
  step. The gains are $900, $700, $500, $300 and $100. What happens on the next step, and why?
- Find the price where the rectangle is a square. What is special about that price?

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

1. The MicroSim starts at a price of $50. Before you touch anything, predict: will revenue
   rise or fall if the price goes up?
2. Move the slider to Price = 0. What is the revenue? Why?
3. Move to Price = 200. What is the revenue now? Why?
4. Slowly move the slider from 0 to 200 and watch the revenue curve appear. At what price is
   revenue highest?
5. Record your observations in a table:

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
5. Check **Show Maximum** and compare your rectangle with the dashed orange outline
6. **Discussion**: Why does the rectangle get smaller at extreme prices?

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

??? note "Answer key"

    **Activity 1 table**

    | Price | Quantity | Revenue |
    |-------|----------|---------|
    | 0 | 200 | 0 |
    | 50 | 150 | 7,500 |
    | 100 | 100 | 10,000 |
    | 150 | 50 | 7,500 |
    | 200 | 0 | 0 |

    **Activity 4 (movie theater):** R = 1000P - 50P². Revenue is largest at P = $10, where
    500 people attend and the revenue is $5,000.

    **Summative assessment (concert venue):** Q = 5000 - 50P and R = 5000P - 50P². Revenue is
    largest at P = $50, where 2,500 seats are sold and the revenue is $125,000. The price is
    halfway between $0 (a full house that pays nothing) and $100 (an empty house).

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
| "The demand curve IS the revenue curve" | They're related but different. Revenue is the area of the rectangle under one point of the demand curve, not the area under the whole curve |
| "Maximum revenue = maximum profit" | Profit also considers costs, not just revenue |
| "This is how all real markets work" | This is a simplified model; real demand curves are rarely perfectly linear |

### Teacher Notes

- **Time required**: 45-60 minutes for full lesson
- **Technology needs**: Projector/smartboard for demonstration, student devices for exploration
- **Differentiation**: Pair struggling students with peers; provide extension problems for advanced students
- **Prior knowledge check**: Review multiplication and graph reading before starting
- **Predict first**: Leave **Show Maximum** unchecked until students have committed to a prediction. The revenue curve is hidden at the start for the same reason.

## Revenue Maximization vs. Profit Maximization

!!! mascot-warning "Revenue Is Not Profit"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is to treat the top of the revenue hill as the best price for a business. Revenue ignores what each unit costs to make, so the price with the most profit is usually higher. Find the peak here first, then subtract the costs.

This MicroSim teaches revenue concepts, but businesses ultimately care about profit, which is
what remains after costs are subtracted.

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

### The Profit Maximum MicroSim

The design below was first written on this page as a proposal. It has since been built as the
[Profit Maximum MicroSim](../profit-maximum/index.md), which keeps the two-panel structure of
this MicroSim and adds a marginal cost slider.

??? note "The original design proposal for the Profit Maximum MicroSim"

    A natural extension of this MicroSim would add production costs to demonstrate true profit optimization. The key design principle: **keep the familiar two-panel structure** to reduce cognitive load and enable direct visual comparison.

    **Two-Panel Design (Recommended)**

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

    **Why Two Panels Instead of Three?**

    From an instructional design perspective:

    1. **Reduced cognitive load**: Students track two visualizations, not three
    2. **Direct comparison**: Overlaying revenue and profit curves on the same axes makes the key insight immediately visible—the peaks occur at *different* prices
    3. **Familiar structure**: Matches the Revenue Maximum MicroSim, so students spend less time orienting and more time learning
    4. **Better responsiveness**: Works well on mobile devices and classroom projectors

    !!! tip "Design Principle"
        The core learning objective is simple: *profit-maximizing price ≠ revenue-maximizing price*. The UI should be equally simple. Save cost curve analysis (MC, ATC, AVC) for a separate, more advanced MicroSim.

    **Panel Descriptions**

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

    **Interactive Controls**

    | Control | Range | Purpose |
    |---------|-------|---------|
    | **Price Slider** | $0 - $200 | Set selling price |
    | **Marginal Cost Slider** | $0 - $80 | Adjust per-unit production cost |
    | **Show Revenue Curve** | Toggle | Compare profit curve to revenue curve |

    **Key Learning Moments**

    1. **The Gap**: When MC = $30, revenue peaks at P = 100, but profit peaks at P = 115
    2. **Why the Shift**: Higher costs mean you need higher prices to maintain margins
    3. **Break-even Points**: Two prices where profit = 0 (too low or too high)
    4. **Loss Region**: Red shading when price is below marginal cost
    5. **Special Case**: When MC = 0, both curves peak at the same price

    **Mathematical Foundation**

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

    **Classroom Applications**

    1. **What-if scenarios**: "What happens to optimal price if our supplier raises costs by $10?"
    2. **Visual proof**: "Why doesn't the highest price give the most profit?"
    3. **Break-even planning**: "At what prices do we just cover our costs?"
    4. **Comparison exercise**: Toggle the revenue curve on/off to see the relationship

    This Profit Maximization MicroSim would serve as the natural "Part 2" to the Revenue Maximum MicroSim, completing the economic picture of business decision-making while maintaining a simple, learnable interface.

## Version History

The first version of this MicroSim (December 2025) drew the whole revenue curve and an orange
line at the maximum as soon as it loaded, and the slider started at $100, which is the answer.
The current version starts at $50 and hides the curve so that the learner finds the peak. It
also adds axis scales, value labels on the axes, dragging on both charts, keyboard shortcuts,
the **Sweep Price** animation, the **Show Maximum** checkbox and a narrow-screen layout, and it
runs on p5.js 2.3.2. The original version is saved in this repository's git history.

## References

1. [Total revenue](https://en.wikipedia.org/wiki/Total_revenue) - accessed 2026-09-30 - Wikipedia - Defines total revenue as price times the quantity sold and relates changes in revenue to price elasticity.
2. [Demand curve](https://en.wikipedia.org/wiki/Demand_curve) - accessed 2026-09-30 - Wikipedia - Background on the curve in the left panel and on the law of demand behind its downward slope.
3. [Price elasticity of demand](https://en.wikipedia.org/wiki/Price_elasticity_of_demand) - accessed 2026-09-30 - Wikipedia - Explains why a price increase raises revenue where demand is inelastic and lowers it where demand is elastic.
4. [5.3 Elasticity and Pricing](https://openstax.org/books/principles-economics-3e/pages/5-3-elasticity-and-pricing) - 2022 - Principles of Economics 3e, OpenStax - A free textbook section that uses a band's ticket price to ask whether a higher price brings in more revenue.
5. [A Quick Guide to Value-Based Pricing](https://hbr.org/2016/08/a-quick-guide-to-value-based-pricing) - August 2016 - Harvard Business Review - How businesses set prices in practice, for the discussion of factors beyond the revenue-maximizing price.
6. [Economic profit vs accounting profit](https://www.khanacademy.org/economics-finance-domain/microeconomics/firm-economic-profit/economic-profit-tutorial/v/economic-profit-vs-accounting-profit) - Khan Academy - A video on revenue, costs and profit that supports the revenue versus profit section.
7. [Quadratic function](https://en.wikipedia.org/wiki/Quadratic_function) - accessed 2026-09-30 - Wikipedia - The mathematics of the parabola R = 200P - P² and its vertex.
8. [Desmos Graphing Calculator](https://www.desmos.com/calculator) - Desmos - A tool for graphing the revenue function of the movie theater and concert venue problems.
9. [p5.js Reference](https://p5js.org/reference/) - accessed 2026-09-30 - p5.js - Documentation for the JavaScript library used to build this MicroSim.
