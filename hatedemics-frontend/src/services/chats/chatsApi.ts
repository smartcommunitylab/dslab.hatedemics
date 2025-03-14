// the axios instance and types
import axiosInstance from './../api';
import { type Pageable } from "../types";
import { toCamelCaseParams } from '../utility';



async function getChats(id:string, pageParams: Pageable, target?:string, checkworthy?: number, hate?:number, topic?:string) {


  return  await axiosInstance.get(`/messages/chat/${id}`, { params: { ...(toCamelCaseParams(pageParams)), target, checkworthy, hate, topic} })
}

export default {
  getChats,
};