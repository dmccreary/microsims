---
title: Timelines and Maps
description: Shows how to present events over time with vis-timeline and data over geography with Leaflet, including markers, popups, tile sources, choropleths and scroll-zoom control.
generated_by: claude skill chapter-content-generator
date: 2026-09-30 10:41:53
version: 1.10
---

# Timelines and Maps

## Summary

Covers vis-timeline and Leaflet for presenting events over time and data over geography.

Students learn timeline items, grouping and dates, and map markers, popups, tile sources and choropleths, including how to avoid scroll-zoom hijacking. After it, they can build a timeline or map MicroSim.

## Concepts Covered

This chapter covers the following 11 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| vis-timeline Library | 4 |
| Timeline Event Item | 3 |
| Timeline Grouping | 1 |
| Timeline Date Handling | 1 |
| Leaflet Library | 9 |
| Map Marker | 4 |
| Map Popup | 1 |
| Map Tile Source | 1 |
| Scroll Zoom Hijacking | 2 |
| Geographic Data Source | 2 |
| Choropleth Map | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Choosing a MicroSim Type](../04-choosing-a-microsim-type/index.md)

---

## Welcome

!!! mascot-welcome "Time and Place in One Page"
    ![Bounce waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Some ideas only make sense when you can see *when* they happened or *where* they are. By the end of this chapter you will be able to build a clickable timeline and an explorable map that a learner can poke at. Let's bounce it around!

Chapters 7 and 8 covered charts and networks, which answer questions about quantities and relationships. This chapter covers two more MicroSim types from the choice guide in [Chapter 4](../04-choosing-a-microsim-type/index.md): the **timeline**, which places events along a time axis, and the **map**, which places data on geography. Both are built from a JavaScript library that already handles the hard parts (axis scaling, tile loading, panning), so your job is mostly to supply well-structured data and to configure the interaction sensibly.

## Timelines with vis-timeline

The **vis-timeline Library** is an open-source JavaScript library that draws an interactive, zoomable time axis with items placed on it. The book's timeline template loads version 7.7.3 from the unpkg CDN as a script plus a stylesheet, and then creates a timeline with `new vis.Timeline(container, dataSet, options)`. The three arguments are the page element that will hold the timeline, a `vis.DataSet` holding the items, and an options object that controls height, margins, zoom limits and whether the learner may drag or zoom.

A **timeline event item** is one record on that axis: a label, a start date, and any extra text you attach. In the template, each item is built from a JSON event with a `start_date`, a `text` block (headline and description), a `group` and optional `notes`. The template converts each event into an object with these vis-timeline fields:

- `content`: the label drawn on the item, taken from the headline.
- `start`: a JavaScript `Date` object that fixes the item's position on the axis.
- `title`: the tooltip text shown on hover, taken from the notes (or the description if there are no notes).
- `category` and `description`: custom fields the template keeps for its own filter buttons and its click-to-read details panel.

A **worked example** shows the data half of this. The JSON below is one event in the template's format. Only `year` is required inside `start_date`; the template treats a missing month or day as 1.

```json
{
  "start_date": { "year": "1975", "month": "6" },
  "text": {
    "headline": "Third Event",
    "text": "Description shown in the details panel after a click."
  },
  "group": "Category1",
  "notes": "Context shown in the hover tooltip."
}
```

The next concept is easy to get wrong, so it gets its own passage. **Timeline date handling** means turning the JSON's date fields into the `Date` objects vis-timeline needs. JSON months are written 1 to 12, but the JavaScript `Date` constructor counts months from 0 to 11. The template therefore subtracts 1 from the month before building the date, and the timeline guide lists an off-by-one month as a common cause of dates parsing incorrectly.

!!! mascot-warning "The Month Off-By-One"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If every event lands one month late, you probably passed a 1-to-12 month straight to `new Date()`, which expects 0 to 11. Subtract 1 in one conversion function and never anywhere else, then spot-check an event whose date you know.

A related silent failure involves the `min` and `max` options. The timeline guide reports that these "pan limits" also clamp the visible window without any warning, so a `setWindow()` call that asks for an earlier start can quietly produce a later one. When a label at the edge looks clipped, check `timeline.getWindow()` against the date you requested before adjusting any CSS.

**Timeline grouping** organizes events into categories. In the template, each event carries a `group` string such as "Category1", and the script uses it in two ways: it looks up a color for the item, and it powers filter buttons that clear the dataset and re-add only the matching events. The guide recommends 3 to 6 categories with consistent names, because a filter button whose label does not exactly match the data value silently shows nothing.

Before you read the specification, note the terms it uses. A *detail panel* is the region below the axis that shows an event's full description after the learner clicks it. A *filter button* limits the display to one group.

#### Diagram: Timeline Item and Date Explorer

<iframe src="../../sims/timeline-item-date-explorer/main.html" width="100%" height="652px" scrolling="no"></iframe>

[Run the Timeline Item and Date Explorer MicroSim Fullscreen](../../sims/timeline-item-date-explorer/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Timeline Item and Date Explorer</summary>
Type: microsim
**sim-id:** timeline-item-date-explorer<br/>
**Library:** vis-timeline<br/>
**Status:** Specified

Learning objective (Bloom level: Apply; verb: use): The learner will use the JSON event format to place events on a timeline and will identify how month numbering and group values change what is displayed.

Layout: a timeline region (height 300 pixels) above a detail panel, above a control region.

Data: eight events in the template's JSON format across three groups, with a mix of year-only, year-and-month and full dates. Use invented, clearly labeled sample events about a fictional course schedule, not real history.

Interactions:

- Hover an item to show its `notes` text as a tooltip.
- Click an item to show its headline, formatted date and description in the detail panel.
- Filter buttons "All", and one per group, clear and re-add matching items.
- A checkbox "Show month numbering bug" rebuilds the dates without subtracting 1 from the month, so the learner sees events shift by one month, with a caption explaining why.
- A text field lets the learner edit one event's `month` value (1 to 12) and press "Update" to see the item move.

Controls for navigation: buttons for pan left, pan right, zoom in, zoom out and "Fit All", because wheel zoom is disabled (see the scroll-zoom section).

Responsive design: the timeline width is 100 percent of the container, listens for window resize events, and stacks the detail panel below the axis on narrow screens.

Implementation: vis-timeline 7.7.3 from a CDN, with the data in a local `data.json` and styling in `style.css`.
</details>

## Maps with Leaflet

The **Leaflet Library** is an open-source JavaScript library for interactive maps. The map template loads Leaflet 1.9.4 from unpkg, creates a map in a page element with `L.map('map')`, and positions it with `setView([lat, lng], zoom)`. Coordinates are always latitude first, then longitude, and zoom runs from 1 (world view) to 18 (building level), according to the map guide. Leaflet draws nothing by itself; every visible thing on the map is a layer that you add, and this chapter's remaining concepts are the layers you will use most.

A **map marker** is a pin placed at a latitude and longitude. A **map popup** is the small window that opens when the learner clicks or hovers a marker, and it is how a map shows details without cluttering the view. The guide's basic pattern creates a marker with `L.marker([lat, lng])`, attaches a popup with `bindPopup()`, and adds it with `addTo(map)`. The template's marker data uses these fields: `lat`, `lng`, `title` or `name`, `description`, and an optional `category`.

```javascript
const markers = [
  { lat: 40.7128, lng: -74.0060, title: "New York", description: "The Big Apple" }
];
markers.forEach(m => {
  L.marker([m.lat, m.lng])
    .bindPopup(`<b>${m.title}</b><br>${m.description}`)
    .addTo(map);
});
```

The loop reads each record, builds a marker, gives it popup text that may contain simple HTML, and puts it on the map. The guide suggests keeping markers under 100 for good performance and using marker clustering beyond that. It also advises writing descriptive popup text, since the popup is often the only textual alternative to the map.

A map needs a background, and a **map tile source** supplies it. Tiles are small square images, fetched on demand for the region and zoom level in view, and a tile layer is defined by a URL template containing `{z}`, `{x}` and `{y}` placeholders. The template uses the OpenStreetMap tile URL and an attribution string crediting OpenStreetMap contributors. The guide also lists a satellite source and a terrain source, and it links the OpenStreetMap tile usage policy, which you should read before publishing a map that many learners will load. Attribution is part of the tile source, so keep it whenever you change providers.

Before the next specification, define its control terms. A *layer control* is a Leaflet widget that lets the learner switch between base maps, created with `L.control.layers()`.

#### Diagram: Marker, Popup and Tile Source Map

<iframe src="../../sims/marker-popup-tile-map/main.html" width="100%" height="582px" scrolling="no"></iframe>

[Run the Marker, Popup and Tile Source Map MicroSim Fullscreen](../../sims/marker-popup-tile-map/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Marker, Popup and Tile Source Map</summary>
Type: map
**sim-id:** marker-popup-tile-map<br/>
**Library:** Leaflet<br/>
**Status:** Specified

Learning objective (Bloom level: Analyze; verb: distinguish): The learner will distinguish the roles of the marker, the popup and the tile source by changing each one independently and observing the result.

Geographic scope: a campus or city of the author's choice, with 6 to 8 markers in two categories.

Layout: a map region 420 pixels high with an info panel in the top-right corner, and a control region below.

Interactions:

- Click a marker to open its popup with title and description; the info panel repeats the marker's category.
- A layer control switches the base map between at least two tile sources; the attribution text at the bottom changes with the source.
- A toggle "Show category" recolors marker labels by the `category` field.
- A "Swap lat/lng" button deliberately reverses the coordinates of one marker so the learner sees it land in the wrong place, with a caption explaining latitude-first order.

Responsive design: the map fills 100 percent of the container width, fires a size refresh on window resize, and reduces the map height on screens under 600 pixels wide.

Implementation: Leaflet 1.9.4 from a CDN, data in `data.json`, plus `style.css` and `script.js` following the map template.
</details>

## Keeping the Page Scrollable

Embedding a map or timeline in a chapter page creates a subtle usability problem. **Scroll zoom hijacking** happens when an embedded interactive captures the mouse wheel for its own zooming, so a reader who is simply scrolling down the page suddenly finds the map zooming instead and cannot get past it.

The book's templates address this in three ways. The Leaflet template creates the map with `scrollWheelZoom: false`, with a comment about avoiding iframe scroll hijacking. The timeline template sets `zoomable` and `moveable` to false unless the page URL contains `?enable-interaction=true`, and supplies explicit pan and zoom buttons instead. The timeline guide adds a third option: register a `wheel` listener in the capture phase on the container. For vertical wheel movement it calls `stopImmediatePropagation()` without `preventDefault()`, so vis-timeline never sees the event and the page scrolls normally, while horizontal movement pans the timeline.

!!! mascot-warning "Do Not Trap the Scroll Wheel"
    ![Bounce warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A map that swallows the wheel makes readers feel stuck in the middle of your chapter. Turn wheel zoom off by default and offer buttons, so the page keeps scrolling and the learner can still zoom on purpose.

## Choropleth Maps and Their Data

A **geographic data source** is the file or service that supplies the shapes or points a map draws. The map template uses two: a GeoJSON file of boundaries, and a local `data.json` of values. GeoJSON is an open format for encoding geographic features such as points and polygons, and the guide links its specification. The template's default boundary URL points to a public us-states.json file on raw.githubusercontent.com, and `data.json` supplies a value for each state under a `features` object keyed by state name. Keeping shapes and values separate lets you reuse one boundary file for many datasets.

A **choropleth map** shades each region according to a data value, so the learner sees geographic patterns at a glance. The template builds one in four steps: fetch the GeoJSON, look up each region's value by name, convert the value to a color, and draw the region with `L.geoJSON()` using that color as its `fillColor`. The conversion is a threshold function: values above 80 are dark green, above 60 green, above 40 yellow, above 20 orange, and everything else dark red. Hovering a region highlights it and fills the info panel, and clicking zooms to it.

!!! mascot-thinking "Colors Are Bins, Not Values"
    ![Bounce thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A choropleth turns a continuous number into one of five colors, so a region at 61 and a region at 99 look almost alike. Where you put the thresholds is a design decision that can make a pattern appear or vanish.

A worked example of that decision: with the template thresholds, a region valued 61 and one valued 80 share a color, while 80 and 81 differ. If the learning goal is to compare regions near 80, you would move a threshold there. The template's own thresholds are a starting point for illustration, so treat the values in any sample data as placeholders and cite a real source before publishing real statistics.

#### Diagram: Choropleth Threshold Lab

<iframe src="../../sims/choropleth-threshold-lab/main.html" width="100%" height="702px" scrolling="no"></iframe>

[Run the Choropleth Threshold Lab MicroSim Fullscreen](../../sims/choropleth-threshold-lab/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>Choropleth Threshold Lab</summary>
Type: microsim
**sim-id:** choropleth-threshold-lab<br/>
**Library:** Leaflet<br/>
**Status:** Specified

Learning objective (Bloom level: Evaluate; verb: judge): The learner will judge whether a set of color thresholds reveals or hides a geographic pattern in a dataset.

Data: a GeoJSON boundary file of regions and a `data.json` with one clearly labeled placeholder value per region. Do not present the values as real statistics.

Layout: a map region 420 pixels high with a hover info panel, a legend below the map, and a control region.

Controls:

- Four sliders set the thresholds between the five color classes, kept in increasing order.
- A preset menu with "Template thresholds", "Equal intervals" and "Cluster near 80".
- A checkbox "Show values on hover" toggles the numeric value in the info panel.

Interactions: hovering a region highlights it and shows its name, value and color class; clicking zooms to the region; moving a slider recolors the map immediately and updates the legend. A readout counts how many regions fall in each class.

Responsive design: the map and legend resize with the container width, and the sliders stack below the map on narrow screens.

Implementation: Leaflet 1.9.4 with L.geoJSON and a getColor threshold function driven by the slider values.
</details>

## Chapter Summary

- The **vis-timeline Library** draws an interactive time axis from a `vis.DataSet` of items, configured by an options object.
- A **timeline event item** has a label, a `Date` start, a tooltip and optional custom fields; only the year is required in the template's JSON.
- **Timeline date handling** must convert 1-to-12 JSON months to the 0-to-11 months of JavaScript dates, and `min` and `max` can silently clamp the window.
- **Timeline grouping** uses a `group` value per event for color and filter buttons, and names must match exactly.
- The **Leaflet Library** builds maps from layers; coordinates are latitude first, and each **map marker** can carry a **map popup**.
- A **map tile source** supplies the background images; keep its attribution and respect its usage policy.
- **Scroll zoom hijacking** is avoided by disabling wheel zoom by default and offering buttons.
- A **geographic data source** such as GeoJSON supplies shapes, and a **choropleth map** shades them by thresholded values.

!!! mascot-celebration "Time and Place Handled"
    ![Bounce celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now structure timeline events with correct date handling, place markers and popups on a Leaflet map, and design a choropleth whose thresholds you can defend. That is two more MicroSim types in your toolkit.

The next chapter, [Image Overlays and Comparison Posters](../10-image-overlays-and-comparison-posters/index.md), moves from geography to annotated images.
