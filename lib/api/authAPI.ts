import {BlinkClient, decryptSessionKeyPair, initSession} from "@/submodule/src";
import elliptic from "elliptic";

export const authAPI = {
    async generateLink(): Promise<string> {
        const {privateKey, url} = await initSession();
        localStorage.setItem("privateKey", privateKey);
        return url;
    },

    async getUser(params?: string): Promise<BlinkClient> {
        try {
            let keyPair;
            const storedKeyPair = localStorage.getItem('keyPair');

            if (storedKeyPair) {
                try {
                    keyPair = JSON.parse(storedKeyPair) as elliptic.ec.KeyPair;
                } catch {
                    localStorage.removeItem('keyPair');
                }
            }

            if (!keyPair) {
                keyPair = await decryptSessionKeyPair(localStorage.getItem("privateKey") || "", params || localStorage.getItem('params') || '');
                localStorage.setItem('keyPair', JSON.stringify(keyPair));
            }

            console.log(keyPair);
            const client = BlinkClient.http(process.env.NEXT_PUBLIC_API_URL!, keyPair as unknown as elliptic.ec.KeyPair)
    
            if(params) {
                localStorage.setItem('params', params);
            }
    
            return client;
        } catch(e) {
            console.error(e);
            localStorage.clear();
            throw new Error("User not found");

        }


    }
}