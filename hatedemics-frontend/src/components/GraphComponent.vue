<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue';

import { Graph, type GraphConfigInterface } from "@cosmograph/cosmos";
import { nodes, links, type Node, type Link } from "@/services/data-gen";
// import { time } from 'console';

// const targetElement = useTemplateRef('targetElement')
const canvasElement = useTemplateRef('canvasElement')
const selectedNode = ref('');
// const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();

// Define the configuration (CosmographInputConfig<Node, Link>)

// const nodes = [
//   { id: '1', color: '#88C6FF' },
//   { id: '2', color: '#FF99D2' },
//   { id: '3', color: [227,17,108, 1] }, // Faster than providing a hex value
//   { id: '4', color: '#50E3C2' },
//   { id: '5', color: '#F5A623' },
//   { id: '6', color: '#7ED321' },
//   { id: '7', color: '#BD10E0' }
// ]

// const links = [
//   { source: '1', target: '2' },
//   { source: '1', target: '3' },
//   { source: '2', target: '3' },
//   { source: '3', target: '4' },
//   { source: '6', target: '7' },
//   { source: '5', target: '4' },
//   { source: '3', target: '6' },
//   { source: '7', target: '2' },
//   { source: '6', target: '2' }
// ]
// const pointPositions = new Float32Array([
//   0.0, 0.0,    // Point 1 at (0,0)
//   1.0, 0.0,    // Point 2 at (1,0)
//   0.5, 1.0,    // Point 3 at (0.5,1)
// ]);
// const links = new Float32Array([
//   0, 1,    // Link from point 0 to point 1
//   1, 2,    // Link from point 1 to point 2
//   2, 0,    // Link from point 2 to point 0
// ]);
// const config = {
//   simulationFriction: 0.1, // keeps the graph inert
//   simulationGravity: 0, // disables gravity
//   simulationRepulsion: 0.5, // increases repulsion between points
//   curvedLinks: true, // curved links
//   fitViewPadding: 0.3, // centers the graph width padding of ~30% of screen
//   onClick: pointIndex => { console.log('Clicked point index: ', pointIndex) },
//   /* ... */
// }

const msg = ref('Hello from GraphComponent');
// Set the data
onMounted(() => {
    let graph: Graph<Node, Link>;
const config: GraphConfigInterface<Node, Link> = {
  backgroundColor: "#151515",
  nodeSize: 4,
  nodeColor: "#4B5BBF",
  nodeGreyoutOpacity: 0.1,
  linkWidth: 0.1,
  linkColor: "#5F74C2",
  linkArrows: false,
  linkGreyoutOpacity: 0,
  curvedLinks: true,
  renderHoveredNodeRing: true,
  hoveredNodeRingColor: "#4B5BBF",
  simulation: {
    linkDistance: 1,
    linkSpring: 2,
    repulsion: 0.2,
    gravity: 0.1,
    decay: 100000
  },
  events: {
    onClick: (node, i, pos, event) => {
      if (node && i !== undefined) {
        graph.selectNodeByIndex(i);
        graph.zoomToNodeByIndex(i);
      } else {
        graph.unselectNodes();
      }
      console.log("Clicked node: ", node);
      selectedNode.value = node?.id||'';
    }
  }
};

graph = new Graph(canvasElement.value!, config);
graph.setData(nodes, links);
graph.zoom(0.9);
setTimeout(() => {
    graph.pause();
}, 5000);
// }

// // Create a Cosmograph instance with the target element
// const cosmograph = new Cosmograph(targetElement.value!, config)
// cosmograph.setData(nodes, links);

})
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
    <canvas ref="canvasElement"></canvas>
    <div >{{ selectedNode }}</div>
  </v-container>
</template>
<style lang="css" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
