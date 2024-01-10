import numpy as np
import matplotlib.pyplot as plt

# Constants
g = 9.81  # Acceleration due to gravity (m/s^2)
rho = 1000  # Density of water (kg/m^3)
tank_volume = 0.01  # Tank volume in cubic meters (10 liters)
hole_diameter = 0.02  # Diameter of the hole in meters (2 cm)
hole_radius = hole_diameter / 2
hole_area = np.pi * hole_radius**2  # Area of the hole

# Initial conditions
initial_height = tank_volume / (np.pi * hole_radius**2)  # Initial height of water assuming cylindrical tank
time_step = 0.1  # Time step for simulation (s)
max_time = 1000  # Maximum simulation time (s)

# Simulation
time = []
flow_rate = []
height = initial_height

for t in np.arange(0, max_time, time_step):
    if height <= 0:
        break

    velocity = np.sqrt(2 * g * height)
    current_flow_rate = hole_area * velocity
    height -= current_flow_rate * time_step / (np.pi * hole_radius**2)

    time.append(t)
    flow_rate.append(current_flow_rate)

# Plotting the results
plt.figure(figsize=(10, 6))
plt.plot(time, flow_rate)
plt.title("Rate of Water Flow from the Tank Over Time")
plt.xlabel("Time (s)")
plt.ylabel("Flow Rate (m^3/s)")
plt.grid(True)
plt.show()
