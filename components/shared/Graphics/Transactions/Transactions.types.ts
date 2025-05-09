import { Asset } from "blink-sdk";

export interface Holder {
  wallet: string;
  owned: string;
  amount: string;
  value: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export interface Transaction {
  amm: string;
  block_timestamp: number;
  side: "buy" | "sell";
  color: string;
  signature: string;
  index: number;
  price_usd: number;
  total_usd: number;
  price: number;
  base_amount: number;
  quote_amount: number;
}

export interface Trader {
  address: string;
  buy_txns: number;
  sell_txns: number;
  bought_quote: number;
  sold_quote: number;
  bought_base: number;
  sold_base: number;
  pnl_quote: number;
  remaining_base: number;
}

export interface FormattedTrader extends Trader {
  rank: number;
  sold: {
    quote: number;
    base: number;
  };
  bought: {
    base: number;
    quote: number;
  };
}

export interface FormattedHolding extends Asset {
  avg_price_column: {
    price_token: string;
    price_usd: string;
  };
  price_column: {
    price_token: string;
    price_usd: string;
  };
  balance_column: {
    balance_ui_token: string;
    balance_ui_usd: string;
  };
  pnl: {
    pnl_usd: string;
    pnl_percent: string;
  };
}
