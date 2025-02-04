<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue';

import { Graph, type GraphConfigInterface } from "@cosmograph/cosmos";
import { nodes, links, type Node, type Link } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { watch } from 'vue'
import { storeToRefs } from 'pinia';

// import { time } from 'console';
const channelsStore = useChannelsStore();
const { selectedChannel } = storeToRefs(channelsStore)
let graph: Graph<Node, Link>;
let config: GraphConfigInterface<Node, Link>
watch(selectedChannel, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
    if (newValue){
      //select node by id (from 0 to x)
      //I have long id from db and in data
      const id = nodes.filter(n => n.name == newValue.id)[0]?.id;
      graph.selectNodeById(id)
      // graph.selectNodeByIndex(i);
      graph.zoomToNodeById(id);
    }
  })
// const targetElement = useTemplateRef('targetElement')
const canvasElement = useTemplateRef('canvasElement')
// const selectedNode = ref('');
const msg = ref('Hello from GraphComponent');
// Set the data
onMounted(() => {
  
  const config={
  backgroundColor: "#151515",
  nodeSize: 2,
  nodeColor: "#4B5BBF",
  nodeGreyoutOpacity: 0.1,
  linkWidth: 0.1,
  linkColor: "#5F74C2",
  linkArrows: false,
  linkGreyoutOpacity: 0.2,
  curvedLinks: true,
  renderHoveredNodeRing: true,
  hoveredNodeRingColor: "#4B5BBF",
  disableSimulation:true,
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
        // graph.selectNodeById(node.id);
        // graph.zoomToNodeById(node.id);
        graph.selectNodeByIndex(i);
        graph.zoomToNodeByIndex(i);
        // channelsStore.selectChannel(channelsStore.channels[Math.floor(Math.random() * channelsStore.channels.length)])
        channelsStore.selectChannel(channelsStore.channels.filter(c => {
          // console.log(c);
          return c.id === node.name})[0])

      } else {
        graph.unselectNodes();
        channelsStore.unselectChannel();
      }
      console.log("Clicked node: ", node);
      // selectedNode.value = node?.id||'';
      //TODO use real selection and not random
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
    <!-- <div >{{ selectedNode }}</div> -->
  </v-container>
</template>
<style lang="css" scoped>
canvas {
  width: 50%;
  height: 50%;
}
</style>
