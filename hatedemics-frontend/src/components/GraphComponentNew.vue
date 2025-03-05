<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import ForceGraph3D from "3d-force-graph";
import { initData, nodes, links, type Node } from "@/services/data-gen";
import { useChannelsStore } from '@/store/ChannelStore';
import { storeToRefs } from 'pinia';
import type { NodeObject } from "three-forcegraph";
import elementResizeDetectorMaker from "https://esm.sh/element-resize-detector";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const channelsStore = useChannelsStore();
const { selectedChannelInfo, selectedLanguage } = storeToRefs(channelsStore);
const defaultLinkColors = new Map();
const graphContainer = ref<HTMLElement | null>(null);
const isFullScreen = ref(false);
let graphInstance: any = null;
const colorBy = ref("disabled");
const sizeBy = ref("disabled");
let selectedNode: string | null = null;
const tooltip = ref<{ show: boolean; x: number; y: number; node: any | null }>({
  show: false,
  x: 0,
  y: 0,
  node: null,
});
// const getColorByIRI = (iri: number) => {
//   if (iri < 0) return "#4F4F4F"; // Nero per valori negativi

// // Verde puro (#00FF00) → Rosso puro (#FF0000)
// const r = Math.round(255 * iri);       // Aumenta dal 0 al 255
// const g = Math.round(255 * (1 - iri)); // Diminuisce da 255 a 0
// const b = 0;
//   return `rgb(${r}, ${g}, ${b})`;
// };

const getColorByValue = (value: number, min: number, max: number) => {
  if (value === undefined || value === null || value === -1) return "gray";
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
      return "#FFFF99";
  }
};
const scaleNodeSize = (value: number, min: number, max: number, sizeMin: number, sizeMax: number) => {
  if (value === undefined || value === null) return sizeMin; // Evita errori
  const normalized = (value - min) / (max - min); // Normalizza tra 0 e 1
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
    case "hs":
      return scaleNodeSize(node.hs, 0, 1, 5, 15); // hs tra 0 e 1 → grandezza tra 5 e 15
    case "out_degree":
      return scaleNodeSize(node.out_degree, 0, 10, 5, 20); // out_degree tra 0 e 10 → 5-20
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
    graphInstance.refresh();  // Forza l'aggiornamento
  }
});

watch(colorBy, (newValue) => {
  if (graphInstance) {
    graphInstance.nodeColor((node: any) => getNodeColor(node, newValue));
    graphInstance.refresh();
  }
});

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
  graphInstance =  new ForceGraph3D(graphContainer.value)
  .graphData({ nodes, links })
  // .linkDirectionalArrowLength(3.5) // Aggiunge frecce
  // .linkDirectionalArrowRelPos(1)  // Posiziona le frecce alla fine
  .nodeLabel(node => {
      const nodeData = node as Node;
      return `<strong>ID:</strong> ${nodeData.id} <br />
              <strong>IRI:</strong> ${nodeData.iri} <br />
              <strong>HS:</strong> ${nodeData.hs?.toFixed(3)}`;
    })
    // .nodeAutoColorBy(colorBy.value)
    .nodeColor((node: any) => getNodeColor(node, colorBy.value))
    .nodeVal((node: any) => getNodeSize(node, sizeBy.value))
    .linkWidth(1)
    .linkColor(link => {
      defaultLinkColors.set(link, "gray");
      return "gray";
    })
    .onNodeClick(node => {
       zoomToNode(node);
        selectNode(node);

    }).onBackgroundClick(() => {
      selectedNode = null;
      colorBy.value = "disabled";
      sizeBy.value = "disabled";
      resetHighlighting();
    });
  //   setTimeout(() => {
  //   observeSceneContainer();
  //   resizeGraph();
  // }, 100);
};

const selectNode = (node: any) => {
  selectedNode = node.id;
  resetHighlighting();

  // Trova i nodi collegati
  const linkedNodes = new Set<string>();
  graphInstance.graphData().links.forEach((link: any) => {
    if (link.source.id === node.id) linkedNodes.add(link.target.id);
    if (link.target.id === node.id) linkedNodes.add(link.source.id);
  });

  // Imposta il colore dei nodi
  graphInstance.nodeColor(n => {
    if (n.id === node.id) return "#FF4500"; // Arancione scuro per il nodo selezionato
    if (linkedNodes.has(n.id)) return "#FFA500"; // Arancione chiaro per i nodi collegati
    return ""; // Colore predefinito
  });

  // Imposta il colore dei link
  graphInstance.linkColor(l => {
    if (l.source.id === node.id || l.target.id === node.id) return "orange"; // Link in arancione
    return defaultLinkColors.get(l);
  });

  // Seleziona il canale associato
  let channel = channelsStore.channelsInfo.find(c => c.id === node.name);
  channelsStore.selectChannelInfo(channel ? channel : node.name);
};

