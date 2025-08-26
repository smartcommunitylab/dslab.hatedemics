<script setup lang="ts">
import { computed, ref } from 'vue';
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
import ExploreGuideDialog from "@/components/ExploreGuideDialog.vue";

const topicsStore = useTopicsStore();
const { t } = useI18n();
const channelsStore = useChannelsStore();
const msg = ref<string>(t("conversation.title"));
const chatStore = useChatsStore();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
const { selectedChat, chats } = storeToRefs(chatStore);
const showExploreGuide = ref(false);
// Mappa le chat con label "Chat 1", "Chat 2", ecc.
const chatOptions = computed(() =>
  chats.value.map((chat, index) => ({
    title: `Chat ${index + 1}`,
    value: chat.id,
  }))
);
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
    const {success,total ,content } =  await channelsStore.dispatchGetChannels({page,size}, { label: search.value }
    );
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
    <v-expansion-panels variant="accordion" elevation="0" class="ma-4">
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="" collapse-icon="" v-slot="{ expanded }">
          <div class="d-flex align-center w-100">
            <!-- Titolo -->
            <h1 class="text-h5 font-weight-bold text-primary me-2">{{ msg }}</h1>

            <!-- Freccia manuale vicino al titolo -->
            <v-icon
              :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
              class="me-2 text-primary"
            />

            <v-spacer />

            <!-- Bottone help a destra -->
            <v-btn
              variant="outlined"
              color="error"
              size="small"
              class="rounded-circle"
              style="min-width: 36px; height: 36px; padding: 0"
              @click.stop="showExploreGuide = true"
            >
              <v-icon size="20">mdi-help</v-icon>
            </v-btn>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <h2 class="text-h6 font-weight-light">
            <span v-html="t('conversation.subtitle')" />
          </h2>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

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
          item-title="label"
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
  :items="chatOptions"
  item-title="title"
  item-value="value"
  variant="outlined"
  density="comfortable"
  @update:model-value="updateChat"
/>
      </v-col>
    </v-row>

    <v-divider class="my-4" />
   
    <!-- Layout con Sidebar e Tabella -->
    <v-row>


      <v-col cols="8" style="background-color: white">
        <div class="px-4 py-2">
          <h3 class="text-h6 mb-1 text-center">
          <v-icon left>mdi-chat</v-icon>   {{ t("message.title") }}
          </h3>
        </div>
        <ChatTableComponent />
      </v-col>
      <v-col cols="4">
        <SideBarInfoComponent :actions="false" />
      </v-col>
    </v-row>
  </v-container>
  <ExploreGuideDialog v-model="showExploreGuide" />

</template>

