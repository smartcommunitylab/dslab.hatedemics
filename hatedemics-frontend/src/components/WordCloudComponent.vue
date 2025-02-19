<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useWordCloud from "./useWordCloud";
import { useTopicsStore } from "@/store/TopicStore";
import { storeToRefs } from "pinia";
const { Vue3WordCloud } = useWordCloud();
const topicsStore = useTopicsStore();
const { topics, selectedTopic } = storeToRefs(topicsStore);
const words = ref<any>([]);
const typeItems = ref([
  { type: "npw", value: "npw" },
  { type: "hate npw", value: "hate_npw" },
  { type: "nonhate npw", value: "nonhate_npw" },
]);
const selectedType = ref<string>(typeItems.value[0].value);
const onWordClick = function (word: string) {
  console.log(word);
};
watch(selectedTopic, (newValue,oldValue) => {
    console.log('selectedTopic',newValue)
    updateWords();
  })
const updateTopic = () => {
  if (!selectedTopic?.value) return;
  topicsStore.selectTopic(selectedTopic.value);

  updateWords();
};
const updateTypes = () => {
  if (!selectedType?.value) return;
  if (!selectedTopic?.value) return;
  updateWords();
};

function updateWords() {
  if (!selectedType?.value) return;
  if (!selectedTopic?.value) return;
  words.value = Object.keys((selectedTopic.value as any)[selectedType.value]).map(
    function (key: string) {
      return [key, (selectedTopic.value as any)[selectedType.value!][key]];
    }
  );
}
onMounted(async () => {
  if (!selectedTopic?.value && topics.value.length > 0) {
    topicsStore.selectTopic(topics.value[0]);
  }

})
</script>
<template>
  <v-select
    return-object
    label="topics"
    v-model="selectedTopic"
    :items="topics"
    item-title="name"
    @update:model-value="updateTopic"
  ></v-select>
  <v-select
    label="type"
    v-model="selectedType"
    :items="typeItems"
    item-title="type"
    @update:model-value="updateTypes"
  ></v-select>
  <vue3-word-cloud
  :animation-duration="1000"
  :animation-easing="'linear'"
  :animation-overlap="1 / 5"
  onmouseover=""
  :color="([, weight]: [string, number]) => {
  const red = Math.floor(255 * weight);
  const orange = Math.floor(100 * weight);
  return `rgb(${red}, ${orange}, 0)`; // Aggiunge un po' di giallo per virare verso l'arancione
}"
:font-family="'Love Ya Like A Sister, serif'"
:enter-animation="'animated bounceIn'"
  :font-size-ratio="0"
  :leave-animation="'animated hinge'"
  :words="words"
>
    <template v-slot:name="{ text, weight, word }">
      <div :title="weight" style="cursor: pointer" @click="onWordClick(word)" >
        {{ text }}
      </div>
    </template>
  </vue3-word-cloud>
</template>
