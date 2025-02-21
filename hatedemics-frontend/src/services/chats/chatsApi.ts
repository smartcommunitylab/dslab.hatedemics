// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Message } from "../types";


async function getChats(id: number) {
  // return await http.get<APIResponse<Message[]>>(`messages/${id}`);
  // let messages = await axios.get('http://localhost:5173/public/chats/allMessages.json')
  let messages = await axiosInstance.get(`/public/chats/allMessages.json`)
  let worthData = await axiosInstance.get('/public/chats/allworth.json')
  for (let i = 0; i < 1000; i++) {
    if (messages.data[i] &&worthData.data[i]) {
      messages.data[i].hate_label = worthData.data[i].hate_label
      messages.data[i].checkworthy_label = worthData.data[i].checkworthy_label
      messages.data[i].topic= worthData.data[i].topic_label
      messages.data[i].target= worthData.data[i].target
    }
  }
  return {status:200,data:messages.data.slice(0,1000)} //messages

}


export default {
  getChats,
};