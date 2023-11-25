# String Harmonics

Contributed by [Shawn McBurnie](https://www.linkedin.com/in/shawnmcburnie/).

![String Length](./../img/string-length.png)

* [String Length Demo](./string-length.html)

## Sample Prompt

```linenums="0"
Please update the `customContent` function contents in the following p5.js demo*, such that:
Let's do a new version of the following*, again leaving the template unchanged and add to customContent so the only nodes are at the ends and the slider controls a percentile float defaulting to 100% and adjustable down to 1% which controls the pitch (raising it an octave and doubling the visual frequency when the length is at 50%, for example) and also controls the position of the right node and thus the length of the string. Let's call it "Changing Pitch with String Length" and have the slider label display "Length: [number]%, Pitch: [number] Hz, "Note: [letter note with sharp or flat and plus or minus as appropriate]".

```
(The demo provided, omitted here for brevity, is [String Length](../string-length).)

## ## P5.js Code (`customContent` only)
```
customContent() {
    // Drawing the string
    stroke(0);
    strokeWeight(2);
    let stringY = height / 2;
    let leftEndX = 10;

    // Calculate the percentage length from the slider value
    let lengthPercent = this.getSliderValue();
    let currentLength = (width - 20) * (lengthPercent / 100);
    let currentEndX = leftEndX + currentLength;

    // Draw small circles at the endpoints
    fill(0);
    ellipse(leftEndX, stringY, 10, 10);
    ellipse(currentEndX, stringY, 10, 10);

    // Visual frequency and amplitude
    let amplitude = 25;
    let visualFrequency = 0.11 * (100 / lengthPercent); // Adjust frequency based on length

    // Draw the animated string segment
    for (let x = leftEndX; x <= currentEndX; x++) {
      let proportion = (x - leftEndX) / currentLength;
      let angle = proportion * PI;
      let y = stringY + sin(angle) * amplitude * cos(frameCount * visualFrequency);
      point(x, y);
    }

    // Adjusting the oscillator frequency based on string length
    let baseFreq = 110; // Base frequency for 100% length
    // Frequency changes inversely with string length
    lengthPercent = this.getSliderValue();
    let freqMultiplier = 100 / lengthPercent;
    let currentFreq = baseFreq * freqMultiplier;
    this.oscillator.freq(currentFreq);
// Method to convert frequency to musical note
    function freqToNote(frequency) {
  const A4 = 440;
  const notes = ['A', 'A# / B♭', 'B', 'C', 'C# / D♭', 'D', 'D# / E♭', 'E', 'F', 'F# / G♭', 'G', 'G# / A♭'];

  let numOctavesFromA4 = Math.log2(A4 / frequency);
  let totalCents = -1200 * numOctavesFromA4;
  let noteIndex = Math.round(totalCents / 100) % 12;
  noteIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
  let octave = Math.floor((totalCents / 1200) + 4);

  let nearestStandardNoteCents = Math.round(totalCents / 100) * 100;
  let deviation = totalCents - nearestStandardNoteCents;

  if (deviation >= 50) {
    noteIndex = (noteIndex + 1) % 12;
    octave += (noteIndex === 0) ? 1 : 0;
    deviation -= 100;
  }

  let adjustment = "";
  if (deviation > 30) {
    adjustment = "+";
  } else if (deviation < -30) {
    adjustment = "-";
  }

  let noteName = notes[noteIndex] + adjustment;
  return noteName;
}


    // Calculating the note
    let note = freqToNote(currentFreq);

    // Updating the slider label with length percentage, frequency, and note
    this.setSliderLabel(`Length: ${lengthPercent}%, Pitch: ${currentFreq.toFixed(2)} Hz, Note: ${note}`);
  }
```

## Sample Lesson Plan
## Lesson Plans Featuring "Changing Pitch with String Length" p5.js Demo

### Kindergarten to 2nd Grade: Exploring Sounds and Shapes

**Objective**: Introduce young students to the concept of sound and vibration through interactive play.

**Activities**:
1. **String Symphony**: Start by showing the p5.js demo. Let students interact with the slider to see how the string length changes the sound. Ask them to describe what they see and hear.
2. **Make Some Noise**: Create simple instruments using elastic bands and boxes. Let students experiment by plucking bands of different lengths and tightness, relating it back to the demo.
3. **Drawing Vibrations**: Have students draw what they think sound looks like, inspired by the vibrations they see in the demo.

### 3rd to 5th Grade: The Science of Sound

**Objective**: Understand basic principles of sound waves and pitch.

**Activities**:
1. **Interactive Demo Exploration**: Allow students to play with the demo, noting their observations. Discuss how changing the string length affects the pitch.
2. **Hands-On Experiment**: Use rulers and rubber bands to demonstrate tension and length's effect on sound. Students can predict and then test how sound changes.
3. **Musical Math**: Simple exercises to understand the relationship between string length and pitch. For example, if the string is half as long, how does the pitch change?

### 6th to 8th Grade: Physics of Music

**Objective**: Dive deeper into the physics behind musical instruments.

**Activities**:
1. **Demo Deep Dive**: Use the demo to explain the physics of sound waves. Discuss why the pitch changes with string length.
2. **Build an Instrument**: Students create their own string instruments, experimenting with different lengths and tensions, and then perform a simple tune.
3. **Frequency and Pitch**: Introduce the concept of frequency. Relate it back to the demo, showing how frequency changes with string length.

### High School: Advanced Sound Physics

**Objective**: Explore the mathematical and physical principles governing sound and harmonics.

**Activities**:
1. **Mathematics of Sound**: Use the demo to illustrate the mathematical relationship between string length and frequency. Discuss waveforms and harmonics.
2. **Lab Experiment**: Students measure frequency changes with string length adjustments on real instruments or string setups, and compare with the demo.
3. **History of Musical Tuning**: Discuss the historical development of musical scales and tuning systems, relating to frequency and harmonics.

### College/University: Acoustical Engineering Insights

**Objective**: Provide a technical understanding of sound production and manipulation in musical instruments.

**Activities**:
1. **Technical Analysis**: Analyze the p5.js demo code. Discuss how digital simulations can model physical phenomena.
2. **Research Project**: Students conduct a research project on the acoustical properties of different materials and their effect on sound.
3. **Seminar on Musical Acoustics**: Host a seminar with experts in musical instrument design, discussing the role of length, tension, and material in sound production.
