# Mobile Compatible Buttons

## Native p5.js Buttons

Using the native p5.js createButton() function is indeed an excellent alternative that would solve your iPhone compatibility issues. This approach has several advantages:

Using p5.js's built-in createButton() function offers several advantages over canvas-drawn buttons:

1.  **Native touch support**: The buttons are actual HTML elements that work correctly on all devices including iPhones, with no special handling needed for touch events.

2.  **Accessibility**: HTML buttons are keyboard-accessible and work with screen readers, making your application more accessible.

3.  **Styling flexibility**: You can easily style the buttons using CSS properties like in the example code.

4.  **Cleaner interaction code**: You don't need to track mouse/touch positions and check bounds - just use the mousePressed() callback function.

5.  **State management**: You can easily show/hide buttons based on the application state using the show() and hide() methods.

The key changes in this implementation:

-   Created HTML buttons with createButton() instead of drawing them on the canvas
-   Added button event handlers (startSolving, resetMaze, createNewMaze)
-   Implemented show/hide logic for the buttons based on the application state
-   Added CSS styling to make the buttons visually appealing

This approach should work perfectly on iPhones and all other devices without requiring any special handling for touch events.

## Creating Rect Buttons

There common issue with canvas-based interactions on mobile devices like iPhones running the Apple Safari Browser. The problem stems from how touch events differ from mouse events. Here are the key issues and solutions:

1. Mobile Safari on iPhone processes touch events differently than mousePressed() events
2. The coordinates might be off due to different handling of touch positions
3. Canvas scaling can affect the touch coordinate mapping

To fix this, you should implement touch event handling alongside mouse events. Here's how to modify the maze solver code to work on iPhones:

The key changes I've made to make the buttons work on iPhone:

1. Created a shared `handleInteraction()` function that works with both mouse and touch coordinates
2. Added proper touch event handlers: `touchStarted()`, `touchMoved()`, and `touchEnded()`
3. Prevented default touch behaviors that can interfere with canvas interactions
4. Made the buttons slightly larger and more touch-friendly
5. Added `pixelDensity(1)` to handle high-DPI displays properly
6. Made the slider more touch-friendly with increased height

These changes should make the maze solver work correctly on iPhones while maintaining compatibility with desktop browsers. The most important part is handling both mouse and touch events through a unified interaction handler.

```js
// Function to handle both mouse and touch interactions
function handleInteraction(px, py) {
    // Check if clicked/touched on Solve button
    if (px > canvasWidth - 100 && px < canvasWidth - 20 &&
        py > drawHeight + 10 && py < drawHeight + 40) {
        
        if (!solving && solutionPath.length === 0) {
            // Start solving
            resetSolving();
            solving = true;
        } else {
            // Reset if already solving or solved
            resetSolving();
        }
        return;
    }
    
    // Check if clicked/touched on New Maze button
    if (px > canvasWidth - 190 && px < canvasWidth - 110 &&
        py > drawHeight + 10 && py < drawHeight + 40) {
        
        createMaze();
        generateMaze();
        resetSolving();
    }
}

// Original mouse event handler
function mousePressed() {
    handleInteraction(mouseX, mouseY);
}

// Add touch event handlers
function touchStarted() {
    // Get the touch coordinates relative to the canvas
    if (touches.length > 0) {
        handleInteraction(touches[0].x, touches[0].y);
    }
    // Prevent default touch behavior to avoid scrolling
    return false;
}

// Optional: Add additional touch support for mobile
function touchMoved() {
    // Prevent default to disable page scrolling when touching canvas
    return false;
}

// Fix for slider interaction on mobile
function touchEnded() {
    // Allow default behavior for sliders
    if (mouseX > margin && mouseX < canvasWidth - margin &&
        mouseY > drawHeight + 30 && mouseY < drawHeight + 50) {
        return true;
    }
    return false;
}

// In setup, add this code to properly position canvas on mobile
function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    var mainElement = document.querySelector('main');
    canvas.parent(mainElement);
    textSize(defaultTextSize);
    
    // Handle high-DPI displays for better text rendering
    pixelDensity(1);
    
    // Create solver speed slider with touch-friendly size
    solveSpeedSlider = createSlider(0, 60, 8, 1);
    solveSpeedSlider.position(margin, drawHeight + 40);
    solveSpeedSlider.size(canvasWidth - 2*margin);
    // Make the slider touch-friendly
    solveSpeedSlider.style('height', '20px');
    
    // Initialize maze
    cols = floor((canvasWidth - 2*margin) / cellSize);
    rows = floor((drawHeight - 2*margin) / cellSize);
    
    createMaze();
    generateMaze();
    
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    
    resetSolving();
}

// In drawUI, make buttons larger and more touch-friendly
function drawUI() {
    // Draw controls and labels
    fill(0);
    text("Solve Speed: " + solveSpeed, margin, drawHeight + 25);
    
    // Green "Solve" button with larger touch area
    if (!solving && solutionPath.length === 0) {
        fill(0, 150, 0);
        rect(canvasWidth - 100, drawHeight + 10, 80, 35);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Solve", canvasWidth - 60, drawHeight + 27);
        textAlign(LEFT, BASELINE);
    }
    
    // Maroon Reset button when running
    if (solving || solutionPath.length > 0) {
        fill(150, 0, 0);
        rect(canvasWidth - 100, drawHeight + 10, 80, 35);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Reset", canvasWidth - 60, drawHeight + 27);
        textAlign(LEFT, BASELINE);
    }
    
    // New Maze button
    fill(0, 0, 150);
    rect(canvasWidth - 200, drawHeight + 10, 90, 35);
    fill(255);
    textAlign(CENTER, CENTER);
    text("New Maze", canvasWidth - 155, drawHeight + 27);
    textAlign(LEFT, BASELINE);
}
```