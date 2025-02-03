<script setup lang="ts">
import { ref ,reactive} from 'vue';
// import GraphComponent from '@/components/GraphComponent.vue';
import GraphComponent from '@/components/GraphComponent.vue';
import ChannelInfoComponent from '@/components/ChannelInfoComponent.vue'
const msg = ref('Hello from Channels');
const search = ref('');
import { onMounted } from "vue";
import { useChannelsStore } from "../store/ChannelStore";
import type { Channel } from '@/services/types';

const channelsStore = useChannelsStore();
const channels = ref<any[]>([]);
  const selectedChannel = ref<Channel>();
    // const selected = ref<any[]>([]);
    const headers = reactive<any[]>([ {title: 'ID', value: 'id'}, {title: 'Count', value: 'count'}]);

onMounted(async () => {
  const { success, status } = await channelsStore.dispatchGetChannels();

  if (!success) {
    alert("Ups, something happened 🙂");
    console.log("Api status ->", status);
  }
  else {
    channels.value= channelsStore.channels.map(item =>  ({'id': item.id, 'count':item.participants_count})) 
    console.log(channelsStore.channels)
  }
});
</script>

<template>
  <v-container>
  <v-row>
    <v-col> 
    <h1>{{ msg }}</h1>
    <v-select
  label="Language"
  :items="['Italiano', 'Español', 'English']"
></v-select>
    <GraphComponent />
    <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="channels"
      :search="search"
    ></v-data-table>
    <!-- <v-table>
    <thead>
      <tr>
        <th class="text-left">Id</th>
        <th class="text-left">Partecipant count </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="chan in channelsStore.channels" :key="chan.full_chat.id">
        <td>{{ chan.full_chat.id }}</td>
        <td>{{ chan.full_chat.participants_count }}</td>
      </tr>
    </tbody>
  </v-table> -->

    </v-col>
    <v-col>
    <h1>info</h1>
    <ChannelInfoComponent />

    </v-col>
    

  </v-row>
  </v-container>

</template>
