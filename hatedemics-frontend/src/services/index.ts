//services/index.ts
import channelApi from "./channels/channelsApi.ts";
import messageApi from "./messages/messagesApi.ts";

export const API = {
    channels: channelApi,
    messages: messageApi,
};