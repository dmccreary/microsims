// Koch Fractile
let recursionSlider;
let len = 600;
let angle = 60;

function setup() {
    const canvas = createCanvas(620, 400);
    canvas.parent('canvas-container');
    recursionSlider = createSlider(0, 6, 0);
    recursionSlider.position(10, 10);
    recursionSlider.style('width', '400px');
    angleMode(DEGREES);
}

function draw() {
    background(51);
    translate(10, height / 4);
    let levels = recursionSlider.value();
    stroke(255);
    KochCurve(0, 0, len, 0, levels);
}

function KochCurve(x1, y1, x2, y2, levels) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dist = sqrt(dx*dx + dy*dy);
    let unit = dist / 3;
    let angle = atan2(dy, dx);
    if (levels > 0) {
        let x3 = x1 + dx / 3;
        let y3 = y1 + dy / 3;

        let x4 = x3 + cos(angle + 60) * unit;
        let y4 = y3 + sin(angle + 60) * unit;

        let x5 = x1 + dx * 2 / 3;
        let y5 = y1 + dy * 2 / 3;

        KochCurve(x1, y1, x3, y3, levels - 1);
        KochCurve(x3, y3, x4, y4, levels - 1);
        KochCurve(x4, y4, x5, y5, levels - 1);
        KochCurve(x5, y5, x2, y2, levels - 1);
    } else {
        line(x1, y1, x2, y2);
    }
}
