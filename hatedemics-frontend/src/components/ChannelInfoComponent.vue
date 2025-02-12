<script setup lang="ts">
import {
  computed,

  type ComputedRef,

} from 'vue';import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
const { t } = useI18n();
const channelsStore = useChannelsStore();
const router = useRouter();
const { selectedChannelInfo } = storeToRefs(channelsStore)

const isExtended: ComputedRef<boolean> = computed(() => (selectedChannelInfo?.value?.IRI ? true : false));
const goToChats = () => {
  router.push({
    name: 'Inspector',
  })
}
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
      <div v-if="selectedChannelInfo?.about">
        <span class="font-weight-bold">{{ t("channelInfo.about") }}</span> {{ selectedChannelInfo?.about }}
      </div>
      </v-card-text>
      <v-card-actions v-if="isExtended">
      <v-btn color="primary" text="Learn More" variant="text" @click="goToChats()">{{ t("channelInfo.messages") }}</v-btn>
    </v-card-actions>
  </v-card>
  <div v-else>
    {{ t("channelInfo.emptySelection") }}
  </div>
</template>
