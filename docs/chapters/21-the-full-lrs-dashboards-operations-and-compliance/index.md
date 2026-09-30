---
title: "The Full LRS: Dashboards, Operations and Compliance"
description: Explains what the full LRS shows teachers, authors and administrators, what it costs to run, how it fails, and what compliance requires, and says which pieces are built.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 11:30:22
version: 1.10
---

# The Full LRS: Dashboards, Operations and Compliance

## Summary

Covers what the full LRS delivers and costs: teacher, author and admin dashboards, experiments, capacity and cost models, deployment, failure modes and compliance.

Students learn the mastery heatmap and at-risk roster, content insights, suppression thresholds and reporting duties. After it, they can judge whether a school needs the full LRS.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Teacher Dashboard | 4 |
| Admin Interface | 2 |
| Class Mastery Heatmap | 2 |
| At-Risk Roster | 1 |
| Content Insights | 4 |
| A/B Experiment | 1 |
| Capacity Model | 72 |
| Cost Model | 56 |
| Container Deployment | 2 |
| Failure Modes | 1 |
| Compliance Reporting | 1 |
| Suppression Threshold | 1 |
| Author Dashboard | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 18: Mastery Prediction and Knowledge Tracing](../18-mastery-prediction-and-knowledge-tracing/index.md)
- [Chapter 20: The Full LRS: Architecture and Ingestion](../20-the-full-lrs-architecture-and-ingestion/index.md)

---

## Welcome

!!! mascot-welcome "From Stored Evidence to Decisions"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Storing every slider drag is only useful if a teacher, an author or an administrator can act on it. This chapter shows what the full LRS puts on their screens, what it costs to run, and what the law expects of it, so you can tell whether your school needs one. Let's bounce it around!

Chapter 20 followed a statement from a learner's click to durable storage. This chapter asks what happens next, and it stays honest about a limit that Chapter 20 already stated. The companion repository contains a working gateway, database files, a demo seeder and three prototype dashboards, but no MicroSim yet posts statements to a store. Everything below therefore describes a design with some working pieces, and each section says which pieces exist. A table near the end collects that status in one place.

## What Each Person Needs to See

The full LRS serves three audiences from one statement log, and the specification gives each audience a single question. A district administrator asks whether every school is covered, on schedule and compliant. A teacher asks which students need help right now, and on what. A textbook author asks whether a change to the content actually worked. The dashboards, reports and tools in this chapter are different aggregations of the same stored evidence, shaped to answer one of those three questions.

Separate from the dashboards sits the **Admin Interface**, the set of screens that change how the system is configured instead of reporting what learners did. The specification defines nine of them, among them district management, textbook deployment, credential issuing, user access, privacy and compliance, and audit monitoring. Access to every screen is governed by six roles: system administrator, district administrator, school administrator, teacher (called instructor in the specification), textbook author (called author or curriculum) and auditor. The distinction matters for design. A dashboard shows data to someone with a matching scope, while an admin interface lets someone with an elevated role alter access, deployments and policy, so the two are kept apart and gated differently.

## The Teacher Dashboard

The **Teacher Dashboard** is the specification's pair of screens for the instructor role. The first, My Classes, is a landing page that summarizes one section. The second, Student Detail, opens when a teacher clicks a name and shows nine reports about that one learner. The teacher's view is scoped to the sections that teacher teaches, which is why the privacy rules later in this chapter treat it specially.

Two reports on My Classes do most of the daily work. The **Class Mastery Heatmap** is a grid with one row per student and one column per concept, where each cell is shaded by that student's estimated mastery of that concept. The estimate comes from the mastery model of Chapter 18, so a dark or light cell is a model output and not a measured fact. Two patterns matter. A dark column means most of the class is struggling with one concept, which points at the content or the teaching. A dark row means one student is struggling broadly, which points at that student.

