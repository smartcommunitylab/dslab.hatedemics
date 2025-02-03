// the axios instance and types
import axios from "axios";
import http from "../api";
import { type APIResponse, type Channel } from "../types";

async function getChannels() {
//   return await http.get<APIResponse<Channel[]>>("channels");
return await axios.get('http://localhost:5173/public/allChannels.json')

}

export default {
    getChannels,
};