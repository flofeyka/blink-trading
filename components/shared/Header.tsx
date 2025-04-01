import Image from "next/image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import NavLink from "../ui/NavLink";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  return (
    <header className="w-full bg-[#202020] p-3 px-5 flex text-[#A9A9A9] items-center justify-between">
      <div className="flex gap-10 items-center">
        <div>
          <Image alt="blink" src="/icons/logo.svg" width={112} height={45} />
        </div>
        <div className="flex gap-2 text-[13px] max-xl:hidden">
          <NavLink>NEW PAIRS</NavLink>
          <NavLink>TRENDING</NavLink>
          <NavLink>MEMESCOPE</NavLink>
          <NavLink>ORDERS</NavLink>
          <NavLink>HOLDINGS</NavLink>
          <NavLink>LEADERBOARD</NavLink>
        </div>
      </div>

      <div className="max-md:hidden">
        <span className="absolute ml-3 mt-1.5">
          <Image src="/icons/search.svg" width={25} height={25} alt="search" />
        </span>
        <Input
          placeholder="Search by token or LP contract"
          className="min-w-[100px] max-w-[350px] h-[40px] pl-11 rounded-3xl px-2 bg-[#353535]"
        />
      </div>

      <div className="md:hidden">
        <BurgerMenu />
      </div>

      <div className="flex items-center gap-5 max-md:hidden">
        <div className="h-full">
          <Image
            src="/icons/default_avatar.svg"
            width={45}
            height={40}
            className="cursor-pointer h-full"
            alt="default avatar"
          />
        </div>

        <div>
          <Button className="h-[40px]">CONNECT WALLET</Button>
        </div>
      </div>
    </header>
  );
}
