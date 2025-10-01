<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from 'vue';
import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTopicsStore } from "@/store/TopicStore";
import { formatDate } from '@/services/utility';

const { t } = useI18n();
const router = useRouter();
const topicsStore = useTopicsStore();
const channelsStore = useChannelsStore();

const { selectedChannelInfo } = storeToRefs(channelsStore);
const { generic } = storeToRefs(topicsStore);

const isExtended: ComputedRef<boolean> = computed(() => !!selectedChannelInfo?.value?.hs);
  const dataEntries = computed(() => {
    if (!generic?.value?.wordclouds) return [];
    return Object.entries(generic?.value.wordclouds);
  });
  

onMounted(async () => {
  await topicsStore.dispatchGetTopics(selectedChannelInfo?.value?.id!);
});
</script>

<template>
  <v-container class="pa-0" fluid>
    <v-card v-if="selectedChannelInfo" class="mx-auto pa-0 rounded-lg" elevation="0">
      <v-card-text class="bg-surface-light pt-4">
        <v-row dense>
          <v-col cols="12" v-if="selectedChannelInfo?.preprocessed_about">
            
            <v-icon class="mr-2" color="primary">mdi-tag</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.label") }}</span>
            {{ selectedChannelInfo.label }}
          </v-col>

          <v-col cols="12" v-if="selectedChannelInfo?.id">
            <v-icon class="mr-2" color="primary">mdi-information</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.about") }}</span>
            <span class="text-wrap">{{ selectedChannelInfo.preprocessed_about }}</span>
            
          </v-col>

          <v-col cols="12" v-if="selectedChannelInfo?.message_count">
            <v-icon class="mr-2" color="primary">mdi-message</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}</span>
            {{ selectedChannelInfo.message_count }}
          </v-col>
          <v-col cols="12" v-if="selectedChannelInfo?.degree_centrality">
            <v-icon class="mr-2" color="primary">mdi-graph-outline</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.degreeCentrality") }}</span>
            {{ selectedChannelInfo.degree_centrality }}
          </v-col>

          <v-col cols="12" v-if="selectedChannelInfo?.participants_count">
            <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.nUsers") }}</span>
            {{ selectedChannelInfo.participants_count }}
          </v-col>

          <v-col cols="12" v-if="selectedChannelInfo?.language">
            <v-icon class="mr-2" color="primary">mdi-translate</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.languages") }}</span>
            {{ selectedChannelInfo.language }}
          </v-col>

          <v-col cols="12" v-if="selectedChannelInfo?.iri !== null">
            <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.iri") }}</span>
            {{ selectedChannelInfo.iri?.toFixed(2) }}
          </v-col>

          <v-col cols="12" v-if="generic?.hs_percentage !== undefined">
            <v-icon class="mr-2" color="error">mdi-emoticon-angry</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }}</span>
            {{ selectedChannelInfo.hs?.toFixed(2) }}%
          </v-col>

          <v-col cols="12" v-if="generic?.cw_percentage !== undefined">
            <v-icon class="mr-2" color="error">mdi-magnify-close</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }}</span>
            {{ selectedChannelInfo.cw?.toFixed(2) }}%
          </v-col>
        </v-row>

        <!-- <v-divider class="my-4"></v-divider> -->

        <!-- <v-list v-if="dataEntries.length">
          <v-list-subheader class="text-h6 font-weight-bold">
            {{ t("channelInfo.topics") }}
          </v-list-subheader>
            <v-chip
              v-for="([key, value], index) in dataEntries"
              :key="index"
              class="ma-1"
            >
              {{ (value as any).topic_label }}
            </v-chip>
        </v-list> -->
      </v-card-text>


    </v-card>

    <v-alert v-else type="info" class="mt-4" color="primary">
      {{ t("channelInfo.emptySelection") }}
    </v-alert>
  </v-container>
</template>
