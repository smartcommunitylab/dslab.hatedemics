// the axios instance and types
import axios from 'axios';
import { useChannelsStore } from "../store/ChannelStore";
import { storeToRefs } from 'pinia';
import axiosInstance from './api';


export type Node = {
    id: string;
    name: string;
    extended: boolean
    // color: string,
    // size: number,
    hs:number,
    iri: number,
    out_degree: number;
  in_degree: number;
    // channelInfo: ChannelInfo
};

export type Link = {
    source_id: string;
    target_id: string;
};

const links: Link[] = [];
const nodes: Node[] = [];
async function getEdges() {
    const channelsStore = useChannelsStore();
    const {selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("edges");
    return await axiosInstance.get(`network/edges/all`,{params:{language:selectedLanguage.value?selectedLanguage.value:'it'}})
}
async function getNodes() {
    const channelsStore = useChannelsStore();
const {selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("nodes");
    return await axiosInstance.get(`network/nodes/all`,{params:{language:selectedLanguage.value?selectedLanguage.value:'it'}})
}
async function initData() {
    const linksData = await getEdges();
    const nodesData = await getNodes();

    // const n = 100;
    // const m = 100;
    for (let node = 0; node < nodesData.data.length; node += 1) {
        nodes.push({ id: `${nodesData.data[node].channel_int}`,
             name: `${nodesData.data[node].channel_id}`, 
             extended: nodesData.data[node].iri != -1 ,
            //  color:'#4B5BBF',
            hs:nodesData.data[node].hs,
             iri: nodesData.data[node].iri,
            //  size:nodesData.data[node].iri* 20 + 5,
             out_degree: nodesData.data[node].out_degree,
             in_degree: nodesData.data[node].in_degree});
    
    }
    for (let link = 0; link < linksData.data.length; link += 1) {
        links.push({ source_id: `${linksData.data[link].source_int}`, target_id: `${linksData.data[link].target_int}` });
    }  
}

export { initData,nodes, links };
