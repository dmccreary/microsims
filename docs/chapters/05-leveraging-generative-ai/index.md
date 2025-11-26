---
title: Leveraging Generative AI
description: Master the art of partnering with LLMs to accelerate MicroSim development
generated_by: claude skill chapter-content-generator
date: 2025-01-25 15:45:00
version: 0.03
---

# Leveraging Generative AI

## Summary

This chapter explores how to effectively use generative AI tools to accelerate MicroSim development. You will learn about large language models including ChatGPT and Claude, and develop prompt engineering skills for generating simulation code. The chapter covers iterative refinement techniques, AI-assisted debugging, and important concepts like token limits and context windows. You will also learn about AI limitations and hallucinations to use these tools responsibly, plus advanced techniques using rules files and skills development.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Generative AI
2. Large Language Models
3. ChatGPT
4. Claude
5. AI Prompting
6. Prompt Engineering
7. Iterative Refinement
8. AI Code Generation
9. Code Debugging with AI
10. Token Limits
11. Context Window
12. AI Hallucinations
13. AI Limitations
14. Rules Files
15. Skills Development
16. Claude Code

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Educational MicroSims](../01-intro-to-educational-microsims/index.md)
- [Chapter 2: Web Development Essentials](../02-web-development-essentials/index.md)

---

## Meet Your Development Partner

Welcome to one of the most transformative chapters in this course. Here, you'll meet the partner who will help you build MicroSims faster than you ever imagined possible: the **Large Language Model (LLM)**.

But here's the crucial insight that separates successful AI-assisted developers from frustrated ones: **an LLM is a partner, not a replacement**. Like any good partnership, success depends on understanding each other's strengths and limitations, communicating clearly, and developing shared patterns of collaboration.

Your task in this chapter is to learn how to **bring out the best in your AI partner**—to ask questions that elicit brilliant responses, to provide context that enables creative solutions, and to guide iterations that refine rough drafts into polished simulations.

!!! tip "The Partnership Mindset"
    Think of working with an LLM like collaborating with a brilliant but literal-minded colleague who has read millions of code examples but has never actually run a program. They can suggest solutions you'd never think of, but they need your judgment to evaluate what actually works.

## What is Generative AI?

**Generative AI** refers to artificial intelligence systems that can create new content—text, images, code, music—rather than simply analyzing or classifying existing data. These systems learn patterns from massive datasets and use those patterns to generate novel outputs.

For MicroSim development, generative AI offers remarkable capabilities:

- Generate complete p5.js sketches from natural language descriptions
- Suggest solutions to visual layout problems
- Debug code by analyzing error messages
- Refactor existing simulations to add new features
- Explain complex code in plain language

The generative AI systems most useful for coding are **Large Language Models (LLMs)**—neural networks trained on vast amounts of text, including billions of lines of source code.

## Understanding Large Language Models

**Large Language Models** are the engines behind tools like ChatGPT and Claude. They work by predicting what text should come next, given some input context. This simple mechanism—next-token prediction—gives rise to surprisingly sophisticated behaviors.

### How LLMs Work (Simplified)

When you type a prompt, the LLM:

1. Converts your text into numerical tokens
2. Processes tokens through billions of neural network parameters
3. Calculates probabilities for what token should come next
4. Samples from those probabilities to generate output
5. Repeats until the response is complete

This process happens incredibly fast—generating hundreds of tokens per second.

#### Diagram: LLM Token Processing Flow

<details markdown="1">
    <summary>LLM Token Processing Visualization</summary>
    Type: diagram

    Purpose: Show how text flows through an LLM from input to output (Bloom: Understand)

    Components to show:
    - Input text box: "Create a bouncing ball"
    - Tokenizer: Breaking text into tokens ["Create", "a", "bouncing", "ball"]
    - Neural network (stylized): Large box with interconnected nodes
    - Probability distribution: Bar chart showing next-token probabilities
    - Output generation: Tokens appearing one by one
    - Final output: Complete code snippet

    Flow direction: Left to right

    Visual style:
    - Clean, modern diagram
    - Animated token flow (when implemented as MicroSim)
    - Color coding: input (blue), processing (purple), output (green)

    Labels:
    - "Your prompt" on input
    - "Billions of parameters" on neural network
    - "Token probabilities" on distribution
    - "Generated code" on output

    Implementation: Mermaid.js or static SVG
