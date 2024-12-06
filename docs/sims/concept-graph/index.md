# Concept Graph Prompt

[Run The Concept Graph MicroSim](./concept-graph.html)

[Fixed Positions](./fixed-positions.html)

A concept graph or learning graph is a directed graph that lists
all of the concepts taught in a typical course or curriculum.

## Sample Prompt

```linenums="0"
I am teaching a course to high-school teachers on how
to use generative AI to create small educational
simulations for a specific course or group of
students.  This course is called
 "Teaching with GenAI and MicroSims".

Please create a numbered list of the top 150 Concepts
we need to teach in this course.  Have one Concept
Label per line and use a Concept Label that is short
so it can be viewed in a graph network.  Feel free
to use abbreviations within the Concept Label.

This list should be sorted from Fundamental
Concepts first to the most advanced Concept
last.

Make sure not to duplicate Concepts.

The course learning objectives include:

1. How to create detailed high-quality generative AI prompts.
2. How to generate web-based simulations using JavaScript libraries such as ChatGPT or vis.js.
3. How to get ChatGPT to use templates for high-quality and consistent user interfaces.
4. How to save and test simulations using tools such as the p5.js editor
5. How to deploy these simulations using standards such as markdown, mkdocs and GitHub pages.
6. How to get feedback from students on how effective these
simulations are in the classroom.
7. How to use Google Analytics to see what MicroSims are being
used and how often.
```

## ChatGPT o1-preview Response

1.  GenAI Basics
2.  MicroSim Concepts
3.  MicroSim Benefits
4.  AI Prompting Intro
5.  Effective Prompts
6.  Prompt Engineering
7.  High-Quality Prompts
8.  Avoid Ambiguous Prompts
9.  AI Limitations
10.  JS Fundamentals
11.  JS Variables
12.  JS Operators
13.  JS Control Structures
14.  JS Functions
15.  JS Objects & Arrays
16.  DOM Manipulation
17.  Event Listeners
18.  vis.js Intro
19.  Networks with vis.js
20.  vis.js Visuals
21.  Animation in vis.js
22.  p5.js Intro
23.  Drawing in p5.js
24.  p5.js Animation
25.  Interactivity p5.js
26.  p5.js Editor
27.  Save p5.js Projects
28.  Test Simulations
29.  Debugging Techniques
30.  ChatGPT for Code
31.  ChatGPT Code Gen
32.  Templates in ChatGPT
33.  Apply UI Templates
34.  Consistent UI
35.  Save AI Code
36.  Git Version Control
37.  Using GitHub
38.  GitHub Pages
39.  Deploy Simulations
40.  Markdown Intro
41.  Writing Markdown
42.  mkdocs Docs
43.  Setup mkdocs Site
44.  mkdocs on GitHub
45.  Collect Feedback
46.  Feedback Forms
47.  Analyze Feedback
48.  Improve Simulations
49.  Google Analytics
50.  Link Analytics
51.  Interpret Usage Data
52.  Engagement Metrics
53.  Data-Driven Decisions
54.  Privacy in Analytics
55.  Ethical Student Data
56.  Simulation Accessibility
57.  Inclusive Design
58.  Cross-Browser Tests
59.  Mobile Responsive
60.  Multi-Device Testing
61.  Performance Optimize
62.  Minimize Load Time
63.  Image Optimize
64.  Code Minify
65.  Graceful Errors
66.  Logging & Monitoring
67.  Security Practices
68.  Avoid Vulnerabilities
69.  Open Source Licenses
70.  Legal Library Use
71.  Attribution & Licensing
72.  Customize Open Source
73.  Advanced Prompts
74.  System Prompts
75.  AI Output Variability
76.  Rephrase Prompts
77.  Chain-of-Thought
78.  AI Debugging
79.  Fine-Tune Sims
80.  API Integration
81.  Fetch API Data
82.  JSON Handling
83.  Real-Time Data
84.  Advanced p5.js
85.  p5.js 3D Graphics
86.  Sound in p5.js
87.  Advanced vis.js
88.  vis.js Clustering
89.  vis.js Hierarchy
90.  D3.js Intro
91.  vis.js vs D3.js
92.  Library Selection
93.  JS Performance
94.  Memory Management
95.  JS Event Loop
96.  Async JS
97.  Promises & Async/Await
98.  Async Error Handling
99.  Modular JS
100.  ES6 Modules
101.  Babel Transpile
102.  Webpack Setup
103.  Code Bundling
104.  Source Maps
105.  NPM Packages
106.  Publish NPM Package
107.  Reusable Components
108.  Component Libraries
109.  CSS Styling
110.  CSS Preprocessor
111.  Bootstrap CSS
112.  Responsive Design
113.  CSS Media Queries
114.  Flexbox
115.  CSS Grid
116.  HTML Accessibility
117.  ARIA Roles
118.  Screen Reader Tests
119.  Write Documentation
120.  README Best Practices
121.  Code Comments
122.  Repo Maintenance
123.  GitHub Collaboration
124.  Pull Requests
125.  Issue Tracking
126.  Continuous Integration
127.  GitHub Actions CI
128.  Automated Testing
129.  Jest Unit Tests
130.  Integration Tests
131.  Cypress E2E Tests
132.  Deploy to Netlify
133.  Deploy to Vercel
134.  Env Variables
135.  Secure API Keys
136.  OAuth API Access
137.  GDPR Compliance
138.  Data Protection
139.  AI Ethics Edu
140.  Avoid AI Bias
141.  Promote Fairness
142.  Handle Sensitive Topics
143.  AI Transparency
144.  Teach AI to Students
145.  Student Data Privacy
146.  FERPA Compliance
147.  Online Safety
148.  Digital Footprint
149.  Future GenAI Edu
150.  Lifelong EdTech Learning

## Concept Dependency Prompt

```linenums
Our next step is to create a fully connected dependency graph.
In this step, for each concept on this list, create a new
list of other concepts on which it depends.  If a concept
depends on a specific concept that is not listed,
then we will need to add it as a new concept.
This will help us determine the teaching order of the concepts.

Return the new list as a CSV file using the following format. The first column is a numeric concept ID you assign,  the second column is the concept name, and the third column is a pipe-delimited list of the concept IDs that the concept depends upon.

Check your results to make sure that all concepts are connected to at least one other concept.