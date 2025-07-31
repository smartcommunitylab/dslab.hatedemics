<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { forceCollide } from "d3-force";
import ForceGraph from "force-graph";
import { initData, nodes, links, type Node } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { storeToRefs } from 'pinia';
import type { NodeObject } from "three-forcegraph";
import elementResizeDetectorMaker from "element-resize-detector";
import { useI18n } from "vue-i18n";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";

const { t } = useI18n();
const highlightedNodes = ref<Set<string>>(new Set());

const loading = ref(false);
const colorBy = ref('iri');          // colore = infodemic risk score
const sizeBy = ref('out_degree');   // dimensione = in recommendation
let selectedNode: { id: string; iri?: number; followers?: number } | null = null;
const tooltip = ref<{ show: boolean; x: number; y: number; node: any | null }>({
  show: false,
  x: 0,
  y: 0,
  node: null,
});
const colorOptions = [
  { value: 'disabled', title: t('graphInteraction.color.disable') },
  { value: 'iri', title: t('graphInteraction.color.iri') },
  { value: 'hs', title: t('graphInteraction.color.hs') },
  { value: 'out_degree', title: t('graphInteraction.color.out') },
  { value: 'in_degree', title: t('graphInteraction.color.in') }
];

const sizeOptions = [
  { value: 'disabled', title: t('graphInteraction.size.disable') },
  { value: 'iri', title: t('graphInteraction.size.iri') },
  { value: 'hs', title: t('graphInteraction.size.hs') },
  { value: 'out_degree', title: t('graphInteraction.size.out') },
  { value: 'in_degree', title: t('graphInteraction.size.in') }
];

function toggleFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) elem.requestFullscreen();
  else document.exitFullscreen();
}
const channelsStore = useChannelsStore();
const { selectedChannelInfo, selectedLanguage } = storeToRefs(channelsStore);
const defaultLinkColors = new Map();
const graphContainer = ref<HTMLElement | null>(null);
const isFullScreen = ref(false);
let graphInstance: any = null;
const optionsExpanded = ref(true);

// let selectedNode: string | null = null;
// const tooltip = ref<{ show: boolean; x: number; y: number; node: any | null }>({
//   show: false,
//   x: 0,
//   y: 0,
//   node: null,
// });
// const getColorByIRI = (iri: number) => {
//   if (iri < 0) return "#4F4F4F"; // Nero per valori negativi

// // Verde puro (#00FF00) → Rosso puro (#FF0000)
// const r = Math.round(255 * iri);       // Aumenta dal 0 al 255
// const g = Math.round(255 * (1 - iri)); // Diminuisce da 255 a 0
// const b = 0;
//   return `rgb(${r}, ${g}, ${b})`;
// };

const getColorByValue = (value: number, min: number, max: number) => {
  if (value === undefined || value === null || value === -1) return "";
  const normalized = (value - min) / (max - min); // Normalizza tra 0 e 1
  const r = Math.floor(255 * (1 - normalized)); // Più alto → più verde
  const g = Math.floor(255 * normalized);
  return `rgb(${r}, ${g}, 0)`;
};

const getNodeColor = (node: any, colorBy: string) => {
  switch (colorBy) {
    case "iri":
      return getColorByValue(node.iri,0,0.5);
    case "hs":
      return getColorByValue(node.hs, 0, 0.5); // Supponiamo che hs vada da 0 a 1
    case "out_degree":
      return getColorByValue(node.out_degree, 0, 100); // Esempio di range
    case "in_degree":
      return getColorByValue(node.in_degree, 0, 100);
    default:
      return "";
  }
};
const scaleNodeSize = (value: number, min: number, max: number, sizeMin: number, sizeMax: number) => {
  if (value === undefined || value === null) return sizeMin; // Evita errori
  // const normalized = (value - min) / (max - min); // Normalizza tra 0 e 1
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return sizeMin + normalized * (sizeMax - sizeMin);
};
  /**
   * Restituisce la grandezza del nodo in base al valore di "sizeBy".
   * Se "sizeBy" è "hs", la grandezza varia linearmente da 5 a 15 in base al valore di hs nel nodo.
   * Se "sizeBy" è "out_degree" o "in_degree", la grandezza varia linearmente da 5 a 20 in base al valore di out_degree o in_degree nel nodo.
   * In caso contrario, restituisce una grandezza predefinita di 8.
   * @param {Object} node - Il nodo da valutare
   * @param {string} sizeBy - Il campo da utilizzare per determinare la grandezza
   * @returns {number} La grandezza del nodo
   */
