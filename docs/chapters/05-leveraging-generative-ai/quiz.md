# Chapter 5 Quiz: Leveraging Generative AI

Test your understanding of working with LLMs for MicroSim development, including prompt engineering, iterative refinement, and AI limitations.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What is the most accurate description of working with an LLM for code generation?

<div class="upper-alpha" markdown>
1. The LLM replaces the need for human developers
2. The LLM is a partner that requires clear communication and human judgment
3. The LLM can execute and test the code it generates
4. The LLM always produces perfect code on the first attempt
</div>

??? question "Show Answer"
    The correct answer is **B**. An LLM is a partner, not a replacement. Success depends on understanding each other's strengths and limitations, communicating clearly, and developing shared patterns of collaboration. LLMs cannot execute code or guarantee correctness.

    **Concept Tested:** Large Language Models

    **Bloom's Level:** Understand

---

#### 2. What does a "token" represent in the context of LLMs?

<div class="upper-alpha" markdown>
1. A complete JavaScript function
2. A single character of text
3. Roughly 4 characters or 0.75 words on average
4. An error message from the model
</div>

??? question "Show Answer"
    The correct answer is **C**. A token is roughly 4 characters or 0.75 words on average. However, tokenization varies—common words may be single tokens, code symbols may be individual tokens, and unusual words may be split into multiple tokens.

    **Concept Tested:** Token Limits

    **Bloom's Level:** Remember

---

#### 3. Which technique involves providing examples of desired output in your prompt?

<div class="upper-alpha" markdown>
1. Chain of thought
2. Few-shot learning
3. Role prompting
4. Structured output
</div>

??? question "Show Answer"
    The correct answer is **B**. Few-shot learning involves providing 2-3 examples of similar MicroSims or desired output in your prompt. This helps the LLM understand the pattern and format you expect.

    **Concept Tested:** Prompt Engineering

    **Bloom's Level:** Remember

---

#### 4. What is an "AI hallucination" in code generation?

<div class="upper-alpha" markdown>
1. When the AI takes too long to respond
2. When the AI generates confident-sounding but incorrect code or information
3. When the AI refuses to generate code
4. When the AI produces duplicate output
</div>

??? question "Show Answer"
    The correct answer is **B**. AI hallucinations occur when an LLM generates confident-sounding but incorrect information—like inventing functions that don't exist, using incorrect syntax, or fabricating API methods. Always verify generated code against documentation.

    **Concept Tested:** AI Hallucinations

    **Bloom's Level:** Understand

---

#### 5. What is the primary purpose of iterative refinement when working with AI?

<div class="upper-alpha" markdown>
1. To increase token usage
2. To improve AI-generated code through successive feedback cycles
3. To bypass context window limits
4. To create multiple versions for comparison
</div>

??? question "Show Answer"
    The correct answer is **B**. Iterative refinement is the process of improving AI-generated code through successive conversations. You generate, test, identify issues, specify fixes, and regenerate—typically 2-4 cycles per MicroSim.

    **Concept Tested:** Iterative Refinement

    **Bloom's Level:** Understand

---

#### 6. When debugging with AI, what information should you include in your prompt?

<div class="upper-alpha" markdown>
1. Only the error message
2. The error message, relevant code, expected behavior, and actual behavior
3. Your entire codebase
4. A screenshot of the error
</div>

??? question "Show Answer"
    The correct answer is **B**. Effective debugging prompts include the exact error message, the relevant code section, a description of expected behavior, and what actually happens. This gives the AI complete context to diagnose and fix the problem.

    **Concept Tested:** Code Debugging with AI

    **Bloom's Level:** Apply

---

#### 7. What is the "context window" in an LLM?

<div class="upper-alpha" markdown>
1. The visual display of the chat interface
2. The total amount of text (in tokens) the LLM can process at once
3. The time limit for generating a response
4. The number of conversations you can have per day
</div>

??? question "Show Answer"
    The correct answer is **B**. The context window is the total amount of text (in tokens) that an LLM can "see" at once—including your prompt, conversation history, and any included files. When exceeded, the AI may lose earlier context.

    **Concept Tested:** Context Window

    **Bloom's Level:** Remember

---

#### 8. Which is an example of a common p5.js hallucination?

<div class="upper-alpha" markdown>
1. Using `createCanvas(400, 400)` to create a canvas
2. Using `circle(x, y, radius)` instead of `circle(x, y, diameter)`
3. Using `background(255)` for a white background
4. Using `fill()` before drawing shapes
</div>

??? question "Show Answer"
    The correct answer is **B**. A common hallucination is confusing radius with diameter in the `circle()` function. The correct syntax is `circle(x, y, diameter)`, not radius. This subtle error can cause shapes to be half their intended size.

    **Concept Tested:** AI Hallucinations

    **Bloom's Level:** Apply

---

#### 9. What is the purpose of a "rules file" when working with AI?

<div class="upper-alpha" markdown>
1. To limit the AI's capabilities
2. To provide consistent context about project standards and preferences
3. To record all conversations with the AI
4. To track token usage
</div>

??? question "Show Answer"
    The correct answer is **B**. Rules files are documents that provide consistent context about your project's standards, patterns, and preferences—like canvas dimensions, variable naming conventions, and code structure. They serve as an instruction manual for your AI partner.

    **Concept Tested:** Rules Files

    **Bloom's Level:** Understand

---

#### 10. What is a key limitation of LLMs that affects MicroSim development?

<div class="upper-alpha" markdown>
1. They can only generate JavaScript code
2. They cannot execute code or see visual output
3. They cannot understand natural language
4. They can only work with short prompts
</div>

??? question "Show Answer"
    The correct answer is **B**. LLMs cannot execute code or see visual output. They predict what code should look like based on patterns, but they cannot run it, view your canvas, or detect visual bugs. You must test all code and evaluate visual results yourself.

    **Concept Tested:** AI Limitations

    **Bloom's Level:** Understand

---

#### 11. What makes a "strong prompt" more effective than a "weak prompt"?

<div class="upper-alpha" markdown>
1. Using more tokens
2. Including specific, actionable details like dimensions, colors, and behavior
3. Making it longer
4. Using technical jargon
</div>

??? question "Show Answer"
    The correct answer is **B**. Strong prompts include specific, actionable details—exact canvas sizes, RGB colors, slider ranges, behavior descriptions, and code standards. Vague requests like "make a bouncing ball" produce unpredictable results compared to detailed specifications.

    **Concept Tested:** AI Prompting

    **Bloom's Level:** Analyze

---

#### 12. What does Claude Code enable that differs from using a chat interface?

<div class="upper-alpha" markdown>
1. Faster response times
2. Direct reading and writing of project files
3. Free unlimited usage
4. Automatic error correction
</div>

??? question "Show Answer"
    The correct answer is **B**. Claude Code integrates directly into your development workflow, allowing Claude to read your existing files, understand your project structure, and write changes directly. This eliminates copying code between chat and editor, dramatically accelerating the iteration cycle.

    **Concept Tested:** Claude Code

    **Bloom's Level:** Remember

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| Large Language Models | 1 |
| Token Limits | 2 |
| Prompt Engineering | 3 |
| AI Hallucinations | 4, 8 |
| Iterative Refinement | 5 |
| Code Debugging with AI | 6 |
| Context Window | 7 |
| Rules Files | 9 |
| AI Limitations | 10 |
| AI Prompting | 11 |
| Claude Code | 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 4 questions (33%)
- Understand: 5 questions (42%)
- Apply: 2 questions (17%)
- Analyze: 1 question (8%)
