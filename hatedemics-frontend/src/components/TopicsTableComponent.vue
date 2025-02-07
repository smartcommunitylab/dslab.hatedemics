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
const { t } = useI18n();
const topicsStore = useTopicsStore();
const { topics } = storeToRefs(topicsStore)

// const topics = ref<any[]>([]);
const router = useRouter();
const search = ref("");
const headers = reactive<any[]>([
  { title: "ID", key: "id" },
  { title: "Topics", key: "topic" },
  {title:"% in the channel",key:"presence"},
  {title:"% hate in the topic",key:"hate"},
]);
const handleClick = ( row:any) =>{
  console.log("Clicked item: ", row) 
  
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
        <v-data-table :headers="headers" :items="topics" :search="search">
          <template v-slot:item="props">
            <tr
              @click="handleClick(props.item)"
            >
              <td class="text-xs-right">{{ props.item.id }}</td>
              <td class="text-xs-right">{{ props.item.topic }}</td>
              <td class="text-xs-right">{{ props.item.presence }}</td>
              <td class="text-xs-right">{{ props.item.hate }}</td>
            </tr>
          </template>
        </v-data-table>
</v-container>
</template>
