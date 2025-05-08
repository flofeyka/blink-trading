'use client';
import {tradeAPI} from "@/lib/api/tradeAPI";
import {ResolutionString, widget} from "charting_library";
import {useEffect, useState} from 'react';
import {DataFeed, TradesClient} from "blink-sdk";

export default function Chart({address, decimals, direction}: {address: string, decimals: number, direction: number}) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if(!container) return;
        const client: TradesClient = tradeAPI.getClient();
        const datafeed = new DataFeed(client,
            "USDC",
            address,
            direction,
            decimals - 9,
            1000);

        const tradingView = new widget({
            symbol: "USDC",
            container,
            locale: 'en',
            datafeed,
            interval: "1" as ResolutionString,
            disabled_features: ["header_symbol_search"],
            library_path: "/charting_library/",
            height: '100%',
            width: '100%',
            theme: 'dark'
        })

        return () => {
            tradingView.remove()
        }
    }, [container]);

    return <div
        className="h-full"
        ref={setContainer}
    >
    </div>
}