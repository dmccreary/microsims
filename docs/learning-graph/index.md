# Learning Graph for Creating Educational MicroSims

This section contains the learning graph for this textbook. A learning graph is
a graph of concepts used in this textbook. Each concept is represented by a
node in a network graph. Concepts are connected by directed edges that indicate
what concepts each node depends on before that concept is understood by the student.

A learning graph is the foundational data structure for intelligent textbooks that can recommend learning paths.
A learning graph is like a roadmap of concepts to help students arrive at their learning goals.

At the left of the learning graph are prerequisite or foundational concepts. They
have no outbound edges. They only have inbound edges for other concepts that depend on
understanding these foundational prerequisite concepts. At the far right
we have the most advanced concepts in the course. To master these concepts you
must understand all the concepts that they point to.

## Learning Graph Statistics

| Metric | Value |
|--------|-------|
| Total Concepts | 242 |
| Foundational Concepts | 8 |
| Total Dependencies | 402 |
| Taxonomy Categories | 14 |
| Max Dependency Chain | 16 |

## Course Description

We use the [Course Description](../course-description.md) as
the source document for the concepts that are included in this course.
The course description uses the 2001 Bloom taxonomy to order learning objectives.

## List of Concepts

We use generative AI to convert the course description into a [Concept List](./concept-list.md).
Each concept is in the form of a short Title Case label with most labels under 32 characters long.

## Concept Dependency List

We next use generative AI to create a Directed Acyclic Graph (DAG). DAGs do not have cycles where
concepts depend on themselves. We provide the DAG in two formats. One is a [CSV file](learning-graph.csv) and the other
format is a [JSON file](learning-graph.json) that uses the vis-network JavaScript library format. The vis-network format uses `nodes`, `edges` and `metadata`
elements with edges containing `from` and `to` properties. This makes it easy for you to view and edit the learning
graph using an editor built with the vis-network tools.

## Analysis & Documentation

### Course Description Quality Assessment

This report rates the overall quality of the course description for the purpose of generating a learning graph.

- Course description fields and content depth analysis
- Validates course description has sufficient depth for generating 200+ concepts
- Compares course description against similar courses
- Identifies content gaps and strengths
- Suggests areas of improvement

[View the Course Description Quality Assessment](course-description-assessment.md)

### Learning Graph Quality Validation

This report gives you an overall assessment of the quality of the learning graph.
It uses graph algorithms to look for specific quality patterns in the graph.

- Graph structure validation - all concepts are connected
- DAG validation (no cycles detected)
- Foundational concepts: 8 entry points
- Indegree distribution analysis
- Longest dependency chains (16 steps)
- Connectivity: 100% of nodes connected to the main cluster

[View the Learning Graph Quality Validation](quality-metrics.md)

### Concept Taxonomy

In order to see patterns in the learning graph, it is useful to assign colors
to each concept based on the concept type. We use generative AI to
create categories for our concepts and then place each concept
into a single primary classifier.

- 14 taxonomy categories
- Category organization - foundational elements first, capstone projects last
- Balanced categories (2.5% - 21.1% each)
- All categories under 30% threshold
- Clear 3-5 letter abbreviations for use in CSV file

[View the Concept Taxonomy](concept-taxonomy.md)

### Taxonomy Distribution

This report shows how many concepts fit into each category of the taxonomy.
Our goal is a somewhat balanced taxonomy where each category holds a
reasonable number of concepts. No category contains over 30% of our concepts.

- Statistical breakdown
- Detailed concept listing by category
- Visual distribution chart
- Balance verification

[View the Taxonomy Distribution Report](./taxonomy-distribution.md)

## Foundational Concepts

These 8 concepts have no prerequisites and serve as entry points to the learning graph:

1. **MicroSim Definition** - Core definition of what a MicroSim is
2. **Programming Fundamentals** - Basic programming concepts
3. **Web Browser** - Understanding web browser technology
4. **Generative AI** - Introduction to AI for code generation
5. **Bloom's Taxonomy** - Educational learning levels framework
6. **Dublin Core Metadata** - Metadata standards foundation
7. **Cognitive Load Theory** - Learning theory fundamentals
8. **Creative Commons** - Licensing fundamentals

## Taxonomy Categories

| TaxonomyID | Category | Count | Percentage |
|------------|----------|-------|------------|
| TYPES | MicroSim Types & Libraries | 51 | 21.1% |
| P5JS | p5.js Core | 24 | 9.9% |
| PROF | Professional & Integration | 24 | 9.9% |
| UI | User Interface & Controls | 20 | 8.3% |
| META | Metadata & Packaging | 20 | 8.3% |
| PED | Pedagogy & Learning Theory | 20 | 8.3% |
| GENAI | Generative AI | 16 | 6.6% |
| ARCH | MicroSim Architecture | 12 | 5.0% |
| BLOOM | Bloom's Taxonomy | 12 | 5.0% |
| RESP | Responsive Design | 11 | 4.5% |
| WEB | Web Technologies | 9 | 3.7% |
| ACCESS | Accessibility | 9 | 3.7% |
| FOUND | Foundation Concepts | 8 | 3.3% |
| PROG | Programming Fundamentals | 6 | 2.5% |