The **At-Risk Roster** ranks students by a composite risk score that combines three signals: low overall mastery, days since the student was last active, and the share of attempted concepts whose prerequisites are unmastered. The specification calls the score a weighted combination without fixing the weights. The prototype teacher dashboard in the repository picks its own, which the code applies as 0.45 for low mastery, 0.30 for inactivity and 0.25 for prerequisite gaps. Treat those numbers as one demonstration's choices, not as a validated standard.

A worked example shows how the arithmetic ranks two students. Inactivity is scaled so that the longest-idle student in the section scores 1, and suppose that is 10 days.

```text
risk = 0.45 * (1 - mastery) + 0.30 * (days_idle / max_days_idle) + 0.25 * gap_ratio

Student A: mastery 0.40, idle 8 of 10 days, gap_ratio 0.50
  0.45 * 0.60 + 0.30 * 0.80 + 0.25 * 0.50 = 0.270 + 0.240 + 0.125 = 0.635

Student B: mastery 0.70, idle 0 days, gap_ratio 0.00
  0.45 * 0.30 + 0.30 * 0.00 + 0.25 * 0.00 = 0.135
```

Student A ranks far above Student B because all three signals point the same way. The weights also mean a single severe signal can lift a student toward the top, which is why a teacher should read the breakdown and not only the rank.

!!! mascot-thinking "A Flag Is a Hypothesis"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that both the heatmap shade and the risk score sit on top of a mastery estimate, and Chapter 19 explains that no one has yet shown these estimates predict real mastery. Read each flag as a prompt to look at the student, then check it against what you know from the classroom.

The next specification lets you read a heatmap and find its two patterns.

#### Diagram: Class Mastery Heatmap Reader

<details markdown="1">
<summary>Class Mastery Heatmap Reader</summary>
Type: microsim
**sim-id:** class-mastery-heatmap-reader<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish a concept that most of a class struggles with from a student who struggles broadly, by reading the dark columns and dark rows of a heatmap and by computing an at-risk score.

Data: a synthetic section of 12 students and 8 concepts with mastery estimates from 0 to 1, generated once from a fixed seed and labeled as synthetic. One concept column is seeded low for most students, and one student row is seeded low for most concepts.

Layout: the heatmap fills the drawing region, with student names on the left and concept names across the top. A side panel shows the at-risk roster for the same section, sorted by score. Cells shade from light (low mastery) to dark blue (high mastery), and a legend states that shades are model estimates.

Controls:

- Slider "Weight on low mastery" from 0 to 1, default 0.45
- Slider "Weight on inactivity" from 0 to 1, default 0.30
- Slider "Weight on prerequisite gaps" from 0 to 1, default 0.25
- Button "Show the pattern", which outlines the weak column and the weak row
- Button "Quiz me", which asks the learner to click the concept the class most needs re-taught

Interactions: hovering a cell shows the student, concept and estimate. Changing a weight re-sorts the roster immediately, and clicking a roster row highlights that student's heatmap row and lists the three signal values behind the score.

Responsive design: the canvas width follows the container on window resize, the side panel moves below the heatmap under 600 pixels, and controls remain reachable at 400 pixels wide.

Implementation: p5.js with createSlider and createButton controls positioned relative to the drawing height, and a describe() call for accessibility.
</details>

## The Author Dashboard and Content Insights

The **Author Dashboard** turns the camera around. Instead of asking how a student is doing, it asks how the textbook is doing, and it is scoped by content, not by district or roster. The specification's role table gives the author the capabilities of viewing content insights and running experiments, with no student-identifying data. Every author report therefore reads aggregated, de-identified evidence, and cross-district aggregation is subject to the same privacy threshold described below.

