// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;

// Layout constants
let margin = 25;
let sliderLeftMargin = 90;
let defaultTextSize = 16;

// Responsive design variables
let containerHeight = canvasHeight;
let containerWidth = canvasWidth;

// UI controls
let depthSlider;
let speedSlider;
let startButton;
let multipleBugsCheckbox;

// Animation state
let isAnimating = false;
let isComplete = false;
let animationSpeed = 10;
let multipleBugs = true;
let completedBranches = [];
let completedLeaves = [];
let ladybugs = [];
let branchStack = [];

// Tree parameters
let branchLength = 120;
let branchShrink = 0.7;
let maxDepth = 5;

// Ladybug properties
let ladybugSize = 10;

// Tree commands and mapping
let commands = [];
let branchMap = {};
let nextBranchID = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  depthSlider = createSlider(1, 10, 5, 1);
  depthSlider.position(sliderLeftMargin, drawHeight + 10);
  depthSlider.size(canvasWidth - sliderLeftMargin - 120);

  depthSlider.input(() => {
    if (!isAnimating) {
      generateCommands();
      ladybugs = [];
      branchStack = [];
      completedBranches = [];
      completedLeaves = [];
    }
  });

  speedSlider = createSlider(1, 30, 10, 1);
  speedSlider.position(sliderLeftMargin, drawHeight + 35);
  speedSlider.size(canvasWidth - sliderLeftMargin - 120);

  multipleBugsCheckbox = createCheckbox('Multiple Bugs', true);
  multipleBugsCheckbox.position(canvasWidth - 100, drawHeight + 5);
  multipleBugsCheckbox.changed(function() {
    multipleBugs = this.checked();
    if (!isAnimating) {
      ladybugs = [];
      branchStack = [];
    }
  });

  startButton = createButton('Start');
  startButton.position(canvasWidth - 100, drawHeight + 30);
  startButton.size(80, 30);
  startButton.mousePressed(toggleAnimation);

  generateCommands();
}

function draw() {
  updateCanvasSize();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  maxDepth = depthSlider.value();
  animationSpeed = speedSlider.value();

  drawCompletedBranches();

  for (let bug of ladybugs) {
    push();
    translate(bug.startX, bug.startY);
    rotate(bug.rotation + PI / 2);
    strokeWeight(bug.weight);
    stroke(139, 69, 19);
    let distance = dist(bug.startX, bug.startY, bug.x, bug.y);
    line(0, 0, 0, -distance);
    pop();
  }

  drawCompletedLeaves();

  for (let bug of ladybugs) {
    drawLadybug(bug.x, bug.y, bug.rotation);
  }

  if (isAnimating) {
    updateLadybugs();
    if (ladybugs.length === 0 && (multipleBugs || branchStack.length === 0)) {
      isComplete = true;
      startButton.html('Reset');
    }
  }

  fill('black');
  noStroke();
  text(`Depth: ${maxDepth}`, 10, drawHeight + 25);
  text(`Speed: ${animationSpeed}`, 10, drawHeight + 50);
}

function drawCompletedBranches() {
  for (let cmd of completedBranches) {
    push();
    translate(cmd.x, cmd.y);
    rotate(cmd.rotation);
    strokeWeight(cmd.weight);
    stroke(139, 69, 19);
    line(0, 0, 0, -cmd.length);
    pop();
  }
}

function drawCompletedLeaves() {
  for (let leaf of completedLeaves) {
    push();
    translate(leaf.x, leaf.y);
    fill(34, 139, 34);
    noStroke();
    ellipse(0, 0, 10, 15);
    pop();
  }
}

function drawLadybug(x, y, rotation) {
  push();
  translate(x, y);
  rotate(rotation + PI / 2);
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, ladybugSize * 2, ladybugSize * 2.5);
  fill(0);
  ellipse(0, -ladybugSize * 1.2, ladybugSize * 1.2, ladybugSize * 1.2);
  fill(0);
  ellipse(-ladybugSize / 2, ladybugSize / 2, ladybugSize / 2, ladybugSize / 2);
  ellipse(ladybugSize / 2, ladybugSize / 2, ladybugSize / 2, ladybugSize / 2);
  ellipse(0, 0, ladybugSize / 2, ladybugSize / 2);
  pop();
}

function generateCommands() {
  commands = [];
  nextBranchID = 0;
  branchMap = {};
  generateTreeCommands(width / 2, drawHeight, branchLength, maxDepth, 0);
  for (let cmd of commands) {
    if (cmd.type === 'branch') {
      branchMap[cmd.id] = cmd;
    }
  }
}

function generateTreeCommands(x, y, length, depth, rotation) {
  let branchID = nextBranchID++;
  let branchCmd = {
    type: 'branch',
    id: branchID,
    x: x,
    y: y,
    length: length,
    rotation: rotation,
    weight: map(depth, 0, 10, 1, 20),
    children: []
  };
  commands.push(branchCmd);

  let endX = x + sin(rotation) * length;
  let endY = y - cos(rotation) * length;

  if (depth === 0) {
    commands.push({
      type: 'leaf',
      x: endX,
      y: endY,
      rotation: rotation
    });
  } else {
    let leftChildID = generateTreeCommands(endX, endY, length * branchShrink, depth - 1, rotation + PI / 6);
    let rightChildID = generateTreeCommands(endX, endY, length * branchShrink, depth - 1, rotation - PI / 6);
    branchCmd.children = [leftChildID, rightChildID];
  }
  return branchID;
}

