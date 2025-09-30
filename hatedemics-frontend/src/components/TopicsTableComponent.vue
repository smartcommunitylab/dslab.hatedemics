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
const headers = computed(() => [
  { title: t('topicsTable.header.title'), key: "name" },
  { title: t('topicsTable.header.count'), key: "count_percentage"   },
  {title:t('topicsTable.header.cw'),key:"cw_percentage"  },
  {title:t('topicsTable.header.hs'),key:"hs_percentage"  },
  {title:t('topicsTable.header.sentiment_percentage'),key:"sentiment_percentage"  },
]);
const handleClick = ( item:Topic) =>{
  // console.log("Clicked item: ", row)
  topicsStore.selectTopic(item)

}
type SortItem = { key: string; order: boolean | "desc" | "asc" | undefined };

const sortBy = ref<SortItem[]>([{ key: "hs_percentage", order: "desc" }]);
  const sentimentToEmoji = (sentiment: "positive" | "negative" | "neutral") => {
  switch (sentiment) {
    case "positive":
      return { icon: "mdi-emoticon-happy", color: "green" };
    case "negative":
      return { icon: "mdi-emoticon-angry", color: "red" };
    case "neutral":
    default:
      return { icon: "mdi-emoticon-neutral", color: "orange" };
  }
};
</script>
<template>
  <v-container>
    <!-- {{ t("topicsTable.title") }}
          <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field> -->
    <v-data-table
      :headers="headers"
      :items="topics"
      :search="search"
      v-model:sort-by="sortBy"
      return-object
      density="compact"
      hover
      hide-default-footer
    >
      <template #top>
        <div class="px-4 py-2">
          <h3 class="text-h6 mb-1 text-center">
            <v-icon>mdi-comment-text</v-icon> {{ t("topicsTable.title") }}
          </h3>
        </div>
      </template>
      <template v-slot:item="props">
        <tr
          @click="handleClick(props.item)"
          :class="{ selected: props.item.name === selectedTopic?.name }"
          class="hover-row"
        >
          <td class="text-xs-right text-center">{{ props.item.name }}</td>
          <td class="text-xs-right text-center">{{ props.item.count_percentage }}</td>
          <td class="text-xs-right text-center">{{ props.item.cw_percentage }}</td>
          <td class="text-xs-right text-center">{{ props.item.hs_percentage }}</td>
          <td class="text-xs-right text-center">
            <v-icon :color="sentimentToEmoji(props.item.sentiment_percentage).color">
              {{ sentimentToEmoji(props.item.sentiment_percentage).icon }}
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
<style scoped>
/* Selezione riga tabella */
.selected {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  transition: background 0.2s;
}

/* Hover sulla tabella */
.hover-row:hover {
  /* background-color: var(--v-theme-surface-lighten-2) !important; */
  cursor: pointer;
}
</style>
