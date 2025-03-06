function drawLadybug(x, y, rotation) {
    push();
    translate(x, y);
    rotate(rotation+PI/2);
    
    // Draw ladybug body
    fill(255, 0, 0); // Red for ladybug
    stroke(0);
    strokeWeight(1);
    ellipse(0, 0, ladybugSize * 2, ladybugSize * 2.5);
    
    // Draw ladybug head
    fill(0);
    ellipse(0, -ladybugSize * 1.2, ladybugSize * 1.2, ladybugSize * 1.2);
    
    // Draw spots
    fill(0);
    ellipse(-ladybugSize/2, ladybugSize/2, ladybugSize/2, ladybugSize/2);
    ellipse(ladybugSize/2, ladybugSize/2, ladybugSize/2, ladybugSize/2);
    ellipse(0, 0, ladybugSize/2, ladybugSize/2);
    
    pop();
  }