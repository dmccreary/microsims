---
title: Gateway Request Simulator
description: Build a batch of xAPI statements, set the token and broker, predict whether the ingestion gateway accepts or rejects it, and watch the five request steps return 200, 400 with every violation, 401 or 503 with Retry-After.
image: /sims/gateway-request-simulator/gateway-request-simulator.png
og:image: /sims/gateway-request-simulator/gateway-request-simulator.png
twitter:image: /sims/gateway-request-simulator/gateway-request-simulator.png
social:
   cards: false
quality_score: 100
---

# Gateway Request Simulator

<iframe src="main.html" height="622px" width="100%" scrolling="no"></iframe>

[Run the Gateway Request Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The ingestion gateway is the front door of the full Learning Record Store. For every
`POST /xapi/statements` request it does five things in a fixed order: it **authenticates** the
bearer token, **validates** every statement against the producer contract, **assigns ids** and a
`stored_at` time, **produces** the batch to the durable queue, and **responds** only after the
queue has acknowledged the write.

This simulator lets you build a batch of up to five statement cards, some valid and some with
one of four defects: a wrong verb (`completed`), an `answered` statement without
`result.success`, a missing `grouping`, and a page IRI with a fragment. Two checkboxes set the
state of the world: whether the token is valid and whether the broker is reachable. When you send
the batch, it moves through the five steps and the response panel shows what the real gateway
returns:

- `401` when the token is missing or unrecognised: the batch stops at step 1.
- `400` when any statement breaks the contract: every card turns red, the violation list shows
  the `index`, `field` and contract section of each problem, and zero statements reach the queue,
  valid ones included.
- `503` with `Retry-After: 5` when the broker is unreachable and the local queue is full.
- `200` with the array of statement ids once the whole batch is durably queued.

The violation text is shortened from the repository's `validation.py`, and the order of checks
follows its `app.py`. The ids are illustrative stand-ins for UUIDv7 values.

**Learning objective:** The learner will demonstrate the gateway's five request steps and predict
whether a batch is accepted or rejected in full.

**Bloom's taxonomy level:** Apply (verb: *demonstrate*)

## How to Use

1. The sim opens with two valid statements and one `answered` statement without a result.
   With **Predict first** checked, press **Send batch**, then choose **Accepted** or
   **Rejected** before the gateway runs.
2. Read the response: which step failed, how many statements were queued, and which `index`
   and `field` each violation names.
3. Click a broken card to remove it, then send again. Watch the ids appear at step 3 and the
   cards move to the queue at step 4.
4. Add a statement with each defect from the **Defect** list and predict the result of each
   batch.
5. Uncheck **Token is valid**, or **Broker reachable**, send a valid batch, and compare the
   `401` and `503` responses with the `400`. **Reset** clears the batch and the queue.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/gateway-request-simulator/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15-20 minutes

### Prerequisites

- The parts of an xAPI statement and the three MicroSim verbs (Chapter 16)
- The producer contract rules on verbs, results, grouping and page IRIs (Chapter 16)
- HTTP status codes in general (200, 400, 401, 503)

### Activities

1. **Predict five batches (8 min):** For each batch below, predict the status code before
   sending, then check: three valid statements; three valid plus one wrong verb; two broken
   statements with different defects; three valid with the token unchecked; three valid with the
   broker unchecked.
2. **Read the violation list (4 min):** For the two-defect batch, write down each `index`,
   `field` and contract section, and explain why the valid statements were not stored either.
3. **Explain the order (5 min):** In pairs, explain why authentication comes before validation,
   and why the gateway replies only after the queue acknowledges the write.

### Assessment

- The learner names the five steps in order and the status code each failure produces.
- The learner correctly predicts that one broken statement causes the whole batch to be rejected
  with zero statements queued.
- The learner explains that a `503` with `Retry-After: 5` is the one failure where the gateway
  could not make a statement durable, and why the design treats it as page-worthy.

## References

1. [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) - Wikipedia. The meaning of 200, 400, 401 and 503.
2. [Experience API](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia. The xAPI standard whose statements the gateway accepts.
3. [xAPI Specification](https://github.com/adlnet/xAPI-Spec) - ADL on GitHub. The Statement Resource and its all-or-nothing batch rule.
4. [Apache Kafka](https://en.wikipedia.org/wiki/Apache_Kafka) - Wikipedia. The kind of durable log-based queue the gateway produces to.
5. [p5.js createSelect() reference](https://p5js.org/reference/p5/createSelect/) - p5.js. The control used to choose a defect.
