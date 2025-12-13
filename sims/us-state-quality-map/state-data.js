// US State Quality of Life Data
// Sources: Bureau of Economic Analysis, US Census Bureau, CDC, FBI, Zillow, USDA
// Data compiled from 2023-2024 reports

// National averages for comparison
const nationalAverages = {
    personalIncome: 55000,    // Adjusted personal income
    povertyRate: 11.5,        // Adjusted poverty rate %
    educationAttainment: 33.0, // % with bachelor's degree
    lifeExpectancy: 77.5,     // Years
    infantMortality: 5.5,     // Per 1,000 live births
    violentCrime: 380,        // Per 100,000 population
    medianHomePrice: 350000,  // Dollars
    foodInsecurity: 10.5      // % of households
};

// Whether higher values are better for each metric
const higherIsBetter = {
    personalIncome: true,
    povertyRate: false,
    educationAttainment: true,
    lifeExpectancy: true,
    infantMortality: false,
    violentCrime: false,
    medianHomePrice: false,  // Lower is better (more affordable)
    foodInsecurity: false
};

const stateData = {
    "Alabama": {
        abbr: "AL",
        metrics: {
            personalIncome: { value: 48912, rank: 42 },
            povertyRate: { value: 14.8, rank: 46 },
            educationAttainment: { value: 26.5, rank: 44 },
            lifeExpectancy: { value: 74.4, rank: 48 },
            infantMortality: { value: 7.6, rank: 47 },
            violentCrime: { value: 453, rank: 38 },
            medianHomePrice: { value: 232000, rank: 8 },
            foodInsecurity: { value: 14.2, rank: 44 }
        }
    },
    "Alaska": {
        abbr: "AK",
        metrics: {
            personalIncome: { value: 52180, rank: 28 },
            povertyRate: { value: 12.1, rank: 30 },
            educationAttainment: { value: 29.8, rank: 30 },
            lifeExpectancy: { value: 76.6, rank: 35 },
            infantMortality: { value: 5.8, rank: 28 },
            violentCrime: { value: 837, rank: 50 },
            medianHomePrice: { value: 359000, rank: 22 },
            foodInsecurity: { value: 10.8, rank: 25 }
        }
    },
    "Arizona": {
        abbr: "AZ",
        metrics: {
            personalIncome: { value: 51234, rank: 30 },
            povertyRate: { value: 13.2, rank: 38 },
            educationAttainment: { value: 30.2, rank: 28 },
            lifeExpectancy: { value: 77.5, rank: 28 },
            infantMortality: { value: 5.4, rank: 22 },
            violentCrime: { value: 485, rank: 40 },
            medianHomePrice: { value: 435000, rank: 32 },
            foodInsecurity: { value: 12.1, rank: 35 }
        }
    },
    "Arkansas": {
        abbr: "AR",
        metrics: {
            personalIncome: { value: 49123, rank: 40 },
            povertyRate: { value: 15.1, rank: 47 },
            educationAttainment: { value: 24.3, rank: 48 },
            lifeExpectancy: { value: 74.2, rank: 49 },
            infantMortality: { value: 7.2, rank: 45 },
            violentCrime: { value: 628, rank: 46 },
            medianHomePrice: { value: 198000, rank: 4 },
            foodInsecurity: { value: 14.8, rank: 46 }
        }
    },
    "California": {
        abbr: "CA",
        metrics: {
            personalIncome: { value: 48765, rank: 43 },
            povertyRate: { value: 16.8, rank: 49 },
            educationAttainment: { value: 35.0, rank: 12 },
            lifeExpectancy: { value: 79.0, rank: 10 },
            infantMortality: { value: 4.2, rank: 8 },
            violentCrime: { value: 442, rank: 36 },
            medianHomePrice: { value: 785000, rank: 48 },
            foodInsecurity: { value: 10.2, rank: 22 }
        }
    },
    "Colorado": {
        abbr: "CO",
        metrics: {
            personalIncome: { value: 56890, rank: 15 },
            povertyRate: { value: 10.2, rank: 18 },
            educationAttainment: { value: 42.7, rank: 2 },
            lifeExpectancy: { value: 79.3, rank: 8 },
            infantMortality: { value: 4.8, rank: 14 },
            violentCrime: { value: 492, rank: 41 },
            medianHomePrice: { value: 545000, rank: 40 },
            foodInsecurity: { value: 9.5, rank: 18 }
        }
    },
    "Connecticut": {
        abbr: "CT",
        metrics: {
            personalIncome: { value: 58234, rank: 10 },
            povertyRate: { value: 10.5, rank: 20 },
            educationAttainment: { value: 40.4, rank: 5 },
            lifeExpectancy: { value: 79.7, rank: 6 },
            infantMortality: { value: 4.5, rank: 11 },
            violentCrime: { value: 184, rank: 8 },
            medianHomePrice: { value: 385000, rank: 26 },
            foodInsecurity: { value: 9.2, rank: 15 }
        }
    },
    "Delaware": {
        abbr: "DE",
        metrics: {
            personalIncome: { value: 54123, rank: 22 },
            povertyRate: { value: 11.8, rank: 28 },
            educationAttainment: { value: 33.2, rank: 18 },
            lifeExpectancy: { value: 77.0, rank: 32 },
            infantMortality: { value: 6.8, rank: 42 },
            violentCrime: { value: 431, rank: 35 },
            medianHomePrice: { value: 355000, rank: 21 },
            foodInsecurity: { value: 9.8, rank: 20 }
        }
    },
    "Florida": {
        abbr: "FL",
        metrics: {
            personalIncome: { value: 50890, rank: 32 },
            povertyRate: { value: 13.5, rank: 40 },
            educationAttainment: { value: 31.5, rank: 24 },
            lifeExpectancy: { value: 78.2, rank: 18 },
            infantMortality: { value: 5.9, rank: 30 },
            violentCrime: { value: 384, rank: 31 },
            medianHomePrice: { value: 405000, rank: 29 },
            foodInsecurity: { value: 11.5, rank: 32 }
        }
    },
    "Georgia": {
        abbr: "GA",
        metrics: {
            personalIncome: { value: 52456, rank: 27 },
            povertyRate: { value: 13.8, rank: 42 },
            educationAttainment: { value: 33.1, rank: 19 },
            lifeExpectancy: { value: 76.1, rank: 40 },
            infantMortality: { value: 7.0, rank: 44 },
            violentCrime: { value: 401, rank: 33 },
            medianHomePrice: { value: 345000, rank: 19 },
            foodInsecurity: { value: 12.5, rank: 37 }
        }
    },
    "Hawaii": {
        abbr: "HI",
        metrics: {
            personalIncome: { value: 42345, rank: 50 },
            povertyRate: { value: 14.2, rank: 44 },
            educationAttainment: { value: 34.2, rank: 14 },
            lifeExpectancy: { value: 81.3, rank: 1 },
            infantMortality: { value: 5.2, rank: 20 },
            violentCrime: { value: 256, rank: 14 },
            medianHomePrice: { value: 975000, rank: 50 },
            foodInsecurity: { value: 9.0, rank: 13 }
        }
    },
    "Idaho": {
        abbr: "ID",
        metrics: {
            personalIncome: { value: 50123, rank: 35 },
            povertyRate: { value: 11.2, rank: 25 },
            educationAttainment: { value: 29.5, rank: 32 },
            lifeExpectancy: { value: 78.4, rank: 15 },
            infantMortality: { value: 5.0, rank: 17 },
            violentCrime: { value: 242, rank: 12 },
            medianHomePrice: { value: 465000, rank: 35 },
            foodInsecurity: { value: 10.2, rank: 21 }
        }
    },
    "Illinois": {
        abbr: "IL",
        metrics: {
            personalIncome: { value: 56789, rank: 16 },
            povertyRate: { value: 11.8, rank: 29 },
            educationAttainment: { value: 35.8, rank: 10 },
            lifeExpectancy: { value: 77.8, rank: 24 },
            infantMortality: { value: 5.8, rank: 27 },
            violentCrime: { value: 414, rank: 34 },
            medianHomePrice: { value: 275000, rank: 13 },
            foodInsecurity: { value: 10.5, rank: 24 }
        }
    },
    "Indiana": {
        abbr: "IN",
        metrics: {
            personalIncome: { value: 53456, rank: 24 },
            povertyRate: { value: 11.5, rank: 27 },
            educationAttainment: { value: 27.8, rank: 38 },
            lifeExpectancy: { value: 76.4, rank: 38 },
            infantMortality: { value: 6.5, rank: 39 },
            violentCrime: { value: 357, rank: 27 },
            medianHomePrice: { value: 235000, rank: 9 },
            foodInsecurity: { value: 11.8, rank: 33 }
        }
    },
    "Iowa": {
        abbr: "IA",
        metrics: {
            personalIncome: { value: 56234, rank: 18 },
            povertyRate: { value: 9.8, rank: 14 },
            educationAttainment: { value: 29.1, rank: 34 },
            lifeExpectancy: { value: 78.6, rank: 13 },
            infantMortality: { value: 5.2, rank: 19 },
            violentCrime: { value: 267, rank: 16 },
            medianHomePrice: { value: 215000, rank: 6 },
            foodInsecurity: { value: 9.5, rank: 17 }
        }
    },
    "Kansas": {
        abbr: "KS",
        metrics: {
            personalIncome: { value: 55678, rank: 19 },
            povertyRate: { value: 10.2, rank: 17 },
            educationAttainment: { value: 34.0, rank: 16 },
            lifeExpectancy: { value: 77.6, rank: 26 },
            infantMortality: { value: 5.6, rank: 25 },
            violentCrime: { value: 410, rank: 34 },
            medianHomePrice: { value: 225000, rank: 7 },
            foodInsecurity: { value: 10.8, rank: 26 }
        }
    },
    "Kentucky": {
        abbr: "KY",
        metrics: {
            personalIncome: { value: 50890, rank: 33 },
            povertyRate: { value: 14.2, rank: 45 },
            educationAttainment: { value: 25.5, rank: 47 },
            lifeExpectancy: { value: 74.6, rank: 47 },
            infantMortality: { value: 6.2, rank: 36 },
            violentCrime: { value: 262, rank: 15 },
            medianHomePrice: { value: 195000, rank: 3 },
            foodInsecurity: { value: 13.5, rank: 41 }
        }
    },
    "Louisiana": {
        abbr: "LA",
        metrics: {
            personalIncome: { value: 51234, rank: 31 },
            povertyRate: { value: 17.2, rank: 50 },
            educationAttainment: { value: 25.2, rank: 49 },
            lifeExpectancy: { value: 73.1, rank: 50 },
            infantMortality: { value: 8.4, rank: 50 },
            violentCrime: { value: 639, rank: 47 },
            medianHomePrice: { value: 205000, rank: 5 },
            foodInsecurity: { value: 15.2, rank: 48 }
        }
    },
    "Maine": {
        abbr: "ME",
        metrics: {
            personalIncome: { value: 50234, rank: 34 },
            povertyRate: { value: 11.5, rank: 26 },
            educationAttainment: { value: 33.0, rank: 20 },
            lifeExpectancy: { value: 78.7, rank: 12 },
            infantMortality: { value: 5.5, rank: 24 },
            violentCrime: { value: 109, rank: 2 },
            medianHomePrice: { value: 365000, rank: 23 },
            foodInsecurity: { value: 11.2, rank: 30 }
        }
    },
    "Maryland": {
        abbr: "MD",
        metrics: {
            personalIncome: { value: 54890, rank: 20 },
            povertyRate: { value: 9.8, rank: 13 },
            educationAttainment: { value: 41.3, rank: 4 },
            lifeExpectancy: { value: 78.5, rank: 14 },
            infantMortality: { value: 6.1, rank: 35 },
            violentCrime: { value: 454, rank: 39 },
            medianHomePrice: { value: 425000, rank: 31 },
            foodInsecurity: { value: 9.3, rank: 16 }
        }
    },
    "Massachusetts": {
        abbr: "MA",
        metrics: {
            personalIncome: { value: 58456, rank: 9 },
            povertyRate: { value: 11.2, rank: 24 },
            educationAttainment: { value: 45.0, rank: 1 },
            lifeExpectancy: { value: 80.4, rank: 3 },
            infantMortality: { value: 3.7, rank: 3 },
            violentCrime: { value: 308, rank: 20 },
            medianHomePrice: { value: 595000, rank: 44 },
            foodInsecurity: { value: 7.8, rank: 5 }
        }
    },
    "Michigan": {
        abbr: "MI",
        metrics: {
            personalIncome: { value: 54567, rank: 21 },
            povertyRate: { value: 12.2, rank: 32 },
            educationAttainment: { value: 30.0, rank: 29 },
            lifeExpectancy: { value: 77.0, rank: 33 },
            infantMortality: { value: 6.3, rank: 37 },
            violentCrime: { value: 478, rank: 42 },
            medianHomePrice: { value: 245000, rank: 10 },
            foodInsecurity: { value: 11.0, rank: 28 }
        }
    },
    "Minnesota": {
        abbr: "MN",
        metrics: {
            personalIncome: { value: 58234, rank: 11 },
            povertyRate: { value: 8.5, rank: 6 },
            educationAttainment: { value: 37.3, rank: 8 },
            lifeExpectancy: { value: 79.8, rank: 5 },
            infantMortality: { value: 4.6, rank: 12 },
            violentCrime: { value: 281, rank: 17 },
            medianHomePrice: { value: 335000, rank: 18 },
            foodInsecurity: { value: 7.5, rank: 3 }
        }
    },
    "Mississippi": {
        abbr: "MS",
        metrics: {
            personalIncome: { value: 46789, rank: 48 },
            povertyRate: { value: 16.8, rank: 48 },
            educationAttainment: { value: 23.2, rank: 50 },
            lifeExpectancy: { value: 73.6, rank: 49 },
            infantMortality: { value: 8.0, rank: 49 },
            violentCrime: { value: 291, rank: 18 },
            medianHomePrice: { value: 175000, rank: 1 },
            foodInsecurity: { value: 15.8, rank: 50 }
        }
    },
    "Missouri": {
        abbr: "MO",
        metrics: {
            personalIncome: { value: 54890, rank: 21 },
            povertyRate: { value: 12.0, rank: 31 },
            educationAttainment: { value: 30.2, rank: 27 },
            lifeExpectancy: { value: 76.0, rank: 42 },
            infantMortality: { value: 6.0, rank: 32 },
            violentCrime: { value: 543, rank: 44 },
            medianHomePrice: { value: 255000, rank: 11 },
            foodInsecurity: { value: 11.5, rank: 31 }
        }
    },
    "Montana": {
        abbr: "MT",
        metrics: {
            personalIncome: { value: 50123, rank: 36 },
            povertyRate: { value: 12.5, rank: 35 },
            educationAttainment: { value: 33.5, rank: 17 },
            lifeExpectancy: { value: 77.8, rank: 23 },
            infantMortality: { value: 5.4, rank: 21 },
            violentCrime: { value: 469, rank: 41 },
            medianHomePrice: { value: 455000, rank: 34 },
            foodInsecurity: { value: 10.5, rank: 23 }
        }
    },
    "Nebraska": {
        abbr: "NE",
        metrics: {
            personalIncome: { value: 58901, rank: 8 },
            povertyRate: { value: 9.2, rank: 10 },
            educationAttainment: { value: 32.8, rank: 21 },
            lifeExpectancy: { value: 79.0, rank: 9 },
            infantMortality: { value: 5.0, rank: 16 },
            violentCrime: { value: 285, rank: 19 },
            medianHomePrice: { value: 275000, rank: 12 },
            foodInsecurity: { value: 9.0, rank: 12 }
        }
    },
    "Nevada": {
        abbr: "NV",
        metrics: {
            personalIncome: { value: 48901, rank: 41 },
            povertyRate: { value: 13.8, rank: 43 },
            educationAttainment: { value: 26.0, rank: 46 },
            lifeExpectancy: { value: 77.2, rank: 30 },
            infantMortality: { value: 5.7, rank: 26 },
            violentCrime: { value: 460, rank: 40 },
            medianHomePrice: { value: 445000, rank: 33 },
            foodInsecurity: { value: 12.8, rank: 39 }
        }
    },
    "New Hampshire": {
        abbr: "NH",
        metrics: {
            personalIncome: { value: 58901, rank: 7 },
            povertyRate: { value: 7.8, rank: 2 },
            educationAttainment: { value: 38.5, rank: 7 },
            lifeExpectancy: { value: 79.5, rank: 7 },
            infantMortality: { value: 4.0, rank: 6 },
            violentCrime: { value: 146, rank: 4 },
            medianHomePrice: { value: 475000, rank: 36 },
            foodInsecurity: { value: 6.8, rank: 2 }
        }
    },
    "New Jersey": {
        abbr: "NJ",
        metrics: {
            personalIncome: { value: 54567, rank: 23 },
            povertyRate: { value: 11.5, rank: 26 },
            educationAttainment: { value: 41.2, rank: 3 },
            lifeExpectancy: { value: 79.2, rank: 8 },
            infantMortality: { value: 4.3, rank: 9 },
            violentCrime: { value: 195, rank: 10 },
            medianHomePrice: { value: 505000, rank: 38 },
            foodInsecurity: { value: 8.2, rank: 8 }
        }
    },
    "New Mexico": {
        abbr: "NM",
        metrics: {
            personalIncome: { value: 49234, rank: 39 },
            povertyRate: { value: 16.5, rank: 47 },
            educationAttainment: { value: 28.5, rank: 36 },
            lifeExpectancy: { value: 76.3, rank: 39 },
            infantMortality: { value: 6.6, rank: 40 },
            violentCrime: { value: 778, rank: 49 },
            medianHomePrice: { value: 325000, rank: 17 },
            foodInsecurity: { value: 14.5, rank: 45 }
        }
    },
    "New York": {
        abbr: "NY",
        metrics: {
            personalIncome: { value: 52345, rank: 26 },
            povertyRate: { value: 14.8, rank: 46 },
            educationAttainment: { value: 38.0, rank: 9 },
            lifeExpectancy: { value: 80.5, rank: 2 },
            infantMortality: { value: 4.4, rank: 10 },
            violentCrime: { value: 363, rank: 28 },
            medianHomePrice: { value: 425000, rank: 30 },
            foodInsecurity: { value: 10.2, rank: 22 }
        }
    },
    "North Carolina": {
        abbr: "NC",
        metrics: {
            personalIncome: { value: 53890, rank: 25 },
            povertyRate: { value: 13.2, rank: 39 },
            educationAttainment: { value: 33.4, rank: 18 },
            lifeExpectancy: { value: 77.0, rank: 31 },
            infantMortality: { value: 6.8, rank: 43 },
            violentCrime: { value: 377, rank: 30 },
            medianHomePrice: { value: 335000, rank: 16 },
            foodInsecurity: { value: 11.8, rank: 34 }
        }
    },
    "North Dakota": {
        abbr: "ND",
        metrics: {
            personalIncome: { value: 60123, rank: 5 },
            povertyRate: { value: 9.5, rank: 12 },
            educationAttainment: { value: 30.5, rank: 26 },
            lifeExpectancy: { value: 78.8, rank: 11 },
            infantMortality: { value: 6.0, rank: 33 },
            violentCrime: { value: 311, rank: 21 },
            medianHomePrice: { value: 285000, rank: 14 },
            foodInsecurity: { value: 8.5, rank: 10 }
        }
    },
    "Ohio": {
        abbr: "OH",
        metrics: {
            personalIncome: { value: 55234, rank: 20 },
            povertyRate: { value: 12.5, rank: 34 },
            educationAttainment: { value: 29.0, rank: 35 },
            lifeExpectancy: { value: 76.5, rank: 37 },
            infantMortality: { value: 6.7, rank: 41 },
            violentCrime: { value: 309, rank: 22 },
            medianHomePrice: { value: 215000, rank: 5 },
            foodInsecurity: { value: 12.2, rank: 36 }
        }
    },
    "Oklahoma": {
        abbr: "OK",
        metrics: {
            personalIncome: { value: 52345, rank: 29 },
            povertyRate: { value: 13.5, rank: 41 },
            educationAttainment: { value: 26.8, rank: 43 },
            lifeExpectancy: { value: 74.1, rank: 49 },
            infantMortality: { value: 7.4, rank: 46 },
            violentCrime: { value: 459, rank: 39 },
            medianHomePrice: { value: 195000, rank: 2 },
            foodInsecurity: { value: 14.0, rank: 43 }
        }
    },
    "Oregon": {
        abbr: "OR",
        metrics: {
            personalIncome: { value: 50234, rank: 33 },
            povertyRate: { value: 12.8, rank: 36 },
            educationAttainment: { value: 34.5, rank: 13 },
            lifeExpectancy: { value: 78.8, rank: 11 },
            infantMortality: { value: 4.8, rank: 13 },
            violentCrime: { value: 292, rank: 19 },
            medianHomePrice: { value: 505000, rank: 39 },
            foodInsecurity: { value: 11.0, rank: 29 }
        }
    },
    "Pennsylvania": {
        abbr: "PA",
        metrics: {
            personalIncome: { value: 57234, rank: 14 },
            povertyRate: { value: 11.5, rank: 26 },
            educationAttainment: { value: 33.1, rank: 19 },
            lifeExpectancy: { value: 77.6, rank: 25 },
            infantMortality: { value: 5.9, rank: 29 },
            violentCrime: { value: 310, rank: 23 },
            medianHomePrice: { value: 285000, rank: 15 },
            foodInsecurity: { value: 10.0, rank: 21 }
        }
    },
    "Rhode Island": {
        abbr: "RI",
        metrics: {
            personalIncome: { value: 54890, rank: 19 },
            povertyRate: { value: 11.0, rank: 23 },
            educationAttainment: { value: 35.4, rank: 11 },
            lifeExpectancy: { value: 79.4, rank: 7 },
            infantMortality: { value: 5.1, rank: 18 },
            violentCrime: { value: 231, rank: 11 },
            medianHomePrice: { value: 445000, rank: 33 },
            foodInsecurity: { value: 8.8, rank: 11 }
        }
    },
    "South Carolina": {
        abbr: "SC",
        metrics: {
            personalIncome: { value: 52123, rank: 28 },
            povertyRate: { value: 13.5, rank: 40 },
            educationAttainment: { value: 29.2, rank: 33 },
            lifeExpectancy: { value: 75.7, rank: 44 },
            infantMortality: { value: 6.4, rank: 38 },
            violentCrime: { value: 531, rank: 43 },
            medianHomePrice: { value: 295000, rank: 16 },
            foodInsecurity: { value: 12.5, rank: 38 }
        }
    },
    "South Dakota": {
        abbr: "SD",
        metrics: {
            personalIncome: { value: 56789, rank: 17 },
            povertyRate: { value: 10.5, rank: 19 },
            educationAttainment: { value: 30.8, rank: 25 },
            lifeExpectancy: { value: 78.2, rank: 17 },
            infantMortality: { value: 6.0, rank: 31 },
            violentCrime: { value: 501, rank: 42 },
            medianHomePrice: { value: 305000, rank: 17 },
            foodInsecurity: { value: 9.8, rank: 19 }
        }
    },
    "Tennessee": {
        abbr: "TN",
        metrics: {
            personalIncome: { value: 54567, rank: 22 },
            povertyRate: { value: 13.0, rank: 37 },
            educationAttainment: { value: 28.8, rank: 37 },
            lifeExpectancy: { value: 74.7, rank: 46 },
            infantMortality: { value: 6.9, rank: 44 },
            violentCrime: { value: 672, rank: 48 },
            medianHomePrice: { value: 335000, rank: 18 },
            foodInsecurity: { value: 12.8, rank: 40 }
        }
    },
    "Texas": {
        abbr: "TX",
        metrics: {
            personalIncome: { value: 56890, rank: 15 },
            povertyRate: { value: 13.8, rank: 42 },
            educationAttainment: { value: 30.3, rank: 28 },
            lifeExpectancy: { value: 77.0, rank: 34 },
            infantMortality: { value: 5.5, rank: 23 },
            violentCrime: { value: 446, rank: 37 },
            medianHomePrice: { value: 315000, rank: 18 },
            foodInsecurity: { value: 13.2, rank: 42 }
        }
    },
    "Utah": {
        abbr: "UT",
        metrics: {
            personalIncome: { value: 52345, rank: 27 },
            povertyRate: { value: 8.8, rank: 8 },
            educationAttainment: { value: 35.5, rank: 11 },
            lifeExpectancy: { value: 79.9, rank: 4 },
            infantMortality: { value: 4.7, rank: 13 },
            violentCrime: { value: 234, rank: 13 },
            medianHomePrice: { value: 525000, rank: 41 },
            foodInsecurity: { value: 8.0, rank: 6 }
        }
    },
    "Vermont": {
        abbr: "VT",
        metrics: {
            personalIncome: { value: 52890, rank: 26 },
            povertyRate: { value: 10.8, rank: 22 },
            educationAttainment: { value: 39.8, rank: 6 },
            lifeExpectancy: { value: 79.7, rank: 6 },
            infantMortality: { value: 3.9, rank: 5 },
            violentCrime: { value: 173, rank: 6 },
            medianHomePrice: { value: 385000, rank: 27 },
            foodInsecurity: { value: 8.2, rank: 7 }
        }
    },
    "Virginia": {
        abbr: "VA",
        metrics: {
            personalIncome: { value: 55678, rank: 18 },
            povertyRate: { value: 10.5, rank: 21 },
            educationAttainment: { value: 40.5, rank: 4 },
            lifeExpectancy: { value: 78.4, rank: 16 },
            infantMortality: { value: 5.6, rank: 26 },
            violentCrime: { value: 208, rank: 11 },
            medianHomePrice: { value: 385000, rank: 25 },
            foodInsecurity: { value: 8.5, rank: 9 }
        }
    },
    "Washington": {
        abbr: "WA",
        metrics: {
            personalIncome: { value: 54567, rank: 22 },
            povertyRate: { value: 11.2, rank: 25 },
            educationAttainment: { value: 36.8, rank: 9 },
            lifeExpectancy: { value: 79.2, rank: 8 },
            infantMortality: { value: 4.5, rank: 10 },
            violentCrime: { value: 324, rank: 24 },
            medianHomePrice: { value: 595000, rank: 43 },
            foodInsecurity: { value: 9.2, rank: 14 }
        }
    },
    "West Virginia": {
        abbr: "WV",
        metrics: {
            personalIncome: { value: 48234, rank: 44 },
            povertyRate: { value: 14.5, rank: 45 },
            educationAttainment: { value: 22.5, rank: 50 },
            lifeExpectancy: { value: 74.8, rank: 45 },
            infantMortality: { value: 7.0, rank: 43 },
            violentCrime: { value: 355, rank: 26 },
            medianHomePrice: { value: 145000, rank: 1 },
            foodInsecurity: { value: 13.8, rank: 42 }
        }
    },
    "Wisconsin": {
        abbr: "WI",
        metrics: {
            personalIncome: { value: 56234, rank: 17 },
            povertyRate: { value: 10.0, rank: 15 },
            educationAttainment: { value: 31.2, rank: 24 },
            lifeExpectancy: { value: 78.6, rank: 14 },
            infantMortality: { value: 5.3, rank: 21 },
            violentCrime: { value: 324, rank: 25 },
            medianHomePrice: { value: 295000, rank: 15 },
            foodInsecurity: { value: 8.5, rank: 10 }
        }
    },
    "Wyoming": {
        abbr: "WY",
        metrics: {
            personalIncome: { value: 56890, rank: 16 },
            povertyRate: { value: 10.8, rank: 21 },
            educationAttainment: { value: 27.4, rank: 40 },
            lifeExpectancy: { value: 77.5, rank: 27 },
            infantMortality: { value: 5.8, rank: 28 },
            violentCrime: { value: 234, rank: 12 },
            medianHomePrice: { value: 345000, rank: 20 },
            foodInsecurity: { value: 10.8, rank: 27 }
        }
    }
};

