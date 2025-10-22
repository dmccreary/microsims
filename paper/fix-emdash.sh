#!/bin/bash
# Replace Unicode em-dash (—) with LaTeX em-dash (---)

for file in sections/*.tex; do
    if [ -f "$file" ]; then
        # Use sed to replace em-dash with LaTeX triple hyphen
        sed -i.bak 's/—/---/g' "$file"
        echo "Fixed: $file"
    fi
done

echo ""
echo "All em-dashes replaced with LaTeX --- syntax"
echo "Backup files created with .bak extension"
