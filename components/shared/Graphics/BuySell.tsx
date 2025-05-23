"use client";

import Image from "next/image";
import Switch from "../../ui/Switch";
import Checkbox from "../../ui/Checkbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../../ui/Button";
import { userAPI } from "@/lib/api/userAPI";
import { toast } from "react-toastify";
import { BlinkClient } from "blink-sdk";

enum Mode {
  buy = "BUY",
  sell = "SELL",
}

enum Speed {
  default = "Default",
  auto = "Auto",
}

type Props = {
  setDataMode: Dispatch<SetStateAction<boolean>>;
  mint: string;
};

export default function BuySell({ setDataMode, mint }: Props) {
  const [isBuyNow, setIsBuyNow] = useState<boolean>(false);
  const [isBuyDip, setIsBuyDip] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>(Mode.buy);
  const [speedMode, setSpeedMode] = useState<Speed>(Speed.default);
  const [briberyAmount, setBriberyAmount] = useState<number>(0.015);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const isAdvancedValid = briberyAmount > 0.015;
  const [slippage, setSlippage] = useState<number>(100);

  useEffect(() => {
    const fetchSlippage = async () => {
      const client = await userAPI.getUser();
      const slippage = await client.getSettings();
      setSlippage(slippage.slippage);
    };

    fetchSlippage();
  }, []);

  useEffect(() => {
    setAmount(0);
  }, [mode]);

  const onSwap = async () => {
    if (!amount) {
      toast.error("Please enter an amount", {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    const client = await userAPI.getUser();

    toast.info("Swapping...", {
      position: "bottom-right",
    });
    try {
      const swap = await client.swap({
        side: mode === Mode.buy ? "buy" : "sell",
        mint,
        amount: amount.toString(),
        slippage,
        percentile: "_50",
      });

      const wsClient = await userAPI.getUser(undefined, "wss");

      return await wsClient.subscribeTransactionsStatuses((result) => {
        toast(result.status.status);
      });

      // if (swap) {
      //   toast("Success!", {
      //     position: "bottom-right",
      //     style: {
      //       backgroundColor: "#202020",
      //       color: "white",
      //     },
      //   });
      // }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Error during swap");
    }
  };
  const getBuySell = () => {
    switch (mode) {
      case Mode.buy:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center w-full max-md:hidden text-[#716F7A]">
              <span className="flex items-center gap-2">
                <Checkbox checked={isBuyDip} setChecked={setIsBuyDip} />
                Buy Dip
              </span>
              <span className="flex items-center gap-2">
                <Checkbox checked={isBuyNow} setChecked={setIsBuyNow} />
                Buy Now
              </span>
              <span className="flex items-center gap-2">
                <Switch /> Insta buy
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Image
                  src="/icons/cardholder_white.svg"
                  className="w-[25px] h-[30px] md:hidden"
                  width={30}
                  height={30}
                  alt="cardholder"
                />
                <button
                  onClick={() => setAmount(0.25)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">0.25</span>
                </button>
                <button
                  onClick={() => setAmount(0.5)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">0.5</span>
                </button>
                <button
                  onClick={() => setAmount(1)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">1</span>
                </button>
              </div>
              <div className="flex gap-3 max-md:hidden">
                <button
                  onClick={() => setAmount(2)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">2</span>
                </button>
                <button
                  onClick={() => setAmount(5)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">5</span>
                </button>
                <button
                  onClick={() => setAmount(10)}
                  className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer border-2 flex rounded-xl"
                >
                  <span>
                    <Image
                      className="cursor-pointer h-[30px] w-auto"
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <span className="flex justify-self-center w-full">10</span>
                </button>
              </div>
              <div className="max-md:flex gap-2 justify-stretch items-center w-full">
                <Image
                  src="/icons/settings.svg"
                  width={30}
                  className="w-[25px] h-[30px] md:hidden"
                  height={30}
                  alt="settings"
                />

                <span className="w-full">
                  <span className="absolute ml-3 mt-2.5">
                    <Image
                      src="/icons/solan.svg"
                      width={17}
                      height={17}
                      alt="search"
                    />
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    type={"number"}
                    placeholder="Amount to buy in SOL"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
              </div>
            </div>
          </div>
        );
      case Mode.sell:
        return (
          <div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center w-full max-md:hidden text-[#716F7A]">
                <span className="flex items-center gap-2">
                  <Checkbox checked={isBuyDip} setChecked={setIsBuyDip} />
                  Sell Dip
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox checked={isBuyNow} setChecked={setIsBuyNow} />
                  Sell Now
                </span>
                <span className="flex items-center gap-2">
                  <Switch /> Insta sell
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <Image
                    src="/icons/cardholder_white.svg"
                    className="w-[25px] h-[30px]"
                    width={35}
                    height={35}
                    alt="cardholder"
                  />
                  <span className="w-full">
                    <button
                      onClick={() => setAmount(25)}
                      className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer w-full border-2 flex rounded-xl"
                    >
                      <span className="flex justify-self-center w-full">
                        25%
                      </span>
                    </button>
                  </span>
                  <span className="w-full">
                    <button
                      onClick={() => setAmount(50)}
                      className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer w-full border-2 flex rounded-xl"
                    >
                      <span className="flex justify-self-center w-full">
                        50%
                      </span>
                    </button>
                  </span>
                  <span className="w-full">
                    <button
                      onClick={() => setAmount(100)}
                      className="border-[#716F7A] h-[40px] w-full items-center px-3 gap-3 cursor-pointer w-full border-2 flex rounded-xl"
                    >
                      <span className="flex justify-self-center w-full">
                        100%
                      </span>
                    </button>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icons/settings.svg"
                  width={37}
                  className="w-[25px] pr-[2px] h-[30px]"
                  height={30}
                  alt="cardholder"
                />
                <span className="text-[#716F7A] font-semibold max-md:hidden">
                  or
                </span>
                <span className="flex w-full">
                  <select className="border-[#716F7A] pl-2 border-2 border-r-0 p-2 rounded-xl rounded-r-none text-[#716F7A]">
                    <option className="max-md:hidden flex items-center gap-2 max-md:bg-[url('/icons/solan.svg')] max-md:bg-no-repeat max-md:bg-center max-md:bg-contain w-[10px] max-md:h-full">
                      {/* <Image
                        src="/icons/solan.svg"
                        width={20}
                        height={20}
                        alt="solana"
                        className="inline-block"
                      /> */}
                      SOL
                    </option>
                  </select>
                  <input
                    value={amount}
                    type={"number"}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="Amount to sell in SOL"
                    className="border-[#716F7A] rounded-l-none pl-2 border-2 p-2 w-full rounded-xl"
                  />
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return;
    }
  };

  const getBuySellButton = () => {
    switch (mode) {
      case Mode.buy:
        return (
          <div>
            <Button
              onClick={onSwap}
              className="w-full h-10 flex font-semibold justify-center items-center gap-2.5 text-xl"
            >
              <span>
                <Image
                  src="/icons/blink.svg"
                  alt="blink"
                  width={25}
                  height={25}
                />
              </span>
              <span>SWAP</span>
            </Button>
          </div>
        );
      case Mode.sell:
        return (
          <Button
            onClick={onSwap}
            className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-center font-semibold w-full gap-2.5"
          >
            <span>
              <Image
                src="/icons/blink.svg"
                alt="blink"
                width={25}
                height={25}
              />
            </span>
            <span>QUICK SELL</span>
          </Button>
        );
      default:
        return;
    }
  };

  return (
    <div className="rounded-md overflow-hidden ">
      <div className="flex justify-between">
        {Object.values(Mode).map((modeItem: Mode, index: number) => (
          <span
            key={modeItem}
            onClick={() => setMode(modeItem)}
            className={`text-center justify-stretch w-full cursor-pointer ${
              mode === modeItem ? "bg-[#353535]" : "bg-[#202020]"
            } ${
              index + 1 === Object.values(Mode).length &&
              "max-md:rounded-tr-md z-20"
            } border-r border-b border-[#353535] p-3`}
          >
            <div className="text-[14px] text-[#A9A9A9] flex items-center justify-center gap-3">
              <span>
                <Image
                  src="/icons/blink.svg"
                  width={20}
                  height={20}
                  alt="blink"
                />
              </span>
              <span>{modeItem}</span>
            </div>
          </span>
        ))}
        <span
          className={`text-center justify-stretch w-full cursor-pointer bg-[#181818] p-3 xl:hidden`}
        >
          <div
            className="text-[14px] text-[#A9A9A9] flex items-center justify-center gap-3"
            onClick={() => setDataMode((prev: boolean) => !prev)}
          >
            <span>
              <Image src="/icons/sort.svg" width={20} height={20} alt="blink" />
            </span>
            <span>Data</span>
          </div>
        </span>{" "}
      </div>
      <div className="p-5 flex bg-[#202020] flex-col gap-5">
        {getBuySell()}

        <div className="border-t border-b border-[#353535] py-2 max-md:hidden">
          <div
            onClick={() => setAdvancedMode((prev: boolean) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex gap-2 text-[14px]">
              <span>
                <Image
                  src="/icons/settings.svg"
                  width={20}
                  height={20}
                  alt="search"
                />
              </span>
              <span>Advanced settings</span>
            </span>
            <span className="flex gap-2">
              {!isAdvancedValid && (
                <span className="text-red-600 text-[12px]">Warning</span>
              )}
              <Image
                src="/icons/arrow-right.svg"
                width={20}
                height={20}
                alt="arrow"
                className={`${advancedMode ? "rotate-270" : "rotate-90"}`}
              />
            </span>
          </div>
          {advancedMode && (
            <div className="flex gap-5 flex-col pb-3 mt-3">
              <div className="flex gap-5">
                <span className="flex flex-col">
                  <label className="mb-3 text-[#716F7A]">Slippape %</label>
                  <input
                    placeholder="20"
                    className="w-[100px] p-2 border-[#716F7A] border-2 rounded-md"
                  />
                </span>
                <span className="flex flex-col gap-5">
                  <label className="text-[#716F7A]">Smart-Mev protection</label>
                  <div className="space-x-3">
                    <span>Fast</span>
                    <span>
                      <Switch />
                    </span>
                    <span>Secure</span>
                  </div>
                </span>
              </div>
              <div className="flex justify-stretch gap-2">
                {Object.values(Speed).map((speed: Speed) => (
                  <span
                    onClick={() => setSpeedMode(speed)}
                    key={speed}
                    className={`w-full flex justify-center cursor-pointer border-2 rounded-md p-2 ${
                      speed === speedMode
                        ? "border-[#AEFF00] text-[#AEFF00]"
                        : "border-[#716F7A]"
                    }`}
                  >
                    {speed}
                  </span>
                ))}
              </div>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <label className="mb-3 text-[#716F7A]">Slippape %</label>
                  <div className="flex w-full items-center gap-2">
                    <span className="w-full">
                      <input
                        placeholder="0.008"
                        className="p-2 w-full border-[#716F7A] border-2 rounded-md"
                      />
                    </span>
                    <span>SOL</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mb-3 text-[#716F7A]">BRIBERY AMOUNT</label>
                  <div className="flex items-center w-full gap-2">
                    <span className="w-full">
                      <input
                        placeholder="0.012"
                        className="p-2 border-[#716F7A] border-2 rounded-md w-full"
                        value={briberyAmount}
                        type="number"
                        onChange={(e) =>
                          setBriberyAmount(parseFloat(e.target.value))
                        }
                      />
                    </span>
                    <span>SOL</span>
                  </div>
                </div>

                <div className="text-red-400 text-[12px] text-center">
                  {!isAdvancedValid &&
                    "Please increase to >0.015 for better performance"}
                </div>
              </div>
            </div>
          )}
        </div>

        {getBuySellButton()}
      </div>
    </div>
  );
}
