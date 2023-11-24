let canvasSize = 400;
let polygonRadius = 150
let colorSlider;
let pointSlider;

function setup() { 
    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('canvas-container');
    textSize(16);
    colorMode(HSB, 255);

    // number of points (or edges) in polygon
    pointSlider = createSlider(3, 20, 10);
    pointSlider.position(105, canvasSize - 30);
    pointSlider.style('width', '300px')

    colorSlider = createSlider(0, 255, 170);
    colorSlider.position(105, canvasSize - 10);
    colorSlider.style('width', '300px')
}

function draw() {
    background(240);
    let colorValue = colorSlider.value();
    let pointValue = pointSlider.value();

    // Draw the polygon, HSB
    fill(colorValue, 255, 255);
    beginShape();
    for (let i = 0; i < pointValue; i++) {
        // walk around the 360 angles
        let angle = map(i, 0, pointValue, 0, TWO_PI);
        let x = canvasSize/2 + polygonRadius * cos(angle);
        let y = canvasSize/2 + polygonRadius * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    // Draw the slider values
    fill('black');
    text("Point Value: " + pointValue, 5, canvasSize - 25);
    text("Color Value: " + colorValue, 5, canvasSize - 5);  
}
