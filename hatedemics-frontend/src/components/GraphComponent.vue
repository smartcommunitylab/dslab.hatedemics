<template>
  <div ref="graphContainer" class="graph-container"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ForceGraph3D from "https://esm.sh/3d-force-graph";
import elementResizeDetectorMaker from "https://esm.sh/element-resize-detector";

const graphContainer = ref(null);

onMounted(() => {
  if (!graphContainer.value) return;

  // Creazione del grafo
  const N = 300;
  const gData = {
    nodes: [...Array(N).keys()].map(i => ({ id: i })),
    links: [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id - 1))
      }))
  };

  const Graph = new ForceGraph3D(graphContainer.value)
    .graphData(gData)
    .nodeLabel(node => {
      
      return `<strong>ID:</strong> ${node.id} <br />`
    })
    .height(graphContainer.value.offsetHeight)
    .width(graphContainer.value.offsetWidth);

  // Aggiunge il resize detector per ridimensionare automaticamente il grafo
  const erd = elementResizeDetectorMaker();
  erd.listenTo(graphContainer.value, el => {
    Graph.width(el.offsetWidth).height(el.offsetHeight);
  });
});
</script>

<style scoped>
.graph-container {
  width: 50vw;  /* Adatta il contenitore */
  height: 50vh; /* Imposta un'altezza adatta */
  border: 1px solid #ccc; /* Aiuta a visualizzare i confini */
  margin: auto;
}
</style>
