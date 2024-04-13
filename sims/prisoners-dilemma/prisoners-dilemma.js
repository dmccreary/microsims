let buttonASilent, buttonABetray, buttonBSilent, buttonBBetray;
let lastChoiceA = "";
let lastChoiceB = "";
let outcome = "";
let col1 = 200;
let col2 = 500;

function setup() {
  createCanvas(800, 600);
  textSize(24);

  // Buttons for Prisoner A
  buttonASilent = createButton('Remain Silent');
  buttonASilent.position(150, 100);
  buttonASilent.mousePressed(() => updateChoices("A", "Silent"));

  buttonABetray = createButton('Betray Other');
  buttonABetray.position(150, 130);
  buttonABetray.mousePressed(() => updateChoices("A", "Betray"));

  // Buttons for Prisoner B
  buttonBSilent = createButton('Remain Silent');
  buttonBSilent.position(420, 100);
  buttonBSilent.mousePressed(() => updateChoices("B", "Silent"));

  buttonBBetray = createButton('Betray Other');
  buttonBBetray.position(420, 130);
  buttonBBetray.mousePressed(() => updateChoices("B", "Betray"));
}

function draw() {
  background('aliceblue');

  // Display Labels and Rectangles
  fill(200);
  stroke(2);
  rect(100, 40, 200, 50);
  rect(400, 40, 200, 50);
  
  textSize(24);
  textFont('Arial');
  textAlign(CENTER);
  fill('black');
  noStroke();
  text("Prisoner A", col1, 75);
  text("Prisoner B", col2, 75);

  // Draw buttons and checkmarks
  drawCheckmarks();

  // Show outcomes in a 2x2 grid
  noStroke();
  textSize(16);
  // text("A Chooses", 200, 190);
  text("Both Remain Silent: Lightest Sentence", col1, 250);
  text("Both Betray: Harsher Sentence", 500, 320);
  text("A Betrays, B Silent: A free, B max", col1, 320);
  text("B Betrays, A Silent: B free, A max", 500, 250);

  // Highlight outcome
  if (outcome !== "") {
    highlightOutcome();
  }
}

function updateChoices(prisoner, choice) {
  if (prisoner === "A") {
    lastChoiceA = choice;
  } else {
    lastChoiceB = choice;
  }
  determineOutcome();
}

function determineOutcome() {
  if (lastChoiceA === "Silent" && lastChoiceB === "Silent") {
    outcome = "silent";
  } else if (lastChoiceA === "Betray" && lastChoiceB === "Betray") {
    outcome = "betray";
  } else if (lastChoiceA === "Betray" && lastChoiceB === "Silent") {
    outcome = "aWins";
  } else if (lastChoiceB === "Betray" && lastChoiceA === "Silent") {
    outcome = "bWins";
  } else {
    outcome = "";
  }
}

function highlightOutcome() {
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();

  if (outcome === "silent") {
    rect(50, 230, 300, 30);
  } else if (outcome === "betray") {
    rect(360, 300, 300, 30);
  } else if (outcome === "aWins") {
    rect(50, 300, 300, 30);
  } else if (outcome === "bWins") {
    rect(360, 230, 300, 30);
  }
  noStroke();
}

function drawCheckmarks() {
  textSize(24);
  fill(0);
  text(lastChoiceA === "Silent" ? "✓" : "", 280, 120);
  text(lastChoiceA === "Betray" ? "✓" : "", 280, 150);
  text(lastChoiceB === "Silent" ? "✓" : "", 540, 120);
  text(lastChoiceB === "Betray" ? "✓" : "", 540, 150);
}
