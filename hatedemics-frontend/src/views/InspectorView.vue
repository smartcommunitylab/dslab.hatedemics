<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import { useTopicsStore } from "@/store/TopicStore";
import { useChannelsStore } from "@/store/ChannelStore";
import { useChatsStore } from "@/store/ChatStore";
import ExploreGuideDialog from "@/components/ExploreGuideDialog.vue";

import WordCloudComponent from "@/components/WordCloudComponent.vue";
import TopicsTableComponent from "@/components/TopicsTableComponent.vue";
import SideBarInfoComponent from "@/components/SideBarInfoComponent.vue";
import { computed } from "vue";

import type { ChannelInfo } from "@/services/types";
import TutorialInspectorDialog from "@/components/TutorialInspectorDialog.vue";

const router = useRouter();
const { t } = useI18n();
const showExploreGuide = ref(false);
const showTutorialInspector = ref(false);

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
const showSidebar = ref(true);

// Mappa le chat con label "Chat 1", "Chat 2", ecc.
const chatOptions = computed(() =>
  chats.value.map((chat, index) => ({
    title: `Chat ${index + 1}`,
    value: chat.id,
  }))
);
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
      { label: search.value }
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
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              @click.stop="showExploreGuide = true"
              prepend-icon="mdi-book-open"
              class="me-2"
            >
              {{ t("home.guideTitle") }}
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              size="small"
              @click.stop="showTutorialInspector = true"
              prepend-icon="mdi-help"
              class="me-2"
            >
              {{ t("home.guide") }}
            </v-btn>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <h2 class="text-h6 font-weight-light">
            <span v-html="t('inspect.subtitle')" />
          </h2>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-container fluid class="pa-4" style="background-color: white;">
    <v-row>
      <v-col cols="4">
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
        <!-- <v-select
          :label="t('channelInfo.chats')"
          v-model="selectedChat"
          :items="chats"
          item-title="id"
          item-value="id"
          variant="outlined"
          density="comfortable"
          @update:model-value="updateChat"
        /> -->
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
  <!-- Colonna centrale -->
  <v-col :cols="showSidebar ? 5 : 6" class="transition-col">
    <TopicsTableComponent />
  </v-col>

  <!-- Colonna sinistra -->
  <v-col :cols="showSidebar ? 5 : 5">
    <WordCloudComponent />
  </v-col>

  <!-- Sidebar a destra -->
  <v-col :cols="showSidebar ? 2 : 1" class="transition-col d-flex flex-column ">
    <v-tooltip bottom>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="primary"
          class="mb-4"
          @click="showSidebar = !showSidebar"
          elevation="2"
          style="width: 48px; height: 48px; min-width: 0; padding: 0; border-radius: 50%;"
        >
          <v-icon>{{ showSidebar ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </template>
      <span>
        {{ showSidebar ? t("graphInteraction.collapseInfo") : t("graphInteraction.expandInfo") }}
      </span>
    </v-tooltip>

    <v-expand-x-transition>
      <SideBarInfoComponent v-show="showSidebar" :actions="false" class="expandable-content"/>
    </v-expand-x-transition>
  </v-col>
</v-row>
</v-container>
  </v-container>
  <ExploreGuideDialog v-model="showExploreGuide" />
  <TutorialInspectorDialog v-model="showTutorialInspector" />
</template>

<style scoped>
.expandable-content {
  overflow: hidden;
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>
