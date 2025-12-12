---
title: Battery Life Calculator
description: An interactive MicroSim that estimates how long a battery will last based on capacity and current draw.
---
# Battery Life Calculator

<iframe src="main.html" width="100%" height="330px" scrolling="no"></iframe>

[Run the Battery Life Calculator MicroSim](main.html){ .md-button .md-button--primary }

[Edit this MicroSim](https://editor.p5js.org/)

## About This MicroSim

This battery life calculator estimates how long a battery will last, based on nominal battery capacity and the average current that a load is drawing from it. Battery capacity is typically measured in Amp-hours (Ah) or milliamp-hours (mAh), although Watt-hours (Wh) is occasionally used.

The formula is simple:

$$\text{Hours} = \frac{\text{Capacity (mAh)}}{\text{Current (mA)}}$$

You can convert Watt-hours to Amp-hours by dividing by the battery's nominal voltage (V):

$$\text{Ah} = \frac{\text{Wh}}{\text{V}}$$

## Battery Options

| Battery | Capacity |
|---------|----------|
| CR2032 Coin Cell | 220 mAh |
| 2x AAA Alkaline | 2,400 mAh |
| 4x AA Alkaline | 10,000 mAh |
| 9V Battery | 550 mAh |
| 18650 LiPo Cell | 3,000 mAh |
| Power Pack 10,000mAh | 10,000 mAh |

## Device Options

| Device | Current Draw |
|--------|--------------|
| Dim Red LED | 2 mA |
| Bright White LED | 20 mA |
| 30 RGB LED Strip (10% brightness) | 180 mA |
| 8x8 RGB LED Matrix (80% brightness) | 1,024 mA |

## Key Features

- Select from common battery types or enter custom capacity
- Select from common devices or enter custom current draw
- Visual battery representation with color-coded duration
- Automatic time unit conversion (minutes, hours, days, weeks, years)

## References

- [DigiKey Battery Life Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-battery-life)
