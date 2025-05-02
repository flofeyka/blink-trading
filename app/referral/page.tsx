'use client';

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Image from "next/image";
import {useEffect, useState} from "react";
import {authAPI} from "@/api/authAPI";

export default function Referral() {

  const [referralData, setReferralData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
        const user = await authAPI.getUser();
        const referralsInfo = await user.getReferrals();
        console.log(referralsInfo);
        setReferralData(referralsInfo);
        setLoading(false);
    }

    fetchUser()
  }, []);

  if(loading) return <div className={'h-full w-full flex justify-center items-center'}>
    Loading...
  </div>

  return (
    <div>
      <div className="w-full flex flex-col items-center mt-10 gap-5">
        <div>
          <h1 className="text-2xl my-2">REFERRAL TRACKING</h1>
          <Card className="w-[95vw] md:w-[70vw]">
            <div className="pb-3 border-b border-[#353535]">
              YOUR REFERRAL LINK
            </div>

            <div>
              <div className="text-[#A9A9A9] my-4">
                You have 1 chance to update your referral URL handle.
              </div>
              <div>
                <Button className="h-[45px]">GENERATE</Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="w-[70vw] max-md:w-[95vw]">
            <div className="pb-3 border-b border-[#353535]">YOUR STATS</div>

            <div className="flex w-[70%] max-md:w-full max-md:flex-wrap max-md:gap-2 justify-between text-sm mt-5">
              <div>
                <div className="text-[#A9A9A9] mb-1 flex gap-1.5">
                  REFERRALS{" "}
                  <Image
                    src="/icons/disclamer.svg"
                    width={15}
                    height={15}
                    alt="disclamer"
                    className="cursor-pointer"
                  />
                </div>
                <div>{referralData?.count}</div>
              </div>
              <div>
                <div className="text-[#A9A9A9] mb-1 flex gap-1.5">
                  TRADERS
                  <Image
                    src="/icons/disclamer.svg"
                    width={15}
                    height={15}
                    alt="disclamer"
                    className="cursor-pointer"
                  />
                </div>
                <div>0</div>
              </div>
              <div>
                <div className="text-[#A9A9A9] mb-1 flex gap-1.5">
                  VOLUME DONE BY TRADERS
                  <Image
                    src="/icons/disclamer.svg"
                    width={15}
                    height={15}
                    alt="disclamer"
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Image
                    src="/icons/solan.svg"
                    width={15}
                    height={15}
                    alt="solan"
                    className="cursor-pointer"
                  />
                  {referralData?.volume}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
