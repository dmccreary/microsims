---
title: Choropleth Threshold Lab
description: Move four color thresholds on a US choropleth of placeholder values and judge whether each setting reveals or hides a south-north gradient and a Great Lakes cluster.
image: /sims/choropleth-threshold-lab/choropleth-threshold-lab.png
og:image: /sims/choropleth-threshold-lab/choropleth-threshold-lab.png
twitter:image: /sims/choropleth-threshold-lab/choropleth-threshold-lab.png
social:
   cards: false
quality_score: 0
---

# Choropleth Threshold Lab

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Choropleth Threshold Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A choropleth map turns a continuous number into one of a few colors, so where you put the
thresholds between the colors decides what a reader can see. This lab builds the map template's
choropleth in the same four steps the chapter describes: it fetches a GeoJSON file of state
boundaries, looks up each state's value by name in [data.json](data.json), converts the value to
a color with a threshold function, and draws the states with `L.geoJSON()`.

**The values are placeholders, not real statistics.** They were invented to contain two patterns:

- a **south-north gradient**: outside the Great Lakes, values rise from about 10-35 in the south
  to about 60-70 in the north;
- a **Great Lakes cluster**: seven states (Minnesota, Iowa, Wisconsin, Illinois, Michigan, Indiana
  and Ohio) have values from 77 to 86 that rise from west to east.

Four sliders set the thresholds between the template's five color classes, and they cannot pass
one another, so the classes always stay in order. The legend under the map shows each class's
range and how many regions fall into it. Three presets show the trade-off. The **template
thresholds** (20, 40, 60, 80) show the gradient but split the cluster at 80 so that its western
half blends into the northern states. **Equal intervals** show the gradient and paint the cluster
as one solid block. **Cluster near 80** (76, 79, 82, 85) reveals the west-to-east rise inside the
cluster but puts 45 regions into a single class, hiding the gradient entirely.

Under the sliders, you judge whether the current thresholds reveal or hide each pattern and press
**Check**. The feedback counts how many color classes each group of regions uses. Alaska and
Hawaii have values but sit outside the initial view.

**Learning objective:** The learner will judge whether a set of color thresholds reveals or hides
a geographic pattern in a dataset.

**Bloom's taxonomy level:** Evaluate (verb: *judge*)

## How to Use

1. Hover over a state to highlight it and read its name, value and color class. Uncheck **Show
   values on hover** to judge from color alone, as a reader of a printed map would.
2. Click a state to zoom to it; press **Reset view** to return.
3. Choose a **Preset**, or drag the four **Threshold** sliders. The map and legend recolor at once.
4. For the current thresholds, choose **revealed** or **hidden** for the north-south gradient and
   for the Great Lakes trend, then press **Check**.
5. Try to find one set of thresholds that reveals both patterns, and decide what it costs.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/choropleth-threshold-lab/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

20 minutes

### Prerequisites

- Choropleth maps, geographic data sources and the template's threshold function (Chapter 9,
  "Choropleth Maps and Their Data")
- Reading a legend with value ranges

### Activities

1. **Read the default (3 min):** With the template thresholds, describe the pattern you see in one
   sentence. Then hover over Minnesota and Ohio and explain why they have different colors.
2. **Compare presets (5 min):** Switch between the three presets. For each, judge both patterns and
   press **Check**. Record the class counts in the legend.
3. **Design thresholds (7 min):** Using the sliders, find a setting that reveals both patterns.
   Write down your four thresholds and what the setting hides or distorts in exchange.
4. **Critique (5 min):** In pairs, write a two-sentence caption rule for publishing a choropleth,
   for example about stating the thresholds or showing class counts, and justify it using the lab.

### Assessment

- For a given set of thresholds, the learner correctly judges whether each pattern is revealed or
  hidden and justifies the judgment with the number of classes each group of regions uses.
- The learner explains why a class that holds most of the regions is a warning sign.
- The learner proposes thresholds for a stated purpose (for example, comparing regions near 80)
  and names the pattern that choice hides.

## References

1. [Choropleth map](https://en.wikipedia.org/wiki/Choropleth_map) - Wikipedia. Classification
   methods, including equal intervals, and the effect of class breaks on what a map shows.
2. [Interactive Choropleth Map tutorial](https://leafletjs.com/examples/choropleth/) - Leaflet.
   The `L.geoJSON`, `getColor`, hover highlight and click-to-zoom pattern this lab follows.
3. [GeoJSON](https://geojson.org/) - GeoJSON.org. The format of the state boundary file.
4. [ColorBrewer 2.0](https://colorbrewer2.org/) - Cynthia Brewer, Penn State. Advice on choosing
   color schemes and class counts for choropleth maps.
