// p5.js sketch test
/// <reference types="p5/global" />

let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 30;
let contentWidth = 400;

function setup() {
    canvas = createCanvas(contentWidth, canvasHeight);
}

function draw() {
    background('aliceblue');
    fill('green');
    circle(200, 200, 50);

    // control region background is white
    fill('white');
    rect(0, drawHeight, 50);

    // Title at the top
    fill('black');
    textSize(24);
    textAlign(CENTER, TOP);
    text('This is the Title for my p5.js Sketch', width / 2, margin);
}
