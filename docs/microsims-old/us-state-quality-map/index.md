---
title: US State Quality of Life Index Map
description: Interactive choropleth map grading all 50 US states on 8 quality of life metrics including income, education, health, crime, and housing costs.
image: /microsims-old/us-state-quality-map/us-state-quality-map.png
og:image: /microsims-old/us-state-quality-map/us-state-quality-map.png
---

# US State Quality of Life Index Map

An interactive choropleth map showing how each US state performs across 8 key quality of life metrics compared to national averages.

<iframe src="main.html" width="100%" height="560"></iframe>

[View Fullscreen](main.html){:target="_blank"}

To put this map in your course, add this element into your webpage:
```html
<iframe src="https://dmccreary.github.io/microsims/microsims-old/us-state-quality-map/main.html" width="100%" height="560" ></iframe>

```

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
      - Real per capita personal income for 2023, adjusted for regional price parities and inflation (chained 2017 dollars)
      - Higher values indicate greater purchasing power
      - National Average: $58,088

2. **Poverty Rate (Regionally Adjusted)**
      - Percentage of people in poverty under the Supplemental Poverty Measure, a 3-year average for 2023 to 2025
      - The Supplemental Poverty Measure adjusts for regional housing costs and counts government benefits, taxes and necessary expenses
      - National Average: 13.0%

### Education

3. **Education Attainment**
      - Percentage of adults 25+ with bachelor's degree or higher, 2023
      - Higher values indicate better educational outcomes
      - National Average: 36.2%

### Health Metrics

4. **Life Expectancy**
      - Average life expectancy at birth in years, 2022
      - Higher values indicate better overall health outcomes
      - National Average: 77.5 years

5. **Infant Mortality Rate**
      - Infant deaths per 1,000 live births, 2023
      - Lower values indicate better maternal and infant healthcare
      - National Average: 5.60 per 1,000

### Safety & Affordability

6. **Violent Crime Rate**
      - Violent crimes (murder, rape, robbery, aggravated assault) per 100,000 population, 2023
      - Lower values indicate safer communities
      - National Average: 379.5 per 100,000

7. **Median Home Price (Zillow Home Value Index)**
      - Typical home value in the state, the average of the 12 months of 2024
      - Lower values indicate more affordable housing
      - National Average: $362,544

8. **Food Insecurity Rate**
      - Percentage of households experiencing food insecurity, a 3-year average for 2021 to 2023
      - Lower values indicate better food access and economic stability
      - National Average: 12.2%

## Interactive Features

- **Hover** over any state to see detailed metric values
- **Click** on a state to zoom in
- **Legend** shows the color scale from best (dark green) to worst (dark red)
- Each metric shows whether the state is better (+) or worse (-) than average

## Data Sources and References

### Bureau of Economic Analysis (BEA)

**Source:** U.S. Department of Commerce, Bureau of Economic Analysis

**Data Used:** Real Per Capita Personal Income by State, 2023 (chained 2017 dollars)

