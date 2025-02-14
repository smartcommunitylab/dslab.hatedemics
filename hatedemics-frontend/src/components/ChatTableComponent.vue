<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import { useMessagesStore } from '@/store/MessageStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
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
  { title: t("Target"), key: "target", sortable: true }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'photo': return 'mdi-image';
    case 'webpage': return 'mdi-web';
    case 'video': return 'mdi-video-box';
    default: return 'mdi-message';
  }
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
    >
      <template v-slot:item.media_type="{ item }">
        <v-icon :icon="getIcon(item.media_type)" size="24"></v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