**Content Insights** is the author's main dashboard, built from eight reports over the same summary vertices used elsewhere. Three of them show the flavor. The page effectiveness report relates a page's dwell time and scroll depth to later mastery of the concepts it covers. The confusing-content finder looks for pages with high dwell time, many revisits and low success on related questions, which is the signature of rereading without understanding. The question health report flags quiz items that are too easy, too hard or unable to tell strong from weak learners apart. For MicroSims specifically, a MicroSim impact report compares the outcomes of learners who used a MicroSim with those who skipped it. Every one of these is correlational, since students choose what to open, and the source chapter says so plainly.

Correlation cannot settle whether a change caused an improvement, and randomization can. An **A/B Experiment** randomly assigns learners to two versions of the same content, a control and a treatment, and compares an outcome chosen in advance. The design assigns each learner deterministically, by hashing the experiment and the learner together, so a learner never flips between versions mid-test. A check for sample-ratio mismatch compares the actual split with the intended one, and a planned 50/50 split that lands at 55/45 makes every other statistic suspect. Districts can opt out, and opted-out learners always see the control. The prototype author dashboard computes a readout with Cohen's d, a confidence interval and this mismatch check, but its README states that the three experiments it shows are synthetic and that the tool for designing new experiments is not built.

## The Suppression Threshold

Dashboards that aggregate people can reveal individuals. The **Suppression Threshold** is the minimum group size below which the design refuses to show a number, and its default is 10 students, configurable by each district. A cell built from seven students risks identifying one of them by elimination, so the design's single privacy filter blanks it out.

Hiding one cell is not enough, and the second rule shows why. A worked example makes the failure concrete. A table reports a row total of 45 students across four mastery bands, with counts of 14, 9, 22 and 0 students. Suppose the threshold is 10, so the cell holding 9 is hidden. A reader who sees 14, 22, 0 and the total of 45 computes the hidden cell as 45 minus 36, which is 9. **Complementary suppression** prevents that by hiding a second cell in the same row, so the total no longer determines either one. The design specification states the stakes bluntly, noting that a single suppressed cell in a row that publishes its total is arithmetic and not suppression.

!!! mascot-warning "Check the Total, Not Just the Cell"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap is to blank the small cell and leave the row total visible, which lets anyone recover the hidden value by subtraction. Before you trust a report, add up its visible cells and compare them with the total, and hide a second cell whenever the subtraction works.

One exemption keeps the rule from breaking the basic report. A teacher looking at their own rostered section already knows those students, so the filter exempts that direct scope and applies full suppression to cross-group, benchmark and de-identified views. As far as a search of the repository shows, the prototype dashboards do not implement this filter, since they read the graph directly. The filter is designed and not built, so nothing here should be presented to a school as enforced.

#### Diagram: Suppression Threshold Lab

<details markdown="1">
<summary>Suppression Threshold Lab</summary>
Type: microsim
**sim-id:** suppression-threshold-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: apply): The learner will apply a suppression threshold and complementary suppression to a small table and predict which cells must be hidden so that no hidden count can be recovered by subtraction.

Data: a table of four mastery bands (Beginning, Developing, Proficient, Advanced) with student counts and a "Row Total" column, loaded from three presets: "All cells safe", "One small cell", and "Complementary suppression needed".

Layout: the table occupies the drawing region. Cells at or above the threshold are white with black text. A cell below the threshold is red with a lock symbol, and a cell hidden by complementary suppression is amber with a lock symbol. A text line beneath the table states whether any hidden value can still be recovered.

Controls:

- Slider "Threshold" from 5 to 20 in steps of 1, default 10
- Dropdown "Scenario" with the three presets
- Checkbox "Apply complementary suppression" (default off), so the learner can first see the leak
- Checkbox "Show the subtraction", which draws the arithmetic that recovers a hidden cell
- Button "Reset"

Interactions: with complementary suppression off, the learner sees the recoverable cell highlighted and the subtraction displayed. Turning it on hides a second cell and the leak disappears. Clicking any cell asks the learner to predict whether it will be hidden before the answer is shown.

Responsive design: the canvas width follows the container on window resize, table columns shrink proportionally, and controls wrap below the table under 500 pixels wide.

