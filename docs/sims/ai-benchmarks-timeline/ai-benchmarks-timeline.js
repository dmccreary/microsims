// AI Benchmarks Timeline MicroSim
// Based on https://editor.p5js.org/dmccreary/sketches/bN-pfoUih
// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Timeline data structure - AI Benchmarks
let events = [
  { year: 1997, name: "WordNet", description: "One of the earliest linguistic resources for NLP tasks, providing a lexical database of English words grouped into sets of cognitive synonyms." },
  { year: 2002, name: "TREC-QA", description: "Text REtrieval Conference Question Answering track, one of the first standardized benchmarks for evaluating question answering systems." },
  { year: 2009, name: "ImageNet", description: "Large visual database designed for visual object recognition research, containing over 14 million images organized according to the WordNet hierarchy." },
  { year: 2011, name: "MMLU Precursor", description: "Early multi-task, multi-domain evaluation methods for natural language understanding tasks that laid groundwork for future comprehensive benchmarks." },
  { year: 2013, name: "SQuAD 1.0", description: "Stanford Question Answering Dataset, a reading comprehension dataset consisting of questions posed on Wikipedia articles." },
  { year: 2015, name: "VQA", description: "Visual Question Answering dataset, combining image understanding and language processing to answer questions about visual content." },
  { year: 2016, name: "MS MARCO", description: "Microsoft MAchine Reading COmprehension dataset, containing real anonymized queries from Bing search engine and human-generated answers." },
  { year: 2017, name: "SQuAD 2.0", description: "Enhanced version of SQuAD that includes unanswerable questions, requiring models to determine when questions cannot be answered based on the provided content." },
  { year: 2018.2, name: "GLUE", description: "General Language Understanding Evaluation benchmark, a collection of diverse natural language understanding tasks to evaluate model performance." },
  { year: 2019.1, name: "SuperGLUE", description: "More challenging successor to GLUE with more difficult language understanding tasks, designed to test the limits of language models." },
  { year: 2020.3, name: "TyDiQA", description: "Typologically Diverse Question Answering dataset spanning 11 languages with different linguistic characteristics, testing multilingual capabilities." },
  { year: 2021.1, name: "BIG-bench", description: "Beyond the Imitation Game benchmark, featuring 204 tasks designed to probe large language models on capabilities requiring complex reasoning." },
  { year: 2021.7, name: "MMLU", description: "Massive Multitask Language Understanding benchmark testing knowledge across 57 subjects including STEM, humanities, and more." },
  { year: 2022.2, name: "HumanEval", description: "Programming benchmark requiring models to generate functionally correct Python code from docstrings, testing coding capabilities." },
  { year: 2022.8, name: "HellaSwag", description: "Benchmark for commonsense natural language inference, requiring models to complete scenarios with commonsense reasoning." },
  { year: 2023.2, name: "GPQA", description: "Graduate-level Professional Questions & Answers benchmark featuring expert-level medical and scientific questions requiring deep domain knowledge." },
  { year: 2023.5, name: "MATH", description: "A dataset of 12K challenging competition math problems requiring multi-step reasoning and advanced mathematical knowledge." },
  { year: 2023.8, name: "MedQA", description: "Medical domain benchmark featuring questions from medical licensing exams across multiple countries, testing specialized medical knowledge." },
  { year: 2024.1, name: "LegalBench", description: "Comprehensive evaluation suite for legal reasoning covering contract analysis, statutory interpretation, and legal reasoning tasks." },
  { year: 2024.4, name: "MedBench", description: "Advanced medical benchmark covering diagnostics, treatment planning, and medical reasoning across numerous specialties." },
  { year: 2024.7, name: "MINT", description: "Mathematical INTelligence benchmark featuring advanced mathematical reasoning problems from algebra to topology." },
  { year: 2025.2, name: "MultiPerspective", description: "Benchmark evaluating models' ability to consider multiple perspectives on complex social and ethical questions." },
  { year: 2025.7, name: "CodeArena", description: "Advanced programming benchmark testing full-stack development capabilities across multiple programming languages and frameworks." }
];

// UI Controls
let timeScaleSlider;
let categoryToggle;
let hoverEvent = null;
let showLabels = true;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Create timeline scale slider
  timeScaleSlider = createSlider(0, 100, 50, 1);
  timeScaleSlider.position(margin + 140, drawHeight + 25);
  timeScaleSlider.size(containerWidth - margin - 280);
  
  // Create label toggle checkbox
  showLabelsCheckbox = createCheckbox('Show Labels', true);
  showLabelsCheckbox.position(containerWidth - 120, drawHeight + 25);
  showLabelsCheckbox.changed(function() {
    showLabels = this.checked();
  });
  
  describe('An AI benchmarks timeline visualization showing the evolution of AI evaluation metrics over time.', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Title
  fill('black');
  noStroke();
  textSize(28);
  textAlign(CENTER, TOP);
  text("Evolution of AI Benchmarks", canvasWidth/2, 15);
    
  // Draw legend for benchmark categories
  drawLegend();
  
  let controlRegionLabelY = drawHeight + 15;
  // Draw control labels
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text("Visualization Scale:", margin, drawHeight + 35);
  text("Linear", margin + 140, controlRegionLabelY);
  textAlign(RIGHT, CENTER);
  text("Logarithmic", containerWidth - 140, controlRegionLabelY);
  
  // Draw timeline
  drawTimeline();
  
  // Draw hover information if applicable
  if (hoverEvent !== null) {
    drawEventInfo(hoverEvent);
  }

}

