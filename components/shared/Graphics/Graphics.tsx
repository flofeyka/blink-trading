"use client";

import { AssetsClient, GetAssetsInfoResponse, TokenMetadata } from "blink-sdk";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Image from "next/image";
import Switch from "@/components/ui/Switch";
import BuySell from "@/components/shared/Graphics/BuySell";
import Statistics from "@/components/shared/Graphics/Statistics";
import Transactions from "@/components/shared/Graphics/Transactions/Transactions";
import { shortenString } from "@/lib/utils/shortenString";
import Chart from "@/components/shared/Graphics/Chart";

export default function Graphics() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [dataMode, setDataMode] = useState<boolean>(false);

  const [assetsInfo, setAssetsInfo] = useState<GetAssetsInfoResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);

  const params = useParams<{ token: string }>();
  useEffect(() => {
    const fetchAssetsClient = async () => {
      if (!process.env.NEXT_PUBLIC_ASSETS_URL) {
        console.error("Next public assets url not provided");
        return;
      }
      setLoading(true);
      try {
        const client = AssetsClient.http(process.env.NEXT_PUBLIC_ASSETS_URL);
        const assets_info = await client.getAssetsInfo([params.token]);

        console.log("Token information received:", assets_info);

        if (!assets_info || assets_info.length === 0) {
          console.error("Token information not found");
          setChartError("Token not found");
          setLoading(false);
          return;
        }

        // Проверяем, есть ли информация о DEX
        if (!assets_info[0].dex_info || !assets_info[0].dex_info.address) {
          setChartError("DEX information is missing");
          setLoading(false);
          return;
        }

        console.log("Token ChainId:", assets_info[0].dex_info.address);

        setAssetsInfo(assets_info);
      } catch (error) {
        console.error("Error getting token information:", error);
        setChartError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetsClient();
  }, [params.token]);

  if (!assetsInfo || !params.token) {
    return (
      <div className={"h-full w-full flex justify-center items-center"}>
        {loading ? "Loading..." : "Token not found"}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-full">
      <div className="flex gap-5 max-md:flex-col w-full">
        {dataMode ? (
          <Card className="text-[12px]">
            <main className="flex flex-col gap-5">
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">Price USD / SOL</span>
                <span>
                  {Number(assetsInfo[0].price_usd).toFixed(4)} /{" "}
                  {Number(assetsInfo[0].price).toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">Liquidity</span>
                <span>{Number(assetsInfo[0].liquidity).toFixed(4)}</span>
              </div>
              <div className="flex justify-between w-[85%]">
                <span className="text-[#A9A9A9]">MKT Cap</span>
                <span>{Number(assetsInfo[0].market_cap).toFixed(4)}</span>
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
          <div className="w-full flex flex-col max-md:w-full overflow-hidden">
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
                    src={assetsInfo[0].image || "/icons/trump.svg"}
                    className="w-[30px] h-[30px] object-right-top rounded-full bg-[#3D3D3D]"
                    height={30}
                    width={30}
                    alt="coin"
                  />
                </span>
                <span>{assetsInfo[0].name}/SOL</span>
              </span>

              <span className="space-x-3 text-[#716F7A]">
                <Switch /> Outlier
              </span>
            </div>
            <Chart
              symbol={assetsInfo[0].symbol}
              address={assetsInfo[0].dex_info!.address}
              direction={assetsInfo[0].dex_info!.dir}
              decimals={assetsInfo[0].decimals}
            />
            <Transactions
              mint={assetsInfo[0].mint}
              direction={assetsInfo[0].dex_info!.dir}
              address={assetsInfo[0].dex_info!.address}
              decimals={assetsInfo[0].decimals}
              price_sol={+assetsInfo[0].price}
              price_usd={+assetsInfo[0].price_usd}
            />
          </div>
        )}

        <div className="flex md:max-w-[300px] md:min-w-[300px] text-[10px] max-md:w-full flex-col gap-5 flex-1">
          <Card className="font-medium max-md:hidden">
            <div className="flex border-b border-[#353535] gap-2 pb-3">
              <img
                src={assetsInfo[0].image || "/icons/trump.svg"}
                className="w-[40px] h-[40px] object-cover object-right-top rounded-full bg-[#3D3D3D]"
                height={30}
                width={30}
                alt="trump"
              />
              <div>
                <div className="flex gap-1 items-center text-lg">
                  <span className="pr-3 text-[12px] text-center">
                    {assetsInfo[0].name}
                  </span>
                  <span className="border-r text-[8px] border-[#353535] pr-2 text-[#A9A9A9]">
                    {assetsInfo[0].name}/USDC
                  </span>
                  <span className="text-[11px] text-green-400 pl-2 w-full break-keep">
                    Verity profile
                  </span>
                </div>
                <div className="flex gap-2 items-center text-lg">
                  <span className="text-[#A9A9A9] text-[12px]">
                    {shortenString(assetsInfo[0].dex_info!.address)}
                  </span>
                  <span>
                    <Image
                      className="cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          assetsInfo[0].dex_info!.address
                        )
                      }
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
                <div className="text-[#A9A9A9] mb-1 text-[12px]">PRICE USD</div>
                <div className="text-[14px]">
                  ${Number(assetsInfo[0].price_usd).toFixed(4)}
                </div>
              </span>
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">PRICE SOL</div>
                <div className="text-[14px]">
                  ${Number(assetsInfo[0].price).toFixed(4)} USDC
                </div>
              </span>
              <span>
                <div className="text-[#A9A9A9] mb-1 text-[12px]">SUPPLY</div>
                <div className="text-[14px]">
                  {(
                    Number(assetsInfo[0].supply) /
                    Math.pow(10, assetsInfo[0].decimals)
                  ).toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                    notation: "compact",
                    compactDisplay: "short",
                  })}
                </div>
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
                    {(Number(assetsInfo[0].liquidity) || 0).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 1,
                        notation: "compact",
                        compactDisplay: "short",
                      }
                    )}
                  </div>
                </span>
                <span>
                  <div className="text-[#A9A9A9] mb-1 text-[12px]">MKT CAP</div>
                  <div className="text-[14px]">
                    $
                    {(Number(assetsInfo[0].market_cap) || 0).toLocaleString(
                      "en-US",
                      {
                        notation: "compact",
                        compactDisplay: "short",
                      }
                    )}
                  </div>
                </span>
              </div>
            </div>
          </Card>
          <Statistics address={assetsInfo[0].dex_info!.address} />
          <BuySell mint={params.token} setDataMode={setDataMode} />
        </div>
      </div>
    </div>
  );
}
