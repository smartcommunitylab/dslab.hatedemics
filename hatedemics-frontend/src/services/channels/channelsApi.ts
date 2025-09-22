// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Channel, type Pageable } from "../types";
import { toCamelCaseParams } from '../utility';

async function getChannelsInfo(
    selectedLanguage: string,
    pageParams: Pageable,
    filters?: { id?: string; label?: string }
) {
    if (pageParams.size == -1) return await axiosInstance.get(`/channels/all`, { params: { language: selectedLanguage ? selectedLanguage : 'IT' } })
        return await axiosInstance.get(`/channels`, {
            params: {
              language: selectedLanguage || "IT",
              ...toCamelCaseParams(pageParams),
              ...(filters?.id ? { id: filters.id } : {}),
              ...(filters?.label ? { label: filters.label } : {}) 
            }
          });} 1
async function getChannels(selectedLanguage: string) {
    const resp= await axiosInstance.get(`channels`, { params: { language: selectedLanguage ? selectedLanguage : 'IT' } })
    console.log(resp.data)
    return resp
}
async function getChannel(idChannel: string, language: string) {
    return await axiosInstance.get(`channels/${language}/${idChannel}`);
}
export default {
    getChannelsInfo,
    getChannels,
    getChannel
};