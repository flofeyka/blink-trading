import {TradesClient} from "blink-sdk";

export const tradeAPI = {
  getClient(): TradesClient {
    return TradesClient.http(
        `https://${process.env.NEXT_PUBLIC_TRADES_URL}`
    );
  },

  async fetchTransactions(address: string) {
    return await this.getClient().getTrades({
      amm: address,
      limit: 10,
    });
  },

  async fetchStatistics(address: string) {
    const client: TradesClient = this.getClient();
    const total_data = await client.getTotals({
      amm: address,
      dir: 0,
    });
    return total_data.map((total, index) => ({
      id: index,
      ...total,
    }));
  },
};
