// the axios instance and types
import axios from "axios";
import http from "@/services/api";
import { type APIResponse } from "@/services/types";
export type Node = {
    id: string;
    name: string;
    extended: boolean
    color: string,
    size: number
};

export type Link = {
    source: string;
    target: string;
};


async function getEdges() {
    //   return await http.get<APIResponse<Channel[]>>("edges");
    return await axios.get('http://localhost:5173/public/graph/edges.json')
}
async function getNodes() {
    //   return await http.get<APIResponse<Channel[]>>("nodes");
    return await axios.get('http://localhost:5173/public/graph/nodes.json')
}

const linksData = await getEdges();
const nodesData = await getNodes();
const links: Link[] = [];
const nodes: Node[] = [];
// const n = 100;
// const m = 100;
for (let node = 0; node < nodesData.data.length; node += 1) {
    nodes.push({ id: `${nodesData.data[node].channel_int}`,
         name: `${nodesData.data[node].channel_id}`, 
         extended: nodesData.data[node].iri != -1 ,
         color:'#4B5BBF',
         size:nodesData.data[node].iri+1});

}
for (let link = 0; link < linksData.data.length; link += 1) {
    links.push({ source: `${linksData.data[link].source_int}`, target: `${linksData.data[link].target_int}` });
}
export { nodes, links };
