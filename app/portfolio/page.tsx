"use client";
import Card from "@/components/ui/Card";
import Image from "next/image";
import PortfolioTable from "@/components/shared/Portfolio/PortfolioTable";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api/userAPI";
import { Asset } from "blink-sdk";
import { toast } from "react-toastify";
import { compactNumber } from "@/lib/utils/compactNumber";

interface Total {
  total_sol: string;
  total_usd: string;
  total_pnl_usd: string;
  total_pnl_percent: string;
}

export default function Portfolio() {
  const [loading, setLoading] = useState<boolean>(true);

  const [positions, setPositions] = useState<Asset[]>([]);

  const [totalData, setTotalData] = useState<Total | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const positionTotal = await userAPI.fetchPortfolio();
        setPositions(
          positionTotal.positions.map((position) => ({
            ...position,
            avg_price_column: {
              price_token: position.avg_price,
              price_usd: position.avg_price_usd,
            },
            price_column: {
              price_token: position.price,
              price_usd: position.price_usd,
            },
            balance_column: {
              balance_ui_token: position.balance_ui,
              balance_ui_usd: position.balance_ui_usd,
            },
            pnl: {
              pnl_usd: position.pnl_usd,
              pnl_percent: position.pnl_percent,
            },
          }))
        );
        setTotalData(positionTotal);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const onWithdraw = async (mint: string) => {
    try {
      const client = await userAPI.getUser();

      toast("Waiting for withdraw...", { autoClose: 1000 });
      await client.withdraw({
        mint,
        amount: "1",
        recipient: "test-recipient",
      });
      toast("Success!", { autoClose: 1000 });

      setPositions((prev) => prev.filter((pos) => pos.mint !== mint));
    } catch (e) {
      console.error(e);
      toast.error("Error during withdraw");
    }
  };

  if (!totalData || loading) {
    return <div>Loading...</div>;
  }

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
              {compactNumber(+totalData.total_sol)}
            </span>
          </div>
          <div className="font-semibold text-[20px] max-md:text-[16px]">
            $ {compactNumber(+totalData.total_usd)}
          </div>
        </div>
        <div className="bg-black w-[30%]   max-md:w-[50%]  flex flex-col gap-3 rounded-md p-5">
          <div className="text-[12px]">P&L</div>
          <div className="flex items-center gap-3 text-5xl max-md:text-3xl text-[#00FFA3]">
            +{(+totalData.total_pnl_percent).toFixed(2)}%
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-[20px] max-md:text-[16px]">
              + ${compactNumber(+totalData.total_pnl_usd)}
            </span>
            <span className="text-[12px] text-[#A9A9A9]">USD</span>
          </div>
        </div>
      </div>

      <Card>
        <PortfolioTable
          onWithdraw={onWithdraw}
          positions={positions}
          loading={loading}
        />
      </Card>
    </div>
  );
}
