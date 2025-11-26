# Chapter 14 Quiz: Professional Development and Capstone

Test your understanding of iframe integration, licensing, collaboration workflows, portfolio development, and capstone project requirements.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What command starts a local MkDocs development server for previewing your site?

<div class="upper-alpha" markdown>
1. npm start
2. mkdocs serve
3. python -m http.server
4. mkdocs build
</div>

??? question "Show Answer"
    The correct answer is **B**. The `mkdocs serve` command starts a local development server at http://127.0.0.1:8000 with automatic reload when files change. This creates a tight feedback loop for rapid iteration on MicroSim integration.

    **Concept Tested:** mkdocs serve, Live Preview

    **Bloom's Level:** Remember

---

#### 2. What does the "lazy" value for the iframe loading attribute do?

<div class="upper-alpha" markdown>
1. Makes the iframe load slowly
2. Defers loading until the iframe is near the viewport
3. Disables loading entirely
4. Loads content in low resolution
</div>

??? question "Show Answer"
    The correct answer is **B**. The `loading="lazy"` attribute defers loading the iframe content until it's near the viewport, improving page performance. This is especially important for pages with multiple MicroSims, as it prevents all iframes from loading simultaneously.

    **Concept Tested:** iframe Integration

    **Bloom's Level:** Understand

---

#### 3. What does CC BY-NC-SA license mean?

<div class="upper-alpha" markdown>
1. Commercial use allowed, no attribution needed
2. Attribution required, NonCommercial use only, ShareAlike derivatives
3. No modifications allowed under any circumstances
4. Public domain with no restrictions
</div>

??? question "Show Answer"
    The correct answer is **B**. CC BY-NC-SA means: BY (users must credit you), NC (no commercial use without permission), SA (derivatives must use the same license). This creates a virtuous cycle where educational improvements are shared back to the community.

    **Concept Tested:** Creative Commons, CC BY-NC-SA, Attribution License

    **Bloom's Level:** Remember

---

#### 4. What should you always do before starting work on a team project?

<div class="upper-alpha" markdown>
1. Create a new branch immediately
2. Run git pull to get the latest changes
3. Delete your local repository
4. Push your changes first
</div>

??? question "Show Answer"
    The correct answer is **B**. The golden rule of team development is "always pull before you push." Running `git pull origin main` at the start of every work session ensures you have the latest code and prevents merge conflicts.

    **Concept Tested:** Collaboration Workflow, Working in Teams

    **Bloom's Level:** Remember

---

#### 5. What is the purpose of peer review in MicroSim development?

<div class="upper-alpha" markdown>
1. To slow down development
2. To improve quality through fresh perspectives on code and pedagogy
3. To assign blame for bugs
4. To create competition between developers
</div>

??? question "Show Answer"
    The correct answer is **B**. Peer review improves quality by providing fresh perspectives. For MicroSims, review covers both code quality (naming, conventions, responsiveness) and pedagogical effectiveness (learning objectives, cognitive load, intuitive controls).

    **Concept Tested:** Peer Review

    **Bloom's Level:** Understand

---

#### 6. What is a learning graph?

<div class="upper-alpha" markdown>
1. A chart showing student test scores over time
2. A representation of concepts as nodes and dependencies as edges
3. A visual showing the number of MicroSims created
4. A progress bar for course completion
</div>

??? question "Show Answer"
    The correct answer is **B**. A learning graph represents concepts as nodes and dependencies as edges—showing that concept B requires understanding concept A first. Learning graphs help sequence content, identify curriculum gaps, and plan which concepts need MicroSim support.

    **Concept Tested:** Learning Graph, Concept Dependencies

    **Bloom's Level:** Remember

---

#### 7. What styling is recommended for iframes embedding MicroSims?

<div class="upper-alpha" markdown>
1. Thick decorative borders with shadows
2. Minimal borders with border: none and transparent backgrounds
3. Bright colored backgrounds to stand out
4. Fixed pixel widths for consistency
</div>

??? question "Show Answer"
    The correct answer is **B**. Professional iframe integration uses minimal styling: `border: none`, transparent backgrounds, and responsive widths. The goal is for the MicroSim to feel like a natural part of the page, not a foreign element inserted into it.

    **Concept Tested:** iframe Styling, Minimal Borders

    **Bloom's Level:** Understand

