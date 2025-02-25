<script setup lang="ts">
import { ref } from 'vue';
import ChatTableComponent from '@/components/ChatTableComponent.vue'
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
import type { ChannelInfo, Chat } from "@/services/types";
import { useChannelsStore } from "@/store/ChannelStore";
import { useChatsStore } from "@/store/ChatStore";
import { useTopicsStore } from '@/store/TopicStore';
const topicsStore = useTopicsStore();
const { t } = useI18n();
const channelsStore = useChannelsStore();
const chatStore = useChatsStore();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
const { selectedChat, chats } = storeToRefs(chatStore);
// onMounted(async () => {
//   const { success, status } = await messagesStore.dispatchGetMessages();
//   //add info of number
//   msg.value = t("message.title");
//   if (!success) {
//     alert("Ups, something happened 🙂");
//     console.log("Api status ->", status);
//   } else {
//     messages.value = messagesStore.messages?.map((item: Message) => ({
//       ...item
//     }));
//     console.log(messagesStore.messages);
//   }
// });

const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
};

const updateChat = (chatId: string) => {
  chatStore.selectChat(chatId);
  topicsStore.dispatchGetTopics(chatId);};
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 font-weight-bold mb-4">{{ msg }}</h1>

    <!-- Selettori di Canale e Chat -->
    <v-row>
      <v-col cols="4">
        <v-autocomplete
          return-object
          :label="t('channelInfo.channels')"
          v-model="selectedChannelInfo"
          :items="channelsInfo"
          item-title="id"
          item-value="id"
          variant="outlined"
          density="comfortable"
          @update:model-value="updateChannel"
        />
      </v-col>

      <v-col cols="4">
        <v-select
          :label="t('channelInfo.chats')"
          v-model="selectedChat"
          :items="chats"
          item-title="id"
          item-value="id"
          variant="outlined"
          density="comfortable"
          @update:model-value="updateChat"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <!-- Layout con Sidebar e Tabella -->
    <v-row>
      <v-col cols="3">
        <SideBarInfoComponent :actions="false" />
      </v-col>

      <v-col cols="9">
        <ChatTableComponent />
      </v-col>
    </v-row>
  </v-container>
</template>

