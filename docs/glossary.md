# Glossary of Terms

This glossary defines the key terms used in *MicroSims 2.0*, including every concept in the learning graph. Definitions follow ISO 11179 standards: precise, concise, distinct, and non-circular.

**Total Terms:** 670

#### 10 MB Budget

The storage allowance of ten megabytes that LRS-Lite designs for in the browser, guiding how much evidence is kept.

**Example:** Sizing summaries so a semester of use stays within ten megabytes.

#### 100-Point Rubric

A standardized evaluation framework that assigns numerical scores across multiple quality criteria to assess MicroSim completeness, functionality, and educational effectiveness.

**Example:** A MicroSim scores 85/100 with points for responsive design (20), accessibility (15), and documentation (20).

#### 3D Visualization

A rendering technique that displays objects with depth, perspective, and lighting to simulate three-dimensional space on a two-dimensional screen.

**Example:** A molecule viewer uses WebGL to show chemical bonds from any angle.

#### A/B Experiment

A controlled comparison in which learners are randomly assigned to one of two variants to measure which performs better on a chosen measure.

**Example:** Comparing two versions of a MicroSim for their effect on quiz results.

#### Accessibility Check

An evaluation of whether a MicroSim can be used by people with disabilities, covering items such as contrast, labels, and keyboard access.

**Example:** Confirming every control can be reached and operated with the keyboard.

#### Accessibility Standards

Published criteria, such as the Web Content Accessibility Guidelines, that specify how digital content can be made usable by people with disabilities.

**Example:** A contrast requirement for text against its background.

#### Accessible Design

A design approach that ensures digital products are usable by people with diverse abilities, including visual, auditory, motor, and cognitive differences.

**Example:** Adding keyboard navigation and screen reader support to a MicroSim.

#### Active Learning

An instructional approach in which learners take part through activities such as questioning, discussing, and problem-solving rather than only listening.

**Example:** Predicting a simulation's outcome before running it.

#### Activity IRI

An internationalized resource identifier that uniquely names an activity, such as a MicroSim or a part of it, in xAPI statements.

**Example:** An IRI built from the book's site URL and the MicroSim's path.

#### Actor

The part of an xAPI statement that identifies who performed the action, typically a learner identified by an account or pseudonymous identifier.

**Example:** An actor identified by a pseudonymous learner ID.

#### Adapt Existing MicroSim

The process of copying a MicroSim and changing its data, text, or settings to serve a new objective.

**Example:** Reusing a bar chart MicroSim with new categories and values.

#### Adaptive Difficulty

A feature that adjusts task difficulty according to a learner's performance or estimated mastery.

**Example:** Presenting harder sorting items after several correct placements.

#### Adaptive Learning

An educational method that uses algorithms to customize learning content and pace based on individual learner performance and needs.

**Example:** A system that presents easier problems after incorrect answers and harder ones after correct answers.

#### Admin Interface

A management view for administrators to configure tenants, access, retention, and system settings.

**Example:** A screen for setting a district's data retention period.

#### Agent Workflow

An ordered series of steps, including reading files, generating output, running tools, and checking results, that an AI agent follows to complete a task.

**Example:** Generate files, run validation, read the report, patch defects, and re-run.

#### Aggregate-Only Data Policy

A policy in which only combined data for groups, not individual-level records, is stored or reported.

**Example:** Recording class-level counts without learner identifiers.

#### AI Agent

A software system driven by a large language model that plans steps, calls tools such as file editors and browsers, and acts toward a goal with limited step-by-step direction.

**Example:** An agent that reads a specification, writes MicroSim files, runs a validation script, and fixes reported problems.

*See also:* Agent Workflow, Human in the Loop

#### AI Code Generation

The process of using artificial intelligence to automatically produce programming code from natural language descriptions or specifications.

**Example:** Asking Claude to write a p5.js sketch for a bouncing ball simulation.

#### AI Driven

A characteristic of systems that use artificial intelligence algorithms to generate, modify, or enhance functionality without explicit programming for each scenario.

**Example:** MicroSims created through conversational prompts to large language models.

#### AI Hallucinations

False or fabricated information generated by AI models that appears plausible but is factually incorrect or nonsensical.

**Example:** An AI generating code that references non-existent p5.js functions.

#### AI Limitations

Constraints and weaknesses inherent in artificial intelligence systems that affect their reliability, accuracy, or applicability.

**Example:** LLMs cannot visually verify that UI elements do not overlap on a canvas.

#### AI Prompting

The practice of crafting input text to guide AI systems toward producing desired outputs.

**Example:** Writing "Create a slider that controls animation speed from 1 to 60 frames per second."

#### AI Skill

A packaged set of instructions, reference files, and templates that directs an AI agent to perform a specific recurring task in a consistent way.

The MicroSim generator skill is an example: it encodes type selection, file structure, and quality rules so outputs are repeatable.

**Example:** A skill that, given a specification, produces the HTML, JavaScript, and documentation files for a Mermaid diagram.

*See also:* AI Agent, MicroSim Generator Skill

#### All-or-Nothing Batch

A batch-handling rule in which a group of statements is accepted in full or rejected in full, so partial storage does not occur.

**Example:** A batch of ten statements is rejected when one fails validation.

#### Analyze Level

The fourth level of Bloom's Taxonomy where learners examine relationships, differentiate components, and connect concepts to understand structure.

**Example:** Comparing two sorting algorithms to determine which is more efficient.

#### Animation Control

The mechanism that allows users to start, stop, pause, or adjust the playback of animated sequences in a simulation.

**Example:** A play/pause button that toggles the `isRunning` state variable.

#### Animation Loop

A continuously executing cycle that updates and redraws visual elements to create the appearance of motion.

**Example:** The p5.js `draw()` function that executes 60 times per second by default.

#### Answered Verb

One of the three xAPI verbs used by MicroSims, recording that a learner submitted an answer to an assessable question.

**Example:** A statement with the answered verb and a correctness result for a quiz item.

#### Answers Never Folded

A design rule in which assessment answers are always sent as individual statements and never merged into a summary.

**Example:** Each quiz answer remaining its own record even in compact mode.

#### Apply Level

The third level of Bloom's Taxonomy where learners use acquired knowledge to solve problems in new situations.

**Example:** Using physics equations to predict projectile trajectories in a simulation.

#### Assessment Evidence

Evidence from responses to questions with a correct answer, recorded with correctness and related attributes.

**Example:** A sorting quiz item answered incorrectly on the first attempt.

#### Async Setup

A setup function declared asynchronous so it can wait for resources such as images or data to load before drawing begins.

**Example:** An async setup that awaits loading of a data file before creating controls.

#### At-Risk Roster

A list of learners whose evidence suggests they may be falling behind, for instructor follow-up.

**Example:** Learners with low estimated mastery on several prerequisite concepts.

#### Attempt Order

The sequence in which a learner makes attempts on items, which influences mastery updates in knowledge tracing.

**Example:** A correct answer on the third attempt interpreted differently from one on the first.

#### Attribution License

A legal permission that allows reuse of creative works provided the original creator is credited appropriately.

**Example:** CC BY requires citing the original author when sharing or modifying MicroSims.

#### AUC

The area under the receiver operating characteristic curve, a measure from 0 to 1 of how well a model ranks positive cases above negative ones.

**Example:** An AUC of 0.5 indicates ranking no better than chance.

#### Author Dashboard

A view for MicroSim authors that presents how learners use their MicroSims, including engagement and diagnostic value.

**Example:** A chart of which controls learners use least.

#### Automated Layout Repair

The automatic correction of detected layout defects by an agent that patches code and re-checks the result.

**Example:** An agent increasing an iframe height after a clipping test fails.

#### background()

A p5.js function that sets the color of the entire canvas, typically called at the beginning of each draw cycle to clear previous frames.

**Example:** `background('aliceblue')` fills the canvas with a light blue color.

#### Balancing Loop

A feedback loop in which a change in a variable leads, around the loop, to an opposing change, pushing the system toward a goal.

**Example:** A thermostat turning heat off as room temperature rises toward the setpoint.

#### Bar Chart

A visualization that uses rectangular bars of varying lengths to represent and compare categorical data values.

**Example:** A Chart.js bar chart showing test scores by subject area.

#### Bar Charts

Plural form referring to multiple bar chart visualizations or various bar chart types including horizontal, stacked, and grouped variants.

#### Batch Generation

The production of many MicroSims in one organized run from a set of specifications rather than one at a time.

**Example:** Generating forty MicroSims for a textbook from extracted specifications.

#### Bayesian Knowledge Tracing

A probabilistic model that updates the estimated probability a learner has mastered a concept after each response, using four parameters: initial knowledge, learning, guess, and slip.

**Example:** Raising a mastery estimate from 0.40 to 0.62 after a correct answer.

*See also:* BKT Learning Rate, Mastery Threshold

#### Bias in Prediction

A systematic difference in prediction quality or results across learner groups that is not explained by true differences in knowledge.

**Example:** A model underestimating mastery for learners who use assistive technology.

#### BKT Guess Parameter

The BKT parameter giving the probability of a correct answer when the learner has not mastered the concept.

**Example:** A guess value of 0.25 for a four-option question.

#### BKT Initial Knowledge

The BKT parameter giving the probability that a learner already knows the concept before any practice.

**Example:** An initial knowledge value of 0.2 for a new topic.

#### BKT Learning Rate

The BKT parameter giving the probability that a learner who does not know a concept learns it after one practice opportunity.

**Example:** A learning rate of 0.15 per attempt.

#### BKT Slip Parameter

The BKT parameter giving the probability of an incorrect answer when the learner has mastered the concept.

**Example:** A slip value of 0.1.

#### Bloom Verb

An action verb associated with a level of Bloom's Taxonomy, such as define, explain, apply, analyze, evaluate, or create, used to state objectives.

**Example:** "Compare" signals the Analyze level; "list" signals Remember.

#### Bloom's Taxonomy

A hierarchical framework classifying educational learning objectives into six cognitive levels from basic recall to creative synthesis.

**Example:** A course aligns assessments to Remember, Understand, Apply, Analyze, Evaluate, and Create levels.

#### Brier Score

The mean squared difference between predicted probabilities and actual outcomes coded as zero or one, where lower values indicate better predictions.

**Example:** A model predicting 0.9 for an outcome that occurs contributes a squared error of 0.01.

#### Browser Database

A database built into the web browser that lets pages store structured data on the user's device.

**Example:** IndexedDB holding evidence summaries locally.

#### Browser-Side Dashboard

A dashboard that reads local or synced summaries and computes its displays in the browser without a server-side analytics system.

**Example:** A teacher page that loads summary files and draws a mastery table.

#### Bubble Chart

A scatter plot variant where a third data dimension is represented by the size of circular markers.

**Example:** A chart showing countries with GDP on x-axis, life expectancy on y-axis, and population as bubble size.

#### Builder MicroSim

A MicroSim in which the learner constructs an artifact, such as a diagram, expression, or configuration, from provided parts.

**Example:** A tool that assembles an activity IRI from its components.

#### Button Control

An interactive user interface element that triggers an action when clicked or pressed.

**Example:** A "Reset" button that returns simulation parameters to default values.

#### Button Handle

An instrumentation helper attached to a button that reports presses to the runtime.

**Example:** A handle recording each press of the Run button.

#### Calibration

The agreement between predicted probabilities and observed frequencies, so that events predicted at 70 percent occur about 70 percent of the time.

**Example:** Learners given 0.8 mastery predictions passing a test about 80 percent of the time.

#### Callout Label

A text label connected to a location on an image by a line or marker, naming or describing that feature.

**Example:** A numbered label with a leader line pointing to a component of a device.

#### Canonical Site URL

The single authoritative base address of a site used to build stable activity IRIs, regardless of where a copy is served.

**Example:** Building every activity IRI from the published textbook address.

#### Canvas Creation

The step in a p5.js sketch that creates the drawing surface with a specified width and height and attaches it to the page.

**Example:** Calling createCanvas in setup and parenting the canvas to the main element.

#### Canvas Element

The HTML5 drawing surface where p5.js renders graphics, animations, and interactive content.

**Example:** A 400×450 pixel canvas divided into drawing and control regions.

#### Canvas Height

The vertical dimension of the drawing area measured in pixels, typically calculated as drawHeight plus controlHeight.

**Example:** `let canvasHeight = drawHeight + controlHeight;` results in 450 pixels.

#### Canvas Height Constant

A named value in a MicroSim script that fixes the total height of the drawing and control areas so the page and iframe can be sized to match.

**Example:** A constant set to 450 pixels, mirrored in the iframe height attribute.

*See also:* CANVAS_HEIGHT Comment

#### Canvas Width

The horizontal dimension of the drawing area measured in pixels, often dynamically adjusted for responsive design.

**Example:** `let canvasWidth = 400;` sets an initial width that may change with window resizing.

#### CANVAS_HEIGHT Comment

A comment in a MicroSim script that declares the canvas height in a fixed format so tools can read it and set the iframe height.

**Example:** A line stating the canvas height value that a sync tool parses.

*See also:* Height Sync Tool

#### Capacity Model

An estimate of the processing and storage resources a system needs for a given load, such as statements per second.

**Example:** Computing storage needs from learners, sessions, and statement size.

#### Capstone Portfolio

The final collection of instrumented MicroSims, documentation, and evaluation that a learner assembles to demonstrate course competencies.

**Example:** Five MicroSims of different types with metadata, instrumentation, and a fidelity report.

#### Capstone Project

A culminating educational project that integrates skills learned throughout a course into a comprehensive final work.

**Example:** Creating an original MicroSim with full documentation and metadata for a teaching portfolio.

#### Category Bucket

A labeled target area in a sorting activity into which learners place items.

**Example:** A bucket labeled "Balancing loop" that accepts dragged cards.

#### Causal Loop Diagram

A diagram of variables connected by arrows marked with polarity that shows feedback structure in a system.

**Example:** A diagram linking hiring, workload, and quality with arrows and loop labels.

*See also:* Polarity Link, Feedback Loop

#### Causal Loop Diagram Type

The MicroSim type that draws variables connected by polarity-labeled arrows and marks reinforcing and balancing loops.

**Example:** A diagram of how workload, stress, and performance influence one another.

#### Causal Loop Diagrams

Visual representations showing feedback relationships between variables where changes in one element influence others in circular patterns.

**Example:** A diagram showing how student engagement affects learning outcomes, which affects motivation, which affects engagement.

#### CC BY-NC-SA

Creative Commons Attribution-NonCommercial-ShareAlike license requiring attribution, prohibiting commercial use, and requiring derivative works use the same license.

**Example:** MicroSims shared under CC BY-NC-SA can be modified for education but not sold commercially.

#### CDN

A content delivery network, a distributed set of servers that host files such as JavaScript libraries and deliver them from a location near the requester.

**Example:** A MicroSim loading p5.js from a CDN URL rather than bundling the file.

#### Celebration Effect Type

The MicroSim type that adds a short visual reward, such as confetti, when a learner reaches a goal or completes a task.

**Example:** Confetti after all items in a sorting quiz are placed correctly.

*See also:* Reward Feedback

#### Chapter Diagram Coverage

A measure of how many of a chapter's planned diagrams or MicroSims have been produced and linked.

