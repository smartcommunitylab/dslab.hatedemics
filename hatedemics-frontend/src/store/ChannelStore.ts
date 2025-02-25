// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Channel, ChannelInfo } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useChatsStore } from "./ChatStore";
import { useTopicsStore } from "./TopicStore";

export const useChannelsStore = defineStore("channelsStore", () => {
  const selectedChannelInfo = ref<ChannelInfo>();
  const channelsInfo = ref<ChannelInfo[]>([]);
  const selectedLanguage = ref<string>('IT');
  const chatStore = useChatsStore();
  const topicStore = useTopicsStore();
  const sort = ref<any>({ key: "iri", order: "desc" });

  function processingChannelInfo(data: ChannelInfo[]) {
    return data.map((item) => {
      return {

        ...item,
        linked_chats_ids: item.linked_chats_ids
          ? JSON.parse(item.linked_chats_ids.replace(/'/g, '"'))
          : []

      };
    })
  }
  function initChannelsInfo(data: ChannelInfo[]) {
    channelsInfo.value = processingChannelInfo(data);
  }
  function selectOrder(key: string, order: string) {
    sort.value = { key: key, order: order };
  }
  function selectChannelInfo(channel: ChannelInfo) {
    selectedChannelInfo.value = channel
    chatStore.initChats([
      { id: channel.id },
      ...(
        channel.linked_chats_ids.length > 0
          ? channel.linked_chats_ids.map((id: any) => ({ id }))
          : []
      )
    ]); 
    chatStore.selectChat(channel.id);
    topicStore.dispatchGetTopics(channel.id);
    console.log("selected")
  };

  function selectLanguage(language: string) {
    selectedLanguage.value = language;
  }
  // function selectChannel(channel:Channel){
  //   selectedChannel.value = channel
  //   console.log("selected")
  // };

  const unselectChannel = () => (selectedChannelInfo.value = undefined);

  async function dispatchGetChannels({ page = 0, size = 10, sort = "IRI,desc" }): Promise<APIResponse<null>> {
    try {
      const { status, data } = await API.channels.getChannelsInfo(selectedLanguage.value!, {
        page, size, sort
      });
      if (status === 200) {
        initChannelsInfo(data.content);
        return { success: true, total: data.totalElements, content: data.content };
      } else {
        return { success: false, status: status, content: null };
      }
    } catch (error) {
      const _error = error as AxiosError<string>;
      return { success: false, status: _error.response?.status, content: null };
    }
  }

  return {
    // channels,
    // selectedChannel,
    channelsInfo,
    selectedChannelInfo,
    selectedLanguage,
    sort,
    selectOrder,
    selectLanguage,
    initChannelsInfo,
    // initChannels,
    // selectChannel,
    selectChannelInfo,
    unselectChannel,
    dispatchGetChannels,
  };
});