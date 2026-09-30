// The Three Languages Working Together MicroSim
// Venn-style diagram showing how HTML, CSS, and JavaScript combine
// Conforms to MicroSim layout conventions.

// ========== Canvas & Layout Globals ==========
let canvasWidth;
let drawHeight = 400;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;

let containerWidth;
let containerHeight = canvasHeight;

let margin = 32;

// ========== Venn Diagram Globals ==========
let circleRadius;
let htmlC, cssC, jsC;

let currentRegion = null;
let centerClicked = false;

// Colors
let htmlColor, cssColor, jsColor;

// Definitions for tooltips
const regionInfo = {
  HTML: {
    title: "HTML - Structure",
    text:
      "HTML defines the structure of the page: elements, containers, and the canvas holder."
  },
  CSS: {
    title: "CSS - Style",
    text:
      "CSS controls appearance: colors, fonts, spacing, layout, and positioning."
  },
  JS: {
    title: "JavaScript - Behavior",
    text:
      "JavaScript adds behavior: animation, interaction, p5.js logic, and DOM events."
  },
  HTML_CSS: {
    title: "HTML + CSS - Styled Elements",
    text:
      "Styled elements combine semantic HTML with visual rules from CSS."
  },
  HTML_JS: {
    title: "HTML + JavaScript - DOM Manipulation",
    text:
      "JavaScript can create, modify, and remove HTML elements dynamically."
  },
  CSS_JS: {
    title: "CSS + JavaScript - Dynamic Styling",
    text:
      "JavaScript can change CSS at runtime, enabling dynamic UIs."
  },
  ALL: {
    title: "HTML + CSS + JavaScript - Complete MicroSim",
    text:
      "A complete MicroSim uses HTML for structure, CSS for styling, and JavaScript for animation and interactivity."
  }
};

const centerExtraText =
  "In this MicroSim, HTML provides the container, CSS keeps the canvas responsive, and JavaScript implements all drawing and logic logic.";

// ========== Setup ==========
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector("main"));

  textFont("Helvetica");

  htmlColor = color("#4A90D9");
  cssColor = color("#5CB85C");
  jsColor = color("#F0AD4E");

  initializeCircles();

  describe(
    "Interactive Venn diagram showing how HTML, CSS, and JavaScript combine to create a complete MicroSim.",
    LABEL
  );
}

function updateCanvasSize() {
  const container = document.querySelector("main").getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  initializeCircles();
  redraw();
}

// ========== Circle Geometry ==========
function initializeCircles() {
  circleRadius = min(canvasWidth * 0.22, drawHeight * 0.3);

  const yTop = drawHeight * 0.35;
  const xLeft = canvasWidth * 0.35;
  const xRight = canvasWidth * 0.65;
  const yBottom = drawHeight * 0.62;

  htmlC = { x: xLeft,  y: yTop,    r: circleRadius };
  cssC  = { x: xRight, y: yTop,    r: circleRadius };
  jsC   = { x: (xLeft + xRight)/2, y: yBottom, r: circleRadius };
}

// ========== Main Draw ==========
function draw() {

  // Top region
  fill("aliceblue");
  stroke("silver");
  rect(0, 0, canvasWidth, drawHeight);

  // Bottom region
  fill("white");
  stroke("silver");
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();

  updateCurrentRegion();
  drawVennDiagram();
  drawArrowsAndLabels();
  drawCallouts();
  drawTooltipPanel();
}

// ========== Title ==========
function drawTitle() {
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(getResponsiveTextSize(24));
  text("The Three Languages Working Together", canvasWidth / 2, margin * 0.4);
}

