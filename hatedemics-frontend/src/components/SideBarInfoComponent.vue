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
  <v-card class="mx-auto" v-if="selectedChannelInfo">
    <v-card-text>
      <p v-if="selectedChannelInfo?.id">
        {{ t("channelInfo.id") }}
        {{ selectedChannelInfo?.id }}
      </p>
      <p v-if="selectedChannelInfo?.message_count">
        {{ t("channelInfo.nMessages") }}
        {{ selectedChannelInfo?.message_count }}
      </p>
      <p v-if="selectedChannelInfo?.participants_count">
        {{ t("channelInfo.nUsers") }}
        {{ selectedChannelInfo?.participants_count }}
      </p>
      <p v-if="selectedChannelInfo?.language">
        {{ t("channelInfo.languages") }} {{ selectedChannelInfo?.language }}
      </p>
      <p v-if="selectedChannelInfo?.IRI">
        {{ t("channelInfo.iri") }} {{ selectedChannelInfo?.IRI }}
      </p>
      <p v-if="selectedChannelInfo?.sdIRI">
        {{ t("channelInfo.hateSpeech") }} {{ selectedChannelInfo?.sdIRI }}
      </p>
      <p v-if="selectedChannelInfo?.last_queried_at">
        {{ t("channelInfo.lastUpdate") }}
        {{ new Date(selectedChannelInfo?.last_queried_at).toUTCString() }}
      </p>
      <p v-if="selectedChannelInfo?.IRI">
        {{ t("channelInfo.mainTopics") }} {{ selectedChannelInfo?.IRI }}
      </p>
    </v-card-text>

  </v-card>
  <div v-else>
    {{ t("channelInfo.emptySelection") }}
  </div>

</template>
