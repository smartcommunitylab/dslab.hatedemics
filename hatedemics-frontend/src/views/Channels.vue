<script setup lang="ts">
import { ref } from 'vue';
// import GraphComponent from '@/components/GraphComponent.vue';
const msg = ref('Hello from Channels');
import { onMounted } from "vue";
import { useChannelsStore } from "../store/channel/ChannelStore";

const channelsStore = useChannelsStore();

onMounted(async () => {
  const { success, status } = await channelsStore.dispatchGetChannels();

  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  }
});
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
    {{ channelsStore.channels }}
  </v-container>

</template>
