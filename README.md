# Micro Simulations for Education

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://dmccreary.github.io/microsims/)
[![Made with MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-blue)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=MaterialForMkDocs&logoColor=white)](https://squidfunk.github.io/mkdocs-material/)
[![p5.js](https://img.shields.io/badge/Built%20with-p5.js-pink)](https://p5js.org/)

**Educational interactive simulations created with generative AI tools and p5.js**

🌐 **Live Site**: [https://dmccreary.github.io/microsims/](https://dmccreary.github.io/microsims/)

## About

This repository contains over 100 interactive educational simulations (MicroSims) designed for classroom use. Each simulation demonstrates specific concepts in physics, computer science, mathematics, and other STEM subjects using the p5.js JavaScript library.

### Key Features

- **100+ Interactive Simulations** covering diverse educational topics
- **Responsive Design** that works on desktops, tablets, and mobile devices
- **Standardized Interface** with consistent controls and accessibility features
- **Educational Documentation** with lesson plans and teaching guidelines
- **AI-Generated Content** created with tools like ChatGPT and Claude
- **Open Source** under Creative Commons licensing

### Subject Areas

- Physics (bouncing balls, waves, circuits, mechanics)
- Computer Science (algorithms, data structures, neural networks)
- Mathematics (geometry, statistics, functions)
- Electronics (logic gates, microcontrollers, circuits)
- Biology and Chemistry simulations

## Quick Start

### Viewing Simulations
Visit the [live site](https://dmccreary.github.io/microsims/) to explore all simulations with full documentation.

### Local Development
```bash
# Clone the repository
git clone https://github.com/dmccreary/microsims.git
cd microsims

# Install MkDocs (requires Python)
pip install mkdocs mkdocs-material

# Serve locally
mkdocs serve
```

### Build Commands
- `mkdocs serve` - Preview site locally
- `mkdocs build` - Build static site
- `python src/mk-gallery.py` - Generate simulation gallery
- `python src/validate-yaml-file.py <file>` - Validate simulation metadata

## Contributing

We welcome contributions! Each simulation follows standardized patterns:

1. **File Structure**: Each simulation has its own directory with `index.md`, JavaScript file, and preview image
2. **Coding Standards**: Follow p5.js conventions with responsive design patterns
3. **Documentation**: Include educational context and lesson plan suggestions
4. **Metadata**: Use structured YAML metadata following Dublin Core standards

See the [submission guidelines](https://dmccreary.github.io/microsims/submission-guidelines/) for detailed instructions.

## Project Structure

```
microsims/
├── docs/
│   ├── sims/           # Individual simulation directories
│   ├── chapters/       # Educational theory documentation
│   └── setup/          # Getting started guides
├── src/
│   ├── mk-gallery.py   # Gallery generation utility
│   ├── validate-yaml-file.py  # Metadata validation
│   └── microsim-schema.json   # Metadata schema
└── site/               # Generated documentation (build output)
```

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**
- Attribution — Give appropriate credit and link to the license
- NonCommercial — Not for commercial use
- ShareAlike — Distribute contributions under the same license

## Acknowledgments

This project is built upon several outstanding open source projects:

### Core Technologies
- **[p5.js](https://p5js.org/)** - Creative coding JavaScript library for interactive graphics
- **[MkDocs](https://www.mkdocs.org/)** - Static site generator for project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Material Design theme for MkDocs

### AI Tools
- **[ChatGPT](https://openai.com/chatgpt)** by OpenAI - Used for generating simulation code and documentation
- **[Claude](https://claude.ai/)** by Anthropic - AI assistant for code generation and refinement

### Development Tools
- **[Python](https://www.python.org/)** - Automation scripts and utilities
- **[GitHub Pages](https://pages.github.com/)** - Free hosting for the documentation site
- **[Visual Studio Code](https://code.visualstudio.com/)** - Development environment

### Educational Inspiration
- **[Processing](https://processing.org/)** - Original creative coding environment that inspired p5.js
- **[The Nature of Code](https://natureofcode.com/)** by Daniel Shiffman - Computational design concepts
- **[Khan Academy](https://www.khanacademy.org/)** - Educational content and interactive learning approaches

Special thanks to the open source community for making educational technology accessible to everyone.

---

**Author**: Dan McCreary
**Contact**: [GitHub Issues](https://github.com/dmccreary/microsims/issues)