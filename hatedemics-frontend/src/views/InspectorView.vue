<script setup lang="ts">
import { ref } from 'vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import GraphComponent from '@/components/GraphComponent.vue';
const msg = ref('Hello from InspectorView of channel');
const topic = ref('Topic and stat of single chat');
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
    <h1>{{ topic }}</h1>
  </v-container>

</template>
