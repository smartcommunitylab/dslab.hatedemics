// the axios instance and types
import axios from "axios";
import http from "../api";
import { type APIResponse, type Topic } from "../types";


async function getTopics(id: string) {
  // return await http.get<APIResponse<Message[]>>(`messages/${id}`);
  return await axios.get(`http://localhost:5173/public/topics/${Math.floor(Math.random() * 2) + 1}.json`)

}

export default {
    getTopics,
};