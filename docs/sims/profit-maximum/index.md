---
title: Profit Maximum
description: An interactive MicroSim demonstrating why profit-maximizing price differs from revenue-maximizing price when production costs are considered.
image: profit-maximum.png
quality_score: 92
social:
    cards: false
---

# Profit Maximum

<iframe src="main.html" width="100%" height="492px" scrolling="no"></iframe>

```html
<iframe src="https://dmccreary.github.io/microsims/sims/profit-maximum/main.html" width="100%" height="492px" scrolling="no"></iframe>
```

[Run Profit Maximum Fullscreen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim is the natural "Part 2" following the [Revenue Maximum](../revenue-maximum/index.md) simulation. While revenue maximization finds the price that generates the most total income, **profit maximization** finds the price that generates the most money *after costs are subtracted*.

!!! warning "Key Insight"
    The profit-maximizing price is **higher** than the revenue-maximizing price whenever production has costs. This is because selling fewer units at a higher margin can be more profitable than selling many units at a low margin.

### Two-Panel Design

**Left Panel: Demand Curve with Profit Rectangle**

- The diagonal line shows the demand curve (higher prices → fewer sales)
- The **green rectangle** shows profit when Price > Marginal Cost
- The **red rectangle** shows loss when Price < Marginal Cost
- The orange dashed line shows the Marginal Cost level

**Right Panel: Revenue vs Profit Curves**

- **Blue curve**: Total Revenue (same parabola as Revenue Maximum)
- **Green curve**: Total Profit (revenue minus costs)
- **Blue vertical line**: Revenue-maximizing price (always $100)
- **Green vertical line**: Profit-maximizing price (shifts with marginal cost)

### How to Use

1. Adjust the **Price slider** to explore different selling prices
2. Adjust the **Marginal Cost slider** to see how production costs affect optimal pricing
3. Toggle **Show Revenue Curve** to compare revenue and profit directly
4. Watch how the green profit-max line moves right as marginal cost increases

### The Key Formula

$$P^* = 100 + \frac{MC}{2}$$

Where $P^*$ is the profit-maximizing price and $MC$ is the marginal cost per unit.

| Marginal Cost | Revenue-Max Price | Profit-Max Price | Difference |
|---------------|-------------------|------------------|------------|
| $0 | $100 | $100 | $0 |
| $20 | $100 | $110 | $10 |
| $40 | $100 | $120 | $20 |
| $60 | $100 | $130 | $30 |

## Lesson Plan

### Learning Objectives

By the end of this lesson, students will be able to:

1. **Distinguish** between revenue and profit as business metrics
2. **Calculate** profit using the formula: Profit = Revenue - Total Cost
3. **Explain** why profit-maximizing price differs from revenue-maximizing price
4. **Predict** how changes in marginal cost affect optimal pricing
5. **Identify** break-even points where profit equals zero
6. **Apply** profit maximization concepts to real-world business decisions

### Target Audience

- High school economics students (grades 10-12)
- AP Microeconomics students
- Business and entrepreneurship classes
- Students who have completed the Revenue Maximum lesson

### Prerequisites

- Understanding of the Revenue Maximum MicroSim
- Basic algebra (solving equations, working with variables)
- Concept of costs in business (what it costs to make something)

### Key Vocabulary

| Term | Definition |
|------|------------|
| **Revenue** | Total income from sales (Price × Quantity) |
| **Marginal Cost (MC)** | Cost to produce one additional unit |
| **Total Cost** | Marginal Cost × Quantity produced |
| **Profit** | Revenue minus Total Cost |
| **Break-even Point** | Price where Profit = 0 |
| **Profit Margin** | Price minus Marginal Cost (profit per unit) |

### Lesson Activities

#### Activity 1: Connecting to Revenue Maximum

**Setup**: Start with MC = $0

1. Set the Marginal Cost slider to $0
2. Find the price that maximizes profit
3. Compare to the revenue-maximizing price ($100)
4. **Discussion**: When costs are zero, why are they the same?

#### Activity 2: Discovering the Shift

**Exploration**: Increase marginal cost gradually

1. Slowly increase Marginal Cost from $0 to $60
2. Watch the green "Profit Max" line move
3. Record the profit-maximizing price at MC = $0, $20, $40, $60
4. **Pattern**: What's the relationship between MC and optimal price?

#### Activity 3: Understanding the Profit Rectangle

**Focus on the left panel**:

1. Set Price = $100 and MC = $40
2. Observe the green profit rectangle
3. Calculate: Height = Price - MC = $60, Width = Quantity = 100
4. Area = $60 × 100 = $6,000 (profit)
5. Now set Price = $120 (the profit-max). What happens to the rectangle?

#### Activity 4: Finding Break-Even Points

**Investigation**:

1. Set MC = $30
2. Find the TWO prices where profit = $0 (hint: one is very low, one is very high)
3. What happens to profit between these prices? Outside them?
4. **Real-world connection**: Why do businesses care about break-even?

#### Activity 5: The Loss Zone

**Exploring negative profit**:

1. Set MC = $50
2. Set Price = $30 (below marginal cost)
3. Observe the red rectangle (loss)
4. **Discussion**: Why would a business ever price below cost? (Loss leaders, market share)

### Discussion Questions

1. **The Profit Paradox**: A company can increase profit by raising prices even though they sell fewer units. Explain why this works.

2. **Cost Sensitivity**: If your supplier announces a 20% increase in costs, should you raise prices by 20%? What does the formula suggest?

3. **Revenue vs Profit**: Why might a startup focus on revenue maximization instead of profit maximization? When might this strategy change?

4. **Real Examples**:
   - Why do movie theaters charge high prices for popcorn (low MC)?
   - Why do airlines have complex pricing systems?
   - Why do luxury brands price higher than cost-based calculations suggest?

5. **Break-Even Analysis**: A food truck has MC = $5 per item. Using our model, at what two prices would they break even? What price maximizes profit?

### Common Misconceptions

| Misconception | Clarification |
|---------------|---------------|
| "Just add a markup to cost" | Optimal markup depends on demand elasticity, not just costs |
| "Sell as many as possible" | Volume isn't always better—margin matters |
| "Highest price = highest profit" | Price too high means few buyers, low total profit |
| "Revenue and profit move together" | They peak at DIFFERENT prices when MC > 0 |

### Assessment Ideas

#### Quick Check

1. If MC = $40, what is the profit-maximizing price? (Answer: $120)
2. Why is profit-max price always higher than revenue-max price when MC > 0?

#### Application Problem

A coffee shop has these characteristics:

- At $0 per cup, they could give away 200 cups per day
- At $10 per cup, no one would buy
- Demand decreases linearly
- Each cup costs $2 to make (MC = $2)

Calculate:

1. The demand equation
2. The revenue-maximizing price
3. The profit-maximizing price
4. Maximum daily profit

#### Reflection Prompt

"Explain to a friend who missed class why a business shouldn't just set the price that brings in the most revenue."

### Extensions

#### For Advanced Students

1. **Non-linear costs**: What if marginal cost increases with quantity? (Hint: the profit curve is no longer symmetric)

2. **Two products**: If you sell two related products, how do you price them together?

3. **Competition**: How would the presence of competitors change optimal pricing?

#### Cross-Curricular Connections

- **Mathematics**: Quadratic optimization, derivatives, finding maxima
- **Business**: Pricing strategy, cost accounting, margin analysis
- **Psychology**: How do customers perceive price-quality relationships?

### Relationship to Revenue Maximum

This MicroSim builds directly on the [Revenue Maximum](../revenue-maximum/index.md) simulation:

| Aspect | Revenue Maximum | Profit Maximum |
|--------|-----------------|----------------|
| Objective | Maximize P × Q | Maximize P × Q - MC × Q |
| Optimal Price | Always $100 | $100 + MC/2 |
| Considers Costs | No | Yes |
| Real-world Use | Market share focus | Profitability focus |

Students should complete Revenue Maximum first to understand the baseline, then use Profit Maximum to see how costs change the optimal decision.

## References

1. [Khan Academy - Profit Maximization](https://www.khanacademy.org/economics-finance-domain/microeconomics/firm-economic-profit/profit-maximization-tutorial/v/how-to-maximize-profit-with-marginal-cost-and-revenue) - Video explanation of profit concepts
2. [Revenue Maximum MicroSim](../revenue-maximum/index.md) - Prerequisite simulation (Part 1)
3. [Principles of Economics - OpenStax](https://openstax.org/details/books/principles-economics-3e) - Chapter on firm behavior and profit
4. [Marginal Analysis - Investopedia](https://www.investopedia.com/terms/m/marginalanalysis.asp) - Business perspective on marginal thinking
