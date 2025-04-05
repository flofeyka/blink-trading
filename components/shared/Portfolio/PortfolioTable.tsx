"use client";
import { useState } from "react";
import Image from "next/image";
import Table, { Column } from "../../ui/Table";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";

interface PortfolioItem {
  token: string;
  lastActive: string;
  unrealized: number;
  realizedProfit: number;
  totalProfit: number;
  balance: number;
  bought: {
    amount: number;
    price: number;
  };
  sold: {
    amount: number;
    price: number;
  };
}

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export default function PortfolioTable() {
  const [activeTab, setActiveTab] = useState<string>("holdings");
  const [hideLowLiq, setHideLowLiq] = useState(false);
  const [hideSmallAsset, setHideSmallAsset] = useState(false);
  const [hideSellOut, setHideSellOut] = useState(false);

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

  const portfolioData: PortfolioItem[] = [
    {
      token: "WHALE",
      lastActive: "4.4M",
      unrealized: 13.54,
      realizedProfit: 11.34,
      totalProfit: 24.88,
      balance: 13.43,
      bought: {
        amount: 5555.44,
        price: 0.0055,
      },
      sold: {
        amount: 55.44,
        price: 0.0055,
      },
    },
  ];

  const columns: Column<PortfolioItem>[] = [
    {
      header: "TOKEN / LAST ACTIVE",
      key: "token",
      align: "left",
      sortable: true,
      minWidth: "170px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3D3D3D]" />
          <div>
            <div>{row.token}</div>
            <div className="text-[#A9A9A9] text-xs">{row.lastActive}</div>
          </div>
        </div>
      ),
    },
    {
      header: "UNREALIZED",
      key: "unrealized",
      sortable: true,
      minWidth: "130px",
      align: "left",
      render: (value) => (
        <span>
          <div>$0</div>
          <div className="text-[#00FFA3]"> +{value.toFixed(2)}%</div>
        </span>
      ),
    },
    {
      header: "REALIZED PROFIT",
      key: "realizedProfit",
      sortable: true,
      minWidth: "150px",
      align: "left",
      render: (value) => (
        <span className="text-[#00FFA3]">
          <div>+$33.4k</div>
          <div>+4K%</div>
        </span>
      ),
    },
    {
      header: "TOTAL PROFIT",
      key: "totalProfit",
      sortable: true,
      minWidth: "130px",
      align: "left",
      render: (value) => (
        <span className="text-[#00FFA3]">
          <div>+$33.4k</div>
          <div>+4K%</div>
        </span>
      ),
    },
    {
      header: "BALANCE",
      key: "balance",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col ">
          <div>$35.43</div>
          <div className="text-[#A9A9A9] text-xs">4.8M</div>
        </div>
      ),
    },
    {
      header: "BOUGHT",
      key: "bought",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col">
          <div>$355.54</div>
          <div className="text-[#A9A9A9] text-xs">$0.042355</div>
        </div>
      ),
    },
    {
      header: "SOLD",
      key: "sold",
      sortable: true,
      align: "left",
      minWidth: "130px",
      render: (value) => (
        <div className="flex flex-col">
          <div>$35.5k</div>
          <div className="text-[#A9A9A9] text-xs">$0.0005</div>
        </div>
      ),
    },
    {
      header: "",
      key: "token",
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
    {
      header: "",
      key: "token",
      align: "right",
      minWidth: "180px",
      render: () => (
        <div className="flex justify-end gap-2 items-center">
          <Button className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-end font-semibold gap-2.5">
            <span>
              <Image
                src="/icons/blink.svg"
                alt="blink"
                width={25}
                height={25}
              />
            </span>
            <span className="w-full">
              QUICK SELL
            </span>{" "}
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

        <div className="md:flex items-center gap-4 text-[#716F7A] hidden">
          <span className="flex items-center gap-2">
            <Checkbox checked={hideLowLiq} setChecked={setHideLowLiq} />
            Hide Low Liq / Honeypot
          </span>
          <span className="flex items-center gap-2">
            <Checkbox checked={hideSmallAsset} setChecked={setHideSmallAsset} />
            Hide Small Asset
          </span>
          <span className="flex items-center gap-2">
            <Checkbox checked={hideSellOut} setChecked={setHideSellOut} />
            Hide Sell Out
          </span>
        </div>
      </div>

      <div className="mt-2">
        <Table
          data={portfolioData}
          columns={columns}
          className="text-[13px] max-md:text-[11px]"
        />
      </div>
    </div>
  );
}
