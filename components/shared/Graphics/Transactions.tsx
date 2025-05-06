'use client';
import {useEffect, useState} from "react";
import Image from "next/image";
import Table, {Column} from "../../ui/Table";
import Button from "@/components/ui/Button";
import SortArrows, {SortDirection} from "@/components/ui/SortArrows";
import {shortenString} from "@/components/shared/Graphics/Graphics";
import {tradeAPI} from "@/lib/api/tradeAPI";
import Link from "next/link";

interface Holding {
  token: string;
  image: string;
  lastActive: string;
  unrealizedProfit: number;
  profitPercent: number;
  realizedProfit: number;
  totalProfit: number;
  balance: number;
  bought: number;
  sold: number;
}

interface Trader {
  rank: number;
  maker: string;
  invested: string;
  investedUSD: number;
  sold: string;
  soldUSD: number;
  pnl: number;
  remaining: number;
  balance: string;
  txns: number;
}

interface Holder {
  wallet: string;
  owned: string;
  amount: string;
  value: string;
}

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface Transaction {
  amm: string
  block_timestamp: number
  direction: 'BUY' | 'SELL'
  index: number
  price: number;
  input_amount: bigint
  output_amount: bigint
  signature: string
  trader: string
}

export default function Transactions({address, direction}: {address: string, direction: number}) {
  const [activeTab, setActiveTab] = useState<string>("transactions");
  const [dateViewMode, setDateViewMode] = useState<"date" | "age">("date");
  const [dateSortDirection, setDateSortDirection] =
    useState<SortDirection>(null);

  const [transactionData, setTransactionData] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await tradeAPI.fetchTransactions(address);

      setTransactionData(transactions.map(item => ({
        ...item,
        price: direction === item.direction ? Number(item.output_amount) / Number(item.input_amount) : Number(item.input_amount) / Number(item.output_amount),
        direction: direction === item.direction ? "BUY" : "SELL",
      })))
    }

    fetchTransactions();
  }, [])


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
      label: "Holders (12272)",
      icon: "/icons/holders.svg",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "/icons/orders.svg",
    },
  ];

  // Holdings data
  const holdings: Holding[] = [
    {
      token: "TRUMP",
      image: '/images/trump.jpg',
      lastActive: "5h",
      unrealizedProfit: 689,
      profitPercent: 157.8,
      realizedProfit: 433.2,
      totalProfit: 1122.2,
      balance: 6308.6,
      bought: 310.55,
      sold: 0,
    },
  ];

  // Top Traders data
  const traders: Trader[] = [
    {
      rank: 1,
      maker: "3gh...2wk",
      invested: "19%",
      investedUSD: 600.0,
      sold: "11%",
      soldUSD: 430.0,
      pnl: 6.2,
      remaining: 170.0,
      balance: "100K of 875K",
      txns: 3,
    },
    {
      rank: 2,
      maker: "4kh...3zx",
      invested: "11%",
      investedUSD: 420.0,
      sold: "11%",
      soldUSD: 410.0,
      pnl: 3.34,
      remaining: 150.64,
      balance: "2.1M of 20M",
      txns: 4,
    },
    {
      rank: 3,
      maker: "9jk...4nz",
      invested: "8%",
      investedUSD: 300.0,
      sold: "7%",
      soldUSD: 280.0,
      pnl: 2.2,
      remaining: 54.55,
      balance: "23K of 206K",
      txns: 5,
    },
    {
      rank: 4,
      maker: "2kl...1hj",
      invested: "5%",
      investedUSD: 200.0,
      sold: "3%",
      soldUSD: 160.0,
      pnl: 1.14,
      remaining: 13.0,
      balance: "0 of 12M",
      txns: 7,
    },
  ];

  // Holders data
  const holders: Holder[] = [
    {
      wallet: "2hs...3dn",
      owned: "16.00%",
      amount: "160M",
      value: "$3.4k",
    },
    {
      wallet: "3ju...2te",
      owned: "15.00%",
      amount: "150M",
      value: "$3.4k",
    },
    {
      wallet: "5hg...2bn",
      owned: "15.00%",
      amount: "150M",
      value: "$3.4k",
    },
    {
      wallet: "7hy...2bn",
      owned: "15.00%",
      amount: "150M",
      value: "$3.4k",
    },
    {
      wallet: "9ks...2tn",
      owned: "15.00%",
      amount: "150M",
      value: "$3.4k",
    },
  ];

  console.log(transactionData);

  // Transaction columns
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
        <span className="text-[#00FFA3]">
          {dateViewMode === "date" ? new Date(value * 1000).toLocaleDateString() : `${new Date(Date.now() - value * 1000).getDate()} days ago`}
        </span>
      ),
    },
    {
      header: "TYPE",
      key: "direction",
      align: "left",
      icon: "/icons/sort.svg",
      minWidth: "80px",
      width: "80px",
      render: (value) => (
        <span
          className={
            value === "BUY"
              ? "text-[#00FFA3]"
              : value === "SELL"
              ? "text-red-500"
              : "text-[#00FFA3]"
          }
        >
          {value}
        </span>
      ),
    },
    {
      header: "PRICE USD",
      key: 'price',
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className="text-[#00FFA3] text-ellipsis w-[120px]">${value.toLocaleString('en-US', {
          notation: 'compact', compactDisplay: 'short'
        })}</span>
      ),
    },
    {
      header: "TOTAL USD",
      key: "output_amount",
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className="text-[#00FFA3]">${(Number(value).toLocaleString('en-US', {
          notation: 'compact', compactDisplay: 'short'
        }))}</span>
      ),
    },
    {
      header: "PRICE SOL",
      key: "input_amount",
      align: "left",
      minWidth: "130px",
      width: "130px",
      render: (value) => (
        <span className="text-[#00FFA3]">{(Number(value).toLocaleString('en-US', {
          notation: 'compact', compactDisplay: 'short'
        }))}</span>
      ),
    },
    {
      header: "AMOUNT",
      key: "input_amount",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => <span className="text-[#00FFA3]">{Number(value).toLocaleString('en-US', {
        notation: 'compact', compactDisplay: 'short'
      })}</span>,
    },
    {
      header: "TOTAL SOL",
      key: "output_amount",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => (
        <span className="text-[#00FFA3] flex gap-2 items-center">
          <Image src="/icons/solan.svg" width={17} height={17} alt="solan" />{" "}
          {(Number(value).toLocaleString('en-US', {
            notation: 'compact', compactDisplay: 'short'
          }))}
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
        <Link href={`http://solscan.io/tx/${value}`} className="flex justify-end gap-2">
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

  // Holdings columns
  const holdingColumns: Column<Holding>[] = [
    {
      header: "TOKEN / LAST ACTIVE",
      key: "token",
      align: "left",
      sortable: true,
      minWidth: "200px",
      width: "200px",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Image
            src="/icons/favourite.svg"
            width={20}
            height={20}
            alt="token"
          />
          <Image src={row.image} className="w-6 h-6 bg-[#D9D9D9] rounded-full" width={30} height={30} alt={"coin"} />
          <span className="text-[#00FFA3]">{value}</span>
          <span className="text-[#A9A9A9]">{row.lastActive}</span>
        </div>
      ),
    },
    {
      header: "UNREALIZED",
      key: "unrealizedProfit",
      align: "left",
      sortable: true,
      minWidth: "120px",
      width: "120px",
      render: (value, row) => (
        <div>
          <div>${+value.toFixed(2)}</div>
          <div className="text-[#A9A9A9]">{row.profitPercent}%</div>
        </div>
      ),
    },
    {
      header: "REALIZED PROFIT",
      key: "realizedProfit",
      align: "left",
      sortable: true,
      minWidth: "150px",
      width: "150px",
      render: (value) => (
        <span className="text-[#00FFA3]">+${+value.toFixed(2)}</span>
      ),
    },
    {
      header: "TOTAL PROFIT",
      key: "totalProfit",
      sortable: true,
      align: "left",
      minWidth: "130px",
      width: "130px",
      render: (value) => (
        <span className="text-[#00FFA3]">+${+value.toFixed(2)}</span>
      ),
    },
    {
      header: "BALANCE",
      key: "balance",
      sortable: true,
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className="text-[#00FFA3]">${+value.toFixed(2)}</span>
      ),
    },
    {
      header: "BOUGHT",
      key: "bought",
      sortable: true,
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className="text-[#00FFA3]">${+value.toFixed(2)}</span>
      ),
    },
    {
      header: "SOLD",
      key: "sold",
      sortable: true,
      align: "left",
      minWidth: "120px",
      width: "120px",
      render: (value) => (
        <span className="text-[#00FFA3]">${(+value).toFixed(2)}</span>
      ),
    },
    {
      header: "",
      key: "token",
      align: "left",
      minWidth: "175px",
      width: "175px",
      render: () => (
        <Button className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-center font-semibold w-full gap-2.5 min-w-[150px]">
          QUICK SELL
        </Button>
      ),
    },
  ];

  // Top Traders columns
  const traderColumns: Column<Trader>[] = [
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
      key: "maker",
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
          <span className="text-[#00C1E7]">{value}</span>
        </div>
      ),
    },
    {
      header: "INVESTED",
      key: "invested",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value, row) => (
        <div>
          <div className="text-[#F31D36]">${row.investedUSD}</div>
          <div className="text-[#A9A9A9]">{value}</div>
        </div>
      ),
    },
    {
      header: "SOLD",
      key: "sold",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value, row) => (
        <div>
          <div className="text-[#00FFA3]">{value}</div>
          <div className="text-[#00FFA3]">${row.soldUSD}</div>
        </div>
      ),
    },
    {
      header: "P&L",
      key: "pnl",
      align: "left",
      minWidth: "80px",
      width: "80px",
      render: (value) => <span className="text-[#00C1E7]">${value}</span>,
    },
    {
      header: "REMAINING",
      key: "remaining",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>${value}</span>,
    },
    {
      header: "BALANCE",
      key: "balance",
      align: "left",
      minWidth: "200px",
      width: "200px",
      render: (value, row) => {
        // Extract values from balance string like "100K of 875K"
        const balanceParts = value.split(" of ");
        const current = balanceParts[0];
        const total = balanceParts[1];

        // Parse values with K, M, etc. suffixes
        const parseValueWithSuffix = (val: string) => {
          if (!val) return 0;
          const numPart = parseFloat(val.replace(/[^0-9.]/g, ""));
          if (val.includes("K")) return numPart * 1000;
          if (val.includes("M")) return numPart * 1000000;
          if (val.includes("B")) return numPart * 1000000000;
          return numPart;
        };

        const currentValue = parseValueWithSuffix(current);
        const totalValue = parseValueWithSuffix(total);

        // Calculate percentage for progress bar width (handle edge cases)
        const percentage =
          totalValue > 0 ? (currentValue / totalValue) * 100 : 0;

        return (
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-white font-medium">{current}</span>
              <span className="text-[#A9A9A9] text-xs">of {total}</span>
            </div>
            <div className="w-full h-2 bg-[#2b2b2b] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00FFA3]/80 rounded-full"
                style={{ width: `${Math.min(100, percentage)}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      header: "TXNS",
      key: "txns",
      align: "left",
      minWidth: "60px",
      width: "60px",
      render: (value) => (
        <Image src="/icons/sort.svg" width={20} height={20} alt="menu" />
      ),
    },
  ];

  // Holders columns
  const holderColumns: Column<Holder>[] = [
    {
      header: "WALLET",
      key: "wallet",
      align: "left",
      minWidth: "150px",
      width: "150px",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-[#00C1E7]">{value}</span>
        </div>
      ),
    },
    {
      header: "% OWNED",
      key: "owned",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>{value}</span>,
    },
    {
      header: "AMOUNT",
      key: "amount",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>{value}</span>,
    },
    {
      header: "VALUE",
      key: "value",
      align: "left",
      minWidth: "100px",
      width: "100px",
      render: (value) => <span>{value}</span>,
    },
    {
      header: "",
      key: "wallet",
      align: "left",
      minWidth: "60px",
      width: "60px",
      render: () => (
        <Image src="/icons/sort.svg" width={25} height={25} alt="menu" />
      ),
    },
  ];

  // Add basic sorting function for Traders table
  const handleTraderSort = (key: keyof Trader, direction: SortDirection) => {
    // This function would normally sort the data
    console.log(`Sorting by ${String(key)} in ${direction} direction`);
    // In a real implementation, you would sort the data array here
  };

  // Render active table based on current tab
  const renderTable = () => {
    switch (activeTab) {
      case "transactions":
        return (
            transactionData.length ?
          <Table
            data={transactionData}
            columns={transactionColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
          /> :           <div className="text-center py-4 text-[#A9A9A9]">
                  No active transactions
                </div>
        );
      case "holdings":
        return (
          <Table
            data={holdings}
            columns={holdingColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
          />
        );
      case "traders":
        return (
          <Table
            data={traders}
            columns={traderColumns}
            className="text-[13px] max-md:text-[11px]"
            textColor="#00FFA3"
            onSort={handleTraderSort}
          />
        );
      case "holders":
        return (
          <Table
            data={holders}
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
      <div className="flex gap-4 border-b border-[#353535] overflow-x-auto" style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#444 #222",
      }}>
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
      <div className="mt-2 w-full overflow-y-auto h-full max-h-[25vh] relative"
           style={{
             scrollbarWidth: "thin",
             scrollbarColor: "#444 #222",
           }}>{renderTable()}</div>
    </div>
  );
}
