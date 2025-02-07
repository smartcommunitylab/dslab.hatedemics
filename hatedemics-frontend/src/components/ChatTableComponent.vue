<script setup lang="ts">
import {
  computed,
    reactive,
    ref,
  type ComputedRef,

} from 'vue';import { useChannelsStore } from "../store/ChannelStore";
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import { useMessagesStore } from '@/store/MessageStore';
import { storeToRefs } from 'pinia';
const { t } = useI18n();
const channelsStore = useChannelsStore();
  const messagesStore = useMessagesStore();
  const { messages } = storeToRefs(messagesStore)
const router = useRouter();
const search = ref("");
const headers = reactive<any[]>([
  { title: "Message", key: "message" },
  { title: "User", key: "from_id.user_id" },
  {title:"Date",key:"date"},
  {title:"Hate",key:"IRI"},
  {title:"Topic",key:"IRI"},
  {title:"Check Worthy",key:"IRI"},
  {title:"Reactions",key:"IRI"},
]);
const handleClick = ( row:any) =>{
  console.log("Clicked item: ", row)
  
}
</script>
<template>
    <v-container :fluid="true">
          <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-data-table :headers="headers" :items="messages" :search="search">
          <template v-slot:item="props">
            <tr
              @click="handleClick(props.item)"
            >
              <td class="text-xs-right">{{ props.item.message }}</td>
              <td class="text-xs-right">{{ props.item.from_id.user_id }}</td>
              <td class="text-xs-right">{{ props.item.date }}</td>
              <td class="text-xs-right">{{ props.item.IRI }}</td>
            </tr>
          </template>
        </v-data-table>
</v-container>
</template>