Implementation: p5.js with createSlider, createSelect, createCheckbox and createButton controls, and a describe() call for accessibility.
</details>

## The Capacity Model

Before choosing hardware, an operator needs a **Capacity Model**, a set of assumptions and arithmetic that turns an expected number of learners into rates and storage. The design's model starts from a target of 10,000 statements per second sustained, bursting to 50,000. It assumes a mean statement size of about 1.5 KB, an active window of about 10 hours a day, and a duty cycle of about 40 percent of peak, because school activity spikes at period boundaries and idles between them. It also uses a ratio of about 0.1 statements per second per active student.

A worked example applies those stated assumptions to a smaller deployment. This arithmetic is ours and uses the design's ratios, so it is an illustration and not a measurement. Suppose 3,000 students are active at once.

```text
rate            = 3,000 students * 0.1 stmt/sec       = 300 stmt/sec
statements/day  = 300 * 0.40 * 36,000 sec (10 hours)  = 4.32 million
raw JSON/day    = 4.32 million * 1.5 KB               = about 6.5 GB
ClickHouse/day  = raw / 10  (design's columnar ratio) = about 0.65 GB
one school year = 0.65 GB * 180 days                  = about 117 GB
```

The design's own tables check the same arithmetic at two other scales. At 10,000 statements per second it gives about 144 million statements and 216 GB of raw JSON per day. At 1,000 per second, the single-server tier, it gives about 14.4 million statements and 21.6 GB per day. Two facts from the design keep the model manageable. Batching means 10,000 statements per second arrive as only about 100 to 400 HTTP requests per second, and the compression of Chapter 20 keeps graph writes near 2,500 per second even through a fivefold burst, so the burst needs no new hardware because the stream absorbs it.

