# Animated Wire MicroSim

[Run the Animated Wire MicroSim](./animated-wire.html)

## Sample Animate Wire Function

```js
// Function for drawing an animated wire
function drawAnimatedWire(x1, y1, x2, y2, speed1, state) {
    if (state) {
        let distance = dist(x1, y1, x2, y2);
        let circlePos = map((millis() * speed1) % distance, 0, distance, 0, 1);

        let x = lerp(x1, x2, circlePos);
        let y = lerp(y1, y2, circlePos);

        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2);

        fill(255, 0, 0);
        noStroke();
        circle(x, y, 10);
    } else {
        stroke(0);
        strokeWeight(lineWidth)
        line(x1, y1, x2, y2);
    }
}
```