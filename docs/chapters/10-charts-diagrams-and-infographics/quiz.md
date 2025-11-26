# Chapter 10 Quiz: Charts, Diagrams, and Infographics

Test your understanding of specialized visualization libraries, chart types, and when to use each for educational content.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. When should you choose a specialized library like Chart.js over p5.js?

<div class="upper-alpha" markdown>
1. When you need pixel-level control over rendering
2. When creating standard chart types with minimal code
3. When building physics simulations
4. When combining multiple visualization types
</div>

??? question "Show Answer"
    The correct answer is **B**. Specialized libraries like Chart.js are ideal for standard chart types (bar, line, pie) because they handle rendering, animations, tooltips, and responsiveness automatically with minimal code. Use p5.js when you need unique visualizations or complete control.

    **Concept Tested:** General vs. Specialized

    **Bloom's Level:** Understand

---

#### 2. What is "declarative layout" in Mermaid.js?

<div class="upper-alpha" markdown>
1. Specifying exact pixel positions for each element
2. Describing what you want (relationships) rather than how to draw it
3. Using CSS to style diagrams
4. Creating layouts that declare their purpose
</div>

??? question "Show Answer"
    The correct answer is **B**. Declarative layout means describing *what* you want (e.g., "A connects to B") rather than *how* to draw it (e.g., "draw box at position 100, 50"). Mermaid automatically calculates positions based on the relationships you define.

    **Concept Tested:** Declarative Layout, Mermaid.js Diagrams

    **Bloom's Level:** Understand

---

#### 3. Which chart type is best for showing change over time?

<div class="upper-alpha" markdown>
1. Pie chart
2. Bar chart
3. Line chart
4. Radar chart
</div>

??? question "Show Answer"
    The correct answer is **C**. Line charts connect data points with lines, emphasizing trends and changes over continuous scales (usually time). They're ideal for showing patterns, rates of change, and comparing multiple series over the same time period.

    **Concept Tested:** Line Chart, Chart Types

    **Bloom's Level:** Remember

---

#### 4. When should you avoid using a pie chart?

<div class="upper-alpha" markdown>
1. When showing parts of a whole
2. When you have only 3-5 categories
3. When precise comparison between slices matters
4. When proportions are the main message
</div>

??? question "Show Answer"
    The correct answer is **C**. Humans struggle to compare slice angles accurately. If precise comparison between categories matters, use a bar chart instead. Pie charts work best for showing obvious majorities or rough proportions with few categories (2-7).

    **Concept Tested:** Pie Charts, Data Type to Chart Types

    **Bloom's Level:** Understand

---

#### 5. What three dimensions can a bubble chart display?

<div class="upper-alpha" markdown>
1. Color, size, and shape
2. X position, Y position, and bubble size
3. Time, value, and category
4. Width, height, and depth
</div>

??? question "Show Answer"
    The correct answer is **B**. Bubble charts extend scatter plots by using X position, Y position, and bubble size (radius) to show three numerical variables simultaneously. This makes them useful for priority matrices and multi-dimensional comparisons.

    **Concept Tested:** Bubble Chart

    **Bloom's Level:** Remember

---

#### 6. What Mermaid syntax creates a decision diamond in a flowchart?

<div class="upper-alpha" markdown>
1. `A[Decision Text]`
2. `A(Decision Text)`
3. `A{Decision Text}`
4. `A<Decision Text>`
</div>

??? question "Show Answer"
    The correct answer is **C**. In Mermaid flowchart syntax, curly braces `{Text}` create a diamond shape for decision nodes. Square brackets `[Text]` create rectangles, and parentheses `(Text)` create rounded rectangles.

    **Concept Tested:** Flowchart, Mermaid

    **Bloom's Level:** Remember

---

#### 7. What is the purpose of tooltips in data visualization?

<div class="upper-alpha" markdown>
1. To add decorative elements to charts
2. To provide details on demand without cluttering the visualization
3. To replace axis labels
4. To increase file size
</div>

