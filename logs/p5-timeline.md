# p5-timeline MicroSim Session Log

**Date:** November 28, 2024
**MicroSim:** p5-timeline
**Location:** docs/sims/p5-timeline/

## Summary

Created an interactive timeline visualization showing the history of p5.js and creative coding, from the Visual Language Workshop at MIT (1975) through p5.js 2.0 development (2024).

## Files Created

| File | Size | Description |
|------|------|-------------|
| `main.html` | ~18 KB | Interactive vis-timeline visualization with embedded data |
| `timeline.json` | ~15 KB | 29 events in TimelineJS-compatible JSON format |
| `index.md` | ~4 KB | Documentation with embedded iframe and historical context |

## Timeline Events (29 total)

### By Category

| Category | Count | Color |
|----------|-------|-------|
| Processing & p5.js | 10 | Pink (#ed225d) |
| Web Standards | 12 | Orange (#f7971e) |
| Related Projects | 4 | Green (#11998e) |
| Organizations & Education | 3 | Purple (#6a5acd) |

### Chronological Event List

1. **1975** - Visual Language Workshop Founded (Organizations)
2. **September 1985** - MIT Media Lab Founded (Organizations)
3. **May 1995** - JavaScript Created (Web Standards)
4. **1996** - Aesthetics and Computation Group Started (Organizations)
5. **1999** - Design By Numbers Published (Processing)
6. **August 9, 2001** - Processing First Released (Processing)
7. **2004** - Processing Gets processing.org Domain (Processing)
8. **June 2004** - HTML5 Work Begins at WHATWG (Web Standards)
9. **2005** - Processing Wins Golden Nica (Processing)
10. **October 2005** - Arduino Released (Related Projects)
11. **August 26, 2006** - jQuery Released (Web Standards)
12. **January 2008** - HTML5 First Public Draft (Web Standards)
13. **May 9, 2008** - Processing.js Released (Related Projects)
14. **April 29, 2010** - Steve Jobs 'Thoughts on Flash' (Web Standards)
15. **March 2011** - WebGL 1.0 Released (Web Standards)
16. **2012** - Processing Foundation Established (Organizations)
17. **August 1, 2012** - Chrome 21 Adds getUserMedia (Web Standards)
18. **2013** - p5.js Created (Processing)
19. **2014** - p5.js First Public Release (Processing)
20. **October 28, 2014** - HTML5 Becomes W3C Recommendation (Web Standards)
21. **October 2015** - 'Getting Started with p5.js' Published (Processing)
22. **May 2016** - Media Capture API Reaches W3C Candidate Recommendation (Web Standards)
23. **December 2018** - Processing.js Deprecated (Related Projects)
24. **February 2020** - p5.js 1.0 Released (Processing)
25. **December 10, 2020** - Adobe Flash End of Life (Web Standards)
26. **January 26, 2021** - WebRTC 1.0 Becomes W3C Recommendation (Web Standards)
27. **June 17, 2021** - Web Audio API Becomes W3C Recommendation (Web Standards)
28. **August 9, 2021** - Processing 20th Anniversary (Processing)
29. **2024** - p5.js 2.0 Development Begins (Processing)

## Key People Documented

| Person | Role |
|--------|------|
| John Maeda | Created Design By Numbers, founded ACG at MIT |
| Ben Fry | Co-created Processing, contributed to DBN |
| Casey Reas | Co-created Processing |
| Daniel Shiffman | Processing Foundation co-lead |
| John Resig | Created jQuery and Processing.js |
| Lauren McCarthy | Created p5.js |
| Brendan Eich | Created JavaScript |

## Technical Implementation

### Visualization Library
- **vis-timeline 7.7.3** loaded from CDN
- Interactive zoom/pan navigation
- Category filtering with color-coded buttons
- Click-to-select event details panel
- Hover tooltips with additional context

### Data Embedding
Timeline data is embedded directly in `main.html` to avoid CORS issues when opening from `file://` URLs. The separate `timeline.json` file is maintained for reference and potential server-based deployments.

### Design Features
- Dark gradient background (#1a1a2e to #16213e)
- White card-based UI components
- Category color gradients for visual appeal
- Responsive layout for different screen sizes
- Legend panel explaining color coding

## Session Activities

### Initial Creation
1. Researched p5.js history using web search
2. Identified key people: John Maeda, Ben Fry, Casey Reas, John Resig, Lauren McCarthy
3. Created directory structure at `docs/sims/p5-timeline/`
4. Generated initial 25 events spanning 1975-2024
5. Built vis-timeline visualization with category filtering

### Bug Fix
- **Issue:** "Error loading timeline data" when opening from file system
- **Cause:** CORS restrictions prevent `fetch()` from loading local JSON via `file://` protocol
- **Solution:** Embedded timeline data directly in `main.html` JavaScript

### Enhancement: Multimedia Standards
Added 4 new events for W3C sound, microphone, and webcam standards:
1. **August 1, 2012** - Chrome 21 getUserMedia support
2. **May 2016** - Media Capture and Streams W3C Candidate Recommendation
3. **January 26, 2021** - WebRTC 1.0 W3C Recommendation
4. **June 17, 2021** - Web Audio API W3C Recommendation

### Documentation Update
- Updated `index.md` with new event counts (29 total)
- Added "Multimedia Standards (2012-2021)" section with table
- Added W3C source links for audio/video standards

## Data Sources

- Processing Foundation: https://processingfoundation.org/
- Processing Wikipedia: https://en.wikipedia.org/wiki/Processing
- A Modern Prometheus (Processing history): https://medium.com/processing-foundation/a-modern-prometheus-59aed94abe85
- p5.js 1.0 Announcement: https://medium.com/processing-foundation/p5-js-1-0-is-here-b7267140753a
- Processing.js 2008-2018: https://blog.humphd.org/processing-js-2008/
- Design By Numbers: https://dbn.media.mit.edu/
- Web Audio API W3C: https://www.w3.org/news/2021/web-audio-api-is-a-w3c-recommendation/
- WebRTC 1.0 W3C: https://www.w3.org/news/2021/webrtc-1-0-is-a-w3c-recommendation/
- Media Capture Streams: https://www.w3.org/TR/mediacapture-streams/
- John Resig Processing.js: https://johnresig.com/blog/processingjs/

## Future Enhancements

Potential additions to consider:
- p5.js sound library release date
- p5.js WebGL mode introduction
- OpenProcessing platform launch
- The Coding Train YouTube channel start
- p5.js 2.0 official release (when available)