function drawLegend() {
  let legendX = margin;
  let legendY = 60;
  let legendSpacing = 20;
  
  fill('black');
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Benchmark Categories:", legendX, legendY);
  
  // Early era
  stroke(70, 130, 180);
  strokeWeight(3);
  line(legendX, legendY + legendSpacing, legendX + 20, legendY + legendSpacing);
  fill('black');
  noStroke();
  text("Early Foundations (pre-2015)", legendX + 30, legendY + legendSpacing);
  
  // Middle era
  stroke(60, 179, 113);
  strokeWeight(3);
  line(legendX, legendY + legendSpacing*2, legendX + 20, legendY + legendSpacing*2);
  fill('black');
  noStroke();
  text("Comprehensive Benchmarks (2015-2019)", legendX + 30, legendY + legendSpacing*2);
  
  // Recent era
  stroke(255, 140, 0);
  strokeWeight(3);
  line(legendX, legendY + legendSpacing*3, legendX + 20, legendY + legendSpacing*3);
  fill('black');
  noStroke();
  text("Specialized Evaluation (2020-2023)", legendX + 30, legendY + legendSpacing*3);
  
  // Current/Future era
  stroke(220, 20, 60);
  strokeWeight(3);
  line(legendX, legendY + legendSpacing*4, legendX + 20, legendY + legendSpacing*4);
  fill('black');
  noStroke();
  text("Advanced Domain Expertise (2024+)", legendX + 30, legendY + legendSpacing*4);
}

function drawTimeline() {
  // Set up timeline area
  let timelineY = drawHeight - margin - 50;
  let timelineHeight = 150;
  let startX = margin*2;
  let endX = canvasWidth - margin;
  let timelineWidth = endX - startX;
  
  push();
  translate(10, 50);
  // Draw timeline axis
  stroke('black');
  strokeWeight(2);
  line(startX, timelineY, endX, timelineY);
  
  // Get time range - use floor and ceiling to get whole years
  let minYear = Math.floor(Math.min(...events.map(e => Math.floor(e.year))));
  let maxYear = Math.ceil(Math.max(...events.map(e => Math.ceil(e.year))));
  let timeRange = maxYear - minYear;
  
  // Calculate scale factor based on slider
  let scaleFactor = timeScaleSlider.value() / 100;
  
  // Draw year x axis markers
  let yearStep = 1; // Changed to 1 year steps for more precise timeline
  textAlign(CENTER, TOP);
  textSize(12);
  fill('black');
  noStroke();
  
  for (let year = minYear; year <= maxYear; year += yearStep) {
    // Apply scaling to position
    let x;
    if (scaleFactor < 0.5) {
      // More linear
      let linearFactor = 1 - (scaleFactor * 2);
      let logFactor = scaleFactor * 2;
      
      let linearX = map(year, minYear, maxYear, startX, endX);
      let normalizedYear = (year - minYear) / timeRange;
      let expYear = Math.pow(normalizedYear, 3); // Exponential scaling
      let logX = map(expYear, 0, 1, startX, endX);
      
      x = linearX * linearFactor + logX * logFactor;
    } else {
      // More logarithmic/exponential
      let normalizedYear = (year - minYear) / timeRange;
      let power = 1 + (scaleFactor - 0.5) * 5; // Adjust power based on slider
      let expYear = Math.pow(normalizedYear, power);
      x = map(expYear, 0, 1, startX, endX);
    }
    
    // Draw tick
    stroke('black');
    strokeWeight(1);
    line(x, timelineY, x, timelineY + 5);
    
    // Draw year label
    noStroke();
    fill('black');
    text(year, x, timelineY + 10);
  }
  
  // Pre-process to identify and resolve label collisions
  let processedEvents = setupLabelPositions();
  
  // Draw events
  for (let i = 0; i < processedEvents.length; i++) {
    let event = processedEvents[i];
    
    // Apply scaling to position
    let x;
    if (scaleFactor < 0.5) {
      // More linear
      let linearFactor = 1 - (scaleFactor * 2);
      let logFactor = scaleFactor * 2;
      
      let linearX = map(event.year, minYear, maxYear, startX, endX);
      let normalizedYear = (event.year - minYear) / timeRange;
      let expYear = Math.pow(normalizedYear, 3); // Exponential scaling
      let logX = map(expYear, 0, 1, startX, endX);
      
      x = linearX * linearFactor + logX * logFactor;
    } else {
      // More logarithmic/exponential
      let normalizedYear = (event.year - minYear) / timeRange;
      let power = 1 + (scaleFactor - 0.5) * 5; // Adjust power based on slider
      let expYear = Math.pow(normalizedYear, power);
      x = map(expYear, 0, 1, startX, endX);
    }
    
    // Store the x position for later use
    event.xPos = x;
    
    // Draw event line - increasingly taller as time progresses
    strokeWeight(2);
    
    // Color lines by era
    if (Math.floor(event.year) < 2015) {
      stroke(70, 130, 180); // Steel blue for early era
    } else if (Math.floor(event.year) < 2020) {
      stroke(60, 179, 113); // Medium sea green for middle era
    } else if (Math.floor(event.year) < 2024) {
      stroke(255, 140, 0);  // Dark orange for recent era
    } else {
      stroke(220, 20, 60);  // Crimson for current/future era
    }
    
    // Make line height grow exponentially with time
    // Earlier events get shorter lines, recent events get much taller lines
    let normalizedYear = (Math.floor(event.year) - minYear) / timeRange;
    let heightFactor = Math.pow(normalizedYear, 1.5); // Adjust power to control height growth
    let lineHeight = map(heightFactor, 0, 1, 50, timelineHeight * 1.5);
    
    // Use the vertical offset for staggering
    lineHeight = lineHeight + event.verticalOffset;
    
    // Store the line height for hover detection
    event.lineHeight = lineHeight;
    
    line(x, timelineY, x, timelineY - lineHeight);
    
    // Draw event circle
    fill(255);
    ellipse(x, timelineY - lineHeight, 10, 10);
    
    // Check for hover
    if (dist(mouseX, mouseY, x, timelineY - lineHeight) < 10 || 
        (mouseX > x - 5 && mouseX < x + 5 && 
         mouseY > timelineY - lineHeight && mouseY < timelineY)) {
      hoverEvent = {
        event: event,
        x: x,
        y: timelineY - lineHeight
      };
    }
    
    // Draw name label with consistent angle (removed variable angle feature)
    if (showLabels) {
      push();
      translate(x, timelineY - lineHeight - 10);
      rotate(PI/4); // Consistent angle for all labels
      fill('black');
      noStroke();
      textSize(11);
      textAlign(RIGHT, CENTER);
      text(event.name, 0, 0);
      pop();
    }
  }
  pop();
}

