# Least Squares

<iframe src="main.html" height="565px" scrolling="no"></iframe>

[Run Least Squares MicroSim V1](./main.html){ .md-button .md-button--primary }

## Lesson Plan for High School Algebra

Linear Functions: Understanding Slope and Intercept

**Duration:** 50 minutes

**Grade Level:** 9-10

**Subject:** Algebra 1

### Learning Objectives

By the end of this lesson, students will be able to:

-   Define slope as a rate of change
-   Explain the meaning of y-intercept in a linear function
-   Identify how changes in slope and intercept affect the graph of a line
-   Use an interactive visualization to explore linear functions
-   Solve real-world problems involving slope and intercept

### Materials Needed

-   Interactive Slope-Intercept Visualization (p5.js application)
-   Student devices (computers, tablets, or smartphones)
-   Guided worksheet (printed or digital)
-   Whiteboard/projector

### Prerequisite Knowledge

-   Basic understanding of coordinate plane
-   Ability to plot points on a graph
-   Familiarity with the equation y = mx + b

### Lesson Outline

#### 1. Introduction (5 minutes)

-   Begin with a real-world scenario: "If you earn $15 per hour at your job, how would you calculate your total earnings?"
-   Discuss how the relationship between hours worked and money earned forms a linear relationship
-   Introduce the lesson focus: understanding how slope and intercept affect linear functions

#### 2. Review of Key Concepts (10 minutes)

-   Review the slope-intercept form of a line: y = mx + b
-   Define slope (m) as the rate of change (rise/run)
-   Define y-intercept (b) as the point where the line crosses the y-axis (0,b)
-   Demonstrate examples on the board with different values for m and b

#### 3. Interactive Exploration (15 minutes)

-   Introduce the Slope-Intercept Visualization tool
-   Demonstrate how to use the sliders to change slope and intercept values
-   Explain the visual elements:
    -   Green points represent actual data points
    -   Purple points show where the line would predict those values
    -   Colored squares show the "error" or difference between actual and predicted points
-   Guided exploration:
    1.  What happens when the slope increases? Decreases? Becomes negative?
    2.  What happens when the y-intercept changes?
    3.  Can you find values that minimize the differences between actual and predicted points?

#### 4. Pair Work (10 minutes)

-   Students work in pairs using the visualization tool
-   Challenge: Find the linear function that best fits the green data points
-   Each pair should record their "best fit" values for slope and intercept
-   Discuss strategy: How can you tell when you've found a good fit?

#### 5. Connection to Real-World Applications (5 minutes)

Discuss how the slope-intercept model applies to:

-   Economics: price vs. quantity relationships
-   Physics: distance vs. time in constant velocity
-   Business: fixed costs (y-intercept) and variable costs (slope)

Show how the colored squares relate to "error" in predictions

#### 6. Closure and Assessment (5 minutes)

-   Quick check for understanding:
    -   "If a line has a slope of 2 and a y-intercept of -3, what is its equation?"
    -   "If a line has a negative slope, what does that tell us about the relationship?"
-   Exit ticket: Students write one insight they gained from using the visualization

### Extension Activities

-   Challenge students to create their own set of points and find the best-fitting line
-   Introduce the concept of "least squares regression" as a mathematical way to find the best fit
-   Connect to data science concepts: predictions, error measurements, and model accuracy

### Differentiation

-   **Support:** Provide a step-by-step guide for using the visualization tool
-   **Extension:** Ask advanced students to modify the code to add new features or data points

### Assessment

-   Formative: Observation during interactive exploration and pair work
-   Summative: Exit ticket responses and follow-up homework assignment

### Homework

-   Complete practice problems involving writing equations in slope-intercept form
-   Find a real-world example where a linear relationship exists and identify what the slope and intercept represent in that context

### Follow-Up Lesson Ideas

-   Comparing linear vs. non-linear relationships
-   Introduction to systems of linear equations
-   Linear regression with larger datasets

## Lesson Plan focusing on Prediction of Future Events

### Learning Objectives
By the end of this lesson, students will be able to:
- Define slope as a rate of change
- Explain the meaning of y-intercept in a linear function
- Identify how changes in slope and intercept affect the graph of a line
- Use an interactive visualization to explore linear functions
- Use a linear model to make predictions for new x-values
- Evaluate the reliability of predictions using a linear model
- Solve real-world problems involving slope and intercept

