<script setup lang="ts">
import { ref } from 'vue';

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import GraphComponent from '@/components/GraphComponent.vue';
const msg = ref('Hello from DiscussionView.Check themessages');
import { onMounted } from "vue";
import { useMessagesStore } from '../store/MessageStore';

const messagesStore = useMessagesStore();

onMounted(async () => {
  const { success, status } = await messagesStore.dispatchGetMessages();

  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  }
});
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
{{ messagesStore.messages }}
  </v-container>

</template>
