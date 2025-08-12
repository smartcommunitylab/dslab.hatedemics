<script setup lang="ts">
import { computed } from "vue";
import { ref, reactive, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useChannelsStore } from "@/store/ChannelStore";
import { storeToRefs } from "pinia";
import type { ChannelInfo } from "@/services/types";
import GraphComponent from "@/components/GraphComponentNew.vue";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";
import { formatDate } from "@/services/utility";
const { t } = useI18n();
const channelsStore = useChannelsStore();
const { channelsInfo, selectedChannelInfo, selectedLanguage } = storeToRefs(
  channelsStore
);

const msg = t("channel.title");
const search = ref("");
const page = ref(1); // Vuetify inizia da 1
const itemsPerPage = ref(100);
const totalItems = ref(0); // Da aggiornare con la risposta API
const loading = ref(false);
const itemsPerPageOptions = [
  { title: "10", value: 10 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
  { title: "150", value: 150 },
  { title: "200", value: 200 },
];
const languages = [
  { language: t("language.en"), value: "EN" },
  { language: t("language.it"), value: "IT" },
  { language: t("language.es"), value: "ES" },
  { language: t("language.pl"), value: "PL" },
];

const sortBy = ref([{ key: "IRI", order: "desc" }]);

const headers = computed(() => [
  { title: t("channelTable.header.label"), key: "label", sortable: true },
  { title: t("channelTable.header.messages"), key: "message_count", sortable: true },
  {
    title: t("channelTable.header.partecipants"),
    key: "participants_count",
    sortable: true,
  },
  {
    title: t("in Rec"),
    key: "n_in_recommendation",
    sortable: true,
  },
  {
    title: t("out Rec"),
    key: "n_out_recommended",
    sortable: true,
  },
  { title: t("channelTable.header.IRI"), key: "IRI", sortable: true },
  { title: t("channelTable.header.HS"), key: "hs", sortable: true },
  { title: t("channelTable.header.CW"), key: "cw", sortable: true },
  { title: t("channelTable.header.expandable"), key: "IRI", sortable: true },
]);
const pagination = reactive({
  page: 0,
  size: 100,
  sort: "IRI,desc",
});
const resetChannels = () => {
  pagination.page = 0;
  channelsStore.unselectChannel();
  fetchChannels();
};
const fetchChannels = async () => {
  loading.value = true; // Avvia il loading
  try {
    const { success, status, total, content } = await channelsStore.dispatchGetChannels({
      page: pagination.page, // API parte da 0
      size: pagination.size,
      sort: pagination.sort,
    });

    if (success && total) {
      totalItems.value = total; // Aggiorna il numero totale degli elementi
    } else {
      console.error("Errore API ->", status);
    }
  } finally {
    loading.value = false; // Disattiva il loading
  }
};

// Aggiorna i dati quando cambia la lingua, la pagina o la dimensione della pagina
watch([selectedLanguage], resetChannels, { deep: true });
watch([pagination], fetchChannels, { deep: true });

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
  pagination.page = options.page - 1;
  pagination.size = options.itemsPerPage;
  fetchChannels();
};
const isTableVisible = ref(false);
const scrollToTable = () => {
  const table = document.querySelector(".scroll-wrapper");
  if (table) {
    table.scrollIntoView({ behavior: "smooth" });
    isTableVisible.value = true;
  }
};
const safeText = (val: string | null | undefined, maxLength = 45) => {
  return val ? val.substring(0, maxLength) : "";
};

const safeNumber = (val: number | null | undefined, decimals = 0) => {
  return typeof val === "number" ? val.toFixed(decimals) : "0";
};

const safeNumberOrDash = (val: number | null | undefined, decimals = 2) => {
  return typeof val === "number" ? val.toFixed(decimals) : "-";
};
</script>

<template>
  <v-container fluid>
    <h1 class="text-h5 font-weight-bold text-primary ma-4">{{ msg }}</h1>
    <h2 class="text-h6 font-weight-medium ma-4">
      {{ t("channel.subtitle") }}
    </h2>
    <v-row>
      <!-- Sezione principale -->
      <v-col cols="12">
        <v-card class="pa-4" elevation="0">
          <!-- <v-card-title class="text-h5 font-weight-bold text-primary">
            {{ msg }}
          </v-card-title>
          <v-divider class="mb-4"></v-divider> -->
          <v-row>
            <v-col cols="4">
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
            </v-col>
          </v-row>
          <GraphComponent :key="selectedLanguage" class="mb-4" />

          <!-- <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            color="primary"
            class="mb-4"
          ></v-text-field> -->
          <div class="scroll-wrapper">
            <v-data-table-server
              :loading="loading"
              :headers="headers"
              :items="channelsInfo"
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
            >
              <template #top>
                <div class="px-4 py-2">
                  <h3 class="text-h6 mb-1 text-center">
                    🌐 {{ t("channelTable.header.title") }}
                  </h3>
                </div>
              </template>
              <template v-slot:item="{ item }">
                <tr
                  @click="handleClick(item)"
                  :class="{ selected: item.id === selectedChannelInfo?.id }"
                  class="hover-row"
                >
                  <td class="text-left">{{ safeText(item.label) }}</td>
                  <td class="text-left">{{ safeNumber(item.message_count) }}</td>
                  <td class="text-left">{{ safeNumber(item.participants_count) }}</td>
                  <td class="text-left">{{ safeNumber(item.n_in_recommendation) }}</td>
                  <td class="text-left">{{ safeNumber(item.n_out_recommended) }}</td>
                  <td class="text-left">{{ safeNumberOrDash(item.iri) }}</td>
                  <td class="text-left">{{ safeNumberOrDash(item.hs) }}</td>
                  <td class="text-left">{{ safeNumberOrDash(item.cw) }}</td>
                  <td class="text-left">
                    <v-icon
                      v-if="typeof item.iri === 'number' && item.iri >= 0"
                      class="status-icon success"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon v-else class="status-icon error"> mdi-close </v-icon>
                  </td>
                  <td class="text-left"></td>
                </tr>
              </template>
            </v-data-table-server>
          </div>
        </v-card>
      </v-col>

      <!-- Sezione info canale -->
      <v-col cols="4">
        <!-- <v-card class="pa-4 bg-surface" elevation="2">
          <v-card-title class="text-h5 font-weight-bold text-secondary">
            {{ t("channel.infoTitle") }}
          </v-card-title>
          <v-divider class="mb-4"></v-divider> -->
        <!-- <ChannelInfoComponent /> -->
        <!-- </v-card> -->
      </v-col>
    </v-row>
    <v-btn
      v-if="!isTableVisible"
      @click="scrollToTable"
      class="show-table-btn"
      color="primary"
      icon
    >
      <v-icon>mdi-arrow-down-bold</v-icon>
    </v-btn>
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
.status-icon {
  border-radius: 50%;
  padding: 6px;
  color: white;
  font-size: 20px;
}

.success {
  background-color: green;
}

.error {
  background-color: red;
}
.scrollable-container {
  overflow-x: auto;
  position: relative;
}

.scrollable-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 30px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1));
}
.show-table-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}
</style>
