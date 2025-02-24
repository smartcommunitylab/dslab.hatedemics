<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import Graph from "graphology";
import { initData, nodes, links, type Node } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { storeToRefs } from 'pinia';

const channelsStore = useChannelsStore();
const { selectedChannelInfo, sort } = storeToRefs(channelsStore);
const graph = new Graph();
const sigmaContainer = ref<HTMLElement | null>(null);
const tooltip = ref<{ show: boolean; x: number; y: number; node: Node | null }>({
  show: false,
  x: 0,
  y: 0,
  node: null
});

let sigmaInstance: Sigma | null = null;
const originalAttributes = new Map<string, { color: string; size: number }>();
let selectedNode: string | null = null;

const getColorFromIri = (iri: number) => {
  if (iri < 0) return "#4F4F4F"; // Nero per valori negativi

  // Verde puro (#00FF00) → Rosso puro (#FF0000)
  const r = Math.round(255 * iri);       // Aumenta dal 0 al 255
  const g = Math.round(255 * (1 - iri)); // Diminuisce da 255 a 0
  const b = 0;                           // Mantiene sempre zero (no blu)

  return `rgb(${r}, ${g}, ${b})`;
};


const resetGraph = () => {
  graph.clear();
};

const fillChart = () => {
  resetGraph();

  nodes.forEach(node => {
    if (!graph.hasNode(node.id)) {
      const nodeSize = (node.iri as number) * 4 + 10;
      const nodeColor = getColorFromIri(node.iri);
      graph.addNode(node.id, {
        x: Math.random() * 10,
        y: Math.random() * 10,
        size: nodeSize,
        label: node.id,
        color: nodeColor,
        borderColor:'#000000',
        borderWith:2,
        ...node
      });
      originalAttributes.set(node.id, { color: nodeColor, size: nodeSize });
    }
  });

  links.forEach(edge => {
    if (graph.hasNode(edge.source_id) && graph.hasNode(edge.target_id)) {
      if (!graph.hasEdge(edge.source_id, edge.target_id)){
      const sourceColor = graph.getNodeAttribute(edge.source_id, "color");
    const targetColor = graph.getNodeAttribute(edge.target_id, "color");
    const edgeColor = getEdgeColor(sourceColor, targetColor);
    graph.addEdge(edge.source_id, edge.target_id, { color: edgeColor, size: 1 });
      }
    }
  });

  forceAtlas2.assign(graph, { iterations: 100, settings: { gravity: 1 } });
  sigmaInstance = new Sigma(graph, sigmaContainer.value as HTMLElement, { allowInvalidContainer: true });
  // Gestione tooltip al passaggio del mouse
  sigmaInstance.on("enterNode", ({ node }) => {
    const nodeData = graph.getNodeAttributes(node) as Node;

    tooltip.value = { show: true, x : event!.clientX+2, y: event!.clientY+2, node: nodeData };
  });
  sigmaInstance.on("clickNode", ({ node }) => {
    selectNode(node);
    let nodeAttributes = graph.getNodeAttributes(node);
    let channel = channelsStore?.channelsInfo.find(c => c.id === nodeAttributes.name);
    channelsStore.selectChannelInfo(channel? channel : nodeAttributes.name);
  });
  watch(selectedChannelInfo, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
    if (newValue){
      //select node by id (from 0 to x)
      //I have long id from db and in data


      const node = nodes.filter(n => {
        return n.name == newValue.id
      })[0];
      if (node){
        selectNode(node.id);
        // graph.selectNode(node);
        // graph.focusNode(node);
      // graph.selectNode(node)
      // // graph.selectNodeByIndex(i);
      // graph.zoomToNode(node);
      }
    }
  })
  sigmaInstance.on("clickStage", () => {
    selectedNode = null;
    resetHighlighting();
    channelsStore.unselectChannel();
    sigmaInstance?.refresh();
  });
}
const getEdgeColor = (sourceColor: string, targetColor: string) => {
  const rgbSource = sourceColor.match(/\d+/g)?.map(Number) || [60, 60, 60];
  const rgbTarget = targetColor.match(/\d+/g)?.map(Number) || [60, 60, 60];

  const r = Math.round((rgbSource[0] + rgbTarget[0]) / 2);
  const g = Math.round((rgbSource[1] + rgbTarget[1]) / 2);
  const b = Math.round((rgbSource[2] + rgbTarget[2]) / 2);

  return `rgb(${r}, ${g}, ${b})`;
};
const selectNode = (node: string) => {
  if (nodes){
  selectedNode = node;
  resetHighlighting();
  graph.setNodeAttribute(node, "color", "#ff6600");
  const nodeData = nodes.find(n => n.id === node);
  graph.setNodeAttribute(node, "size", (nodeData ? nodeData.iri * 4 + 12 : 12));
  graph.forEachEdge(edge => {
    if (graph.source(edge) === node || graph.target(edge) === node) {
      graph.setEdgeAttribute(edge, "color", "orange");
      const targetNode = graph.source(edge) === node ? graph.target(edge) : graph.source(edge);
      graph.setNodeAttribute(targetNode, "color", "#ffa500");
    }
  });

  sigmaInstance?.refresh();
}
}
// const selectNode = (node: string) => {
//   selectedNode = node;
//   resetHighlighting();

//   // Nodo selezionato in giallo (#FFD700)
//   graph.setNodeAttribute(node, "color", "#FFD700");
//   graph.setNodeAttribute(node, "size", (nodes.find(n => n.id === node)?.iri * 4 + 12) || 12);

//   graph.forEachEdge(edge => {
//     if (graph.source(edge) === node || graph.target(edge) === node) {
//       graph.setEdgeAttribute(edge, "color", "#FFC700"); // Giallo più tenue per i link
//       const targetNode = graph.source(edge) === node ? graph.target(edge) : graph.source(edge);
//       graph.setNodeAttribute(targetNode, "color", "#FFD700");
//     }
//   });

//   sigmaInstance?.refresh();
// };

const resetHighlighting = () => {
  graph.forEachNode(n => {
    const original = originalAttributes.get(n);
    if (original) {
      graph.setNodeAttribute(n, "color", original.color);
      graph.setNodeAttribute(n, "size", original.size);
    }
  });

  graph.forEachEdge(edge => {
    const source = graph.getNodeAttribute(graph.source(edge), "color");
    const target = graph.getNodeAttribute(graph.target(edge), "color");
    const originalEdgeColor = getEdgeColor(source, target);
    graph.setEdgeAttribute(edge, "color", originalEdgeColor);
  });

  sigmaInstance?.refresh();
};

onMounted(async () => {
  resetGraph();
  await initData();
  fillChart();
});

onUnmounted(() => {
  if (sigmaInstance) {
    sigmaInstance.kill();
    sigmaInstance = null;
  }
});
</script>

<template>
  <div ref="sigmaContainer" style="width: 100%; height: 400px; position: relative"></div>
  <template     v-if="tooltip.show"
  >

  <div
    :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    class="tooltip"
  >
    <strong>ID:</strong> {{ tooltip.node?.id }} <br />
    <strong>IRI:</strong> {{ tooltip.node?.iri}} <br />
    <strong>HS:</strong> {{ tooltip.node?.hs?.toFixed(3) }} <br />
  </div>
  </template>
</template>

<style>
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  pointer-events: none;
}
</style>
