---
title: Conway's Game of Life
description: An interactive MicroSim demonstrating Conway's Game of Life cellular automata with blue cells on an aliceblue background.
image: /sims/conway-game-of-life/conway-game-of-life.png
og:image: /sims/conway-game-of-life/conway-game-of-life.png
twitter:image: /sims/conway-game-of-life/conway-game-of-life.png
social:
   cards: false
---

# Conway's Game of Life

<iframe src="main.html" height="440px" width="100%" scrolling="no"></iframe>

[Run the Conway's Game of Life MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is a classic example of [cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton), created by mathematician John Conway in 1970. Despite having simple rules, it can produce remarkably complex and beautiful patterns.

## The Rules

Each cell in the grid follows four simple rules:

1. **Underpopulation**: Any live cell with fewer than 2 neighbors dies
2. **Survival**: Any live cell with 2 or 3 neighbors survives
3. **Overpopulation**: Any live cell with more than 3 neighbors dies
4. **Reproduction**: Any dead cell with exactly 3 neighbors becomes alive

## How to Use

- **Start/Pause**: Begin or pause the simulation
- **Step**: Advance the simulation by one generation
- **Reset**: Create a new random initial state
- **Speed Slider**: Control how fast the simulation runs
- **Click on Grid**: Toggle individual cells on or off

## Embedding This MicroSim

```html
<iframe src="https://dmccreary.github.io/microsims/sims/conway-game-of-life/main.html"
        height="440px"
        width="100%"
        scrolling="no">
</iframe>
```

## Learning Objectives

After using this MicroSim, you should be able to:

- Explain the four rules of Conway's Game of Life
- Understand how simple rules can create emergent complexity
- Recognize common patterns like gliders, blinkers, and still lifes
- Describe what cellular automata are and how they work

## Famous Patterns

Try to create these patterns by clicking on the grid:

| Pattern | Description |
|---------|-------------|
| **Blinker** | 3 cells in a row that oscillate |
| **Glider** | 5-cell pattern that moves diagonally |
| **Block** | 2x2 square that stays still |
| **Beehive** | 6-cell still life pattern |

## References

- [Wikipedia: Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Wikipedia: Cellular Automaton](https://en.wikipedia.org/wiki/Cellular_automaton)
- [LifeWiki: Pattern Catalog](https://conwaylife.com/wiki/Main_Page)
