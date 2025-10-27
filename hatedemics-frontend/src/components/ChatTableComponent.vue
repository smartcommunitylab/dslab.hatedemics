<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMessagesStore } from "@/store/MessageStore";
import { storeToRefs } from "pinia";
import { useChatsStore } from "@/store/ChatStore";
import { useChannelsStore } from "@/store/ChannelStore";
import {
  formatDate,
  isEmptyOrSpaces,
  cleanString,
  normalizeTarget,
  targetMap,
  targetTranslations,
} from "@/services/utility";
import dialogApi from "@/services/dialog/dialogApi";

import { useGlobal } from "@/store";
const { t } = useI18n();
const router = useRouter();
const messagesStore = useMessagesStore();
const globalStore = useGlobal();
const { messages } = storeToRefs(messagesStore); // Aggiunto `totalMessages`
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([{ key: "date", order: "desc" }]); // Default: ordina per data desc
const chatsStore = useChatsStore();
const channelStore = useChannelsStore();
const { selectedChannelInfo, selectedLanguage } = storeToRefs(channelStore);
const { selectedChat } = storeToRefs(chatsStore);
const showSnackbar = (message: string) => globalStore.setMessage(message);

const totalItems = ref(0);
const filters = reactive({
  hate: null,
  checkworthy: null,
  target: null,
  // topic: null,
});
const itemsPerPageOptions = [
  { title: "10", value: 10 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
  { title: "150", value: 150 },
];
const headers = computed(() => [
  { title: t("message.header.date"), key: "date", sortable: true },
  {
    title: t("message.header.message"),
    key: "preprocessed_message_number_media",
    sortable: true,
  },
  { title: t("message.header.from"), key: "from_user", sortable: true },
  { title: t("message.header.nrReactions"), key: "nr_reactions", sortable: true },
  { title: t("message.header.hateLabel"), key: "hate_label", sortable: true },
  { title: t("message.header.checkLabel"), key: "checkworthy_label", sortable: true },
  {
    title: t("message.header.averageReliability"),
    key: "average_reliability",
    sortable: true,
  },
  // { title: t("message.header.topic"), key: "topic_label", sortable: true },
  { title: t("message.header.target"), key: "target", sortable: true },
  // { title: t("message.header.counterspeech"), key: "actions", sortable: false },
]);

// Mappa icone media type
const getIcon = (type: string) => {
  switch (type) {
    case "photo":
      return "mdi-image";
    case "webpage":
      return "mdi-web";
    case "video":
      return "mdi-video-box";
    default:
      return "mdi-message";
  }
};

// Menu contestuale
const menu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const selectedMessage = ref<any>(null);
const loading = ref(false);

const pagination = reactive({
  page: 0,
  size: 10,
  sort: "date,desc",
});
const openMenu = (event: MouseEvent, item: any) => {
  event.stopPropagation();
  menu.value = true;
  menuX.value = event.pageX;
  menuY.value = event.pageY;
  selectedMessage.value = item;
};
function getApiTarget(selectedTarget: string | null, language: string): string | null {
  if (!selectedTarget) return null;

  const normalized = normalizeTarget(selectedTarget);
  if (!normalized) return selectedTarget;
  const translation = targetTranslations[language.toUpperCase()]?.[normalized];
  return translation ?? selectedTarget;
}
const onSortChange = (sort: any) => {
  if (sort.length > 0) {
    const { key, order } = sort[0]; // Estraggo il primo criterio di ordinamento
    pagination.sort = `${key},${order}`;
  } else {
    pagination.sort = "date,desc"; // Default sorting
  }
  fetchMessages();
};
const onPaginationChange = (options: any) => {
  pagination.page = options.page - 1;
  pagination.size = options.itemsPerPage;
  fetchMessages();
};
// Funzione per recuperare i dati dal server
const fetchMessages = async () => {
  loading.value = true; // Avvia il loading
  try {
    const res = await messagesStore.dispatchGetMessages(
      selectedChat.value!,
      {
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
      },
      getApiTarget(filters.target, selectedLanguage.value || "EN") ?? undefined,
      filters.checkworthy ?? undefined,
      filters.hate ?? undefined
      // filters.topic ?? undefined
    );
    const success = res.success;
    const total = res.total ?? 0;
    const content = res.content ?? [];
    if (success && total && content) {
      totalItems.value = total;

      // Normalizza i target per ogni messaggio
      messages.value = content.map((msg) => ({
        ...msg,
        target_normalized: normalizeTarget(msg.target) ?? "",
      }));
    }
  } finally {
    loading.value = false; // Disattiva il loading
  }
};
// Funzione per determinare la classe della riga in base al target
const getRowClass = (item: any) => {
  return {
    class: !isEmptyOrSpaces(item?.item?.target) ? "has-target" : "",
  };
};

// Define parsedTargets as a computed property
const parsedTargets = computed(() => {
  if (selectedMessage.value?.target) {
    return selectedMessage.value.target
      .replace(/[{}'"]/g, "") // Rimuove parentesi e virgolette
      .split(",")
      .map((t: string) => t.trim());
  }
  return [];
});
// Osserva le variazioni e ricarica i dati
watch(
  [
    search,
    page,
    itemsPerPage,
    sortBy,
    selectedChat,
    selectedChannelInfo,
    filters,
    { deep: true },
  ],
  fetchMessages
);
const getColor = (user: string) => {
  if (!user) return "#f5f5f5";
  const colors = [
    "#d1f0d1", // Verde chiaro pastello 🌿
    "#ffdede", // Rosa tenue 🌸
    "#d1e0fa", // Azzurro pastello ☁️
    "#fde6d3", // Pesca pastello 🍑
    "#f2d9e6", // Rosa cipria 🌷
    "#d3f8f2", // Acquamarina pastello 💎
    "#fdf5c9", // Giallo pastello 🌼
    "#e3d7fc", // Lilla pastello 🎀
    "#d4eaff", // Celeste leggero 🌊
    "#e9f7d3", // Verde menta tenue 🍃
  ];

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Converte in numero intero a 32-bit
    }
    return Math.abs(hash);
  };

  return colors[hashCode(user) % colors.length];
};
const getFooterText = () => {
  const pageStart = pagination.page * pagination.size + 1;
  const pageStop = Math.min((pagination.page + 1) * pagination.size, totalItems.value);
  return t("message.footer.pagination.range", {
    pageStart,
    pageStop,
    totalItems: totalItems.value,
  });
  // return `${pageStart}-${pageStop} of ${totalItems.value} retrieved messages`;
};
const getReliabilityText = (value: number) => {
  if (value === -1) {
    return t("message.reliability.unknown");
  } else if (value >= 0 && value < 1) {
    return t("message.reliability.unreliable");
  } else if (value === 1) {
    return t("message.reliability.reliable");
  }
  return t("message.reliability.unknown");
};

const getReliabilityColor = (value: number) => {
  if (value === -1) return "gray";
  if (value >= 0 && value < 1) return "red";
  if (value === 1) return "green";
  return "gray";
};

const getReliabilityIcon = (value: number) => {
  if (value === -1) return "mdi-help-circle-outline";
  if (value >= 0 && value < 1) return "mdi-alert-circle";
  if (value === 1) return "mdi-check-circle";
  return "mdi-help-circle-outline";
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="filters.hate"
          :label="t('message.filter.hate')"
          :items="[
            { title: t('message.filter.all'), value: null },
            { title: t('message.filter.yes'), value: 1.0 },
            { title: t('message.filter.no'), value: 0.0 },
          ]"
          clearable
          dense
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="filters.checkworthy"
          :label="t('message.filter.checkworthy')"
          :items="[
            { title: t('message.filter.all'), value: null },
            { title: t('message.filter.yes'), value: 1.0 },
            { title: t('message.filter.no'), value: 0.0 },
          ]"
          clearable
          dense
        />
      </v-col>
      <!-- <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.topic"
          :label="t('message.filter.topic')"
          clearable
          dense
        />
      </v-col> -->
      <v-col cols="12" md="4">
        <v-select
          v-model="filters.target"
          :label="t('message.filter.target')"
          :items="[
            { title: t('message.filter.all'), value: null },
            ...Object.keys(targetMap).map((key) => ({
              title: t(`message.filter.${key}`),
              value: t(`message.filter.${key}`),
            })),
          ]"
          clearable
          dense
        />
      </v-col>
    </v-row>
    <v-data-table-server
      :headers="headers"
      :loading="loading"
      :items="messages"
      :row-props="getRowClass"
      :search="search"
      :items-length="totalItems"
      :items-per-page="pagination.size"
      :page="pagination.page + 1"
      :items-per-page-options="itemsPerPageOptions"
      :footer-props="{ itemsPerPageText: 'Rows count' }"
      :page-text="getFooterText()"
      return-object
      density="compact"
      hover
      class="elevation-2"
      @update:sort-by="onSortChange"
      @update:options="onPaginationChange"
      @click:row="(event: MouseEvent, { item }: any) => openMenu(event, item)"
    >
      <template v-slot:item.date="{ item }">
        <td class="text-left">
          {{
            new Date(item.date).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })
          }}
        </td>
      </template>
      <template v-slot:item.preprocessed_message_number_media="{ item }">
        <div class="chat-message" :style="{ backgroundColor: getColor(item.from_user) }">
          <div class="message-content">
            <v-icon
              v-if="item.media_type"
              :icon="getIcon(item.media_type)"
              class="me-2"
            ></v-icon>
            <span>{{ item.preprocessed_message_number_media }}</span>
          </div>
          <div class="message-time">
            {{ formatDate(item.date) }}
          </div>
        </div>
      </template>
      <template v-slot:item.from_user="{ item }">
        <span v-if="item.from_user">{{ item.from_user }}</span>
        <span v-else>User</span>
      </template>

      <template v-slot:item.hate_label="{ item }">
        <div>
          <v-icon
            :icon="
              item.hate_label === null || item.hate_label === undefined
                ? 'mdi-help-circle-outline'
                : item.hate_label
                ? 'mdi-emoticon-angry'
                : 'mdi-emoticon-happy-outline'
            "
            :color="
              item.hate_label === null || item.hate_label === undefined
                ? 'grey'
                : item.hate_label
                ? 'red'
                : 'green'
            "
          />
        </div>
      </template>

      <template v-slot:item.checkworthy_label="{ item }">
        <div>
          <v-icon v-if="item.checkworthy_label" icon="mdi-alert-outline" color="red" />
          <!-- <div class="mt-1" :style="{ color: item.checkworthy_label ? 'red' : 'green' }">
            {{ item.checkworthy_label ? t("message.worthy") : t("message.notWorthy") }}
          </div> -->
          <div class="mt-1" v-else>-</div>
        </div>
      </template>
      <template v-slot:item.average_reliability="{ item }">
        <div class="text-center">
          <v-icon
            :icon="getReliabilityIcon(item.average_reliability)"
            :color="getReliabilityColor(item.average_reliability)"
          />
          <div
            class="mt-1"
            :style="{ color: getReliabilityColor(item.average_reliability) }"
          >
            {{ getReliabilityText(item.average_reliability) }}
          </div>
        </div>
      </template>
      <template v-slot:item.target="{ item }">
        <span v-if="!isEmptyOrSpaces(item?.target!)">
          <span
          v-for="(target, idx) in (item.target_normalized ?? '').split(',')"
  :key="idx"
  class="me-2"
