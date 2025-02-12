<script setup lang="ts">
import { ref } from 'vue';
const { t } = useI18n();
import ChatTableComponent from '@/components/ChatTableComponent.vue'
import ChatInfoComponent from '@/components/ChatInfoComponent.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import GraphComponent from '@/components/GraphComponent.vue';
const msg = ref('Hello from DiscussionView.Check themessages');
import { onMounted } from "vue";
import { useMessagesStore } from '../store/MessageStore';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import type { Message } from '@/services/types';
import SideBarInfoComponent from "@/components/SideBarInfoComponent.vue"

const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);

onMounted(async () => {
  const { success, status } = await messagesStore.dispatchGetMessages();
  //add info of number
  msg.value = t("message.title");
  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  } else {
    messages.value = messagesStore.messages?.map((item: Message) => ({
      ...item
    }));
    console.log(messagesStore.messages);
  }
});
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
<!-- {{ messagesStore.messages }} -->
<v-row>
      <v-col>
      </v-col>
      </v-row>
    <v-row>
      <v-col cols="2">
      <SideBarInfoComponent :actions="false"/>
      </v-col>
      <v-col cols="10">
      <ChatTableComponent />
      </v-col>
      </v-row>
  </v-container>
</template>
