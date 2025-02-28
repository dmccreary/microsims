function drawGraph() {
    // Fetch the graph data from the JSON file
    fetch('concept-graph.json')
        .then(response => response.json())
        .then(data => {
            // Extract nodes and edges from the JSON data
            const nodes = new vis.DataSet(data.nodes);
            const edges = new vis.DataSet(data.edges);

            // Create a network
            const container = document.getElementById('mynetwork');
            const graphData = {
                nodes: nodes,
                edges: edges
            };

            // Network options
            // Configuration options
  var options = {
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      stabilization: {
        iterations: 1000,
        updateInterval: 25
      },
    },
    layout: {
      improvedLayout: true, // Prevent node overlap
    },
    interaction: { 
      dragNodes: true // Allow dragging of nodes
    },
    edges: {
        arrows: {
          to: {
            enabled: true,
            type: 'arrow', // Options: 'arrow', 'bar', 'circle', 'triangle'
            scaleFactor: 1
          }
        },
        smooth: {
          type: 'continuous' // Smooth edges
        }
      },
    // Optional: Define how nodes behave when fixed
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        size: 14,
        color: 'black'
      },
      borderWidth: 2,
      borderWidthSelected: 4
    }
};

// Initialize the network
const network = new vis.Network(container, graphData, options);
        })
        .catch(error => {
            console.error("Error loading or parsing graph-data.json:", error);
        });
}

// Workaround: Lock x position while letting y position be free
network.on("beforeDrawing", function () {
    nodes.forEach(function (node) {
      if (node.fixed && node.fixed.x) {
        var currentPosition = network.getPosition(node.id);
        nodes.update({ id: node.id, x: node.x, y: currentPosition.y });
      }
    });
  });