**Example:** A report showing eight of ten planned MicroSims present in a chapter.

#### Chart Color Palette

A chosen set of colors used to distinguish series or categories in a chart, selected for contrast and accessibility.

**Example:** A palette of six colors distinguishable for viewers with color vision deficiency.

#### Chart Configuration

The object that specifies a chart's type, data, and options, such as scales, colors, and plugins, in a charting library.

**Example:** A Chart.js configuration object defining a bar chart with labeled axes.

#### Chart Dataset

A named series of values plotted in a chart, together with its styling properties.

**Example:** One dataset of monthly temperatures drawn as a line.

#### Chart Tooltip

A small pop-up shown when the pointer is over a chart element, displaying its label and value.

**Example:** Hovering over a bar to see "Solar: 12 percent."

#### Chart Types

Categories of data visualizations distinguished by their structure and purpose, such as bar, line, pie, scatter, and bubble charts.

**Example:** Selecting a line chart for time-series data and a pie chart for proportional data.

#### Chart.js Library

A JavaScript library for creating responsive, animated charts and graphs using the HTML5 canvas element.

**Example:** Using Chart.js to create an interactive line graph of temperature over time.

#### Chart.js Type

The MicroSim type that uses the Chart.js library to render bar, line, pie, scatter, and bubble charts from a configuration object.

**Example:** An interactive bar chart of energy sources with hover tooltips.

#### ChartJS

An alternative name for Chart.js, the JavaScript charting library.

See also: Chart.js Library

#### ChatGPT

An AI language model developed by OpenAI capable of generating code, explanations, and conversational responses from text prompts.

**Example:** Using ChatGPT to generate initial p5.js code for a physics simulation.

#### Choropleth Map

A map in which regions are shaded by the value of a statistic, such as a rate or count, using color intensity.

**Example:** U.S. states shaded by broadband access percentage.

#### Circuit Simulation

A specialized MicroSim type that models electrical circuits, showing current flow, voltage, and component behavior.

**Example:** A simulation demonstrating Ohm's Law with adjustable resistance and voltage.

#### Claim Plan

A list of the specific factual claims a poster will make, prepared before searching for sources.

**Example:** A table of twelve statistics with intended wording and units.

#### Claim Verification

The step of comparing each claim against its cited source and recording whether the source confirms the stated value.

**Example:** Confirming that the stated percentage appears in the named report table.

#### Class Mastery Heatmap

A grid display with learners on one axis and concepts on the other, colored by estimated mastery.

**Example:** Red cells showing concepts many learners have not yet mastered.

#### Claude

An AI assistant developed by Anthropic designed for helpful, harmless, and honest interactions including code generation.

**Example:** Using Claude to debug and refine MicroSim code iteratively.

#### Claude Code

A command-line interface tool that enables Claude AI to assist with software development tasks directly in a terminal environment.

**Example:** Running `claude` to get AI assistance while developing MicroSims.

#### Clickable Table Detail Panel

An interface element in which selecting a table row opens a side or lower panel with extended information about that row.

**Example:** Clicking a library row to reveal its strengths and sample use.

#### ClickHouse

A column-oriented database designed for fast analytical queries over large volumes of event data.

**Example:** Storing all statements in ClickHouse for dashboard queries.

#### Clipped Content

Content that is cut off at the boundary of its container or iframe so part of it cannot be seen.

**Example:** The bottom controls hidden because the iframe height is too small.

#### Closed-Loop Generation

A generation process that feeds evaluation results, such as quality scores or evidence, back into the next generation to improve outputs.

**Example:** Regenerating a MicroSim after low diagnostic value is measured.

#### Code Debugging with AI

The process of using AI tools to identify, explain, and fix errors in programming code.

**Example:** Pasting error messages into Claude to get explanations and corrections.

#### Code Review of AI Output

A human examination of AI-generated code for correctness, clarity, security, and fit with project conventions before it is accepted.

**Example:** Checking that generated code uses the pinned library version and includes a description for accessibility.

#### Cognitive Levels

The hierarchical stages of mental processing complexity in learning, from simple recall to complex creation.

**Example:** Bloom's six levels: Remember, Understand, Apply, Analyze, Evaluate, Create.

#### Cognitive Load Theory

An educational framework describing how mental processing capacity limits affect learning, distinguishing intrinsic, extraneous, and germane load.

**Example:** Removing decorative borders from MicroSims to reduce extraneous cognitive load.

#### Collaboration Workflow

A structured process for multiple people to work together on shared projects using version control, review, and communication tools.

**Example:** Team members use GitHub branches, pull requests, and code reviews to develop MicroSims.

#### Collision Detection

The computation that determines when two simulated objects or an object and a boundary overlap or touch.

**Example:** Reversing a ball's velocity when it reaches a wall.

#### Color Contrast

The difference in luminance between foreground and background colors that affects readability and accessibility.

**Example:** Black text on white background has high contrast; gray on light gray has poor contrast.

#### Color Model

A system for specifying colors numerically, such as RGB or HSB, that determines how color values are interpreted when drawing.

**Example:** Using HSB to vary hue smoothly across a range of values.

#### Color Theory

Principles governing how colors interact, combine, and affect perception, used to create effective visual designs.

**Example:** Using complementary colors for emphasis and analogous colors for harmony in MicroSims.

#### Compact Mode

An LRS-Lite setting in which the producer sends summaries and minimal events rather than every interaction.

**Example:** Sending one session summary instead of hundreds of slider events.

#### Compact Versus Full Fidelity

A comparison of predictive quality between compact summaries and full event streams.

**Example:** Comparing AUC from session summaries with AUC from every event.

*See also:* Information Loss

#### Comparison Poster

A poster that places two or more subjects side by side in aligned zones so learners can contrast their features.

**Example:** A poster contrasting full LRS and LRS-Lite in parallel columns.

#### Comparison Table

A table that aligns several items against the same attributes so differences and similarities are visible at once.

**Example:** A table contrasting full LRS and LRS-Lite by cost, scale, and storage.

#### Comparison Table Type

The MicroSim type that presents items side by side across shared attributes in a table, often with ratings, sorting, or detail panels.

**Example:** A table comparing charting libraries by features and difficulty.

#### Compliance Reporting

The production of records that show a system meets legal and policy requirements for data handling.

**Example:** A report of data access and deletions for a district audit.

#### Concept

A distinct idea, skill, or piece of knowledge that a course teaches and that can be named, defined, and assessed.

**Example:** "Reinforcing loop" as a single concept in the learning graph.

#### Concept Classifier Type

The MicroSim type in which learners sort items into labeled categories as a quiz, with feedback on each placement.

**Example:** Dragging example statements into "reinforcing" or "balancing" buckets.

#### Concept Coverage Gap

A concept in the learning graph for which no or too little instrumented evidence is collected.

**Example:** A concept with no MicroSim interactions linked to it.

#### Concept Dependencies

Relationships indicating which concepts must be understood before learning new ones in a knowledge domain.

**Example:** Understanding "Variables" before "Functions" in a programming learning graph.

#### Concept Dependency

A directed relationship indicating that one concept is a prerequisite for understanding another.

**Example:** "Mastery threshold" depends on "Concept mastery" in the learning graph.

#### Concept ID Extension

An xAPI extension field that carries the identifier of the concept a statement provides evidence about.

**Example:** An extension holding the concept identifier from the learning graph.

#### Concept Link Metadata

Metadata that ties a MicroSim to the concepts it teaches, usually by concept identifiers from a learning graph.

**Example:** A field listing two concept identifiers the MicroSim addresses.

#### Concept Map

A diagram of concepts as nodes linked by labeled relationships, showing how ideas connect.

**Example:** A map linking "evidence," "concept," and "mastery" with relationship labels.

#### Concept Mapping

The assignment of each instrumented interaction to one or more concepts so evidence can be attributed to what the learner is learning.

**Example:** Mapping a slider to the concept "amplitude."

#### Concept Mastery

The state in which a learner can reliably demonstrate the knowledge or skill defined by a concept.

**Example:** A learner consistently applying the concept of a balancing loop to new scenarios.

#### Confounding Factors

Variables other than the one of interest that influence outcomes and can distort conclusions about the relationship being studied.

**Example:** Prior knowledge affecting both interaction patterns and test scores.

#### Container Deployment

The packaging of software components into containers that run consistently across servers and environments.

**Example:** Running the gateway and processors as separate containers.

#### Container Width

The horizontal dimension of the HTML element that contains an embedded MicroSim, used for responsive sizing.

**Example:** `containerWidth = document.querySelector('main').offsetWidth;`

#### Container Width Detection

The code step that reads the width of the element holding a MicroSim so the canvas and controls can be sized to it.

**Example:** Reading offsetWidth of the main element at startup.

#### Content Insights

Analyses of how MicroSims and questions perform, such as difficulty, usage, and diagnostic value, to guide content improvement.

**Example:** A report showing a question answered correctly by nearly everyone regardless of mastery.

#### Context

The optional part of an xAPI statement that gives surrounding information, such as parent activities, registration, and extensions.

**Example:** Context linking a question to the chapter that contains it.

#### Context Window

The maximum amount of text an AI model can process in a single interaction, measured in tokens.

**Example:** Claude's context window allows processing thousands of lines of code simultaneously.

#### Continuous Parameter Evidence

Evidence drawn from a learner's adjustment of a continuous control, such as a slider, reflecting exploration of a parameter's effect.

**Example:** Sweeping a slider across its range and stopping at a value.

#### Control Flow

Programming constructs that determine the order in which code statements execute based on conditions and logic.

**Example:** If-else statements, switch cases, and conditional expressions.

#### Control Height

The vertical dimension of the interface area reserved for interactive elements like sliders and buttons.

**Example:** `let controlHeight = 50;` allocates 50 pixels for controls at the canvas bottom.

#### Control Region

The designated portion of a MicroSim interface where interactive controls are placed, separate from the visualization area.

**Example:** A white rectangular area below the simulation containing sliders and buttons.

#### Control Visibility Test

An automated test that verifies every control of a MicroSim appears within the visible iframe area at given sizes.

**Example:** A Playwright check that each slider lies inside the iframe viewport.

#### Control Wrapping

The behavior in which controls such as buttons and sliders move onto additional lines as available width decreases.

**Example:** Three buttons splitting across two rows on a narrow screen.

#### Convergent Sync

A synchronization approach in which devices that exchange data reach the same final state regardless of order or repetition.

**Example:** Two devices merging summaries and ending with identical results.

#### Coordinate System

A numerical framework for specifying positions on the canvas using x (horizontal) and y (vertical) values.

**Example:** In p5.js, (0,0) is the top-left corner with y increasing downward.

#### Coordinate Translation

The process of shifting the origin point of a coordinate system to simplify positioning of grouped elements.

**Example:** Using `translate(100, 200)` to draw a group of shapes relative to a new origin.

#### Coordinator Pattern

An organization in which one controlling agent assigns tasks to worker agents, tracks their results, and combines the outcomes.

**Example:** A coordinator dispatching specifications to workers and collecting status reports.

#### Copyright Icon

A clickable visual indicator displaying licensing information that links to the full copyright notice.

**Example:** A small CC icon in the corner linking to the Creative Commons license page.

#### Correlation With Assessment

A statistical measure of how strongly predicted mastery scores vary together with scores on an independent assessment.

**Example:** A correlation of 0.6 between predicted mastery and test scores.

#### Cost Model

An estimate of the expected expenses of running a system as a function of usage and architecture choices.

**Example:** Comparing monthly costs of a full LRS and a serverless design.

#### Course Description

A structured document that states a course's title, audience, prerequisites, topics, and outcomes, and serves as the source for generating a learning graph.

**Example:** The description listing topics such as xAPI instrumentation and knowledge tracing.

#### Create Level

The highest level of Bloom's Taxonomy where learners synthesize knowledge to produce original work.

**Example:** Designing a novel MicroSim to teach a concept not covered in existing materials.

#### createButton()

A p5.js function that generates an HTML button element that can trigger callbacks when clicked.

**Example:** `startButton = createButton('Start'); startButton.mousePressed(toggleAnimation);`

#### createCanvas()

A p5.js function that initializes the drawing surface with specified width and height dimensions.

**Example:** `createCanvas(400, 450);` creates a 400×450 pixel canvas.

#### createSlider()

A p5.js function that generates an HTML range input element for adjusting numerical values.

**Example:** `speedSlider = createSlider(1, 60, 30);` creates a slider from 1 to 60 with default 30.

#### Creative Commons

A nonprofit organization providing standardized licenses for sharing creative works with specified permissions and restrictions.

**Example:** Releasing MicroSims under CC BY-NC-SA for educational reuse.

#### Creative Commons License

A standardized public copyright license that states the permissions a creator grants for reuse, such as attribution, non-commercial use, or share-alike.

**Example:** A MicroSim marked CC BY-NC-SA 4.0 in its metadata.

#### Cross-Book Index

A combined index of MicroSims from multiple textbooks, allowing discovery and reuse across books.

**Example:** Searching one catalog to find a timeline MicroSim built for a different book.

#### Cross-Browser Check

A test that loads a MicroSim in several browser engines to confirm it renders and behaves consistently.

**Example:** Running the same test script in Chromium, Firefox, and WebKit.

#### CSS

Cascading Style Sheets, a language that specifies the visual presentation of HTML elements, including layout, color, typography, and responsive behavior.

**Example:** A style rule that wraps control buttons onto a second line on narrow screens.

#### CSS Basics

Fundamental knowledge of Cascading Style Sheets for controlling the visual presentation of web content.

**Example:** Setting `border: none;` in CSS to remove iframe borders.

#### Data Minimization

The principle of collecting and retaining only the data needed for a stated purpose.

**Example:** Omitting free-text responses that are not needed for mastery estimation.

#### Data Source Citation

A statement in a chart or page identifying where its data came from, with enough detail to locate the source.

**Example:** A caption naming a government statistics table and its release year.

#### Data Table

A grid of rows and columns that presents records and their attributes for reading, sorting, or filtering.

**Example:** A table listing MicroSims with type, status, and library.

#### Data Type to Chart Types

The practice of selecting appropriate visualization types based on the characteristics of the underlying data.

**Example:** Using line charts for continuous time-series data and bar charts for categorical comparisons.

#### data.json File

A JSON file containing configurable data that can be easily modified by AI tools or users without changing code.

**Example:** A file containing quiz questions that an AI can update without editing JavaScript.

#### Debugging AI Code

The process of finding and correcting faults in code produced by an AI, by reproducing the problem, reading errors, and adjusting code or prompts.

**Example:** Reading the browser console to find that a generated script called an undefined function.

#### Debugging Techniques

Methods for identifying, isolating, and fixing errors in code, including logging, breakpoints, and systematic testing.

**Example:** Adding `console.log()` statements to track variable values during execution.

#### Declarative Layout

A programming approach where the desired end state is specified rather than step-by-step instructions to achieve it.

**Example:** Mermaid diagrams where you declare node relationships and the library handles positioning.

#### Deep Knowledge Tracing

A knowledge tracing approach that uses a neural network, typically recurrent, to predict future performance from a learner's response history.

**Example:** A network predicting the next answer's correctness from past attempts.

#### describe() Function

