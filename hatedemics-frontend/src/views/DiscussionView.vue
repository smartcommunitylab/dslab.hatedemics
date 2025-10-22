<script setup lang="ts">
import { computed, ref } from "vue";
import ChatTableComponent from "@/components/ChatTableComponent.vue";

import { useMessagesStore } from "../store/MessageStore";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import SideBarInfoComponent from "@/components/SideBarInfoComponent.vue";
import type { ChannelInfo } from "@/services/types";
import { useChannelsStore } from "@/store/ChannelStore";
import { useChatsStore } from "@/store/ChatStore";
import { useTopicsStore } from "@/store/TopicStore";
import ExploreGuideDialog from "@/components/ExploreGuideDialog.vue";
import { isEmptyOrSpaces } from "@/services/utility";
import dialogApi from "@/services/dialog/dialogApi";
import router from "@/router";
import { useGlobal } from "@/store";
import TutorialDiscussionDialog from "@/components/TutorialDiscussionDialog.vue";
import { useLocale } from "vuetify";
const channelStore = useChannelsStore();
const globalStore = useGlobal();
useLocale();
const { locale: currentI18nLocale } = useI18n();
const showSnackbar = (message: string) => globalStore.setMessage(message);
const { selectedChannelInfo, channelsInfo } = storeToRefs(channelStore);

const topicsStore = useTopicsStore();
const { t } = useI18n();
const channelsStore = useChannelsStore();
const msg = ref<string>(t("conversation.title"));
const chatStore = useChatsStore();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const { selectedChat, chats } = storeToRefs(chatStore);
const showExploreGuide = ref(false);
const showTopicsDialog = ref(false);
const showTutorialDiscussion = ref(false);
const showSidebar = ref(true);

const targetOptions = computed(() => [
  { title: t("message.filter.DISABLED"), value: "DISABLED" },
  { title: t("message.filter.JEWS"), value: "JEWS" },
  { title: t("message.filter.LGBTQIA+"), value: "LGBT+" },
  { title: t("message.filter.MIGRANTS"), value: "MIGRANTS" },
  { title: t("message.filter.MUSLIMS"), value: "MUSLIMS" },
  { title: t("message.filter.POC"), value: "POC" },
  { title: t("message.filter.WOMEN"), value: "WOMEN" },
]);
// lista targets della chat corrente

const startDialogue = async (target: string | null) => {
  if (!target || target === "OTHER") return;

  // Prendi la lingua della piattaforma da vue-i18n
  const lang = currentI18nLocale.value.toUpperCase(); // IT, EN, PL, ES, MT

  // Mappa dei target tradotti
  const targetTranslations: Record<string, Record<string, string>> = {
    IT: {
      DISABLED: "Persone con disabilità",
      POC: "Persone nere",
      MIGRANTS: "Migranti",
      WOMEN: "Donne",
      "LGBT+": "LGBTQIA+",
      JEWS: "Ebrei",
      MUSLIMS: "Musulmani",
    },
    PL: {
      DISABLED: "Osoby z niepełnosprawnościami",
      POC: "Czarnoskórzy",
      MIGRANTS: "Migranci",
      WOMEN: "Kobiety",
      "LGBT+": "LGBTQIA+",
      JEWS: "Żydzi",
      MUSLIMS: "Muzułmanie",
    },
    ES: {
      DISABLED: "Personas con discapacidad",
      POC: "Personas negras",
      MIGRANTS: "Migrantes",
      WOMEN: "Mujeres",
      "LGBT+": "LGBTQIA+",
      JEWS: "Hebreos",
      MUSLIMS: "Musulmanes",
    },
    MT: {
      DISABLED: "Individwi b'diżabilità",
      POC: "Nies suwed",
      MIGRANTS: "Migranti",
      WOMEN: "Nisa",
      "LGBT+": "LGBTIQ+",
      JEWS: "Lhud",
      MUSLIMS: "Musulmani",
    },
    EN: {
      DISABLED: "People with disabilities",
      POC: "Black people",
      MIGRANTS: "Migrants",
      WOMEN: "Women",
      "LGBT+": "LGBTQIA+",
      JEWS: "Jews",
      MUSLIMS: "Muslims",
    },
  };

  const translatedTarget = targetTranslations[lang]?.[target];

  if (!translatedTarget) {
    showSnackbar(t("message.dialog.noProject"));
    showTopicsDialog.value = false;
    return;
  }

  try {
    const projects = await dialogApi.getProjects();
    const matchedProjects = projects.data.filter((p: any) => p.name === translatedTarget);

    // Se c'è un solo match, lo prendiamo direttamente
    let project: any;

// Se c'è un solo match, lo prendiamo direttamente
if (matchedProjects.length === 1) {
  project = matchedProjects[0];
} else {
  // Ordine delle lingue: se la lingua corrente è presente nell'array, scegli quella
  const langPriority: Record<string, number> = {
    PL: 0,
    IT: 1,
    ES: 2,
    EN: 3,
  };

  // Se la lingua corrente esiste in langPriority e abbiamo un progetto corrispondente
  const idx = langPriority[lang as keyof typeof langPriority];
  if (idx !== undefined && matchedProjects[idx]) {
    project = matchedProjects[idx];
  } else {
    // fallback: prendiamo il primo match
    project = matchedProjects[0];
  }
}


    if (project) {
      router.push({ name: "tasks", params: { projectID: project.id } });
    } else {
      showSnackbar(t("message.dialog.noProject"));
    }
  } catch (error) {
    showSnackbar(t("message.dialog.error"));
  }

  showTopicsDialog.value = false;
};

