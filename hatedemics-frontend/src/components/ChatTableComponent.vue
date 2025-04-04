<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMessagesStore } from "@/store/MessageStore";
import { storeToRefs } from "pinia";
import { useChatsStore } from "@/store/ChatStore";
import { useChannelsStore } from "@/store/ChannelStore";
import { formatDate, isEmptyOrSpaces, cleanString } from "@/services/utility";
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
  topic: null,
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
    key: "preprocessed_message_media",
    sortable: true,
  },
  { title: t("message.header.from"), key: "from_user", sortable: true },
  { title: t("message.header.nrViews"), key: "nr_views", sortable: true },
  { title: t("message.header.hateLabel"), key: "hate_label", sortable: true },
  { title: t("message.header.checkLabel"), key: "checkworthy_label", sortable: true },
  { title: t("message.header.topic"), key: "topic_label", sortable: true },
  { title: t("message.header.target"), key: "target", sortable: true },
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

const startDialogue = async (message: any) => {
  if (selectedMessage.value) {
    //TODO
    //get projectID  by lang and target
    const target = cleanString(message); //message.target;
    const lan = selectedLanguage.value;

    try {
      const response = await dialogApi.getProjects();
      const projects = response.data;
      // get id of project with name Target - Language
      const projectID = projects.find((p: any) => p.name === `${target}-${lan}`)?.id;
      if (projectID) {
        router.push({ name: "tasks", params: { projectID } });
      } else {
        showSnackbar(t("message.dialog.noProject"));
      }
    } catch (error) {
      showSnackbar(t("message.dialog.error"));
    }
  }
  menu.value = false;
};
const jumpToConversation = () => {
  if (selectedMessage.value) {
    //TODO
    // reorder list by date and start from here
  }
  menu.value = false;
};
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
    const { success, status, total, content } = await messagesStore.dispatchGetMessages(
      selectedChat.value!,
      {
        page: pagination.page, // API parte da 0
        size: pagination.size,
        sort: pagination.sort,
      },
      filters.target ?? undefined,
      filters.checkworthy ?? undefined,
      filters.hate ?? undefined,
      filters.topic ?? undefined
    );
    if (success && total) {
      totalItems.value = total; // Aggiorna il numero totale degli elementi
    } else {
      // alert("Oops, something went wrong!");
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
const startDialogueWithTarget = function (target: any) {
    // Logica per avviare una conversazione con il target
    console.log(`Start conversation with ${target}`);
  }

// Define parsedTargets as a computed property
const parsedTargets = computed(() => {
  if (selectedMessage.value?.target) {
    return selectedMessage.value.target.replace(/[{}'"]/g, '') // Rimuove parentesi e virgolette
    .split(",").map((t: string) => t.trim());
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

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3">
        <v-select
          v-model="filters.target"
          :label="t('message.filter.target')"
          :items="[
            { title: t('message.filter.all'), value: null },
            { title: t('message.filter.DISABLED'), value: 'DISABLED' },
            { title: t('message.filter.JEWS'), value: 'JEWS' },
            { title: t('message.filter.LGBT+'), value: 'LGBT+' },
            { title: t('message.filter.MIGRANTS'), value: 'MIGRANTS' },
            { title: t('message.filter.MUSLIMS'), value: 'MUSLIMS' },
            { title: t('message.filter.OTHER'), value: 'OTHER' },
            { title: t('message.filter.POC'), value: 'POC' },
            { title: t('message.filter.ROMANI'), value: 'ROMANI' },
            { title: t('message.filter.WOMEN'), value: 'WOMEN' },
          ]"
          item-value="value"
          item-text="text"
          clearable
          dense
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.topic"
          :label="t('message.filter.topic')"
          clearable
          dense
        />
      </v-col>
      <v-col cols="12" md="3">
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

      <v-col cols="12" md="3">
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
      return-object
      density="compact"
      hover
      class="elevation-2"
      @update:sort-by="onSortChange"
      @update:options="onPaginationChange"
      @click:row="(event: MouseEvent, { item }: any) => openMenu(event, item)"
    >
      <template v-slot:item.date="{ item }">
        <td class="text-left">{{ formatDate(item.date) }}</td>
      </template>
      <template v-slot:item.preprocessed_message_media="{ item }">
        <div class="chat-message" :style="{ backgroundColor: getColor(item.from_user) }">
          <div class="message-content">
            <v-icon
              v-if="item.media_type"
              :icon="getIcon(item.media_type)"
              class="me-2"
            ></v-icon>
            <span>{{ item.preprocessed_message_media }}</span>
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
        <div class="text-center">
          <v-icon
            :icon="item.hate_label ? 'mdi-emoticon-angry' : 'mdi-emoticon-happy-outline'"
            :color="item.hate_label ? 'red' : 'green'"
          />
          <div class="mt-1" :style="{ color: item.hate_label ? 'red' : 'green' }">
            {{ item.hate_label ? "Hate" : "Not Hate" }}
          </div>
        </div>
      </template>

      <template v-slot:item.checkworthy_label="{ item }">
        <div class="text-center">
          <v-icon
            :icon="item.checkworthy_label ? 'mdi-magnify-close' : 'mdi-check-circle'"
            :color="item.checkworthy_label ? 'red' : 'green'"
          />
          <div class="mt-1" :style="{ color: item.checkworthy_label ? 'red' : 'green' }">
            {{ item.checkworthy_label ? "Check Worthy" : "Not Check Worthy" }}
          </div>
        </div>
      </template>
      <template v-slot:item.target="{ item }">
        <span
          v-if="!isEmptyOrSpaces(item?.target!)"
          >{{ cleanString(item?.target!) }}</span
        >
        <span v-else>NA</span>
      </template>
      <template v-slot:no-data>
        <div class="text-center pa-4">
          <v-icon size="48" class="mb-2">mdi-database-off</v-icon>
          <p>{{ t("message.noData") }}</p>
        </div>
      </template>
    </v-data-table-server>
<!-- Menu contestuale -->
<v-menu
  v-model="menu"
  :style="{ top: `${menuY}px`, left: `${menuX}px` }"
  absolute
  offset-y
>
  <v-list>
    <!-- Itera su ogni target e crea una voce dinamica per ciascuno -->
    <v-list-item
      v-for="target in parsedTargets"
      :key="target"
      @click="startDialogue(target)"
      :disabled="isEmptyOrSpaces(target) ||target === 'OTHER'"
      :class="{
        'has-target': selectedMessage?.target,
        'no-target': !selectedMessage?.target,
      }"
    >
      <v-list-item-title>
        {{ t("message.dialog.start",{ target }) }}
      </v-list-item-title>
      <!-- <v-list-item-title v-if="target!== 'OTHER'">
        {{ t("message.dialog.start",{ target }) }}
      </v-list-item-title>
      <v-list-item-title v-else>
        {{ t("message.dialog.startOther") }}
      </v-list-item-title> -->
    </v-list-item>
  </v-list>
</v-menu>
   
  </v-container>
</template>

<style scoped>
/* Default hover */
.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

/* Hover su righe con target */
.v-data-table :deep(tbody tr.has-target:hover) {
  background-color: rgba(255, 0, 0, 0.2) !important; /* Rosso chiaro */
}
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
