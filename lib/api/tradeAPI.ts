import { TradesClient } from "blink-sdk";

export const tradeAPI = {
  getClient(): TradesClient {
    return TradesClient.http(`https://${process.env.NEXT_PUBLIC_TRADES_URL}`);
  },

  async fetchTransactions(
    address: string,
    direction: number,
    base_decimals: number,
    quote_decimals: number = 9
  ) {
    return await this.getClient().getUiTrades({
      amm: address,
      limit: 10,
      dir: direction,
      base_decimals,
      quote_decimals,
    });
  },

  async fetchTraders(
    address: string,
    dir: number,
    base_decimals: number,
    quote_decimals: number = 0
  ) {
    return await this.getClient().getTopTraders({
      amm: address,
      dir,
      base_decimals,
      quote_decimals,
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
