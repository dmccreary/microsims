# Chapter 12 Quiz: Metadata, Packaging, and Quality

Test your understanding of MicroSim documentation standards, packaging structure, and quality evaluation.

**Instructions:** Select the best answer for each question. After answering, click "Show Answer" to check your response and read the explanation.

---

#### 1. What is "Dublin Core" in the context of MicroSim metadata?

<div class="upper-alpha" markdown>
1. A JavaScript library for creating charts
2. A widely used metadata standard with 15 core elements for describing digital resources
3. A CSS framework for styling
4. A version control system
</div>

??? question "Show Answer"
    The correct answer is **B**. Dublin Core is the most widely used metadata standard for describing digital resources. Originally developed for library cataloging, it provides 15 core elements (title, creator, subject, description, etc.) that apply perfectly to educational MicroSims.

    **Concept Tested:** Dublin Core Metadata, Metadata Standards

    **Bloom's Level:** Remember

---

#### 2. What are the four essential Dublin Core metadata elements for MicroSims?

<div class="upper-alpha" markdown>
1. Name, date, version, license
2. Title, creator, subject, description
3. Author, content, format, size
4. Header, body, footer, sidebar
</div>

??? question "Show Answer"
    The correct answer is **B**. The four essential Dublin Core elements are: Title (name of the resource), Creator (who made it), Subject (topic keywords), and Description (what it does). These enable discovery, attribution, and understanding.

    **Concept Tested:** Title Metadata, Creator Metadata, Subject Metadata, Description Metadata

    **Bloom's Level:** Remember

---

#### 3. What is YAML frontmatter used for in MicroSim documentation?

<div class="upper-alpha" markdown>
1. Styling the visual appearance
2. Placing metadata at the top of Markdown files
3. Creating animations
4. Validating JavaScript code
</div>

??? question "Show Answer"
    The correct answer is **B**. YAML frontmatter places metadata at the top of Markdown files between `---` delimiters, making it both human-readable and machine-parseable. MkDocs and other static site generators use this metadata for processing.

    **Concept Tested:** YAML Frontmatter

    **Bloom's Level:** Understand

---

#### 4. What is the purpose of JSON Schema in MicroSim packaging?

<div class="upper-alpha" markdown>
1. To create visual charts
2. To define and validate the structure of metadata
3. To compress files
4. To encrypt sensitive data
</div>

??? question "Show Answer"
    The correct answer is **B**. JSON Schema defines the structure and validation rules for metadata. It documents required fields, ensures correct data types, catches errors before publishing, and serves as self-describing documentation for the metadata format.

    **Concept Tested:** JSON Schema

    **Bloom's Level:** Understand

---

#### 5. What files should be included in a standard MicroSim package?

<div class="upper-alpha" markdown>
1. Only index.html and script.js
2. index.md, main.html, script.js, metadata.json, and optionally style.css and data.json
3. Only a single HTML file
4. PDF documentation only
</div>

??? question "Show Answer"
    The correct answer is **B**. A standard MicroSim package includes: index.md (documentation with frontmatter), main.html (standalone runnable version), script.js (p5.js sketch), metadata.json (machine-readable metadata), and optionally style.css, data.json, and preview.png.

    **Concept Tested:** MicroSim Packaging, index.md File, main.html File, script.js File

    **Bloom's Level:** Remember

---

#### 6. What is the recommended size for social media preview images?

<div class="upper-alpha" markdown>
1. 100x100 pixels
2. 800x600 pixels
3. 1200x630 pixels
4. 1920x1080 pixels
</div>

??? question "Show Answer"
    The correct answer is **C**. The universal recommended size for social preview images is 1200x630 pixels (1.91:1 aspect ratio). This size works well across Twitter, Facebook, LinkedIn, and other platforms where MicroSims might be shared.

    **Concept Tested:** Social Image Preview

    **Bloom's Level:** Remember

---

#### 7. What do Open Graph tags control?

<div class="upper-alpha" markdown>
1. The animation speed of MicroSims
2. How content appears when shared on social media platforms
3. The canvas size of p5.js sketches
4. The color scheme of the MicroSim
</div>

