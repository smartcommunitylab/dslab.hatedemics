<script setup lang="ts">
import {
  computed,
    reactive,
    ref,
  type ComputedRef,

} from 'vue';import { useTopicsStore } from "../store/TopicStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { Topic } from '@/services/types';
const { t } = useI18n();
const topicsStore = useTopicsStore();
const { topics, selectedTopic } = storeToRefs(topicsStore)

// const topics = ref<any[]>([]);
const router = useRouter();
const search = ref("");
const headers = reactive<any[]>([
  { title: "Title", key: "name" },
  { title: "% in the channel", key: "count_percentage" },
  {title:"% cw",key:"cw_percentage"},
  {title:"% hs",key:"hs_percentage"},
]);
const handleClick = ( item:Topic) =>{
  // console.log("Clicked item: ", row) 
  topicsStore.selectTopic(item)
  
}
</script>
<template>
    <v-container>
        {{ t("topicsTable.title") }}
          <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-data-table :headers="headers" :items="topics" :search="search" return-object>
          <template v-slot:item="props">
            <tr
              @click="handleClick(props.item)"
              :class="{ selected: props.item.name === selectedTopic?.name }"

            >
              <td class="text-xs-right">{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.count_percentage }}</td>
              <td class="text-xs-right">{{ props.item.cw_percentage }}</td>
              <td class="text-xs-right">{{ props.item.hs_percentage }}</td>
            </tr>
          </template>
        </v-data-table>
</v-container>
</template>
<style scoped>
.selected {
  background: rgb(var(--v-theme-secondary)) !important;
}
</style>