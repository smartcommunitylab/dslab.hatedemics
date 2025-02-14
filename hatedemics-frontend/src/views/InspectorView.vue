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

const msg = ref<string>(t("inspect.title"));

onMounted(async () => {
  const { success, status } = await topicsStore.dispatchGetTopics("id");
  if (!success) {
    console.error("API error, status:", status);
  }
});

const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
};

const updateChat = (chat: Chat) => {
  console.log("Chat selezionata:", chat);
};

const goToChats = () => {
  router.push({ name: "Discussion" });
};
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 font-weight-bold mb-4">{{ msg }}</h1>

    <v-row>
      <!-- Selezione Canali -->
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

      <!-- Selezione Chat -->
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

      <!-- Bottone Navigazione -->
      <v-col cols="4" class="d-flex align-center">
        <v-btn
          color="primary"
          variant="elevated"
          @click="goToChats"
        >
          {{ t("channelInfo.messages") }}
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col cols="2">
        <SideBarInfoComponent :actions="false" />
      </v-col>

      <v-col cols="6">
        <TopicsTableComponent />
      </v-col>

      <v-col cols="4">
        <WordCloudComponent />
      </v-col>
    </v-row>
  </v-container>
</template>
