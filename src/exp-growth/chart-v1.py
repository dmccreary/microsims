
import matplotlib.pyplot as plt
import numpy as np

# Data for plotting
years = np.arange(2023, 2041)

# Redefining the microsims to double every year
# Starting with 100 in 2023 and doubling each year
microsims_doubling = 100 * 2 ** (years - 2023)

# Creating the plot for doubling every year
plt.figure(figsize=(10,6))
plt.plot(years, microsims_doubling, label="Doubling Growth of MicroSims", color='blue')

# Setting the y-axis to log scale
plt.yscale('log')

# Labels and title
plt.xlabel("Year")
plt.ylabel("Number of MicroSims")
plt.title("Doubling Growth of MicroSims from 2023 to 2040")
plt.grid(True, which="both", ls="--")

# Adding the axis labels
plt.xticks(years, rotation=45)
plt.yticks([100, 1000, 10000, 100000, 1000000, 10000000, 100000000],
           ['100s', '1,000s', '10,000s', '100,000s', '1,000,000s', '10,000,000s', '100,000,000s'])

# Show plot
plt.legend()
plt.tight_layout()
plt.show()
