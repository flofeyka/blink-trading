import Card from "@/components/ui/Card";
import Image from "next/image";
import PortfolioTable from "@/components/shared/Portfolio/PortfolioTable";

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
        <PortfolioTable />
      </Card>
    </div>
  );
}
