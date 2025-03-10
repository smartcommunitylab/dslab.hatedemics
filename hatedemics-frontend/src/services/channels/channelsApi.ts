// the axios instance and types
import axiosInstance from './../api';
import http from "../api";
import { type APIResponse, type Channel, type Pageable } from "../types";
import { toCamelCaseParams } from '../utility';

async function getChannelsInfo(selectedLanguage: string,  pageParams: Pageable,idChannel?: string) {
    if (pageParams.size == -1) return await axiosInstance.get(`/channels/all`, { params: { language: selectedLanguage ? selectedLanguage : 'IT' } })
    return await axiosInstance.get(`/channels`, { params: { language: selectedLanguage ? selectedLanguage : 'IT', ...(toCamelCaseParams(pageParams)),...(idChannel ? { id: idChannel } : {})} })
}1
async function getChannels(selectedLanguage: string) {
    return await axiosInstance.get(`channels`, { params: { language: selectedLanguage ? selectedLanguage : 'IT' } })
}
async function getChannel(idChannel: string) {
    return await axiosInstance.get(`channels/${idChannel}`)
}
export default {
    getChannelsInfo,
    getChannels,
    getChannel
};