<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import { useTopicsStore } from "@/store/TopicStore";
import { useChannelsStore } from "@/store/ChannelStore";
import { useChatsStore } from "@/store/ChatStore";

import WordCloudComponent from "@/components/WordCloudComponent.vue";
import TopicsTableComponent from "@/components/TopicsTableComponent.vue";
import SideBarInfoComponent from "@/components/SideBarInfoComponent.vue";

import type { ChannelInfo, Chat } from "@/services/types";

const router = useRouter();
const { t } = useI18n();

const channelsStore = useChannelsStore();
const chatStore = useChatsStore();
const topicsStore = useTopicsStore();

const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
const { selectedChat, chats } = storeToRefs(chatStore);
const { topics } = storeToRefs(topicsStore);
const search = ref("");
const loading = ref(false);
const msg = ref<string>(t("inspect.title"));
let page = 0;
const size = 10;
let allLoaded = false;

// onMounted(async () => {
//   const { success, status } =   await topicsStore.dispatchGetTopics(selectedChannelInfo?.value?.id!);
//   if (!success) {
//     console.error("API error, status:", status);
//   }
// });
const fetchChannels = async (reset = false) => {
  if (reset) {
    page = 0;
    allLoaded = false;
    channelsInfo.value = [];
  }
  if (allLoaded || loading.value) return;
  loading.value = true;
  try {
    const { success, total, content } = await channelsStore.dispatchGetChannels(
      { page, size },
      search.value
    );
    if (!success) {
      console.error("API error, status:", total);
      return;
    }
    if (content) channelsInfo.value = content;
  } catch (error) {
    console.error("Error fetching channels:", error);
  } finally {
    loading.value = false;
  }
};
const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
  // chatStore.initChats([{id:channel.id},{id:channel.linked_chats_ids}])
};

const updateChat = (chatId: string) => {
  chatStore.selectChat(chatId);
  topicsStore.dispatchGetTopics(chatId);
  console.log("Chat selezionata:", chatId);
};

const goToChats = () => {
  router.push({ name: "Discussion" });
};
const onSearch = (newSearch: string) => {
  search.value = newSearch;
  fetchChannels(true);
};

const loadMore = (event: { target: any }) => {
  const target = event.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    fetchChannels();
  }
};
</script>

<template>
  <v-container fluid>
    <h1 class="text-h5 font-weight-bold text-primary ma-4">{{ msg }}</h1>
    <h2 class="text-h6 font-weight-medium ma-4">
      {{ t("channel.subtitle") }}
    </h2>
    <v-row>
      <v-col cols="4">
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

      <v-col cols="4" class="d-flex justify-center">
        <v-btn
          color="primary"
          variant="elevated"
          block
          class="pa-8 font-weight-bold text-h5"
          @click="goToChats"
          prepend-icon="mdi-forum"
        >
          {{ t("channelInfo.messages") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <!-- Colonna Centrale: Tabella -->
      <v-col cols="5">
        <TopicsTableComponent />
      </v-col>

      <!-- Colonna sin: Selettori sopra, WordCloud sotto -->
      <v-col cols="3">
        <v-row>
          <v-col cols="12" class="mt-4">
            <WordCloudComponent />
          </v-col>
        </v-row>
      </v-col>
      <!-- Colonna dx: Sidebar con più spazio -->
      <v-col cols="4">
        <SideBarInfoComponent :actions="false" />
      </v-col>
    </v-row>
  </v-container>
</template>