**Citation:**
> Bureau of Economic Analysis. *Real Personal Income for States: Real Per Capita Personal Income by State, 2023*. U.S. Department of Commerce. Retrieved October 1, 2026, from FRED, Federal Reserve Bank of St. Louis: [https://fred.stlouisfed.org/release/tables?rid=403&eid=233586&od=2023-01-01](https://fred.stlouisfed.org/release/tables?rid=403&eid=233586&od=2023-01-01)

> Bureau of Economic Analysis. *Real Per Capita Personal Income for United States (RPIPCUS)*. Retrieved October 1, 2026, from FRED, Federal Reserve Bank of St. Louis: [https://fred.stlouisfed.org/series/RPIPCUS](https://fred.stlouisfed.org/series/RPIPCUS)

> Bureau of Economic Analysis. *Regional Price Parities by State*. U.S. Department of Commerce. Retrieved from [https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area](https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area)

**Methodology:** The 50 state values and the national value of $58,088 are BEA's published real per capita personal income figures for 2023. BEA adjusts each state's personal income with its Regional Price Parity (RPP) to account for cost-of-living differences between states, and with the national price index for personal consumption expenditures to remove inflation, so the values are in chained 2017 dollars. RPPs measure the differences in price levels across states for a given year and are expressed as a percentage of the overall national price level.

---

### US Census Bureau

**Source:** United States Census Bureau, Current Population Survey and American Community Survey

**Data Used:** Supplemental Poverty Measure Rates by State (3-year average, 2023 to 2025), Educational Attainment (2023)

**Citation:**
> Bijou, C., & Shrider, E. A. (2026). *Poverty in the United States: 2025*. Current Population Reports, P60-290. U.S. Census Bureau. Table 17, Number and Percentage of People in Poverty by State and Different Poverty Measures Using 3-Year Average: 2023, 2024, and 2025. Retrieved October 1, 2026, from [https://www2.census.gov/programs-surveys/demo/tables/p60/290/table_17_spm_opm_state.xlsx](https://www2.census.gov/programs-surveys/demo/tables/p60/290/table_17_spm_opm_state.xlsx)

> U.S. Census Bureau. *American Community Survey 1-Year Estimates, 2023: Bachelor's Degree or Higher by State*. Retrieved October 1, 2026, from FRED, Federal Reserve Bank of St. Louis: [https://fred.stlouisfed.org/release/tables?rid=330&eid=391444&od=2023-01-01](https://fred.stlouisfed.org/release/tables?rid=330&eid=391444&od=2023-01-01)

> U.S. Census Bureau. *American Community Survey 1-Year Estimates, 2023: Table S1501, Educational Attainment*. Retrieved from [https://data.census.gov/table/ACSST1Y2023.S1501](https://data.census.gov/table/ACSST1Y2023.S1501)

**Methodology:** Poverty rates use the Supplemental Poverty Measure (SPM), which accounts for geographic differences in housing costs and includes non-cash benefits and necessary expenses like taxes and medical costs. The Census Bureau recommends 3-year averages for state estimates, so each state value and the national value of 13.0% is the 2023 to 2025 average. These are survey estimates with margins of error between 0.6 and 1.6 percentage points. Education attainment is the percentage of people aged 25 and over with a bachelor's degree or higher; the national value of 36.2% is from Table S1501.

---

### Centers for Disease Control and Prevention (CDC)

**Source:** CDC National Center for Health Statistics (NCHS)

**Data Used:** Life Expectancy at Birth (2022), Infant Mortality Rates (2023)

**Citation:**
> Arias, E., Xu, J., Tejada-Vera, B., & Bastian, B. (2025). *U.S. State Life Tables, 2022*. National Vital Statistics Reports, 74(12). Hyattsville, MD: National Center for Health Statistics. Table A. Retrieved October 1, 2026, from [https://www.cdc.gov/nchs/data/nvsr/nvsr74/nvsr74-12.pdf](https://www.cdc.gov/nchs/data/nvsr/nvsr74/nvsr74-12.pdf)

> National Center for Health Statistics. *Stats of the States: Infant Mortality*, 2023 rates. Retrieved October 1, 2026, from [https://www.cdc.gov/nchs/state-stats/deaths/infant-mortality.html](https://www.cdc.gov/nchs/state-stats/deaths/infant-mortality.html)

> National Center for Health Statistics. (2024). *Mortality in the United States, 2023*. NCHS Data Brief No. 521. Retrieved October 1, 2026, from [https://www.cdc.gov/nchs/products/databriefs/db521.htm](https://www.cdc.gov/nchs/products/databriefs/db521.htm)

**Methodology:** Life expectancy is calculated using period life tables based on age-specific death rates; 2022 is the most recent year with state life tables. Infant mortality rate is defined as deaths under 1 year of age per 1,000 live births. The national value of 5.60 is the 2023 rate of 560.2 infant deaths per 100,000 live births from Data Brief No. 521.

---

### Federal Bureau of Investigation (FBI)

**Source:** FBI Uniform Crime Reporting (UCR) Program

**Data Used:** Estimated Violent Crimes and Population by State, 2023

**Citation:**
> Federal Bureau of Investigation. (2026). *Summary Reporting System (SRS) Estimated Crimes, 1979 to 2025* (estimated_crimes_1979_2025.csv). Crime Data Explorer, Documents & Downloads. Retrieved October 1, 2026, from [https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/downloads](https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/downloads)

**Methodology:** Violent crime includes four offense categories: murder and nonnegligent manslaughter, rape, robbery, and aggravated assault. Each rate is the FBI's estimated number of violent crimes for 2023 divided by the population in the same file, times 100,000. The national value of 379.5 is computed the same way from the United States total. The FBI revises its estimates, so these 2023 rates differ from the ones first published in 2024.

---

### Zillow

**Source:** Zillow Research

**Data Used:** Zillow Home Value Index (ZHVI) for All Homes by State, 2024

**Citation:**
> Zillow. *Zillow Home Value Index (ZHVI) for All Homes Including Single-Family Residences, Condos, and CO-OPs*, state series and United States series (USAUCSFRCONDOSMSAMID). Retrieved October 1, 2026, from FRED, Federal Reserve Bank of St. Louis: [https://fred.stlouisfed.org/series/USAUCSFRCONDOSMSAMID](https://fred.stlouisfed.org/series/USAUCSFRCONDOSMSAMID)

> Zillow Research. *Zillow Home Value Index (ZHVI): All Homes, Time Series, Smoothed, Seasonally Adjusted*. Retrieved from [https://www.zillow.com/research/data/](https://www.zillow.com/research/data/)

**Methodology:** The Zillow Home Value Index (ZHVI) is a smoothed, seasonally adjusted measure of the typical home value and market changes across a given region. It represents the typical value for homes in the 35th to 65th percentile range, so it is not a median sale price or listing price. Each state value and the national value of $362,544 is the average of the 12 monthly index values for 2024. Zillow revises the index every month, so later downloads can differ slightly.

---

### United States Department of Agriculture (USDA)

**Source:** USDA Economic Research Service

**Data Used:** Prevalence of Household Food Insecurity by State (3-year average, 2021 to 2023)

**Citation:**
> Rabbitt, M. P., Reed-Jones, M., Hales, L. J., & Burke, M. P. (2024). *Household Food Security in the United States in 2023*. Economic Research Report No. 337. U.S. Department of Agriculture, Economic Research Service. Table 4. Retrieved October 1, 2026, from [https://ers.usda.gov/sites/default/files/_laserfiche/publications/109896/ERR-337.pdf](https://ers.usda.gov/sites/default/files/_laserfiche/publications/109896/ERR-337.pdf)

**Methodology:** Food insecurity is defined as a household-level economic and social condition of limited or uncertain access to adequate food. Statistics are derived from the Current Population Survey Food Security Supplement. USDA averages 3 years of data to get reliable state estimates, so each state value and the national value of 12.2% is the 2021 to 2023 average. The margins of error are between 0.7 and 2.5 percentage points.

---

## Technical Details

- **Library:** Leaflet.js v1.9.4
- **Map Tiles:** OpenStreetMap
- **Data Format:** GeoJSON for state boundaries
- **Interactivity:** Hover for details, click to zoom

## Limitations and Considerations

1. **Composite Index Simplicity:** Each metric is given equal weight. Different weighting could produce different rankings.

2. **Temporal Variations:** The metrics cover different periods between 2021 and 2025: life expectancy is for 2022; personal income, education, infant mortality and violent crime are for 2023; home value is for 2024; food insecurity is a 2021 to 2023 average; and poverty is a 2023 to 2025 average. Conditions change over time.

3. **State Averages:** State-level data masks significant intra-state variation (urban vs. rural, etc.).

4. **Metric Selection:** These 8 metrics were chosen for data availability and relevance, but other factors (climate, air quality, commute times, etc.) could also be included.

5. **Cost-of-Living Trade-offs:** States with low housing costs may also have fewer job opportunities or lower wages.
