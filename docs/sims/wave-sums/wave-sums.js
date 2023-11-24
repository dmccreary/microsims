// add waveforms
let checkboxes = [];
let frequencies = [1, 2, 3, 4];
let margin = 10
let amplitude = 30;

function setup() {
  const canvas = createCanvas(400, 600);
  canvas.parent('canvas-container');
  for(let i=0; i<4; i++){
    checkboxes[i] = createCheckbox('Include in sum', false);
    checkboxes[i].position(20, i*90+10);
  }
}

function draw() {
  background(240);
  let y = 10;
  let sumWave = [];
  for(let i=0; i<4; i++){
    if(checkboxes[i].checked()){
      let wave = drawWave(20, y, width-40, 80, frequencies[i]);
      if(sumWave.length == 0){
        sumWave = wave;
      } else {
        for(let j=0; j<wave.length; j++){
          sumWave[j] += wave[j];
        }
      }
    } else {
      drawWave(20, y, width-40, 80, frequencies[i]);
    }
    y += 90;
  }
  
  // Draw sum wave
  textSize(20);
  fill('black')
  text("Sum of Waveforms:", 10, 390);
  strokeWeight(4)
  beginShape();
  noFill();
  for(let i=0; i<sumWave.length; i++){
    vertex(i+20, y + 120 - sumWave[i]);
  }
  endShape();
}

function drawWave(x, y, w, h, freq) {
  fill('white')
  strokeWeight(1)
  // added bounding box
  rect(x,y,w,h)
  let wave = [];
  beginShape();
  noFill();
  for(let i=x; i<=x+w; i++){
    let angle = map(i, x, x+w, 0, TWO_PI * freq);
    let sinValue = sin(angle) * amplitude;
    vertex(i, y + h/2 - sinValue);
    wave.push(sinValue);
  }
  endShape();
  return wave;
}
