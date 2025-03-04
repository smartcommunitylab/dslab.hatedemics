<script setup lang="ts">
import { ref, computed } from "vue";
import useWordCloud from "./useWordCloud";
import { storeToRefs } from "pinia";
import { useTopicsStore } from "@/store/TopicStore";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const { Vue3WordCloud } = useWordCloud();
const topicsStore = useTopicsStore();
const { topics, selectedTopic } = storeToRefs(topicsStore);

const selectionType = ref<"channel" | "topic">("channel");
const selectedChannelView = ref<"hate" | "checkworthy" | "generic">("hate");

const typeItems = [
  { label: "Hate vs Non-Hate", value: "hate" },
  { label: "Checkworthy vs Non-Checkworthy", value: "checkworthy" },
  { label: "Generic WordCloud", value: "generic" },
];

const extractWords = (data: any, key: string) =>
  Object.entries(data[key] || {}).map(([word, weight]) => [word, weight]);

const channelData = computed(() => topicsStore.getChannelData());

const wordsNegative = computed(() => {
  if (selectionType.value === "topic" && selectedTopic.value) {
    return extractWords(selectedTopic.value, "npw");
  }
  topicsStore.selectTopic(null);
  const keyMap = {
    hate: "hate",
    checkworthy: "is_checkworthy",
    generic: "wordcloud",
  };

  if (selectedChannelView.value === "generic") {
    return extractWords(
      {
        ...(({ wordclouds, ...rest }) => rest)(channelData.value),
        wordcloud: Object.values(channelData.value.wordclouds || {}).reduce(
          (acc: any, topic: any) => {
            if (!topic["topic_label"]) return acc;
            acc[topic["topic_label"]] = topic["topic-count"];
            return acc;
          },
          {}
        ),
      },
      "wordcloud"
    );
  }
  return extractWords(channelData.value, keyMap[selectedChannelView.value]);
});

const wordsPositive = computed(() => {
  const keyMap = {
    hate: "non_hate",
    checkworthy: "isnot_checkworthy",
    generic: "generic_wordcloud",
  };
  return selectionType.value === "channel" && keyMap[selectedChannelView.value]
    ? extractWords(channelData.value, keyMap[selectedChannelView.value])
    : [];
});

const maxWeight = computed(() => {
  const allWeights = [...wordsNegative.value.map(([, weight]) => weight),...wordsPositive.value.map(([, weight]) => weight)];
  return allWeights.length > 0 ? Math.max(...(allWeights as number[])) : 1;
});

const getWordColor = ([, weight]: [string, number]) => {
  const normalizedWeight = maxWeight.value > 0 ? weight / maxWeight.value : 0;
  return `rgb(${Math.floor(255 * normalizedWeight)}, ${Math.floor(
    100 * normalizedWeight
  )}, 0)`;
};

const onWordClick = (word: string) => console.log(word);
</script>

<template>
  <v-radio-group v-model="selectionType" inline>
    <v-radio label="Canale" value="channel" />
    <v-radio label="Topic" value="topic" />
  </v-radio-group>

  <div v-if="selectionType === 'channel'">
    <v-select v-model="selectedChannelView" :items="typeItems" item-title="label" item-value="value" label="Seleziona tipo WordCloud" />
    <div class="wordcloud-container">
      <vue3-word-cloud
        v-if="wordsPositive.length"
        :words="wordsPositive"
        :font-family="'Love Ya Like A Sister, serif'"

        :color="getWordColor"
        @click="onWordClick"
      />

      <vue3-word-cloud
        v-if="wordsNegative.length"
        :words="wordsNegative"
        :font-family="'Love Ya Like A Sister, serif'"

        :color="getWordColor"
        @click="onWordClick"
      />
    </div>
  </div>

  <div v-else>
    <v-select label="Seleziona un topic" v-model="selectedTopic" :items="topics" item-title="name" return-object />
    <div class="wordcloud-container">
    <vue3-word-cloud v-if="wordsNegative.length" :font-family="'Love Ya Like A Sister, serif'"
    :words="wordsNegative" :color="getWordColor" @click="onWordClick" />
    </div>
  </div>
</template>

<style scoped>
.wordcloud-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 400px;
}
</style>
