<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue';
import { Cosmograph } from '@cosmograph/cosmograph'
import { initData, nodes, links, type Node, type Link } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { watch } from 'vue'
import { storeToRefs } from 'pinia';

const channelsStore = useChannelsStore();
const { selectedChannelInfo } = storeToRefs(channelsStore)
let graph: Cosmograph<Node, Link>;

let config = {}
watch(selectedChannelInfo, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
    if (newValue){
      //select node by id (from 0 to x)
      //I have long id from db and in data


      const node = nodes.filter(n => {
        return n.name == newValue.id
      })[0];
      if (node){
        graph.selectNode(node);
        graph.focusNode(node);
      // graph.selectNode(node)
      // // graph.selectNodeByIndex(i);
      // graph.zoomToNode(node);
      }
    }
  })
const graphElement = useTemplateRef('graphElement')
// const msg = ref('Hello from GraphComponent');
// Set the data
onMounted(async () => {
  await initData();
  const config={
  backgroundColor: "#ffffff",
  nodeSize: (n:Node) => n.size,
  nodeColor: (n:Node) => getColor(n.iri),
  nodeLabelColor: (n:Node) =>  getColor(n.iri),
  hoveredNodeLabelColor: (n:Node) =>  getColor(n.iri),
  nodeLabelAccessor:(n:Node) => n.id,
  nodeGreyoutOpacity: 0.1,
  initialZoomLevel:0.5,
  linkWidth: 1,
  linkColor: "#5F74C2",
  linkArrows: false,
  linkGreyoutOpacity: 0.9,
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
    decay: 100000,
    simulationFriction: 0.1,
  simulationLinkSpring: 0.5, 
  simulationLinkDistance: 2.0,
  },
 onClick: (node:Node, i?: number) => {
      if (node && i !== undefined) {
        // graph.selectNodeById(node.id);
        // graph.zoomToNodeById(node.id);
        graph.selectNode(node);
        graph.focusNode(node);
        //  graph.zoomToNode(node);
        channelsStore.selectChannelInfo(channelsStore.channelsInfo.filter(c => {
          return c.id === node.name
        })[0])

      } 
      else {
        graph.unselectNodes();
        channelsStore.unselectChannel();
      }
    }

};

graph = new Cosmograph(graphElement.value!, config);
graph.setData(nodes, links);
// graph.setZoomLevfitViewel(0.9);
graph.fitView()
// setTimeout(() => {
//     graph.pause();
// }, 5000);
// }

// // Create a Cosmograph instance with the target element
// const cosmograph = new Cosmograph(targetElement.value!, config)
// cosmograph.setData(nodes, links);

})

function getColor(iri: number) {
  if (iri < 0) {
    return '#8B5CBF'
  } else if (iri <= 0 && iri < 0.2) {
    return '#9FCE6D'
  } else if (iri <= 0.2 && iri <= 0.5) {
    return '#76D5D3'
  }
 else return '#C76466'
  
}
</script>

<template>
  <v-container>
    <!-- <h1>{{ msg }}</h1> -->
    <div ref="graphElement"></div>
  </v-container>
</template>
<style lang="css" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
