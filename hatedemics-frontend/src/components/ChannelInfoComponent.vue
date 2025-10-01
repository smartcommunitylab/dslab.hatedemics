<script setup lang="ts">
import { computed, onMounted, watch, type ComputedRef } from 'vue';
import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTopicsStore } from "@/store/TopicStore";
import type { ChannelInfo } from '@/services/types';
import { formatDate } from '@/services/utility';

const { t } = useI18n();
const router = useRouter();
const topicsStore = useTopicsStore();
const channelsStore = useChannelsStore();

const { selectedChannelInfo } = storeToRefs(channelsStore);
const { generic } = storeToRefs(topicsStore);

const isExtended: ComputedRef<boolean> = computed(() => selectedChannelInfo?.value?.expandable === "True");
  const dataEntries: ComputedRef<[any, any][]> = computed(() => {
    if (generic?.value?.wordclouds === undefined) {
      return [];
    }
    return Object.entries(generic?.value?.wordclouds);
  });

onMounted(async () => {
  await topicsStore.dispatchGetTopics(selectedChannelInfo?.value?.id!);
});

const goToChats = () => {
  router.push({ name: 'Inspector' });
};

watch(selectedChannelInfo, async (newVal) => {
  if (newVal && newVal.id) {
    await topicsStore.dispatchGetTopics(newVal.id);
  }
}, { immediate: true });
</script>

<template>
  <v-container class="pa-0" fluid>
    <v-card
      v-if="selectedChannelInfo"
      class="mx-auto pa-0 rounded bg-surface-light"
      elevation="0"
    >
      <v-card-text class="pt-4">
        <v-row dense>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="selectedChannelInfo?.label" v-bind="props">
                <v-icon class="mr-2" color="primary">mdi-tag</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.label") }}</span>
                {{ selectedChannelInfo.label }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.label')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col
                cols="12"
                v-if="selectedChannelInfo?.preprocessed_about"
                v-bind="props"
              >
                <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.about") }}</span>
                <span class="text-wrap">{{
                  selectedChannelInfo.preprocessed_about
                }}</span>
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.about')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="selectedChannelInfo?.message_count" v-bind="props">
                <v-icon class="mr-2" color="primary">mdi-message</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}</span>
                {{ selectedChannelInfo.message_count }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.nMessages')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col
                cols="12"
                v-if="selectedChannelInfo?.participants_count"
                v-bind="props"
              >
                <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.nUsers") }}</span>
                {{ selectedChannelInfo.participants_count }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.nUsers')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="selectedChannelInfo?.language" v-bind="props">
                <v-icon class="mr-2" color="primary">mdi-translate</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.languages") }}</span>
                {{ selectedChannelInfo.language }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.languages')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col
                cols="12"
                v-if="selectedChannelInfo?.degree_centrality"
                v-bind="props"
              >
                <v-icon class="mr-2" color="primary">mdi-graph-outline</v-icon>
                <span class="font-weight-bold">{{
                  t("channelInfo.degreeCentrality")
                }}</span>
                {{ selectedChannelInfo.degree_centrality }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.degreeCentrality')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="selectedChannelInfo?.iri !== null" v-bind="props">
                <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.iri") }}</span>
                {{ selectedChannelInfo.iri?.toFixed(3) }}
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.iri')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="generic?.hs_percentage !== undefined" v-bind="props">
                <v-icon class="mr-2" color="error">mdi-emoticon-angry</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }}</span>
                {{ selectedChannelInfo.hs }}%
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.hs_percentage')"></div>
          </v-tooltip>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <v-col cols="12" v-if="generic?.cw_percentage !== undefined" v-bind="props">
                <v-icon class="mr-2" color="error">mdi-magnify-close</v-icon>
                <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }}</span>
                {{ selectedChannelInfo.cw }}%
              </v-col>
            </template>
            <div class="tooltip-html" v-html="t('dialog.tooltip.cw_percentage')"></div>
          </v-tooltip>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="isExtended">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            color="primary"
            variant="flat"
            @click="goToChats"
            block
            class="mt-4 responsive-btn"
          >
            <span class="btn-text">{{ t("channelInfo.exploreChannel") }}</span>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
    <v-alert v-else type="info" class="mt-4" color="primary">
      {{ t("channelInfo.emptySelection") }}
    </v-alert>
  </v-container>
</template>
<style scoped>
.btn-text {
  white-space: normal !important;
  word-break: break-word !important;
  display: block;
  text-align: center;
}
</style>
