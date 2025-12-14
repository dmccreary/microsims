---
title: Neural Network Structure
description: An interactive MicroSim demonstrating neural network architecture and counting model parameters.
image: neural-network.png
quality_score: 90
social:
    cards: false
---

# Neural Network Structure

<iframe src="main.html" width="100%" height="480px" scrolling="no"></iframe>

Copy this line into your web page:
```html
<iframe src="https://dmccreary.github.io/microsims/sims/neural-network/main.html" width="100%" height="500px" scrolling="no"></iframe>
```

[Run the Neural Network MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

[Edit the Neural Network MicroSim Using the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/AS-mwQwuj)

## About This MicroSim

This interactive simulation demonstrates the structure of a fully connected (dense) neural network and helps you understand how to count the number of parameters in a model. Parameters include:

- **Weights**: The connections between neurons in adjacent layers
- **Biases**: One bias term for each neuron in hidden and output layers

### How to Use

1. **Layers Slider**: Adjust the number of layers in the network (2-7 layers including input and output)
2. **Neurons/Layer Slider**: Change the number of neurons per layer (2-10 neurons)
3. Watch the **Total Parameters** count update as you modify the network

### Parameter Calculation

For a fully connected network with uniform layer sizes:

- **Weights** = neurons × neurons × (layers - 1)
- **Biases** = neurons × (layers - 1)
- **Total Parameters** = weights + biases

For example, with 3 layers and 4 neurons per layer:

- Weights = 4 × 4 × 2 = 32
- Biases = 4 × 2 = 8
- Total = 40 parameters

!!! Note
    There are no weights or biases associated with the Input layer.  These nodes are only placed in
    the diagram to illustrate the concept of a input layer.

## Lesson Plan

### Learning Objectives

1. Understand the basic structure of a feedforward neural network
2. Identify the components: input layer, hidden layers, output layer
3. Calculate the number of parameters in a neural network
4. Explain the relationship between network size and parameter count

### Target Audience

- High school students (grades 10-12)
- College introductory AI/ML courses
- Self-learners exploring neural network fundamentals

### Prerequisites

- Basic algebra (multiplication, addition)
- Understanding of functions and inputs/outputs
- Familiarity with graphs and network diagrams

### Activities

1. **Exploration**: Start with the default settings and note the parameter count
2. **Prediction**: Before moving sliders, predict how parameter count will change
3. **Pattern Discovery**: Find the mathematical relationship between layers, neurons, and parameters
4. **Real-World Connection**: Discuss how modern networks like GPT have billions of parameters

### Discussion Questions

1. Why do larger networks have more parameters?
2. What are the trade-offs of having more parameters?
3. How does this simple model compare to real neural networks?

## References

1. [3Blue1Brown - Neural Networks](https://www.3blue1brown.com/topics/neural-networks) - Visual explanations of neural network concepts
2. [Neural Network Playground](https://playground.tensorflow.org/) - TensorFlow's interactive neural network visualization
3. [Deep Learning Book - Goodfellow et al.](https://www.deeplearningbook.org/) - Comprehensive deep learning textbook