??? question "Show Answer"
    The correct answer is **B**. Tooltips are small information boxes that appear on hover, showing exact values and additional context without adding visual clutter. They enable exploration of dense data while keeping the main visualization clean.

    **Concept Tested:** ToolTips

    **Bloom's Level:** Understand

---

#### 8. You have data showing market share percentages for 5 competitors. Which chart type is most appropriate?

<div class="upper-alpha" markdown>
1. Line chart
2. Scatter plot
3. Pie or doughnut chart
4. Bubble chart
</div>

??? question "Show Answer"
    The correct answer is **C**. Pie charts are ideal for showing parts of a whole when you have a small number of categories (5 is perfect). The percentages represent proportions of the total market, which is exactly what pie charts are designed to show.

    **Concept Tested:** Pie Charts, Data Type to Chart Types

    **Bloom's Level:** Apply

---

#### 9. What distinguishes infographics from charts or diagrams?

<div class="upper-alpha" markdown>
1. Infographics are always interactive
2. Infographics combine data, graphics, and text to tell a story
3. Infographics only use pie charts
4. Infographics are static images only
</div>

??? question "Show Answer"
    The correct answer is **B**. Unlike charts (which display data) or diagrams (which show relationships), infographics combine data visualization, graphics, and text to communicate complex information and tell a cohesive story with a focused message.

    **Concept Tested:** Infographics

    **Bloom's Level:** Understand

---

#### 10. Which library would you choose for creating an interactive network graph showing concept relationships?

<div class="upper-alpha" markdown>
1. Chart.js
2. Mermaid.js
3. vis.js
4. p5.js only
</div>

??? question "Show Answer"
    The correct answer is **C**. vis.js specializes in network visualizations and timelines, making it ideal for interactive network graphs. While Mermaid.js can create static diagrams and p5.js could build custom solutions, vis.js provides built-in features for force-directed layouts and graph interaction.

    **Concept Tested:** Other MicroSim Libraries

    **Bloom's Level:** Apply

---

#### 11. What is a bar chart best used for?

<div class="upper-alpha" markdown>
1. Showing trends over time
2. Displaying correlations between two variables
3. Comparing values across discrete categories
4. Showing three-dimensional relationships
</div>

??? question "Show Answer"
    The correct answer is **C**. Bar charts display categorical data with rectangular bars where height (or length) represents value. They're ideal for comparing values across discrete categories, showing rankings, and displaying non-continuous data.

    **Concept Tested:** Bar Chart, Chart Types

    **Bloom's Level:** Remember

---

#### 12. For a project priority matrix showing impact, effort, and budget, which chart type is most appropriate?

<div class="upper-alpha" markdown>
1. Pie chart
2. Stacked bar chart
3. Bubble chart
4. Line chart
</div>

??? question "Show Answer"
    The correct answer is **C**. A bubble chart can display three variables: X-axis for effort, Y-axis for impact, and bubble size for budget. This creates a priority matrix where project positioning and size convey all three dimensions simultaneously.

    **Concept Tested:** Bubble Chart, Data Type to Chart Types

    **Bloom's Level:** Analyze

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| General vs. Specialized | 1 |
| Declarative Layout | 2 |
| Mermaid.js Diagrams | 2 |
| Line Chart | 3 |
| Pie Charts | 4, 8 |
| Bubble Chart | 5, 12 |
| Flowchart | 6 |
| Mermaid | 6 |
| ToolTips | 7 |
| Data Type to Chart Types | 4, 8, 12 |
| Infographics | 9 |
| Other MicroSim Libraries | 10 |
| Bar Chart | 11 |
| Chart Types | 3, 11 |

**Bloom's Taxonomy Distribution:**

- Remember: 4 questions (33%)
- Understand: 5 questions (42%)
- Apply: 2 questions (17%)
- Analyze: 1 question (8%)
