import Input from "@/components/Input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#181818] h-screen w-screen">
      <header className="w-full bg-[#202020] p-3 px-5 flex text-[#A9A9A9] items-center justify-between">
        <div className="flex gap-10 items-center">
          <div>
            <Image alt="blink" src="/icons/logo.svg" width={112} height={45} />
          </div>
          <div className="flex gap-2 text-[13px]">
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              NEW PAIRS
            </Link>
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              TRENDING
            </Link>
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              MEMESCOPE
            </Link>
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              ORDERS
            </Link>
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              HOLDINGS
            </Link>
            <Link
              href="#"
              className="hover:bg-[#92d503]/20 hover:text-[#92d503] transition-all p-2 rounded-md"
            >
              LEADERBOARD
            </Link>
          </div>
        </div>

        <div>
          <span className="absolute ml-3 mt-1.5">
            <Image
              src="/icons/search.svg"
              width={25}
              height={25}
              alt="search"
            />
          </span>
          <Input
            placeholder="Search by token or LP contract"
            className="w-[350px] h-[40px] pl-11 rounded-3xl px-2 bg-[#353535]"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="h-full">
            <Image
              src="/icons/default_avatar.svg"
              width={45}
              height={40}
              className="cursor-pointer h-full"
              alt="default avatar"
            />
          </div>

          <div className="h-full">
            <button className="h-[40px] bg-linear-to-r from-[#92d503] to-[#02ba89] px-4 rounded-3xl text-[12px] text-white p-2 font-bold cursor-pointer">
              CONNECT WALLET
            </button>
          </div>
        </div>
      </header>

      <div className="w-full flex flex-col items-center mt-10">
        <div>
          <h1 className="text-2xl my-2">REFERRAL TRACKING</h1>
          <div className="w-[70vw] rounded bg-[#202020] p-5">
            <div className="pb-3 border-b border-[#353535]">
              YOUR REFERRAL LINK
            </div>

            <div>
              <div className="text-[#A9A9A9] my-4">
                You have 1 chance to update your referral URL handle.
              </div>
              <div>
                <button className="h-[45px] bg-linear-to-r from-[#92d503] to-[#02ba89] px-5 rounded-3xl text-[13px] text-white p-2 font-bold cursor-pointer">
                  GENERATE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
