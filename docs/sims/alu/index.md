---
title: Arithmetic Logic Unit (ALU)
description: Interactive simulation demonstrating how an ALU performs arithmetic and logical operations on binary data.
quality_score: 95
image: /sims/alu/alu.png
og:image: /sims/alu/alu.png
twitter:image: /sims/alu/alu.png
social:
   cards: false
---
# Arithmetic Logic Unit (ALU)

<iframe src="main.html" width="100%" height="350px" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

Copy this iframe to embed on your website:

```html
<iframe src="https://dmccreary.github.io/microsims/sims/alu/main.html" width="100%" height="350px"></iframe>
```

## Description

This interactive MicroSim demonstrates how an Arithmetic Logic Unit (ALU) works, which is the fundamental computational component in all CPUs. The ALU performs both arithmetic operations (ADD, SUBTRACT) and logical bitwise operations (AND, OR, XOR) on two input registers.

**How to Use:**

1. Enter integer values in Register A and Register B input fields
2. Click an operation button (ADD, SUBTRACT, AND, OR, XOR) to see the result
3. Use the "Toggle Binary/Decimal" button to switch between decimal and binary output display

## Challenges

Real ALUs also keep track of several bits if information about the
result of the arithmetic such as if there were overflows.

!!! Challenges
    1. Add a bit to indicate the result is non-zero.
    2. Add a sign flag to indicate the number is non-negative
    3. Add a carry flag to indicate that the result fits in 16 bits
    4. Add an overflow flag to indicate that the sum of two numbers is also positive

## Lesson Plan

**Learning Objectives:**

- Understand the role of the ALU as the computational core of a CPU
- Perform arithmetic operations (addition, subtraction) on binary numbers
- Apply bitwise logical operations (AND, OR, XOR) and understand their uses
- Convert between decimal and binary number representations

**Target Audience:** High school and introductory college computer science students

**Prerequisites:**

- Understanding of binary number system
- Basic arithmetic operations
- Introduction to Boolean logic gates

**Activities:**

1. **Exploration (10 min):** Have students experiment with different input values and observe the results of each operation
2. **Binary Toggle (10 min):** Use the binary/decimal toggle to see how operations work at the bit level
3. **Predict and Verify (15 min):** Students predict the output before clicking, then verify their predictions
4. **Bitwise Operations (15 min):** Focus on AND, OR, XOR operations - discuss their applications in masking, flags, and data manipulation

**Assessment:**

- Calculate the result of 25 AND 17 by hand, then verify with the simulator
- Explain why XOR is useful for toggling specific bits
- Describe a real-world use case for each bitwise operation

## References

I love this small simulator from CircuitVerse:

[Four Bit ALU on CircuitVerse](https://circuitverse.org/simulator/51702) - This
shows the process of using an OpCode which is a number for an operation. The carry
bit does not work in this example.

A much better example is here:

[University of New Brunswick EE3221 Course](http://www.ee.unb.ca/cgi-bin/tervo/alu.pl)

That version is a binary only but it includes the following flags:

Flags
The Zero flag (Z) is 0 because the result is non-zero

The Sign flag (N) is 0 because the result appears non-negative (the MSB is 0)

The Carry flag (C) is 0 (good) because the addition result did not exceed 16-bits.
This would be of interest if (RA,RB) represent unsigned integers (0..65535).

The Overflow flag (V) is 0 (good) because adding two positive numbers gave a positive result.
This would be of interest if (RA,RB) represent signed integers (-32768..+32767).