### Materials Needed
- Interactive Slope-Intercept Visualization (p5.js application)
- Student devices (computers, tablets, or smartphones)
- Guided worksheet (printed or digital)
- Whiteboard/projector

### Prerequisite Knowledge
- Basic understanding of coordinate plane
- Ability to plot points on a graph
- Familiarity with the equation y = mx + b

### Lesson Outline

#### 1. Introduction (5 minutes)
- Begin with a real-world scenario: "If you earn $15 per hour at your job, how would you calculate your total earnings?"
- Discuss how the relationship between hours worked and money earned forms a linear relationship
- Introduce the lesson focus: understanding how slope and intercept affect linear functions

#### 2. Review of Key Concepts (10 minutes)
- Review the slope-intercept form of a line: y = mx + b
- Define slope (m) as the rate of change (rise/run)
- Define y-intercept (b) as the point where the line crosses the y-axis (0,b)
- Demonstrate examples on the board with different values for m and b

#### 3. Interactive Exploration (15 minutes)
- Introduce the Slope-Intercept Visualization tool
- Demonstrate how to use the sliders to change slope and intercept values
- Explain the visual elements:
  - Green points represent actual data points
  - Purple points show where the line would predict those values
  - Colored squares show the "error" or difference between actual and predicted points
- Guided exploration:
  1. What happens when the slope increases? Decreases? Becomes negative?
  2. What happens when the y-intercept changes?
  3. Can you find values that minimize the differences between actual and predicted points?

#### 4. Pair Work (10 minutes)
- Students work in pairs using the visualization tool
- Challenge: Find the linear function that best fits the green data points
- Each pair should record their "best fit" values for slope and intercept
- Discuss strategy: How can you tell when you've found a good fit?

#### 5. Prediction and Real-World Applications (10 minutes)
- Discuss how the slope-intercept model applies to:
  - Economics: price vs. quantity relationships
  - Physics: distance vs. time in constant velocity
  - Business: fixed costs (y-intercept) and variable costs (slope)
- Show how the colored squares relate to "error" in predictions
- Prediction activity:
  - Given our current "best fit" line with slope m and intercept b, what would be the predicted y-value for:
    1. x = 250 (a value within our current data range)
    2. x = 600 (a value outside our current data range)
  - Discuss the concept of interpolation vs. extrapolation
  - Question: "How confident are we in these predictions and why?"
  - Question: "What factors might affect the accuracy of our predictions?"

#### 6. Closure and Assessment (5 minutes)
- Quick check for understanding: 
  - "If a line has a slope of 2 and a y-intercept of -3, what is its equation?"
  - "If a line has a negative slope, what does that tell us about the relationship?"
  - "Using the equation y = 0.5x + 25, predict the y-value when x = 120"
  - "How would you use our linear model to predict a new value not shown on the graph?"
- Exit ticket: Students write one insight they gained about using linear models for prediction

### Extension Activities
- Challenge students to create their own set of points and find the best-fitting line
- Introduce the concept of "least squares regression" as a mathematical way to find the best fit
- Connect to data science concepts: predictions, error measurements, and model accuracy

### Differentiation

- **Support:** Provide a step-by-step guide for using the visualization tool
- **Extension:** Ask advanced students to modify the code to add new features or data points

### Assessment
- Formative: Observation during interactive exploration and pair work
- Summative: Exit ticket responses and follow-up homework assignment

### Homework

- Complete practice problems involving writing equations in slope-intercept form
- Find a real-world example where a linear relationship exists and identify what the slope and intercept represent in that context
- Prediction challenge: Given the linear model y = 1.5x + 10:
  1. Predict values for x = 50, x = 100, and x = 150
  2. If you measured y = 85, what would be the corresponding x value?
  3. Create a real-world scenario where this model might be useful, and explain what the slope and intercept represent
  4. Explain a situation where this model might break down or become unreliable for predictions

### Follow-Up Lesson Ideas
- Comparing linear vs. non-linear relationships
- Introduction to systems of linear equations
- Linear regression with larger datasets