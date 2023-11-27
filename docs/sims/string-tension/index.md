# String Tension

Contributed by [Shawn McBurnie](https://www.linkedin.com/in/shawnmcburnie/).

![String Tension](./../img/string-tension.png)

* [String Tension Demo](./string-tension.html)

## Sample Prompt

```linenums="0"
Let's do a string tension demo next, based off this and changing only the contents of `customContent` and the title, which should be "String tension, 0.030 gauge". Let's have the slider controlling tension and going from 50% to 200% in 0.1% increments, the initial 100% tension producing a pitch of A220 and a visible vibration of 0.22Hz (still a standing wave) at a tension of 26.44 pounds, the 200% tension producing A440 and a visible vibration of 0.44Hz at a tension of 52.88 pounds, the 50% tension producing A110 and a visible vibration of 0.11Hz at 13.22 pounds of tension, and the label reflecting the percentage, the tension in pounds, and the named note with sharps and flats and + and - to indicate more than 20 cents higher and lower than the note. (Each note displayed should be the closest one to the actual pitch.) Please make sure that the tension, note names, and pitch are all based on the slider's tension multiplier relative to the initial A220, and that they correspond accurately to the relevant pitch. The initial label before the slider is moved from 100% should read: "100% tension, 26.44 pounds; A; 220Hz". Here's the code to base this on. I will have additional feedback and refinements as we go.
```
(The demo provided, omitted here for brevity, is [String harmonics](../string-harmonics).)

## ## P5.js Code (`customContent` and setup only; rest of code is from the [Template with Sound and Slider](../template-with-sound-and-slider)
```
customContent() {
    // Drawing the string
    stroke(0);
    strokeWeight(2);
    let stringY = height / 2;
    let leftEndX = 10;
    let rightEndX = width - 10;

    // Draw small circles at the endpoints
    fill(0);
    ellipse(leftEndX, stringY, 10, 10);
    ellipse(rightEndX, stringY, 10, 10);

    // Calculate tension and pitch based on slider value
    let tensionMultiplier = this.getSliderValue() / 100;
    let tension = 26.44 * tensionMultiplier; // Base tension for A220 is 26.44 pounds
    let frequency = 220 * tensionMultiplier; // Frequency changes with tension

    // Animating the string as a standing wave
    let visualFrequency = 0.22 * tensionMultiplier; // Adjust visual frequency with tension
    for (let x = leftEndX; x <= rightEndX; x++) {
      let proportion = (x - leftEndX) / (rightEndX - leftEndX);
      let angle = proportion * PI; // Full wave for a standing wave
      let y = stringY + sin(angle) * 25 * cos(frameCount * visualFrequency);
      point(x, y);
    }

    // Setting oscillator frequency
    this.oscillator.freq(frequency);

    // Updating the slider label with tension, note, and frequency
    let noteLabel = this.freqToNote(frequency); // Method to get note data based on frequency
    this.setSliderLabel(`${tensionMultiplier * 100}% tension, ${tension.toFixed(2)} pounds; ${noteLabel}; ${frequency.toFixed(2)}Hz`);
  }

  freqToNote(freq) {
    const A4 = 440; // Frequency of A4 in Hz
    const C0 = A4 * Math.pow(2, -4.75); // Frequency of C0
    const noteNames = ["C", "C# / D♭", "D", "D# / E♭", "E", "F", "F# / G♭", "G", "G# / A♭", "A", "A# / B♭", "B"];

    let h = Math.round(12 * Math.log2(freq / C0));
    let octave = Math.floor(h / 12);
    let n = h % 12; // Note index in the octave
    let noteName = noteNames[n];

    let standardFreq = C0 * Math.pow(2, h / 12); // Frequency of the closest standard note
    let cents = 1200 * Math.log2(freq / standardFreq); // Deviation in cents

    // Adjust note and octave if deviation is more than 50 cents
    if (cents > 50) {
      h += 1;
    } else if (cents < -50) {
      h -= 1;
    }
    octave = Math.floor(h / 12);
    n = h % 12;
    noteName = noteNames[n];

    // Determine sharpness or flatness
    let adjustment = "";
    if (cents > 20 && cents <= 50) {
      adjustment = "+";
    } else if (cents < -20 && cents >= -50) {
      adjustment = "-";
    }

    return `${noteName}${adjustment}`;
  }
}

// Modify the setup function to set the appropriate slider range
function setup() {
  demo = new DemoTemplate('String tension, 0.030 gauge');
  demo.setSliderRange([50, 200]); // Custom range
  demo.setup();
  demo.setInitialSliderValue(100);
}
```

## Sample Lesson Plan

### Grades K-2: Introduction to Vibrations and Sounds

#### Objective
- Understand basic concepts of vibration and how it creates sound.

#### Activities
- **Exploring Vibrations**: Use rubber bands of different thicknesses stretched over a box to show how vibrations create sound.
- **Simple Observations**: Ask students to pluck the rubber bands and observe how the sound changes with the thickness and tension of the rubber bands.
- **Crafting Instruments**: Create simple instruments using rubber bands and boxes, encouraging students to experiment with tension and listen to the different sounds produced.

---

### Grades 3-5: Discovering Pitch and Tension

#### Objective
- Understand how tension affects pitch.

#### Activities
- **Hands-On Experiment**: Use a guitar or a similar stringed instrument to demonstrate how tightening (increasing tension) and loosening (decreasing tension) strings changes the pitch.
- **Interactive Demonstration**: Introduce the p5.js demo. Allow students to adjust the slider and observe changes in pitch.
- **Group Discussion**: Discuss why tighter strings produce higher pitches and looser strings produce lower pitches.

---

### Grades 6-8: Exploring Frequency and Tension

#### Objective
- Dive deeper into the concept of frequency and how it relates to tension.

#### Activities
- **Mathematical Approach**: Introduce the basic formula relating tension, length, mass, and frequency. Discuss how changing each variable affects the frequency.
- **Practical Application**: Use the p5.js demo to adjust tension and observe frequency changes. Incorporate measurements and simple calculations.
- **Science Project**: Students create simple string instruments and experiment to find the right tension to produce specific notes.

---

### Grades 9-10: Physics of Sound Waves

#### Objective
- Understand sound waves and the physics behind string vibrations.

#### Activities
- **Advanced Theory**: Teach about waveforms, harmonics, and how string length and tension affect these.
- **Lab Experiment**: Use oscilloscopes or frequency-measuring apps to analyze frequencies produced by strings under different tensions.
- **Integration with the Demo**: Use the p5.js demo to visualize these concepts, explaining the math behind frequency calculation.

---

### Grades 11-12: Mathematical Modeling of String Tension

#### Objective
- Apply mathematical models to predict frequencies based on string tension.

#### Activities
- **Complex Calculations**: Introduce more complex formulas involving string density, length, tension, and frequency.
- **Research Project**: Assign a project where students research different stringed instruments, calculate expected frequencies based on string properties, and compare them to actual frequencies.
- **Coding Extension**: For students with coding knowledge, encourage them to modify or extend the p5.js demo to include additional variables like string length and density.

---

