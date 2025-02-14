<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from 'vue';
import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTopicsStore } from "@/store/TopicStore";

const { t } = useI18n();
const router = useRouter();
const topicsStore = useTopicsStore();
const channelsStore = useChannelsStore();

const { selectedChannelInfo } = storeToRefs(channelsStore);
const { generic } = storeToRefs(topicsStore);

const isExtended: ComputedRef<boolean> = computed(() => !!selectedChannelInfo?.value?.IRI);

onMounted(async () => {
  await topicsStore.dispatchGetTopics("id");
});

const goToChats = () => {
  router.push({ name: 'Inspector' });
};
</script>

<template>
  <v-container>
    <v-card v-if="selectedChannelInfo" class="mx-auto pa-4">
      <v-card-title v-if="selectedChannelInfo?.about" class="text-h6 font-weight-bold">
        {{ selectedChannelInfo.about }}
      </v-card-title>
      
      <v-card-subtitle v-if="selectedChannelInfo?.id">
        {{ t("channelInfo.channelId") }}: {{ selectedChannelInfo.id }}
      </v-card-subtitle>

      <v-card-text class="bg-surface-light pt-4">
        <v-list dense>
          <v-list-item v-if="selectedChannelInfo?.message_count">
            <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}:</span> 
            {{ selectedChannelInfo.message_count }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.participants_count">
            <span class="font-weight-bold">{{ t("channelInfo.nUsers") }}:</span> 
            {{ selectedChannelInfo.participants_count }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.language">
            <span class="font-weight-bold">{{ t("channelInfo.languages") }}:</span> 
            {{ selectedChannelInfo.language }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.IRI !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.iri") }}:</span> 
            {{ selectedChannelInfo.IRI }}
          </v-list-item>

          <v-list-item v-if="generic?.hs_percentage !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }}:</span> 
            {{ generic.hs_percentage }}%
          </v-list-item>

          <v-list-item v-if="generic?.cw_percentage !== undefined">
            <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }}:</span> 
            {{ generic.cw_percentage }}%
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.last_queried_at">
            <span class="font-weight-bold">{{ t("channelInfo.lastUpdate") }}:</span> 
            {{ new Date(selectedChannelInfo.last_queried_at).toUTCString() }}
          </v-list-item>

          <v-list-item v-if="selectedChannelInfo?.about">
            <span class="font-weight-bold">{{ t("channelInfo.about") }}:</span> 
            {{ selectedChannelInfo.about }}
          </v-list-item>

          <v-list-item v-if="generic?.topics?.length">
            <span class="font-weight-bold">{{ t("channelInfo.topics") }}:</span>
            <ul class="ml-4 mt-1">
              <li v-for="topic in generic.topics" :key="topic.id">
                {{ topic.name }}
              </li>
            </ul>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions v-if="isExtended">
        <v-btn color="primary" variant="text" @click="goToChats">
          {{ t("channelInfo.messages") }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-alert v-else type="info" class="mt-4">
      {{ t("channelInfo.emptySelection") }}
    </v-alert>
  </v-container>
</template>
