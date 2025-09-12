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
import GraphLegend from "@/components/GraphLegend.vue";

const { t } = useI18n();
const highlightedNodes = ref<Set<string>>(new Set());

const loading = ref(false);
const colorBy = ref('iri');          // colore = infodemic risk score
const sizeBy = ref('hs');   // dimensione = hate speech
let selectedNode: { id: string; iri?: number; followers?: number } | null = null;
const tooltip = ref<{ show: boolean; x: number; y: number; node: any | null }>({
  show: false,
  x: 0,
  y: 0,
  node: null,
});
const communityColors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
  "#5254a3", "#9c9ede", "#6b6ecf", "#bd9e39", "#e7ba52",
  "#ad494a", "#d6616b", "#ce6dbd", "#de9ed6", "#3182bd",
  "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c",
  "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b",
  "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb",
  "#636363", "#969696", "#bdbdbd", "#d9d9d9", "#bc80bd",
  "#ffed6f", "#1b9e77", "#d95f02", "#7570b3", "#e7298a"
];
const colorOptions = [
  { value: 'disabled', title: t('graphInteraction.color.disable') },
  { value: 'iri', title: t('graphInteraction.color.iri') },
  { value: 'hs', title: t('graphInteraction.color.hs') },
  { value: 'n_out_recommended', title: t('graphInteraction.color.out') },
  { value: 'n_in_recommendation', title: t('graphInteraction.color.in') },
  { value: 'louvain_community', title: t('graphInteraction.color.community') }

];

