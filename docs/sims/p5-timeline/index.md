# History of p5.js and Creative Coding

An interactive timeline tracing the evolution of creative coding tools from Design By Numbers at MIT Media Lab to the modern p5.js library.

[Run the Timeline](./main.html){ .md-button .md-button--primary }

[View Timeline Data](./timeline.json){ .md-button }

<iframe src="./main.html" width="100%" height="850px" style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>

## Overview

This timeline visualizes the key events and milestones that led to the creation of p5.js, including:

- **Processing & p5.js**: The core libraries and their releases
- **Web Standards**: HTML5, Canvas, WebGL, and related browser technologies
- **Related Projects**: Arduino, Processing.js, jQuery, and other influential tools
- **Organizations & Education**: MIT Media Lab, Processing Foundation, and key research groups

## Key People

| Person | Contribution |
|--------|-------------|
| **John Maeda** | Created Design By Numbers at MIT Media Lab (1996-1999) |
| **Ben Fry** | Co-created Processing (2001), contributed to DBN |
| **Casey Reas** | Co-created Processing (2001) |
| **Daniel Shiffman** | Processing Foundation co-lead (2012), educator |
| **John Resig** | Created Processing.js (2008), also created jQuery |
| **Lauren McCarthy** | Created p5.js (2013) |

## Timeline Features

### Interactive Elements

- **Zoom and Pan**: Scroll to zoom, click and drag to pan across the timeline
- **Event Details**: Click any event to see full details in the panel below
- **Hover Tooltips**: Hover over events to see additional context notes
- **Category Filtering**: Use filter buttons to view specific event categories

### Visual Design

- **Color-coded categories**: Each event type has a distinct color
- **Gradient backgrounds**: Modern visual styling
- **Responsive layout**: Works on desktop, tablet, and mobile devices

## Historical Context

### The Origins (1975-1999)

The roots of p5.js trace back to the Visual Language Workshop at MIT, founded in 1975. John Maeda's Aesthetics and Computation Group (1996) and Design By Numbers project (1999) established the philosophy of making programming accessible to artists and designers.

### Processing Era (2001-2012)

Casey Reas and Ben Fry launched Processing in 2001, creating a Java-based environment that revolutionized creative coding education. The project won a Golden Nica in 2005 and became the foundation for tools like Arduino.

### Web Standards Evolution (2004-2014)

The development of HTML5, particularly the Canvas API, enabled rich graphics in web browsers without plugins. Processing.js (2008) by John Resig was the first JavaScript port of Processing, demonstrating the potential of browser-based creative coding.

### p5.js (2013-Present)

Lauren McCarthy created p5.js as a fresh interpretation designed specifically for the modern web, with native JavaScript integration and HTML5 features. Version 1.0 was released in 2020 after seven years of development.

## Data Sources

- [Processing Foundation](https://processingfoundation.org/)
- [Processing Wikipedia Article](https://en.wikipedia.org/wiki/Processing_(programming_language))
- [p5.js 1.0 Announcement](https://medium.com/processing-foundation/p5-js-1-0-is-here-b7267140753a)
- [A Modern Prometheus - Processing History](https://medium.com/processing-foundation/a-modern-prometheus-59aed94abe85)
- [Processing.js 2008-2018](https://blog.humphd.org/processing-js-2008/)
- [Design By Numbers - MIT Media Lab](https://dbn.media.mit.edu/)

## Technical Details

- **Timeline Library**: vis-timeline 7.7.3
- **Data Format**: TimelineJS-compatible JSON
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: vis-timeline.js (loaded from CDN)

## Customization

### Adding New Events

Edit `timeline.json` and add a new event object:

```json
{
  "start_date": {
    "year": "2025",
    "month": "6",
    "display_date": "June 2025"
  },
  "text": {
    "headline": "Event Title",
    "text": "Description of the event."
  },
  "group": "Processing & p5.js",
  "notes": "Additional context for tooltip."
}
```

### Category Colors

To modify category colors, edit the `categoryColors` object in `main.html`:

```javascript
const categoryColors = {
    'Processing & p5.js': '#ed225d',
    'Web Standards': '#f7971e',
    'Related Projects': '#11998e',
    'Organizations & Education': '#6a5acd'
};
```
