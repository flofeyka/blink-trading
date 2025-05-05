'use client';

import Image from "next/image";
import Input from "../../ui/Input";
import NavLink from "../../ui/NavLink";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import Dropdown, {DropdownItem} from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import {authAPI} from "@/lib/api/authAPI";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Header() {
  const [isLogIn, setIsLogIn] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const params = searchParams.toString();
  useEffect(() => {
    console.log(params);
    const fetchUser = async () => {
      try {
        if(params) {
          const user = await authAPI.getUser(params);
          console.log(await user.getSettings());
          setIsLogIn(true);
        }
      } catch(e) {
        console.error(e);
        setIsLogIn(false);
      }
    }
    fetchUser();
  }, []);

  const onRedirect = async () => {
    const url = await authAPI.generateLink();
    window.location.href = url;
  }

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
          placeholder="Search by token or LP contract"
          className="min-w-[150px] w-[400px] max-w-[400px] h-[40px] pl-11 rounded-3xl px-2 bg-[#353535]"
        />
      </div>

      <div className="md:hidden">
        <BurgerMenu />
      </div>

      <div className="flex items-center gap-5 max-md:hidden">
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
            <Link
              href="/"
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
            </Link>
          </DropdownItem>
        </Dropdown>

        {!isLogIn && (
          <div>
              <Button className="h-[40px]" onClick={onRedirect}>CONNECT TELEGRAM</Button>
          </div>
        )}
        
      </div>
    </header>
  );
}
