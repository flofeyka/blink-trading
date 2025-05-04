import {BlinkClient, decryptSessionKeyPair, initSession} from "@/submodule/src";

export const authAPI = {
    async generateLink(): Promise<string> {
        const {privateKey, url} = await initSession();
        localStorage.setItem("privateKey", privateKey);
        return url;
    },

    async getUser(params?: string): Promise<BlinkClient> {
        const keyPair = await decryptSessionKeyPair(localStorage.getItem("privateKey") || "", params || localStorage.getItem('params') || '');
        const client =  BlinkClient.http(process.env.NEXT_PUBLIC_API_URL!, keyPair)

        if(params) {
            localStorage.setItem('params', params);
        }

        return client;


    }
}