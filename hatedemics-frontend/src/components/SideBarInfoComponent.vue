<script setup lang="ts">
import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { storeToRefs } from 'pinia';
import { useTopicsStore } from "@/store/TopicStore";
const { t } = useI18n();
const channelsStore = useChannelsStore();
const topicsStore = useTopicsStore();
const { selectedChannelInfo } = storeToRefs(channelsStore)
const { generic,topics } = storeToRefs(topicsStore);

</script>
<template>
  <v-card
    class="mx-auto"
    prepend-icon="$vuetify"
    :subtitle="selectedChannelInfo?.id"
    v-if="selectedChannelInfo"
  >
    <template v-slot:title v-if="selectedChannelInfo?.about">
      <span class="font-weight-black">{{ selectedChannelInfo?.about }}</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
      <div  v-if="selectedChannelInfo?.message_count">
        <span class="font-weight-bold">{{ t("channelInfo.nMessages") }}</span>
        <span>{{ selectedChannelInfo?.message_count }}</span>
      </div>
      <div v-if="selectedChannelInfo?.participants_count">
        <span class="font-weight-bold"> {{ t("channelInfo.nUsers") }}</span>
        {{ selectedChannelInfo?.participants_count }}
      </div>
      <div v-if="selectedChannelInfo?.language">
        <span class="font-weight-bold">{{ t("channelInfo.languages") }}</span> {{ selectedChannelInfo?.language }}
      </div>
      <div v-if="selectedChannelInfo?.IRI">
        <span class="font-weight-bold">{{ t("channelInfo.iri") }}</span> {{ selectedChannelInfo?.IRI }}
      </div>
      <div v-if="selectedChannelInfo?.sdIRI">
        <span class="font-weight-bold">{{ t("channelInfo.hateSpeech") }} </span>{{ selectedChannelInfo?.sdIRI }}
      </div>
      <div v-if="selectedChannelInfo?.last_queried_at">
        <span class="font-weight-bold">{{ t("channelInfo.lastUpdate") }}</span>
        {{ new Date(selectedChannelInfo?.last_queried_at).toUTCString() }}
      </div>
      <div v-if="selectedChannelInfo?.IRI">
        <span class="font-weight-bold">{{ t("channelInfo.iri") }} </span>{{ selectedChannelInfo?.IRI }}
      </div>
      <div v-if="generic?.hs_percentage!=undefined">
        <span class="font-weight-bold">{{ t("channelInfo.hs_percentage") }} </span>{{ generic?.hs_percentage }}
      </div>
      <div v-if="generic?.cw_percentage!=undefined">
        <span class="font-weight-bold">{{ t("channelInfo.cw_percentage") }} </span>{{ generic?.cw_percentage }}
      </div>
      
      <div v-if="selectedChannelInfo?.last_queried_at">
        <span class="font-weight-bold">{{ t("channelInfo.lastUpdate") }}</span>
        {{ new Date(selectedChannelInfo?.last_queried_at).toUTCString() }}
      </div>
      <div v-if="selectedChannelInfo?.about">
        <span class="font-weight-bold">{{ t("channelInfo.about") }}</span> {{ selectedChannelInfo?.about }}
      </div>
      <div v-if="generic">
        <span class="font-weight-bold">{{ t("channelInfo.topics") }}</span>
          <div
            v-for="topic in generic?.topics"
            :key="topic.id"
            color="primary"
          >
            {{ topic.name }}
        </div>
      </div>
      </v-card-text>
  </v-card>
  <div v-else>
    {{ t("channelInfo.emptySelection") }}
  </div>
</template>
