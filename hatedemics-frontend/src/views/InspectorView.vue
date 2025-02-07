<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import WordCloudComponent from "@/components/WordCloudComponent.vue";
import TopicsTableComponent from "@/components/TopicsTableComponent.vue";
import ChatInfoComponent from "@/components/ChatInfoComponent.vue";
import { storeToRefs } from "pinia";
import type { Channel, ChannelInfo, Chat, Topic } from "@/services/types";
import { useI18n } from "vue-i18n";
import { useTopicsStore } from "@/store/TopicStore";
import { useChannelsStore } from "@/store/ChannelStore";
import { useChatsStore } from "@/store/ChatStore";
const { t } = useI18n();
const channelsStore = useChannelsStore();
const topicsStore = useTopicsStore();
const selectedChannelInspect = ref<ChannelInfo>();
const msg = ref<string>();
const selectedChatInspect = ref<Chat>();
  const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
  const { selectedTopic, topics } = storeToRefs(topicsStore);
const chats = ref<Chat[]>([]);

onMounted(async () => {
  const { success, status } = await topicsStore.dispatchGetTopics("id");
  //add info of number
  msg.value = t("inspect.title");
  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  } else {
    topics.value = topicsStore.topics?.map((item: Topic) => ({
      id: item.id,
      presence: item.presence,
      hate: item.hate,
      topic: item.topic,
    }));
    console.log(topicsStore.topics);
  }
});

const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
};
const updateChat = (chat: Chat) => {
  console.log(chat);
};
</script>

<template>
  <v-container>
    <h1>{{ msg }}</h1>
    <v-row>
      <v-col>
        <v-autocomplete
          label="channels"
          v-model="selectedChannelInspect"
          :items="channelsInfo"
          item-title="id"
          item-value="id"
          @update:model-value="updateChannel"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-select
          label="chats"
          v-model="selectedChatInspect"
          :items="chats"
          item-title="chat"
          item-value="chat"
          @update:model-value="updateChat"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ChatInfoComponent />
      </v-col>
      <v-col>
        <TopicsTableComponent />
      </v-col>
      <v-col>
        <WordCloudComponent />
      </v-col>
    </v-row>
  </v-container>
</template>
