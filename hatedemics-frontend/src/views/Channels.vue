<script setup lang="ts">
import { ref, reactive } from "vue";
// import GraphComponent from '@/components/GraphComponent.vue';
import GraphComponent from "@/components/GraphComponent.vue";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";
import { onMounted } from "vue";
import { useChannelsStore } from "../store/ChannelStore";
import { useI18n, type Locale } from "vue-i18n";
import { useConfig } from "@/store";
import { watch } from 'vue'
import { storeToRefs } from "pinia";
import type { ChannelInfo } from "@/services/types";
const { t } = useI18n();
const msg = ref("");
const search = ref("");
const languages= [{language:'Italiano',value:'IT'},{language:'English',value:'EN'},{language:'Espanol',value:'ES'}]
const channelsStore = useChannelsStore();
const channels = ref<any[]>([]);
const configStore = useConfig();
const { selectedChannelInfo } = storeToRefs(channelsStore)
  const selectedLanguage = ref<string>();

const headers = reactive<any[]>([
  { title: t("channelTable.header.id"), key: "id" },
  { title: t("channelTable.header.messages"), key: "count" },
  {title:t("channelTable.header.partecipants"),key:"participants_count"},
  {title:t("channelTable.header.IRI"),key:"IRI"},
]);

const updateGrap = (lang:string) => {
  console.log('change file of channels and reload everything '+lang)
};
const handleClick = ( item:ChannelInfo) =>{
  console.log("Clicked item: ", item)
  channelsStore.selectChannelInfo(item)
}
watch(selectedChannelInfo, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
  })
onMounted(async () => {
  const { success, status } = await channelsStore.dispatchGetChannels();
//add info of number
 msg.value=t("channel.title")
  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  } else {
    channels.value = channelsStore.channelsInfo?.map((item:ChannelInfo) => ({
      id: item.id,
      count: item.message_count,
      participants_count:item.participants_count,
      IRI:item.IRI
    }));
    console.log(channelsStore.channels);
  }
  selectedLanguage.value = languages[0].value;
});
</script>

<template>
  <v-container :fluid="true">
    <v-row>
      <v-col cols="8">
        <h1>{{ msg }}</h1>
        <v-select
          label="Language"
          v-model="selectedLanguage"
          :items="languages"
          item-title="language"
          item-value="value"
          @update:model-value="updateGrap"
        >
        </v-select>
        <GraphComponent />
      </v-col>
      <v-col cols="4">
        <h1>info</h1>
        <ChannelInfoComponent />
      </v-col>
    </v-row>
    <v-row
      ><v-col
        ><v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-data-table :headers="headers" :items="channels" :search="search" return-object>
          <template v-slot:item="props">
            <tr
              @click="handleClick(props.item)"
              :class="{ selected: props.item.id === selectedChannelInfo?.id }"
            >
              <td class="text-xs-right">{{ props.item.id }}</td>
              <td class="text-xs-right">{{ props.item.participants_count }}</td>
              <td class="text-xs-right">{{ props.item.count }}</td>
              <td class="text-xs-right">{{ props.item.IRI }}</td>
            </tr>
          </template>
        </v-data-table></v-col
      ></v-row
    >
  </v-container>
</template>
<style scoped>
.selected {
  background: rgb(var(--v-theme-secondary)) !important;
}
</style>
