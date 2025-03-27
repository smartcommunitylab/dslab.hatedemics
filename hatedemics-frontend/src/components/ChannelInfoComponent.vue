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

const isExtended: ComputedRef<boolean> = computed(() => !!selectedChannelInfo?.value?.iri);
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
  <v-container>
    <v-card v-if="selectedChannelInfo" class="mx-auto pa-4 rounded-lg" elevation="2">



      <v-card-text class="bg-surface-light pt-4">
        <v-row dense>
          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.preprocessed_about">
            <v-icon class="mr-2" color="primary">mdi-information</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.about") }}</span>
            <span class="text-wrap">{{ selectedChannelInfo.preprocessed_about }}</span>
          </v-col>

          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.id">
            <v-icon class="mr-2" color="primary">mdi-identifier</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.channelId") }}</span>
            {{ selectedChannelInfo.id }}
          </v-col>

          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.message_count">
            <v-icon class="mr-2" color="primary">mdi-message</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}</span>
            {{ selectedChannelInfo.message_count }}
          </v-col>

          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.participants_count">
            <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.nUsers") }}</span>
            {{ selectedChannelInfo.participants_count }}
          </v-col>

          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.language">
            <v-icon class="mr-2" color="primary">mdi-translate</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.languages") }}</span>
            {{ selectedChannelInfo.language }}
          </v-col>

          <v-col cols="12" sm="6" v-if="selectedChannelInfo?.iri !== null">
            <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.iri") }}</span>
            {{ selectedChannelInfo.iri?.toFixed(3) }}
          </v-col>

          <v-col cols="12" sm="6" v-if="generic?.hs_percentage !== undefined">
            <v-icon class="mr-2" color="error">mdi-alert</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }}</span>
            {{ generic.hs_percentage }}%
          </v-col>

          <v-col cols="12" sm="6" v-if="generic?.cw_percentage !== undefined">
            <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
            <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }}</span>
            {{ generic.cw_percentage }}%
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-list v-if="dataEntries.length">
          <v-list-subheader class="text-h6 font-weight-bold">
            {{ t("channelInfo.topics") }}
          </v-list-subheader>
          <v-chip-group column>
            <v-chip
              v-for="([key, value], index) in dataEntries"
              :key="index"
              
              class="ma-1"
              color="primary"
            >
              {{ value.topic_label }}
            </v-chip>
          </v-chip-group>
        </v-list>
      </v-card-text>

      <v-card-actions v-if="isExtended">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            color="primary"
            variant="flat"
            @click="goToChats"
            block
            class="mt-4 pa-6 text-h5"
            prepend-icon="mdi-text-box"
          >
            {{ t("channelInfo.exploreChannel") }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>

    <v-alert v-else type="info" class="mt-4" color="primary">
      {{ t("channelInfo.emptySelection") }}
    </v-alert>
  </v-container>
</template>

