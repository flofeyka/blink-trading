"use client";

import { select } from "framer-motion/client";
import { useState } from "react";

export default function Statistics() {
  const modes = [
    {
      id: 1,
      time: "5M",
      makers: 0,
      percent: 0.13,
      buys: 69,
      sells: 52,
      buyVol: 343000,
      sellVol: 28,
      buyers: 12,
      sellers: 2,
      txns: 105,
      volume: 551000,
    },
    {
      id: 2,
      makers: 57,
      time: "1H",
      percent: -1.02,
      buys: 940,
      sells: 1225,
      buyVol: 4300000,
      sellVol: 5900000,
      buyers: 56,
      sellers: 59,
      txns: 1257,
      volume: 6300000,
    },
    {
      id: 3,
      makers: 234,
      time: "6H",
      percent: -0.74,
      buys: 3046,
      sells: 3667,
      buyVol: 12100000,
      sellVol: 13800000,
      buyers: 131,
      sellers: 176,
      txns: 6755,
      volume: 26900000,
    },
    {
      id: 4,
      makers: 788,
      time: "24H",
      percent: 3.34,
      buys: 14642,
      sells: 15311,
      buyVol: 65200000,
      sellVol: 60300000,
      buyers: 496,
      sellers: 469,
      txns: 29923,
      volume: 125200000,
    },
  ];

  const [selectedMode, setSelectedMode] = useState(modes[0]);

  return (
    <div className="rounded-md bg-[#202020] max-md:hidden overflow-hidden">
      <div className="flex justify-stretch ">
        {modes.map((mode) => (
          <span
            key={mode.id}
            onClick={() => setSelectedMode(mode)}
            className={`text-center cursor-pointer overflow-hidden w-full ${
              mode.id === selectedMode.id ? "bg-[#353535]" : ""
            } border-r border-b border-[#353535] p-3 last:border-r-0`}
          >
            <div className="text-[12px] text-[#A9A9A9]">{mode.time}</div>
            <div
              className={`text-[14px] font-semibold ${
                mode.percent < 0 ? "text-[#00FFA3]" : "text-red-500"
              }`}
            >
              {mode.percent}%
            </div>
          </span>
        ))}
      </div>
      <div className="flex p-3 px-5">
        <div className="flex flex-col text-[14px] gap-3 border-r pr-4.5 border-[#353535]">
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">TXNS</div>
            <div>
              {selectedMode.txns.toLocaleString("en-US")}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">VOLUME</div>
            <div>
              $
              {selectedMode.volume.toLocaleString("en-US", {
                maximumFractionDigits: 1,
                notation: "compact",
                compactDisplay: "short",
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">MAKERS</div>
            <div>{selectedMode.makers}</div>
          </div>
        </div>
        <div className="w-full pl-3 flex flex-col gap-2 justify-between text-[14px]">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9]">BUYS</div>
                <div>{selectedMode.buys}</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9]">SELLS</div>
                <div>{selectedMode.sells}</div>
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
                  {selectedMode.buyVol.toLocaleString("en-US", {
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
                  {selectedMode.sellVol.toLocaleString("en-US", {
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
                    ((selectedMode.buyVol /
                      (selectedMode.sellVol + selectedMode.sellVol)) *
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
                <div>{selectedMode.buyers}</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9]">SELLERS</div>
                <div>{selectedMode.sellers}</div>
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
