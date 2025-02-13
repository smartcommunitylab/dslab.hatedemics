// the axios instance and types
import axios from 'axios';
import { useChannelsStore } from "../store/ChannelStore";
import { storeToRefs } from 'pinia';



export type Node = {
    id: string;
    name: string;
    extended: boolean
    color: string,
    size: number,
    iri: number
    // channelInfo: ChannelInfo
};

export type Link = {
    source: string;
    target: string;
};

const links: Link[] = [];
const nodes: Node[] = [];
async function getEdges() {
    const channelsStore = useChannelsStore();
    const {selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("edges");
    return await axios.get(`http://localhost:5173/public/graph/${selectedLanguage.value?selectedLanguage.value:'it'}/edges.json`)
}
async function getNodes() {
    const channelsStore = useChannelsStore();
const {selectedLanguage } = storeToRefs(channelsStore)
    //   return await http.get<APIResponse<Channel[]>>("nodes");
    return await axios.get(`http://localhost:5173/public/graph/${selectedLanguage.value?selectedLanguage.value:'it'}/nodes.json`)
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
             color:'#4B5BBF',
             iri: nodesData.data[node].iri,
             size:nodesData.data[node].iri+2});
    
    }
    for (let link = 0; link < linksData.data.length; link += 1) {
        links.push({ source: `${linksData.data[link].source_int}`, target: `${linksData.data[link].target_int}` });
    }  
}

export { initData,nodes, links };
