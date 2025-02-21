// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Channel } from "../types";

async function getChannelsInfo(selectedLanguage:string) {
//   return await http.get<APIResponse<Channel[]>>("channels");
// return await axiosInstance.get('http://localhost:5173/public/channels/allChannels.json')
return await axiosInstance.get(`/public/channels/${selectedLanguage}.json`)


}
async function getChannels() {
    //   return await http.get<APIResponse<Channel[]>>("channels");
    // let channelsInfo=await axiosInstance.get('http://localhost:5173/public/allChannels.json')
    // let channels = [];
    return await axiosInstance.get('api/channels/allChannels.json')
    // for (let channelInfo in channelsInfo)

    //     channels.push(await axios.get('http://localhost:5173/public/'+channelsInfo[channelInfo].id+'.json'))
    // 
    }

export default {
    getChannelsInfo,
    getChannels
};