"""
Generate a gallary.md file from getting images from the sims directory.
make sure your environment contains the PIL library

Example usage
python mk-gallary.py

GPT Prompt:

Can you help me write a Python program?  I need a page that holds a gallary of images of MicroSims with names and links to the MicroSims.
I have a mkdocs microsite that stores information about p5.js simulations for classrooms.
The "../docs/sims" folder contains a series of directories that each have titles and images of the microsims.
I would like to create a Python program that:

1. Steps through each of the directories under the "../docs/sims" area
2. For each directory, get the directory name.  We call this the simID.
2. Finds the name of the simulation by opening the index.md and getting the title which is usually the first line in the index.md file and starts with a single "#".  
3. If the title is not there, then the name of the sim is just the name of the directory, the simID
4. Gets the first image in the sim directory.  This is usually the simID followed by ".png".
5. For each sim, generate a thumbnail image that is only 64x64.  Place all the images in a new folder called "thumbnails".  Each thumbnail is called SimID.png.
6. Generate a new markdown file called "gallery.md" that has a table in it with four columns.  Each cell should contain:
- The name of the sim which is a link to the ../sims/{$SimID}
- A link to the thumbnail image of the sim using "![./thumbnails/{$simID}.png}

Please check that all the requirements are clear.

Note that the table header is following header:

        md_file.write("|     |     |     |     |\n")
        md_file.write("| --- | --- | --- | --- |\n")

"""

import os
from PIL import Image

# Function to create a thumbnail
def create_thumbnail(image_path, thumbnail_path, size=(128, 128)):
    with Image.open(image_path) as img:
        img.thumbnail(size)
        img.save(thumbnail_path)

# Function to process each simulation directory
def process_simulation_dir(directory, thumbnails_dir, gallery_lines):
    simID = os.path.basename(directory)
    title = simID  # Default title is the simID
    index_file = os.path.join(directory, 'index.md')

    # Check if index.md exists and extract the title
    if os.path.exists(index_file):
        with open(index_file, 'r') as file:
            for line in file:
                if line.startswith('#'):
                    title = line.strip('#').strip()
                    break

    # Find the first image (simID.png)
    image_file = os.path.join(directory, f'{simID}.png')
    if not os.path.exists(image_file):
        print(f"No image found for {simID}, skipping.")
        return

    # Create a thumbnail
    thumbnail_path = os.path.join(thumbnails_dir, f'{simID}.png')
    create_thumbnail(image_file, thumbnail_path)

    # Add entry to the gallery lines
    gallery_lines.append(f"[{title}](../{simID}) ![thumbnail](./thumbnails/{simID}.png)")

# Directory paths
project_dir = '/Users/danmccreary/Documents/ws/microsims/'
sims_relative_path = 'docs/sims/'
# implicit concatination done by Python
sims_dir = project_dir + sims_relative_path
# where we write the gallary.md file
gallery_dir = project_dir + 'docs/sims/'
# where we put all the thumbnails
thumbnails_dir = gallery_dir + 'thumbnails/'


# Create the thumbnails directory if it doesn't exist
if not os.path.exists(thumbnails_dir):
    os.makedirs(thumbnails_dir)

sims = []
gallery_lines = []

# Get a list of the sims
for subdir in os.listdir(sims_dir):
    sims.append(subdir)

# sort alphabetically
sims.sort()

# Process each simulation directory
for sim in sims:
    full_path = os.path.join(sims_dir, sim)
    if os.path.isdir(full_path):
        process_simulation_dir(full_path, thumbnails_dir, gallery_lines)

# Generate gallery.md content
gallery_content = ""
for i in range(0, len(gallery_lines), 4):
    row = gallery_lines[i:i+4]
    gallery_content += '| ' + ' | '.join(row) + ' |\n'

# Add the header row and column separators if there are any rows
if gallery_content:
    title = '# Gallery\n\n'
    # header_row = '| ' + ' | '.join(['Sim' for _ in range(4)]) + ' |\n'
    header_row = '| ' + ' | '.join(['   ' for _ in range(4)]) + ' |\n'
    separator_row = '| ' + ' | '.join(['---' for _ in range(4)]) + ' |\n'
    gallery_content =  title + header_row + separator_row + gallery_content

# Save the gallery.md file
with open(os.path.join(gallery_dir, "gallery.md"), "w") as file:
    file.write(gallery_content)
