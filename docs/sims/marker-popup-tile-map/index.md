---
title: Marker, Popup and Tile Source Map
description: A Leaflet map of seven Minneapolis museums and parks that separates the jobs of the marker, the popup and the tile source by letting learners change each one on its own.
image: /sims/marker-popup-tile-map/marker-popup-tile-map.png
og:image: /sims/marker-popup-tile-map/marker-popup-tile-map.png
twitter:image: /sims/marker-popup-tile-map/marker-popup-tile-map.png
social:
   cards: false
quality_score: 0
---

# Marker, Popup and Tile Source Map

<iframe src="main.html" height="582px" width="100%" scrolling="no"></iframe>

[Run the Marker, Popup and Tile Source Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Leaflet draws nothing by itself: every visible thing on a Leaflet map is a layer you add. This map
of Minneapolis, Minnesota, uses the three layers that almost every map MicroSim needs, and it lets
you change each one while the other two stay the same:

- **Tile source:** the background, made of small square images fetched for the area and zoom in
  view. The layer control switches among OpenStreetMap, OpenTopoMap and Esri World Imagery. The
  attribution line at the bottom of the map changes with the source, because the credit belongs
  to the tiles.
- **Marker:** a pin at one `[latitude, longitude]` pair. The seven markers come from
  [data.json](data.json), each with a `name`, `lat`, `lng`, `description` and a `category` of
  Museum or Park. **Show category** recolors the pins and their labels from the `category` field.
- **Popup:** the text bubble bound to a marker with `bindPopup()`. Clicking a marker opens its
  popup, and the separate info panel at the top right repeats the marker's category, its
  coordinates and the current tile source.

The **Swap lat/lng** button repeats the most common map bug on purpose. It gives the Mill City
Museum marker its coordinates in the wrong order, `[-93.2571, 44.9789]`. Leaflet always reads
latitude first, so it treats −93.26 as a latitude beyond the South Pole and 44.98 as a longitude
east of Greenwich, and the pin ends up at the bottom edge of the world map, south of Africa.
Only the marker moves; its popup text and the tiles are untouched. The mouse wheel scrolls the
page instead of zooming the map (`scrollWheelZoom: false`); use the **+** and **−** buttons.

**Learning objective:** The learner will distinguish the roles of the marker, the popup and the
tile source by changing each one independently and observing the result.

**Bloom's taxonomy level:** Analyze (verb: *distinguish*)

## How to Use

1. Click any marker. Read its popup, then read the info panel at the top right.
2. Switch the base map in the layer control at the bottom left (on narrow screens, tap the
   layers button). Watch the attribution line and check whether any marker moved.
3. Check **Show category** to color the pins and labels by category (Museum or Park).
4. Press **Swap lat/lng** and read the caption. Press **Restore lat/lng** to put the marker back,
   and **Fit all markers** to return to the city view.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/marker-popup-tile-map/main.html"
        height="582px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Teachers, instructional designers, learning-technology developers and learning-analytics
practitioners (college undergraduate and professional development).

### Duration

15 minutes

### Prerequisites

- Latitude and longitude as decimal degrees
- The Leaflet vocabulary from Chapter 9: map marker, map popup, map tile source and layer control

### Activities

1. **One change at a time (5 min):** Make three changes in turn: switch the tile source, turn on
   **Show category**, and open a popup. After each change, record which of the three layers
   changed and which stayed the same.
2. **Diagnose the swap (4 min):** Before pressing **Swap lat/lng**, predict where a marker lands if
   its coordinates are entered as `[longitude, latitude]`. Press it, read the caption, and explain
   why the pin is stuck at the bottom edge of the map.
3. **Attribution check (3 min):** Compare the attribution text for the three tile sources and
   explain why it must change when the tiles change.
4. **Transfer (3 min):** Write the Leaflet line that would add a marker with a popup for a place
   on your own campus, with the coordinates in the correct order.

### Assessment

- The learner states, for each of marker, popup and tile source, what it contains and what
  changing it affects.
- The learner identifies a latitude-longitude swap from its symptom and corrects it.
- The learner explains why attribution travels with the tile source rather than the markers.

## References

1. [Leaflet reference](https://leafletjs.com/reference.html) - Leaflet. `L.marker`, `bindPopup`,
   `L.tileLayer`, `L.control.layers` and the `scrollWheelZoom` map option.
2. [Leaflet tutorials](https://leafletjs.com/examples.html) - Leaflet. The quick start guide
   covers markers, popups and tile layers step by step.
3. [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/) -
   OpenStreetMap Foundation. Rules for using the OpenStreetMap tile servers, including attribution.
4. [Geographic coordinate system](https://en.wikipedia.org/wiki/Geographic_coordinate_system) -
   Wikipedia. Latitude, longitude and their valid ranges.
