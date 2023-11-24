// Draw a resistor symbol at x,y with width and height and lineWidth
// The orientation must be 'horizontal' or 'vertical'
function drawResistor(x, y, rwidth, rheight, lineWidth, orientation) {
    // light gray background
    fill(230)
    rect(x,y,rwidth,rheight)
    strokeWeight(lineWidth);
    // the percent of the length of the resistor that is taken by each end wire
    endWirePercent = .15
    endWireLength = rwidth * endWirePercent
    // draw end wires
    halfHeight = y+rheight/2
    
    // number of zig-zag peaks
    // The international symbol is 6
    let peaks = 6;
    let peakWidth = (rwidth-2*endWireLength) / peaks;
    let peakHeight = rheight / 3;
  
    if (orientation === 'horizontal') {
      beginShape();
      // left end wire
      line(x, halfHeight,x + endWireLength,halfHeight);
      // right end wire 
      line(x + rwidth-endWireLength, halfHeight,
         x+rwidth,halfHeight);
      vertex(x+endWireLength, halfHeight);
      for(let i = 0; i <= peaks -1; i++) {
        let xPos = x+endWireLength + i * peakWidth + peakWidth/2;
        let yPos = (i % 2 === 0) ? 
            halfHeight - peakHeight : 
            halfHeight + peakHeight;
        vertex(xPos, yPos);
      }
      vertex(x + rwidth-endWireLength , halfHeight);
      endShape();
    } 
    else if (orientation === 'vertical') {
      halfwidth = x+rwidth/2
      endWireLength = rheight * endWirePercent
      let peakHeight = rwidth / 3;
      let peakWidth = (rheight-2*endWireLength) / peaks;
      beginShape();
        // end wire
        vertex(halfwidth, y);
        vertex(halfwidth, y+endWireLength);
        for(let i = 0; i <= peaks - 1; i++) {
          let yPos = y+endWireLength + i * peakWidth + peakWidth/2;
          let xPos = (i % 2 === 0) ?
            halfwidth - peakHeight : 
            halfwidth + peakHeight;
          vertex(xPos, yPos);
        }
        // end wire
        vertex(halfwidth, y + rheight - endWireLength);
        vertex(halfwidth, y + rheight);
      endShape();
    }
  }
  
  function draw() {
    const canvas = createCanvas(400,400)
    background(255);
    drawResistor(50, 50, 150, 50, 2, 'horizontal');
    drawResistor(150, 200, 100, 200, 2, 'vertical');
  }