// A MicroSim of drawing a polygon.  Sliders controls the number of edges and the color.
let canvasSize = 400;
let polygonRadius = 150
let colorSlider;
let pointSlider;
let drawHeight = 350;
let sliderLeftMargin = 140;

function setup() { 
    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('canvas-container');
    textSize(16);
    noStroke();
    strokeWeight(0);
    // Change the default color scheme from RGB to Hue, Saturation and Brightness
    colorMode(HSB, 255);

    // number of points (or edges) in polygon
    pointSlider = createSlider(3, 20, 10);
    pointSlider.position(sliderLeftMargin, canvasSize - 35);
    pointSlider.style('width', width - sliderLeftMargin + 'px')

    colorSlider = createSlider(0, 255, 170);
    colorSlider.position(sliderLeftMargin, canvasSize - 15);
    colorSlider.style('width', width - sliderLeftMargin + 'px')
}

function draw() {
    fill(230);
    rect(0, 0, width, drawHeight);
    fill(245);
    rect(0, drawHeight, width, canvasSize-drawHeight);
    let colorValue = colorSlider.value();
    let pointValue = pointSlider.value();

    // Draw the polygon, HSB
    fill(colorValue, 255, 255);
    beginShape();
    for (let i = 0; i < pointValue; i++) {
        // walk around the 360 angles
        let angle = map(i, 0, pointValue, 0, TWO_PI);
        let x = canvasSize/2 + polygonRadius * cos(angle);
        let y = drawHeight/2 + polygonRadius * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    // Draw the slider values
    fill('black');
    noStroke(); 
    strokeWeight(0);
    text("Point Value: " + pointValue, 5, canvasSize - 25);
    text("Color Value: " + colorValue, 5, canvasSize - 5);  
}
