<script setup lang="ts">
import { ref, reactive } from "vue";
// import GraphComponent from '@/components/GraphComponent.vue';
import GraphComponent from "@/components/GraphComponent.vue";
import ChannelInfoComponent from "@/components/ChannelInfoComponent.vue";
const msg = ref("Hello from Channels");
const search = ref("");
import { onMounted } from "vue";
import { useChannelsStore } from "../store/ChannelStore";
import type { Channel } from "@/services/types";
import { useI18n, type Locale } from "vue-i18n";
import { useConfig } from "@/store";
import { watch } from 'vue'
import { storeToRefs } from "pinia";

const languages= [{language:'Italiano',value:'IT'},{language:'English',value:'EN'},{language:'Espanol',value:'ES'}]
const { t } = useI18n();
const channelsStore = useChannelsStore();
const channels = ref<any[]>([]);
const configStore = useConfig();
const { selectedChannel } = storeToRefs(channelsStore)
  const selectedLanguage = ref<string>();

const headers = reactive<any[]>([
  { title: "ID", key: "id" },
  { title: "# messages", key: "count" },
  {title:"# partecipants",key:"participants_count"},
  {title:"# expanded",key:"IRI"},
]);

const updateGrap = (lang:string) => {
  console.log('change file of channels and reload everything '+lang)
};
const handleClick = ( row:any) =>{
  console.log("Clicked item: ", row)
  channelsStore.selectChannel(channelsStore.channels.filter(c => {
          console.log(c);
          return c.id === row.id})[0])
}
watch(selectedChannel, (newValue,oldValue) => {
    console.log('selectedNode',newValue)
    // if (newValue)
    //   graph.selectNodeById(newValue.id)
    // graph.selectNodeByIndex(i);
    // graph.zoomToNodeByIndex(i);
  })
onMounted(async () => {
  const { success, status } = await channelsStore.dispatchGetChannels();
//add info of number
  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  } else {
    channels.value = channelsStore.channels.map((item) => ({
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
  <v-container>
    <v-row>
      <v-col>
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
      <v-col>
        <h1>info</h1>
        <ChannelInfoComponent />
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-data-table :headers="headers" :items="channels" :search="search">
          <template v-slot:item="props">
            <tr
              @click="handleClick(props.item)"
              :class="{ selected: props.item.id === selectedChannel?.id }"
            >
              <td class="text-xs-right">{{ props.item.id }}</td>
              <td class="text-xs-right">{{ props.item.participants_count }}</td>
              <td class="text-xs-right">{{ props.item.count }}</td>
              <td class="text-xs-right">{{ props.item.IRI }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.selected {
  background: #7d92f5 !important;
}
</style>