const resetHighlighting = () => {
  graphInstance.nodeColor(null);
  graphInstance.linkColor(link => defaultLinkColors.get(link) || "gray");
};

const toggleFullScreen = () => {
  if (!graphContainer.value) return;
  if (!document.fullscreenElement) {
    graphContainer.value.requestFullscreen();
    isFullScreen.value = true;
  } else {
    document.exitFullscreen();
    isFullScreen.value = false;
  }
};

document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});
// Listener per aggiornare il full screen state
document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});


onMounted(async () => {
  await initData();
  initializeGraph();
  const erd = elementResizeDetectorMaker();
  erd.listenTo(graphContainer.value, el => {
    graphInstance.width(el.offsetWidth).height(el.offsetHeight);
  });
});

onUnmounted(() => {
  if (graphInstance) {
    graphInstance = null; // Cancella l'istanza del grafo
  }
  if (graphContainer.value) {
    graphContainer.value.innerHTML = ''; // Pulisce il contenitore
  }
});


function zoomToNode(node: NodeObject) {
  if (!node) return;

  // Trova i nodi a 1-hop di distanza
  const linkedNodes = new Set<NodeObject>();
  graphInstance.graphData().links.forEach((link: any) => {
    if (link.source === node) linkedNodes.add(link.target);
    if (link.target === node) linkedNodes.add(link.source);
  });

  linkedNodes.add(node); // Includi anche il nodo centrale

  // Calcola il bounding box dei nodi da visualizzare
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  linkedNodes.forEach(n => {
    minX = Math.min(minX, n.x ?? 0);
    minY = Math.min(minY, n.y ?? 0);
    minZ = Math.min(minZ, n.z ?? 0);
    maxX = Math.max(maxX, n.x ?? 0);
    maxY = Math.max(maxY, n.y ?? 0);
    maxZ = Math.max(maxZ, n.z ?? 0);
  });

  // Calcola il centro del bounding box
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  // Calcola una distanza adeguata per far stare tutto in vista
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;
  const maxDimension = Math.max(width, height, depth);
  const distance = maxDimension * 2;  // Aggiusta il valore per migliore visibilità

  // Nuova posizione della telecamera
  const newPos = { x: centerX, y: centerY, z: centerZ + distance };

  // Muovi la camera con animazione fluida
  graphInstance.cameraPosition(
    newPos,  // Nuova posizione
    { x: centerX, y: centerY, z: centerZ }, // Punto di messa a fuoco
    2000  // Durata dell'animazione (2s)
  );
}
</script>

<template>
  <div class="graph-wrapper">
    <button class="fullscreen-btn" @click="toggleFullScreen">
      {{  t('graphInteraction.fs.go') }}
    </button>
    <select v-model="colorBy" class="color-selector">
      <option value="disabled">{{ t('graphInteraction.color.disable') }}</option>
      <option value="iri">{{ t('graphInteraction.color.iri') }}</option>
      <option value="hs">{{ t('graphInteraction.color.hs') }}</option>
      <option value="out_degree">{{ t('graphInteraction.color.out') }}</option>
      <option value="in_degree">{{ t('graphInteraction.color.in') }}</option>
    </select>
    <select v-model="sizeBy" class="size-selector">
      <option value="disabled">{{ t('graphInteraction.size.disable') }}</option>
      <option value="iri">{{ t('graphInteraction.size.iri') }}</option>
      <option value="hs">{{ t('graphInteraction.size.hs') }}</option>
      <option value="out_degree">{{ t('graphInteraction.size.out') }}</option>
      <option value="in_degree">{{ t('graphInteraction.size.in') }}</option>
    </select>
    <div ref="graphContainer" class="graph-container"></div>
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <strong>{{ t('graphInteraction.tooltip.id') }}</strong> {{ tooltip.node?.id }} <br />
      <strong>{{ t('graphInteraction.tooltip.iri') }}</strong> {{ tooltip.node?.iri }} <br />
      <strong>{{ t('graphInteraction.tooltip.hs') }}</strong> {{ parseFloat(tooltip.node?.hs)?.toFixed(3) }} <br />
    </div>
  </div>
</template>

<style scoped>
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
</style>
