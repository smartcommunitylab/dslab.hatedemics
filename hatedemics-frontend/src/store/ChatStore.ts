// store/Chats/index.
import { API } from "@/services";
import type { APIResponse, Chat } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useChatsStore = defineStore("chatsStore", () => {
  
  const chats = ref<Chat[]>([]);
  const selectedChat = ref<Chat>();

  
  function initChats(data: Chat[]) {
    chats.value = data;
  }
  
  function selectChat(chat:Chat){
    selectedChat.value = chat
    console.log("selected")
  };
  
  const unselectChat = () => (selectedChat.value = undefined);

  async function dispatchGetChats(): Promise<APIResponse<null>> {
    try {
      //TODO
      const { status, data } = await API.chats.getChats(0);
      if (status === 200) {
        // initChats(data.content);
        initChats(data);
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
    chats,
    selectedChat,
    initChats,
    selectChat,
    unselectChat,
    dispatchGetChats,
  };
});