const getNodeSize = (node: any, sizeBy: string) => {
  switch (sizeBy) {
    case "iri":
      return scaleNodeSize(node.iri, 0, 1, 20, 100); // hs tra 0 e 1 → grandezza tra 20 e 60
    case "hs":
      return scaleNodeSize(node.hs, 0, 1, 20, 100); // hs tra 0 e 1 → grandezza tra 20 e 50
    case "out_degree":
      return scaleNodeSize(node.out_degree, 0, 50, 5, 100); // out_degree tra 0 e 10 → 5-20
    case "in_degree":
      return scaleNodeSize(node.in_degree, 0, 10, 5, 20);
    default:
      return 8; // Default size
  }
};

// watch(selectedLanguage, async (newValue,oldValue) => {
//   if (newValue === oldValue) return;

//   await initData();

// if (graphInstance) {
//   graphInstance = null; // Cancella l'istanza
//   if (graphContainer.value) graphContainer.value.innerHTML = ''; // Pulisce il container
// }

// initializeGraph();
// // resizeGraph();

// });

watch(sizeBy, (newValue) => {
  if (graphInstance) {
    graphInstance.nodeVal((node: any) => getNodeSize(node, newValue));
    // graphInstance.refresh();  // Forza l'aggiornamento
  }
});

watch(colorBy, (newValue) => {
  if (graphInstance) {
    graphInstance.nodeColor((node: any) => getNodeColor(node, newValue));
    // graphInstance.refresh();
  }
});
function resetGraphView() {
  if (!graphInstance) return;
  graphInstance.zoomToFit(1000); 
  colorBy.value = "iri";
  sizeBy.value = 'out_degree';
}
watch(selectedChannelInfo, (newValue, oldValue) => {
  if (newValue?.id === oldValue?.id) return;
  if (!newValue) {
    selectedNode = null;
    resetHighlighting();
    return;
  }
  const nodeToSelect = nodes.find(n => n.name === newValue.id);
  if (nodeToSelect) {
    selectNode(nodeToSelect);
  }
  graphInstance.graphData().nodes.forEach((n: any) => {
if (n.name === newValue.id) {
  zoomToNode(n);
}
  });
});


const initializeGraph = () => {
  if (!graphContainer.value || graphInstance) return;
  graphContainer.value.innerHTML = '';
  graphInstance =  new ForceGraph(graphContainer.value)
  .graphData({ nodes, links })
  // .linkDirectionalArrowLength(3.5) // Aggiunge frecce
  // .linkDirectionalArrowRelPos(1)  // Posiziona le frecce alla fine
  .nodeLabel(node => {
      const nodeData = node as Node;
      return `
       <strong>${t('graphInteraction.tooltip.id') }</strong> ${nodeData?.id } <br />
      <strong>${ t('graphInteraction.tooltip.iri') }</strong> ${nodeData?.iri?.toFixed(3)} <br />
      <strong>${ t('graphInteraction.tooltip.cw') }</strong> ${ nodeData?.cw?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.hs') }</strong> ${ nodeData?.hs?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.in') }</strong> ${ nodeData?.in_degree?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.out') }</strong> ${ nodeData?.out_degree?.toFixed(3) } <br />`;
    })
    // .nodeAutoColorBy(colorBy.value)
    .nodeColor((node: any) => getNodeColor(node, colorBy.value))
.nodeVal((node: any) => getNodeSize(node, sizeBy.value))
.nodeCanvasObjectMode(() => 'before')
.nodeCanvasObject((node, ctx, globalScale) => {
  const isSelected = node.id === selectedNode?.id;
  const isLinked = node.id && typeof node.id === 'string' && highlightedNodes.value.has(node.id);

  if (isSelected || isLinked) {
    // const size = getNodeSize(node, sizeBy.value);
    const sizeRaw = getNodeSize(node, sizeBy.value);
const size = Math.max(1, isNaN(sizeRaw) ? 1 : sizeRaw);
    ctx.save();
    
    // Pulsing animation
    const time = Date.now() / 1000;
    const pulseSize = Math.sin(time * 2) * 2 + 8; // Oscillates between 6 and 10
    
    // Draw outer highlight ring
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, size + pulseSize, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? 'rgba(211, 47, 47, 0.15)' : 'rgba(245, 124, 0, 0.15)';
    ctx.fill();
    
    // Draw inner highlight ring
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, size + 4, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? 'rgba(211, 47, 47, 0.3)' : 'rgba(245, 124, 0, 0.3)';
    ctx.fill();

    ctx.restore();
  }
})
.linkWidth(getLinkWidth)
.linkColor((link: any) => {
  defaultLinkColors.set(link, "gray");
  return "gray";
})
.d3Force('collide', forceCollide().radius((node: any) => getNodeSize(node, sizeBy.value)))
    .onNodeClick((node: NodeObject) => {
       zoomToNode(node);
        selectNode(node);

    })
    // .onBackgroundClick(() => {
    //   selectedNode = null;
    //   colorBy.value = "disabled";
    //   sizeBy.value = "disabled";
    //   resetHighlighting();
    // });
  //   setTimeout(() => {
  //   observeSceneContainer();
  //   resizeGraph();
  // }, 100);
  setTimeout(() => graphInstance.zoomToFit(1000), 500); // piccola attesa per assicurarsi che il layout sia stabile

};
function getLinkWidth(link: any): number {
  if (!selectedNode) return 0.1;
  const isRelated =
    link.source.id === selectedNode.id || link.target.id === selectedNode.id;
  return isRelated ? 3 : 0.1;
}
  const selectNode = (node: any) => {
  selectedNode = node;

  // Trova i nodi collegati
  const linkedNodes = new Set<string>();
  graphInstance.graphData().links.forEach((link: any) => {
    if (link.source.id === node.id) linkedNodes.add(link.target.id);
    if (link.target.id === node.id) linkedNodes.add(link.source.id);
  });

  highlightedNodes.value = linkedNodes;
  highlightedNodes.value.add(node.id); // includi anche il selezionato

  // Aggiorna il rendering
  graphInstance.nodeColor((n: any) => getNodeColor(n, colorBy.value));
  graphInstance.nodeVal((n: any) => getNodeSize(n, sizeBy.value));
  graphInstance.linkColor((link: any) => {
  const isRelated =
    link.source.id === node.id || link.target.id === node.id;
  return isRelated ? '#f57c00' : defaultLinkColors.get(link) || 'gray';
});
  // Seleziona il canale associato
  let channel = channelsStore.channelsInfo.find(c => c.id === node.name);
  channelsStore.selectChannelInfo(channel ? channel : node.name);
};


