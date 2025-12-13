# US State Quality of Life Map - Session Log

**Date:** 2025-12-12
**MicroSim:** `docs/sims/us-state-quality-map/`

## Overview

Created an interactive choropleth map of the United States showing quality of life metrics for each state, with hover interactions displaying detailed data.

## Files Created

### 1. `state-data.js`
- Data for all 50 states with 8 quality of life metrics
- National averages for comparison
- Grade calculation based on how many metrics are better than national average (0-8 scale)
- Color coding from dark green (8/8 better) to dark red (0/8 better)

### 2. `main.html`
- Interactive Leaflet.js choropleth map
- Fetches high-quality GeoJSON from PublicaMundi repository
- Hover tooltips with state details and all 8 metrics
- Dynamic info box positioning (left for east coast, right for west coast)
- Horizontal legend at bottom of map
- Click-to-zoom functionality

### 3. `index.md`
- Documentation with embedded iframe
- Explanation of grading methodology
- Detailed descriptions of all 8 metrics
- Full academic references for each data source

## The 8 Quality of Life Metrics

| Metric | Source | National Average |
|--------|--------|------------------|
| Personal Income (adjusted) | Bureau of Economic Analysis | $55,000 |
| Poverty Rate (adjusted) | US Census Bureau | 11.5% |
| Education Attainment | US Census Bureau | 33.0% |
| Life Expectancy | CDC NCHS | 77.5 years |
| Infant Mortality | CDC NCHS | 5.5 per 1,000 |
| Violent Crime Rate | FBI UCR | 380 per 100,000 |
| Median Home Price | Zillow | $350,000 |
| Food Insecurity | USDA ERS | 10.5% |

## Grading Scale

States are colored based on how many of the 8 metrics are better than the national average:

| Metrics Better | Color | Label |
|----------------|-------|-------|
| 8/8 | Dark Green | Excellent |
| 7/8 | Green | Very Good |
| 6/8 | Medium Green | Good |
| 5/8 | Light Green | Above Average |
| 4/8 | Yellow | Average |
| 3/8 | Orange | Below Average |
| 2/8 | Deep Orange | Poor |
| 1/8 | Red | Very Poor |
| 0/8 | Dark Red | Worst |

## Features Implemented

1. **Choropleth coloring** - States colored by composite quality score
2. **Hover tooltips** - Detailed metrics with values and state rankings (e.g., "#25")
3. **Better/worse indicators** - Green + or red - showing comparison to national average
4. **Dynamic info box positioning** - Moves to left for east coast states, right for west coast
5. **Horizontal legend** - Positioned below the map
6. **High-quality boundaries** - GeoJSON from PublicaMundi (Census TIGER data)
7. **Click to zoom** - Click any state to zoom in

## Iterations

1. **Initial build** - Created basic choropleth with inline simplified GeoJSON
2. **Legend repositioned** - Moved from map overlay to horizontal bar below map
3. **Improved GeoJSON** - Replaced rough polygons with high-quality PublicaMundi data
4. **Added rankings** - Added state rank numbers to each metric in the info box
5. **Dynamic info positioning** - Info box moves left/right based on state longitude

## Data Sources (with full references in index.md)

- Bureau of Economic Analysis (BEA) - Personal income, regional price parities
- US Census Bureau - Poverty rates, educational attainment
- CDC National Center for Health Statistics - Life expectancy, infant mortality
- FBI Uniform Crime Report - Violent crime rates
- Zillow - Median home prices
- USDA Economic Research Service - Food insecurity rates

## Navigation

Added to `mkdocs.yml`:
```yaml
- US State Quality Map: sims/us-state-quality-map/index.md
```

## Refactoring to JSON

**Final step:** Separated state data from code:
- Created `data.json` containing all state data, national averages, and metric descriptions
- Updated `main.html` to fetch `data.json` using `Promise.all` alongside the GeoJSON
- Removed deprecated `state-data.js` file

## Preview URL

```
http://127.0.0.1:8000/microsims/sims/us-state-quality-map/
```
