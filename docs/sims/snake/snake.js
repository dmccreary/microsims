// Snake Game v1.2.8
// Added snake growth when eating food

let snake;
let food;
let gridSize = 20;
let gridCount = 30;
let score = 0;
let gameOver = false;
let isGameRunning = false;
let gameSpeed = 5; // Reduced initial speed
let nextDirection = { x: 1, y: 0 }; // Buffer for next direction

function setup() {
    // Prevent arrow keys from scrolling the page
    window.addEventListener('keydown', function(e) {
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });
    const canvas = createCanvas(gridSize * gridCount, gridSize * gridCount);
    canvas.parent('game-container');
    
    // Set up speed slider handler
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    
    // Initialize speed control
    speedSlider.value = gameSpeed;
    speedValue.textContent = gameSpeed;
    
    // Handle speed changes
    speedSlider.addEventListener('input', function() {
        gameSpeed = parseInt(this.value);
        speedValue.textContent = gameSpeed;
        frameRate(gameSpeed);
    });
    
    // Set initial frame rate
    frameRate(gameSpeed);

    // Set up start/pause button handler
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        if (gameOver) {
            resetGame();
            isGameRunning = true;
            this.textContent = 'Pause';
            loop();
        } else {
            togglePause();
        }
    });
    
    frameRate(gameSpeed);
    snake = new Snake();
    food = createFood();
    noLoop(); // Start with the game paused
}

function draw() {
    background('aliceblue');
    
    if (!gameOver && isGameRunning) {
        // Draw food first so it appears under the snake
        fill(255, 0, 0);
        rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        
        // Update and show snake
        snake.update();
        snake.show();
        
        // Check if snake ate food
        if (snake.head.x === food.x && snake.head.y === food.y) {
            snake.grow();
            food = createFood();
            score++;
            // Increase speed slightly with each food eaten
            if (gameSpeed < 15) {
                gameSpeed += 0.5;
                frameRate(gameSpeed);
                document.getElementById('speed-slider').value = gameSpeed;
                document.getElementById('speed-value').textContent = Math.round(gameSpeed);
            }
        }
        
        // Check if snake hit walls
        if (snake.head.x < 0 || snake.head.x >= gridCount ||
            snake.head.y < 0 || snake.head.y >= gridCount) {
            gameOver = true;
        }
    } else {
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0);
        text('Game Over!\nScore: ' + score + '\nPress SPACE to restart', width/2, height/2);
    }
    
    // Display score
    textSize(20);
    textAlign(LEFT, TOP);
    fill(0);
    text('Score: ' + score, 10, 10);
}

function togglePause() {
    if (!gameOver) {
        isGameRunning = !isGameRunning;
        const startButton = document.getElementById('start-button');
        startButton.textContent = isGameRunning ? 'Pause' : 'Start';
        if (isGameRunning) {
            loop();
        } else {
            noLoop();
        }
    }
}

function keyPressed() {
    if (gameOver) {
        return;
    }

    // Handle space bar for pause
    if (keyCode === 32) { // SPACE
        togglePause();
        return;
    }
    
    // Allow direction changes even when paused
    switch (keyCode) {
        case UP_ARROW:
            if (nextDirection.y !== 1) { // Not moving down
                snake.dir(0, -1);
            }
            break;
        case DOWN_ARROW:
            if (nextDirection.y !== -1) { // Not moving up
                snake.dir(0, 1);
            }
            break;
        case LEFT_ARROW:
            if (nextDirection.x !== 1) { // Not moving right
                snake.dir(-1, 0);
            }
            break;
        case RIGHT_ARROW:
            if (nextDirection.x !== -1) { // Not moving left
                snake.dir(1, 0);
            }
            break;
    }
}

function createFood() {
    let pos;
    do {
        pos = {
            x: floor(random(gridCount)),
            y: floor(random(gridCount))
        };
    } while (snake.body.some(part => part.x === pos.x && part.y === pos.y));
    return pos;
}

function resetGame() {
    snake = new Snake();
    food = createFood();
    score = 0;
    gameOver = false;
    isGameRunning = false;
    frameRate(gameSpeed);
    const startButton = document.getElementById('start-button');
    startButton.textContent = 'Start';
    redraw();
    noLoop();
}

class Snake {
    constructor() {
        this.body = [];
        // Start with a length of 3
        for (let i = 0; i < 3; i++) {
            this.body[i] = {
                x: floor(gridCount/2) - i,
                y: floor(gridCount/2)
            };
        }
        this.xSpeed = 1;
        this.ySpeed = 0;
        nextDirection = { x: 1, y: 0 }; // Reset next direction
    }
    
    get head() {
        return this.body[0];
    }
    
    dir(x, y) {
        // Allow any direction change, including reversal
        nextDirection = { x: x, y: y };
    }
    
    update() {
        // Apply buffered direction change
        this.xSpeed = nextDirection.x;
        this.ySpeed = nextDirection.y;
        
        let newHead = {
            x: this.head.x + this.xSpeed,
            y: this.head.y + this.ySpeed
        };
        
        this.body.unshift(newHead);
        this.body.pop();
    }
    
    grow() {
        // Add new segment at the current tail position
        let tail = this.body[this.body.length - 1];
        this.body.push({...tail});
    }
    
    checkCollision() {
        // Check walls
        if (this.head.x < 0 || this.head.x >= gridCount ||
            this.head.y < 0 || this.head.y >= gridCount) {
            return true;
        }
        
        // Check self collision
        for (let i = 1; i < this.body.length; i++) {
            if (this.head.x === this.body[i].x && 
                this.head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
    
    show() {
        // Draw snake body segments with gradient from head to tail
        for (let i = 0; i < this.body.length; i++) {
            const part = this.body[i];
            const green = map(i, 0, this.body.length - 1, 255, 100);
            fill(0, green, 0);
            rect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        }
    }
}
