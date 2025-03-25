<script setup lang="ts">
import { ref } from 'vue';
import ChatTableComponent from '@/components/ChatTableComponent.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import GraphComponent from '@/components/GraphComponent.vue';
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
const msg = ref<string>(t("conversation.title"));
const chatStore = useChatsStore();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
const { selectedChat, chats } = storeToRefs(chatStore);
const search = ref('');
const loading = ref(false);
  let page = 0;
  const size = 10;
  let allLoaded = false;
const fetchChannels = async (reset = false) => {
  if (reset) {
    page = 0;
    allLoaded = false;
    channelsInfo.value = [];
  }
  if (allLoaded || loading.value) return;
  loading.value = true;
  try {
    const {success,total ,content } =  await channelsStore.dispatchGetChannels({page,size},search.value);
    if (!success) {
      console.error("API error, status:", total);
      return;
    }
    if (content)
      channelsInfo.value = content;
  } catch (error) {
    console.error('Error fetching channels:', error);
  } finally {
    loading.value = false;
  }
};
const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
};

const updateChat = (chatId: string) => {
  chatStore.selectChat(chatId);
  topicsStore.dispatchGetTopics(chatId);};
  const onSearch = (newSearch: string) => {
  search.value = newSearch;
  fetchChannels(true);
};

const loadMore = (event: { target: any; }) => {
  const target = event.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    fetchChannels();
  }
};
</script>

<template>
  <v-container fluid>
    <!-- <h1 class="text-h4 font-weight-bold mb-4">{{ msg }}</h1> -->
    <h1 class="text-h5 font-weight-bold text-primary ma-4">{{ msg }}</h1>

    <!-- Selettori di Canale e Chat -->
    <v-row>
      <v-col cols="4">
        <!-- <v-autocomplete
          return-object
          :label="t('channelInfo.channels')"
          v-model="selectedChannelInfo"
          :items="channelsInfo"
          item-title="id"
          item-value="id"
          variant="outlined"
          density="comfortable"
          @update:model-value="updateChannel"
        /> -->
        <v-autocomplete
          return-object
          :label="t('channelInfo.channels')"
          v-model="selectedChannelInfo"
          :items="channelsInfo"
          :loading="loading"
          item-title="id"
          item-value="id"
          variant="outlined"
          density="comfortable"
          :filter="() => true"
          @update:model-value="updateChannel"
          @update:search="onSearch"
          @scroll.passive="loadMore"
          clearable 
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


      <v-col cols="8">
        <ChatTableComponent />
      </v-col>
      <v-col cols="4">
        <SideBarInfoComponent :actions="false" />
      </v-col>
    </v-row>
  </v-container>
</template>

