<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMessagesStore } from "@/store/MessageStore";
import { storeToRefs } from "pinia";
import { useChatsStore } from "@/store/ChatStore";
import { useChannelsStore } from "@/store/ChannelStore";
import { formatDate, isEmptyOrSpaces,cleanString } from "@/services/utility";
import dialogApi from "@/services/dialog/dialogApi";
const { t } = useI18n();
const router = useRouter();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore); // Aggiunto `totalMessages`
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([{ key: "date", order: "desc" }]); // Default: ordina per data desc
const chatsStore = useChatsStore();
const channelStore = useChannelsStore();
const { selectedChannelInfo,selectedLanguage } = storeToRefs(channelStore);
const { selectedChat } = storeToRefs(chatsStore);
const totalItems = ref(0);

const itemsPerPageOptions = [
  { title: "10", value: 10 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
  { title: "150", value: 150 },
];
const headers = [
  { title: t("message.header.date"), key: "date", sortable: true },
  { title: t("message.header.message"), key: "preprocessed_message_media", sortable: true },
  { title: t("message.header.from"), key: "from_user", sortable: true },
  { title: t("message.header.nrViews"), key: "nr_views", sortable: true },
  { title: t("message.header.hateLabel"), key: "hate_label", sortable: true },
  { title: t("message.header.checkLabel"), key: "checkworthy_label", sortable: true },
  { title: t("message.header.topic"), key: "topic_label", sortable: true },
  { title: t("message.header.target"), key: "target", sortable: true },
];

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
    const target = cleanString(message.target); //message.target;
    const lan = selectedLanguage.value;
    const response = await dialogApi.getProjects();
    const projects = response.data;
    // get id of project with name Target - Language
    const projectID = projects.find((p) => p.name === `${target}-${lan}`)?.id;
    if (projectID) {
      router.push({ name: "tasks", params: { projectID } });
    } else {
      alert("Project not found");
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
      }
    );
    if (success && total) {
      totalItems.value = total; // Aggiorna il numero totale degli elementi
    } else {
      alert("Oops, something went wrong!");
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
// Osserva le variazioni e ricarica i dati
watch(
  [search, page, itemsPerPage, sortBy, selectedChat, selectedChannelInfo],
  fetchMessages
);
const getColor = (user:string) => {
  if (!user) return "#f5f5f5";
  const colors = ["#e0f7fa", "#ffcdd2", "#d1c4e9", "#c8e6c9"];
  return colors[user.length % colors.length];
};
// Carica i dati iniziali
// onMounted(fetchMessages);
</script>

<template>
  <v-container fluid>
    <!-- <v-text-field
      v-model="search"
      :label="t('Search')"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      class="mb-4"
    ></v-text-field> -->

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
      <v-icon v-if="item.media_type" :icon="getIcon(item.media_type)" class="me-2"></v-icon>
      <span>{{ item.preprocessed_message_media }}</span>
    </div>
    <div class="message-time">
      {{ formatDate(item.date) }}
    </div>
  </div>
</template>
      <template v-slot:item.from_user="{ item }">
        <span v-if="item.from_user">{{ item.from_user }}</span>
        <span v-else>NA</span>
      </template>

      <template v-slot:item.hate_label="{ item }">
        <v-icon
          :icon="item.hate_label ? 'mdi-check-circle' : 'mdi-close-circle'"
          :color="item.hate_label ? 'green' : 'red'"
        />
      </template>

      <template v-slot:item.checkworthy_label="{ item }">
        <v-icon
          :icon="item.checkworthy_label ? 'mdi-check-circle' : 'mdi-close-circle'"
          :color="item.checkworthy_label ? 'green' : 'red'"
        />
      </template>
      <template v-slot:item.target="{ item }">
        <span v-if="!isEmptyOrSpaces(item?.target!)">{{ cleanString(item?.target!) }}</span>
        <span v-else>NA</span>
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
        <v-list-item
          @click="startDialogue(selectedMessage)"
          :disabled="isEmptyOrSpaces(selectedMessage?.target!)"
          :class="{
            'has-target': selectedMessage?.target,
            'no-target': !selectedMessage?.target,
          }"
        >
          <v-list-item-title> {{ t("message.dialog.start") }} </v-list-item-title>
        </v-list-item>
        <!-- <v-list-item @click="jumpToConversation">
          <v-list-item-title> {{ t("message.dialog.jump") }} </v-list-item-title>
        </v-list-item> -->
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
