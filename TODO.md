# TODO

<!-- p5js-v2-audit-2026-09-05 -->
## p5.js 2.x Upgrade: MicroSim Fixes Needed (2026-09-05)

A static scan of this repo's `docs/sims/` MicroSims found **5 sim(s)** using p5.js v1-only APIs that will break if upgraded to p5.js 2.x (the microsim-generator skill's templates now default to p5@2.3.2). Fix these before bumping this repo's MicroSims past p5@1.x.

- [ ] **book-gen-workflow** (`docs/sims/book-gen-workflow/`)
    - `book-gen-workflow.js` uses the old multi-control-point `bezierVertex(...)` call — v2 takes one control point per `bezierVertex()` call — chain multiple calls instead of packing several points into one; use `bezierOrder()` for a quadratic curve.
- [ ] **breadboard** (`docs/sims/breadboard/`)
    - `breadboard-horiz-small.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
    - `breadboard-vector.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
    - `breadboard.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
    - `push-buttons.js` uses `preload()`, which p5.js v2 removed entirely — move the loading calls into `async function setup()` and `await` each `load*()` call before `createCanvas()`.
- [ ] **curve** (`docs/sims/curve/`)
    - `curve-percent.js` uses `curveVertex(...)`, renamed to `splineVertex()` in v2 with changed anchor-point rules — rename to `splineVertex()`; drop the old duplicated first/last anchor points and rely on `endShape(CLOSE)` for a smooth closed loop.
- [ ] **flower-petal** (`docs/sims/flower-petal/`)
    - `flower-petal.js` uses `quadraticVertex(...)`, folded into `bezierVertex()` in v2 — replace with `bezierOrder(2)` followed by single-control-point `bezierVertex()` calls.
- [ ] **temp-and-pressure** (`docs/sims/temp-and-pressure/`)
    - `temp-and-pressure.js` uses the old multi-control-point `bezierVertex(...)` call — v2 takes one control point per `bezierVertex()` call — chain multiple calls instead of packing several points into one; use `bezierOrder()` for a quadratic curve.

Reference: [p5.js Teachers' Guide to v2 transition](https://p5js.org/tutorials/v2_transition/)
