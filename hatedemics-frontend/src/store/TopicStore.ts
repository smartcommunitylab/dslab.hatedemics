// store/topics/index.ts
import { API } from "@/services";
import type { APIResponse, Sentiment, Topic } from "@/services/types";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useTopicsStore = defineStore("topicsStore", () => {
  const generic = ref<any>({});
  const topics = ref<Topic[]>([]);
  const selectedTopic = ref<Topic | null>(null);
  const selectedChannelTopic = ref<Topic | null>(null);
  
  function getDominantSentiment(sentiments: Record<string, number>): Sentiment {
    const entry = Object.entries(sentiments).sort((a, b) => b[1] - a[1])[0];
    if (!entry) return "neutral";
  
    const [label] = entry;
    if (label === "positive" || label === "negative" || label === "neutral") {
      return label;
    }
    return "neutral"; // fallback
  }
  function initTopics(data: any) {
    if (data)
      generic.value = {
      chat_description: data["chat_description"],
      chat_name: data["chat_name"],
      hs_percentage: data["hs_percentage"],
      cw_percentage: data["cw_percentage"],
      is_checkworthy: data["npw"]["cw"]["is-checkworthy"],
      isnot_checkworthy: data["npw"]["cw"]["isnot-checkworthy"],
      hate: data["npw"]["hs"]["hate"],
      non_hate: data["npw"]["hs"]["non-hate"],
      wordclouds: data["topics"],
    };
    else {
      generic.value = {
        chat_description: "",
        chat_name: "",
      };
    }
    if (data?.topics)
      topics.value = Object.keys(data.topics).map((key) => {

        const topic = data.topics[key];
        const npwData = data.npw?.topics?.[key] ?? {};
    
        return {
          name: topic["topic_label"],
          count_percentage: topic["topic-count_percentage"],
          hs_percentage: topic["topic-hs_percentage"],
          cw_percentage: topic["topic-cw_percentage"],
          npw: npwData["topic-npw"] ?? {},
          hate_npw: npwData["topic-hate_npw"] ?? {},   
          nonhate_npw: npwData["topic-nonhate_npw"] ?? {},
          sentiment_percentage: getDominantSentiment(topic["topic-sentiment_percentage"] ?? {})
        };
      });
        else {
      topics.value = [];
    }
  }

  function selectTopic(topic: Topic|null) {
    selectedTopic.value = topic;
  }

  function unselectTopic() {
    selectedTopic.value = null;
  }

  function getChannelData() {
    return generic.value;
  }

  async function dispatchGetTopics(id: string): Promise<APIResponse<null>> {
    if (!id) {
      return { success: false, content: null, status: 400 };
    }
    try {
      const { status, data } = await API.topics.getTopics(id);
      if (status === 200) {
        initTopics(data);
        return { success: true, content: null };
      }
    } catch (error) {
      const _error = error as AxiosError<string>;
      return { success: false, status: _error.response?.status, content: null };
    }
    return { success: false, content: null, status: 400 };
  }

  return {
    topics,
    generic,
    selectedTopic,
    selectedChannelTopic,
    initTopics,
    selectTopic,
    unselectTopic,
    getChannelData,
    dispatchGetTopics,
  };
}, {
  persist: true});