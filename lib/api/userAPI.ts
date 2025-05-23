import {
  BlinkClient,
  decryptSessionKeyPair,
  GetPositionParams,
  GetPositionsResponse,
  GetPositionsWithTotalResponse,
  initSession,
} from "blink-sdk";
import elliptic from "elliptic";

function toDER(keyPair: elliptic.ec.KeyPair): string {
  return keyPair.getPrivate("hex");
}

function fromDER(derKeyPair: string): elliptic.ec.KeyPair {
  const ec = new elliptic.ec("p256");
  return ec.keyFromPrivate(derKeyPair, "hex");
}

export const userAPI = {
  async generateLink(): Promise<string> {
    const { privateKey, url } = await initSession();
    localStorage.setItem("privateKey", privateKey);
    return url;
  },

  async getUser(
    params?: string,
    protocol: "https" | "wss" = "https"
  ): Promise<BlinkClient> {
    if (params) {
      localStorage.setItem("params", params);
    }
    try {
      let keyPair;
      const storedKeyPair = localStorage.getItem("keyPair");

      if (storedKeyPair) {
        try {
          keyPair = fromDER(storedKeyPair);
        } catch (e) {
          localStorage.removeItem("keyPair");
        }
      }

      if (!keyPair) {
        keyPair = await decryptSessionKeyPair(
          localStorage.getItem("privateKey") || "",
          params || localStorage.getItem("params") || ""
        ).catch(() => {
          localStorage.removeItem("keyPair");
          throw new Error("Error");
        });

        localStorage.setItem("keyPair", toDER(keyPair));
      }

      let client;
      if (protocol === "https") {
        client = BlinkClient.http(process.env.NEXT_PUBLIC_API_URL!, keyPair);
      } else {
        client = BlinkClient.websocket(
          `${protocol}//${process.env.NEXT_PUBLIC_API_URL!}`,
          keyPair
        );
      }

      await client.getSettings();

      return client;
    } catch (e) {
      localStorage.removeItem("keyPair");
      console.error(e);
      throw new Error("User not found");
    }
  },

  async fetchPortfolio(): Promise<GetPositionsWithTotalResponse> {
    try {
      const client = await this.getUser();
      return await client.getPositionsWithTotal();
    } catch (e) {
      throw e;
    }
  },

  async getHoldings(params: GetPositionParams) {
    return await (await this.getUser()).getPosition(params);
  },

  logout(): void {
    return localStorage.clear();
  },
};
