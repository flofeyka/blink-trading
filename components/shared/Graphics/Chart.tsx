"use client";
import { tradeAPI } from "@/lib/api/tradeAPI";
import { ResolutionString, widget } from "charting_library";
import { useEffect, useState } from "react";
import { DataFeed, TradesClient } from "blink-sdk";

export default function Chart({
  address,
  decimals,
  direction,
}: {
  address: string;
  decimals: number;
  direction: number;
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container) return;
    const client: TradesClient = tradeAPI.getClient();
    const datafeed = new DataFeed(
      client,
      "USDC",
      address,
      direction,
      decimals - 9,
      1000
    );

    const width = window.innerWidth;

    const tradingView = new widget({
      symbol: "USDC",
      container,
      locale: "en",
      datafeed,
      interval: "1" as ResolutionString,
      //   disabled_features: ["header_symbol_search"],
      library_path: "/charting_library/",
      ...(width < 550
        ? {
            save_image: false,
            hide_volume: true,
            height: 500,
            disabled_features: [
              "volume_force_overlay",
              "header_chart_type",
              "header_indicators",
              "header_settings",
              "end_of_period_timescale_marks",
            ],
            enabled_features: [
              "hide_left_toolbar_by_default",
              "hide_right_toolbar_tabs",
              "hide_exponentiation_spread_operator",
            ],
          }
        : {
            autosize: true,
          }),
      theme: "dark",
    });

    return () => {
      tradingView.remove();
    };
  }, [container]);

  return <div className="h-full" ref={setContainer}></div>;
}
