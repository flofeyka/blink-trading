"use client";
import {useLayoutEffect, useState} from "react";
import Image from "next/image";
import Table, { Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import {authAPI} from "@/api/authAPI";

interface OrderItem {
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

export default function Orders() {
  const [activeTab, setActiveTab] = useState<string>("holdings");
  const [hideLowLiq, setHideLowLiq] = useState(false);
  const [hideSmallAsset, setHideSmallAsset] = useState(false);
  const [hideSellOut, setHideSellOut] = useState(false);

  const [orderData, setOrdersData] = useState<any | null>(null);

  useLayoutEffect(() => {
    const fetchUser = async () => {
        const user = await authAPI.getUser();
        const orderInfo = await user.getOrders();
        setOrdersData(orderInfo);
    }

    fetchUser()
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

  const ordersData: OrderItem[] = [
    {
      token: "WHALE",
      lastActive: "4.4M",
      unrealized: 13.54,
      realizedProfit: 11.34,
      totalProfit: 24.88,
      balance: 13.43,
      bought: {
        amount: 350.54,
        price: 0.0042355,
      },
      sold: {
        amount: 55.36,
        price: 0.0055,
      },
    },
  ];

  const columns: Column<OrderItem>[] = [
    {
      header: "TOKEN / LAST ACTIVE",
      key: "token",
      align: "left",
      sortable: true,
      minWidth: "170px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3D3D3D] flex items-center justify-center">
            <div className="w-[8px] h-[8px] bg-green-500 rounded-full"></div>
          </div>
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
          <div>+$31.4k</div>
          <div className="text-[#00FFA3]">+{value.toFixed(2)}%</div>
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
          <div>+44%</div>
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
          <div>+44%</div>
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
        <div className="flex flex-col">
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
          <div>${value.amount.toFixed(2)}</div>
          <div className="text-[#A9A9A9] text-xs">${value.price}</div>
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
          <div>${value.amount.toFixed(2)}</div>
          <div className="text-[#A9A9A9] text-xs">${value.price}</div>
        </div>
      ),
    },
    {
      header: "",
      key: "token",
      align: "right",
      minWidth: "200px",
      render: () => (
        <div className="flex justify-end items-center">
          <Button className="bg-gradient-to-r from-[#F43500] to-[#AA1013] flex items-center justify-center font-semibold gap-2 py-2 px-3">
            <span>QUICK SELL</span>
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
            data={ordersData}
            columns={columns}
            className="text-[13px] max-md:text-[11px]"
          />
        </div>
      </div>
    </div>
  );
}
