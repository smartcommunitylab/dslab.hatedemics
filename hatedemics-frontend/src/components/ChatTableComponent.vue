<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMessagesStore } from '@/store/MessageStore';
import { storeToRefs } from 'pinia';
import { useChatsStore } from '@/store/ChatStore';
import { useChannelsStore } from '@/store/ChannelStore';

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
const { selectedChannelInfo } = storeToRefs(channelStore);
const { selectedChat } = storeToRefs(chatsStore);
const totalItems = ref(0); 
const headers = [
  
  { title: t("Message"), key: "message",  sortable: true },
  { title: t("Date"), key: "date", sortable: true },
  { title: t("User"), key: "from_id", sortable: true },
  { title: t("Media Type"), key: "media_type", align: "center" },
  { title: t("Reactions"), key: "nr_reactions", sortable: true },
  { title: t("Hate Label"), key: "hate_label", sortable: true },
  { title: t("Checkworthy Label"), key: "checkworthy_label", sortable: true },
  { title: t("Topic"), key: "topic", sortable: true },
];

// Mappa icone media type
const getIcon = (type: string) => {
  switch (type) {
    case 'photo': return 'mdi-image';
    case 'webpage': return 'mdi-web';
    case 'video': return 'mdi-video-box';
    default: return 'mdi-message';
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

const startDialogue = () => {
  if (selectedMessage.value) {
    router.push({ name: "annotation", params: { projectID: 1, taskID: 1 } });
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
  pagination.page = options.page -1;
  pagination.size = options.itemsPerPage;
  fetchMessages();
};
// Funzione per recuperare i dati dal server
const fetchMessages = async () => {
  loading.value = true; // Avvia il loading
try {
  const { success, status, total, content } = await messagesStore.dispatchGetMessages(selectedChat.value!, {
    page: pagination.page, // API parte da 0
    size: pagination.size,
    sort: pagination.sort,
  });
  if (success && total) {
    totalItems.value = total; // Aggiorna il numero totale degli elementi
    console.log("Total items: ", totalItems.value);
    console.log("Pagination opetions: ", pagination);
  } else {
    console.error("Errore API ->", status);
    alert("Oops, something went wrong!");
  }
} finally {
  loading.value = false; // Disattiva il loading
}
};

// Osserva le variazioni e ricarica i dati
watch([search, page, itemsPerPage, sortBy,selectedChat,selectedChannelInfo], fetchMessages);

// Carica i dati iniziali
// onMounted(fetchMessages);

</script>

<template>
  <v-container fluid>
    <v-text-field
      v-model="search"
      :label="t('Search')"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      class="mb-4"
    ></v-text-field>

    <v-data-table-server
            :headers="headers"
            :loading="loading"
            :items="messages"
            :search="search"
            :items-length="totalItems"
            :items-per-page="pagination.size"
            :page="pagination.page +1 "
            return-object
            density="compact"
            hover
            class="elevation-2"
            @update:sort-by="onSortChange"
            @update:options="onPaginationChange"
    >
      <template v-slot:item.media_type="{ item }">
        <v-icon :icon="getIcon(item.media_type)" size="24"></v-icon>
      </template>

      <template v-slot:item.hate_label="{ item }">
        <v-icon :icon="item.hate_label ? 'mdi-check-circle' : 'mdi-close-circle'" :color="item.hate_label ? 'green' : 'red'" />
      </template>

      <template v-slot:item.checkworthy_label="{ item }">
        <v-icon :icon="item.checkworthy_label ? 'mdi-check-circle' : 'mdi-close-circle'" :color="item.checkworthy_label ? 'green' : 'red'" />
      </template>
    </v-data-table-server>

    <!-- Menu contestuale -->
    <v-menu v-model="menu" :style="{ top: `${menuY}px`, left: `${menuX}px` }" absolute offset-y>
      <v-list>
        <v-list-item @click="startDialogue">
          <v-list-item-title> {{ t("Inizia dialogo") }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<style scoped>
.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
</style>
