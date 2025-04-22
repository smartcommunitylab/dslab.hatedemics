<script setup lang="ts">
import { ref, computed, watch } from "vue";
import useWordCloud from "./useWordCloud";
import { storeToRefs } from "pinia";
import { useTopicsStore } from "@/store/TopicStore";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const { Vue3WordCloud } = useWordCloud();
const topicsStore = useTopicsStore();
const { topics, selectedTopic } = storeToRefs(topicsStore);

const selectionType = ref<"channel" | "topic">("channel");
const selectedChannelView = ref<"hate" | "checkworthy" >("hate");
const keyMapNegative = {
    hate: "hate",
    checkworthy: "is_checkworthy",
  };
  const keyMapPositive = {
    hate: "non_hate",
    checkworthy: "isnot_checkworthy",
  };
const typeItems = [
  { label: t("wordclouds.hate"), value: "hate" },
  { label: t("wordclouds.checkworthy"), value: "checkworthy" },
];

const extractWords = (data: any, key: string) =>
  Object.entries(data[key] || {})
    .sort((a:any, b:any) => b[1] - a[1]) // Ordina per weight decrescente
    .slice(0, 10); // Prendi solo i primi 10 elementi.map(([word, weight]) => [word, weight]);

const channelData = computed(() => topicsStore.getChannelData());

const wordsNegative = computed(() => {
  if (selectionType.value === "topic" && selectedTopic.value) {
    return extractWords(selectedTopic.value, "npw");
  }
  topicsStore.selectTopic(null);


  // if (selectedChannelView.value === "generic") {
  //   return extractWords(
  //     {
  //       ...(({ wordclouds, ...rest }) => rest)(channelData.value),
  //       wordcloud: Object.values(channelData.value.wordclouds || {}).reduce(
  //         (acc: any, topic: any) => {
  //           if (!topic["topic_label"]) return acc;
  //           acc[topic["topic_label"]] = topic["topic-count"];
  //           return acc;
  //         },
  //         {}
  //       ),
  //     },
  //     "wordcloud"
  //   );
  // }
  return extractWords(channelData.value, keyMapNegative[selectedChannelView.value]);
});
watch(selectionType, (newVal) => {
  if (newVal === "channel") {
    selectedTopic.value = null; // Deseleziona il topic
  } else if (topics.value.length > 0) {
    // Seleziona il topic con il valore più alto di hs_percentage
    selectedTopic.value = topics.value.reduce(
      (maxTopic, topic) =>
        topic.hs_percentage > maxTopic.hs_percentage ? topic : maxTopic,
      topics.value[0]
    ); // Usa il primo elemento come valore iniziale
  }
});
watch(selectedTopic, (newVal) => {
  if (newVal && selectionType.value === "channel") {
    selectionType.value = "topic";
  }
});
const wordsPositive = computed(() => {

  return selectionType.value === "channel" && keyMapPositive[selectedChannelView.value]
    ? extractWords(channelData.value, keyMapPositive[selectedChannelView.value])
    : [];
});

const maxWeight = computed(() => {
  const allWeights = [
    ...wordsNegative.value.map(([, weight]) => weight),
    ...wordsPositive.value.map(([, weight]) => weight),
  ];
  return allWeights.length > 0 ? Math.max(...(allWeights as number[])) : 1;
});

const getWordColor = ([, weight]: [string, number]) => {
  const normalizedWeight = maxWeight.value > 0 ? weight / maxWeight.value : 0;
  return `rgb(${Math.floor(255 * normalizedWeight)}, ${Math.floor(
    100 * normalizedWeight
  )}, 0)`;
};
const getTitle = (type: "hate" | "checkworthy" , isNegative: boolean): string => {
  const keyMap = isNegative ? keyMapNegative : keyMapPositive;
  return keyMap[type] ? t(`wordclouds.titles.${keyMap[type]}`) : "WordCloud";
};
const onWordClick = (word: string) => console.log(word);
</script>

<template>
  <v-radio-group v-model="selectionType" inline>
    <v-radio :label="t('wordclouds.channel')" value="channel" />
    <v-radio label="Topic" value="topic" />
  </v-radio-group>

  <div v-if="selectionType === 'channel'">
    <v-select
      v-model="selectedChannelView"
      :items="typeItems"
      item-title="label"
      item-value="value"
      :label= "t('wordclouds.select')"
    />
    <div v-if="wordsPositive.length" class="wordcloud-container bordered">
  <v-typography class="text-h5 title text-error">
    {{ getTitle(selectedChannelView, false) }}
  </v-typography>
  <vue3-word-cloud
    v-if="wordsPositive.length"
    :words="wordsPositive"
    :color="getWordColor"
    @click="onWordClick"
  />
</div>

<div v-if="wordsNegative.length" class="wordcloud-container bordered">
  <v-typography class="text-h5 title text-error">
    {{ getTitle(selectedChannelView, true) }}
  </v-typography>
  <vue3-word-cloud
    v-if="wordsNegative.length"
    :words="wordsNegative"
    :color="getWordColor"
    @click="onWordClick"
  />
</div>
    </div>

  <div v-else>
    <v-select
      :label="t('wordclouds.selectTopic')"
      v-model="selectedTopic"
      :items="topics"
      item-title="name"
      return-object
    />
    <div class="wordcloud-container">
      <vue3-word-cloud
        v-if="wordsNegative.length"
        :words="wordsNegative"
        :color="getWordColor"
        @click="onWordClick"
      />
    </div>
  </div>
</template>

<style scoped>
.wordcloud-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 200px;
padding: 20px;
background-color: #ffffff;

}
/* .title {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
} */
/* .wordcloud-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
} */

.bordered {
  border: 2px solid #ddd; /* Bordo sottile grigio */
  border-radius: 8px; /* Angoli leggermente arrotondati */
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1); /* Leggera ombra */
}

.title {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px; /* Distanza tra titolo e wordcloud */
  border-bottom: 2px solid #ff5252; /* Sottolineatura */
  padding-bottom: 5px;
  text-align: center;
  width: 100%;
}
</style>
