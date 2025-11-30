// p5.js Animation Loop Diagram - Tooltip functionality

// Tooltip content for each node
const tooltips = {
    'Start': 'The browser loads your p5.js sketch and begins execution.',
    'Setup': 'Runs exactly ONCE at program start. Use for createCanvas(), initializing variables, and one-time configuration.',
    'Draw': 'Runs REPEATEDLY in a continuous loop (default 60 times/second). This is where all your animation and drawing code goes.',
    'Wait': 'The browser waits ~16.7ms (at 60fps) before the next frame to maintain consistent timing.',
    'FrameCount': 'The built-in frameCount variable increments by 1 each time draw() completes. Useful for timing animations.'
};

// Initialize tooltips after Mermaid renders
function initTooltips() {
    const tooltip = document.getElementById('tooltip');
    const nodes = document.querySelectorAll('.node');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const nodeText = node.querySelector('span, tspan, text')?.textContent || '';

            // Find matching tooltip
            let tooltipText = '';
            for (const [key, value] of Object.entries(tooltips)) {
                if (nodeText.toLowerCase().includes(key.toLowerCase())) {
                    tooltipText = value;
                    break;
                }
            }

            if (tooltipText) {
                tooltip.textContent = tooltipText;
                tooltip.classList.add('visible');

                // Position tooltip to the right of the node
                const rect = node.getBoundingClientRect();
                tooltip.style.left = (rect.right + 15) + 'px';
                tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
            }
        });

        node.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// Wait for Mermaid to render before initializing tooltips
setTimeout(initTooltips, 500);