// Mappa le chat con label "Chat 1", "Chat 2", ecc.
const chatOptions = computed(() =>
  chats.value.map((chat, index) => ({
    title: `Chat ${index + 1}`,
    value: chat.id,
  }))
);
const search = ref("");
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
};

const updateChat = (chatId: string) => {
  chatStore.selectChat(chatId);
  topicsStore.dispatchGetTopics(chatId);
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
            <h1 class="text-h5 font-weight-bold  me-2">{{ msg }}</h1>
            <span class="ms-5">      {{ expanded ? t("common.showLess") : t("common.showMore") }}</span>

            <!-- Freccia manuale vicino al titolo -->
            <v-icon
              :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
              class="me-2 "
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
              @click.stop="showTutorialDiscussion = true"
              prepend-icon="mdi-help"
              class="me-2"
            >
              {{ t("home.guide") }}
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

    <v-container fluid class="pa-4" style="background-color: white">
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
      <!-- Layout con Sidebar e Tabella -->
      <v-row>
        <!-- Colonna Tabella -->
        <v-col :cols="showSidebar ? 10 : 11" style="background-color: white">
          <div class="px-4 py-2">
            <h3 class="text-h6 mb-1 text-center">
              <v-icon left>mdi-chat</v-icon> {{ t("message.title") }}
            </h3>
          </div>
          <ChatTableComponent />
        </v-col>

        <!-- Colonna Sidebar -->
        <v-col :cols="showSidebar ? 2 : 1" class="transition-col d-flex flex-column">
          <!-- Pulsante toggle allineato a sinistra -->
          <v-tooltip bottom>
            <template #activator="{ props }">
              <div>
                <v-btn
                  v-bind="props"
                  color="primary"
                  class="mb-4"
                  @click="showSidebar = !showSidebar"
                  elevation="2"
                  block
                >
                  <v-icon>{{
                    showSidebar ? "mdi-chevron-right" : "mdi-chevron-left"
                  }}</v-icon>
                </v-btn>
              </div>
            </template>
            <span>
              {{
                showSidebar
                  ? t("graphInteraction.collapseInfo")
                  : t("graphInteraction.expandInfo")
              }}
            </span>
          </v-tooltip>

          <!-- Contenuto animato -->
          <v-expand-x-transition>
            <div v-show="showSidebar" class="w-100">
              <SideBarInfoComponent :actions="false" class="expandable-content" />

              <!-- Pulsante avvia dialogo -->
              <div class="text-center mt-4 w-100">
                <v-btn color="primary responsive-btn" @click="showTopicsDialog = true" block>
                  <v-icon left>mdi-arrow-right-bold-circle</v-icon>
                  {{ t("message.dialog.startConversation") }}
                </v-btn>
              </div>
            </div>
          </v-expand-x-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <v-dialog v-model="showTopicsDialog" max-width="500px">
    <v-card class="topics-dialog-card">
      <!-- Titolo -->
      <v-card-title class="text-h6 font-weight-bold">
        {{ t("message.dialog.startConversationTitle") }}
      </v-card-title>

      <!-- Intro descrittiva -->
      <v-card-subtitle class="text-body-2 mb-2">
        {{ t("message.dialog.startConversationDescription") }}
      </v-card-subtitle>

      <v-divider></v-divider>

      <!-- Lista target -->
      <v-card-text>
        <v-list>
          <v-list-item
            color="primary"
            active-color="primary"
            v-for="option in targetOptions"
            :key="option.value"
            @click="startDialogue(option.value)"
            :disabled="option.value === null || option.value === 'OTHER'"
            class="topic-item"
          >
            <v-list-item-title v-if="option.value != 'OTHER'">
              {{ option.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showTopicsDialog = false">
          {{ t("common.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ExploreGuideDialog v-model="showExploreGuide" />
  <TutorialDiscussionDialog v-model="showTutorialDiscussion" />
</template>

<style lang="css" scoped>
.topic-item {
  border-radius: 12px;
  transition: background-color 0.25s, color 0.25s, transform 0.15s, box-shadow 0.25s;
  cursor: pointer;
  padding: 10px 16px;
  margin-bottom: 8px;
  background-color: var(--v-theme-surface); /* sfondo del tema */
  color: var(--v-theme-primary); /* testo primario */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.topic-item:hover {
  background-color: var(--v-theme-primary); /* background primario */
  color: var(--v-theme-on-primary); /* testo leggibile sul primario */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.topic-item:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* forza anche il testo interno dei componenti Vuetify a ereditare il colore */
.topic-item .v-list-item-title {
  color: inherit;
}

.expandable-content {
  overflow: hidden;
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>