</details>

### Key LLM Characteristics

| Characteristic | Implication for MicroSim Development |
|---------------|-------------------------------------|
| Pattern-based | Generates code similar to training examples |
| Probabilistic | Same prompt can produce different outputs |
| Context-dependent | Quality depends heavily on input quality |
| No execution | Cannot run or test the code it generates |
| No memory | Each conversation starts fresh (mostly) |

## ChatGPT vs Claude: Choosing Your Partner

The two leading LLMs for code generation are **ChatGPT** (from OpenAI) and **Claude** (from Anthropic). Both are excellent for MicroSim development, with some differences in style and capability.

### ChatGPT

ChatGPT, powered by GPT-4 and its variants, excels at:

- Broad knowledge across many programming languages
- Strong JavaScript and p5.js understanding
- Creative problem-solving approaches
- Wide availability (free tier available)

### Claude

Claude, created by Anthropic, offers:

- Excellent at following detailed instructions
- Strong reasoning about complex requirements
- Thoughtful about edge cases and potential issues
- Extended context windows for larger projects
- Claude Code for integrated development

### Which Should You Use?

For MicroSim development, both work well. This course uses Claude examples because:

- Claude Code integrates directly with your development environment
- Extended context windows handle larger simulations
- Strong instruction-following suits structured MicroSim patterns
- Consistent formatting for educational content

!!! info "Tool Agnostic Skills"
    The prompt engineering skills you learn here apply to any LLM. Once you master communicating with one, you can easily adapt to others.

## The Art of AI Prompting

**AI prompting** is the skill of crafting inputs that elicit useful outputs from an LLM. It's part communication, part psychology, and part technical specification.

### The Anatomy of an Effective Prompt

A good prompt for MicroSim development typically includes:

1. **Context**: What kind of simulation are you building?
2. **Specification**: What exactly should it do?
3. **Constraints**: What patterns or standards must it follow?
4. **Examples**: What does good output look like?
5. **Format**: How should the response be structured?

### Basic Prompting Example

Here's a simple prompt and its improvement:

**Weak prompt:**
> Make a bouncing ball

