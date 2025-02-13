// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Message } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMessagesStore = defineStore("messagesStore", () => {

  const messages = ref<Message[]>([]);

  function initMessages(data: Message[]) {
    messages.value = data;
  }


  async function dispatchGetMessages(): Promise<APIResponse<null>> {
    try {
      
      const { status, data } = await API.chats.getChats(1);
      if (status === 200) {
        // initChannels(data.content);
        initMessages(data);
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
    messages,
    initMessages,
    dispatchGetMessages,
  };
});