---

#### 8. What is the purpose of user testing?

<div class="upper-alpha" markdown>
1. To prove the developer's code is correct
2. To reveal how real students interact with the MicroSim
3. To generate marketing testimonials
4. To count how many users visit the page
</div>

??? question "Show Answer"
    The correct answer is **B**. User testing reveals how real students interact with your MicroSim. What seems obvious to the developer may confuse actual users. Methods include think-aloud protocols, task-based testing, A/B testing, and analytics tracking.

    **Concept Tested:** User Testing

    **Bloom's Level:** Understand

---

#### 9. What elements should proper Creative Commons attribution include?

<div class="upper-alpha" markdown>
1. Just the creator's name
2. Creator name, title, source URL, license, and any changes made
3. Only the license type
4. A link to the original with no other information
</div>

??? question "Show Answer"
    The correct answer is **B**. Proper CC attribution includes five elements: creator name (who made the original), title (name of the MicroSim), source URL (where to find the original), license (which CC license applies), and changes (note if you modified it).

    **Concept Tested:** Attribution License, Creative Commons

    **Bloom's Level:** Remember

---

#### 10. Which categories are evaluated in capstone project assessment?

<div class="upper-alpha" markdown>
1. Only technical code quality
2. Technical execution, pedagogical design, documentation, accessibility, and professionalism
3. Number of features and visual complexity
4. Speed of completion
</div>

??? question "Show Answer"
    The correct answer is **B**. Capstone projects are evaluated across five weighted categories: technical execution (25%), pedagogical design (30%), documentation (15%), accessibility (15%), and professionalism (15%). This holistic evaluation reflects real-world MicroSim quality factors.

    **Concept Tested:** Project Evaluation, Capstone Project

    **Bloom's Level:** Remember

---

#### 11. Why should a portfolio demonstrate diversity of MicroSims?

<div class="upper-alpha" markdown>
1. To show off as many skills as possible
2. To demonstrate versatility across subjects, libraries, Bloom levels, and interaction types
3. To fill space in the portfolio
4. To avoid repeating the same colors
</div>

??? question "Show Answer"
    The correct answer is **B**. A diverse portfolio demonstrates versatility—showing range across subject areas (physics, math, biology), complexity levels, Bloom's Taxonomy levels, libraries (p5.js, Chart.js, vis-network), and interaction types. This proves you can adapt to different educational contexts.

    **Concept Tested:** Portfolio Development, Diversity of MicroSims

    **Bloom's Level:** Understand

---

#### 12. A MicroSim needs to be embedded in both an MkDocs textbook and a Reveal.js presentation. What approach ensures it works in both contexts?

<div class="upper-alpha" markdown>
1. Create two completely separate versions
2. Design with responsive width, minimal borders, and self-contained main.html
3. Use only fixed pixel dimensions
4. Embed the p5.js editor directly
</div>

??? question "Show Answer"
    The correct answer is **B**. Designing with responsive width (`width="100%"`), minimal borders, and a self-contained main.html file ensures the MicroSim works across different embedding contexts. The iframe integration pattern is the same whether the host is MkDocs, Reveal.js, or any other HTML-based platform.

    **Concept Tested:** iframe Integration, MkDocs Embedding, HTML Slide Embedding

    **Bloom's Level:** Apply

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| mkdocs serve | 1 |
| Live Preview | 1 |
| iframe Integration | 2, 12 |
| Creative Commons | 3, 9 |
| CC BY-NC-SA | 3 |
| Attribution License | 3, 9 |
| Collaboration Workflow | 4 |
| Working in Teams | 4 |
| Peer Review | 5 |
| Learning Graph | 6 |
| Concept Dependencies | 6 |
| iframe Styling | 7 |
| Minimal Borders | 7 |
| User Testing | 8 |
| Project Evaluation | 10 |
| Capstone Project | 10 |
| Portfolio Development | 11 |
| Diversity of MicroSims | 11 |
| MkDocs Embedding | 12 |
| HTML Slide Embedding | 12 |

**Bloom's Taxonomy Distribution:**

- Remember: 5 questions (42%)
- Understand: 6 questions (50%)
- Apply: 1 question (8%)