!!! mascot-tip "Convert Every Rate Twice"
    ![Bounce giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When someone quotes a rate, ask for it per second and per day, and ask which resource it loads. The same 10,000 statements per second means 400 requests at the gateway, 2,500 graph writes and 216 GB of daily storage, and only the last one drives your disk bill.

## The Cost Model

A **Cost Model** prices the capacity model. The repository's hardware specification, dated 2026-07-15 and marked as a draft, gives two tiers, and it labels every dollar figure a planning-level estimate from public on-demand cloud pricing and not a quote. Reading it as a decision aid needs the comparison below, which quotes the file.

| Tier | Configuration | Estimated cost |
|------|---------------|----------------|
| 10,000 statements per second | Kubernetes, three-node Kafka and ClickHouse, Neo4j cluster, managed Redis and PostgreSQL across three availability zones | About $10,300 per month on demand, infrastructure only; reserved pricing might bring it toward $6,500 to $7,500 |
| 1,000 statements per second | One server running several virtual machines, no high availability | About $1,000 to $2,500 per month to rent a large cloud instance, $300 to $800 for dedicated hosting, or $8,000 to $15,000 upfront to buy |

Three cautions from the same file belong beside the table. First, the large-tier figure leaves out the Neo4j license, because Neo4j Community cannot cluster, and the file calls that cost an open question with a rough placeholder of $3,000 to $8,000 per month. Second, the single-server tier can use Community edition, so that line disappears, but the single server is a single point of failure. Third, the estimates exclude engineering time, support contracts and one-time costs such as migration and security review. The file says the smaller tier is roughly 10 to 20 times cheaper, and it advises moving to the distributed design when sustained ingest nears 3,000 to 5,000 statements per second.

#### Diagram: Capacity and Cost Explorer

<details markdown="1">
<summary>Capacity and Cost Explorer</summary>
Type: chart
**sim-id:** capacity-cost-explorer<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge which deployment tier fits a school or district by estimating daily statements and storage from the number of active students and comparing the result with the design's two published cost tiers.

Data: the capacity assumptions quoted in this chapter (0.1 statements per second per active student, 40 percent duty cycle, 10 active hours, 1.5 KB per statement, columnar ratio of 10) and the two cost ranges from the hardware specification, each labeled with its source and date.

Layout: a controls panel above two charts. The first is a bar chart of statements per day and raw storage per day. The second is a horizontal range chart of monthly cost for the single-server and distributed tiers, with a marker at the learner's estimated rate.

Controls:

- Slider "Active students at peak" from 500 to 100,000 on a logarithmic scale, default 3,000
- Slider "Duty cycle" from 20 to 60 percent, default 40
- Checkbox "Include Neo4j license placeholder" (default off) that adds the $3,000 to $8,000 range to the distributed tier
- Checkbox "Show burst (5x)"

Interactions: a message under the charts reports the derived statements per second and names the tier whose stated limits the load falls inside, and it warns when the load nears the 3,000 to 5,000 statements per second boundary. Hovering a bar shows its arithmetic.

Responsive design: the charts resize with the container width and stack vertically under 700 pixels, and every control remains visible at 400 pixels wide.

Implementation: Chart.js with a controls panel built in HTML and event listeners that update both datasets, and an aria-label on each canvas.
</details>

## Container Deployment

**Container Deployment** packages the LRS so an operator runs the same artifact everywhere. The repository builds one container image and selects a role by command, so `gateway`, `processor` and the other services are the same image started with different arguments. A Compose file defines the stack and a Makefile wraps the common commands. Four commands, each defined in the Makefile, show the developer path.

```bash
make stores   # start only the backing services: Redpanda, ClickHouse, Neo4j, vault-db, Redis
make up       # build the image and start the core stack, with three processor replicas
make seed     # load a demo district, textbook and synthetic statements
make smoke    # assert the ingest path
```

Two design choices in the Compose file deserve attention. The gateway depends on the stream and on nothing else, so a ClickHouse restart cannot stop ingestion, and the vault database sits on an internal network that only the identity service joins, which keeps the pseudonym mappings apart. Status matters here as well. The Compose file's own header says the analytics, admin and dashboard roles are deferred, and the command-line entry point in `src/lrs/cli.py` implements only the gateway, bootstrap and seed commands. The processor, summarizer and identity roles the Compose file names are not built. The three dashboards run separately from a `dashboards` folder with their own Python environment, reading the seeded graph, which is a prototype and not a deployment.

## Failure Modes

A production store must say in advance what happens when a part breaks. The design names twelve **Failure Modes**, and for each it commits to how the failure is detected, what the system does while it lasts and what an operator owes. One rule sorts them. A statement already in Kafka is durable, so losing ClickHouse, Neo4j, the summarizer, Redis or the identity service degrades freshness or speed and heals on recovery, because summaries can be rebuilt from the log. Only an unreachable Kafka can lose data, since a statement that never reached durable storage cannot be reconstructed. The gateway buffers briefly, then returns HTTP 503 with a Retry-After header, and the design makes that the one failure that pages a person immediately.

The practical lesson concerns the vault. The configuration and backup material sets a recovery point of five minutes for the vault database and treats its loss as the one unrecoverable case, because without its salts every stored pseudonym becomes permanently unlinkable to a real learner. The design's stated recovery objectives, such as one hour and four hours for ClickHouse, are design targets, since no store in the repository yet receives learner data to back up.

#### Diagram: Failure Boundary Explorer

<details markdown="1">
<summary>Failure Boundary Explorer</summary>
Type: diagram
**sim-id:** failure-boundary-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: differentiate): The learner will differentiate the one failure that can lose data from the failures that only degrade freshness or speed, by locating each failing component relative to the durability boundary at Kafka.

Nodes and edges: seven nodes left to right: Learning Record Provider, Ingestion Gateway, Kafka, Processor, ClickHouse, Summarizer and Neo4j, with a Redis cache attached to the read path. A dashed red line after Kafka is labeled "Only failures before this line can lose data".

