---
title: Tenant Isolation and Pseudonym Explorer
description: Derive a learner's pseudonymous key in two school districts with per-district salts or one global salt, see whether an analytics reader can link the keys, and click each level of the tenancy tree to learn whether its boundary is hard or soft.
image: /sims/tenant-pseudonym-explorer/tenant-pseudonym-explorer.png
og:image: /sims/tenant-pseudonym-explorer/tenant-pseudonym-explorer.png
twitter:image: /sims/tenant-pseudonym-explorer/tenant-pseudonym-explorer.png
social:
   cards: false
quality_score: 100
---

# Tenant Isolation and Pseudonym Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Tenant Isolation and Pseudonym Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The full Learning Record Store serves many school districts from one running system. The
district is the tenant, and below it sit schools, courses, sections and the enrollments that
connect a student to a section. This MicroSim draws that tree for two districts and puts the
same learner, `learner-17` at `https://school.example.edu`, at the bottom of each.

Pressing **Derive keys** computes a `student_key` for each district by combining the account's
home page and name with a salt. With **per-district salts** (the design's choice) the two
districts produce two unrelated keys, so a reader of the analytics store cannot tell that they
belong to one person. With **one global salt** the keys match and a red line shows that the
learner can be linked across districts. **Attacker view** hides the vault, the separate
PostgreSQL instance that holds the salts and the name-to-key mapping, and leaves only what an
analytics reader can see.

Clicking any level of the tree shows its boundary rule. The district boundary is **hard**: no
query may cross it except an explicit system-administrator benchmark of de-identified
aggregates above the privacy threshold. School, course and section boundaries are **soft**:
role-based access control at the API decides who sees what.

The tokens are illustrative. They come from FNV-1a, a simple non-cryptographic hash, so that the
sim runs anywhere; the design specifies HMAC-SHA256 keyed with the district salt. The identity
service that would compute real keys is designed and not yet built.

**Learning objective:** The learner will explain why a per-district salt gives one learner two
unrelated pseudonymous keys, and which boundaries are hard or soft.

**Bloom's taxonomy level:** Understand (verb: *explain*)

## How to Use

1. Before pressing anything, predict: will `learner-17` get the same key in District A and
   District B?
2. Press **Derive keys** with **Per-district salt** selected and compare the two key tokens.
3. Check **Attacker view** and read the analytics-store panel. Can the reader link the rows?
4. Select **One global salt**, press **Derive keys** again and watch the red link appear.
5. Change the learner account name and derive again: the keys change, but the pattern does not.
6. Click each level of the tree (System, a district, a school, a course, a section, a student)
   and read whether its boundary is hard or soft and how it is enforced.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/tenant-pseudonym-explorer/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

10-15 minutes

### Prerequisites

- What an xAPI statement's actor account contains (home page and name)
- The idea of a hash function as a one-way mapping from text to a short code
- The difference between a district, a school, a course and a section

### Activities

1. **Predict and derive (4 min):** Predict whether the two districts' keys will match, derive
   them with per-district salts, then with one global salt, and record both results.
2. **Take the attacker's seat (4 min):** In attacker view, list exactly what an analytics reader
   can see. Explain in two sentences why the per-district salt defeats linking and why the global
   salt does not.
3. **Map the boundaries (5 min):** Click every level and fill in a three-column table: level,
   hard or soft, how it is enforced. Add the textbook-deployment rule shown on the course level.

### Assessment

- The learner explains that the key depends on the salt, so different salts give unrelated keys
  for the same home page and name, and only the vault can connect them.
- The learner explains why deleting a district's salt makes its keys permanently underivable,
  and why one global salt would defeat that erasure.
- The learner correctly names the district boundary as hard and the school, course and section
  boundaries as soft, with the enforcement mechanism for each.

## References

1. [Pseudonymization](https://en.wikipedia.org/wiki/Pseudonymization) - Wikipedia. Replacing identifying fields with artificial identifiers.
2. [Salt (cryptography)](https://en.wikipedia.org/wiki/Salt_(cryptography)) - Wikipedia. Why a secret random value mixed into a hash changes every output.
3. [HMAC](https://en.wikipedia.org/wiki/HMAC) - Wikipedia. The keyed-hash construction the design specifies for real keys.
4. [Multitenancy](https://en.wikipedia.org/wiki/Multitenancy) - Wikipedia. One running system serving several isolated customers.
5. [Fowler-Noll-Vo hash function](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) - Wikipedia. The simple non-cryptographic hash used for the illustrative tokens.
6. [p5.js createRadio() reference](https://p5js.org/reference/p5/createRadio/) - p5.js. The control used to choose the salt handling.