// Function to set up label positions to avoid collisions
function setupLabelPositions() {
  // Create a copy of the events array for processing
  let processedEvents = JSON.parse(JSON.stringify(events));
  
  // Group events by year to handle multiple events in the same year
  let eventsByYear = {};
  processedEvents.forEach(event => {
    let year = Math.floor(event.year);
    if (!eventsByYear[year]) {
      eventsByYear[year] = [];
    }
    eventsByYear[year].push(event);
  });
  
  // Process each year group
  Object.keys(eventsByYear).forEach(year => {
    let eventsInYear = eventsByYear[year];
    
    // If multiple events in the same year, stagger them
    if (eventsInYear.length > 1) {
      // Sort events within the year by their exact year value 
      // (which might include decimal portion)
      eventsInYear.sort((a, b) => a.year - b.year);
      
      // Calculate vertical offsets to stagger the events
      eventsInYear.forEach((event, index) => {
        // Alternate offset directions for events in the same year
        let staggerDistance = 20; // Pixels between events
        
        if (index % 2 === 0) {
          // Even indices: negative offset (shorter line)
          event.verticalOffset = -staggerDistance * Math.floor(index/2);
        } else {
          // Odd indices: positive offset (taller line)
          event.verticalOffset = staggerDistance * Math.ceil(index/2);
        }
      });
    } else {
      // Single event in this year
      eventsInYear[0].verticalOffset = 0;
    }
  });
  
  // Flatten the processed events back into a single array
  let result = [];
  Object.values(eventsByYear).forEach(yearEvents => {
    result = result.concat(yearEvents);
  });
  
  return result;
}

function drawEventInfo(eventData) {
  let event = eventData.event;
  let x = eventData.x;
  let y = eventData.y;
  
  // Calculate box position based on mouse position
  let boxX = x + 20;
  let boxY = y - 20;
  let boxWidth = 300;
  let boxHeight = 120;
  
  // Adjust box position to keep it within canvas
  if (boxX + boxWidth > canvasWidth - 10) {
    boxX = x - boxWidth - 20;
  }
  if (boxY + boxHeight > drawHeight - 10) {
    boxY = y - boxHeight - 20;
  }
  if (boxY < 10) {
    boxY = 10;
  }
  
  // Draw info box
  fill(255, 255, 220);
  stroke(100);
  strokeWeight(1);
  rect(boxX, boxY, boxWidth, boxHeight, 5);
  
  // Draw event info
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  text(event.name + " (" + Math.floor(event.year) + ")", boxX + 10, boxY + 10);
  textSize(14);
  textLeading(18);
  text(event.description, boxX + 10, boxY + 35, boxWidth - 20, boxHeight - 45);
}

function mouseMoved() {
  hoverEvent = null;
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  
  // Resize slider to match the new canvasWidth
  timeScaleSlider.size(containerWidth - margin - 280);
  timeScaleSlider.position(margin + 140, drawHeight + 25);
  
  // Reposition checkbox
  showLabelsCheckbox.position(containerWidth - 120, drawHeight + 25);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}