let canvasWidth = 400;
let drawHeight = 400;
let canvasHeight = 450;
let sliderLeftMargin = 120;

function setup {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    // canvas.parent('canvas-container');
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    textSize(16);

    // create a new slider at th bottom of the canvas
    mySlider = createSlider(0, 100, 50, 1);
    mySlider.position(sliderLeftMargin, drawHeight + 12);
    mySlider.style('width', canvasWidth -  sliderLeftMargin - 20 + 'px');
 
}

function draw() {
    // make the background drawing region light gray
    fill('aliceblue');
    rect(0, 0, canvasWidth, canvasWidth);
    // make the background of the controls white
    fill('white')
    rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight);

    // get the updated slider value
    val = mySlider.value();

    // draw the sim here
    circle(canvasWidth/2, drawHeight/2, val)

    // draw label and value
    text("MySlider: " +  val, 10, drawHeight + 25)
}