??? question "Show Answer"
    The correct answer is **B**. Open Graph tags (og:title, og:description, og:image, etc.) tell social media platforms how to display your content when shared. They control the title, description, and preview image that appear in social media posts.

    **Concept Tested:** Open Graph Tags

    **Bloom's Level:** Understand

---

#### 8. How many points is the MicroSim quality rubric out of?

<div class="upper-alpha" markdown>
1. 50 points
2. 75 points
3. 100 points
4. 150 points
</div>

??? question "Show Answer"
    The correct answer is **C**. The MicroSim quality rubric is a 100-point system divided into five categories: Documentation (25 pts), Metadata (20 pts), Code Quality (25 pts), User Experience (20 pts), and Packaging (10 pts).

    **Concept Tested:** 100-Point Rubric, Quality Score

    **Bloom's Level:** Remember

---

#### 9. What quality score range is considered "Excellent" and publication-ready?

<div class="upper-alpha" markdown>
1. 60-69
2. 70-79
3. 80-89
4. 90-100
</div>

??? question "Show Answer"
    The correct answer is **D**. A score of 90-100 is rated "Excellent" and indicates publication-ready, exemplary work. Scores of 80-89 are "Good" (minor improvements needed), 70-79 are "Acceptable" (functional but needs polish), and below 70 indicates incomplete work.

    **Concept Tested:** Quality Score, 100-Point Rubric

    **Bloom's Level:** Remember

---

#### 10. What should be included in the metadata.json file?

<div class="upper-alpha" markdown>
1. The complete JavaScript code
2. Dublin Core metadata, educational metadata, and technical metadata in JSON format
3. Only the MicroSim title
4. Binary image data
</div>

??? question "Show Answer"
    The correct answer is **B**. The metadata.json file provides machine-readable metadata including Dublin Core elements (title, creator, subject, description), educational metadata (grade level, Bloom level, learning objectives), and technical metadata (framework, dimensions, dependencies).

    **Concept Tested:** metadata.json File

    **Bloom's Level:** Understand

---

#### 11. What is the primary purpose of MicroSim validation?

<div class="upper-alpha" markdown>
1. To make the code run faster
2. To ensure the package meets all requirements before publishing
3. To reduce file size
4. To add encryption
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroSim validation ensures your package meets all requirements before publishing. This includes checking that required files exist, metadata validates against the schema, functionality works correctly, and all documentation is complete.

    **Concept Tested:** MicroSim Validation

    **Bloom's Level:** Understand

---

#### 12. A MicroSim scores 75 points on the quality rubric. What improvements would likely have the biggest impact?

<div class="upper-alpha" markdown>
1. Adding more animations
2. Addressing gaps in documentation and metadata (worth 45 combined points)
3. Changing the color scheme
4. Using a different JavaScript library
</div>

??? question "Show Answer"
    The correct answer is **B**. Documentation (25 pts) and Metadata (20 pts) together account for 45 points of the rubric. For a score of 75 (Acceptable), focusing on completing documentation, adding proper metadata, and ensuring all required files are present would likely provide the biggest score improvement.

    **Concept Tested:** 100-Point Rubric, Quality Score

    **Bloom's Level:** Analyze

---

## Quiz Summary

**Concepts Tested:**

| Concept | Questions |
|---------|-----------|
| Dublin Core Metadata | 1 |
| Metadata Standards | 1 |
| Title Metadata | 2 |
| Creator Metadata | 2 |
| Subject Metadata | 2 |
| Description Metadata | 2 |
| YAML Frontmatter | 3 |
| JSON Schema | 4 |
| MicroSim Packaging | 5 |
| index.md File | 5 |
| main.html File | 5 |
| script.js File | 5 |
| Social Image Preview | 6 |
| Open Graph Tags | 7 |
| 100-Point Rubric | 8, 9, 12 |
| Quality Score | 8, 9, 12 |
| metadata.json File | 10 |
| MicroSim Validation | 11 |

**Bloom's Taxonomy Distribution:**

- Remember: 6 questions (50%)
- Understand: 5 questions (42%)
- Analyze: 1 question (8%)
