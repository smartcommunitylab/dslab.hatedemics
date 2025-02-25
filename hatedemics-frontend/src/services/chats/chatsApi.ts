// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Message, type Pageable } from "../types";
import { toCamelCaseParams } from '../utility';


// async function getChats(id: number) {
//   // return await http.get<APIResponse<Message[]>>(`messages/${id}`);
//   // let messages = await axios.get('http://localhost:5173/public/chats/allMessages.json')
//   let messages = await axiosInstance.get(`/public/chats/allMessages.json`)
//   let worthData = await axiosInstance.get('/public/chats/allworth.json')
//   for (let i = 0; i < 1000; i++) {
//     if (messages.data[i] &&worthData.data[i]) {
//       messages.data[i].hate_label = worthData.data[i].hate_label
//       messages.data[i].checkworthy_label = worthData.data[i].checkworthy_label
//       messages.data[i].topic= worthData.data[i].topic_label
//       messages.data[i].target= worthData.data[i].target
//     }
//   }
//   return {status:200,data:messages.data.slice(0,1000)} //messages

// }
async function getChats(id:string, pageParams: Pageable) {
  // console.log("getChats",'http://localhost:8080/api/messages/chat/bbed2d968dd6d545e36e727ecb31d43639396eb8443e0c4aa3360a17544776ba?page=0&size=10&sort=date,desc')
  // console.log("getChats",`/messages/chat/${id}`, { params: { ...pageParams } })

  return  await axiosInstance.get(`/messages/chat/${id}`, { params: { ...(toCamelCaseParams(pageParams)) } })
}

export default {
  getChats,
};