"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Table, { Column } from "../../ui/Table";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { userAPI } from "@/lib/api/userAPI";
import { toast } from "react-toastify";
import { Asset } from "blink-sdk";

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  onWithdraw: (mint: string) => void;
  positions: Asset[];
  loading: boolean;
}

export default function PortfolioTable({ positions, onWithdraw, loading }: Props) {
  const [activeTab, setActiveTab] = useState<string>("holdings");
  const [hideLowLiq, setHideLowLiq] = useState<boolean>(false);
  const [hideSmallAsset, setHideSmallAsset] = useState<boolean>(false);
  const [hideSellOut, setHideSellOut] = useState<boolean>(false);

  const tabs: TabItem[] = [
    {
      id: "holdings",
      label: "Holdings",
    },
  ];

  const columns: Column<any>[] = [
    {
      header: "TOKEN / LAST ACTIVE",
      key: "token",
      align: "left",
      minWidth: "170px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3D3D3D]" />
          <div>
            <div>{row.name}</div>
            <div className="text-[#A9A9A9] text-xs">{row.lastActive}</div>
          </div>
        </div>
      ),
    },
    {
      header: "UNREALIZED PnL",
      key: "pnl",
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
      minWidth: "180px",
      render: (value) => (
        <div className="flex justify-end gap-2 items-center">
          <Button
            onClick={() => onWithdraw(value)}
            className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-end font-semibold gap-2.5"
          >
            <span>
              <Image
                src="/icons/blink.svg"
                alt="blink"
                width={25}
                height={25}
              />
            </span>
            <span className="w-full">QUICK SELL</span>{" "}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex md:justify-between md:items-center pb-3 border-b border-[#353535] max-md:flex-col max-md:gap-3">
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
      </div>

      <div className="mt-2">
        {loading ? (
          <div
            className={
              "text-center h-[150px] flex items-center justify-center text-[#716F7A]"
            }
          >
            Loading...
          </div>
        ) : (
          <Table
            data={positions}
            columns={columns}
            className="text-[13px] max-md:text-[11px]"
          />
        )}
      </div>
    </div>
  );
}