>
  {{ t(`message.filter.${target.trim()}`) }}
          </span>
        </span>
        <span v-else>NA</span>
      </template>

      <!-- <template v-slot:item.actions="{ item }">
        <v-tooltip v-if="!isEmptyOrSpaces(item?.target!)" :text="t('message.target')">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="primary" class="cursor-pointer">
              mdi-arrow-right-bold-circle
            </v-icon>
          </template>
        </v-tooltip>
        <v-tooltip v-else :text="t('message.noTarget')">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="grey" class="cursor-pointer">
              mdi-arrow-right-bold-circle
            </v-icon>
          </template>
        </v-tooltip>
      </template> -->

      <template v-slot:no-data>
        <div class="text-center pa-4">
          <v-icon size="48" class="mb-2">mdi-database-off</v-icon>
          <p>{{ t("message.noData") }}</p>
        </div>
      </template>
    </v-data-table-server>
    <!-- Menu contestuale -->
    <!-- <v-menu
      v-model="menu"
      :style="{ top: `${menuY}px`, left: `${menuX}px` }"
      absolute
      offset-y
    > -->
    <v-list>
      <!-- Itera su ogni target e crea una voce dinamica per ciascuno -->
      <v-list-item
        v-for="target in parsedTargets"
        :key="target"
        :disabled="isEmptyOrSpaces(target) || target === 'OTHER'"
        :class="{
          'has-target': selectedMessage?.target,
          'no-target': !selectedMessage?.target,
        }"
      >
        <!-- <v-list-item-title>
            {{ t("message.dialog.start", { target }) }}
          </v-list-item-title> -->
        <!-- <v-list-item-title v-if="target!== 'OTHER'">
        {{ t("message.dialog.start",{ target }) }}
      </v-list-item-title>
      <v-list-item-title v-else>
        {{ t("message.dialog.startOther") }}
      </v-list-item-title> -->
      </v-list-item>
    </v-list>
    <!-- </v-menu> -->
  </v-container>
</template>

<style scoped>
.chat-message {
  margin: 8px 0;
  padding: 10px 15px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.user-message {
  background-color: #e0f7fa; /* Celeste */
  align-self: flex-end;
  text-align: left;
}

.system-message {
  background-color: #f5f5f5; /* Grigio chiaro */
  align-self: flex-start;
  text-align: left;
}

.message-content {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
