# Gold Star

<iframe src="main.html" height="450px" scrolling="no"></iframe>


[Run the Gold Star MicroSim](./main.html){ .md-button .md-button--primary }

!!! prompt
  Draw a gold star width number points as a parameter.
  Use the circle.js file as your template.

!!! prompt
  Draw a gold star with number points as a parameter.
  Use a slider so that the number of points range from 4 to 30.
  Make the default number of points be 10.
  Use the circle.js file as your template.

## Sample Code

```js
// Draw a gold star width number points as a parameter
let pointsSlider;
let width = 400;
let height = 430;
let drawHeight = 400;
let cx = width / 2;
let cy = height / 2;
let sliderLeftMargin = 100;

function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent('canvas-container');
  textSize(16);

  pointsSlider = createSlider(4, 20, 10);
  pointsSlider.position(90, height - 15);
  pointsSlider.style('width', width - sliderLeftMargin +'px');
}

function draw() {
  // fill the drawing area with a light gray background
  fill(220);
  rect(0,0,width,drawHeight);
  fill(245);
  rect(0,drawHeight,width,height);

  // radius
  const r = min(width, height) * 0.45;

  // points
  points = pointsSlider.value();

  // tempory move of coordinate system to center
  push();
     translate(cx, cy);
     star(0, 0, r * 0.6, r, points);
  pop();
  
  // draw the label and values in the control area
  fill(0);
  text("Points:" + points, 10, height - 10);
}

// draw star at (x,y) with inner and outer radius and n points
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  fill('gold');
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

```

## Key Learnings

1. We create a new custom JavaScript function called ```star()```
2. We add parameters for the inner radius, outer radius and number of points
3. We use the ```beginShape()``` and ```endShape()``` to surround our points on the start
4. We use ```cos()``` and ```sin()``` to calculate the proper x and y points as we go around the star

## Lesson Plan: Drawing Stars with Variable Points


### Objective
Students will understand the geometric concepts of radius, angles, and symmetry by drawing stars programmatically.

### Grade Level
9th Grade

### Subject
Geometry

### Materials Needed
- Computers with Internet access
- Projector for demonstration
- Students will need access to a web browser and provide a link to the [p5.js editor](https://editor.p5js.org/).
They can use the copy icon in the upper right corner of the code example above.

### Duration

1 hour

### Activities

#### Introduction (5 minutes)
- **Discussion:** Briefly discuss what students know about stars and their shapes. Introduce the concept of radius, angles, and symmetry in geometry.
- **Demonstration:** Show the star drawing code and explain the setup, draw functions, and the star function.

#### Activity Part 1: Exploring the Code (10 minutes)
- **Hands-On:** Students will run the code and play with the points slider to see how the number of points affects the star's shape.
- **Questions for Discussion:** 
  - How does changing the number of points alter the shape of the star?
  - What happens when you use different numbers of points (odd vs. even)?

#### Activity Part 2: Calculating Angles (15 minutes)

- **Explanation:** Explain how the angles in the star are calculated (`angle = TWO_PI / npoints`).
- **Activity:** Have students calculate the angles for different numbers of points and predict the shapes before testing them on the computer.

#### Activity Part 3: Customize the Lab (10 minutes)

- **Creative Task:** Challenge students to modify the code to create different variations of the lab
- **Add Color Sliders:** Add a slider to change the fill color of the star, the border color and the border width.  Students will
need to adjust the position of the sliders, labels and values.
You will need to learn to use the [strokeWeight](https://p5js.org/reference/#/p5/strokeWeight) function.
- **Add New Radius Sliders:** Add sliders for controlling the length of the inner and outer radius of the star.
- **Sharing:** Allow a few students to share their creations and explain the geometric concepts used.
- **Use ChatGPT:** Use ChatGPT to add new code and test the new code.

#### Conclusion (5 minutes)

- **Summary:** Recap the key geometric concepts learned through the activity.
- **Homework Assignment:** Students can write a short reflection on what they learned about geometry from this exercise or create a small project where they use the code to explore a geometric concept.

### Assessment

- Participation in discussions and activities.  Do they share their knowledge and their bugs?
- The ability of students to add features.
- Creativity and understanding of the concepts.

