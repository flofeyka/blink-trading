"use client";

import Image from "next/image";
import { useState } from "react";
import NavLink from "../../ui/NavLink";

export default function BurgerMenu() {
  const [opened, setOpened] = useState<boolean>(false);

  const handleOpen = () => setOpened((prev: boolean) => !prev);

  return (
    <div>
      <Image
        src="/icons/burger.svg"
        width={30}
        height={30}
        alt="Burger menu"
        onClick={handleOpen}
      />

      {opened && (
        <div className="w-screen z-100 h-full bg-[#181818] p-3 absolute top-0 left-0">
          <div className=" bg-[#202020] rounded-md p-5">
            <header className="flex justify-between pb-5 border-b border-[#353535] items-center">
              <span>
                <Image
                  src="/icons/logo.svg"
                  width={130}
                  height={60}
                  alt="blink"
                  onClick={handleOpen}
                />
              </span>
              <span>
                <Image
                  src="/icons/close.svg"
                  width={20}
                  height={20}
                  alt="close"
                  onClick={handleOpen}
                />
              </span>
            </header>

            <main className="flex flex-col gap-5 mt-5 font-medium pb-3 border-b border-[#353535] mb-5">
              <NavLink onClick={handleOpen} href="/">
                NEW PAIRS
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                TRENDING
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                MEMESCOPE
              </NavLink>
              <NavLink onClick={handleOpen} href="/orders">
                ORDERS
              </NavLink>
              <NavLink onClick={handleOpen} href="/portfolio">
                HOLDINGS
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                LEADERBOARD
              </NavLink>
              <NavLink onClick={handleOpen} href="/referral">
                REFERRAL TRACKING
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                WALLET MANAGEMENT
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                RECALM SOL
              </NavLink>
              <NavLink onClick={handleOpen} href="/settings">
                SETTINGS
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                LANGUAGE
              </NavLink>
              <NavLink onClick={handleOpen} href="/">
                SWITCH NETWORK
              </NavLink>
            </main>

            <footer>
              <NavLink href="/">
                <div className="flex gap-2">
                  <Image
                    src="/icons/logout.svg"
                    width={20}
                    height={20}
                    alt="logout"
                    onClick={handleOpen}
                  />
                  LOGOUT
                </div>
              </NavLink>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
