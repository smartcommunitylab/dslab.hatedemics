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
  {title:"Date",key:"date"},
  { title: "User", key: "from_id" },
  {title:"Media Type", key:"media_type"},
  {title:"Reactions",key:"nr_reactions"},
  {title:"Hate Label",key:"hate_label"},
  {title:"Checkworthy Label",key:"checkworthy_label"},
  {title:"Topic",key:"topic"},
  {title:"Target",key:"target"},
]);
  // date: string
  // from_id: any
  // fwd_from_date: any
  // fwd_from_id: any
  // fwd_from_msg_id: any
  // id: string
  // media_type: string
  // message: string
  // nr_forwards: string
  // nr_reactions: string
  // nr_replies: string
  // nr_views: string
  // preprocessed_message: string
  // reactions: Reactions
  // replies_to_msg_id: any
  // replies_to_msg_text: any
  // text_mentions: any[]
  // text_urls: string[]
  // via_bot_id: any
const handleClick = ( row:any) =>{
  console.log("Clicked item: ", row)

}
const getIcon = (type:string) => {
  switch (type) {
  case 'photo':
    return 'mdi-image'
  case 'webpage':
  return 'mdi-web'
  case 'video':
  return 'mdi-video-box'
  default:
  return 'mdi-message'
}
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
        <tr @click="handleClick(props.item)" class="message-row">
          <td class="text-xs-right">{{ props.item.message }}</td>
          <td class="text-xs-right">{{ props.item.date }}</td>
          <td class="text-xs-right">{{ props.item.from_id }}</td>
          <td class="text-xs-right">
            <v-icon
              color="green-darken-2"
              :icon="getIcon(props.item.media_type)"
              size="large"
            ></v-icon>
          </td>
          <td class="text-xs-right">{{ props.item.nr_reactions }}</td>
          <td class="text-xs-right">{{ props.item.hate_label }}</td>
          <td class="text-xs-right">{{ props.item.checkworthy_label }}</td>
          <td class="text-xs-right">{{ props.item.topic }}</td>
          <td class="text-xs-right">{{ props.item.target }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
<style scoped>
.message-row:hover {
  background: #F3F3F3;
}
</style>