// ========== Venn Diagram ==========
function drawVennDiagram() {
  drawSingleCircle(htmlC, htmlColor, "HTML\nStructure", [
    "Elements",
    "Canvas container",
    "Iframe wrapper",
    "Document organization"
  ], "HTML");

  drawSingleCircle(cssC, cssColor, "CSS\nStyle", [
    "Colors",
    "Layout",
    "Spacing",
    "Fonts",
    "Positioning"
  ], "CSS");

  drawSingleCircle(jsC, jsColor, "JavaScript\nBehavior", [
    "Animation",
    "Interaction",
    "p5.js",
    "Logic",
    "Events"
  ], "JS");
}

function drawSingleCircle(c, baseColor, title, items, id) {
  let isActive = false;

  if (currentRegion) {
    if (id === "HTML") {
      isActive = ["HTML", "HTML_CSS", "HTML_JS", "ALL"].includes(currentRegion);
    } else if (id === "CSS") {
      isActive = ["CSS", "HTML_CSS", "CSS_JS", "ALL"].includes(currentRegion);
    } else if (id === "JS") {
      isActive = ["JS", "HTML_JS", "CSS_JS", "ALL"].includes(currentRegion);
    }
  }

  const alpha = isActive ? 160 : 80;
  const cfill = color(red(baseColor), green(baseColor), blue(baseColor), alpha);

  stroke(baseColor);
  strokeWeight(isActive ? 4 : 2);
  fill(cfill);

  circle(c.x, c.y, c.r * 2);

  drawCircleIcon(c, id, baseColor);

  // Title
  fill(0); 
  noStroke();
  textAlign(CENTER, TOP);
  textSize(getResponsiveTextSize(16));
  text(title, c.x, c.y - c.r * 0.3);

  // Items
  textAlign(LEFT, TOP);
  textSize(getResponsiveTextSize(13));
  let y = c.y - c.r * 0.05;
  const x = c.x - c.r * 0.4;
  const spacing = getResponsiveTextSize(15);

  for (let item of items) {
    text(item, x, y);
    y += spacing;
  }
}

function drawCircleIcon(c, id, baseColor) {
  push();
  translate(c.x - c.r * 0.4, c.y - c.r * 0.45);
  stroke(baseColor);
  strokeWeight(2);
  noFill();

  if (id === "HTML") {
    // blocks
    fill(baseColor);
    let s = c.r * 0.12;
    rect(0, 0, s, s);
    rect(s * 1.2, 0, s, s);
    rect(s * 0.6, -s * 1.2, s, s);

  } else if (id === "CSS") {
    // palette
    fill(baseColor);
    let r = c.r * 0.13;
    ellipse(0, 0, r * 2, r * 1.6);
    fill(255);
    ellipse(-r * 0.4, -r * 0.2, r * 0.4);
    fill("#FF6666");
    ellipse(r * 0.2, -r * 0.2, r * 0.3);
    fill("#66CCFF");
    ellipse(0, r * 0.2, r * 0.3);

  } else if (id === "JS") {
    // lightning bolt
    noStroke();
    fill(baseColor);
    let s = c.r * 0.16;
    beginShape();
    vertex(0, -s * 0.5);
    vertex(s * 0.4, -s * 0.05);
    vertex(s * 0.1, -s * 0.05);
    vertex(s * 0.5, s * 0.6);
    vertex(0, s * 0.2);
    vertex(-s * 0.3, s * 0.2);
    endShape(CLOSE);
  }

  pop();
}

// ========== Arrows + Labels ==========
function drawArrowsAndLabels() {

  textSize(getResponsiveTextSize(13));
  fill(0);
  textAlign(CENTER, CENTER);
  stroke(0);
  strokeWeight(1.5);

  // HTML → CSS
  drawArrowBetween(
    htmlC.x + htmlC.r * 0.7, htmlC.y - htmlC.r * 0.1,
    cssC.x - cssC.r * 0.7,  htmlC.y - htmlC.r * 0.1,
    "CSS selects and styles HTML elements",
    -20
  );

  // HTML → JS
  drawArrowBetween(
    htmlC.x - htmlC.r * 0.1, htmlC.y + htmlC.r * 0.4,
    jsC.x - jsC.r * 0.7,     jsC.y,
    "JavaScript creates and manipulates HTML",
    20
  );

  // CSS ↔ JS
  let sx = cssC.x + cssC.r * 0.15;
  let sy = cssC.y + cssC.r * 0.4;
  let ex = jsC.x + jsC.r * 0.7;
  let ey = jsC.y;

  drawArrow(sx, sy, ex, ey);
  drawArrow(ex, ey, sx, sy);
  noStroke();
  text("JavaScript can modify CSS; CSS affects canvas", (sx + ex)/2, (sy + ey)/2 + 18);
}

