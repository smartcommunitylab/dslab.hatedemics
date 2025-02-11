<script setup lang="ts">
import { ref } from 'vue';
import useWordCloud from './useWordCloud'
import { useTopicsStore } from '@/store/TopicStore';
import { storeToRefs } from 'pinia';
const { Vue3WordCloud } = useWordCloud();
const topicsStore = useTopicsStore();
const { topics, selectedTopic } = storeToRefs(topicsStore)
 const words = ref<any>([])
const typeItems = ref([
	{ type: 'npw', value: 'npw' },
	{ type: 'hate npw', value: 'hate_npw' },
	{ type: 'nonhate npw', value: 'nonhate_npw' },
])
const selectedType = ref<string>()
const onWordClick = function(word:string) {
				console.log(word)
			}
const updateTopic = () => {
	if (!selectedTopic?.value) return
		topicsStore.selectTopic(selectedTopic.value)

		updateWords();
}
const updateTypes = () => {
	if (!selectedType?.value) return
	if (!selectedTopic?.value) return
    updateWords();
		
		// words.value = selectedTopic[selectedType.value].map((item: any) => ({ text: item.text, weight: item.weight }))

		//  words.value=[["repubblicani", 0.5524416200254921],
        //             ["\ud83c\udd98", 0.5354438457707251],
        //             ["camera", 0.5335682131193319],
        //             ["\u26a1", 0.4816949226049456],
        //             ["ministro", 0.46293223921875815],
        //             ["senato", 0.39229262141333343],
        //             ["election", 0.3785381322132809],
        //             ["\ud83d\ude20", 0.3447889997603175],
        //             ["uniti", 0.328137235750745],
        //             ["it", 0.3220142301031812]]
}

function updateWords() {
	if (!selectedType?.value) return
	if (!selectedTopic?.value) return
	words.value = Object.keys((selectedTopic.value as  any)[selectedType.value]).map(function (key: string) {
			return [key, (selectedTopic.value as  any)[selectedType.value!][key]]
		 })
}
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
								:animation-overlap="1/5"
                :color="([, weight]: [string, number]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
								:enter-animation="'animated bounceIn'"
								:font-size-ratio="0"
								:leave-animation="'animated hinge'"

								:words="words">
  <template v-slot:name="{text, weight, word}">
    <div :title="weight" style="cursor: pointer;" @click="onWordClick(word)"  >
      {{ text }}
    </div>
  </template>
</vue3-word-cloud>
</template>