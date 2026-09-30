# Cover Image Prompt

Please generate a professional-quality cover image for this textbook.
This image will be used in social media previews and must follow the
formatting guidelines for an Open Graph image preview.

**Required specifications:**

- Format: PNG
- Wide-landscape format
- Size: 1200x630 pixels (1.91:1 aspect ratio). If the tool cannot produce this exact size, use its widest landscape option and keep all important elements inside the central 90% so the image can be cropped to 1.91:1.
- This is the Open Graph standard for social media previews

The image has four layers, back to front: background montage, color
treatment, mascot, and title text.

## Subject & Tone

**MicroSims 2.0: Generating, Instrumenting and Evaluating Interactive Learning Objects with AI** is a textbook about creating small, AI-generated, interactive simulations (MicroSims) for education, and about using the xAPI event streams they produce to predict whether a student has mastered a concept. The intended audience is teachers, instructional designers, learning-technology developers and learning-analytics practitioners (college undergraduate and professional development).

The visual tone should be modern, technical and optimistic, with a playful touch from the mascot. It should look like a credible learning-technology publication, not a children's book and not a generic stock-art AI cover.

## Title

Place the title text **MicroSims 2.0** in the left half of the image, vertically centered, in a very bold, clean, highly legible geometric sans-serif (similar to Avenir Next Heavy or Montserrat ExtraBold).

- "MicroSims" in white, on the first line, in very large type.
- "2.0" in warm orange (#FF8C3C), on the second line, at the same size.
- A short bright-blue (#1E88E5) accent underline beneath "2.0".
- Below the accent rule, add a two-line subtitle in a lighter weight and soft pale blue (#D7E1FF): "Generating, Instrumenting and Evaluating / Interactive Learning Objects with AI".
- Optionally add a row of four small rounded "pill" tags under the subtitle: "p5.js", "Charts", "Diagrams", "xAPI".

The text must be spelled exactly as written, with no extra letters, no garbled words and no extra text anywhere else in the image. Keep the area directly behind the title calm and dark (no montage elements behind the text) so it stays readable. Do not shrink the title to fit.

## Background Montage

Fill the right 45% of the image with a tidy, slightly overlapping cluster of **five floating "screen cards"**. Each card is a white rounded-rectangle panel that looks like a screenshot of an interactive simulation, with a soft drop shadow and a slight tilt (between -4 and +4 degrees). The cards overlap a little, like photos dropped on a table. Render them in a consistent flat-vector UI style so they read as one family. Use simple shapes in place of real text, except for the one card that needs its labels.

1. **Bloom's Taxonomy pyramid (the most prominent card, front and center of the cluster, upper-middle of the right side)**. A pastel-blue (#F0F8FF) card with the small heading "Bloom's Taxonomy (2001)". Inside is a stacked six-level pyramid, top to bottom: **Create** (red-orange #E8452C), **Evaluate** (orange #F47C28), **Analyze** (yellow #FABE28), **Apply** (green #78BE50), **Understand** (teal #28A0BE), **Remember** (blue #1E88E5). The level names are white, bold and legible. The six levels must be in this exact order and color progression.
2. **Scatter chart with a dashed trend line.** A white card with green and gray dots rising toward the upper right, a dashed blue exponential trend line, and two small blue toggle buttons at the bottom. Suggests Chart.js / Plotly charts and data.
3. **Neural network diagram.** A card with a dense grid of blue circles in columns (input, hidden layers, output), connected by thin lines, and two blue sliders underneath. Suggests network diagrams and interactive controls.
4. **Dark world map card.** A near-black navy card with a muted gray-blue world map and one glowing orange square marker, plus a small blue slider strip along the bottom. Suggests the maps and global-reach MicroSims.
5. **Workflow / flowchart diagram.** A white card with a three-tier flowchart of small rounded boxes (red, orange, yellow, green, purple, light blue) connected by black arrows, in a tree shape. Suggests Mermaid-style diagrams and the AI generation workflow.

Do not render readable paragraphs on any card. Keep the cards mostly inside the right half so they never touch the title.

## Mascot

Place the book's mascot, **Bounce the Ball**, in the lower-middle of the image, just below and to the left of the card cluster, sized at roughly 18% of the image height so it does not overlap the title text. Bounce is a bright orange-red rubber ball (#E8452C) with a small white highlight on the upper left, big friendly eyes, a wide open smile and slightly raised eyebrows. He wears a small blue sport headband and white sneakers with blue soles, and has stubby cartoon arms and legs. He is mid-hop, waving one arm, in a modern flat-vector cartoon style with clean lines and simple squash-and-stretch shapes. A faint **dotted blue (#1E88E5) bounce arc** sweeps from the lower-left corner up and over to Bounce, as if he has just bounced across the cover.

If the tool accepts a reference image, attach `docs/img/mascot/welcome.png` and ask it to keep Bounce's design identical.

Below the lower-left end of the arc, optionally add the small tagline "Let's bounce it around!" in soft orange (#FFAA6E), italic or semi-bold, about one-third the size of the subtitle.

## Style & Composition

- Illustration style: flat vector, clean geometric shapes, subtle soft shadows on the cards only. No photorealism, no 3D render look, no painterly textures.
- Color palette: deep navy to indigo background (#0A0E30 to #261662), with bright blue (#1E88E5) and orange-red (#E8452C / #FF8C3C) as the accent colors. White or very light cards for contrast.
- Lighting/mood: a soft blue glow behind the card cluster at the upper right and a faint warm orange glow at the lower right. Sprinkle a few small white dots (like faint stars or data points) across the dark background. The overall mood is bright, optimistic and energetic on a dark, calm canvas.
- Composition: title block on the left half; card cluster on the right half; mascot and dotted arc along the bottom. Generous dark negative space directly behind the title. Keep about 40px of safe margin on all sides so nothing is cropped in social previews.

## Avoid

- Do not render dense paragraphs or illegible text anywhere in the image.
- Do not misspell the title or subtitle, and do not add any extra words, logos, watermarks or signatures.
- Avoid generic stock-photo cliches (handshakes, isolated lightbulbs, people pointing at whiteboards, robots with glowing brains).
- Avoid photorealistic human faces.
- Do not let the montage cards overlap or crowd the title.
- Do not change the order or colors of the Bloom's Taxonomy levels, and do not turn the pyramid into anything other than a six-level pyramid.
- Do not redesign the mascot. Keep him a round orange-red ball with a blue headband and white sneakers.

## After Generating

1. Generate 2-4 drafts and compare them. If the title text is garbled, regenerate or ask the tool to "fix the spelling of the title to read exactly: MicroSims 2.0".
2. If the Bloom's Taxonomy pyramid is wrong or unreadable, regenerate with only that instruction changed.
3. Save the final image as `docs/img/cover.png` (resize or crop to 1200x630 if needed).
4. Run `bk-check-social-cover` after deploying to confirm the `og:image` resolves.
