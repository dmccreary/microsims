# Course Description Assessment

**Course:** MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive Learning Objects with AI
**File assessed:** `docs/course-description.md` (rewritten 2026-09-30 for the MicroSims 2.0 rewrite; the v1.0 description is at git tag `v1.0`)
**Skill:** course-description-analyzer v0.04

## Overall Score: 98/100

**Quality rating:** Excellent. Ready for learning graph generation.

## Detailed Scoring Breakdown

| Element | Points | Score | Notes |
|---------|-------:|------:|-------|
| Title | 5 | 5 | Clear and descriptive |
| Target Audience | 5 | 5 | Teachers, educators, instructional designers, developers and analytics practitioners |
| Prerequisites | 5 | 5 | Stated, including what is not required |
| Main Topics Covered | 10 | 8 | 21 topics, one per planned chapter; more than the 5-10 ideal, but each is a distinct chapter |
| Topics Excluded | 5 | 5 | Seven explicit boundaries, including "claims of proven learning gains" |
| Learning Outcomes Header | 5 | 5 | "After this course, students will be able to..." |
| Remember Level | 10 | 10 | Six specific outcomes |
| Understand Level | 10 | 10 | Six specific outcomes |
| Apply Level | 10 | 10 | Six specific outcomes |
| Analyze Level | 10 | 10 | Six specific outcomes |
| Evaluate Level | 10 | 10 | Six specific outcomes |
| Create Level | 10 | 10 | Five outcomes, including a capstone portfolio |
| Descriptive Context | 5 | 5 | "Why This Course Matters" plus an overview |
| **Total** | **100** | **98** | |

## Gap Analysis

1. **Main Topics (8/10).** The list has 21 items against an ideal of 5-10. This is acceptable because the course is the whole book. The learning-graph generator should group the topics into taxonomy categories so the graph does not read as 21 flat areas.

## Improvement Suggestions

1. Group the 21 topics into about six families in the concept taxonomy: foundations (1-5), MicroSim types (6-11), engineering and quality (12-15), evidence and analytics (16-18), evaluation and practice (19-20) and the future (21).
2. Ensure that the mastery-prediction thread is represented in the learning graph as its own set of concepts (evidence classes, concept mapping, knowledge tracing, calibration, discrimination and fidelity) and is not only a chapter topic.
3. Course length (16 weeks, 3 credits) is an assumption of the plan for 21 chapters. Confirm it or adjust the weekly pacing.

## Concept Generation Readiness

The description is rich enough to generate a full graph. The 21 topics, six Bloom levels and about 35 outcomes suggest **350-450 concepts**, comfortably above the 200 minimum. The new material (xAPI, the full LRS, LRS-Lite, knowledge tracing and evaluation of prediction) alone should supply about 100 concepts. No additions are needed before generation.

## Next Steps

Score is at least 85. Ready to run the `learning-graph-generator` skill.
