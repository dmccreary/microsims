---
title: US State Quality of Life Index Map
description: Interactive choropleth map grading all 50 US states on 8 quality of life metrics including income, education, health, crime, and housing costs.
image: state-data.png
---

# US State Quality of Life Index Map

An interactive choropleth map showing how each US state performs across 8 key quality of life metrics compared to national averages.

<iframe src="main.html" width="100%" height="560" style="border:none; border-radius: 5px;"></iframe>

[View Fullscreen](main.html){:target="_blank"}

## How the Grading Works

Each state is evaluated on 8 metrics and compared to the national average. The color grade reflects how many metrics are better than average:

| Grade | Color | Description |
|-------|-------|-------------|
| 8/8 | Dark Green | All metrics better than national average |
| 7/8 | Green | 7 metrics better, 1 worse |
| 6/8 | Medium Green | 6 metrics better, 2 worse |
| 5/8 | Light Green | 5 metrics better, 3 worse |
| 4/8 | Yellow | 4 metrics better, 4 worse (average) |
| 3/8 | Orange | 3 metrics better, 5 worse |
| 2/8 | Deep Orange | 2 metrics better, 6 worse |
| 1/8 | Red | 1 metric better, 7 worse |
| 0/8 | Dark Red | All metrics worse than national average |

## The 8 Quality of Life Metrics

### Economic Metrics

1. **Personal Income (Cost-of-Living Adjusted)**
   - Per capita personal income adjusted for regional price parities
   - Higher values indicate greater purchasing power
   - National Average: $55,000

2. **Poverty Rate (Regionally Adjusted)**
   - Percentage of population below poverty line
   - Adjusted using Supplemental Poverty Measure for regional cost differences
   - National Average: 11.5%

### Education

3. **Education Attainment**
   - Percentage of adults 25+ with bachelor's degree or higher
   - Higher values indicate better educational outcomes
   - National Average: 33.0%

### Health Metrics

4. **Life Expectancy**
   - Average life expectancy at birth in years
   - Higher values indicate better overall health outcomes
   - National Average: 77.5 years

5. **Infant Mortality Rate**
   - Deaths per 1,000 live births
   - Lower values indicate better maternal and infant healthcare
   - National Average: 5.5 per 1,000

### Safety & Affordability

6. **Violent Crime Rate**
   - Violent crimes (murder, rape, robbery, aggravated assault) per 100,000 population
   - Lower values indicate safer communities
   - National Average: 380 per 100,000

7. **Median Home Price**
   - Median listing price for homes in the state
   - Lower values indicate more affordable housing
   - National Average: $350,000

8. **Food Insecurity Rate**
   - Percentage of households experiencing food insecurity
   - Lower values indicate better food access and economic stability
   - National Average: 10.5%

## Interactive Features

- **Hover** over any state to see detailed metric values
- **Click** on a state to zoom in
- **Legend** shows the color scale from best (dark green) to worst (dark red)
- Each metric shows whether the state is better (+) or worse (-) than average

## Data Sources and References

### Bureau of Economic Analysis (BEA)

**Source:** U.S. Department of Commerce, Bureau of Economic Analysis

**Data Used:** Personal Income by State, Regional Price Parities

