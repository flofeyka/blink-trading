"use client";

import Image from "next/image";
import Input from "../../ui/Input";
import NavLink from "../../ui/NavLink";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { userAPI } from "@/lib/api/userAPI";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AssetsClient, GetAssetsInfoResponse } from "blink-sdk";
import Card from "@/components/ui/Card";
import { shortenString } from "@/lib/utils/shortenString";

export default function Header() {
  const [isLogIn, setIsLogIn] = useState<boolean>(false);

  const [assetsInfo, setAssetsInfo] = useState<GetAssetsInfoResponse | null>(
    null
  );
  const [metadata, setMetadata] = useState();

  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams<{ token: string }>();

  const [searchResultOpen, setSearchResultOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!search) return;

    const timeout = setTimeout(() => {
      const fetchAssetsClient = async () => {
        setAssetsInfo([]);
        setSearchLoading(true);
        if (!process.env.NEXT_PUBLIC_ASSETS_URL) {
          console.error("Next public assets url not provided");
          return;
        }
        try {
          const client: AssetsClient = AssetsClient.http(
            process.env.NEXT_PUBLIC_ASSETS_URL
          );
          const assets_info = await client.getAssetsInfo([search]);

          setAssetsInfo(assets_info);
        } catch (error) {
          console.error("Error getting token information:", error);
        } finally {
          setSearchLoading(false);
        }
      };
      fetchAssetsClient();
    }, 500);

    return () => clearTimeout(timeout); // Сброс таймера при каждом изменении slippage
  }, [search]);

  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userAPI.getUser(paramsString);
        console.log(await user.getSettings());
        setIsLogIn(true);
      } catch (e) {
        console.error(e);
        setIsLogIn(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const onRedirect = async (): Promise<void> => {
    const url = await userAPI.generateLink();

    window.open(url, "_blank");
  };

  const onLogout = () => {
    userAPI.logout();
    setIsLogIn(false);
  };

  return (
    <header className="bg-[#202020] p-3 px-5 flex text-[#A9A9A9] items-center justify-between">
      <div className="flex gap-10 items-center">
        <Link href="/" className="cursor-pointer">
          <Image alt="blink" src="/icons/logo.svg" width={112} height={45} />
        </Link>
        <div className="flex gap-2 text-[13px] max-xl:hidden">
          {/* <NavLink>NEW PAIRS</NavLink>
          <NavLink>TRENDING</NavLink> */}
          <NavLink href="/">TRENDING</NavLink>
          <NavLink href="/orders">ORDERS</NavLink>
          <NavLink href="/portfolio">HOLDINGS</NavLink>
          {/* <NavLink>LEADERBOARD</NavLink> */}
        </div>
      </div>

      <div className="max-md:hidden">
        <span className="absolute ml-3 mt-1.5">
          <Image src="/icons/search.svg" width={25} height={25} alt="search" />
        </span>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearchResultOpen(true)}
          onBlur={() => setTimeout(() => setSearchResultOpen(false), 250)}
          placeholder="Search by token or LP contract"
          className="min-w-[150px] w-[400px] max-w-[400px] h-[40px] pl-11 rounded-3xl px-2 bg-[#353535]"
        />
        {searchResultOpen && (
          <Link href={`/${search}`}>
            <Card
              className={
                "absolute flex hover:bg-[#252525] cursor-pointer transition-all flex-col gap-2 mt-3 z-50 w-[400px] shadow-2xl shadow-black"
              }
            >
              {assetsInfo?.length ? (
                <>
                  <div className={"flex gap-3 text-white items-center text-xl"}>
                    <div className={"h-10 w-10 rounded-full bg-[#3D3D3D]"} />{" "}
                    {assetsInfo?.[0].name}
                  </div>
                  <div className={"flex gap-2 text-xs"}>
                    <span>${Number(assetsInfo?.[0].price_usd).toFixed(7)}</span>
                    <span>
                      Pair:{" "}
                      {shortenString(assetsInfo?.[0].dex_info?.address || "")}
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-[100px] flex items-center justify-center">
                  {searchLoading ? "Loading..." : "Not found"}
                </div>
              )}
            </Card>
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <BurgerMenu />
      </div>

      <div className="flex items-center gap-5 max-md:hidden">
        {!loading ? (
          isLogIn ? (
            <Dropdown
              dropdownClassName="p-5 text-sm w-full"
              trigger={
                <Image
                  src="/icons/default_avatar.svg"
                  width={45}
                  height={40}
                  className="cursor-pointer h-full"
                  alt="default avatar"
                />
              }
              align={"right"}
            >
              <DropdownItem>
                <Link
                  href="/referral"
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/referral.svg"
                      width={20}
                      height={20}
                      alt="referral"
                    />
                  </span>
                  <span>REFERRAL TRACKING</span>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link
                  href="/"
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/wallet.svg"
                      width={20}
                      height={20}
                      alt="wallet"
                    />
                  </span>
                  <span>WALLET MANAGEMENT</span>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link
                  href="/settings"
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/dropdown_settings.svg"
                      width={20}
                      height={20}
                      alt="settings"
                    />
                  </span>
                  <span>SETTINGS</span>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link
                  href="/"
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/documentation.svg"
                      width={20}
                      height={20}
                      alt="settings"
                    />
                  </span>
                  <span>DOCUMENTATION</span>
                </Link>
              </DropdownItem>
              <DropdownItem className="border-b border-[#353535] ">
                <Link
                  href="/"
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/language.svg"
                      width={20}
                      height={20}
                      alt="language"
                    />
                  </span>
                  <span>LANGUAGE</span>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <button
                  onClick={onLogout}
                  className="flex gap-3 items-center text-[11px] text-[#A9A9A9]"
                >
                  <span>
                    <Image
                      src="/icons/logout.svg"
                      width={20}
                      height={20}
                      alt="language"
                    />
                  </span>
                  <span>LOGOUT</span>
                </button>
              </DropdownItem>
            </Dropdown>
          ) : (
            <div>
              <Button className="h-[40px]" onClick={onRedirect}>
                CONNECT TELEGRAM
              </Button>
            </div>
          )
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </header>
  );
}
