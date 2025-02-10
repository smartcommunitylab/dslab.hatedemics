<script setup lang="ts">
import { ref } from 'vue';
import useWordCloud from './useWordCloud'
const { Vue3WordCloud } = useWordCloud();

const words = ref([['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]])
const onWordClick = function(word:string) {
				console.log(word)
			}
</script>
<template>
<vue3-word-cloud :words="words">
  <template v-slot:name="{text, weight, word}">
    <div :title="weight" style="cursor: pointer;" @click="onWordClick(word)">
      {{ text }}
    </div>
  </template>
</vue3-word-cloud>
</template>