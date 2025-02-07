// store/topics/index.
import { API } from "@/services";
import type { APIResponse, Topic } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useTopicsStore = defineStore("topicsStore", () => {
  const topics = ref<Topic[]>([]);
  const selectedTopic = ref<Topic>();
  function initTopics(data: Topic[]) {
    topics.value = data;
  }

  function selectTopic(channel:Topic){
    selectedTopic.value = channel
    console.log("selected")
  };
  
  const unselectTopic = () => (selectedTopic.value = undefined);

  async function dispatchGetTopics(id:string): Promise<APIResponse<null>> {
    try {
        //TODO
      const { status, data } = await API.topics.getTopics(id);
      if (status === 200) {
        initTopics(data);
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
    topics,
    selectedTopic,
    initTopics,
    selectTopic,
    unselectTopic,
    dispatchGetTopics,
  };
});