const sizeOptions = [
  { value: 'disabled', title: t('graphInteraction.size.disable') },
  { value: 'iri', title: t('graphInteraction.size.iri') },
  { value: 'hs', title: t('graphInteraction.size.hs') },
  { value: 'n_out_recommended', title: t('graphInteraction.size.out') },
  { value: 'n_in_recommendation', title: t('graphInteraction.size.in') }
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
const infoExpanded = ref(true);

const getColorByValue = (value: number | undefined, min: number, max: number) => {
  if (value === undefined || value === null || value === -1) return "";

  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const r = Math.floor(255 * normalized);
  const g = Math.floor(255 * (1 - normalized));
  return `rgb(${r}, ${g}, 0)`;
};

const getNodeColor = (node: any, colorBy: string) => {
  switch (colorBy) {
    case "iri":
      return getColorByValue(node.iri?node.iri:undefined,0,0.7);
    case "hs":
      return getColorByValue(node.hs?node.hs:undefined, 0, 0.3);
    case "n_out_recommended":
      return getColorByValue(node.n_out_recommended?node.n_out_recommended:undefined, 0, 300);
    case "n_in_recommendation":
      return getColorByValue(node.n_in_recommendation?node.n_in_recommendation:undefined, 0, 300);
      case "louvain_community": {
      const community = node.louvain_community ?? -1;
      if (community < 0) return "#ccc"; // colore di default se manca
      return communityColors[community % communityColors.length];
    }
    default:
      return "";
  }
};
const scaleNodeSize = (value: number|undefined, min: number, max: number, sizeMin: number, sizeMax: number) => {
  if (value === undefined || value === null) return 0; // Evita errori
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
      return scaleNodeSize(node.iri?node.iri:undefined, 0, 50, 10, 50); // hs tra 0 e 1 → grandezza tra 20 e 60
    case "hs":
      return scaleNodeSize(node.hs?node.hs*100:undefined, 0, 50, 10, 50); // hs tra 0 e 1 → grandezza tra 20 e 50
    case "n_out_recommended":
      return scaleNodeSize(node.n_out_recommended?node.n_out_recommended:undefined, 0, 300, 10, 50); // out_degree tra 0 e 10 → 5-20
    case "n_in_recommendation":
      return scaleNodeSize(node.n_in_recommendation?node.n_in_recommendation:undefined, 0, 300, 10, 50);
    default:
      return 0; // Default size
  }
};



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
  sizeBy.value = 'hs';
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

       <strong>${t('graphInteraction.tooltip.label') }</strong> ${nodeData?.label } <br />
      <strong>${ t('graphInteraction.tooltip.message_count') }</strong> ${nodeData?.message_count} <br />
      <strong>${ t('graphInteraction.tooltip.partecipants_count') }</strong> ${nodeData?.participants_count} <br />
      <strong>${ t('graphInteraction.tooltip.iri') }</strong> ${nodeData?.iri?.toFixed(3)} <br />
      <strong>${ t('graphInteraction.tooltip.cw') }</strong> ${ nodeData?.cw?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.hs') }</strong> ${ nodeData?.hs?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.in') }</strong> ${ nodeData?.n_in_recommendation?.toFixed(3) } <br />
      <strong>${ t('graphInteraction.tooltip.out') }</strong> ${ nodeData?.n_out_recommended?.toFixed(3) } <br />`;
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

  setTimeout(() => graphInstance.zoomToFit(1000,20), 500);

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
  sizeBy.value = "n_out_recommended";
  graphInstance.nodeColor((n: any) => getNodeColor(n, colorBy.value));
  graphInstance.linkWidth(() => 0.5);
  graphInstance.linkColor((link: any) => defaultLinkColors.get(link) || 'gray');

};




document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});
// Listener per aggiornare il full screen state
document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});


onMounted(async () => {
  loading.value = true; // Mostra il loader
  try {
    await initData();
    await nextTick(); // Attendi il prossimo aggiornamento del DOM
    initializeGraph();

    // 🔥 Se ho già un selectedChannelInfo quando torno
    if (selectedChannelInfo.value?.id) {
      const nodeToSelect = nodes.find(n => n.name === selectedChannelInfo?.value?.id);
      if (nodeToSelect) {
        selectNode(nodeToSelect);
        zoomToNode(nodeToSelect);
      }
    }
  } finally {
    loading.value = false; // Nasconde il loader dopo il caricamento
  }

  const erd = elementResizeDetectorMaker();
  if (!graphContainer.value) return;
  erd.listenTo(graphContainer.value, (el: any) => {
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



}
</script>

<template>
  <v-container fluid class="pa-0 d-flex">
    <!-- SIDEBAR -->
    <v-row>
      <v-col
        cols="12"
        md="2"
        :style="{
          flexBasis: optionsExpanded ? '250px' : '50px',
          flexGrow: 0,
          transition: 'flex-basis 0.3s',
        }"
        class="d-flex flex-column"
      >
        <v-card
          class="pa-4 d-flex flex-column fill-height"
          elevation="0"
          outlined
          style="border-radius: 8px; border-color: #90a4ae"
        >
          <!-- Pulsante espandi/collassa -->
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                class="mb-4"
                @click="optionsExpanded = !optionsExpanded"
                elevation="2"
                :style="'width: 48px; height: 48px; min-width: 0; padding: 0; border-radius: 50%;'"
              >
                <v-icon>{{
                  optionsExpanded ? "mdi-chevron-left" : "mdi-chevron-right"
                }}</v-icon>
              </v-btn>
            </template>
            <span>{{
              optionsExpanded
                ? t("graphInteraction.collapseLegend")
                : t("graphInteraction.expandLegend")
            }}</span>
          </v-tooltip>

          <!-- Transizione contenuto -->
          <v-expand-transition>
            <div v-show="optionsExpanded">
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
              <v-btn color="secondary" class="mb-2" block @click="resetGraphView">
                {{ t("graphInteraction.resetView") }}
              </v-btn>
              <GraphLegend :colorBy="colorBy" :sizeBy="sizeBy" />
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <v-col
    class="d-flex flex-column"
    style="flex-grow:1; min-width:0;"
  >        <!-- GRAFICO + LOADING -->
        <div class="flex-grow-1 position-relative">
          <v-overlay :model-value="loading" class="align-center justify-center">
            <v-progress-circular color="primary" size="64" indeterminate />
          </v-overlay>

          <div id="graph-container" ref="graphContainer" class="graph-box">
            <!-- Force-graph 2D mount here -->
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="2"
        :style="{
          flexBasis: infoExpanded ? '250px' : '50px',
          flexGrow: 0,
          transition: 'flex-basis 0.3s',
        }"
        class="d-flex flex-column"
      >
        <v-card
          class="pa-0 d-flex flex-column fill-height"
          elevation="0"
          outlined
          style="border-radius: 8px; border-color: #90a4ae"
        >
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                class="mb-4"
                @click="infoExpanded = !infoExpanded"
                elevation="2"
                :style="'width: 48px; height: 48px; min-width: 0; padding: 0; border-radius: 50%;'"
              >
                <v-icon>{{
                  infoExpanded ? "mdi-chevron-right" : "mdi-chevron-left"
                }}</v-icon>
              </v-btn>
            </template>
            <span>{{
              infoExpanded
                ? t("graphInteraction.collapseInfo")
                : t("graphInteraction.expandInfo")
            }}</span>
          </v-tooltip>

          <v-expand-transition>
            <div v-show="infoExpanded" class="flex-grow-1 pa-0">
              <ChannelInfoComponent />
            </div>
          </v-expand-transition>
        </v-card>
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
  width: 100%; /* Adatta il contenitore */
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
  height: 60vh;
  width: 100%;
  background-color: white;
  border: 2px solid #90a4ae; /* grigio azzurrato */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
