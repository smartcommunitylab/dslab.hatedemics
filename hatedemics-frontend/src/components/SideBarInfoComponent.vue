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

const isExtended: ComputedRef<boolean> = computed(() => !!selectedChannelInfo?.value?.iri);
  const dataEntries = computed(() => Object.entries(generic?.value.wordclouds));

onMounted(async () => {
  await topicsStore.dispatchGetTopics(selectedChannelInfo?.value?.id!);
});
</script>

<template>
  <v-container>
    <v-card v-if="selectedChannelInfo" class="mx-auto pa-4">
      <v-card-text class="bg-surface-light pt-4">
        <v-list dense>
          <v-list-item v-if="selectedChannelInfo?.about">
            <span class="font-weight-bold">{{ t("channelInfo.about") }}</span>
            {{ selectedChannelInfo.about }}
          </v-list-item>
          <v-list-item v-if="selectedChannelInfo?.id">
            <span class="font-weight-bold">{{ t("channelInfo.channelId") }}</span>
            {{ selectedChannelInfo.id }}
          </v-list-item>
          <v-list-item v-if="selectedChannelInfo?.message_count">
            <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}</span>
            {{ selectedChannelInfo.message_count }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.participants_count">
            <span class="font-weight-bold">{{ t("channelInfo.nUsers") }}</span>
            {{ selectedChannelInfo.participants_count }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.language">
            <span class="font-weight-bold">{{ t("channelInfo.languages") }}</span>
            {{ selectedChannelInfo.language }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.iri !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.iri") }}</span>
            {{ selectedChannelInfo.iri }}
          </v-list-item>

          <v-list-item v-if="generic?.hs_percentage !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }}</span>
            {{ generic.hs_percentage }}%
          </v-list-item>

          <v-list-item v-if="generic?.cw_percentage !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }}</span>
            {{ generic.cw_percentage }}%
          </v-list-item>


          <v-list-item v-if="dataEntries.length">
            <span class="font-weight-bold">{{ t("channelInfo.topics") }}</span>
            <ul class="ml-4 mt-1">
                <template v-for="([key, value], index) in dataEntries" :key="index">
                <li v-if="value.topic_label != 'not assigned'">
                   {{ value.topic_label }}
                </li>
              </template>
            </ul>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-alert v-else type="info" class="mt-4" color="primary">
      {{ t("channelInfo.emptySelection") }}
    </v-alert>
  </v-container>
</template>