// Metric descriptions for tooltip display
const metricDescriptions = {
    personalIncome: {
        name: "Personal Income",
        description: "Per capita personal income adjusted for regional cost of living",
        unit: "$",
        source: "Bureau of Economic Analysis (2023)",
        higherIsBetter: true
    },
    povertyRate: {
        name: "Poverty Rate",
        description: "Percentage of population below poverty line, adjusted for regional differences",
        unit: "%",
        source: "US Census Bureau (2023)",
        higherIsBetter: false
    },
    educationAttainment: {
        name: "Education Attainment",
        description: "Percentage of adults 25+ with bachelor's degree or higher",
        unit: "%",
        source: "US Census Bureau (2023)",
        higherIsBetter: true
    },
    lifeExpectancy: {
        name: "Life Expectancy",
        description: "Average life expectancy at birth in years",
        unit: " years",
        source: "CDC National Center for Health Statistics (2023)",
        higherIsBetter: true
    },
    infantMortality: {
        name: "Infant Mortality",
        description: "Deaths per 1,000 live births",
        unit: " per 1,000",
        source: "CDC National Center for Health Statistics (2023)",
        higherIsBetter: false
    },
    violentCrime: {
        name: "Violent Crime Rate",
        description: "Violent crimes per 100,000 population",
        unit: " per 100,000",
        source: "FBI Uniform Crime Report (2023)",
        higherIsBetter: false
    },
    medianHomePrice: {
        name: "Median Home Price",
        description: "Median listing price for homes",
        unit: "$",
        source: "Zillow Home Value Index (2024)",
        higherIsBetter: false
    },
    foodInsecurity: {
        name: "Food Insecurity",
        description: "Percentage of households experiencing food insecurity",
        unit: "%",
        source: "USDA Economic Research Service (2023)",
        higherIsBetter: false
    }
};

