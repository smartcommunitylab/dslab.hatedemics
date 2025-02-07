// the axios instance and types
import axios from "axios";
import http from "../api";
import { type APIResponse, type Message } from "../types";


async function getChats(id: number) {
  // return await http.get<APIResponse<Message[]>>(`messages/${id}`);
  return await axios.get('http://localhost:5173/public/allMessages.json')

}

export default {
  getChats,
};