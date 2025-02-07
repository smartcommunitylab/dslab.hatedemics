<script setup lang="ts">
import { ref } from 'vue';

const words = ref([['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]])
const onWordClick = function(word:string) {
				console.log(word)
			}
</script>
<template>
<vue-word-cloud :words="words">
  <template v-slot="props">
  <div v-if="props">
    <div :title="props.weight" style="cursor: pointer;" @click="onWordClick(props.word)">
      {{ props.text }}
    </div>
  </div>
  </template>
</vue-word-cloud>
</template>