Controls: a dropdown "Fail this component" lists each node, and a button "Restore all" resets the view.

Interactions: choosing a component turns it gray and shows a panel with what is detected, what the system does meanwhile, and whether data is lost. Choosing Kafka turns the panel red and shows the 503 and Retry-After behavior. Clicking any node shows its role and its status as built or designed.

Responsive design: the network re-fits to the container width on window resize, and the information panel moves below the network under 600 pixels.

Implementation: vis-network with fixed positions, physics disabled, and click handlers on every node.
</details>

## Compliance Reporting

**Compliance Reporting** is the ability of a district to show, on request, who was allowed to see a student's data and how that data can be removed. The design addresses three laws. FERPA, the United States law on education records, makes the district the responsible party. COPPA requires verifiable parental consent before collecting personal information from children under 13. GDPR, the European data protection regulation, popularized the right to erasure. This book gives no legal advice, and a district needs its own counsel to choose a policy profile.

Two mechanisms make the reporting concrete. The privacy access audit is a report of who queried which student's data and when, drawn from an append-only audit log, and it is a system administrator and auditor screen, not a district administrator's. Erasure follows three steps: void the student's statements, purge the rows and per-student summaries, and delete the pseudonym mapping so the identity can never be re-derived. Only de-identified aggregates survive. All of this is a specification, and no audit log or erasure path has run against real learner data.

## Deciding Whether You Need the Full LRS

The evidence in this chapter suggests a rough test, one that the next two chapters refine. The full LRS earns its cost when many schools or a district need role-scoped dashboards, a system of record, audit trails and formal compliance reporting. It is heavy for one classroom or one author who wants simple feedback, and the design's own smaller tier still assumes a server, backups and someone on call. Chapter 22 describes a lighter alternative that keeps summaries in the learner's browser.

| Component | Status |
|-----------|--------|
| Three Dash prototype dashboards over a seeded graph | Built as prototypes, with synthetic data and documented scope cuts |
| Container image, Compose stack, Makefile | Built for a laptop; several roles named in it are not built |
| Suppression filter, audit log, erasure path, single sign-on | Designed, not built |
| Capacity and cost figures | Design estimates, not measurements |
| Dashboards driven by real MicroSim events | Not built, since no emitter posts statements yet |
| Flags that predict who needs help | Hoped for, and awaiting the evaluation of Chapter 19 |

## Chapter Summary

- The full LRS serves three questions from one statement log: administrators ask about coverage and compliance, teachers ask who needs help, and authors ask whether content worked.
- The **Admin Interface** changes configuration under six roles, and it is kept separate from the dashboards that report on learning.
- The **Teacher Dashboard** offers the **Class Mastery Heatmap** for spotting weak concepts versus weak students and the **At-Risk Roster** for ranking students by a weighted composite score, all resting on unvalidated mastery estimates.
- The **Author Dashboard** and **Content Insights** evaluate content without student identity, and an **A/B Experiment** uses random assignment to support causal claims that correlation cannot.
- A **Suppression Threshold** of 10 students by default, plus complementary suppression, protects small groups, and it is designed but not built.
- The **Capacity Model** and **Cost Model** turn learner counts into rates, storage and monthly estimates, with about $10,300 per month for the large tier and $300 to $2,500 for the single-server tier.
- **Container Deployment** uses one image with many roles, and **Failure Modes** are organized around the durability boundary at Kafka.
- **Compliance Reporting** rests on an audit log and an erasure path, and it is not legal advice.

!!! mascot-celebration "You Can Judge the Full LRS"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now read a class heatmap and at-risk roster with the right caution, apply a suppression threshold to a table, size a deployment from a student count, and say which parts of the full LRS are built. That is exactly the evidence you need to decide whether a school should run one.

The next chapter turns to LRS-Lite, the compact alternative that summarizes evidence in the learner's own browser.

