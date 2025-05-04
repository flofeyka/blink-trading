import {TradesClient} from "@/submodule/src";

export const tradeAPI = {
    async fetchTransactions(address: string){
        const httpClient = TradesClient.http(`http://${process.env.NEXT_PUBLIC_TRADES_URL}`);

        return await httpClient.getTrades({
            amm: address,
            limit: 10,
        });
    },

    async fetchStatistics(address: string) {
        const client = TradesClient.websocket(`ws://${process.env.NEXT_PUBLIC_TRADES_URL}`);
        const total_data = await client.getTotals({
            amm: address,
            dir: 0
        })
        return total_data.map((total, index) => ({
            id: index,
            ...total
        }));
    }

}