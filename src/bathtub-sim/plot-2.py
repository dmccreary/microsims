# Re-running the simulation to track the height of the water over time

# Reset initial conditions
height = initial_height
height_over_time = []

# Re-simulate
for t in np.arange(0, max_time, time_step):
    if height <= 0:
        break

    velocity = np.sqrt(2 * g * height)
    current_flow_rate = hole_area * velocity
    height -= current_flow_rate * time_step / (np.pi * hole_radius**2)

    height_over_time.append(height)

# Plotting the results
plt.figure(figsize=(10, 6))
plt.plot(time, height_over_time)
plt.title("Height of Water in the Tank Over Time")
plt.xlabel("Time (s)")
plt.ylabel("Height of Water (m)")
plt.grid(True)
plt.show()
