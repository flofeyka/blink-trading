"use client";
import SortArrows, { SortDirection } from "@/components/ui/SortArrows";
import { AssetAPI } from "@/lib/api/assetAPI";
import { tradeAPI } from "@/lib/api/tradeAPI";
import { userAPI } from "@/lib/api/userAPI";
import { timeAgo } from "@/lib/utils/ageDate";
import { compactNumber } from "@/lib/utils/compactNumber";
import { shortenString } from "@/lib/utils/shortenString";
import { TopHolder, TradesClient } from "blink-sdk";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Table, { Column } from "../../../ui/Table";
import {
  FormattedHolding,
  FormattedTrader,
  TabItem,
  Trader,
  Transaction,
} from "./Transactions.types";

const formatTransactionData = (
  transactions: any[],
  price_sol: number,
  price_usd: number
): Transaction[] => {
  return transactions.map((item) => ({
    ...item,
    side: item.side,
    signature: item.raw?.signature,
    trader: item.raw.trader,
    block_timestamp: item.raw.block_timestamp,
    color: item.side === "buy" ? "[#00FFA3]" : "red-500",
    price_usd: (item.price / price_sol) * price_usd,
    total_usd: item.base_amount * price_usd,
  }));
};

const formatTopTradersData = (topTraders: Trader[]): FormattedTrader[] => {
  return topTraders.map((item: Trader, index: number) => ({
    ...item,
    rank: index + 1,
    sold: {
      quote: item.sold_quote,
      base: item.sold_base,
    },
    bought: {
      base: item.bought_base,
      quote: item.bought_quote,
    },
  }));
};

