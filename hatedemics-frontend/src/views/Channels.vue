<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useChannelsStore } from "@/store/ChannelStore";
import { storeToRefs } from "pinia";
import type { ChannelInfo } from "@/services/types";
import GraphComponent from "@/components/GraphComponentNew.vue";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";

const { t } = useI18n();
const channelsStore = useChannelsStore();
const { channelsInfo, selectedChannelInfo, selectedLanguage } = storeToRefs(
  channelsStore
);

const msg = ref("");
const search = ref("");
const page = ref(1); // Vuetify inizia da 1
const itemsPerPage = ref(10);
const totalItems = ref(0); // Da aggiornare con la risposta API
const loading = ref(false);
const itemsPerPageOptions =  [
              { title: '10', value: 10 },
              { title: '50', value: 50 },
              { title: '100', value: 100 },
      { title: '150', value: 150 },
    ];
const languages = [
  { language: "Italiano", value: "IT" },
  { language: "English", value: "EN" },
  { language: "Español", value: "ES" },
  { language: "Polacco", value: "PL" },
  { language: "Maltese", value: "ML" },
];

const sortBy = ref([{ key: "IRI", order: "desc" }]);

const headers = reactive([
  { title: t("channelTable.header.messages"), key: "message_count", sortable: true },
  {
    title: t("channelTable.header.partecipants"),
    key: "participants_count",
    sortable: true,
  },
  { title: t("channelTable.header.IRI"), key: "IRI", sortable: true },
]);
const pagination = reactive({
  page: 0,
  size: 10,
  sort: "IRI,desc",
});
const fetchChannels = async () => {
  loading.value = true; // Avvia il loading
  try{
  const { success, status, total, content } = await channelsStore.dispatchGetChannels({
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

// Aggiorna i dati quando cambia la lingua, la pagina o la dimensione della pagina
watch([selectedLanguage, pagination], fetchChannels, { deep: true });
onMounted(fetchChannels);

const handleClick = (item: ChannelInfo) => {
  console.log("Clicked item: ", item);
  channelsStore.selectChannelInfo(item);
};
const onSortChange = (sort: any) => {
  if (sort.length > 0) {
    const { key, order } = sort[0]; // Estraggo il primo criterio di ordinamento
    pagination.sort = `${key},${order}`;
  } else {
    pagination.sort = "IRI,desc"; // Default sorting
  }
  fetchChannels();
};
const onPaginationChange = (options: any) => {
  pagination.page = options.page -1;
  pagination.size = options.itemsPerPage;
  fetchChannels();
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Sezione principale -->
      <v-col cols="8">
        <v-card class="pa-4 bg-surface" elevation="2">
          <v-card-title class="text-h5 font-weight-bold text-primary">
            {{ msg }}
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-select
            label="Language"
            v-model="selectedLanguage"
            :items="languages"
            item-title="language"
            item-value="value"
            variant="outlined"
            density="compact"
            color="primary"
            class="mb-4"
          />

          <GraphComponent class="mb-4" />

          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            class="mb-4"
          ></v-text-field>

          <v-data-table-server
          :loading="loading"
          :headers="headers"
            :items="channelsInfo"
            :search="search"
            :items-length="totalItems"
            :items-per-page="pagination.size"
            :page="pagination.page +1 "
            :items-per-page-options="itemsPerPageOptions"
            return-object
            density="compact"
            hover
            class="elevation-2"
            @update:sort-by="onSortChange"
            @update:options="onPaginationChange"
          >
            <template v-slot:item="{ item }">
              <tr
                @click="handleClick(item)"
                :class="{ selected: item.id === selectedChannelInfo?.id }"
                class="hover-row"
              >
                <td class="text-left">{{ item.message_count }}</td>
                <td class="text-left">{{ item.participants_count }}</td>
                <td class="text-left">{{ item.iri }}</td>
              </tr>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>

      <!-- Sezione info canale -->
      <v-col cols="4">
        <v-card class="pa-4 bg-surface" elevation="2">
          <v-card-title class="text-h5 font-weight-bold text-secondary">
            {{ t("channel.infoTitle") }}
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <ChannelInfoComponent />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Selezione riga tabella */
.selected {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  transition: background 0.2s;
}

/* Hover sulla tabella */
.hover-row:hover {
  /* background-color: var(--v-theme-surface-lighten-2) !important; */
  cursor: pointer;
}
</style>