const resetHighlighting = () => {
  selectedNode = null;
  highlightedNodes.value.clear();
  colorBy.value = "iri";
  sizeBy.value = "out_degree";
  graphInstance.nodeColor((n: any) => getNodeColor(n, colorBy.value));
  graphInstance.linkWidth(() => 0.5);
  graphInstance.linkColor((link: any) => defaultLinkColors.get(link) || 'gray');

};


// const toggleFullScreen = () => {
//   if (!graphContainer.value) return;
//   if (!document.fullscreenElement) {
//     graphContainer.value.requestFullscreen();
//     isFullScreen.value = true;
//   } else {
//     document.exitFullscreen();
//     isFullScreen.value = false;
//   }
// };

document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});
// Listener per aggiornare il full screen state
document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});


onMounted(async () => {
  loading.value = true; // Mostra il loader
  try{
  await initData();
  await nextTick(); // Attendi il prossimo aggiornamento del DOM
  initializeGraph();
  } finally {
   loading.value = false; // Nasconde il loader dopo il caricamento
  }
  const erd = elementResizeDetectorMaker();
  if (!graphContainer.value) return;
  erd.listenTo(graphContainer.value, (el:any) => {
    graphInstance.width(el.offsetWidth).height(el.offsetHeight);
  });
});

  onUnmounted(() => {
  if (graphInstance) {
    graphInstance.graphData({ nodes: [], links: [] }); // Pulisce i dati
    graphInstance = null; // Rimuove l'istanza del grafo
  }
  if (graphContainer.value) {
    graphContainer.value.innerHTML = ''; // Pulisce il contenitore
  }
});


