import {tradeAPI} from "./api/tradeAPI";
// Создадим пока макет этой функции, так как нет доступа к исходному файлу
const getPriceDecimals = (chainId: any, symbol: string): number => {
  // Временная заглушка - по умолчанию 2 десятичных знака
  return 2;
};

// Эти типы доступны только на клиенте, поэтому определим интерфейсы здесь
interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

type HistoryCallback = (bars: Bar[], meta: { noData?: boolean }) => void;
type ErrorCallback = (reason: string) => void;
type SubscribeBarsCallback = (bar: Bar) => void;
type ResolutionString = string;
type SearchSymbolsCallback = any;
type ResolveCallback = (symbolInfo: any) => void;
type OnReadyCallback = (configuration: any) => void;

// Интерфейс для LibrarySymbolInfo
interface LibrarySymbolInfo {
  name: string;
  full_name: string;
  base_name?: string[];
  ticker: string;
  description: string;
  type: string;
  session: string;
  exchange: string;
  listed_exchange: string;
  timezone: string;
  format: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  has_daily: boolean;
  currency_code: string;
  supported_resolutions: string[];
  data_status?: string;
}

// Интерфейс для IBasicDataFeed
interface IBasicDataFeed {
  onReady(callback: OnReadyCallback): void;
  searchSymbols?(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void;
  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void;
  getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, from: number, to: number, onResult: HistoryCallback, onError: ErrorCallback, isFirstCall: boolean): Promise<void>;
  subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string): void;
  unsubscribeBars(listenerGuid: string): Promise<void> | void;
}

import {BigNumberish} from "ethers";
import {clearIntervalAsync, setIntervalAsync, SetIntervalAsyncTimer} from "set-interval-async";
import {CandleSticksPeriod} from "@/lib/dates";

const CANDLES_COUNT: number = 5000;
const UPDATE_INTERVAL: number = 3_000; // 3s

// Определяем интерфейс для работы с API
interface CandleData {
  amm: string;
  dir: number; // 0 для AtoB, 1 для BtoA
  interval: number;
  start: number;
  limit?: number;
  e: number;
}

const SUPPORTED_RESOLUTIONS: Record<string, CandleSticksPeriod> = {
  1: "1m",
  5: "5m",
  15: "15m",
  60: "1h",
  240: "4h",
  "1D": "1d",
};

export class DataFeed implements IBasicDataFeed {
  private timers = new Map<string, SetIntervalAsyncTimer<[]>>();

  constructor(readonly chainId: BigNumberish) {}

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ): void {}

  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
  ): void {
    symbolName = symbolName === "WETH" ? "ETH" : symbolName;
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      base_name: [symbolName],
      ticker: symbolName,
      description: symbolName + " / USD",
      type: "crypto",
      session: "24x7",
      exchange: "FAIREX",
      listed_exchange: "FAIREX",
      timezone: "Etc/UTC",
      format: "price",
      minmov: 1,
      pricescale: Math.pow(10, getPriceDecimals(this.chainId, symbolName)),
      has_intraday: true,
      has_daily: true,
      currency_code: "USD",
      supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS) as ResolutionString[],
      data_status: "streaming",
    };
    onResolve(symbolInfo);
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number, 
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean
  ): Promise<void> {
    // Используем символ как AMM
    const ammAddress = symbolInfo.name;
    
    try {
      const params: CandleData = {
        amm: ammAddress,
        dir: 0, // AtoB
        interval: parseInt(resolution as string) || 1,
      start: 0,
      limit: CANDLES_COUNT,
      e: 1
      };
      
      const candles = await tradeAPI.getCandleSticks(params);

      const bars = candles.map<Bar>((candle) => {
        // Убедимся, что candle - массив [time, open, high, low, close]
        if (Array.isArray(candle) && candle.length >= 5) {
          const [t, o, h, l, c] = candle;
      return { time: t * 1000, open: o, high: h, low: l, close: c };
        }
        // Если не массив, предполагаем что это объект с этими полями
        const candleObj = candle as any;
        return { 
          time: candleObj.t * 1000, 
          open: candleObj.o, 
          high: candleObj.h, 
          low: candleObj.l, 
          close: candleObj.c 
        };
    });
      
      onResult(bars, { noData: bars.length === 0 });
    } catch (error) {
      console.error("Error fetching bars:", error);
      onError("Failed to load data");
    }
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
  ): void {
    // Используем символ как AMM
    const ammAddress = symbolInfo.name;
    
    const timer = setIntervalAsync(async () => {
      try {
        const params: CandleData = {
          amm: ammAddress,
          dir: 0, // AtoB
          interval: parseInt(resolution as string) || 1,
        start: 1,
        e: 1
        };
        
        const newCandles = await tradeAPI.getCandleSticks(params);
      const newCandle = newCandles.at(-1);
        
      if (newCandle) {
          // Убедимся, что newCandle - массив [time, open, high, low, close]
          if (Array.isArray(newCandle) && newCandle.length >= 5) {
            const [t, o, h, l, c] = newCandle;
        onTick({ time: t * 1000, open: o, high: h, low: l, close: c });
          } else {
            // Если не массив, предполагаем что это объект с этими полями
            const candleObj = newCandle as any;
            onTick({ 
              time: candleObj.t * 1000, 
              open: candleObj.o, 
              high: candleObj.h, 
              low: candleObj.l, 
              close: candleObj.c 
            });
          }
        }
      } catch (error) {
        console.error("Error in subscribe bars:", error);
      }
    }, UPDATE_INTERVAL);
    this.timers.set(listenerGuid, timer);
  }

  async unsubscribeBars(listenerGuid: string): Promise<void> {
    const timer = this.timers.get(listenerGuid);
    if (timer) {
      await clearIntervalAsync(timer);
      this.timers.delete(listenerGuid);
    }
  }

  onReady(callback: OnReadyCallback): void {
    callback({
      supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS) as ResolutionString[],
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: true,
    });
  }
}
