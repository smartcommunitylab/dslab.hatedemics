// store/topics/index.
import { API } from "@/services";
import type { APIResponse, Topic } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useTopicsStore = defineStore("topicsStore", () => {
  const generic =ref<any>({});
  const topics = ref<Topic[]>([]);
  const selectedTopic = ref<Topic>();
  function initTopics(data: any) {
    generic.value['chat_description'] = data["chat_description"];
    generic.value['chat_name'] = data["chat_name"];
    generic.value['hs_percentage'] = data["hs_percentage"];
    generic.value['cw_percentage'] = data["cw_percentage"];
    generic.value['topics']=Object.keys(data.topics).map(function (key) {
      return {
        name: data.topics[key]["topic_label"],
      }});
    topics.value = Object.keys(data.topics).map(function (key) {
      return {
        name: data.topics[key]["topic_label"],
        count_percentage: data.topics[key]["topic-count_percentage"],
        hs_percentage: data.topics[key]["topic-hs_percentage"],
        cw_percentage: data.topics[key]["topic-cw_percentage"],
        npw: data.npw.topics[key]["topic-npw"],
        hate_npw: data.npw.topics[key]["topic-hate_npw"],
        nonhate_npw: data.npw.topics[key]["topic-nonhate_npw"]
      };
    });
  }

  function selectTopic(channel: Topic) {
    selectedTopic.value = channel
    console.log("selected")
  };

  const unselectTopic = () => (selectedTopic.value = undefined);

  async function dispatchGetTopics(id: string): Promise<APIResponse<null>> {
    if (!id) {
      return {
        success: false,
        content: null,
        status: 400,
      };
    }
    try {
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
    generic,
    selectedTopic,
    initTopics,
    selectTopic,
    unselectTopic,
    dispatchGetTopics,
  };
});