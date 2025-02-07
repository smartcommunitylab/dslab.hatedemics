// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Channel, ChannelInfo } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useChannelsStore = defineStore("channelsStore", () => {
  const selectedChannelInfo = ref<ChannelInfo>();
  const channelsInfo = ref<ChannelInfo[]>([]);
  const channels = ref<Channel[]>([]);
  const selectedChannel = ref<Channel>();

  function initChannelsInfo(data: ChannelInfo[]) {
    channelsInfo.value = data;
  }
  function initChannels(data: Channel[]) {
    channels.value = data;
  }
  function selectChannelInfo(channel:ChannelInfo){
    selectedChannelInfo.value = channel
    console.log("selected")
  };
  function selectChannel(channel:Channel){
    selectedChannel.value = channel
    console.log("selected")
  };
  
  const unselectChannel = () => (selectedChannelInfo.value = undefined);

  async function dispatchGetChannels(): Promise<APIResponse<null>> {
    try {
      const { status, data } = await API.channels.getChannelsInfo();
      if (status === 200) {
        initChannelsInfo(data);
        return {
          success: true,
          content: null,
        };
      }
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: null,
      };
    }
    return {
      success: false,
      content: null,
      status: 400,
    };
  }

  return {
    channels,
    selectedChannel,
    channelsInfo,
    selectedChannelInfo,
    initChannelsInfo,
    initChannels,
    selectChannel,
    selectChannelInfo,
    unselectChannel,
    dispatchGetChannels,
  };
});