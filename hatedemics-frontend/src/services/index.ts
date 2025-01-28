//services/index.ts
import channelApi from "./channels";
import messageApi from "./messages";

export const API = {
    channels: channelApi,
    messages: messageApi,
};