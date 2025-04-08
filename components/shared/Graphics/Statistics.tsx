export default function Statistics() {
  return (
    <div className="rounded-md bg-[#202020] max-md:hidden">
      <div className="flex justify-between">
        <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
          <div className="text-[12px] text-[#A9A9A9]">5M</div>
          <div className="text-[#00FFA3]">4.45%</div>
        </span>
        <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
          <div className="text-[12px] text-[#A9A9A9]">1H</div>
          <div className="text-[#00FFA3]">4.45%</div>
        </span>
        <span className="text-center w-[25%] focus:bg-[#353535] border-r border-b border-[#353535] p-3">
          <div className="text-[12px] text-[#A9A9A9]">6H</div>
          <div className="text-[#00FFA3]">4.45%</div>
        </span>
        <span className="text-center w-[25%] focus:bg-[#353535] border-b border-[#353535] p-3">
          <div className="text-[12px] text-[#A9A9A9]">24H</div>
          <div className="text-[#00FFA3]">4.45%</div>
        </span>
      </div>
      <div className="flex p-3 px-5">
        <div className="flex flex-col gap-3 border-r pr-4.5 border-[#353535]">
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">TXNS</div>
            <div>3</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">VOLUME</div>
            <div>$233.34</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#A9A9A9] text-[12px]">MAKERS</div>
            <div>3</div>
          </div>
        </div>
        <div className="w-full pl-3 flex flex-col justify-between">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                <div>3</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                <div>0</div>
              </span>
            </div>
            <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                <div>3</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                <div>0</div>
              </span>
            </div>
            <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <span>
                <div className="text-[#A9A9A9] text-[12px]">BUYS</div>
                <div>3</div>
              </span>
              <span className="text-end">
                <div className="text-[#A9A9A9] text-[12px]">SELLS</div>
                <div>0</div>
              </span>
            </div>
            <div className="h-[2px] w-full bg-[#00FFA3] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
