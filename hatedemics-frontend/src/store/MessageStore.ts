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


  // async function dispatchGetChannels({ page = 0, size = 10, sort = "IRI,desc" }): Promise<APIResponse<null>> {
  //   try {
  //     const { status, data } = await API.channels.getChannelsInfo(selectedLanguage.value!, {
  //       page, size, sort
  //     });
  //     if (status === 200) {
  //       initChannelsInfo(data.content);
  //       return { success: true, total: data.totalElements, content: data.content };
  //     } else {
  //       return { success: false, status: status, content: null };
  //     }
  //   } catch (error) {
  //     const _error = error as AxiosError<string>;
  //     return { success: false, status: _error.response?.status, content: null };
  //   }
  // }
  async function dispatchGetMessages(id:string,{ page = 0, size = 10, sort = "date,desc" }): Promise<APIResponse<null>> {
    try {
      
            const { status, data } = await API.chats.getChats(id!, {
              page, size, sort
            });
            if (status === 200) {
        initMessages(data.content);
        return { success: true, total: data.totalElements, content: data.content };
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