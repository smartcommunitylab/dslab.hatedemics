// the axios instance and types
import http from "../api";
import { type APIResponse, type Message } from "../types";

async function getMessages(id: number) {
  return await http.get<APIResponse<Message[]>>(`messages/${id}`);
}

export default {
  getMessages,
};