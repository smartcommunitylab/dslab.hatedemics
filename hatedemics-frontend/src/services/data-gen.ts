// the axios instance and types
import axios from 'axios';
import { useChannelsStore } from "../store/ChannelStore";
import { storeToRefs } from 'pinia';
import axiosInstance from './api';


export type Node = {
    id: string;
    label: string;
    message_count: number;
    participants_count: number;
    name: string;
    extended: boolean;
    cw: number;
    hs: number,
    iri: number,
    n_out_recommended: number;
    n_in_recommendation: number;
};

export type Link = {
    source: string;
    target: string;
};

let links: Link[] = [];
let nodes: Node[] = [];
async function getEdges() {
    const channelsStore = useChannelsStore();
    const { selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("edges");
    return await axiosInstance.get(`network/edges/all`, { params: { language: selectedLanguage.value ? selectedLanguage.value : 'IT' } })
}
async function getNodes() {
    const channelsStore = useChannelsStore();
    const { selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("nodes");
    return await axiosInstance.get(`network/nodes/all`, { params: { language: selectedLanguage.value ? selectedLanguage.value : 'IT' } })
}
async function initData() {
    nodes = [];
    links = [];
    const linksData = await getEdges();
    const nodesData = await getNodes();

    // const n = 100;
    // const m = 100;
    for (let node = 0; node < nodesData.data.length; node += 1) {
        nodes.push({
            id: `${nodesData.data[node].channel_int}`,
            label: `${nodesData.data[node].label}`,
            message_count: nodesData.data[node].message_count,
            participants_count: nodesData.data[node].participants_count,
            name: `${nodesData.data[node].channel_id}`,
            extended: nodesData.data[node].iri != -1,
            cw: nodesData.data[node].cw,
            //  color:'#4B5BBF',
            hs: nodesData.data[node].hs,
            iri: parseFloat(nodesData.data[node].iri),
            //  size:nodesData.data[node].iri* 20 + 5,
            n_out_recommended: nodesData.data[node].n_out_recommended,
            n_in_recommendation: nodesData.data[node].n_in_recommendation
        });

    }
    for (let link = 0; link < linksData.data.length; link += 1) {
        links.push({ source: `${linksData.data[link].source_int}`, target: `${linksData.data[link].target_int}` });
    }
}

export { initData, nodes, links };
