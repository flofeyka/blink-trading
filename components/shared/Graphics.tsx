"use client";

import { useEffect, useRef } from "react";
import Card from "../ui/Card";
import Image from "next/image";

export default function Graphics() {
  const container: any = useRef(undefined);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "height": "530",
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
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
    container.current.appendChild(script);
  }, []);

  return (
    <div className="flex gap-5 max-md:flex-col">
      <div className="w-full">
        <div className="bg-[#202020] rounded-t-md px-3 p-1 flex items-center">
          <span>
            <Image
              src="/icons/favourite.svg"
              width={27}
              height={27}
              alt="favourite"
            />
          </span>
          <span>$efbweh</span>
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
          <div className="tradingview-widget-copyright">
            <a
              href="https://www.tradingview.com/"
              rel="noopener nofollow"
              target="_blank"
            >
              <span className="blue-text">
                Track all markets on TradingView
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Card className="w-full min-w-[20vw] font-medium">
          <div className="flex border-b border-[#353535] pb-3">
            <div>
              <span className="w-[50px] h-[50px] rounded-full bg-[##3D3D3D]" />
            </div>
            <div>
              <div className="flex gap-1 items-center text-lg">
                <span className="pr-3 text-[16px]">EFBWEH</span>
                <span className="border-r border-[#353535] pr-2 text-[12px] text-[#A9A9A9]">
                  efbw.eh
                </span>
                <span className="text-sm text-green-400 pl-2 w-full break-keep">
                  Verity profile
                </span>
              </div>
              <div className="flex gap-2 items-center text-lg">
                <span className="text-[#A9A9A9] text-[12px]">smd...34rj</span>
                <span>
                  <Image
                    src="/icons/copy.svg"
                    width={20}
                    height={20}
                    alt="copy"
                  />
                </span>
                <span>
                  <Image src="/icons/x.svg" width={20} height={20} alt="copy" />
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
              <div>$0.0045354</div>
            </span>
            <span>
              <div className="text-[#A9A9A9] mb-1 text-[12px]">PRICE SOL</div>
              <div>$0.0064748</div>
            </span>
            <span>
              <div className="text-[#A9A9A9] mb-1 text-[12px]">SUPPLY</div>
              <div>1B</div>
            </span>
          </div>

          <div className="pt-3">
            <div className="w-[61%] flex justify-between">
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">LIQUIDITY</div>
                <div>$13.4K</div>
              </span>
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">MKT CAP</div>
                <div>$4.67K</div>
              </span>
            </div>
          </div>
        </Card>

        <div className="rounded-md bg-[#202020]">
          <div className="flex justify-between">
            <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
              <div className="text-[12px] text-[#A9A9A9]">5M</div>
              <div className="text-[#00FFA3]">4.45%</div>
            </span>
            <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
              <div className="text-[12px] text-[#A9A9A9]">1H</div>
              <div className="text-[#00FFA3]">4.45%</div>
            </span>
            <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
              <div className="text-[12px] text-[#A9A9A9]">6H</div>
              <div className="text-[#00FFA3]">4.45%</div>
            </span>
            <span className="text-center w-[25%] focus:bg-[#353535] border-b border-[#353535] p-3">
              <div className="text-[12px] text-[#A9A9A9]">24H</div>
              <div className="text-[#00FFA3]">4.45%</div>
            </span>
          </div>
          <div className="flex p-3 px-5">
            <div className="flex flex-col gap-3 border-r border-[#353535] pr-2">
              <div className="flex flex-col gap-1">
                <div className="text-[#A9A9A9] text-[12px]">TXNS</div>
                <div>3</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[#A9A9A9] text-[12px]">VOLUME</div>
                <div>$233.34</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[#A9A9A9] text-[12px]">MAKERS</div>
                <div>3</div>
              </div>
            </div>
            <div className="w-full pl-3 flex flex-col justify-between">
              <div className="w-full">
                <div className="flex justify-between w-full">
                  <span>
                    <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                    <div>3</div>
                  </span>
                  <span className="text-end">
                    <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                    <div>0</div>
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
              </div>
              <div className="w-full">
                <div className="flex justify-between w-full">
                  <span>
                    <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                    <div>3</div>
                  </span>
                  <span className="text-end">
                    <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                    <div>0</div>
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
              </div>
              <div className="w-full">
                <div className="flex justify-between w-full">
                  <span>
                    <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                    <div>3</div>
                  </span>
                  <span className="text-end">
                    <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                    <div>0</div>
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
