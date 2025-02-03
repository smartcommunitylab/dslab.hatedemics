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
const isExtended: ComputedRef<boolean> = computed(() => (channelsStore?.selectedChannel?.IRI ? true : false));
const goToChats = () => {
  router.push({
    name: 'Inspector',
  })
}
</script>
<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <div>{{ channelsStore.selectedChannel?.id }}</div>
      <p v-if="channelsStore.selectedChannel?.about">
        {{ t("channelInfo.description") }} {{ channelsStore.selectedChannel?.about }}
      </p>
      <p v-if="channelsStore.selectedChannel?.message_count">
        {{ t("channelInfo.nMessages") }}
        {{ channelsStore.selectedChannel?.message_count }}
      </p>
      <p v-if="channelsStore.selectedChannel?.participants_count">
        {{ t("channelInfo.nUsers") }}
        {{ channelsStore.selectedChannel?.participants_count }}
      </p>
      <p v-if="channelsStore.selectedChannel?.language">
        {{ t("channelInfo.languages") }} {{ channelsStore.selectedChannel?.language }}
      </p>
      <p v-if="channelsStore.selectedChannel?.IRI">
        {{ t("channelInfo.iri") }} {{ channelsStore.selectedChannel?.IRI }}
      </p>
      <p v-if="channelsStore.selectedChannel?.sdIRI">
        {{ t("channelInfo.hateSpeech") }} {{ channelsStore.selectedChannel?.sdIRI }}
      </p>
      <p v-if="channelsStore.selectedChannel?.last_queried_at">
        {{ t("channelInfo.lastUpdate") }}
        {{ new Date(channelsStore.selectedChannel?.last_queried_at).toUTCString() }}
      </p>
      <p v-if="channelsStore.selectedChannel?.IRI">
        {{ t("channelInfo.mainTopics") }} {{ channelsStore.selectedChannel?.IRI }}
      </p>
    </v-card-text>

    <v-card-actions v-if="isExtended">
      <v-btn color="deep-purple-accent-4" text="Learn More" variant="text" @click="goToChats()">{{ t("channelInfo.messages") }}</v-btn>
    </v-card-actions>
  </v-card>

</template>
