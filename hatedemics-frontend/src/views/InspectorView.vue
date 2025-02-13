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
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";
import SideBarInfoComponent from "@/components/SideBarInfoComponent.vue"
import { useRouter } from 'vue-router';
const router = useRouter();
const { t } = useI18n();
const channelsStore = useChannelsStore();
const chatStore = useChatsStore();
const topicsStore = useTopicsStore();
// const selectedChannelInspect = ref<ChannelInfo>();
const msg = ref<string>();
// const selectedChatInspect = ref<Chat>();
  const { selectedChannelInfo, channelsInfo } = storeToRefs(channelsStore);
  const { selectedChat, chats } = storeToRefs(chatStore);
  const { selectedTopic, topics } = storeToRefs(topicsStore);

onMounted(async () => {
  // if (!selectedChannelInfo.value) {
  //   sele
  // }
  const { success, status } = await topicsStore.dispatchGetTopics("id");
  //add info of number
  msg.value = t("inspect.title");
  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  } else {
    // topics.value = topicsStore.topics?.map((item: Topic,index:number) => ({
    //   id: index,
    //   name: item.name,
    //   count_percentage: item.count_percentage,
    //   hs_percentage: item.hs_percentage,
    //   cw_percentage:item.cw_percentage,
    // }));
    // console.log(topicsStore.topics);
  }
});

const updateChannel = (channel: ChannelInfo) => {
  channelsStore.selectChannelInfo(channel);
};
const updateChat = (chat: Chat) => {
  console.log(chat);
};
const goToChats = () => {
  router.push({ name: 'Discussion' }) 

}
</script>

<template>
  <v-container :fluid="true">
    <h1>{{ msg }}</h1>
    <v-row>
      <v-col>
        <v-autocomplete
          return-object
          label="channels"
          v-model="selectedChannelInfo"
          :items="channelsInfo"
          item-title="id"
          item-value="id"
          @update:model-value="updateChannel"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-select
          label="chats"
          v-model="selectedChat"
          :items="chats"
          item-title="id"
          item-value="id"
          @update:model-value="updateChat"
        ></v-select>
      </v-col>
      <v-col>
        <v-btn color="primary" text="Learn More" variant="text" @click="goToChats()">{{ t("channelInfo.messages") }}</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
      <SideBarInfoComponent :actions="false"/>
      </v-col>
      <v-col  cols="6">
        <TopicsTableComponent />
      </v-col>
      <v-col cols="4">
        <WordCloudComponent />
      </v-col>
    </v-row>
  </v-container>
</template>
