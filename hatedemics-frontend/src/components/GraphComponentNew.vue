<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import Graph from "graphology";
import { initData, nodes, links, type Node, type Link } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { watch } from 'vue'
import { storeToRefs } from 'pinia';
const channelsStore = useChannelsStore();
const { selectedChannelInfo,sort } = storeToRefs(channelsStore)
const graph = new Graph();
const sigmaContainer = ref<HTMLElement | null>(null);
const tooltip = ref<{ show: boolean; x: number; y: number; node: Node | null }>({
  show: false,
  x: 0,
  y: 0,
  node: null
});

let sigmaInstance: Sigma | null = null;

watch(sort, (newValue,oldValue) => {
  console.log('sort',newValue)
  // fillChart(newValue.key);
})

const resetGraph = () => {
  graph.clear(); // Rimuove tutti i nodi e gli archi
};
const fillChart = (order:any) => {
  resetGraph();
  // Funzione per determinare il colore in base al degree
  // const getColor = (node: Node) => {
  //   if (node.out_degree > 40) return "red";
  //   if (node.in_degree > 20) return "green";
  //   return "blue";
  // };
  const getColorFromIri = (iri: number) => {
  const scale = ["#0000ff", "#0044ff", "#0088ff", "#00ccff", "#00ffff", "#00ff88", "#00ff00", "#ffff00", "#ff8800", "#ff0000"];
  const index = Math.min(Math.floor(iri * (scale.length - 1)), scale.length - 1);
  return scale[index]; // Mappa iri su una scala di colori
};
  // Aggiunta dei nodi con colore e dimensioni
  const originalAttributes = new Map<string, { color: string; size: number }>();
  nodes.forEach(node => {
    if (!graph.hasNode(node.id)) {
      const key = sort.value.key as keyof Node;
      //TODO
      // const nodeSize = (node[key] as number) * 20 + 5;
      const nodeSize = (node.iri as number) * 4 + 10;
    const nodeColor = getColorFromIri(node.iri);   // Colore iniziale
    graph.addNode(node.id, {
      x: Math.random() * 10,
      y: Math.random() * 10,
      size: nodeSize, // Evitiamo nodi troppo piccoli
      label: node.id,
      color: nodeColor,
      ...node
    });
    originalAttributes.set(node.id, { color: nodeColor, size: nodeSize });
  }
  });

  // Aggiunta degli archi
  links.forEach(edge => {
    if (graph.hasNode(edge.source_id) && graph.hasNode(edge.target_id)) {
      if (!graph.hasEdge(edge.source_id, edge.target_id))
      graph.addEdge(edge.source_id, edge.target_id, { color: "gray", size: 1 });
    }
  });

  // Applichiamo il layout ForceAtlas2
  forceAtlas2.assign(graph, { iterations: 100, settings: { gravity: 1 } });
  const container = document.getElementById("sigma-container") as HTMLElement;
  // Creiamo la visualizzazione con Sigma.js
  sigmaInstance = new Sigma(graph, sigmaContainer.value as HTMLElement,{allowInvalidContainer: true});

  // Gestione tooltip al passaggio del mouse
  sigmaInstance.on("enterNode", ({ node }) => {
    const nodeData = graph.getNodeAttributes(node) as Node;
    tooltip.value = { show: true, x : event!.clientX, y: event!.clientY, node: nodeData };
  });
  let selectedNode: string | null = null;
  const selectNode= (node: string)=> {
  selectedNode = node;

  // Reset colori
  graph.forEachNode(n => {
    graph.setNodeAttribute(n, "color", "blue");
    graph.setNodeAttribute(n, "size", nodes?.find(x => x?.id === n)?.iri * 4 + 10 || 10);
  });

  graph.forEachEdge(edge => {
    graph.setEdgeAttribute(edge, "color", "gray");
  });

  // Evidenzia il nodo selezionato
  graph.setNodeAttribute(node, "color", "red");
  graph.setNodeAttribute(node, "size", 10);

  // Evidenzia i link collegati
  graph.forEachEdge(edge => {
    if (graph.source(edge) === node || graph.target(edge) === node) {
      graph.setEdgeAttribute(edge, "color", "orange");
      graph.setNodeAttribute(graph.source(edge), "color", "orange");
      graph.setNodeAttribute(graph.target(edge), "color", "orange");
    }
  });

  sigmaInstance?.refresh();
}
// Gestore dell'evento click sui nodi
sigmaInstance.on("clickNode", ({ node }) => {
  selectNode(node);
  
  let nodeAttributes = graph.getNodeAttributes(node);
  channelsStore.selectChannelInfo(channelsStore.channelsInfo.filter(c => {
          return c.id === nodeAttributes.name
        })[0])
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

// Reset colori e dimensioni usando gli attributi originali
graph.forEachNode(n => {
  const original = originalAttributes.get(n);
  if (original) {
    graph.setNodeAttribute(n, "color", original.color);
    graph.setNodeAttribute(n, "size", original.size);
  }
});

graph.forEachEdge(edge => {
  graph.setEdgeAttribute(edge, "color", "gray");
});
channelsStore.unselectChannel();
sigmaInstance?.refresh();
});
  sigmaInstance.on("leaveNode", () => {
    tooltip.value.show = false;
  });
}
onMounted(async () => {
  resetGraph(); // Pulisce il grafo prima di rigenerarlo

  await initData(); // Carichiamo i dati prima di visualizzare il grafo
  fillChart(sort)  
});

onUnmounted(() => {
  if (sigmaInstance) {
    sigmaInstance.kill();
    sigmaInstance = null; // Resetta l'istanza per evitare problemi
  }});
</script>
<template>
  <div ref="sigmaContainer" style="width: 100%; height: 600px; position: relative" :settings="{}"></div>
  <div
    v-if="tooltip.show"
    :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    class="tooltip"
  >
    <strong>ID:</strong> {{ tooltip.node?.id }} <br />
    <strong>IRI:</strong> {{ tooltip.node?.iri.toFixed(3) }} <br />
    <strong>Out Degree:</strong> {{ tooltip.node?.out_degree }} <br />
    <strong>In Degree:</strong> {{ tooltip.node?.in_degree }}
  </div>
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
