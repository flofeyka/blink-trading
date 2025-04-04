"use client";

import Image from "next/image";
import Switch from "../../ui/Switch";
import Checkbox from "../../ui/Checkbox";
import { useState } from "react";
import Button from "../../ui/Button";

enum Mode {
  buy = "BUY",
  sell = "SELL",
}

enum Speed {
  default = "Default",
  auto = "Auto",
}

export default function BuySell() {
  const [isBuyNow, setIsBuyNow] = useState<boolean>(false);
  const [isBuyDip, setIsBuyDip] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>(Mode.buy);
  const [speedMode, setSpeedMode] = useState<Speed>(Speed.default);
  const [briberyAmount, setBriberyAmount] = useState<number>(0.015);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  const isAdvancedValid = briberyAmount > 0.015;

  const getBuySell = () => {
    switch (mode) {
      case Mode.buy:
        return (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center w-full text-[#716F7A]">
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
              <div className="flex gap-3">
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="0.25"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="0.5"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="1"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
              </div>
              <div className="flex gap-3">
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="2"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="5"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
                <span>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={15}
                      height={15}
                      alt="search"
                    />
                  </span>
                  <input
                    placeholder="10"
                    className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                  />
                </span>
              </div>
              <div>
                <span className="absolute ml-3 mt-3.5">
                  <Image
                    src="/icons/solan.svg"
                    width={20}
                    height={20}
                    alt="search"
                  />
                </span>
                <input
                  placeholder="Amount to buy in SOL"
                  className="border-[#716F7A] pl-9 border-2 p-2 w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        );
      case Mode.sell:
        return (
          <div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center w-full text-[#716F7A]">
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
                <div className="flex gap-3">
                  <span>
                    <input
                      placeholder="25%"
                      className="border-[#716F7A] pl-2 border-2 p-2 w-full rounded-xl"
                    />
                  </span>
                  <span>
                    <input
                      placeholder="50%"
                      className="border-[#716F7A] pl-2 border-2 p-2 w-full rounded-xl"
                    />
                  </span>
                  <span>
                    <input
                      placeholder="100%"
                      className="border-[#716F7A] pl-2 border-2 p-2 w-full rounded-xl"
                    />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#716F7A] font-semibold">or</span>
                <span className="flex w-full">
                  <select className="border-[#716F7A] pl-2 border-2 border-r-0 p-2 rounded-xl rounded-r-none text-[#716F7A]">
                    <option>SOL</option>
                  </select>
                  <input
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
            <Button className="w-full h-10 flex font-semibold justify-center items-center gap-2.5 text-xl">
              <span>
                <Image
                  src="/icons/blink.svg"
                  alt="blink"
                  width={25}
                  height={25}
                />
              </span>
              <span>QUICK BUY</span>
            </Button>
          </div>
        );
      case Mode.sell:
        return (
          <Button className="bg-linear-to-r from-[#F43500] to-[#AA1013] flex items-center justify-center font-semibold w-full gap-2.5">
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
    <div className="rounded-md overflow-hidden bg-[#202020] max-md:w-full">
      <div className="flex justify-between">
        {Object.values(Mode).map((modeItem: Mode) => (
          <span
            key={modeItem}
            onClick={() => setMode(modeItem)}
            className={`text-center justify-stretch w-full cursor-pointer ${
              mode === modeItem && "bg-[#353535]"
            } border-r border-b border-[#353535] p-3`}
          >
            <div className="text-[14px] text-[#A9A9A9] flex items-center justify-center gap-3">
              <span>
                {" "}
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
      </div>
      <div className="p-5 flex flex-col gap-5">
        {getBuySell()}

        <div className="border-t border-b border-[#353535] py-2">
          <div
            onClick={() => setAdvancedMode((prev: boolean) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex gap-2">
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
                <span className="text-red-600">Warning</span>
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
            <div className="flex gap-5 flex-col pb-3">
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
                          setBriberyAmount(Number(e.target.value))
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