async function zoomToNode(node: NodeObject) {
  if (!node) return;

const targetZoom = 0.5; // puoi regolare il livello di zoom
const duration = 1000; // durata animazione in ms

graphInstance.centerAt(node.x ?? 0, node.y ?? 0, duration);
graphInstance.zoom(targetZoom, duration);
  // if (!node) return;

  // // Trova i nodi a 1-hop di distanza
  // const linkedNodes = new Set<NodeObject>();
  // graphInstance.graphData().links.forEach((link: any) => {
  //   if (link.source === node) linkedNodes.add(link.target);
  //   if (link.target === node) linkedNodes.add(link.source);
  // });

  // linkedNodes.add(node); // Includi anche il nodo centrale

  // // Calcola il bounding box dei nodi da visualizzare
  // let minX = Infinity, minY = Infinity, minZ = Infinity;
  // let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  // linkedNodes.forEach(n => {
  //   minX = Math.min(minX, n.x ?? 0);
  //   minY = Math.min(minY, n.y ?? 0);
  //   minZ = Math.min(minZ, n.z ?? 0);
  //   maxX = Math.max(maxX, n.x ?? 0);
  //   maxY = Math.max(maxY, n.y ?? 0);
  //   maxZ = Math.max(maxZ, n.z ?? 0);
  // });

  // // Calcola il centro del bounding box
  // const centerX = (minX + maxX) / 2;
  // const centerY = (minY + maxY) / 2;
  // const centerZ = (minZ + maxZ) / 2;

  // // Calcola una distanza adeguata per far stare tutto in vista
  // const width = maxX - minX;
  // const height = maxY - minY;
  // const depth = maxZ - minZ;
  // const maxDimension = Math.max(width, height, depth);
  // const distance = maxDimension * 2;  // Aggiusta il valore per migliore visibilità

  // // Nuova posizione della telecamera
  // const newPos = { x: centerX, y: centerY, z: centerZ + distance };

  // // // Muovi la camera con animazione fluida
  // // graphInstance.cameraPosition(
  // //   newPos,  // Nuova posizione
  // //   { x: centerX, y: centerY, z: centerZ }, // Punto di messa a fuoco
  // //   2000  // Durata dell'animazione (2s)
  // // );
  // await graphInstance.centerAt(centerX,centerY, 1000);
  // await graphInstance.zoom(1, 2000);

       
}

</script>

<template>
  <v-container fluid class="pa-0 d-flex">

    <!-- SIDEBAR -->
    <v-row>
      <v-col cols="12" md="3" class="d-flex flex-column">
  <v-card class="pa-4 d-flex flex-column fill-height flat">



    <!-- Sezione Opzioni (collassabile in verticale) -->
    <!-- <v-expand-transition> -->
  <div v-if="optionsExpanded" class="mb-4">
    <v-select
      v-model="colorBy"
      :items="colorOptions"
      :label="t('graphInteraction.color.label')"
      density="compact"
      variant="outlined"
      class="mb-2"
    />
    <v-select
      v-model="sizeBy"
      :items="sizeOptions"
      :label="t('graphInteraction.size.label')"
      density="compact"
      variant="outlined"
      class="mb-2"
    />
    <!-- <v-btn color="primary" class="mb-2" @click="toggleFullScreen">
      {{ t('graphInteraction.fs.go') }}
    </v-btn> -->
    <v-btn color="secondary" class="mb-2" @click="resetGraphView">
  {{ t('graphInteraction.resetView') }}
</v-btn>
  </div>
<!-- </v-expand-transition> -->
    <!-- Pulsante toggle -->
    <!-- <div class="d-flex justify-center">
  <v-btn
    icon
    @click="optionsExpanded = !optionsExpanded"
    class="mb-2"
    :title="optionsExpanded ? t('graphInteraction.hideOptions') : t('graphInteraction.showOptions')"
  >
    <v-icon size="24">
      {{ optionsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
    </v-icon>
  </v-btn>
</div> -->
    <!-- <v-divider class="my-2" /> -->

    <!-- Informazioni nodo -->
    <!-- <div class="flex-grow-1 overflow-auto">
      <h4 class="text-subtitle-1 mb-2">{{ t('graphInteraction.nodeDetails') }}</h4>
      <ChannelInfoComponent />
    </div> -->

  </v-card>
</v-col>

<v-col cols="12" md="6" class="d-flex flex-column">
    <!-- GRAFICO + LOADING -->
    <div class="flex-grow-1 position-relative">
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate />
      </v-overlay>

      <div id="graph-container"  ref="graphContainer"class="graph-box">
        <!-- Force-graph 2D mount here -->
      </div>
    </div>
    </v-col>
    <v-col cols="12" md="3" class="d-flex flex-column">
    <div class="flex-grow-1 position-relative">
      <ChannelInfoComponent />

    </div>
    </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8); /* Bianco semi-trasparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Assicura che sia sopra il grafo */
}
.graph-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
}

.graph-container {
  width: 100%;  /* Adatta il contenitore */
  height: 100%; /* Imposta un'altezza adatta */
  border: 1px solid #ccc; /* Aiuta a visualizzare i confini */
  margin: auto;
}

.fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  z-index: 10;
  border-radius: 5px;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
}
.color-selector {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 14px;
  z-index: 10;
}
.size-selector {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 14px;
  z-index: 10;
}
.graph-box {
  height: 50vh;
  width: 100%;
  background-color: white;
  border: 2px solid #90a4ae; /* grigio azzurrato */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
