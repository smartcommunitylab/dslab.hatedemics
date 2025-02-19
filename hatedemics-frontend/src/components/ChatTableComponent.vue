<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMessagesStore } from '@/store/MessageStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const router = useRouter();
const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const search = ref("");

const headers = [
  { title: t("Message"), key: "message", align: "start", sortable: true },
  { title: t("Date"), key: "date", sortable: true },
  { title: t("User"), key: "from_id", sortable: true },
  { title: t("Media Type"), key: "media_type", align: "center" },
  { title: t("Reactions"), key: "nr_reactions", sortable: true },
  { title: t("Hate Label"), key: "hate_label", sortable: true },
  { title: t("Checkworthy Label"), key: "checkworthy_label", sortable: true },
  { title: t("Topic"), key: "topic", sortable: true },
];

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

const openMenu = (event: MouseEvent, item: any) => {
  event.stopPropagation(); 
  menu.value = true;
  menuX.value = event.pageX;
  menuY.value = event.pageY;
  selectedMessage.value = item;
};

const startDialogue = () => {
  if (selectedMessage.value) {
    router.push({ name: "annotation", params: { projectID: 1,taskID:1} });
  }
  menu.value = false;
};
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

    <v-data-table
      :headers="headers"
      :items="messages"
      :search="search"
      class="elevation-2"
      density="comfortable"
      hover
      @click:row="(event, { item }) => openMenu(event, item)"
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
    </v-data-table>

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
