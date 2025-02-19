<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useConfig } from "@/store";
import { useChannelsStore } from "@/store/ChannelStore";
import { storeToRefs } from "pinia";
import type { ChannelInfo } from "@/services/types";
import GraphComponent from "@/components/GraphComponentNew.vue";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";

const { t } = useI18n();
const channelsStore = useChannelsStore();
const configStore = useConfig();
const { channelsInfo, selectedChannelInfo, selectedLanguage } = storeToRefs(channelsStore);

const msg = ref("");
const search = ref("");
const languages = [
  { language: "Italiano", value: "it" },
  { language: "English", value: "en" },
  { language: "Español", value: "es" },
];

const sortBy = ref([{ key: "IRI", order: "desc" }]);

const headers = reactive([
  { title: t("channelTable.header.messages"), key: "message_count", sortable: true },
  { title: t("channelTable.header.partecipants"), key: "participants_count", sortable: true },
  { title: t("channelTable.header.IRI"), key: "IRI", sortable: true },
]);

const changeData = (lang: string) => {
  console.log("Change file of channels and reload everything " + lang);
};

const handleClick = (item: ChannelInfo) => {
  console.log("Clicked item: ", item);
  channelsStore.selectChannelInfo(item);
};

watch(selectedChannelInfo, (newValue) => {
  console.log("selectedNode", newValue);
});

onMounted(async () => {
  await channelsStore.selectLanguage("it");
  const { success, status } = await channelsStore.dispatchGetChannels();
  msg.value = t("channel.title");

  if (!success) {
    console.error("API error ->", status);
    alert("Oops, something went wrong!");
  }

  selectedLanguage.value = languages[0].value;
});

const onSortChange = (sort: any) => {
  if (sort.length > 0) {
    const { key, order } = sort[0];
    channelsStore.selectOrder(key, order);
  }
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
            @update:model-value="changeData"
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

          <v-data-table
            :headers="headers"
            :items="channelsInfo"
            :search="search"
            @update:sort-by="onSortChange"
            v-model:sort-by="sortBy"
            return-object
            density="compact"
            hover
            class="elevation-2"
          >
            <template v-slot:item="{ item }">
              <tr
                @click="handleClick(item)"
                :class="{ selected: item.id === selectedChannelInfo?.id }"
                class="hover-row"
              >
                <td class="text-left">{{ item.message_count }}</td>
                <td class="text-left">{{ item.participants_count }}</td>
                <td class="text-left">{{ item.IRI }}</td>
              </tr>
            </template>
          </v-data-table>
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
