// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Topic } from "../types";


async function getTopics(id: string) {
  // return await http.get<APIResponse<Message[]>>(`messages/${id}`);
  return await axiosInstance.get(`/chats/${id}`)

}
export default {
    getTopics,
};