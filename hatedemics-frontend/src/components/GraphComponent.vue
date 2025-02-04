<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue';
import { Cosmograph } from '@cosmograph/cosmograph'
import { nodes, links, type Node, type Link } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { watch } from 'vue'
import { storeToRefs } from 'pinia';

const channelsStore = useChannelsStore();
const { selectedChannel } = storeToRefs(channelsStore)
let graph: Cosmograph<Node, Link>;

let config = {}
watch(selectedChannel, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
    if (newValue){
      //select node by id (from 0 to x)
      //I have long id from db and in data


      const node = nodes.filter(n => {
        return n.name == newValue.id
      })[0];
      if (node){
      graph.selectNode(node)
      // graph.selectNodeByIndex(i);
      graph.zoomToNode(node);}
    }
  })
const graphElement = useTemplateRef('graphElement')
const msg = ref('Hello from GraphComponent');
// Set the data
onMounted(() => {

  const config={
  backgroundColor: "#151515",
  nodeSize: 1,
  nodeColor: "#4B5BBF",
  nodeGreyoutOpacity: 0.1,
  linkWidth: 0.1,
  linkColor: "#5F74C2",
  linkArrows: false,
  linkGreyoutOpacity: 0.2,
  curvedLinks: true,
  renderHoveredNodeRing: true,
  hoveredNodeRingColor:'red',
  focusedNodeRingColor: 'yellow',

  disableSimulation:true,
  simulation: {
    linkDistance: 1,
    linkSpring: 2,
    repulsion: 0.2,
    gravity: 0.1,
    decay: 100000
  },
  onClick: (node, i, pos, event) => {
      if (node && i !== undefined) {
        // graph.selectNodeById(node.id);
        // graph.zoomToNodeById(node.id);
        graph.selectNode(node);
         graph.zoomToNode(node);
        channelsStore.selectChannel(channelsStore.channels.filter(c => {
          return c.id === node.name
        })[0])

      } else {
        graph.unselectNodes();
        channelsStore.unselectChannel();
      }
    }

};

graph = new Cosmograph(graphElement.value!, config);
graph.setData(nodes, links);
graph.setZoomLevel(0.9);
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
    <div ref="graphElement"></div>
  </v-container>
</template>
<style lang="css" scoped>
canvas {
  width: 50%;
  height: 50%;
}
</style>
