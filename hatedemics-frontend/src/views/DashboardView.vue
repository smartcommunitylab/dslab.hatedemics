<script setup lang="ts">
import { ref } from 'vue';
// import GraphComponent from '@/components/GraphComponent.vue';
const msg = ref('Hello from DashboardView');
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
  </v-container>

</template>
