//services/index.ts
import channelApi from "./channels/channelsApi.ts";
import chatApi from "./chats/chatsApi.ts";
import topicsApi from "./topics/topicsApi.ts";
import dialogApi from "./dialog/dialogApi.ts";
import loginApi from "./login/loginApi.ts";
export const API = {
    channels: channelApi,
    chats: chatApi,
    topics: topicsApi,
    dialogs: dialogApi,
    login:loginApi
};