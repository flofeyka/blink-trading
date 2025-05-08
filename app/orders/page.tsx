"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Table, { Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { userAPI } from "@/lib/api/userAPI";
import { compactNumber } from "@/lib/utils/compactNumber";
import { timeAgo } from "@/lib/utils/ageDate";

interface OrderItem {
  amount: BigInt;
  amount_ui: string;
  amount_ui_usd: string;
  created_at: number;
  current_price: string;
  entry_price: string;
  mint: string;
  mint_name: string;
  mint_symbol: string;
  order_pubkey: string;
  updated_at: number;
}

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<string>("holdings");
  const [hideLowLiq, setHideLowLiq] = useState(false);
  const [hideSmallAsset, setHideSmallAsset] = useState(false);
  const [hideSellOut, setHideSellOut] = useState(false);

  const [orderData, setOrdersData] = useState<OrderItem[]>([]);

  const [dateViewMode, setDateViewMode] = useState<"date" | "age">("date");

  useEffect(() => {
    const fetchOrders = async () => {
      const client = await userAPI.getUser();
      const orderInfo = await client.getOrders();
      console.log(orderInfo);
      setOrdersData(orderInfo);
    };

    fetchOrders();
  }, []);

  const tabs: TabItem[] = [
    {
      id: "holdings",
      label: "Holdings",
    },
    {
      id: "activity",
      label: "Activity",
    },
  ];

  const columns: Column<OrderItem>[] = [
    {
      header: (
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
      ),
      key: "created_at",
      align: "left",
      minWidth: "170px",
      render: (value, row) => (
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
      header: "TOKEN",
      key: "mint_name",
      align: "left",
      minWidth: "170px",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3D3D3D] flex items-center justify-center">
            <div className="w-[8px] h-[8px] bg-green-500 rounded-full"></div>
          </div>
          <div>
            <div>{value}</div>
            <div className="text-[#A9A9A9] text-xs">{}</div>
          </div>
        </div>
      ),
    },
    {
      header: "TYPE",
      key: "mint",
      minWidth: "130px",
      align: "left",
      render: () => <div className="text-[#00FFA3]">BUY</div>,
    },
    {
      header: "TOTAL TOKEN",
      key: "amount_ui",
      minWidth: "150px",
      align: "left",
      render: (value) => (
        <span className="text-[#00FFA3]">{compactNumber(+value)}</span>
      ),
    },
    {
      header: "TOTAL USD",
      key: "amount_ui_usd",
      minWidth: "130px",
      align: "left",
      render: (value) => (
        <span className="text-[#00FFA3]">${compactNumber(+value)}</span>
      ),
    },
    {
      header: "ENTRY PRICE",
      key: "entry_price",
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col">
          <div>{compactNumber(+value)}</div>
        </div>
      ),
    },
    {
      header: "CURRENT PRICE",
      key: "current_price",
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col">
          <div>${compactNumber(+value)}</div>
        </div>
      ),
    },
    {
      header: "",
      key: "mint",
      align: "right",
      minWidth: "150px",
      render: () => (
        <div className="flex justify-end items-center">
          <Button className="bg-gradient-to-r from-[#F43500] to-[#AA1013] flex items-center justify-center font-semibold gap-2 py-2 px-3">
            <span>Cancel</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">My orders</h1>

      <div className="bg-[#202020] rounded-md p-3">
        <div className="flex md:justify-between md:items-center pb-3 border-b   border-[#353535] max-md:flex-col max-md:gap-3 p-3">
          <div className="flex items-center gap-5 overflow-x-auto whitespace-nowrap pb-2">
            {tabs.map((tab) => (
              <span
                key={tab.id}
                className={`cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "font-medium max-md:text-md"
                    : "text-[#A9A9A9] font-medium max-md:text-md"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </span>
            ))}
            <span className="relative">
              <span className="absolute ml-2 mt-1.5">
                <Image
                  src="/icons/search.svg"
                  width={20}
                  height={20}
                  alt="search"
                />
              </span>
              <input
                type="text"
                placeholder="Search Token"
                className="w-[200px] max-md:text-12px max-md:w-full h-[35px] pl-8 rounded-3xl px-2 bg-[#353535]"
              />
            </span>
          </div>

          <div className="md:flex items-center gap-4 text-[#716F7A] hidden">
            <span className="flex items-center gap-2">
              <Checkbox checked={hideLowLiq} setChecked={setHideLowLiq} />
              Hide Low Liq / Honeypot
            </span>
            <span className="flex items-center gap-2">
              <Checkbox
                checked={hideSmallAsset}
                setChecked={setHideSmallAsset}
              />
              Hide Small Asset
            </span>
            <span className="flex items-center gap-2">
              <Checkbox checked={hideSellOut} setChecked={setHideSellOut} />
              Hide Sell Out
            </span>
          </div>
        </div>

        <div className="mt-3">
          <Table
            data={orderData}
            columns={columns}
            className="text-[13px] max-md:text-[11px]"
          />
        </div>
      </div>
    </div>
  );
}