function updateLadybugs() {
  let stepSize = animationSpeed / 1000;
  if (multipleBugs) {
    for (let i = ladybugs.length - 1; i >= 0; i--) {
      let bug = ladybugs[i];
      bug.progress += stepSize;
      if (bug.progress >= 1) {
        bug.x = bug.targetX;
        bug.y = bug.targetY;
        let branchCmd = branchMap[bug.branchID];
        if (branchCmd.children.length > 0) {
          for (let childID of branchCmd.children) {
            let childCmd = branchMap[childID];
            let newLadybug = {
              branchID: childID,
              startX: bug.targetX,
              startY: bug.targetY,
              targetX: bug.targetX + sin(childCmd.rotation) * childCmd.length,
              targetY: bug.targetY - cos(childCmd.rotation) * childCmd.length,
              x: bug.targetX,
              y: bug.targetY,
              rotation: childCmd.rotation - PI / 2,
              weight: childCmd.weight,
              progress: 0,
              completed: false
            };
            ladybugs.push(newLadybug);
          }
        } else {
          completedLeaves.push({ x: bug.targetX, y: bug.targetY });
        }
        completedBranches.push(branchCmd);
        ladybugs.splice(i, 1);
      } else {
        bug.x = lerp(bug.startX, bug.targetX, bug.progress);
        bug.y = lerp(bug.startY, bug.targetY, bug.progress);
      }
    }
  } else {
    if (ladybugs.length === 0 && branchStack.length > 0) {
      let nextBranch = branchStack.pop();
      let newLadybug = {
        branchID: nextBranch.id,
        startX: nextBranch.x,
        startY: nextBranch.y,
        targetX: nextBranch.x + sin(nextBranch.rotation) * nextBranch.length,
        targetY: nextBranch.y - cos(nextBranch.rotation) * nextBranch.length,
        x: nextBranch.x,
        y: nextBranch.y,
        rotation: nextBranch.rotation - PI / 2,
        weight: nextBranch.weight,
        progress: 0,
        completed: false
      };
      ladybugs.push(newLadybug);
    }
    for (let i = ladybugs.length - 1; i >= 0; i--) {
      let bug = ladybugs[i];
      bug.progress += stepSize;
      if (bug.progress >= 1) {
        bug.x = bug.targetX;
        bug.y = bug.targetY;
        let branchCmd = branchMap[bug.branchID];
        if (branchCmd.children.length > 0) {
          for (let j = branchCmd.children.length - 1; j >= 0; j--) {
            branchStack.push(branchMap[branchCmd.children[j]]);
          }
        } else {
          completedLeaves.push({ x: bug.targetX, y: bug.targetY });
        }
        completedBranches.push(branchCmd);
        ladybugs.splice(i, 1);
      } else {
        bug.x = lerp(bug.startX, bug.targetX, bug.progress);
        bug.y = lerp(bug.startY, bug.targetY, bug.progress);
      }
    }
  }
}

function toggleAnimation() {
  if (isComplete) {
    isAnimating = false;
    isComplete = false;
    ladybugs = [];
    branchStack = [];
    completedBranches = [];
    completedLeaves = [];
    generateCommands();
    startButton.html('Start');
  } else if (isAnimating) {
    isAnimating = false;
    startButton.html('Resume');
  } else {
    if (ladybugs.length === 0 && branchStack.length === 0) {
      generateCommands();
      let rootCmd = commands.find(cmd => cmd.type === 'branch');
      if (multipleBugs) {
        ladybugs = [{
          branchID: rootCmd.id,
          startX: rootCmd.x,
          startY: rootCmd.y,
          targetX: rootCmd.x + sin(rootCmd.rotation) * rootCmd.length,
          targetY: rootCmd.y - cos(rootCmd.rotation) * rootCmd.length,
          x: rootCmd.x,
          y: rootCmd.y,
          rotation: rootCmd.rotation - PI / 2,
          weight: rootCmd.weight,
          progress: 0,
          completed: false
        }];
      } else {
        branchStack = [rootCmd];
      }
    }
    isAnimating = true;
    startButton.html('Pause');
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  depthSlider.position(sliderLeftMargin, drawHeight + 15);
  depthSlider.size(canvasWidth - sliderLeftMargin - 120);
  speedSlider.position(sliderLeftMargin, drawHeight + 40);
  speedSlider.size(canvasWidth - sliderLeftMargin - 120);
  multipleBugsCheckbox.position(canvasWidth - 100, drawHeight + 5);
  startButton.position(canvasWidth - 100, drawHeight + 30);
  if (!isAnimating) {
    generateCommands();
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}