// Calculate how many metrics are better than national average for each state
function calculateBetterThanAverage(state) {
    let betterCount = 0;
    const comparison = {};

    for (const metric in state.metrics) {
        const value = state.metrics[metric].value;
        const avg = nationalAverages[metric];
        const better = higherIsBetter[metric];

        let isBetter;
        if (better) {
            isBetter = value > avg;
        } else {
            isBetter = value < avg;
        }

        if (isBetter) betterCount++;
        comparison[metric] = isBetter;
    }

    return { betterCount, worseCount: 8 - betterCount, comparison };
}

// Grade color scale based on metrics better than national average
// 8 better = Dark green (best)
// 0 better = Dark red (worst)
const gradeColors = {
    8: "#1a5e1a",  // All 8 better - Dark forest green
    7: "#2e8b2e",  // 7 better, 1 worse - Green
    6: "#4CAF50",  // 6 better, 2 worse - Medium green
    5: "#8BC34A",  // 5 better, 3 worse - Light green
    4: "#FFC107",  // 4 better, 4 worse - Yellow (average)
    3: "#FF9800",  // 3 better, 5 worse - Orange
    2: "#FF5722",  // 2 better, 6 worse - Deep orange
    1: "#E53935",  // 1 better, 7 worse - Red
    0: "#8B0000"   // 0 better, 8 worse - Dark red
};

const gradeLabels = {
    8: "Excellent (8/8)",
    7: "Very Good (7/8)",
    6: "Good (6/8)",
    5: "Above Average (5/8)",
    4: "Average (4/8)",
    3: "Below Average (3/8)",
    2: "Poor (2/8)",
    1: "Very Poor (1/8)",
    0: "Worst (0/8)"
};

// Function to get color based on better count
function getGradeColor(betterCount) {
    return gradeColors[betterCount] || gradeColors[0];
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

// Format number with commas
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Pre-calculate grades for all states
for (const stateName in stateData) {
    const result = calculateBetterThanAverage(stateData[stateName]);
    stateData[stateName].betterCount = result.betterCount;
    stateData[stateName].worseCount = result.worseCount;
    stateData[stateName].comparison = result.comparison;
    stateData[stateName].grade = gradeLabels[result.betterCount];
    stateData[stateName].color = getGradeColor(result.betterCount);
}
