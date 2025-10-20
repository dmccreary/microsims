#!/usr/bin/env python3
"""
zip-skills.py

Creates a zip file for each skill directory in the /skills folder.
Each zip file is named after the skill directory (e.g., microsim-p5.zip)
and is placed in the /skills directory.

Usage:
    python src/zip-skills.py
"""

import os
import zipfile
from pathlib import Path


def zip_skill_directory(skill_path, output_path):
    """
    Create a zip file from a skill directory.

    Args:
        skill_path: Path to the skill directory
        output_path: Path where the zip file should be created
    """
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Walk through the directory
        for root, dirs, files in os.walk(skill_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Calculate the archive name (relative path from skill directory)
                arcname = os.path.relpath(file_path, os.path.dirname(skill_path))
                zipf.write(file_path, arcname)
                print(f"  Added: {arcname}")


def main():
    """Main function to process all skill directories."""
    # Get the project root directory (parent of src)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    skills_dir = project_root / 'skills'

    if not skills_dir.exists():
        print(f"Error: Skills directory not found at {skills_dir}")
        return

    print(f"Scanning for skill directories in: {skills_dir}\n")

    # Find all subdirectories in the skills folder
    skill_dirs = [d for d in skills_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]

    if not skill_dirs:
        print("No skill directories found.")
        return

    print(f"Found {len(skill_dirs)} skill directory(ies)\n")

    # Create a zip file for each skill directory
    for skill_dir in skill_dirs:
        skill_name = skill_dir.name
        zip_filename = f"{skill_name}.zip"
        zip_path = skills_dir / zip_filename

        print(f"Creating {zip_filename}...")
        zip_skill_directory(skill_dir, zip_path)

        # Get the size of the created zip file
        zip_size = os.path.getsize(zip_path)
        print(f"✓ Created {zip_filename} ({zip_size:,} bytes)\n")

    print(f"Done! Created {len(skill_dirs)} zip file(s) in {skills_dir}")


if __name__ == "__main__":
    main()
