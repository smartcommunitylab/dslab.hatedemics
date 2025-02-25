// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Channel, ChannelInfo } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useChatsStore } from "./ChatStore";
import { useTopicsStore } from "./TopicStore";
import { id } from "vuetify/locale";
import { processingChannelInfo, processingSingleChannelInfo } from "@/services/utility";
export const useChannelsStore = defineStore("channelsStore", () => {
  const selectedChannelInfo = ref<ChannelInfo>();
  const channelsInfo = ref<ChannelInfo[]>([]);
  const selectedLanguage = ref<string>('IT');
  const chatStore = useChatsStore();
  const topicStore = useTopicsStore();
  const sort = ref<any>({ key: "iri", order: "desc" });

  
  function initChannelsInfo(data: ChannelInfo[]) {
    channelsInfo.value = processingChannelInfo(data);
  }
  function selectOrder(key: string, order: string) {
    sort.value = { key: key, order: order };
  }
  async function selectChannelInfo(channel: ChannelInfo|string) {
    if (typeof channel === "string") {
      let response  =await dispatchGetChannel(channel);
      if (!response.success) return
    } else {
      const processedChannel = Array.isArray(channel.linked_chats_ids) ? channel : processingSingleChannelInfo(channel);
    selectedChannelInfo.value = processedChannel; 
    chatStore.initChats([
      { id: processedChannel.id },
      ...(
        processedChannel.linked_chats_ids.length > 0
          ? processedChannel.linked_chats_ids.map((id: any) => ({ id }))
          : []
      )
    ]); 
    chatStore.selectChat(processedChannel.id);
    topicStore.dispatchGetTopics(processedChannel.id);
    console.log("selected")
  }
  };

  function selectLanguage(language: string) {
    selectedLanguage.value = language;
  }
  // function selectChannel(channel:Channel){
  //   selectedChannel.value = channel
  //   console.log("selected")
  // };

  const unselectChannel = () => (selectedChannelInfo.value = undefined);

  async function dispatchGetChannel(id: string): Promise<APIResponse<null>> {
    try {
      const { status, data } = await API.channels.getChannel(id);
      if (status === 200) {
        selectChannelInfo(data);
        return { success: true, content: null };
      } else {
        return { success: false, status: status, content: null };
      }
    }
    catch (error) {
      const _error = error as AxiosError<string>;
      return { success: false, status: _error.response?.status, content: null };
    }
  }
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
    dispatchGetChannel
  };
});