A p5.js accessibility function that provides text descriptions of canvas content for screen readers.

**Example:** `describe('An animated bouncing ball demonstrating physics concepts', LABEL);`

#### Description Metadata

Dublin Core field containing a textual summary of a resource's content and purpose.

**Example:** `description: "Interactive simulation demonstrating projectile motion with adjustable angle and velocity"`

#### Design Pattern

A reusable, documented solution to a commonly occurring problem within a specific context that provides a
template for implementation while allowing adaptation to particular requirements.

**Example in MicroSims:** [Separation of Drawing and Control Regions Pattern](#separation-of-drawing-and-control-regions-pattern)

MicroSims use a standard two-region canvas layout:

```js
let drawHeight = 400;      // Upper region for visualization
let controlHeight = 50;    // Lower region for UI controls
let canvasHeight = drawHeight + controlHeight;
```

The upper region (colored 'aliceblue') displays the simulation. The lower region (colored 'white') contains
sliders and buttons. This pattern solves the problem of separating interactive controls from the
visualization area, ensuring controls don't obscure the simulation and users always know where to find them.

This pattern appears consistently across MicroSims in most MicroSim examples, enabling:

- Predictable user experience
- Reliable AI generation (the pattern is learnable)
- Easier maintenance and modification

#### Developer Tools

Browser-integrated utilities for inspecting, debugging, and profiling web applications.

**Example:** Using Chrome DevTools to examine console errors and network requests.

#### Device Sequence Number

A counter that increases with each event produced on a single device, giving a local ordering.

**Example:** The fortieth event from a tablet carrying number forty.

#### Diagnostic Interaction Design

The practice of designing interactions so that learner actions reveal understanding, increasing the diagnostic value of the evidence.

**Example:** Requiring a prediction before revealing a graph.

#### Diagnostic Value

The extent to which an interaction or item distinguishes learners who have mastered a concept from those who have not.

**Example:** A question that strong learners answer correctly and weak learners miss has high diagnostic value.

#### Diagram Readability

The degree to which a diagram's labels, spacing, contrast, and layout let a viewer interpret it quickly and accurately.

**Example:** Increasing label font size and reducing crossing edges in a network.

#### Diagram Specification

A written description of a diagram's elements, relationships, labels, and interactions, used as input for generation.

**Example:** A list of nodes and edges for a network diagram with hover text for each node.

#### Discrete Inspection Evidence

Evidence drawn from a learner's selection or inspection of individual items, such as clicking a node or table row.

**Example:** Opening detail panels for three items in a table.

#### Discrimination

A model's ability to separate learners who will succeed from those who will not, regardless of the probability values' calibration.

**Example:** Higher predictions for learners who pass than for those who fail.

*See also:* AUC

#### District Tenant

The tenant unit in the full LRS design, representing one school district and its isolated data and settings.

**Example:** Statements from one district stored apart from those of another.

#### Diversity of MicroSims

The range of different simulation types, subjects, and approaches in a collection or portfolio.

**Example:** A portfolio containing p5.js animations, Chart.js visualizations, and Leaflet maps.

#### Docker Python Lab Type

The MicroSim type that provides runnable Python code blocks executed in a Docker container so learners can edit and run code.

**Example:** A lab where learners change a loop and see printed output.

#### Draw Height

The vertical dimension of the visualization area where the main simulation graphics are rendered.

**Example:** `let drawHeight = 400;` allocates 400 pixels for the animation area.

#### Draw Region

The upper area of a MicroSim canvas or page where the simulation or visualization is rendered, separate from the control area below it.

**Example:** An aliceblue rectangle showing a pendulum, with sliders beneath it.

#### draw() Function

A p5.js function that executes continuously in a loop, typically 60 times per second, to update and render animations.

**Example:** Moving a ball position and redrawing it each frame to create animation.

#### Drawing Primitives

Basic geometric shapes provided by a graphics library for building complex visualizations.

**Example:** p5.js primitives include rect(), ellipse(), line(), triangle(), and arc().

#### Drawing Region

The area of a MicroSim canvas designated for displaying the simulation visualization, separate from controls.

**Example:** The top 400 pixels of a canvas showing an animated physics demonstration.

#### Drawing Specification

A written description of what a p5.js MicroSim draws, including shapes, colors, positions, and animation behavior.

**Example:** "Draw a blue circle at the canvas center whose radius follows a slider."

#### Dublin Core Metadata

An ISO standard set of vocabulary terms for describing digital resources including title, creator, subject, and description.

**Example:** Adding Dublin Core fields to index.md frontmatter for cataloging MicroSims.

#### Durations

Time spans or intervals represented in timeline visualizations, showing how long events or periods lasted.

**Example:** A timeline showing the duration of each historical era as colored bars.

#### Dynamic Scaling

The automatic adjustment of element sizes in response to changes in container dimensions or viewport size.

**Example:** Slider width that grows or shrinks as the browser window resizes.

#### Edit Mode Alignment

A poster mode in which the author drags or adjusts zone boundaries visually and exports coordinates so zones align with the image.

**Example:** Dragging a zone edge until it matches a column, then copying the percentages.

#### Educational Equity

The principle of designing learning resources to be accessible regardless of socioeconomic status or device capabilities.

**Example:** Ensuring MicroSims work on older devices and slow internet connections.

#### Educational Metadata

Descriptive fields about a MicroSim's teaching purpose, such as grade level, subject, topic, and learning objectives.

**Example:** A field giving the intended audience as undergraduate.

#### Educational Simulation

An interactive digital experience designed to help learners understand concepts through exploration and experimentation.

**Example:** A simulation where students adjust gravity to observe effects on projectile motion.

#### Element Grouping

The technique of organizing related visual components together so they can be transformed as a unit.

**Example:** Using push(), translate(), and pop() to move a label and its value together.

#### ellipse()

A p5.js function that draws an oval or circle at specified coordinates with given width and height.

**Example:** `ellipse(200, 200, 50, 50);` draws a 50-pixel diameter circle at (200, 200).

#### Embedding

The process of including one digital resource within another, typically using iframes for MicroSims in web pages.

**Example:** Placing a MicroSim inside an MkDocs page using an iframe element.

#### End-to-End POST Path

The complete route a statement takes, from a MicroSim sending an HTTP POST through the gateway to storage, verified as working.

**Example:** A test that posts a statement and confirms it appears in the store.

#### Engagement Versus Learning

The distinction between learners' interest and activity levels and the actual knowledge they gain, which do not always correspond.

**Example:** A game-like MicroSim drawing many clicks but producing little understanding.

#### Equation Graphing

The visual representation of mathematical functions by plotting calculated points on a coordinate plane.

**Example:** A MicroSim showing y = sin(x) with adjustable amplitude and frequency.

#### Equity Considerations

Factors that affect whether learners of different backgrounds and resources have fair access to and benefit from a learning resource.

**Example:** Making MicroSims usable on low-bandwidth connections and older devices.

#### ER Diagram Example

An entity-relationship diagram demonstrating database schema design with tables and their connections.

**Example:** A vis-network visualization showing relationships between Students, Courses, and Enrollments.

#### Ethical Use of Predictions

The responsible application of predicted learner outcomes, with attention to fairness, transparency, consequences, and human oversight.

**Example:** Using a prediction to offer support, not to label a learner.

#### Evaluate Level

The fifth level of Bloom's Taxonomy where learners make judgments based on criteria and standards.

**Example:** Critiquing a MicroSim against the 100-point quality rubric.

#### Evaluation Protocol

A documented procedure that specifies data, measures, comparisons, and analyses used to assess prediction quality.

**Example:** A protocol describing held-out test timing, metrics, and sample.

#### Event Handlers

Functions that execute in response to user actions like mouse clicks, key presses, or touch gestures.

**Example:** A `mousePressed()` function that toggles simulation state when the canvas is clicked.

#### Event Identity

The unique identifier that distinguishes one event from all others, allowing duplicates to be detected and merged.

**Example:** An identifier combining device, sequence number, and time.

#### Event Lists

Collections of discrete occurrences with timestamps used to populate timeline visualizations.

**Example:** A JSON array of historical events with dates and descriptions for a timeline MicroSim.

#### Event Stream

An ordered, continuously appended sequence of events that systems can read and process as they arrive.

**Example:** Validated statements published to a stream for downstream processors.

#### Evidence Class

One of the categories used in this book to group interaction types by the kind of evidence they offer about learner knowledge.

**Example:** Continuous parameter, discrete inspection, run and pause, page dwell, and assessment are among the classes.

#### Evidence List

The list of evidence items, such as answers and summarized interactions, attached to a summary vertex.

**Example:** A list of the last several answers for a concept.

#### Evidence Stream

The ordered flow of xAPI statements produced by a learner's interactions, used as input for mastery estimation.

**Example:** All statements from one learner across a unit.

#### Experienced Verb

One of the three xAPI verbs used by MicroSims, recording that a learner viewed or was exposed to content or a page.

**Example:** A statement that a learner experienced a MicroSim page for a measured dwell time.

#### Explore Mode

A poster mode in which the learner freely hovers or clicks zones to read summaries and facts.

**Example:** Hovering over each column to read its description.

*See also:* Edit Mode Alignment

#### Extraneous Load

Cognitive burden imposed by poorly designed instruction that does not contribute to learning.

**Example:** Decorative animations that distract from the educational content of a MicroSim.

#### Faceted Search

A search method that lets users narrow results by selecting values of several attributes, such as type, subject, and grade level.

**Example:** Filtering MicroSims by "Mermaid" and "undergraduate."

#### Fact-Verified Poster

A poster in which each numeric or factual claim was checked against a cited source and the check was recorded before publication.

**Example:** A statistics poster whose every figure has a verification entry.

#### Failure Modes

The distinct ways a system or component can fail, with their effects and the responses to them.

**Example:** A stream outage causing delayed dashboard updates.

#### Feedback Loop

A closed chain of cause and effect in which a variable eventually influences itself through intermediate variables.

**Example:** Learner success increasing motivation, which increases effort and further success.

#### Fidelity-Driven Instrumentation

An approach that chooses which interactions to instrument according to how much they improve predictive fidelity.

**Example:** Instrumenting a question handle before a decorative hover.

#### fill()

A p5.js function that sets the interior color for subsequently drawn shapes.

**Example:** `fill('blue');` makes all following shapes filled with blue color.

#### Fix Cycle Limit

A cap on the number of repair attempts an automated process makes on a defect before stopping and flagging it for a person.

**Example:** Three patch attempts per MicroSim, then the item is marked for manual review.

#### Fixed Layout

A MicroSim design with static dimensions that do not change regardless of container or viewport size.

**Example:** A 400×450 canvas that maintains exact size on all devices.

#### Flash Card MicroSim

An interactive simulation presenting information in question-answer pairs for memorization and recall practice.

**Example:** A MicroSim showing vocabulary terms that flip to reveal definitions when clicked.

#### Flowchart

A diagram using standardized symbols and arrows to represent steps and decisions in a process.

**Example:** A Mermaid flowchart showing the logic for validating user input.

#### Flowcharts

Plural form referring to multiple flowchart diagrams or various flowchart types.

#### Flowing Current Animation

An animation technique in which moving dots or arrows along a path show direction and rate of flow, as of electric current or fluid.

**Example:** Dots moving along wires in an H-Bridge when a switch is closed.

#### Focus Loss Handling

The treatment of periods when the MicroSim's tab or window is not active, such as pausing timers and excluding that time from dwell.

**Example:** Stopping the dwell timer when the learner switches tabs.

#### Forced Directed Layout

A graph visualization algorithm that simulates physical forces to position nodes, with connected nodes attracting and all nodes repelling.

**Example:** vis-network using physics simulation to automatically arrange a network diagram.

#### Formative Assessment

Ongoing evaluation during instruction that provides feedback to improve learning rather than assign grades.

**Example:** A MicroSim quiz that provides immediate feedback and hints after each answer.

#### Frame Rate

The frequency at which animation frames are rendered, measured in frames per second (fps).

**Example:** `frameRate(60);` sets the animation to update 60 times per second.

#### Full Mode

A setting in which every qualifying interaction is sent as its own xAPI statement.

**Example:** Each slider release sent as an interacted statement.

#### Full Versus Lite Decision

The choice between deploying the full LRS and LRS-Lite, based on scale, cost, analytics needs, and operational capacity.

**Example:** A single classroom choosing Lite, and a district with thousands of learners choosing Full.

#### Fullscreen Icon

A clickable control that expands the MicroSim to fill the entire browser window or screen.

**Example:** A small expand icon in the corner that triggers fullscreen mode when clicked.

#### Fullscreen Mode

A display state in which a MicroSim opens in its own full-window page so it has more room than when embedded.

**Example:** A link beneath an embedded MicroSim that opens main.html alone.

#### Fun and Engagement

The qualities of enjoyment and sustained attention that draw learners to a MicroSim and affect how long and how often they use it.

**Example:** A celebration effect that encourages learners to finish an activity.

#### Function Plot

A graph of a mathematical function showing output values over a range of inputs.

**Example:** A plot of y equals x squared from negative five to five.

#### Functions

Named, reusable blocks of code that perform specific tasks and can accept parameters and return values.

**Example:** A `drawBall(x, y, radius)` function that encapsulates ball-drawing logic.

#### General vs. Specialized

The distinction between versatile, multipurpose MicroSim types and those designed for specific subject domains.

**Example:** p5.js is general-purpose; a circuit simulator is specialized for electronics.

#### Generation Cost

The total resources, including model usage, time, and review effort, spent to produce a MicroSim or batch.

**Example:** Estimating cost per MicroSim from tokens used and minutes of review.

*See also:* Token Cost

#### Generation Failure Mode

A recurring way AI generation goes wrong, such as invented APIs, layout overflow, missing files, or ignored constraints.

**Example:** A MicroSim whose controls fall outside the visible canvas.

#### Generation Log

A record of the prompts, settings, outputs, and outcomes of AI generation runs.

**Example:** A file noting which specification produced which MicroSim and whether validation passed.

#### Generative AI

Artificial intelligence systems that create new content such as text, code, or images from patterns learned during training.

**Example:** Using Claude to generate JavaScript code for a physics simulation.

#### Geographic Data Source

A dataset of places, boundaries, or coordinates used to populate a map, together with its provenance and license.

**Example:** A GeoJSON file of country boundaries from a public repository.

#### Geographic Maps

Interactive visualizations displaying spatial data on representations of Earth's surface.

**Example:** A Leaflet.js map showing the locations of historical events.

#### Germane Load

Cognitive effort dedicated to constructing and automating mental schemas during learning.

**Example:** The mental work of connecting new concepts to existing knowledge while using a MicroSim.

#### Git

A distributed version control system that tracks changes to files and coordinates work among multiple contributors.

**Example:** Using `git commit` to save snapshots of MicroSim development progress.

#### Git Version Control

A distributed system that records changes to files as commits, enabling history inspection, branching, and collaboration.

**Example:** Committing a regenerated MicroSim so the earlier version remains recoverable.

#### GitHub

A web-based platform providing Git repository hosting, collaboration features, and deployment services.

**Example:** Hosting MicroSim code on GitHub and deploying to GitHub Pages.

#### GitHub Pages

A free static web hosting service that publishes files from a Git repository branch as a public website.

**Example:** A deployed textbook served at a repository-specific address, with each MicroSim reachable by URL.

#### Global Variables

Variables declared outside all functions, accessible from anywhere in the program throughout its execution.

**Example:** `let canvasWidth = 400;` declared at the top of a p5.js sketch.

#### Graph Layout Algorithms

Mathematical methods for automatically positioning nodes and edges in network visualizations.

**Example:** Force-directed, hierarchical, and circular layout algorithms in vis-network.

#### Graph Node Coloring

The assignment of colors to network graph nodes to indicate categories, values, or relationships.

**Example:** Coloring nodes by taxonomy category in a learning graph visualization.

#### Graph Viewer

An interactive tool that renders a graph dataset and lets users explore nodes, edges, and groups.

**Example:** A viewer that displays a course's learning graph and highlights a selected concept's dependencies.

#### Grid Overlay

A set of rectangular zones arranged in rows and columns over an image, each reacting to interaction.

**Example:** A three-by-two grid over an infographic with a fact panel for each cell.

#### Grid Overlay Poster Type

The MicroSim type that divides an image into grid cells or zones, each with its own summary and facts, to build an explorable poster.

**Example:** A poster split into four columns, each describing one era.

#### Guarded Call

A call to an instrumentation function wrapped so that a failure or missing runtime cannot break the MicroSim.

**Example:** Checking that the runtime exists before calling it, inside an error handler.

#### Guess-Resistant Probes

Assessment items or interactions designed so that correct responses are unlikely to occur by chance.

**Example:** A question requiring a numeric entry rather than a choice among options.

#### Guessing

A correct response produced without mastery, such as by chance or elimination.

**Example:** Selecting the right option in a four-choice question by chance.

*See also:* BKT Guess Parameter

#### Guided Exploration

An instructional approach providing structured support while allowing learners to discover concepts through interaction.

**Example:** A MicroSim with prompts suggesting which parameters to adjust first.

#### Hallucinated API

A function, option, or library feature that an AI model invents in generated code because it does not exist in the library.

**Example:** A call to a chart method that the Chart.js library does not define.

#### Headless Browser

A web browser run without a visible window so scripts can load and test pages automatically.

**Example:** Loading every MicroSim in a headless browser to take screenshots in a batch.

#### Heavyweight Libraries

JavaScript frameworks with large file sizes and extensive functionality that may slow page loading.

**Example:** ReactFlow compared to simpler libraries like vis-network for graph visualization.

#### Height Resolution Order

The ordered list of sources a tool consults to determine a MicroSim's iframe height, used until one provides a value.

**Example:** Checking a declared comment first, then the script constants, then a measured value.

#### Height Sync Tool

A utility that reads each MicroSim's declared height and updates the matching iframe height in documentation pages.

**Example:** A script that corrects all iframe heights in a chapter after canvas sizes change.

#### Held-Out Assessment

An assessment not used to build or tune a prediction model, reserved for evaluating how well its predictions match real performance.

**Example:** A post-unit test used only to check predicted mastery.

#### Hidden Control

An interface control that exists in the code but is not visible or reachable by the user because of layout or sizing.

**Example:** A reset button rendered below the visible iframe area.

#### History of GraphViz

The development background of the GraphViz graph visualization software that influenced modern diagram tools.

**Example:** Understanding how AT&T's GraphViz inspired DOT notation used in modern tools.

#### Hover Threshold

The minimum hover duration required for a pointer hover to count as evidence of attention.

**Example:** A hover over a zone counts only after the pointer rests there long enough.

#### Hover Zone

A defined region of an image or canvas that responds when the pointer enters it, typically by showing text or highlighting.

**Example:** A rectangle over a poster column that reveals its summary on hover.

#### HTML Fundamentals

Basic knowledge of HyperText Markup Language for structuring web page content and elements.

**Example:** Understanding `<div>`, `<iframe>`, and `<script>` tags for MicroSim embedding.

#### HTML Slide Embedding

The technique of incorporating MicroSims into presentation slides using HTML and iframes.

**Example:** Adding a live simulation to a reveal.js slide deck for classroom demonstrations.

#### HTML5

The current major version of the HyperText Markup Language standard for structuring web content, including elements such as canvas, audio, and video and APIs for local storage.

**Example:** A main.html page using a canvas element to host a simulation.

#### Human in the Loop

A process design in which a person reviews, approves, or corrects an automated system's output at defined points.

**Example:** An instructor inspects each generated MicroSim before it is linked in a chapter.

#### Hybrid Logical Clock

A timestamp scheme that combines physical time with a logical counter to order events across devices despite clock differences.

**Example:** Ordering events from two laptops whose clocks disagree slightly.

#### Idempotent Ingest

An ingestion behavior in which receiving the same statement more than once produces the same stored result as receiving it once.

**Example:** A retried upload of the same statement identifier creating no duplicate.

#### Iframe Auto-Height Protocol

A convention in which an embedded page reports its content height to its parent so the iframe can resize itself.

**Example:** A MicroSim sending its height to the parent page after rendering.

*See also:* postMessage Resize

#### iframe Embedding

The technique of placing one web page inside another using the HTML iframe element, isolating the embedded page's code and styles from the host page.

**Example:** A chapter page embedding a MicroSim's main.html with an iframe tag.

*See also:* Iframe Height, Relative Iframe Path

#### Iframe Height

The vertical size assigned to an iframe element, which has to match the embedded content's total height to avoid clipping or blank space.

**Example:** An iframe height of 452 pixels for a 450 pixel canvas plus border.

#### Iframe Height Test

An automated test that compares an iframe's set height with the content's actual height to detect clipping or extra space.

**Example:** Flagging an iframe 60 pixels shorter than its content.

#### Iframe Insertion

The step of placing an iframe that embeds a MicroSim into the chapter page where it is discussed.

**Example:** Inserting an iframe tag beneath a diagram placeholder.

#### iframe Integration

The process of embedding external content within a web page using the HTML iframe element.

**Example:** `<iframe src="main.html" width="400" height="450"></iframe>`

#### iframe Styling

CSS techniques for controlling the visual appearance and behavior of embedded iframe content.

**Example:** Removing borders with `style="border: none;"` for seamless integration.

#### Image Model Generation

The creation of images from text prompts using a generative image model.

**Example:** Generating a poster background illustration from a descriptive prompt.

#### Image Overlay

An interactive layer of labels, zones, or markers placed above an image so portions of the image respond to pointer input.

**Example:** Hover zones on an anatomy illustration that reveal part names.

#### Image Overlay Type

The MicroSim type that places interactive labels, hover zones, or markers on top of an image so learners can explore its parts.

**Example:** A labeled diagram of a cell with hover text on each organelle.

#### index.md Documentation Page

The Markdown page in a MicroSim directory that describes the MicroSim, embeds it, and lists learning objectives, usage notes, and lesson ideas for readers.

**Example:** A page with the embedded iframe, a link to fullscreen mode, and a lesson plan.

#### index.md File

The main documentation file for a MicroSim containing metadata, description, and embedded simulation.

**Example:** A markdown file with YAML frontmatter, iframe embed, and usage instructions.

#### IndexedDB Storage

A browser API for storing large amounts of structured data on the client, organized in object stores and accessed asynchronously.

**Example:** LRS-Lite saving summary vertices in IndexedDB.

#### Infographic

A visual presentation that combines images, text, and data to communicate information compactly.

**Example:** A poster summarizing key statistics with icons and short labels.

#### Infographics

Visual representations combining images, charts, and text to communicate information clearly and engagingly.

**Example:** A static or interactive graphic explaining the p5.js execution flow.

#### Information Loss

The evidence detail that is discarded when events are summarized or filtered, potentially reducing predictive power.

**Example:** The order of slider changes lost when only counts are kept.

#### Ingestion Gateway

The entry point of the LRS that receives incoming statements, authenticates senders, validates them, and forwards accepted ones.

**Example:** An endpoint that rejects a batch containing a malformed statement.

#### Input Handling

The processing of user actions such as mouse movements, clicks, keyboard presses, and touch events.

**Example:** Detecting slider changes to update simulation parameters in real-time.

#### Instructional Design Checkpoint

A review step in MicroSim design that asks pedagogical questions, such as whether the learner predicts before seeing the answer and what animation adds, before generation.

**Example:** Rejecting an animation that only decorates a chart without aiding understanding.

*See also:* Predict-First Design, Purpose of Animation

#### Instrumented MicroSim

A MicroSim that includes code which records learner interactions as xAPI statements and sends them to a learning record store or local store.

**Example:** A quiz MicroSim that logs each answer attempt with its concept identifier and correctness.

*See also:* xAPI Statement, Learning Record Store

#### Instrumented Status

A recorded state indicating whether a MicroSim has been instrumented and verified to emit statements.

**Example:** A status field set to instrumented after the quality check passes.

#### Intelligent Textbook

An online interactive textbook that responds to the needs of the student and predicts learning paths to help student reach their goals.

Intelligent Textbooks are classified in a five-level system that begins with a simple printed textbooks (Level 1) to advanced AI-backed textbooks (Level 5) that generate new content based on the needs of their students.

- See also: [Learning Graph](#learning-graph)

#### Interacted Verb

One of the three xAPI verbs used by MicroSims, recording that a learner acted on an interface element such as a slider or button.

**Example:** A statement that a learner interacted with a speed slider.

#### Interaction Design

The practice of designing digital products with logical, intuitive, and meaningful user interactions.

**Example:** Placing controls consistently at the bottom of all MicroSims for predictable behavior.

#### Interaction Diagnosticity

The degree to which a type of interaction differentiates learners by understanding.

**Example:** Sorting items correctly under time pressure being more diagnostic than merely viewing.

#### Interaction Pattern

A recurring way a learner acts on a MicroSim, such as adjusting a parameter, selecting an item, sorting, or answering, matched to a learning objective.

**Example:** Slider adjustment for exploring a function's parameters.

#### Interactive Learning

An educational approach where learners actively engage with materials through manipulation and exploration.

**Example:** Students adjusting parameters in a MicroSim to observe cause-and-effect relationships.

#### Interactive Simulation

A computer model of a system or process whose behavior the learner changes through controls such as sliders, buttons, or drag actions, with the display updating in response.

**Example:** A projectile simulation where the learner adjusts launch angle and watches the trajectory change.

#### Interactive-by-Default Policy

A design stance in which a concept is presented as an interactive MicroSim unless a stated reason justifies a static image.

**Example:** Building a slider-driven plot instead of inserting a static graph.

#### Intrinsic Load

The inherent complexity of learning material determined by the content itself and learner expertise.

**Example:** The unavoidable difficulty of understanding recursion for beginning programmers.

#### Investigate Phase

The third stage of PRIMM methodology where learners explore code structure and trace execution flow.

**Example:** Students stepping through code to understand how the draw loop updates ball position.

#### isRunning State

A boolean variable tracking whether an animation or simulation is currently executing or paused.

**Example:** `if (isRunning) { updatePosition(); }` only moves objects when running.

#### Item Handle

An instrumentation helper attached to a selectable item, such as a node or table row, that reports selections.

**Example:** A handle logging each selected node by name.

#### Item Response Theory

A family of statistical models that relates a learner's latent ability and item properties, such as difficulty and discrimination, to the probability of a correct response.

**Example:** A model estimating each question's difficulty from many learners' responses.

#### Iterative Refinement

The process of progressively improving code or designs through repeated cycles of testing and modification.

**Example:** Prompting an AI to adjust slider positioning after initial code places them incorrectly.

#### JavaScript

A programming language that runs in web browsers and adds behavior to pages, including drawing, event handling, and network requests.

**Example:** A script that updates a chart when the learner moves a slider.

#### JavaScript Basics

Fundamental knowledge of JavaScript programming including variables, functions, objects, and DOM manipulation.

**Example:** Understanding how to declare variables and write functions for p5.js sketches.

#### JavaScript Library

A reusable collection of JavaScript code that provides functions for a specific purpose, such as drawing, charting, or mapping, loaded by a web page.

**Example:** Chart.js for charts or Leaflet for maps.

*See also:* CDN, Pinned Library Version

#### JSON Schema

A vocabulary for describing and validating the structure of JSON documents.

**Example:** A schema defining required metadata fields for MicroSim documentation.

#### Keyboard Events

User interactions detected when keys are pressed, released, or held on a keyboard.

**Example:** Using arrow keys to control character movement in a MicroSim.

#### Keyboard Navigation

The ability to operate interactive elements using keyboard controls without requiring a mouse.

**Example:** Tab key moves between controls; Enter activates buttons; arrow keys adjust sliders.

#### Keyboard Operability

The ability to reach and operate every function of an interface using only a keyboard.

**Example:** Adjusting a slider with arrow keys and pressing buttons with the Enter key.

#### keyPressed()

A p5.js event function that executes once when any keyboard key is pressed down.

**Example:** `function keyPressed() { if (key === ' ') togglePause(); }`

#### Keyword Routing

A type-selection method that matches words in a request or specification to keywords associated with each MicroSim type.

**Example:** The word "map" in a request points to the Leaflet type.

#### Lab Sandbox

An isolated execution environment in which learner-submitted code runs without access to the host system or other users.

**Example:** A container that runs a learner's Python script with restricted resources.

#### Large Language Model

A neural network trained on large text corpora that generates text, including program code, in response to a prompt by predicting likely continuations.

**Example:** Asking a large language model to write a Chart.js configuration from a short description.

*See also:* Prompt, AI Skill

#### Large Language Models

AI systems trained on vast text datasets to understand and generate human-like text and code.

**Example:** GPT-4 and Claude are LLMs capable of generating p5.js code from descriptions.

#### Layout Defect

A visible flaw in arrangement or rendering, such as overlap, clipping, misalignment, or hidden elements.

**Example:** A legend that overlaps the plotted data.

#### Layout Review

An inspection of a MicroSim's rendered appearance for defects in spacing, alignment, overflow, and control placement.

**Example:** Reviewing a screenshot to confirm every control is visible.

#### Leaflet JS Library

An alternative name for Leaflet.js, the JavaScript mapping library.

See also: Leaflet.js

#### Leaflet Library

An open-source JavaScript library for building interactive web maps with tiles, markers, popups, and layers.

**Example:** Loading Leaflet to display a map of school district locations.

#### Leaflet Map Type

The MicroSim type that uses the Leaflet library to show interactive geographic maps with markers, popups, and overlays.

**Example:** A map of historical sites with popups describing each location.

#### Leaflet.js

An open-source JavaScript library for creating interactive, mobile-friendly maps with various data overlays.

**Example:** Using Leaflet to display historical event locations on an interactive world map.

#### Learning From Aggregate Data

The use of combined data from many learners to improve MicroSim design, item quality, and models.

**Example:** Discovering that many learners misclassify the same item and revising it.

#### Learning Graph

A directed graph representing concepts and their prerequisite relationships within a knowledge domain.

**Example:** A visualization showing that "Variables" must be learned before "Functions."

#### Learning Object

A self-contained, reusable digital resource that addresses a specific learning objective and can be embedded in different courses or platforms without modification.

**Example:** A single interactive timeline embedded in both a history lesson and a study guide.

#### Learning Objective

A statement of what a learner will be able to do after instruction, expressed with an observable action verb and a content target.

**Example:** "Predict the direction of change in a balancing loop after a disturbance."

*See also:* Measurable Objective, Bloom Verb

#### Learning Objectives

Specific, measurable statements describing what learners should know or be able to do after instruction.

**Example:** "Students will be able to implement a responsive MicroSim layout."

#### Learning Outcome

The knowledge, skill, or ability a learner demonstrates at the end of a course or unit, typically stated at a Bloom's Taxonomy level.

**Example:** A course outcome at the Apply level: generate and deploy an instrumented MicroSim.

#### Learning Record Store

A server or service that receives, stores, and returns xAPI statements.

**Example:** A database endpoint that accepts statements from MicroSims and serves them to dashboards.

#### Library Adapter

A small piece of code that connects a specific library, such as p5.js or Chart.js, to the instrumentation runtime by reporting its events.

**Example:** An adapter that turns Chart.js click events into interacted statements.

#### Library Version Drift

A mismatch that arises when a library changes across releases so code written for one version fails or behaves differently under another.

**Example:** A sketch written for p5.js 1.x breaking after a site loads 2.x.

#### Licensing Metadata

Metadata that states the license and rights terms under which a MicroSim may be used, adapted, and shared.

**Example:** A rights field naming a Creative Commons license.

#### Line Chart

A visualization displaying data points connected by lines to show trends over continuous intervals.

**Example:** A Chart.js line chart showing temperature changes throughout a day.

#### Line Charts

Plural form referring to multiple line chart visualizations or various line chart configurations.

#### line()

A p5.js function that draws a straight line segment between two points.

**Example:** `line(0, 0, 100, 100);` draws a diagonal line from top-left.

#### Lite to Full Migration

The process of moving from LRS-Lite to the full LRS, transferring stored summaries and identifiers.

**Example:** Importing summary files into the full LRS as a pilot expands.

#### Live Preview

Real-time display of code changes without requiring manual page refresh or rebuild.

**Example:** Using `mkdocs serve` to see documentation changes immediately in the browser.

#### Local Summary Vertex

A summary vertex stored on the learner's device in LRS-Lite, holding aggregated evidence for a concept.

**Example:** A browser-stored record of answers and interactions for one concept.

#### Local Variables

Variables declared within a function, accessible only within that function's scope.

**Example:** `function draw() { let x = 100; }` where x exists only inside draw().

#### Long-Term Vision

The anticipated future state in which AI-generated MicroSims are both engaging and strong predictors of mastery.

**Example:** A textbook whose every MicroSim is generated, verified, and calibrated automatically.

#### Loops

Programming constructs that repeat code execution until a condition is met.

**Example:** A for loop drawing multiple circles: `for (let i = 0; i < 10; i++) { ellipse(i*40, 200, 30); }`

#### Loss of Focus Event

An event recorded when the MicroSim's tab or window loses focus, used to bound active time.

**Example:** An event marking the learner switching to another tab.

#### Low-Bandwidth Design

Design practices ensuring content loads and functions effectively on slow internet connections.

**Example:** Minimizing JavaScript file sizes and avoiding large image downloads in MicroSims.

#### LRS Architecture

The design of the components that collect, validate, store, and analyze xAPI statements, and the connections between them.

**Example:** A design with an ingestion gateway, event stream, processors, and storage.

#### LRS Config File

A configuration file that sets the runtime script's options, such as the endpoint, mode, and site address.

**Example:** A file specifying the storage endpoint and whether summaries are compact.

#### LRS Runtime Script

The shared JavaScript file loaded by MicroSims that builds xAPI statements and sends them to the configured store.

**Example:** A single script included in main.html that exposes instrumentation functions.

#### LRS-Lite

A serverless, compact alternative to the full LRS that stores summarized evidence, often in the browser, and syncs it to simple object storage.

**Example:** A classroom using LRS-Lite to keep mastery summaries without running servers.

*See also:* Compact Mode, Serverless LRS

#### main.html

The HTML wrapper file in a MicroSim directory that loads the required libraries and scripts and is the page referenced by an iframe.

**Example:** An iframe src pointing to a MicroSim's main.html.

#### main.html File

A minimal HTML file that serves as the entry point for iframe embedding of a MicroSim.

**Example:** An HTML file loading style.css and script.js for iframe source.

#### Make Phase

The fifth and final stage of PRIMM methodology where learners create original code based on learned patterns.

**Example:** Students designing their own simulation after studying examples.

#### Map Marker

A symbol placed at a geographic coordinate on a map to identify a place or feature.

**Example:** A pin at a city's latitude and longitude.

#### Map Popup

A small window attached to a map marker or region that displays information when the user selects it.

**Example:** Clicking a marker to see a site's name and description.

#### Map Tile Source

A service that supplies the square image tiles forming the map's background at each zoom level.

**Example:** OpenStreetMap tiles with attribution shown on the map.

#### Maps

Geographic visualizations displaying spatial relationships and location-based data.

**Example:** An interactive map showing earthquake locations with magnitude indicators.

#### Margin Variable

A numerical value defining the spacing between visual elements and canvas edges.

**Example:** `let margin = 25;` creates consistent 25-pixel padding around content.

#### Mastery Prediction

The estimation, from evidence such as xAPI statements, of whether or to what degree a learner has mastered a concept.

**Example:** An estimate of 0.85 probability that a learner has mastered a concept.

#### Mastery Threshold

The estimated mastery probability at or above which a concept is treated as mastered for reporting.

**Example:** Marking a concept mastered when the estimate reaches 0.95.

#### Measurable Objective

A learning objective phrased so that an observable behavior or result can show whether it was achieved.

**Example:** "Classify ten items into the correct category with at least eight correct" rather than "understand categories."

#### Measured Versus Designed Claims

The distinction between properties demonstrated with data and properties intended by design but not yet tested.

**Example:** Saying a feature is designed to support prediction, not that it was shown to.

#### Mermaid

A JavaScript library that renders diagrams from text-based descriptions using a markdown-inspired syntax.

**Example:** Creating flowcharts by writing `graph TD; A-->B;` in markdown files.

#### Mermaid Hover Text

Tooltip text attached to elements of a Mermaid diagram so pointer hover reveals extra explanation.

**Example:** Hovering over a pipeline step to see its inputs and outputs.

#### Mermaid Library

A JavaScript library that turns diagram descriptions written as text into rendered diagrams such as flowcharts and sequence diagrams.

**Example:** Loading Mermaid so a page renders a flowchart from a text block.

#### Mermaid Syntax Rules

The grammar conventions of Mermaid text, including keywords, arrow forms, and escaping of special characters, that determine whether a diagram renders.

**Example:** Quoting a node label that contains parentheses to avoid a parse error.

#### Mermaid Type

The MicroSim type that renders flowcharts, sequence diagrams, and other structured diagrams from text written in Mermaid syntax.

**Example:** A flowchart of the batch generation pipeline.

#### Mermaid.js Diagrams

Visual diagrams generated by the Mermaid library including flowcharts, sequence diagrams, and entity relationships.

**Example:** A process diagram created from text that automatically handles layout and styling.

#### Metadata Schema

A formal definition of the fields, types, and allowed values a metadata file contains, used to validate records.

**Example:** A JSON Schema checking that every metadata file has a title and type.

#### Metadata Standards

Agreed-upon formats and vocabularies for describing digital resources to enable discovery and interoperability.

**Example:** Dublin Core, Schema.org, and IEEE LOM are metadata standards used in education.

#### metadata.json

A JSON file in a MicroSim directory that records structured descriptive, educational, technical, and search information about the MicroSim.

**Example:** A file listing the title, subject, grade level, library, and concept identifiers.

*See also:* Metadata Schema

#### metadata.json File

A JSON file containing machine-readable descriptive information about a MicroSim.

**Example:** A file with Dublin Core fields, educational level, and technical requirements.

#### MicroSim

A small, AI-generated, iframe-embeddable, width-responsive interactive learning object that teaches one concept and, in this book, is instrumented to emit xAPI evidence about learner interaction.

**Example:** A slider-driven plot showing how changing resistance alters current in a simple circuit.

*See also:* Interactive Simulation, Instrumented MicroSim

#### MicroSim Architecture

The structural organization of simulation components including regions, layouts, and interaction patterns.

**Example:** A standard architecture with drawing region, control region, and responsive sizing.

#### MicroSim Definition

A small, focused, interactive web-based simulation designed to help learners understand a single concept.

**Example:** A bouncing ball simulation teaching concepts of gravity and energy conservation.

#### MicroSim Directory

The folder that holds all files for one MicroSim, typically the HTML wrapper, JavaScript, documentation page, metadata file, and preview image.

**Example:** A folder named for the simulation containing main.html, the sketch file, index.md, and metadata.json.

#### MicroSim Generator Skill

The AI skill that routes a request to a MicroSim type and produces the complete set of files for that MicroSim.

**Example:** Invoking the skill with "create a timeline of computing history" to get main.html, script, and documentation.

*See also:* AI Skill, Skill Invocation

#### MicroSim JavaScript File

The script file in a MicroSim directory that contains the simulation logic, drawing code, control setup, and any instrumentation calls.

**Example:** A sketch file defining setup and draw functions for a p5.js MicroSim.

#### MicroSim Packaging

The standard set of files and folder structure required for a complete, deployable MicroSim.

**Example:** A directory containing index.md, main.html, style.css, script.js, and metadata.json.

#### MicroSim Submission Guidelines

A set of requirements describing the files, metadata, and quality standards a MicroSim meets to be accepted into a shared collection.

**Example:** A checklist requiring metadata, an iframe-ready page, and a preview image.

#### MicroSim Template

A starter set of files and code structure that new MicroSims are copied from to keep layout, naming, and documentation consistent.

**Example:** Copying the template folder and renaming files for a new simulation.

#### MicroSim Type Catalog

The list of MicroSim generator types available in the book, each paired with its library and the kinds of objectives it serves best.

**Example:** Entries for p5.js, Chart.js, Plotly, Mermaid, vis-network, vis-timeline, and Leaflet types.

*See also:* Type Routing

#### MicroSim Type Selection

The process of choosing the appropriate simulation format based on learning objectives and content type.

**Example:** Selecting a timeline for historical events and a network graph for concept relationships.

#### MicroSim Uniqueness

The characteristic that each MicroSim focuses on a single, specific concept or skill.

**Example:** One MicroSim for gravity, a separate one for friction, rather than combining both.

#### MicroSim Validation

The process of checking that a MicroSim meets quality standards for functionality, accessibility, and documentation.

**Example:** Running automated tests to verify all required metadata fields are present.

#### MicroSims 1.0

The original form of MicroSims, consisting mainly of p5.js animations and simulations generated with AI, without a standardized evidence stream or broad type catalog.

Distinguishing 1.0 from 2.0 frames the book's additions: multiple generator types, automated quality checks, and instrumentation.

#### MicroSims 2.0

The expanded approach in which MicroSims span many types (charts, diagrams, maps, posters, labs), are generated in batches, checked automatically, found through metadata, and instrumented with xAPI to support mastery prediction.

**Example:** A chapter portfolio of twenty MicroSims of mixed types, each emitting statements to a learning record store.

#### Minimal Borders

A design approach eliminating or reducing visual boundaries around embedded content for seamless integration.

**Example:** Using `border: none;` CSS to remove iframe borders on textbook pages.

#### Misclick Threshold

A limit used to decide that rapid or accidental clicks do not count as evidence of intentional interaction.

**Example:** Discarding a click followed immediately by a second click elsewhere.

#### MkDocs

A static site generator that builds a documentation website from Markdown files and a YAML configuration file.

This book and its MicroSims are published with MkDocs using the Material theme.

**Example:** Running a build command turns the docs folder into HTML pages for hosting.

#### MkDocs Embedding

The technique of incorporating MicroSims into MkDocs documentation pages using iframes.

**Example:** Adding `<iframe src="./main.html"></iframe>` to a markdown documentation file.

#### mkdocs serve

A command that starts a local development server for previewing MkDocs documentation with live reload.

**Example:** Running `mkdocs serve` to preview changes at http://127.0.0.1:8000.

#### Mobile Layout

An arrangement of content and controls adapted to narrow touch screens, with adequate target sizes and no horizontal scrolling.

**Example:** Stacking controls beneath the drawing area on a phone.

#### Model Editor

A MicroSim type at Bloom's Create level where users construct or modify conceptual models.

**Example:** A simulation where students build their own state machine diagrams.

#### Model Editor MicroSim

A MicroSim that lets learners modify the structure or parameters of a model, such as a diagram's nodes or an equation's terms, and observe the result.

**Example:** A causal loop editor where adding a link changes the loop type displayed.

#### Modify Phase

The fourth stage of PRIMM methodology where learners make changes to existing code to observe effects.

**Example:** Students changing the gravity constant in a physics simulation to see different behaviors.

#### Mouse Events

User interactions detected when the mouse moves, clicks, drags, or hovers over elements.

**Example:** Using `mousePressed()` to detect clicks on interactive elements.

#### mouseDragged()

A p5.js event function that executes continuously while the mouse button is held and moved.

**Example:** Allowing users to drag objects by updating positions in `mouseDragged()`.

#### mousePressed()

A p5.js event function that executes once when a mouse button is clicked down.

**Example:** `function mousePressed() { if (overButton) toggleState(); }`

#### Multi-Device Backup

The preservation of a learner's data across more than one device through synchronization to shared storage.

**Example:** Continuing on a home computer with summaries created at school.

#### Multi-Tenancy

An architecture in which one system instance serves multiple independent customers, called tenants, whose data remain separated.

**Example:** One LRS serving many school districts with isolated data.

#### Multiple Representations

The pedagogical practice of presenting concepts through various formats like text, images, and interactions.

**Example:** Teaching fractions through written explanations, pie charts, and interactive MicroSims.

#### Nav Status Icon

A symbol shown beside a navigation entry to indicate a MicroSim's production or quality status.

**Example:** A check mark beside validated MicroSims in the menu.

#### Navigation Update

The step of adding new MicroSims to the site's navigation configuration so they appear in menus.

**Example:** Adding entries to mkdocs.yml after generation.

#### Near-Term Roadmap

A list of expected next developments for MicroSims that are feasible with current tools and practices.

**Example:** Verified adapters and improved automated layout repair.

#### Neo4j Graph Database

A database that stores data as a property graph and supports graph queries, used to model learners, concepts, and relationships.

**Example:** Querying a learner's mastery across prerequisite concepts.

#### Network Graphs

Visualizations showing nodes and edges representing entities and their relationships.

**Example:** A vis-network diagram displaying prerequisite relationships between course concepts.

#### Network Layout

The algorithm or settings that position nodes of a graph on the canvas, such as physics-based or hierarchical arrangements.

**Example:** A hierarchical layout placing prerequisites above dependent concepts.

#### Node and Edge Data

The lists that define a network diagram, with nodes describing entities and edges describing connections between them.

**Example:** A node list of concepts and an edge list of prerequisites.

#### Node Selection Event

A browser event raised when a user selects a node in a network diagram, allowing code to display details or record the interaction.

**Example:** Selecting a node triggers a detail panel and an interaction log entry.

#### Non-Evidence Threshold

A minimum level of duration or distinctness below which an interaction is treated as noise rather than evidence.

**Example:** Ignoring a hover lasting less than a fraction of a second.

#### Object

The part of an xAPI statement that identifies what the actor acted upon, typically an activity with an IRI.

**Example:** A MicroSim or one of its questions identified by a URL.

#### Object Storage Sync

The copying of locally stored summaries to cloud object storage so data is shared and backed up.

**Example:** Uploading a learner's summary file to a bucket.

#### Objective Classification

The process of categorizing learning objectives according to frameworks like Bloom's Taxonomy.

**Example:** Identifying "explain the difference" as an Understand-level objective.

#### Objective-to-Type Mapping

A table or rule set that associates kinds of learning objectives, often by Bloom level, with the MicroSim types suited to them.

**Example:** Analyze-level comparison objectives mapped to comparison tables or scatter plots.

#### Older Device Support

Design considerations ensuring functionality on devices with limited processing power or older browsers.

**Example:** Avoiding complex WebGL features that may not work on older tablets.

#### Open Educational Resource

A teaching or learning material released under an open license or into the public domain so others can use, adapt, and redistribute it.

**Example:** A MicroSim published with a Creative Commons license that teachers may remix.

#### Open Exploration

An instructional approach allowing learners to discover concepts freely without prescribed steps.

**Example:** A sandbox MicroSim where students can adjust any parameter in any order.

#### Open Graph Tags

HTML metadata elements controlling how content appears when shared on social media platforms.

**Example:** `<meta property="og:image" content="/sims/ball/ball.png">` sets the share preview image.

#### Open Research Problems

Unresolved questions in the field, such as how to measure evidence quality, compare designs, and generalize across learners.

**Example:** Determining which interaction types best predict transfer.

#### OpenMaps Data

Geographic data from OpenStreetMap, a collaborative mapping project providing free map data.

**Example:** Leaflet.js MicroSims using OpenStreetMap tiles for base map display.

#### Org Chart Example

A network visualization demonstrating hierarchical organizational structure with reporting relationships.

**Example:** A vis-network diagram showing company departments and reporting lines.

#### Other Chart Types

Additional visualization formats beyond basic bar, line, and pie charts, such as radar, polar, and doughnut charts.

**Example:** Using Chart.js radar charts to compare skills across multiple dimensions.

#### Other MicroSim Libraries

JavaScript frameworks beyond the core set used for specialized visualization needs.

**Example:** Three.js for 3D graphics or D3.js for custom data visualizations.

#### Overlay Data File

A data file, often JSON, that stores the positions, labels, and text for an image overlay separately from the code.

**Example:** A JSON list of zones with x, y, width, height, and description fields.

#### Overlay Height Pinning

A technique that fixes an overlay's height to the image's rendered height so zones stay aligned as the width changes.

**Example:** Computing overlay height from the image aspect ratio on each resize.

#### Overlay Image Prompt

A prompt given to an image-generation model to create the base image for an overlay, written so the result suits labeling.

**Example:** A prompt requesting a clean cutaway illustration with room around each part.

#### p5.js 2.x Migration

The process of updating p5.js 1.x code to the 2.x major release, which changes some behaviors such as asynchronous loading.

**Example:** Replacing a preload function with async setup.

*See also:* Async Setup

#### p5.js Editor Preview

The built-in preview feature of the p5.js online editor showing sketch output in real-time.

**Example:** Testing MicroSim code at editor.p5js.org before integrating into a website.

#### p5.js Library

A JavaScript library making creative coding accessible with functions for drawing, animation, and interaction.

**Example:** Using p5.js to create an interactive physics simulation with minimal code.

#### p5.js MicroSim

A MicroSim built using the p5.js library, offering maximum flexibility for custom visualizations and interactions.

**Example:** A custom-coded animation showing wave interference patterns.

#### p5.js Sketch

A program written with the p5.js library, typically defining setup and draw functions that create and update a canvas.

**Example:** A sketch that draws a moving particle each frame.

#### p5.js Type

The MicroSim type that uses the p5.js library for custom drawing, animation, physics, and freeform interaction on a canvas.

**Example:** A bouncing-ball simulation with gravity and elasticity controls.

#### p5.js Web Editor

An online environment for writing and running p5.js sketches in a browser without local installation.

**Example:** Pasting a generated sketch into the editor to test it quickly.

#### Page Dwell Evidence

Evidence based on the time a learner spends with a MicroSim or page, recorded after filtering out inactive time.

**Example:** Ninety seconds of engaged time on a diagram.

#### Page Front Matter

The YAML block at the top of a Markdown page, delimited by triple dashes, that holds page metadata such as title, description, and image.

**Example:** Front matter giving an index.md its title and social preview image.

#### Parallel Workers

Multiple agents or processes that handle different items of a batch at the same time to shorten total run time.

**Example:** Five agents each generating a different MicroSim concurrently.

#### Parameter Adjustment

The ability for users to modify simulation variables through interactive controls.

**Example:** A slider allowing users to change the gravity constant from 0.1 to 2.0.

#### Particle System

A technique that simulates many small elements, each with its own position, velocity, and lifespan, to show effects such as smoke, fluids, or confetti.

**Example:** Hundreds of dots flowing through a pipe to represent current.

#### Partition by Learner

A data distribution strategy that places all events for one learner in the same partition so they are processed in order together.

**Example:** Using the learner identifier as the partition key of the stream.

#### Pause Button

An interactive control that temporarily halts simulation execution while preserving current state.

**Example:** A button that sets `isRunning = false` without resetting position variables.

#### Pause-When-Idle Animation

An animation that stops updating when the learner is not interacting or the page is hidden, saving processing power and avoiding distraction.

**Example:** A sketch that calls noLoop when the tab loses focus.

#### Peer Review

A collaborative process where team members evaluate each other's work to improve quality.

**Example:** Colleagues reviewing MicroSim code for bugs, accessibility, and best practices.

#### Per-Concept Mastery

A mastery estimate maintained separately for each concept in a learner's model.

**Example:** Separate estimates for "amplitude" and "frequency."

#### Per-District Salt

A secret random value specific to a district that is combined with a learner identifier before hashing, so identical learners yield different pseudonyms across districts.

**Example:** The same student receiving unrelated identifiers in two districts.

#### Percentage Rectangle Zone

An interactive zone defined by its position and size as percentages of the image dimensions, so it scales with the image.

**Example:** A zone starting at 10 percent from the left with 30 percent width.

#### Persistent Storage Request

A browser API call asking that a site's stored data be protected from automatic eviction.

**Example:** Requesting persistence when the first summary is saved.

#### Physics Simulation

A computer model that updates object states over time using physical laws such as gravity, friction, or elasticity.

**Example:** A pendulum whose angle updates each frame from gravity and length.

#### Pie Chart

A circular chart divided into slices whose angles represent each category's share of a whole.

**Example:** A pie chart of the proportion of each MicroSim type in a portfolio.

#### Pie Charts

Circular visualizations divided into sectors representing proportional parts of a whole.

**Example:** A Chart.js pie chart showing the distribution of student grade levels.

#### PII Surface

The set of places in a system where personally identifiable information is collected, stored, or transmitted.

**Example:** Login forms, rosters, and logs that may contain names.

#### Pinned Library Version

A JavaScript library reference that specifies an exact release number so the MicroSim loads the same code every time.

**Example:** Loading p5.js at a fixed version in the script tag rather than the latest release.

*See also:* Library Version Drift

#### Pixels

The individual dots of color that compose digital images and define canvas resolution.

**Example:** A 400×450 canvas contains 180,000 individually addressable pixels.

#### Playwright

A browser automation framework that drives real browsers by script to load pages, click elements, read content, and capture screenshots.

**Example:** A script that opens a MicroSim, moves a slider, and records console errors.

#### Plotly Library

A JavaScript graphing library that produces interactive scientific and statistical plots with built-in zoom, pan, and hover features.

**Example:** Loading Plotly to draw a function graph in a MicroSim.

#### Plotly Type

The MicroSim type that uses the Plotly library for scientific and mathematical plots, including function graphs and plots with built-in zoom and hover.

**Example:** A plot of a sine function with sliders for amplitude and frequency.

#### Point-Marker Overlay

An overlay that places small clickable markers at specific coordinates on an image, each tied to an explanation.

**Example:** Numbered dots on a machine photograph that open part descriptions.

#### Polarity Link

An arrow in a causal loop diagram marked with a plus sign when two variables change in the same direction or a minus sign when they change in opposite directions.

**Example:** An arrow from "study time" to "errors" marked with a minus sign.

#### Policy Precedence

The order in which competing configuration or privacy rules apply when they conflict, with higher-ranked rules overriding lower ones.

**Example:** A district's suppression rule overriding a MicroSim's default logging.

#### pop() Function

A p5.js function that restores drawing settings to their state before the most recent push() call.

**Example:** Using `pop()` after drawing a rotated element to restore normal orientation.

#### Portfolio Development

The process of collecting, organizing, and presenting work samples demonstrating skills and accomplishments.

**Example:** Building a GitHub repository showcasing diverse MicroSim projects.

#### Portfolio Fidelity Report

A document summarizing the predictive fidelity evidence and limitations for the MicroSims in a capstone portfolio.

**Example:** A report giving per-concept metrics and noting gaps.

#### Poster Column Zone

A vertical region of a poster that groups related content, such as one subject of a comparison, and acts as an interactive zone.

**Example:** The left column covering the first subject, highlighted on hover.

#### Poster Folder Convention

A standard arrangement of files for a poster MicroSim, including the image, data file, script, and documentation, in named locations.

**Example:** A folder holding poster.png, zones.json, and main.html.

#### Poster Instrumentation

The addition of xAPI logging to a poster so hovers, clicks, and quiz answers are recorded as evidence.

**Example:** Recording each zone explored and each poster quiz answer.

#### Poster Quiz Question

A question attached to a poster that asks learners to recall or apply its content, used for engagement or assessment.

**Example:** "Which category has the highest share?" answered by selecting a zone.

#### postMessage Resize

The use of the browser postMessage API by an embedded page to send its height to the parent window, which then adjusts the iframe.

**Example:** A child page posting a message with a numeric height field.

#### Predict Phase

The first stage of PRIMM methodology where learners predict code behavior before execution.

**Example:** Students guessing what output code will produce before running it.

#### Predict-First Design

An interaction design in which the learner commits to a prediction before the MicroSim reveals the outcome, prompting retrieval and comparison with the actual result.

**Example:** Asking which way a graph will shift before the slider is moved.

#### Prediction Accuracy

The proportion of a model's predictions, such as mastered or not mastered, that match the observed outcomes.

**Example:** 82 of 100 learners classified correctly.

#### Predictive Fidelity

The degree to which an evidence stream's predictions of mastery agree with independent measures of mastery.

This is the central evaluation question of the book.

**Example:** High fidelity if predicted mastery correlates strongly with a held-out test.

#### Prerequisite Propagation

The use of concept dependencies to adjust mastery estimates, for example by raising confidence in prerequisites when a dependent concept is mastered.

**Example:** Strong evidence on an advanced concept increasing the estimate for its prerequisite.

#### Preview Image

A static screenshot of a MicroSim used as a thumbnail in galleries, link previews, and documentation pages.

**Example:** A PNG file named for the MicroSim shown in the gallery grid.

#### PRIMM Method

A teaching sequence for programming with the stages Predict, Run, Investigate, Modify, and Make.

**Example:** Learners predict code output, run it, examine it, change it, then write a new program.

#### PRIMM Methodology

A pedagogical framework for teaching programming: Predict, Run, Investigate, Modify, Make.

**Example:** Using PRIMM to scaffold learning when introducing new p5.js concepts.

#### Priority Matrix

A two-axis chart, often built from a scatter or bubble plot, that places items by two criteria such as impact and effort to support prioritization.

**Example:** A matrix where high-impact, low-effort MicroSims appear in the top-left quadrant.

#### Process Diagrams

Visual representations showing steps, decisions, and flows in a procedure or workflow.

**Example:** A Mermaid diagram showing the steps to create and deploy a MicroSim.

#### Producer Contract

The agreement that defines what a MicroSim, as a statement producer, sends, including required fields, identifiers, and formats.

**Example:** A contract that every statement includes a concept identifier extension.

#### Producer-Side Summarization

The aggregation of interaction events inside the MicroSim before sending, so fewer, smaller statements leave the learner's device.

**Example:** Computing dwell and interaction counts in the browser.

#### Programming Fundamentals

Core concepts underlying all programming including variables, control flow, functions, and debugging.

**Example:** Understanding loops and conditionals before learning p5.js-specific functions.

#### Project Evaluation

The systematic assessment of completed work against defined criteria and rubrics.

**Example:** Scoring a capstone MicroSim using the 100-point quality rubric.

#### Prompt

The text given to a large language model that states the task, context, constraints, and desired output.

**Example:** "Create a p5.js MicroSim that shows the Doppler effect with a slider for source speed."

*See also:* Prompt Design, System Prompt

#### Prompt Design

The practice of structuring prompts with context, constraints, examples, and output format so a language model produces the intended result.

**Example:** Adding a specification block and a file list to a generation prompt.

#### Prompt Engineering

The skill of crafting effective text inputs to guide AI systems toward desired outputs.

**Example:** Writing specific, detailed prompts that produce functional MicroSim code.

#### Property Graph Data Model

A data model in which entities are vertices and relationships are edges, both carrying key-value properties.

**Example:** A learner vertex connected to concept vertices by mastery edges.

#### Prototyping

Creating preliminary versions of simulations to test concepts and gather feedback before full development.

**Example:** Quickly sketching a MicroSim idea in the p5.js editor before refining.

#### Provenance Record

Metadata documenting a MicroSim's origin, including who or what created it, the sources used, and any derivation from other works.

**Example:** A note naming the model, skill, and source MicroSim used.

#### Pseudonymous Learner ID

An identifier that represents a learner in records without revealing the learner's real identity, resolvable only with separately held data.

**Example:** A hash-derived code used as the actor in statements.

#### Purpose of Animation

The instructional reason an animation is included, such as showing change over time, revealing hidden structure, or directing attention, as opposed to decoration.

**Example:** Animated current flow showing which path electrons take when a switch closes.

#### push() Function

A p5.js function that saves current drawing settings to a stack for later restoration.

**Example:** Using `push()` before applying transforms to isolate their effects.

#### Quality Gate

A checkpoint in a pipeline that a MicroSim passes only when it meets defined quality criteria, such as a minimum score.

**Example:** A gate that blocks linking a MicroSim with a score under 80.

#### Quality Grade

A numeric or letter rating assigned to a MicroSim by a scoring procedure that summarizes how well it meets defined quality criteria.

**Example:** A MicroSim scoring 92 of 100 on the quality rubric.

#### Quality Score

A numerical rating assessing MicroSim completeness, functionality, and adherence to standards.

**Example:** A MicroSim with full documentation, accessibility, and responsive design scores 95/100.

#### Question Handle

An instrumentation helper attached to a question that reports the learner's answer, correctness, and attempt number.

**Example:** A handle recording an answered statement with success true.

#### Quiz Mode

A MicroSim operational state presenting assessment questions and evaluating user responses.

**Example:** A simulation that switches from exploration to testing user understanding.

#### Quota and Eviction

The browser's limits on storage per site and its practice of removing stored data under pressure when not marked persistent.

**Example:** A browser deleting a site's data when device storage is low.

#### ReactFlow

A JavaScript library for building node-based editors and interactive diagrams in React applications.

**Example:** Creating complex workflow editors with drag-and-drop node connections.

#### rect()

A p5.js function that draws a rectangle at specified coordinates with given width and height.

**Example:** `rect(10, 10, 100, 50);` draws a 100×50 rectangle at position (10, 10).

#### Redpanda

A streaming data platform compatible with the Kafka protocol, used to transport events between components.

**Example:** Holding statements in a Redpanda topic before processing.

#### Reinforcing Loop

A feedback loop in which a change in a variable leads, around the loop, to further change in the same direction, amplifying growth or decline.

**Example:** More practice improves skill, which increases confidence, which leads to more practice.

#### Relative Iframe Path

An iframe source written relative to the current page rather than as an absolute address, so embeds work in local previews and deployed sites.

**Example:** A source of "../sims/name/main.html" instead of a full web address.

#### Relative Positioning

Placing elements based on calculated positions relative to canvas dimensions or other elements.

**Example:** `text(title, canvasWidth/2, margin);` centers text regardless of canvas size.

#### Remember Level

The first and foundational level of Bloom's Taxonomy involving recall of facts and basic concepts.

**Example:** Memorizing the names of p5.js drawing functions.

#### Render Audit

A check of the rendered poster that confirms displayed text and numbers match the verified claims.

**Example:** Comparing on-screen statistics to the verification report.

#### Reporting Prediction Quality

The practice of presenting prediction results with their metrics, data, methods, and limitations.

**Example:** A report giving AUC, sample size, and caveats.

#### Reproducible Generation

A generation process that records specifications, prompts, skill versions, and library versions so a MicroSim can be regenerated with comparable results.

**Example:** Storing the specification file next to the generated code.

#### Reset Button

An interactive control that returns simulation state and parameters to initial default values.

**Example:** A button that resets ball position, velocity, and slider values to starting conditions.

#### Responsive Layout

A MicroSim design that dynamically adjusts to fit different container sizes and viewport dimensions.

**Example:** A simulation that expands to fill available width while maintaining proportions.

#### Responsive Width

The horizontal dimension that automatically adjusts based on container or viewport size.

**Example:** `canvasWidth = document.querySelector('main').offsetWidth;`

#### Result

The optional part of an xAPI statement that records the outcome of the action, such as success, score, response, and duration.

**Example:** A result with success true and a duration of twelve seconds.

#### Result Extensions

Custom fields inside an xAPI result that carry additional measurements not covered by standard result properties.

**Example:** An extension with the final slider value chosen.

#### Resumable Pipeline

A multi-step process that records progress so an interrupted run can continue from the last completed item rather than starting over.

**Example:** Restarting batch generation and skipping sims whose status is already generated.

#### Reuse Before Build

A practice of searching existing MicroSims for a suitable match before generating a new one.

**Example:** Finding a comparison table MicroSim that needs only new data.

#### Reuse Versus Build Decision

The choice between adapting an existing MicroSim and generating a new one, made after searching available metadata for a close match.

**Example:** Adapting an existing pie chart MicroSim by changing its data instead of generating a new one.

*See also:* Reuse Before Build

#### Reward Feedback

A positive response, such as a message, sound, or animation, presented when a learner succeeds or progresses.

**Example:** A short animation and a "Well done" message after a correct sort.

#### RGB Color Model

A color system defining colors by red, green, and blue component values ranging from 0 to 255.

**Example:** `fill(255, 0, 0);` produces pure red; `fill(128, 128, 128);` produces gray.

#### Roster and Identity

The data and services that identify learners, teachers, and classes and connect them to the statements they generate.

**Example:** A roster linking pseudonymous learner identifiers to class sections.

#### Routing Ambiguity

A condition in which two or more MicroSim types receive similar routing scores, so the rubric does not clearly identify a single best type.

**Example:** A request for an interactive function graph scoring nearly equal for p5.js and Plotly.

#### Routing Rubric

A scoring guide that maps features of a learning objective and its content to candidate MicroSim types so the choice is made consistently.

**Example:** Points added for a type when the objective mentions geography or dates.

#### Routing Score

A numeric value assigned to each candidate MicroSim type by the routing rubric, with the highest score indicating the best match.

**Example:** Chart.js scores 7 and Plotly scores 5 for a bar chart request.

#### Rules File

A project file that stores standing instructions and conventions an AI agent reads automatically when working in a repository.

**Example:** A CLAUDE.md file describing canvas layout constants and folder structure.

#### Rules Files

Configuration documents containing coding standards and patterns for AI-assisted development.

**Example:** A .cursor/rules file specifying MicroSim layout conventions for AI tools.

#### Run and Pause Evidence

Evidence drawn from a learner's starting, pausing, and resetting of an animation or simulation.

**Example:** Pausing a simulation at the moment a value changes.

#### Run Phase

The second stage of PRIMM methodology where learners execute code to observe actual behavior.

**Example:** Students running a sketch to compare actual output with their predictions.

#### Runnable Code Block

A code listing in a page that the learner can edit and execute, with output shown alongside.

**Example:** A Python snippet with a Run button that prints results below the code.

#### Sample Size Requirement

The number of learners or observations needed to estimate a measure of prediction quality with useful precision.

**Example:** Needing enough learners per concept for a stable AUC.

#### Scaffold Generation

The creation of the directory structure and starter files for each MicroSim before full content is generated.

**Example:** Creating folders, placeholder documentation, and a status file for each specified sim.

#### Scaffolding

Temporary instructional support that guides a learner through a task and is reduced as competence grows.

**Example:** A MicroSim that offers hints on the first attempts and removes them later.

#### Scaffolding Strategies

Instructional techniques providing temporary support that is gradually removed as learner competence increases.

**Example:** Starting with guided tutorials before moving to open-ended MicroSim creation.

#### Scatter Plot

A chart that plots items as points at positions set by two numeric variables, showing relationships and clusters.

**Example:** Points of estimated effort versus learning impact for candidate MicroSims.

*See also:* Priority Matrix

#### Screen Reader Support

Features enabling visually impaired users to access content through text-to-speech software.

**Example:** Using the p5.js describe() function to provide canvas content descriptions.

#### Screenshot Capture

The automated saving of an image of a rendered page or region for review, documentation, or thumbnails.

**Example:** Capturing each MicroSim at desktop and phone widths.

#### script.js File

The JavaScript file containing the p5.js sketch code for a MicroSim.

**Example:** A file with setup(), draw(), and event handler functions.

#### Scroll Zoom Hijacking

An interface problem in which a map captures mouse wheel events for zooming so the page cannot scroll when the pointer is over the map.

**Example:** A reader unable to scroll past an embedded map until scroll zoom is disabled.

#### Search Index

A data structure built from metadata and text that allows fast lookup of matching MicroSims.

**Example:** A generated file mapping keywords to MicroSim folders.

#### Search Metadata

Fields such as keywords, tags, and summaries included to help a person or program find a MicroSim.

**Example:** A keyword list including "feedback," "loop," and "system."

#### Semantic Waves

A teaching model that alternates between abstract, technical explanation and concrete, everyday explanation to help learners build understanding.

**Example:** Moving from a formal definition to an everyday example and back.

#### Separation of Drawing and Control Regions Pattern

A design pattern that uses separates screen regions for drawing and controlling simulations.

**Example:** In MicroSims, the drawing region is typically placed above the control
region.

```js
let drawHeight = 400;      // Upper region for visualization
let controlHeight = 50;    // Lower region for UI controls
let canvasHeight = drawHeight + controlHeight;
```

The upper region (colored 'aliceblue') displays the simulation. The lower region (colored 'white') contains
sliders and buttons. This pattern solves the problem of separating interactive controls from the
visualization area, ensuring controls don't obscure the simulation and users always know where to find them.

This pattern appears consistently across MicroSims in most MicroSim examples, enabling:

- Predictable user experience
- Reliable AI generation (the pattern is learnable)
- Easier maintenance and modification

#### Sequence Diagram

A diagram that shows messages exchanged between participants in time order along vertical lifelines.

**Example:** A diagram of a MicroSim sending an xAPI statement to a learning record store.

#### Sequence Diagrams

Visualizations showing interactions between components over time with vertical lifelines and horizontal messages.

**Example:** A Mermaid sequence diagram showing user, browser, and server communication.

#### Serverless LRS

An LRS design that runs on managed cloud functions and storage, without servers the operator maintains.

**Example:** Statements written to object storage by a cloud function.

#### Session Summary Statement

A statement that condenses a learner's activity in one MicroSim session into aggregate counts and measures.

**Example:** One statement reporting number of slider changes, dwell time, and answers.

#### setup() Function

A p5.js function that executes once when the sketch starts, used for initialization.

**Example:** Creating the canvas, initializing variables, and setting initial states in setup().

#### Shape Drawing

The use of drawing functions to render primitives such as lines, rectangles, ellipses, and polygons on a canvas.

**Example:** Drawing a rectangle for a wall and a circle for a ball.

#### Shape Rendering

The process of drawing geometric shapes on the canvas with specified colors, strokes, and fills.

**Example:** Rendering a filled blue circle with a black outline.

#### Shared Overlay Library

A common JavaScript module used by many overlay MicroSims so zone handling and display code are written once and reused.

**Example:** Several posters importing the same overlay script and differing only in data.

#### Shared Sim Libraries

Common code modules used by many MicroSims so functions for layout, instrumentation, or interaction are maintained in one place.

**Example:** A shared script that handles resize and xAPI calls.

#### Showcase MicroSim

A polished, high-fidelity MicroSim built to demonstrate the upper range of quality and technique, serving as a reference for what a finished example looks like.

**Example:** A fully animated H-Bridge circuit with flowing current and interactive switches.

#### Signal Versus Noise

The distinction between interaction data that informs about knowledge and data that reflects randomness or unrelated behavior.

**Example:** A deliberate parameter change is signal; an accidental click is noise.

#### Sim Status File

A small file stored with a MicroSim that records its current state in the status lifecycle.

**Example:** A file containing the word "validated."

#### Similarity Search

A search that ranks items by how closely their content or metadata resembles a query or another item.

**Example:** Finding MicroSims most similar to a specification's description.

#### Simplicity

The design principle that MicroSims should focus on essential elements without unnecessary complexity.

**Example:** A bouncing ball with only the controls needed to understand the physics concept.

#### Simulation Effectiveness Studies

Research that measures the effect of simulations on learning outcomes by comparing learners with and without them.

**Example:** A study comparing test scores of classes using a simulation versus a lecture.

#### Simulation Fidelity

The degree to which a simulation accurately represents real-world behavior and systems.

**Example:** High-fidelity physics simulations use actual equations; low-fidelity uses simplified models.

#### Skill Invocation

The act of calling an AI skill, by name or by matching request, so that its instructions guide the agent's work.

**Example:** Typing a request that triggers the MicroSim generator skill.

#### Skill Reference Guide

A document bundled with an AI skill that supplies detailed instructions or domain rules the agent reads when the skill applies.

**Example:** A guide describing how to structure a Leaflet map MicroSim.

#### Skill Template Asset

A starter file stored with an AI skill that the agent copies and fills in when generating output.

**Example:** A template main.html with placeholders for title and script name.

#### Skills Development

The process of learning to create and use AI skill files for specialized code generation tasks.

**Example:** Creating a custom Claude skill for generating Chart.js visualizations.

#### Slider Control

An interactive element allowing users to select values within a continuous range by dragging a handle.

**Example:** A horizontal slider adjusting animation speed from 1 to 60 frames per second.

#### Slider Handle

An instrumentation helper attached to a slider that reports its changes to the runtime as evidence.

**Example:** A handle that records the final slider value after the learner releases it.

#### Slider-Driven Plot

A plot whose curve or points update as the learner moves one or more sliders that set parameter values.

**Example:** A sine wave that changes amplitude as an amplitude slider moves.

#### Slipping

An incorrect response produced despite mastery, caused by error or inattention.

**Example:** A learner who understands a concept mis-clicking an answer.

*See also:* BKT Slip Parameter

#### Smallest Patch Rule

A repair approach that changes the least code necessary to fix a defect, reducing the chance of new problems.

**Example:** Adjusting a single margin constant rather than rewriting the layout.

#### Social Image Preview

The thumbnail image displayed when a link is shared on social media or messaging platforms.

**Example:** A screenshot of a MicroSim shown when sharing its URL on Twitter.

#### Soft Correctness Mapping

The conversion of non-binary evidence, such as partial credit or interaction quality, into a fractional correctness value for use in a model.

**Example:** Treating a half-correct sort as 0.5 correctness.

#### Sorter MicroSim

An interactive simulation at Bloom's Remember level where users categorize or order items.

**Example:** A drag-and-drop activity sorting historical events into chronological order.

#### Sorting Quiz

A quiz format in which learners assign items to categories rather than choosing from listed answers.

**Example:** Sorting eight scenarios into three feedback-loop types.

#### Source Discovery

The step of locating candidate authoritative sources that could support each planned claim.

**Example:** Finding an agency's published dataset for each statistic.

#### Spec Extraction

The step of reading chapter text to find proposed MicroSims and pull out each one's details into a structured specification.

**Example:** Extracting title, type, and objective from a chapter's diagram placeholders.

#### Specialized MicroSims

Simulations designed for specific subject domains requiring custom visualization techniques.

**Example:** A 3D molecule viewer for chemistry or a circuit simulator for electronics.

#### Specification Block

A structured section of text in a prompt or document that states the requirements for one MicroSim in a consistent, machine-readable form.

**Example:** A block listing title, type, learning objective, controls, and data.

#### Specification JSON

A JSON file that records the structured specification for one or more MicroSims in a form programs can read.

**Example:** A file with fields for type, title, controls, and data.

#### Speed Control

An interface element allowing users to adjust the rate of animation or simulation progression.

**Example:** A slider that modifies the frameRate() or step size in physics calculations.

#### Stability Across Sessions

The degree to which predictions for a learner stay consistent over repeated sessions when underlying knowledge has not changed.

**Example:** Mastery estimates changing little between two similar sessions.

#### Standard Layout

The conventional MicroSim structure with a drawing region above and control region below.

**Example:** A 400×400 pixel drawing area with a 50-pixel control strip at the bottom.

#### Standards Hardening

A pass that revises MicroSims to conform to updated project standards, such as metadata fields, layout rules, or instrumentation conventions.

**Example:** Adding a missing description and iframe height convention across an existing collection.

#### Star Rating Table

A comparison table in which attribute values are shown as star ratings, giving a quick visual ranking.

**Example:** Libraries rated from one to five stars for ease of use.

#### Start Button

An interactive control that initiates or resumes simulation execution from a paused state.

**Example:** A button labeled "Start" that sets `isRunning = true;`

#### State Management

The tracking and updating of application status, modes, and variable values throughout execution.

**Example:** Using a `mode` variable with values like "RUNNING", "PAUSED", and "RESET".

#### Statement Log Viewer

A tool that displays the xAPI statements a MicroSim emits so authors can inspect them during development.

**Example:** A panel listing each statement as the author moves a slider.

#### Statement Size Measurement

The measurement of the byte size of xAPI statements, used to plan storage and bandwidth.

**Example:** Finding that a typical statement occupies about one kilobyte.

#### Statement Validation

The checking of an incoming xAPI statement for required fields, correct types, and conformance to rules before it is stored.

**Example:** Rejecting a statement with an invalid verb IRI.

#### Statement Volume Estimate

A calculation of how many xAPI statements a deployment produces over a period, based on users, sessions, and interactions.

**Example:** Multiplying learners by sessions by statements per session.

#### Static Image Exception

A documented case in which a static image is chosen over an interactive MicroSim because interaction adds no instructional value.

**Example:** A photograph of a historical artifact used as-is in a chapter.

#### Status Lifecycle

The defined sequence of states a MicroSim passes through during production, such as specified, scaffolded, generated, validated, and instrumented.

**Example:** A sim moving from "scaffolded" to "generated" after files are created.

#### Stop Button

An interactive control that halts simulation execution completely.

**Example:** A button that stops animation and prevents further state changes.

#### Storage Meter

An indicator that shows how much of the allotted browser storage is used.

**Example:** A bar showing 40 percent of the budget consumed.

#### Stream Processor

A component that reads events from a stream, transforms or aggregates them, and writes results to other stores.

**Example:** A processor that updates concept summaries as new answers arrive.

#### stroke()

A p5.js function that sets the outline color for subsequently drawn shapes.

**Example:** `stroke('black');` gives all following shapes black outlines.

#### Student Privacy

The protection of students' personal information from unauthorized collection, use, and disclosure.

**Example:** Using pseudonymous identifiers rather than names in statements.

#### style.css File

A CSS file containing styling rules to ensure MicroSims display cleanly in iframes.

**Example:** CSS setting `border: none;` and `margin: 0;` for seamless embedding.

#### Sub-Activity Fragment

A suffix appended to an activity IRI to identify a component within a MicroSim, such as a slider or a question.

**Example:** A fragment naming a particular question in a quiz MicroSim.

#### Subject Metadata

Dublin Core field listing topic areas and keywords describing resource content.

**Example:** `subject: ["Physics", "Kinematics", "Projectile Motion"]`

#### Summary Vertex

A graph vertex holding an aggregated summary of a learner's evidence for a concept or session rather than individual events.

**Example:** A vertex storing counts of correct and incorrect answers for one concept.

#### Suppression Threshold

A minimum group size below which aggregate results are hidden to reduce the risk of identifying individual learners.

**Example:** Not showing class averages for groups smaller than a set number.

#### Sync Cycle

One complete round of comparing, uploading, and downloading data between a device and shared storage.

**Example:** A cycle run when the learner opens the page and again when it closes.

#### System Context

A high-level view of a system showing its boundaries and the users and external systems it interacts with.

**Example:** A diagram showing learners, teachers, MicroSims, and the LRS.

#### System Dynamics

A method for modeling complex systems through stocks, flows, and feedback loops to study behavior over time.

**Example:** Modeling student backlog as a stock with inflow from assignments and outflow from completions.

#### System Prompt

Instructions given to a language model at the start of a session that set its role, rules, and behavior for all later messages.

**Example:** A system prompt telling an agent to always use width-responsive layout.

#### Taxonomy Pyramid

A visual representation of Bloom's Taxonomy showing hierarchical levels from Remember to Create.

**Example:** A triangular diagram with Remember at the base and Create at the apex.

#### Teacher Dashboard

A view for instructors that presents class-level and learner-level evidence and mastery estimates.

**Example:** A page showing which concepts most of a class has mastered.

#### Teaching Mode

A MicroSim state in which an instructor demonstrates it, so interactions are treated differently from learner evidence.

**Example:** Suppressing logging while a teacher presents the simulation to a class.

#### Technical Metadata

Descriptive fields about how a MicroSim is built and run, such as framework, dimensions, dependencies, and file list.

**Example:** A field naming the library and its version.

#### Text Editor

A software application for writing and editing plain text files including code.

**Example:** VS Code, Sublime Text, or the p5.js web editor for writing MicroSim code.

#### Text Overflow

A defect in which text extends beyond its container or canvas and is clipped or overlaps other elements.

**Example:** A long label running off the right edge of the chart.

#### Text Rendering

The drawing of labels and messages on a canvas with controlled font, size, alignment, and position.

**Example:** Displaying the current slider value beside its control.

#### text()

A p5.js function that displays text strings at specified canvas coordinates.

**Example:** `text("Speed: " + speed, 20, 430);` displays a label with current value.

#### Text-Free Image Rule

A convention that base images for overlays contain no embedded text, because labels are added by code and model-drawn text is often wrong.

**Example:** Generating a diagram with blank label areas, then adding text in HTML.

#### textAlign()

A p5.js function that sets horizontal and vertical alignment for text rendering.

**Example:** `textAlign(CENTER, TOP);` centers text horizontally and aligns to top vertically.

#### textSize()

A p5.js function that sets the font size in pixels for subsequently drawn text.

**Example:** `textSize(16);` sets text to 16-pixel height for readability.

#### Threats to Validity

Factors that weaken confidence that a study's conclusions are correct or generalize beyond its sample.

**Example:** A sample from one school limiting generalization.

#### Timeline Date Handling

The conventions for parsing, formatting, and ordering dates in timeline data, including handling of partial or approximate dates.

**Example:** Using ISO 8601 date strings for item start values.

#### Timeline Event Item

A single entry on a timeline, defined by a label and a date or date range, and optionally a group and description.

**Example:** An item for "First xAPI specification release" placed at its date.

#### Timeline Grouping

The organization of timeline items into labeled rows or categories so related events are displayed together.

**Example:** Separate rows for hardware, software, and standards events.

#### Timeline Visualization

A graphical representation showing events arranged along a temporal axis.

**Example:** A vis-timeline showing key events in computer history with zoom and pan.

#### Timelines

Interactive visualizations displaying sequences of events along a time axis.

**Example:** A MicroSim showing the chronological development of programming languages.

#### Title Metadata

Dublin Core field containing the name by which a resource is formally known.

**Example:** `title: "Bouncing Ball Physics Simulation"`

#### Token Cost

The expense of a language model call measured in input and output tokens, which are the units of text the model processes.

**Example:** A long specification adds input tokens to every generation request.

*See also:* Generation Cost

#### Token Limits

Maximum number of tokens (word pieces) that can be processed in a single AI interaction.

**Example:** Breaking large code files into smaller segments to fit within context limits.

#### ToolTips

Small informational popups that appear when hovering over interface elements.

**Example:** Hovering over a slider reveals "Adjust animation speed (1-60 fps)".

#### Touch Events

User interactions detected on touchscreen devices including taps, swipes, and pinches.

**Example:** Supporting touchStarted() alongside mousePressed() for mobile compatibility.

#### Transfer Item

An assessment item that asks a learner to apply a concept in a new context different from the practiced one.

**Example:** Applying balancing-loop reasoning to a scenario not shown in the MicroSim.

#### translate() Function

A p5.js function that shifts the coordinate system origin to a new position.

**Example:** `translate(200, 100);` moves origin so (0,0) is now at previous (200,100).

#### Trustworthy Prediction

A mastery prediction whose accuracy, calibration, and limits are measured, documented, and communicated, so users can rely on it appropriately.

**Example:** A prediction reported with its calibration results and known limitations.

#### Twelve Core Functions

The set of twelve functions, defined in this book, that the full LRS provides across ingestion, storage, analysis, and administration.

The list gives a checklist for comparing the full LRS with the lite design.

#### Two-Column Layout

A MicroSim design with the canvas divided into two side-by-side areas for simulation and data display.

**Example:** Animation on the left, real-time graph of variables on the right.

#### Type Routing

The process of selecting which MicroSim generator type best fits a learning objective and its content.

**Example:** Routing "show change over time" to a timeline type and "show feedback dynamics" to a causal loop type.

*See also:* Routing Rubric

#### Understand Level

The second level of Bloom's Taxonomy where learners explain ideas and interpret meaning.

**Example:** Explaining how the draw() loop creates animation through repeated updates.

#### Universal Design for Learning

A framework for designing instruction with multiple means of engagement, representation, and action and expression so it serves diverse learners.

**Example:** Offering both a visual diagram and a text description.

#### Universal Design Learning

An educational framework providing multiple means of engagement, representation, and expression.

**Example:** Offering text, audio, and interactive options for learning the same concept.

#### updateCanvasSize()

A custom function that recalculates canvas dimensions based on current container size.

**Example:** Reading container width and adjusting slider positions during window resize.

#### Usability Studies

Research methods evaluating how easily users can accomplish tasks with an interface.

**Example:** Observing students using a MicroSim to identify confusing controls.

#### Usability Testing

The observation of representative users performing tasks with a product to find difficulties and assess ease of use.

**Example:** Watching teachers try to find and adjust a MicroSim's controls.

#### User Interaction

Actions taken by users to engage with a simulation, such as clicking, dragging, or adjusting controls.

**Example:** Moving a slider to change gravity and observing the effect on ball motion.

#### User Testing

The practice of having actual users try a product to identify issues and gather feedback.

**Example:** Having students use a MicroSim and report confusion or bugs.

#### Validation Script

A program that automatically checks a MicroSim's files and structure against defined requirements and reports problems.

**Example:** A script that flags a missing metadata.json or an absent iframe height.

#### Variables

Named storage locations that hold values which can be changed during program execution.

**Example:** `let ballX = 200;` creates a variable storing the ball's horizontal position.

#### Vectors

Quantities with magnitude and direction represented as coordinate sets, used to model position, velocity, and force in simulations.

**Example:** A velocity vector added to a position vector each frame.

#### Venn Diagram

A diagram of overlapping closed shapes representing sets, in which overlaps show shared elements.

**Example:** Two circles showing skills common to teachers and developers.

#### Venn Diagram Type

The MicroSim type that displays overlapping sets with labeled regions so learners can examine shared and distinct members.

**Example:** A two-circle diagram comparing two teaching methods, with hover text on each region.

#### Venn Diagrams

Visualizations using overlapping circles to show relationships between sets.

**Example:** A diagram showing overlapping skills needed for front-end, back-end, and full-stack development.

#### Verb

The part of an xAPI statement that names the action performed, identified by an IRI and a display label.

**Example:** The verb "answered" for submitting a response.

#### Verbatim Text Prompt

An image-generation prompt that quotes the exact text to appear in an image, used to reduce spelling and wording errors.

**Example:** A prompt specifying the exact title words to render on a poster banner.

#### Verification Report

A document that lists each claim, its source, the check performed, and the result, providing an audit trail.

**Example:** A table with claim, source link, verified value, and status.

#### Verified Adapters

Library adapters that have been tested to confirm they emit correct xAPI statements for their library's events.

**Example:** An adapter checked against a test suite for its statement structure.

#### Verified Poster Type

The MicroSim type that presents a statistics poster in which every numeric claim was checked against a cited source before rendering.

**Example:** A poster of energy statistics with each figure linked to its source.

#### Version Control

Systems that track changes to files over time, enabling collaboration and history review.

**Example:** Using Git to maintain history of MicroSim development and coordinate team work.

#### Version Metadata

Metadata that records a MicroSim's version number, revision date, and change history.

**Example:** Version 1.2 dated to its last update.

#### Vis-network JS Library

An alternative name for vis-network, the JavaScript library for network visualizations.

See also: vis-network Library

#### vis-network Library

A JavaScript library for creating interactive network graphs with nodes, edges, and physics simulation.

**Example:** Visualizing concept dependencies in a learning graph with draggable nodes.

#### vis-network Type

The MicroSim type that uses the vis-network library to draw interactive node-and-edge graphs with dragging, selection, and layout options.

**Example:** A concept map where clicking a node shows its definition.

#### Vis-Timeline

The timeline component of the vis.js library for creating interactive temporal visualizations.

**Example:** Creating a zoomable historical timeline with event grouping.

#### vis-timeline Library

A JavaScript library that renders interactive timelines with items on a zoomable, scrollable time axis.

**Example:** Loading vis-timeline to show project milestones across years.

#### vis-timeline Type

The MicroSim type that uses the vis-timeline library to display dated events and periods on a scrollable, zoomable time axis.

**Example:** A timeline of milestones in educational technology.

#### Vision-Based Review

A layout review in which a multimodal AI model examines screenshots against a checklist and reports visual defects.

**Example:** Sending a screenshot to a model that notes a clipped label.

#### Visual Checklist

A list of specific visual conditions, such as no clipped text and visible controls, used to evaluate screenshots consistently.

**Example:** A checklist item asking whether all slider labels are readable.

#### WCAG Guidelines

Web Content Accessibility Guidelines providing standards for making web content accessible to people with disabilities.

**Example:** Meeting WCAG 2.1 AA contrast requirements for MicroSim text and controls.

#### Web Browser

A software application that retrieves and displays web content, running JavaScript for interactivity.

**Example:** Chrome, Firefox, Safari, or Edge displaying and running MicroSim code.

#### Web-Based Simulation

An interactive educational tool that runs in a web browser without requiring software installation.

**Example:** A p5.js MicroSim accessible through any modern browser via URL.

#### WebGL

Web Graphics Library enabling high-performance 2D and 3D graphics rendering in browsers.

**Example:** Using p5.js WEBGL mode for 3D molecule visualizations.

#### Width Responsiveness

The property of a layout adapting its horizontal size to the width of its container while keeping content usable.

**Example:** A MicroSim canvas that resizes from 800 to 360 pixels wide inside a phone-width column.

#### windowResized Handler

A p5.js function called when the browser window changes size, used to recompute container width and resize the canvas.

**Example:** A handler that updates canvas size and redraws.

#### windowResized()

A p5.js event function that executes when the browser window dimensions change.

**Example:** Calling `resizeCanvas()` and updating element positions in windowResized().

#### Workflow

A sequence of steps and decisions that define how a process progresses from start to completion.

**Example:** The workflow for creating a MicroSim: design, code, test, document, deploy.

#### Working in Teams

Collaborative development practices for groups creating MicroSim projects together.

**Example:** Using Git branches, pull requests, and code reviews for team MicroSim development.

#### xAPI

Experience API (Tin Can), a specification for tracking learning activities and storing them in a Learning Record Store.

**Example:** Sending xAPI statements when students interact with MicroSim controls.

#### xAPI Quality Check

An automated check that verifies emitted statements have required fields, valid identifiers, and expected structure.

**Example:** Flagging a statement missing its concept identifier.

#### xAPI Statement

A JSON record, following the Experience API specification, that describes a learning experience as an actor performing a verb on an object, with optional result and context.

**Example:** A statement recording that a learner answered question three correctly.

*See also:* Actor, Verb, Object

#### YAML Frontmatter

Metadata in YAML format at the beginning of markdown files, delimited by triple dashes.

**Example:** Title, description, and quality_score fields at the top of index.md.

#### Zone Summary and Facts

The short description and supporting facts attached to each interactive zone of a poster and shown when the zone is selected.

**Example:** A summary sentence plus three bullet facts for a zone.

*This glossary was generated from the course concept list following ISO 11179 metadata registry standards.*
