"use client";

import {useEffect, useState} from "react";
import {GetTotalsResponse, Totals, TradesClient} from "@/submodule/src";

const TIMES = ['5M', '1H', '6H', '24H']

export default function Statistics({address}: {address: string}) {

  const [totals, setTotals] = useState<({id: number} & Totals)[]>([]);
  const [selectedMode, setSelectedMode] = useState<{id: number} & Totals | null>(null);

  useEffect(() => {
    const fetchWsClient = async () => {
      console.log(process.env.NEXT_PUBLIC_WS_URL)
      const client = TradesClient.websocket(process.env.NEXT_PUBLIC_WS_URL!);
      const total_data = await client.getTotals({
        amm: address,
        dir: 0
      })
      const totals_formatted = total_data.map((total, index) => ({
        id: index,
        ...total
      }))

      setTotals(totals_formatted);
      setSelectedMode(totals_formatted[0]);
    }

    fetchWsClient();
  }, [address])

  if(!selectedMode) return <></>;

  console.log(totals);

  return (
    <div className="rounded-md bg-[#202020] max-md:hidden overflow-hidden">
      <div className="flex justify-stretch ">
        {totals.map((mode, index: number) => (
          <span
            key={index}
            onClick={() => setSelectedMode(mode)}
            className={`text-center cursor-pointer overflow-hidden w-full ${
              selectedMode.id === mode.id ? "bg-[#353535]" : ""
            } border-r border-b border-[#353535] p-3 last:border-r-0`}
          >
            <div className="text-[12px] text-[#A9A9A9]">{TIMES[index]}</div>
            <div
              className={`text-[14px] font-semibold ${
                mode.price_change_percentage <= 0 ? "text-[#00FFA3]" : "text-red-500"
              }`}
            >
              {mode.price_change_percentage}%
            </div>
          </span>
        ))}
      </div>
      <div className="flex p-3 px-5">
        <div className="flex flex-col text-[14px] gap-3 border-r pr-4.5 border-[#353535]">
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">TXNS</div>
            <div>
              {(selectedMode.buys + selectedMode.sells).toLocaleString("en-US")}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">VOLUME</div>
            <div>
              $
              {selectedMode.buys.toLocaleString("en-US", {
                maximumFractionDigits: 1,
                notation: "compact",
                compactDisplay: "short",
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">MAKERS</div>
            <div>{(selectedMode.buyers + selectedMode.sellers).toLocaleString('en-US')}</div>
          </div>
        </div>
        <div className="w-full pl-3 flex flex-col gap-2 justify-between text-[14px]">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9]">BUYS</div>
                <div>{selectedMode.buys.toLocaleString("en-US")}</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9]">SELLS</div>
                <div>{selectedMode.sells.toLocaleString("en-US")}</div>
              </span>
            </div>
            <div className="w-full h-1 bg-red-500 rounded-full">
              <div
                className={`h-full bg-[#00FFA3] rounded-full`}
                style={{
                  width:
                    ((selectedMode.buys /
                      (selectedMode.buys + selectedMode.sells)) *
                      100 || 0) + "%",
                }}
              />
            </div>{" "}
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9]">BUY VOL</div>
                <div>
                  $
                  {selectedMode.buyers.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                    notation: "compact",
                    compactDisplay: "short",
                  })}
                </div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9]">SELL VOL</div>
                <div>
                  $
                  {selectedMode.sellers.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                    notation: "compact",
                    compactDisplay: "short",
                  })}
                </div>
              </span>
            </div>
            <div className="w-full h-1 bg-red-500 rounded-full">
              <div
                className={`h-full bg-[#00FFA3] rounded-full`}
                style={{
                  width:
                    ((selectedMode.sellers /
                      (selectedMode.sellers + selectedMode.sells)) *
                      100 || 0) + "%",
                  maxWidth: "100%",
                }}
              />
            </div>{" "}
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9]">BUYERS</div>
                <div>{selectedMode.buyers.toLocaleString("en-US")}</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9]">SELLERS</div>
                <div>{selectedMode.sellers.toLocaleString("en-US")}</div>
              </span>
            </div>
            <div className="w-full h-1 bg-red-500 rounded-full">
              <div
                className={`h-full bg-[#00FFA3] rounded-full`}
                style={{
                  width:
                    ((selectedMode.buys /
                      (selectedMode.buys + selectedMode.sells)) *
                      100 || 0) + "%",
                }}
              />
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
