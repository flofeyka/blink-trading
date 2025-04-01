import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Image from "next/image";

export default function Portfolio() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl mb-5">Portfolio</h1>

      <div className="flex gap-3">
        <div className="bg-black w-[30%] max-md:w-[50%] flex flex-col gap-3 rounded-md p-5">
          <div className="text-[12px]">BALANCE</div>
          <div className="flex items-center gap-3">
            <span>
              <Image
                src="/icons/solan.svg"
                width={20}
                height={20}
                alt="solan"
              />
            </span>
            <span className="text-5xl max-md:text-3xl text-[#00FFA3]">
              344M
            </span>
          </div>
          <div className="font-semibold text-[20px] max-md:text-[16px]">
            $ 1 345 300
          </div>
        </div>
        <div className="bg-black w-[30%]   max-md:w-[50%]  flex flex-col gap-3 rounded-md p-5">
          <div className="text-[12px]">P&L</div>
          <div className="flex items-center gap-3 text-5xl max-md:text-3xl text-[#00FFA3]">
            +34.54%
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-[20px] max-md:text-[16px]">
              + $17.5%
            </span>
            <span className="text-[12px] text-[#A9A9A9]">USD</span>
          </div>
        </div>
      </div>

      <Card>
        <div className="pb-3 border-b border-[#353535] flex items-center max-md:justify-between gap-5">
          <span className="font-medium max-md:text-xl">Holdings</span>
          <span className="text-[#A9A9A9] font-medium max-md:text-xl">
            Activity
          </span>
          <span>
            <span className="absolute ml-2 mt-1.5">
              <Image
                src="/icons/search.svg"
                width={20}
                height={20}
                alt="search"
              />
            </span>
            <Input
              placeholder="Search Token"
              className="w-[200px] max-md:text-12px max-md:w-[125px] h-[35px] pl-8 rounded-3xl px-2 bg-[#353535]"
            />
          </span>
        </div>

        <div>
          {/* <table className="overflow-x-auto max-w-[90%]">
            <thead>
              <tr>
                <th className="w-[12.5%]">TOKEN / LAST ACTIVE</th>
                <th className="w-[12.5%]">UNREALIZED</th>
                <th className="w-[12.5%]">REALIZED PROFIT</th>
                <th className="w-[12.5%]">TOTAL PROFIT</th>
                <th className="w-[12.5%]">BALANCE</th>
                <th className="w-[12.5%]">BOUGHT</th>
                <th className="w-[12.5%]">SOLD</th>
                <th className="w-[12.5%]"> </th>
                <th className="w-[12.5%]"> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
                <td className="w-[12.5%]">123</td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </Card>
    </div>
  );
}
