#!/bin/bash
# Build script for MicroSims ArXiv Paper
# Uses Tectonic for modern LaTeX compilation

set -e  # Exit on error

# Change to the paper directory
cd "$(dirname "$0")"

echo "Building MicroSims ArXiv Paper..."
echo "================================="
echo ""

# Check if tectonic is installed
if ! command -v tectonic &> /dev/null; then
    echo "Error: Tectonic is not installed."
    echo "Install with: brew install tectonic"
    exit 1
fi

# Clean previous build artifacts (optional)
if [ "$1" == "clean" ]; then
    echo "Cleaning build artifacts..."
    rm -f main.pdf main.aux main.log main.out main.bbl main.blg
    echo "Clean complete."
    exit 0
fi

# Run tectonic
echo "Running tectonic..."
tectonic main.tex

# Check if PDF was generated
if [ -f "main.pdf" ]; then
    echo ""
    echo "Success! PDF generated: main.pdf"
    echo ""
    echo "File size: $(du -h main.pdf | cut -f1)"
    echo "Page count: $(pdfinfo main.pdf 2>/dev/null | grep Pages | awk '{print $2}')"
    echo ""
    echo "To view the PDF:"
    echo "  open main.pdf"
else
    echo ""
    echo "Error: PDF generation failed!"
    exit 1
fi
