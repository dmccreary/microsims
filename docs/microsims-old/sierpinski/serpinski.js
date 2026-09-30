let points = [];
let current;

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
    let a = createVector(width / 2, height / 2 - 100);
    let b = createVector(width / 2 - 100, height / 2 + 100);
    let c = createVector(width / 2 + 100, height / 2 + 100);
    points.push(a, b, c);

    current = createVector(random(width), random(height));
    background(0);
}

function draw() {
    stroke(255, 100);
    strokeWeight(2);
    point(current.x, current.y);

    let next = random(points);
    current.x = lerp(current.x, next.x, 0.5);
    current.y = lerp(current.y, next.y, 0.5);
}