function drawArrowBetween(x1, y1, x2, y2, label, labelOffset) {
  drawArrow(x1, y1, x2, y2);
  noStroke();
  text(label, (x1 + x2)/2, (y1 + y2)/2 + labelOffset);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  rotate(atan2(y2 - y1, x2 - x1));
  fill(0);
  noStroke();
  triangle(0, 0, -8, 4, -8, -4);
  pop();
}

// ========== Callouts ==========
function drawCallouts() {
  fill(60);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(getResponsiveTextSize(12));

  text("<canvas id='sim'>", htmlC.x - htmlC.r * 0.9, htmlC.y - htmlC.r * 0.9);
  text("width: 100%; border: none;", cssC.x - cssC.r * 0.1, cssC.y - cssC.r * 0.95);
  text("createCanvas(400, 450)", jsC.x - jsC.r * 0.4, jsC.y + jsC.r * 0.9);
}

// ========== Tooltip Panel ==========
function drawTooltipPanel() {
  const pad = 16;
  const top = drawHeight + pad;
  const w = canvasWidth - pad * 2;

  let title = "Hover over a region to see its definition";
  let body =
    "Move your mouse around the diagram. Hover to explore each region. Click the center to see how all three combine.";

  if (currentRegion && regionInfo[currentRegion]) {
    title = regionInfo[currentRegion].title;
    body = regionInfo[currentRegion].text;

    if (currentRegion === "ALL" && centerClicked) {
      body += "\n\n" + centerExtraText;
    }
  } else if (centerClicked) {
    title = "Complete MicroSim (Center Clicked)";
    body = centerExtraText;
  }

  fill(0);
  noStroke();
  textAlign(LEFT, TOP);

  textSize(getResponsiveTextSize(18));
  text(title, pad, top, w, controlHeight - pad);

  textSize(getResponsiveTextSize(14));
  text(body, pad, top + getResponsiveTextSize(22), w, controlHeight - pad * 2);
}

// ========== Region Detection ==========
function updateCurrentRegion() {
  if (mouseY < 0 || mouseY > drawHeight) {
    currentRegion = null;
    return;
  }

  const x = mouseX, y = mouseY;
  const inHTML = dist(x, y, htmlC.x, htmlC.y) < htmlC.r;
  const inCSS  = dist(x, y, cssC.x,  cssC.y) < cssC.r;
  const inJS   = dist(x, y, jsC.x,   jsC.y)  < jsC.r;

  const count = (inHTML?1:0) + (inCSS?1:0) + (inJS?1:0);

  if (count === 1) {
    currentRegion = inHTML ? "HTML" : inCSS ? "CSS" : "JS";
  } else if (count === 2) {
    if (inHTML && inCSS) currentRegion = "HTML_CSS";
    else if (inHTML && inJS) currentRegion = "HTML_JS";
    else if (inCSS && inJS) currentRegion = "CSS_JS";
  } else if (count === 3) {
    currentRegion = "ALL";
  } else {
    currentRegion = null;
  }
}

function mouseClicked() {
  if (currentRegion === "ALL") {
    centerClicked = !centerClicked;
  }
}

// ========== Utility ==========
function getResponsiveTextSize(base) {
  return constrain(base * (canvasWidth / 800), base * 0.8, base * 1.4);
}