**Strong prompt:**
> Create a p5.js sketch with a ball that bounces within the canvas boundaries.
> Use these specifications:
> - Canvas size: 400x400 pixels
> - Ball diameter: 40 pixels
> - Ball color: Blue (#4488FF)
> - Background: Alice blue (240, 248, 255)
> - Include velocity variables for x and y movement
> - Reverse direction when hitting any wall
> - Add a slider to control ball speed (range 1-10, default 3)

The second prompt provides specific, actionable details that dramatically improve output quality.

## Prompt Engineering: From Art to Science

**Prompt engineering** takes basic prompting to a systematic level. It's the discipline of designing prompts that reliably produce high-quality outputs.

### Prompt Engineering Techniques

| Technique | Description | Example Use |
|-----------|-------------|-------------|
| **Few-shot learning** | Provide examples of desired output | Show 2-3 similar MicroSims |
| **Chain of thought** | Ask for step-by-step reasoning | "First, outline the approach..." |
| **Role prompting** | Assign a persona to the AI | "As a p5.js expert..." |
| **Constraints first** | State limitations upfront | "Using only these functions..." |
| **Structured output** | Request specific format | "Return as: 1) Code 2) Explanation" |

### The MicroSim Prompt Template

For consistent results, use this template when requesting new MicroSims:

```markdown
Create a p5.js MicroSim with these specifications:

**Purpose:** [What concept does this teach?]

**Canvas Layout:**
- Drawing area: [width]x[height] pixels, background: [color]
- Control area: [height] pixels, background: white

**Visual Elements:**
- [List each shape, label, and visual component]

**Interactive Controls:**
- [List each slider, button, or input with ranges]

**Behavior:**
- [Describe what happens when controls change]
- [Describe any animation or physics]

**Code Standards:**
- Use standard variable names (canvasWidth, drawHeight, etc.)
- Include describe() for accessibility
- Position controls at bottom of canvas
```

#### Diagram: Prompt Engineering Workflow

<details markdown="1">
    <summary>Prompt Engineering Workflow</summary>
    Type: workflow

    Purpose: Show the iterative process of developing effective prompts (Bloom: Apply)

    Visual style: Flowchart with decision points and feedback loops

    Steps:
    1. Start: "Identify MicroSim Goal"
       Hover text: "What concept should this simulation teach?"

    2. Process: "Draft Initial Prompt"
       Hover text: "Write a first version with basic requirements"

    3. Process: "Submit to LLM"
       Hover text: "Send prompt to ChatGPT or Claude"

    4. Process: "Evaluate Output"
       Hover text: "Does the generated code meet requirements?"

    5. Decision: "Output Acceptable?"
       Hover text: "Check functionality, appearance, and code quality"

    6a. If No → Process: "Identify Gaps"
        Hover text: "What's missing or incorrect?"

    7a. Process: "Refine Prompt"
        Hover text: "Add specifics, examples, or constraints"
        → Return to step 3

    6b. If Yes → Process: "Test in Browser"
        Hover text: "Run the code and verify behavior"

    8. Decision: "Works Correctly?"

    9a. If No → Process: "Debug with AI"
        Hover text: "Share error messages with LLM for fixes"
        → Return to step 3

    9b. If Yes → End: "MicroSim Complete"

    Color coding:
    - Blue: Input/planning steps
    - Yellow: Decision points
    - Green: Success states
    - Orange: Iteration/refinement steps

    Annotations:
    - "Most MicroSims require 2-4 iterations" near feedback loop
    - "Save successful prompts as templates" near completion

    Implementation: Mermaid.js flowchart
</details>

## Iterative Refinement: The Key to Quality

**Iterative refinement** is the process of improving AI-generated code through successive conversations. Rarely does an LLM produce perfect code on the first try—but it can get there quickly with good feedback.

### The Refinement Cycle

1. **Generate**: Get initial code from your prompt
2. **Test**: Run the code and observe behavior
3. **Identify**: Note what's wrong or missing
4. **Specify**: Describe the issue precisely to the AI
5. **Regenerate**: Get updated code
6. **Repeat**: Continue until satisfied

### Effective Refinement Prompts

When refining, be specific about what needs to change:

**Vague (less effective):**
> "The slider isn't working right"

**Specific (more effective):**
> "The speed slider (line 45) currently ranges from 0-100 but the ball moves too fast even at low values. Please change the range to 1-10 and multiply the slider value by 0.5 when applying it to velocity."

### Before and After Example

**First attempt output (problems):**
```javascript
function setup() {
  createCanvas(400, 400);
  slider = createSlider(0, 100, 50);  // Range too large
}

function draw() {
  background(220);
  x += slider.value();  // Direct value, too fast!
  circle(x, 200, 40);
}
```

**After refinement prompt:**
> "The ball moves too fast. Please: 1) Change slider range to 1-10, 2) Multiply slider value by 0.3 for smoother movement, 3) Add wall bouncing"

**Refined output:**
```javascript
let x = 200;
let direction = 1;
let speedSlider;

function setup() {
  createCanvas(400, 400);
  speedSlider = createSlider(1, 10, 3);
  speedSlider.position(10, 410);
}

function draw() {
  background(240, 248, 255);

  let speed = speedSlider.value() * 0.3;
  x += speed * direction;

  // Wall bouncing
  if (x > width - 20 || x < 20) {
    direction *= -1;
  }

  fill(100, 150, 255);
  circle(x, 200, 40);
}
```

## AI Code Generation: What LLMs Do Well

**AI code generation** is remarkably capable for MicroSim development. Here's where your AI partner truly shines:

### Strengths of AI Code Generation

- **Boilerplate generation**: Setup code, standard patterns, repetitive structures
- **API translation**: Converting descriptions to correct function calls
- **Pattern application**: Using established coding patterns consistently
- **Syntax accuracy**: Generating syntactically correct code
- **Variation creation**: Making similar versions of existing code
- **Documentation**: Adding comments and explanations

### Example: Generating a Complete MicroSim

Given a detailed prompt, an LLM can generate a complete, working MicroSim in seconds:

```javascript
// Generated from prompt: "Create a gravity simulation with
// adjustable gravity strength and ball mass"

let ball = { x: 200, y: 50, vy: 0, mass: 1 };
let gravitySlider, massSlider;
let drawHeight = 350;
let controlHeight = 50;

function setup() {
  createCanvas(400, drawHeight + controlHeight);

  gravitySlider = createSlider(0.1, 2, 0.5, 0.1);
  gravitySlider.position(100, drawHeight + 15);

  massSlider = createSlider(0.5, 3, 1, 0.1);
  massSlider.position(300, drawHeight + 15);

  describe('Gravity simulation with adjustable parameters');
}

function draw() {
  // Drawing area
  background(240, 248, 255);

  // Control area
  fill(255);
  noStroke();
  rect(0, drawHeight, width, controlHeight);

  // Physics
  let gravity = gravitySlider.value();
  ball.vy += gravity * ball.mass;
  ball.y += ball.vy;

  // Ground collision
  if (ball.y > drawHeight - 20) {
    ball.y = drawHeight - 20;
    ball.vy *= -0.8;  // Energy loss on bounce
  }

  // Draw ball (size based on mass)
  fill(100, 100, 255);
  stroke(50, 50, 200);
  strokeWeight(2);
  let diameter = 20 + massSlider.value() * 15;
  circle(ball.x, ball.y, diameter);

  // Labels
  fill(0);
  noStroke();
  textSize(12);
  text("Gravity: " + gravity.toFixed(1), 10, drawHeight + 25);
  text("Mass: " + massSlider.value().toFixed(1), 220, drawHeight + 25);
}

function mousePressed() {
  if (mouseY < drawHeight) {
    ball.y = 50;
    ball.vy = 0;
  }
}
```

This complete, functional MicroSim was generated from a single well-crafted prompt!

## Code Debugging with AI: Your Error-Solving Partner

**Code debugging with AI** transforms frustrating error messages into learning opportunities. When your code doesn't work, your AI partner can help diagnose and fix the problem.

### How to Debug with AI

1. **Copy the error message** exactly as shown
2. **Include relevant code** (the function with the error)
3. **Describe expected vs actual behavior**
4. **Ask for explanation**, not just a fix

### Debugging Prompt Template

```markdown
I'm getting this error in my p5.js MicroSim:

**Error message:**
[Paste exact error]

**Relevant code:**
```javascript
[Paste the problematic section]
```

**Expected behavior:**
[What should happen]

**Actual behavior:**
[What actually happens]

Please explain why this error occurs and how to fix it.
```

### Common MicroSim Errors AI Can Fix

| Error Type | Example | AI Solution |
|-----------|---------|-------------|
| Undefined variable | `slider is not defined` | Variable declared inside function but used globally |
| Type error | `Cannot read property of undefined` | Accessing object before initialization |
| Positioning | Shapes appearing off-canvas | Coordinate calculation errors |
| Animation | Shapes not moving | Forgetting to update position in draw() |
| Slider issues | Values not applying | Using wrong variable name or missing `.value()` |

## Understanding Token Limits

**Token limits** are constraints on how much text an LLM can process at once. Understanding them helps you work effectively within the system's boundaries.

### What is a Token?

A **token** is roughly 4 characters or 0.75 words on average. However, tokenization varies:

- Common words are often single tokens
- Code symbols may be individual tokens
- Unusual words may be split into multiple tokens

### Token Limits by Model

| Model | Input Limit | Output Limit |
|-------|-------------|--------------|
| GPT-4 | ~8,000-128,000 tokens | ~4,000 tokens |
| GPT-4 Turbo | ~128,000 tokens | ~4,000 tokens |
| Claude 3 | ~200,000 tokens | ~4,000 tokens |
| Claude 3.5 | ~200,000 tokens | ~8,000 tokens |

### Practical Implications

For MicroSim development:

- A typical MicroSim is 100-300 tokens (~75-225 lines)
- Your prompt + conversation history counts against input limit
- Very long conversations may need to be restarted
- Large reference files can quickly consume tokens

!!! warning "Token Management"
    If an LLM suddenly "forgets" earlier context or produces degraded output, you may have exceeded effective context limits. Start a fresh conversation with a clear prompt.

## The Context Window: Your Working Memory

The **context window** is the total amount of text (in tokens) that an LLM can "see" at once—your prompt, the conversation history, and any included files.

#### Diagram: Context Window Visualization MicroSim

<details markdown="1">
    <summary>Context Window Visualization</summary>
    Type: microsim

    Learning objective: Help students visualize how context window fills up during a conversation (Bloom: Understand, Analyze)

    Canvas layout:
    - Drawing area: 500x350 pixels
    - Control area: 50 pixels

    Visual elements:
    - Large container representing context window (horizontal bar)
    - Colored segments showing:
      - System prompt (gray, fixed at left)
      - User messages (blue blocks)
      - AI responses (green blocks)
      - Current prompt (yellow, at right)
    - Percentage filled indicator
    - Token count labels
    - "Danger zone" marking near capacity (red gradient)

    Interactive controls:
    - Button: "Add User Message" (adds ~50 token blue block)
    - Button: "Add AI Response" (adds ~200 token green block)
    - Button: "Clear Conversation" (reset to just system prompt)
    - Slider: "Window Size" (switch between 8K, 32K, 100K, 200K)

    Behavior:
    - Each button click adds a block to the context visualization
    - Bar fills from left to right
    - When approaching limit, warning appears
    - When exceeded, oldest messages fade/compress
    - Shows how conversation history accumulates

    Educational annotations:
    - "System prompt always present" label
    - "Older messages may be summarized" when near capacity
    - Current utilization percentage

    Color scheme:
    - System: gray (#666)
    - User messages: blue (#4488FF)
    - AI responses: green (#44AA66)
    - Current prompt: yellow (#FFCC00)
    - Danger zone: red gradient

    Implementation: p5.js with button callbacks
</details>

### Managing Context Effectively

Strategies for working within context limits:

- **Start fresh** for new topics rather than continuing long conversations
- **Be concise** in your prompts—remove unnecessary words
- **Reference, don't repeat**—say "using the same pattern as before" instead of re-explaining
- **Chunk large tasks** into smaller, focused conversations
- **Use files wisely**—only include code sections you're actively working on

## AI Hallucinations: When Your Partner Makes Things Up

**AI hallucinations** occur when an LLM generates confident-sounding but incorrect information. For code generation, this might mean:

- Inventing functions that don't exist
- Using incorrect syntax for a library
- Claiming features work in ways they don't
- Fabricating API methods or parameters

### Common p5.js Hallucinations

| Hallucinated | Reality |
|-------------|---------|
| `createButton("text", x, y)` | `createButton("text")` then `button.position(x, y)` |
| `circle(x, y, radius)` | `circle(x, y, diameter)` — it's diameter, not radius! |
| `setBackground()` | Should be `background()` |
| `slider.onChange(callback)` | Use `slider.input(callback)` or check in draw() |
| `canvas.clear()` | Use `clear()` or `background()` |

### Detecting Hallucinations

1. **Test every code snippet** before trusting it
2. **Verify function signatures** against official documentation
3. **Be skeptical of unusual syntax** you haven't seen before
4. **Cross-reference** with p5.js reference documentation
5. **If it seems too easy**, it might be hallucinated

!!! danger "Always Verify"
    Never assume AI-generated code is correct. The most dangerous hallucinations are subtle—code that almost works but has hidden bugs. Test thoroughly!

## AI Limitations: Knowing What Your Partner Can't Do

Understanding **AI limitations** helps you set realistic expectations and know when to rely on your own judgment.

### What LLMs Cannot Do

- **Execute code**: They predict what code should look like, but can't run it
- **See output**: They can't view your canvas or see visual bugs
- **Remember perfectly**: Long conversations may have inconsistencies
- **Access the internet** (usually): They work from training data, not live information
- **Guarantee correctness**: All output needs human verification
- **Understand intent**: They respond to what you said, not what you meant

### The "World Model" Problem

LLMs lack a true understanding of how visual interfaces work. They can't "see" that:

- A label overlaps a button
- Colors clash visually
- Animations are too fast or slow
- Layout feels unbalanced

**You** must be the visual judge. Run the code, evaluate the appearance, and provide specific feedback.

### Limitations in MicroSim Development

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| No visual feedback | Can't see layout problems | Describe issues precisely |
| No execution | Can't catch runtime errors | Test and report errors back |
| Training cutoff | May not know newest p5.js features | Provide API documentation |
| Context limits | May lose track in long conversations | Start fresh when needed |
| Probabilistic output | May give different answers | Use consistent prompting |

## Rules Files: Teaching Your Partner Your Preferences

**Rules files** are documents that provide consistent context to an LLM about your project's standards, patterns, and preferences. They're like an instruction manual for your AI partner.

### What Goes in a Rules File

For MicroSim development, a rules file might include:

```markdown
# MicroSim Development Rules

## Canvas Standards
- Default canvas: 400x400 pixels
- Drawing area background: rgb(240, 248, 255) - Alice blue
- Control area: 50px height, white background
- Standard margin: 25 pixels

## Variable Naming
- Canvas dimensions: canvasWidth, drawHeight, controlHeight
- Sliders: descriptiveNameSlider (e.g., speedSlider, gravitySlider)
- Use camelCase for all variables

## Code Structure
1. Global variables at top
2. setup() function
3. draw() function
4. Helper functions
5. Event handlers (mousePressed, etc.)

## Control Placement
- Sliders positioned at: y = drawHeight + 15
- Slider labels to the left of slider
- Slider values displayed to the right

## Required Elements
- Always include describe() for accessibility
- Always include comments explaining the simulation
- Always use standard layout pattern
```

### Using Rules Files Effectively

1. **Start conversations** by referencing or including rules
2. **Keep rules updated** as your standards evolve
3. **Be specific**—vague rules get vague compliance
4. **Provide examples** of correct implementation
5. **Organize by topic** for easy reference

## Skills Development: Building Reusable AI Workflows

**Skills development** refers to creating structured, reusable prompts and workflows that reliably produce high-quality outputs. As you gain experience, you'll develop skills that can be shared and refined.

### Components of an AI Skill

A well-developed skill includes:

1. **Purpose statement**: What does this skill accomplish?
2. **Input requirements**: What information is needed?
3. **Prompt template**: The structured prompt that works
4. **Output format**: What the result should look like
5. **Quality checks**: How to verify the output
6. **Refinement patterns**: Common adjustments needed

### Example: MicroSim Generation Skill

```markdown
# Skill: Generate Educational MicroSim

## Purpose
Create a complete, working p5.js MicroSim from a concept description.

## Required Inputs
- Concept to teach
- Target audience (grade level)
- Desired interactive controls
- Visual style preferences

## Prompt Template
[See the MicroSim Prompt Template earlier in this chapter]

## Output Format
- Complete JavaScript file
- Embedded comments explaining physics/logic
- describe() accessibility statement

## Quality Checks
- [ ] Code runs without errors
- [ ] Controls affect visualization
- [ ] Layout matches standard pattern
- [ ] Concept is clearly demonstrated

## Common Refinements
- Adjust slider ranges for appropriate sensitivity
- Fix overlapping labels
- Add missing boundary checks
- Improve color contrast
```

## Claude Code: Integrated Development Partnership

**Claude Code** is a command-line tool that integrates Claude directly into your development workflow. Instead of copying code between a chat interface and your editor, Claude Code can read and write files directly.

### Claude Code Capabilities

| Capability | Benefit for MicroSim Development |
|-----------|----------------------------------|
| Read project files | Claude sees your existing code and patterns |
| Write/edit files | Changes applied directly to your project |
| Run commands | Execute tests, start servers, check errors |
| Multi-file context | Understands relationships between files |
| Persistent session | Maintains context across multiple requests |

### Working with Claude Code

Instead of:
> "Here's my code [paste 200 lines]. Please add a reset button."

You can say:
> "Read sketch.js and add a reset button that returns all values to their defaults."

Claude Code will:
1. Read the actual file
2. Understand the existing structure
3. Add the button with proper integration
4. Write the updated file

### Claude Code for MicroSim Iteration

The iterative refinement cycle becomes much faster:

1. **Request**: "Add a slider to control the pendulum length"
2. **Claude Code reads** your existing file
3. **Claude Code writes** the updated version
4. **You test** in the browser
5. **Request refinement**: "The pendulum is too long at maximum. Limit the range to 50-150."
6. **Repeat** until perfect

This tight integration loop dramatically accelerates development.

## Bringing Out the Best in Your Partner

Throughout this chapter, we've emphasized the partnership model. Here are the key principles for successful collaboration:

### The Partnership Principles

1. **Be specific**: Vague requests get vague results
2. **Provide context**: Include relevant standards and examples
3. **Iterate willingly**: First drafts are starting points
4. **Verify everything**: You are the final quality check
5. **Learn together**: Note what prompts work best
6. **Share knowledge**: Use rules files to maintain consistency

### Communication Best Practices

| Do | Don't |
|-----|--------|
| Specify exact values (pixels, ranges, colors) | Use vague terms ("bigger", "nicer") |
| Describe the problem you see | Just say "it's broken" |
| Include error messages verbatim | Paraphrase errors |
| Reference existing patterns | Explain everything from scratch |
| Ask for explanations | Accept code blindly |
| Test before assuming | Trust outputs without verification |

## Key Takeaways

You've learned how to work effectively with your AI development partner. Here are the essential insights:

1. **Generative AI** creates new content, including code for MicroSims.

2. **LLMs** like ChatGPT and Claude predict text based on patterns, making them powerful but imperfect code generators.

3. **Prompt engineering** transforms vague requests into specific instructions that produce quality code.

4. **Iterative refinement** is normal and expected—plan for 2-4 cycles per MicroSim.

5. **AI code generation** excels at boilerplate, pattern application, and syntax—but needs human judgment for visual design.

6. **Debugging with AI** works best when you provide exact error messages and describe expected behavior.

7. **Token limits** and **context windows** constrain how much information the AI can process at once.

8. **AI hallucinations** are common—always verify function names and syntax against documentation.

9. **AI limitations** mean you must test all code and evaluate all visual output yourself.

10. **Rules files** encode your standards for consistent AI behavior across sessions.

11. **Skills development** creates reusable workflows that improve over time.

12. **Claude Code** integrates AI assistance directly into your development environment.

??? question "Challenge: Write a prompt for a pendulum simulation"
    Try writing a complete prompt for a pendulum MicroSim using the template from this chapter. Include: canvas size, visual elements (string, bob, pivot point), controls (angle, length, gravity sliders), physics behavior, and code standards. Compare your prompt to a classmate's—how do they differ?

## Next Steps

You now understand both the power and limitations of your AI partner. In the next chapter, we'll apply these skills to create increasingly sophisticated simulations, using the prompt engineering and iterative refinement techniques you've learned here.

Remember: the goal isn't to have AI write all your code—it's to accelerate your development while deepening your understanding. The best MicroSims come from the collaboration between human creativity and AI capability.

Go forth and prompt wisely!

## References

- [Claude Documentation](https://docs.anthropic.com) - Official Claude guides and API reference
- [OpenAI Documentation](https://platform.openai.com/docs) - ChatGPT and GPT-4 documentation
- [Prompt Engineering Guide](https://www.promptingguide.ai) - Comprehensive prompting techniques
- [Claude Code](https://claude.ai/code) - Integrated development tool
- [p5.js Reference](https://p5js.org/reference) - Official p5.js documentation for verification
