<script setup lang="ts">
import {
  computed,

  type ComputedRef,

} from 'vue';import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
const { t } = useI18n();
const channelsStore = useChannelsStore();
const router = useRouter();
const isExtended: ComputedRef<boolean> = computed(() => (channelsStore?.selectedChannelInfo?.IRI ? true : false));
const goToChats = () => {
  router.push({
    name: 'Inspector',
  })
}
</script>
<template>
  <v-card class="mx-auto" max-width="344" v-if="channelsStore.selectedChannel">
    <v-card-text>
      <div>{{ channelsStore.selectedChannelInfo?.id }}</div>
      <p v-if="channelsStore.selectedChannelInfo?.about">
        {{ t("channelInfo.description") }} {{ channelsStore.selectedChannelInfo?.about }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.message_count">
        {{ t("channelInfo.nMessages") }}
        {{ channelsStore.selectedChannelInfo?.message_count }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.participants_count">
        {{ t("channelInfo.nUsers") }}
        {{ channelsStore.selectedChannelInfo?.participants_count }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.language">
        {{ t("channelInfo.languages") }} {{ channelsStore.selectedChannelInfo?.language }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.IRI">
        {{ t("channelInfo.iri") }} {{ channelsStore.selectedChannelInfo?.IRI }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.sdIRI">
        {{ t("channelInfo.hateSpeech") }} {{ channelsStore.selectedChannelInfo?.sdIRI }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.last_queried_at">
        {{ t("channelInfo.lastUpdate") }}
        {{ new Date(channelsStore.selectedChannelInfo?.last_queried_at).toUTCString() }}
      </p>
      <p v-if="channelsStore.selectedChannelInfo?.IRI">
        {{ t("channelInfo.mainTopics") }} {{ channelsStore.selectedChannelInfo?.IRI }}
      </p>
    </v-card-text>

    <v-card-actions v-if="isExtended">
      <v-btn color="deep-purple-accent-4" text="Learn More" variant="text" @click="goToChats()">{{ t("channelInfo.messages") }}</v-btn>
    </v-card-actions>
  </v-card>
  <div v-else>
    {{ t("channelInfo.emptySelection") }}
  </div>

</template>
