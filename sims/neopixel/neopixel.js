// neopixel simulator
let canvasWidth = 600;
let canvasHeight = 300;
let numPackets = 4;
let packets = [];
let neoPixels = [];
let simulationRunning = false;
let neoPixelHorizPos = canvasWidth * .75;
let neoPixelVertPos = canvasHeight * .75;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  neoPixelColor = color(255, 255, 255);

  let startButton = createButton('Start');
  startButton.mousePressed(function() {
    simulationRunning = true;
  });

  let stopButton = createButton('Stop');
  stopButton.mousePressed(function() {
    simulationRunning = false;
  });

  let resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);

  resetSimulation();
}

function draw() {
  background(220);

  // Draw NeoPixel
  draw_neopixel(neoPixels[0]);
  
  // lines
  fill('darkgray');
  stroke('darkgray')
  // horiz packet track
  line(0,30,canvasWidth,30);
  // vertical neopixel line
  line(neoPixelHorizPos,0,neoPixelHorizPos,canvasHeight);

  if (simulationRunning) {
    if (packets.length < 4) {
      create_packet();
    }
    move_packet();
  }

  // Draw packets
  draw_packets();

}

function draw_packets() {
    for (let i = 0; i < packets.length; i++) {
    draw_packet(packets[i]);
  }
}

function create_packet(index,x,y) {
  let packet = {
    i: index,
    x: x,
    y: y,
    r: int(random(255)),
    g: int(random(255)),
    b: int(random(255))
  };
  // add to our list of packets
  packets.push(packet);
}

// x, y is at the center
function create_neopixel(x, y, r, g, b, state) {
  let neopixel = {
    x: x,
    y: y,
    r: r,
    g: g,
    b: b,
    s: state
  };
  // add to our list of neopixels
  neoPixels.push(neopixel);
}


// should be named move_all_packets?
function move_packet() {
  // for each packet
  for (let i = 0; i < packets.length; i++) {
    // move right
    packets[i].x += 2;
    
    // check if 0 at NeoPixel
    if (packets[0].x >= neoPixelHorizPos - 30 && packets[0].x <= neoPixelHorizPos - 28 && neoPixels[0].s == 0) {
      neoPixels[0].r = packets[i].r;
      neoPixels[0].g = packets[i].g;
      neoPixels[0].b = packets[i].b;
      draw_neopixel(neoPixels[0]);
      neoPixels[0].s = 1;
      remove_packet(0);
    }
  }
}

function remove_packet(index) {
  packets.splice(index, 1);
}

function draw_packet(packet) {
  fill(50); // Dark gray fill for packets
  rect(packet.x, packet.y, 60, 20); // Draw packet
  draw_circles(packet);
  noStroke();
  fill('black')
  textSize(14);
  textAlign(CENTER);
  // 
  text(str(packet.i), packet.x+30, packet.y-5);
  
  // draw rgb values under packet
  textSize(10);
  text(str(packet.r), packet.x+50, packet.y+30);
  text(str(packet.g), packet.x+30, packet.y+30);
  text(str(packet.b), packet.x+10, packet.y+30);
}

function draw_circles(packet) {
  fill(packet.r, 0, 0); // Use packet's red value
  circle(packet.x + 49, packet.y + 10, 15);
  fill(0, packet.g, 0); // Use packet's green value
  circle(packet.x + 30, packet.y + 10, 15);
  fill(0, 0, packet.b); // Use packet's blue value
  circle(packet.x + 11, packet.y + 10, 15);
}

function draw_neopixel(neopixel) {
  fill(neopixel.r, neopixel.g, neopixel.b);
  circle(neopixel.x, neopixel.y, 40);
  fill(0);
  textSize(16);
  text(str(neopixel.r) + ' ' +
       str(neopixel.g) + ' ' +
      str(neopixel.b),
      neoPixelHorizPos, neoPixelVertPos+50)
}

function resetSimulation() {
  packets = [];
  neoPixels = [];
  // x, y, r, g, b, state
  // state is if we got the r,g and b values set
  create_neopixel(neoPixelHorizPos, neoPixelVertPos, 0, 0, 0, 0);
  // create packets
  for (let i = 0; i < numPackets; i++) {
    // hard coded for 4 here. 65 is 5 between
    x = 200 - (i * 65);
    y=20;
    create_packet(i,x,y);
  }
}
