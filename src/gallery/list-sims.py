# List the directories in the sims directory

import os

sims = []

project_dir = '/Users/danmccreary/Documents/ws/microsims/'
sims_relative_path = 'docs/sims/'
# implicit concatination done by Python
sims_dir = project_dir + sims_relative_path

print("Current Working Directory:", os.getcwd())
print("Sims Dir:", sims_dir)
# Directory paths

for subdir in os.listdir(sims_dir):
    sims.append(subdir)

# sort alphabetically
sims.sort()

for sim in sims:
    print("Sim:", sim)

print("Total Count:", len(sims))