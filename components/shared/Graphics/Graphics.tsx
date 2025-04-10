"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../../ui/Card";
import Image from "next/image";
import BuySell from "./BuySell";
import Statistics from "./Statistics";
import Transactions from "./Transactions";
import Switch from "@/components/ui/Switch";

export default function Graphics() {
  const container: any = useRef(undefined);

  const [token, setToken] = useState<string>(
    "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
  );

  const [dataMode, setDataMode] = useState<boolean>(false);

  useEffect(() => {
    if (!dataMode) {
      const width = window.innerWidth;
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "height": "530",
          "autosize": true,
          "symbol": "COINBASE:TRUMPUSDC",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "range": "YTD",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "1000",
          "support_host": "https://www.tradingview.com"
        }`;
      if (width < 500) {
        script.innerHTML = `
            {
          "height": "270",
          "autosize": true,
          "symbol": "COINBASE:TRUMPUSDC",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "hide_legend": true,
          "allow_symbol_change": false,
          "save_image": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;
      }
      container.current.appendChild(script);
    }
  }, [dataMode]);

  const shortenString = (str: string, startLength = 3, endLength = 4) => {
    if (str.length <= startLength + endLength) return str;
    return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
  };

  return (
    <div className="flex flex-col gap-5 max-w-full">
      <div className="flex gap-5 max-md:flex-col max-w-full">
        {dataMode ? (
          <Card className="text-[12px]">
            <main className="flex flex-col gap-5">
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">Price USD / SOL</span>
                <span>$0.031245 / 0.052355</span>
              </div>
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">Liquidity</span>
                <span>$45K</span>
              </div>
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">MKT Cap</span>
                <span>$124.45K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9A9A9]">Invested/Sold</span>
                <span className="flex justify-between gap-7">
                  0.000000 / 0.000000
                  <Image
                    src="/icons/cardholder.svg"
                    width={20}
                    height={20}
                    alt="cardholder"
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9A9A9]">Remaining</span>
                <span className="flex justify-between gap-7">
                  0.000000
                  <Image
                    src="/icons/cardholder.svg"
                    width={20}
                    height={20}
                    alt="cardholder"
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9A9A9]">Change in P&L</span>
                <span className="text-[#F31D36] flex justify-between gap-7">
                  N/A{" "}
                  <Image
                    src="/icons/cardholder.svg"
                    width={20}
                    height={20}
                    alt="cardholder"
                  />
                </span>
              </div>
            </main>
          </Card>
        ) : (
          <div className="w-full max-md:w-full overflow-hidden">
            <div className="bg-[#202020] max-md:bg-[#181818] rounded-t-md px-3 p-1 flex items-center justify-between">
              <span className="items-center gap-2  flex">
                <span>
                  <Image
                    src="/icons/favourite.svg"
                    width={27}
                    height={27}
                    alt="favourite"
                    className="cursor-pointer"
                  />
                </span>
                <span>
                  <Image
                    src="/images/trump.jpg"
                    className="w-[30px] h-[30px] object-right-top rounded-full bg-[#3D3D3D]"
                    height={30}
                    width={30}
                    alt="trump"
                  />
                </span>
                <span>$TRUMP/USDC</span>
              </span>

              <span className="space-x-3 text-[#716F7A]">
                <Switch /> Outlier
              </span>
            </div>
            <div
              className="tradingview-widget-container"
              ref={container}
              style={{ height: "100%", width: "100%" }}
            >
              <div
                className="tradingview-widget-container__widget"
                style={{ height: "calc(100% - 32px)", width: "100%" }}
              ></div>
              <div></div>
            </div>
            <Transactions />
          </div>
        )}

        <div className="flex md:max-w-[300px] md:min-w-[300px] text-[10px] max-md:w-full flex-col gap-5 flex-1">
          <Card className="font-medium max-md:hidden">
            <div className="flex border-b border-[#353535] gap-2 pb-3">
              <Image
                src="/images/trump.jpg"
                className="w-[40px] h-[40px] object-cover object-right-top rounded-full bg-[#3D3D3D]"
                height={30}
                width={30}
                alt="trump"
              />
              <div>
                <div className="flex gap-1 items-center text-lg">
                  <span className="pr-3 text-[12px]">TRUMP</span>
                  <span className="border-r text-[8px] border-[#353535] pr-2 text-[#A9A9A9]">
                    TRUMP/USDC
                  </span>
                  <span className="text-[11px] text-green-400 pl-2 w-full break-keep">
                    Verity profile
                  </span>
                </div>
                <div className="flex gap-2 items-center text-lg">
                  <span className="text-[#A9A9A9] text-[12px]">
                    {shortenString(token)}
                  </span>
                  <span>
                    <Image
                      className="cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(token)}
                      src="/icons/copy.svg"
                      width={20}
                      height={20}
                      alt="copy"
                    />
                  </span>
                  <span>
                    <Image
                      src="/icons/x.svg"
                      width={20}
                      height={20}
                      alt="copy"
                    />
                  </span>
                  <span>
                    <Image
                      src="/icons/internet.svg"
                      width={20}
                      height={20}
                      alt="copy"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between py-3 border-b border-[#353535]">
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">LP BURNED</div>
                <div className="text-[14px]">$0.0045354</div>
              </span>
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">PRICE SOL</div>
                <div className="text-[14px]">$8.0109 USDC</div>
              </span>
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">SUPPLY</div>
                <div className="text-[14px]">1B</div>
              </span>
            </div>

            <div className="pt-3">
              <div className="w-[61%] flex justify-between">
                <span>
                  <div className="text-[#A9A9A9] mb-1 text-[12px]">
                    LIQUIDITY
                  </div>
                  <div className="text-[14px]">
                    $
                    {(335000000).toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                      notation: "compact",
                      compactDisplay: "short",
                    })}
                  </div>
                </span>
                <span>
                  <div className="text-[#A9A9A9] mb-1 text-[12px]">MKT CAP</div>
                  <div className="text-[14px]">
                    $
                    {(1600000000).toLocaleString("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    })}
                  </div>
                </span>
              </div>
            </div>
          </Card>
          <Statistics />
          <BuySell setDataMode={setDataMode} />
        </div>
      </div>
    </div>
  );
}