**Citation:**
> Bureau of Economic Analysis. (2023). *Personal Income by State*. U.S. Department of Commerce. Retrieved from [https://www.bea.gov/data/income-saving/personal-income-by-state](https://www.bea.gov/data/income-saving/personal-income-by-state)

> Bureau of Economic Analysis. (2023). *Regional Price Parities by State*. U.S. Department of Commerce. Retrieved from [https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area](https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area)

**Methodology:** Personal income figures are adjusted using Regional Price Parities (RPPs) to account for cost-of-living differences between states. RPPs measure the differences in price levels across states for a given year and are expressed as a percentage of the overall national price level.

---

### US Census Bureau

**Source:** United States Census Bureau, American Community Survey

**Data Used:** Poverty Rates, Educational Attainment

**Citation:**
> U.S. Census Bureau. (2023). *American Community Survey 1-Year Estimates: Poverty Status in the Past 12 Months*. Retrieved from [https://data.census.gov/](https://data.census.gov/)

> U.S. Census Bureau. (2023). *Supplemental Poverty Measure: 2022*. Current Population Reports, P60-280. Retrieved from [https://www.census.gov/library/publications/2023/demo/p60-280.html](https://www.census.gov/library/publications/2023/demo/p60-280.html)

> U.S. Census Bureau. (2023). *Educational Attainment in the United States*. American Community Survey. Retrieved from [https://www.census.gov/data/tables/2023/demo/educational-attainment/cps-detailed-tables.html](https://www.census.gov/data/tables/2023/demo/educational-attainment/cps-detailed-tables.html)

**Methodology:** Poverty rates are adjusted using the Supplemental Poverty Measure (SPM), which accounts for geographic differences in housing costs and includes non-cash benefits and necessary expenses like taxes and medical costs.

---

### Centers for Disease Control and Prevention (CDC)

**Source:** CDC National Center for Health Statistics (NCHS)

**Data Used:** Life Expectancy, Infant Mortality Rates

**Citation:**
> National Center for Health Statistics. (2023). *National Vital Statistics Reports: State Life Tables, 2020-2022*. Centers for Disease Control and Prevention. Retrieved from [https://www.cdc.gov/nchs/products/life_tables.htm](https://www.cdc.gov/nchs/products/life_tables.htm)

> National Center for Health Statistics. (2023). *Infant Mortality Rates by State*. CDC WONDER Online Database. Retrieved from [https://wonder.cdc.gov/](https://wonder.cdc.gov/)

> Arias, E., Xu, J., & Kochanek, K. D. (2023). *United States Life Tables, 2021*. National Vital Statistics Reports, 72(12). Hyattsville, MD: National Center for Health Statistics.

**Methodology:** Life expectancy is calculated using period life tables based on age-specific death rates. Infant mortality rate is defined as deaths under 1 year of age per 1,000 live births.

---

### Federal Bureau of Investigation (FBI)

**Source:** FBI Uniform Crime Reporting (UCR) Program

**Data Used:** Violent Crime Rates

**Citation:**
> Federal Bureau of Investigation. (2023). *Crime in the United States, 2022*. Criminal Justice Information Services Division. Retrieved from [https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home](https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home)

> Federal Bureau of Investigation. (2023). *Crime Data Explorer*. Retrieved from [https://crime-data-explorer.fr.cloud.gov/](https://crime-data-explorer.fr.cloud.gov/)

**Methodology:** Violent crime includes four offense categories: murder and nonnegligent manslaughter, rape, robbery, and aggravated assault. Rates are calculated per 100,000 population using Census Bureau population estimates.

---

### Zillow

**Source:** Zillow Research

**Data Used:** Median Home Prices (Zillow Home Value Index)

**Citation:**
> Zillow Research. (2024). *Zillow Home Value Index (ZHVI): All Homes, Time Series, Smoothed, Seasonally Adjusted*. Retrieved from [https://www.zillow.com/research/data/](https://www.zillow.com/research/data/)

**Methodology:** The Zillow Home Value Index (ZHVI) is a smoothed, seasonally adjusted measure of the typical home value and market changes across a given region. It represents the typical value for homes in the 35th to 65th percentile range.

---

### United States Department of Agriculture (USDA)

**Source:** USDA Economic Research Service

**Data Used:** Food Insecurity Rates

**Citation:**
> Coleman-Jensen, A., Rabbitt, M. P., Gregory, C. A., & Singh, A. (2023). *Household Food Security in the United States in 2022*. Economic Research Report No. (ERR-325). U.S. Department of Agriculture, Economic Research Service. Retrieved from [https://www.ers.usda.gov/publications/pub-details/?pubid=107702](https://www.ers.usda.gov/publications/pub-details/?pubid=107702)

> USDA Economic Research Service. (2023). *State-Level Food Insecurity Statistics*. Retrieved from [https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/interactive-charts-and-highlights/](https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/interactive-charts-and-highlights/)

**Methodology:** Food insecurity is defined as a household-level economic and social condition of limited or uncertain access to adequate food. Statistics are derived from the Current Population Survey Food Security Supplement.

---

## Technical Details

- **Library:** Leaflet.js v1.9.4
- **Map Tiles:** OpenStreetMap
- **Data Format:** GeoJSON for state boundaries
- **Interactivity:** Hover for details, click to zoom

## Limitations and Considerations

1. **Composite Index Simplicity:** Each metric is given equal weight. Different weighting could produce different rankings.

2. **Temporal Variations:** Data from 2022-2024 sources; conditions change over time.

3. **State Averages:** State-level data masks significant intra-state variation (urban vs. rural, etc.).

4. **Metric Selection:** These 8 metrics were chosen for data availability and relevance, but other factors (climate, air quality, commute times, etc.) could also be included.

5. **Cost-of-Living Trade-offs:** States with low housing costs may also have fewer job opportunities or lower wages.
