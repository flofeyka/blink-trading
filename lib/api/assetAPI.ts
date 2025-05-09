import { AssetsClient } from "blink-sdk"

export const AssetAPI = {
  getClient(): AssetsClient | undefined {
    if(!process.env.NEXT_PUBLIC_ASSETS_URL) return;

    return AssetsClient.http(process.env.NEXT_PUBLIC_ASSETS_URL);
  },

  async topHolders(pubkey: string) {
    return await this.getClient()?.getTopHolders(pubkey)
  }


}