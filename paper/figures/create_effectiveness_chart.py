#!/usr/bin/env python3
"""
Generate Learning Effectiveness Chart for MicroSims ArXiv Paper
Shows research evidence from PhET studies and meta-analyses
"""

import matplotlib.pyplot as plt
import numpy as np

# Set up the figure with high DPI for publication quality
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman', 'DejaVu Serif']
plt.rcParams['font.size'] = 11
plt.rcParams['axes.linewidth'] = 0.8

fig, ax = plt.subplots(figsize=(10, 6), dpi=300)

# Data from Section 9 (Expected Benefits)
categories = ['Conceptual\nUnderstanding\nGains',
              'Mastery Time\nReduction',
              'Student\nEngagement\nIncrease']

traditional = [0, 0, 0]  # Baseline
with_simulations = [20, -35, 30]  # Mid-points of ranges: 15-25%, 30-40%, 25-35%
error_ranges = [5, 5, 5]  # Error bars showing the ranges

# Position of bars
x_pos = np.arange(len(categories))
bar_width = 0.35

# Create bars
bars1 = ax.bar(x_pos - bar_width/2, traditional, bar_width,
               label='Traditional Instruction',
               color='#B0BEC5', edgecolor='black', linewidth=0.8)

bars2 = ax.bar(x_pos + bar_width/2, with_simulations, bar_width,
               label='With Interactive Simulations',
               color='#4CAF50', edgecolor='black', linewidth=0.8,
               yerr=error_ranges, capsize=5, error_kw={'linewidth': 1.5})

# Customize the plot
ax.set_ylabel('Percent Change from Baseline (%)', fontsize=12, fontweight='bold')
ax.set_xlabel('Learning Outcome Measures', fontsize=12, fontweight='bold')
ax.set_title('Learning Effectiveness of Interactive Simulations\nCompared to Traditional Instruction',
             fontsize=14, fontweight='bold', pad=20)
ax.set_xticks(x_pos)
ax.set_xticklabels(categories, fontsize=11)

# Add grid for readability
ax.yaxis.grid(True, linestyle='--', alpha=0.3, linewidth=0.8)
ax.set_axisbelow(True)

# Set y-axis limits and ticks
ax.set_ylim(-45, 40)
ax.axhline(y=0, color='black', linestyle='-', linewidth=1.2)

# Add value labels on bars
for i, (bar, value, error) in enumerate(zip(bars2, with_simulations, error_ranges)):
    height = bar.get_height()
    if value > 0:
        # Positive values: show range
        label_text = f'+{value-error}% to +{value+error}%'
        y_offset = 3
    else:
        # Negative values: show range
        label_text = f'-{abs(value)-error}% to -{abs(value)+error}%'
        y_offset = -8

    ax.text(bar.get_x() + bar.get_width()/2, height + y_offset,
            label_text, ha='center', va='bottom' if value > 0 else 'top',
            fontsize=9, fontweight='bold', color='#1B5E20')

# Legend
legend = ax.legend(loc='upper left', frameon=True, shadow=True,
                   fontsize=11, edgecolor='black', fancybox=False)
legend.get_frame().set_linewidth(0.8)

# Add data source annotation
fig.text(0.5, 0.02,
         'Data sources: PhET Interactive Simulations studies (Wieman et al., 2008; Adams et al., 2008),\n' +
         'Meta-analyses (D\'Angelo et al., 2014; Rutten et al., 2012; Smetana & Bell, 2012)',
         ha='center', fontsize=9, style='italic', color='#424242')

# Adjust layout to prevent label cutoff
plt.tight_layout(rect=[0, 0.06, 1, 1])

# Save the figure in multiple formats
output_path_pdf = '/Users/dan/Documents/ws/microsims/paper/figures/effectiveness-chart.pdf'
output_path_png = '/Users/dan/Documents/ws/microsims/paper/figures/effectiveness-chart.png'

plt.savefig(output_path_pdf, format='pdf', bbox_inches='tight', dpi=300)
plt.savefig(output_path_png, format='png', bbox_inches='tight', dpi=300)

print(f"✓ Figure saved as PDF: {output_path_pdf}")
print(f"✓ Figure saved as PNG: {output_path_png}")
print(f"✓ Resolution: 300 DPI")
print(f"✓ Size: 10×6 inches (suitable for publication)")

# Optionally display the plot (comment out if running headless)
# plt.show()

plt.close()