export default function Transactions({
  address,
  direction,
  decimals,
  price_sol,
  price_usd,
  mint,
}: {
  address: string;
  direction: number;
  decimals: number;
  price_sol: number;
  price_usd: number;
  mint: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("transactions");
  const [dateViewMode, setDateViewMode] = useState<"date" | "age">("date");
  const [dateSortDirection, setDateSortDirection] =
    useState<SortDirection>(null);

  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [topTraders, setTopTraders] = useState<FormattedTrader[]>([]);
  const [holdings, setHoldings] = useState<FormattedHolding[]>([]);
  const [topHolders, setTopHolders] = useState<TopHolder[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  console.log(holdings);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await tradeAPI.fetchTransactions(
          address,
          direction,
          decimals
        );

        const topTrades = await tradeAPI.fetchTraders(
          address,
          direction,
          decimals
        );

        const holding = await userAPI
          .getHoldings({
            mint,
          })
          .catch(() => undefined);

        const holders = await AssetAPI.topHolders(mint);
        console.log(holders);

        setTopTraders(formatTopTradersData(topTrades));
        setTransactionData(
          formatTransactionData(transactions, price_sol, price_usd)
        );
        setTopHolders(holders?.top_holders || []);

        if (holding) {
          setHoldings(
            [holding].map((item) => ({
              ...item,
              avg_price_column: {
                price_token: item.avg_price,
                price_usd: item.avg_price_usd,
              },
              price_column: {
                price_token: item.price,
                price_usd: item.price_usd,
              },
              balance_column: {
                balance_ui_token: item.balance_ui,
                balance_ui_usd: item.balance_ui_usd,
              },
              pnl: {
                pnl_usd: item.pnl_usd,
                pnl_percent: item.pnl_percent,
              },
            }))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let isData = true;

    const fetchSocket = async () => {
      const client = TradesClient.websocket(
        `wss://${process.env.NEXT_PUBLIC_TRADES_URL}`
      );

      await client.subscribeUiTrades(
        {
          amm: address,
          dir: direction,
          quote_decimals: 9,
          base_decimals: decimals,
        },
        (result) => {
          setTransactionData((prev) => [
            ...formatTransactionData([result], price_sol, price_usd),
            ...prev,
          ]);
        }
      );
    };

    if (isData) {
      fetchSocket();
    }

    return () => {
      isData = false;
    };
  }, []);

  const tabs: TabItem[] = [
    {
      id: "transactions",
      label: "Transactions",
      icon: "/icons/transactions.svg",
    },
    {
      id: "holdings",
      label: "My Holdings",
      icon: "/icons/holdings.svg",
    },
    {
      id: "traders",
      label: "Top Traders",
      icon: "/icons/traders.svg",
    },
    {
      id: "holders",
      label: `Holders (${topHolders.length})`,
      icon: "/icons/holders.svg",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "/icons/orders.svg",
    },
  ];

  const transactionColumns: Column<Transaction>[] = [
    {
      header: (
        <div className="flex items-center gap-2">
          <div className="rounded-xl overflow-hidden border border-[#353535] flex">
            <button
              className={`text-xs px-5 py-1.5 cursor-pointer ${
                dateViewMode === "date"
                  ? "text-white bg-[#353535]"
                  : "text-[#A9A9A9]"
              }`}
              onClick={() => setDateViewMode("date")}
            >
              DATE
            </button>
            <button
              className={`text-xs px-5 py-1.5 cursor-pointer ${
                dateViewMode === "age"
                  ? "text-white bg-[#353535]"
                  : "text-[#A9A9A9]"
              }`}
              onClick={() => setDateViewMode("age")}
            >
              AGE
            </button>
          </div>
          <SortArrows
            initialDirection={dateSortDirection}
            onSortChange={(direction) => {
              setDateSortDirection(direction);
              console.log(`Sorting date in ${direction} direction`);
            }}
          />
        </div>
      ),
      key: "block_timestamp",
      align: "left",
      minWidth: "180px",
      render: (value) => (
        <span>
          {dateViewMode === "date"
            ? new Date(value * 1000)
                .toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })
                .replace("at", "")
            : `${timeAgo(value)}`}
        </span>
      ),
    },
    {
      header: "TYPE",
      key: "side",
      align: "left",
      icon: "/icons/sort.svg",
      minWidth: "80px",
      width: "80px",
      render: (value) => <span>{value.toUpperCase()}</span>,
    },
    {
      header: "PRICE USD",
      key: "price_usd",
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className=" text-ellipsis w-[120px]">
          ${compactNumber(value)}
        </span>
      ),
    },
    {
      header: "TOTAL USD",
      key: "total_usd",
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => <span>${compactNumber(value)}</span>,
    },
    {
      header: "PRICE SOL",
      key: "price",
      align: "left",
      minWidth: "130px",
      width: "130px",
      render: (value) => <span>{compactNumber(Number(value))}</span>,
    },
    {
      header: "AMOUNT",
      key: "base_amount",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => <span>{compactNumber(Number(value))}</span>,
    },
    {
      header: "TOTAL SOL",
      key: "quote_amount",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => (
        <span className="flex gap-2 items-center">
          <Image src="/icons/solan.svg" width={17} height={17} alt="solan" />{" "}
          {compactNumber(Number(value))}
        </span>
      ),
    },
    {
      header: "MARKERS",
      key: "signature",
      align: "left",
      minWidth: "160px",
      width: "160px",
      render: (value) => (
        <span className="text-[#00C1E7] flex gap-1 items-center">
          <Image
            src="/icons/profile.svg"
            width={30}
            height={30}
            alt="profile"
          />
          {shortenString(value)}
        </span>
      ),
    },
    {
      header: "",
      key: "signature",
      align: "left",
      minWidth: "60px",
      width: "60px",
      render: (value) => (
        <Link
          href={`http://solscan.io/tx/${value}`}
          className="flex justify-end gap-2"
        >
          {/* <Image
            src="/icons/copy.svg"
            width={15}
            height={15}
            alt="copy"
            className="cursor-pointer"
          />
          <Image
            src="/icons/x.svg"
            width={15}
            height={15}
            alt="twitter"
            className="cursor-pointer"
          /> */}
          <Image
            src="/icons/sort.svg"
            width={25}
            height={25}
            alt="sort"
            className="cursor-pointer"
          />
        </Link>
      ),
    },
  ];

  const holdingColumns: Column<FormattedHolding>[] = [
    {
      header: "TOKEN / LAST ACTIVE",
      key: "name",
      align: "left",
      sortable: true,
      minWidth: "170px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3D3D3D]" />
          <div>
            <div>{row.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: "UNREALIZED PnL",
      key: "pnl",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col ">
          <div>{parseFloat(value.pnl_percent).toFixed(3)}%</div>
          <div className="text-[#A9A9A9] text-xs">
            ${parseFloat(value.pnl_usd).toFixed(3)}
          </div>
        </div>
      ),
    },
    {
      header: "BALANCE",
      key: "balance_column",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col ">
          <div>{parseFloat(value.balance_ui_token).toFixed(3)}</div>
          <div className="text-[#A9A9A9] text-xs">
            ${parseFloat(value.balance_ui_usd).toFixed(3)}
          </div>
        </div>
      ),
    },
    {
      header: "ENTRY PRICE",
      key: "avg_price_column",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col">
          <div>{parseFloat(value.price_token).toFixed(3)}</div>
          <div className="text-[#A9A9A9] text-xs">
            ${parseFloat(value.price_usd).toFixed(3)}
          </div>
        </div>
      ),
    },
    {
      header: "CURRENT PRICE",
      key: "price_column",
      sortable: true,
      align: "left",
      minWidth: "150px",
      render: (value) => (
        <div className="flex flex-col">
          <div>{parseFloat(value.price_token).toFixed(3)}</div>
          <div className="text-[#A9A9A9] text-xs">
            ${parseFloat(value.price_usd).toFixed(3)}
          </div>
        </div>
      ),
    },
    {
      header: "",
      key: "mint",
      align: "right",
      minWidth: "130px",
      render: () => (
        <div className="flex justify-end gap-2 items-center">
          <Image
            src="/icons/share.svg"
            width={25}
            height={25}
            alt="share"
            className="cursor-pointer"
          />{" "}
          Share
        </div>
      ),
    },
    // {
    //   header: "",
    //   key: "mint",
    //   align: "right",
    //   minWidth: "180px",
    //   render: (value) => (
    //     <div className="flex justify-end gap-2 items-center">
    //       <Button
    //         onClick={() => onWithdraw(value)}
    //         className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-end font-semibold gap-2.5"
    //       >
    //         <span>
    //           <Image
    //             src="/icons/blink.svg"
    //             alt="blink"
    //             width={25}
    //             height={25}
    //           />
    //         </span>
    //         <span className="w-full">QUICK SELL</span>{" "}
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const traderColumns: Column<FormattedTrader>[] = [
    {
      header: "RANK",
      key: "rank",
      align: "left",
      minWidth: "80px",
      width: "80px",
      render: (value) => <span className="text-[#00FFA3]">#{value}</span>,
    },
    {
      header: "MARKER",
      key: "address",
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Image
            src="/icons/profile.svg"
            width={30}
            height={30}
            alt="profile"
          />
          <span className="text-[#00C1E7]">{shortenString(value)}</span>
        </div>
      ),
    },
    {
      header: "INVESTED",
      key: "bought",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => (
        <div>
          <div className="text-[#F31D36]">{compactNumber(value.base)}</div>
          <div className="text-[#A9A9A9]">${compactNumber(value.quote)}</div>
        </div>
      ),
    },
    {
      header: "SOLD",
      key: "sold",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => (
        <div>
          <div className="text-[#00FFA3]">{compactNumber(value.base)}</div>
          <div className="text-[#00FFA3]">${compactNumber(value.quote)}</div>
        </div>
      ),
    },
    {
      header: "P&L",
      key: "pnl_quote",
      align: "left",
      minWidth: "80px",
      width: "80px",
      render: (value) => (
        <span className="text-[#00C1E7]">${compactNumber(value)}</span>
      ),
    },
    {
      header: "REMAINING",
      key: "remaining_base",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>${compactNumber(value)}</span>,
    },
    // {
    //   header: "BALANCE",
    //   key: "balance",
    //   align: "left",
    //   minWidth: "200px",
    //   width: "200px",
    //   render: (value, row) => {
    //     return (
    //       <div className="w-full">
    //         <div className="flex justify-between mb-1">
    //           <span className="text-white font-medium">{value}</span>
    //           <span className="text-[#A9A9A9] text-xs">of {value}</span>
    //         </div>
    //         <div className="w-full h-2 bg-[#2b2b2b] rounded-full overflow-hidden">
    //           <div
    //             className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00FFA3]/80 rounded-full"
    //             style={{ width: `${Math.min(100, value)}%` }}
    //           ></div>
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "TXNS",
      key: "address",
      align: "center",
      minWidth: "60px",
      width: "120px",
      render: (value) => (
        <Link href={`http://solscan.io/tx/${value}`} className="flex gap-2">
          {/* <Image
            src="/icons/copy.svg"
            width={15}
            height={15}
            alt="copy"
            className="cursor-pointer"
          />
          <Image
            src="/icons/x.svg"
            width={15}
            height={15}
            alt="twitter"
            className="cursor-pointer"
          /> */}
          <Image
            src="/icons/sort.svg"
            width={25}
            height={25}
            alt="sort"
            className="cursor-pointer"
          />
        </Link>
      ),
    },
  ];

  const holderColumns: Column<TopHolder>[] = [
    {
      header: "WALLET",
      key: "address",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-[#00C1E7]">{shortenString(value)}</span>
        </div>
      ),
    },
    {
      header: "% OWNED",
      key: "supply_percentage",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>{Number(value).toFixed(2)}</span>,
    },
    {
      header: "AMOUNT",
      key: "amount_ui",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>{compactNumber(+value)}</span>,
    },
    // {
    //   header: "VALUE",
    //   key: "",
    //   align: "left",
    //   minWidth: "100px",
    //   width: "100px",
    //   render: (value) => <span>{value}</span>,
    // },
    {
      header: "",
      key: "address",
      align: "left",
      minWidth: "60px",
      width: "60px",
      render: (value) => (
        <Link href={`http://solscan.io/tx/${value}`} className="flex gap-2">
          <Image
            src="/icons/sort.svg"
            width={25}
            height={25}
            alt="sort"
            className="cursor-pointer"
          />
        </Link>
      ),
    },
  ];

  // Add basic sorting function for Traders table
  const handleTraderSort = (key: keyof Trader, direction: SortDirection) => {
    // This function would normally sort the data
    // console.log(`Sorting by ${String(key)} in ${direction} direction`);
    // In a real implementation, you would sort the data array here
  };

  // Render active table based on current tab
  const renderTable = () => {
    switch (activeTab) {
      case "transactions":
        return transactionData.length ? (
          <Table
            data={transactionData}
            columns={transactionColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
          />
        ) : (
          <div className="text-center py-4 text-[#A9A9A9]">
            {loading ? "Loading..." : "No active transactions"}
          </div>
        );
      case "holdings":
        return holdings.length ? (
          <Table
            data={holdings}
            columns={holdingColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
          />
        ) : (
          <div className="text-center py-4 text-[#A9A9A9]">
            {loading ? "Loading..." : "No active holdings"}
          </div>
        );
      case "traders":
        return topTraders.length ? (
          <Table
            data={topTraders}
            columns={traderColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
            // onSort={handleTraderSort}
          />
        ) : (
          <div className="text-center py-4 text-[#A9A9A9]">
            {loading ? "Loading..." : "No active traders"}
          </div>
        );
      case "holders":
        return (
          <Table
            data={topHolders}
            columns={holderColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
          />
        );
      case "orders":
        return (
          <div className="text-center py-4 text-[#A9A9A9]">
            No active orders
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#202020] p-2 rounded-b-md  max-md:hidden">
      {/* Tabs */}
      <div
        className="flex gap-4 border-b border-[#353535] overflow-x-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#444 #222",
        }}
      >
        {tabs.map((tab) => (
          <span
            key={tab.id}
            className={`cursor-pointer px-2 pb-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-white border-b-2 border-[#AEFF00]"
                : "text-[#A9A9A9]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && (
              <Image
                src={tab.icon}
                width={16}
                height={16}
                alt={tab.label}
                className={activeTab === tab.id ? "opacity-100" : "opacity-60"}
              />
            )}
            <span>{tab.label}</span>
          </span>
        ))}
        <span className="relative ml-auto">
          <input
            type="text"
            placeholder="Search Token"
            className="bg-[#353535] rounded-3xl px-8 py-1 text-sm w-[200px] max-md:w-[120px]"
          />
          <Image
            src="/icons/search.svg"
            width={15}
            height={15}
            alt="search"
            className="absolute left-2.5 top-2"
          />
        </span>
      </div>

      {/* Active Table based on selected tab */}
      <div
        className="mt-2 w-full overflow-y-auto h-full max-h-[25vh] relative"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#444 #222",
        }}
      >
        {renderTable()}
      </div>
    </div>
  );
}
