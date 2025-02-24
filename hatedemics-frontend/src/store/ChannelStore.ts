// store/channels/index.
import { API } from "@/services";
import type { APIResponse, Channel, ChannelInfo } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useChatsStore } from "./ChatStore";
 
export const useChannelsStore = defineStore("channelsStore", () => {
  const selectedChannelInfo = ref<ChannelInfo>();
  const channelsInfo = ref<ChannelInfo[]>([]);
  const selectedLanguage = ref<string>('IT');
  const chatStore = useChatsStore();
  const sort = ref<any>({ key: "iri", order: "desc"}); 
  function initChannelsInfo(data: ChannelInfo[]) {
    channelsInfo.value = data;
  }
  function selectOrder(key:string,order:string) {
    sort.value = { key: key, order: order};
  }
  function selectChannelInfo(channel:ChannelInfo){
    selectedChannelInfo.value = channel
    chatStore.initChats([{id:channel.id},{id:channel.linked_chats_ids}])
    chatStore.selectChat({id:channel.linked_chats_ids});
    console.log("selected")
  };
  
  function selectLanguage(language:string){
    selectedLanguage.value = language;
  }
  // function selectChannel(channel:Channel){
  //   selectedChannel.value = channel
  //   console.log("selected")
  // };
  
  const unselectChannel = () => (selectedChannelInfo.value = undefined);

  async function dispatchGetChannels({ page = 0, size = 10, sort = "IRI,desc" }): Promise<APIResponse<null>> {
    try {
      const { status, data } = await API.channels.getChannelsInfo(selectedLanguage.value!,{
        page, size, sort 
      });
      if (status === 200) {
        initChannelsInfo(data.content);
        return { success: true, total: data.totalElements, content: data.content };
      } else {
        return { success: false, status: status,content: null };
      }
    } catch (error) {
      const _error = error as AxiosError<string>;
      return { success: false, status: _error.response?.status, content: null};
    }
    //   if (status === 200) {
    //     initChannelsInfo(data);
    //     return {
    //       success: true,
    //       content: null,
    //     };
    //   }
    // } catch (error) {
    //   const _error = error as AxiosError<string>;
    //   return {
    //     success: false,
    //     status: _error.response?.status,
    //     content: null,
    //   };
    // }
    return {
      success: false,
      content: null,
      status: 400,
    };
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