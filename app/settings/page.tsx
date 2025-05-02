"use client";

import Card from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";
import Image from "next/image";
import {useEffect, useLayoutEffect, useState} from "react";
import {authAPI} from "@/api/authAPI";
import {UpdateSettingsParams} from "@/submodule/src";

enum Menu {
  quick_buy = "Quick buy",
  quick_sell = "Quick sell",
  auto_buy = "Auto buy",
  auto_sell = "Auto sell",
  general = "General",
}

enum Settings {
  s1 = "S1",
  s2 = "S2",
  s3 = "S3",
}

enum Speed {
  default = "Default",
  auto = "Auto",
}

export default function SettingsPage() {
  const [referralLink, setReferralLink] = useState<string>("");
  const [primaryWallet, setPrimaryWallet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setReferralLink("P32Us8svisoWHcqGEQ2NLC3tYbypwvL3Vp7qkKcGpump321");
    setPrimaryWallet("P32Us8svisoWHcqGEQ2NLC3tYbypwvL3Vp7qkKcGpump123");
  });

  const [selectedMenu, setSelectedMenu] = useState<Menu>(Menu.quick_buy);
  const [selectedSettings, setSelectedSettings] = useState<Settings>(
    Settings.s1
  );
  const [speed, setSpeed] = useState<Speed>(Speed.auto);
  const [selectedQuickBuySettings, setSelectedQuickBuySettings] =
    useState<Settings>(Settings.s1);


  const [slippage, setSlippage] = useState<number>();

  const handleSettingsChange = async (params: UpdateSettingsParams) => {
    const user = await authAPI.getUser();

    const updatedSettings = await user.updateSettings(params);
    setSlippage(updatedSettings.slippage);
  }

  useEffect(() => {
    if (!slippage) return;

    const timeout = setTimeout(() => {
      handleSettingsChange({ slippage });
    }, 1000);

    return () => clearTimeout(timeout); // Сброс таймера при каждом изменении slippage
  }, [slippage]);

  useLayoutEffect(() => {
    const fetchUser = async () => {
        setLoading(true);
        const user = await authAPI.getUser();
        const settings = await user.getSettings();
        setSlippage(settings.slippage)
      setLoading(false);
    }

    fetchUser()
  }, []);

  if(loading) {
    return <div className={'h-full w-full flex justify-center items-center'}>
      Loading...
    </div>
  }

  const getSettings = () => {
    switch (selectedMenu) {
      case Menu.quick_buy:
        return (
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-2">
              <div>TRANDING PRESETS</div>
              <div className="text-[#A9A9A9] text-[12px]">
                Customize up to 3 different settings and instantly switch
                between them
              </div>

              <div className="flex gap-3 mt-3">
                {Object.values(Settings).map((settingsItem: Settings) => (
                  <span
                    onClick={() => setSelectedSettings(settingsItem)}
                    className={`border-2 p-2 px-3.5 cursor-pointer ${
                      settingsItem === selectedSettings
                        ? "border-[#AEFF00] text-[#AEFF00]"
                        : "border-[#716F7A]"
                    } rounded-xl`}
                    key={settingsItem}
                  >
                    {settingsItem}
                  </span>
                ))}
              </div>
            </header>

            <main className="border-[#353535] border rounded-xl">
              <header className="p-4 border-b border-[#353535] text-[#AEFF00]">
                {selectedSettings} PRESET
              </header>

              <main>
                <div className="p-4 flex flex-col gap-3 border-b border-[#353535]">
                  <header className="flex flex-col gap-1">
                    <h3>SLIPPAGE</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      How much less tokens you’re willing to receive from a
                      trade due to price volatility
                    </div>
                  </header>
                  <div className="flex gap-2 items-center">
                    <span>
                      <input type={'number'} max={100} value={slippage as number} onChange={(e) => setSlippage(Number(e.target.value))} className="border-[#716F7A] border w-[100px] p-2 rounded-xl" />
                    </span>
                    <span>%</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 border-b border-[#353535]">
                  <header className="flex flex-col gap-1">
                    <h3>SMART-MEV PROTECTION</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      Choose between Fast and Secure to fully customize how you
                      send transactions
                    </div>
                  </header>
                  <div className="flex gap-2 items-center text-[#A9A9A9]">
                    <span>Fast</span>
                    <span>
                      <Switch />
                    </span>
                    <span>Secure</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 border-b border-[#353535]">
                  <header className="flex flex-col gap-1">
                    <h3>SET SPEED</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      Switch between default and auto to customize the speed of
                      your transactions
                    </div>
                  </header>
                  <div className="flex gap-2 items-center text-[#A9A9A9]">
                    {Object.values(Speed).map((speedItem: Speed) => (
                      <span
                        onClick={() => setSpeed(speedItem)}
                        className={`border-2 p-2 w-[125px] flex justify-center items-center cursor-pointer ${
                          speedItem === speed
                            ? "border-[#AEFF00] text-[#AEFF00]"
                            : "border-[#716F7A]"
                        } rounded-xl`}
                        key={speedItem}
                      >
                        {speedItem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 border-b border-[#353535]">
                  <header className="flex flex-col gap-1">
                    <h3>PRIORITY FEE</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      The amount you send to validators to pick up your
                      transaction. We recommend using an amount that’s equal to
                      or higer than the median
                    </div>
                  </header>
                  <div className="flex gap-2 items-center">
                    <span>
                      <input className="border-[#716F7A] border w-[100px] p-2 rounded-xl" />
                    </span>
                    <span>SOL</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 border-b border-[#353535]">
                  <header className="flex flex-col gap-1">
                    <h3>BRIBERY AMOUNT</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      An additional tip to incentivize validators to pick up
                      your transactions faster
                    </div>
                  </header>
                  <div className="flex gap-2 items-center">
                    <span>
                      <input className="border-[#716F7A] border w-[100px] p-2 rounded-xl" />
                    </span>
                    <span>SOL</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <header className="flex flex-col gap-1">
                    <h3>CUSTOMIZE</h3>
                    <div className="text-[#A9A9A9] text-[12px]">
                      Customize your Quick Buy buttons with your own preset
                      amounts
                    </div>
                  </header>
                  <div className="flex gap-2 justify-between items-center max-md:flex-col max-md:items-start">
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2 w-full rounded-xl" />
                    </span>
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2 w-full rounded-xl" />
                    </span>
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2 w-full rounded-xl" />
                    </span>
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2 w-full rounded-xl" />
                    </span>
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2 w-full rounded-xl" />
                    </span>
                    <span>
                      <span className="absolute ml-3 mt-4">
                        <Image
                          src="/icons/solan.svg"
                          width={13}
                          height={13}
                          alt="search"
                        />
                      </span>
                      <input className="border-[#716F7A] pl-7 border p-2  w-full rounded-xl" />
                    </span>
                  </div>
                </div>
              </main>
            </main>

            <footer className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div>CLIPBOARD QUICK BUY</div>
                <div className="text-[#A9A9A9] text-[12px]">
                  Set buy amount for any token pair copied to clipboard
                </div>

                <div>
                  <span className="absolute ml-3 mt-4">
                    <Image
                      src="/icons/solan.svg"
                      width={13}
                      height={13}
                      alt="search"
                    />
                  </span>
                  <input className="border-[#716F7A] pl-7 border w-[140px] p-2 rounded-xl" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div>CLIPBOARD QUICK BUY SETTINGS</div>
                <div className="text-[#A9A9A9] text-[12px]">
                  Choose an existing setting preset for clipboard Quick Buy
                </div>

                <div className="flex gap-3 mt-3">
                  {Object.values(Settings).map((settingsItem: Settings) => (
                    <span
                      onClick={() => setSelectedQuickBuySettings(settingsItem)}
                      className={`border-2 p-2 px-3.5 cursor-pointer ${
                        settingsItem === selectedQuickBuySettings
                          ? "border-[#AEFF00] text-[#AEFF00]"
                          : "border-[#716F7A]"
                      } rounded-xl`}
                      key={settingsItem}
                    >
                      {settingsItem}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div>CLIPBOARD QUICK BUY WALLETS</div>
                <div className="text-[#A9A9A9] text-[12px]">
                  Choose the wallet(s) to buy using clipboard Quick Buy
                </div>

                <div className="flex gap-3 mt-3">
                  <span>
                    <span className="absolute ml-3 mt-3.5">
                      <Image
                        src="/icons/solan.svg"
                        width={13}
                        height={13}
                        alt="search"
                      />
                    </span>
                    <select className="border-[#716F7A] px-7 border p-2 rounded-xl">
                      <option>Select wallets</option>
                    </select>
                  </span>
                </div>
              </div>
            </footer>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Settings</h1>
        <span>
          <Switch /> Show tips
        </span>
      </div>

      <header>
        <Card className="flex max-xl:flex-col max-xl:gap-3">
          <span className="flex gap-3 items-center max-xl:items-start max-xl:flex-col pr-4 max-xl:p-0 max-xl:border-0 border-r max-xl:gap-0 border-[#353535]">
            <span>YOUR REFERRAL LINK</span>
            <span className="p-3 bg-[#353535] rounded-full flex items-center gap-2">
              <span className="break-all text-[12px]">{referralLink}</span>
              <span>
                <Image
                  className="cursor-pointer"
                  src="/icons/copy.svg"
                  width={20}
                  height={20}
                  alt="copy"
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                />
              </span>
            </span>
          </span>

          <span className="flex gap-3 max-xl:gap-0 max-xl:items-start items-center pl-4 max-xl:flex-col max-xl:p-0">
            <span>PRIMARY GENERATED WALLET</span>
            <span className="p-3 bg-[#353535] rounded-full flex items-center gap-2">
              <span className="break-all text-[12px]">{primaryWallet}</span>
              <span>
                <Image
                  className="cursor-pointer"
                  src="/icons/copy.svg"
                  width={20}
                  height={20}
                  alt="copy"
                  onClick={() => navigator.clipboard.writeText(primaryWallet)}
                />
              </span>
            </span>
          </span>
        </Card>
      </header>

      <main className="flex gap-5 max-md:flex-col">
        <Card className="w-full">
          <header className="border-b border-[#353535] gap-3 flex items-center max-md:text-[10px]">
            {Object.values(Menu).map((val: Menu) => (
              <span
                className={`cursor-pointer text-[#A9A9A9] px-2 ${
                  selectedMenu === val && "border-b-2 pb-2 border-[#AEFF00]"
                }`}
                key={val}
                onClick={() => setSelectedMenu(val)}
              >
                {val}
              </span>
            ))}
          </header>

          <main className="mt-3">{getSettings()}</main>
        </Card>

        <Card className="h-full max-w-[30%] max-md:max-w-full">
          <header className="text-3xl my-1 mb-5">What is Slippage?</header>
          <main className="text-[#A9A9A9] flex flex-col gap-3 ">
            <div>
              Suppose you wanted to spend 1 sol to buy 10 $MOON tokens, and you
              have your slippage set to 10%. You place your order, and when it's
              confirmed, you see that instead of 10 $MOON tokens, you only
              received 9 $MOON tokens.
            </div>
            <div>
              In this case, you just experienced slippage of 10% because of
              price fluctuations and it decreased your total buying power. In
              the scenario above, if the price had fluctuated even more, and
              Photon estimates that you would only have received 8 $MOON tokens
              for your 1 sol, the transaction would have failed, as this was
              above your slippage setting of 10%.
            </div>
            <div>
              Slippage essentially represents how much fewer tokens you would be
              willing to accept for your transaction.
            </div>
          </main>
        </Card>
      </main>
    </div>
  );
}
