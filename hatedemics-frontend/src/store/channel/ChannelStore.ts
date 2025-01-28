// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Channel } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useChannelsStore = defineStore("channelsStore", () => {

  const channels = ref<Channel[]>([]);

  function initChannels(data: Channel[]) {
    channels.value = data;
  }


  async function dispatchGetChannels(): Promise<APIResponse<null>> {
    try {
      const { status, data } = await API.channels.getChannels();
      if (status === 200) {
        // initChannels(data.content);
        initChannels(data);
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
    initChannels,
    dispatchGetChannels,
  };
});