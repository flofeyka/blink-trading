import { BlinkClient, decryptSessionKeyPair, initSession } from "@/submodule/src";

export const authAPI = {
    async generateLink() {
        const {privateKey, url} = await initSession();
        localStorage.setItem("privateKey", privateKey);

        return url;
    },

    async getUser(params: string): Promise<BlinkClient> {
        const keyPair = await decryptSessionKeyPair(localStorage.getItem("privateKey") || "", params);

        const client: BlinkClient = BlinkClient.http(process.env.NEXT_PUBLIC_API_URL!, keyPair);

        return client

    }
}