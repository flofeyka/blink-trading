"use client";

import {formatTVDate, formatTVTime} from "@/lib/dates";
import {BigNumberish} from "ethers";
import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import { tradeAPI } from "@/lib/api/tradeAPI";

// Определяем типы для TradingView API
type ThemeName = "Light" | "Dark";
type ChartingLibraryFeatureset = string;

interface IChartingLibraryWidget {
    onChartReady(callback: () => void): void;
    setSymbol(symbol: string, interval: string, callback: () => void): void;
    activeChart(): { resolution: () => string; symbol: () => string };
    remove(): void;
}

// Определяем тип для конструктора виджета
interface ChartingLibraryWidgetOptions {
    symbol: string;
    interval: string;
    container_id?: string;
    container?: HTMLElement;
    datafeed: any;
    library_path: string;
    locale: string;
    disabled_features?: string[];
    enabled_features?: string[];
    theme?: ThemeName;
    overrides?: any;
    studies_overrides?: any;
    autosize?: boolean;
    custom_css_url?: string;
    customFormatters?: any;
}

const Container = styled.div`
  grid-column: 1;
  grid-row: 2;
  clip-path: inset(0 round 20px);
  background-color: #2a2b30;
  position: relative;
  z-index: 0;
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RED = "#fa3c58";
const GREEN = "#0ecc83";

const chartStyleOverrides = ["candleStyle", "hollowCandleStyle", "haStyle"].reduce(
    (acc: any, cv) => {
        acc[`mainSeriesProperties.${cv}.drawWick`] = true;
        acc[`mainSeriesProperties.${cv}.drawBorder`] = false;
        acc[`mainSeriesProperties.${cv}.upColor`] = GREEN;
        acc[`mainSeriesProperties.${cv}.downColor`] = RED;
        acc[`mainSeriesProperties.${cv}.wickUpColor`] = GREEN;
        acc[`mainSeriesProperties.${cv}.wickDownColor`] = RED;
        acc[`mainSeriesProperties.${cv}.borderUpColor`] = GREEN;
        acc[`mainSeriesProperties.${cv}.borderDownColor`] = RED;
        return acc;
    },
    {},
);

const chartOverrides = {
    "paneProperties.background": "#2a2b30",
    "paneProperties.backgroundType": "solid",
    "paneProperties.vertGridProperties.color": "#fff2",
    "paneProperties.vertGridProperties.style": 2,
    "paneProperties.horzGridProperties.color": "#fff2",
    "paneProperties.horzGridProperties.style": 2,
    "mainSeriesProperties.priceLineColor": "#3a3e5e",
    "scalesProperties.textColor": "#fff",
    ...chartStyleOverrides,
};

export const disabledFeaturesOnMobile = ["header_saveload", "header_fullscreen_button"];

const disabledFeatures: ChartingLibraryFeatureset[] = [
    "volume_force_overlay",
    "show_logo_on_all_charts",
    "caption_buttons_text_if_possible",
    "create_volume_indicator_by_default",
    "header_compare",
    "compare_symbol",
    "display_market_status",
    "header_interval_dialog_button",
    "show_interval_dialog_on_key_press",
    "header_symbol_search",
    "popup_hints",
    "header_in_fullscreen_mode",
    "use_localstorage_for_settings",
    "right_bar_stays_on_scroll",
    "symbol_info",
] as any;

const enabledFeatures: ChartingLibraryFeatureset[] = [
    "side_toolbar_in_fullscreen_mode",
    "header_in_fullscreen_mode",
    "hide_resolution_in_legend",
    "items_favoriting",
];

type Props = {
    chainId: BigNumberish;
    tokenSymbol?: string;
};

export default function Chart({ chainId, tokenSymbol }: Props) {
    const [isInitializing, setIsInitializing] = useState(true);
    
    // Проверяем, что chainId не пустое
    useEffect(() => {
        console.log('Chart компонент получил chainId:', chainId);
        if (!chainId || chainId === "") {
            console.error('chainId пустой, невозможно инициализировать график');
            setIsInitializing(false);
        }
    }, [chainId]);
    
    return (
        <Container>
            {tokenSymbol && chainId && chainId !== "" ? (
                <ChartContainer chainId={chainId} tokenSymbol={tokenSymbol} />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 3,
                    }}
                >
                    {isInitializing ? "Инициализация графика..." : "Ошибка: Не указан ID токена"}
                </div>
            )}
        </Container>
    );
}

// Простой DataFeed для TradingView
class SimpleDataFeed {
    private chainId: BigNumberish;
    
    constructor(chainId: BigNumberish) {
        this.chainId = chainId;
        console.log('SimpleDataFeed создан с chainId:', chainId);
    }
    
    onReady(callback: any) {
        console.log('SimpleDataFeed.onReady вызван');
        setTimeout(() => {
            console.log('SimpleDataFeed.onReady выполняется');
            callback({
                supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
                supports_time: true,
                supports_marks: false,
                supports_timescale_marks: false,
            });
            console.log('SimpleDataFeed.onReady завершен');
        }, 0);
    }
    
    resolveSymbol(symbolName: string, onSymbolResolvedCallback: any) {
        console.log('SimpleDataFeed.resolveSymbol вызван для:', symbolName);
        setTimeout(() => {
            console.log('SimpleDataFeed.resolveSymbol выполняется');
            onSymbolResolvedCallback({
                name: symbolName,
                ticker: symbolName,
                description: symbolName,
                type: "crypto",
                session: "24x7",
                timezone: "Etc/UTC",
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
                volume_precision: 8,
                data_status: "streaming",
            });
            console.log('SimpleDataFeed.resolveSymbol завершен');
        }, 0);
    }
    
    async getBars(symbolInfo: any, resolution: string, from: number, to: number, onHistoryCallback: any) {
        console.log('SimpleDataFeed.getBars вызван:', { symbolInfo, resolution, from, to });
        try {
            // Конвертировать timeframe TradingView в понятные API параметры
            const interval = this.convertResolution(resolution);
            console.log('Преобразованный интервал:', interval);
            
            // Проверяем, что chainId не пустой
            if (!this.chainId || this.chainId === "") {
                console.error('chainId пустой, невозможно получить данные свечей');
                onHistoryCallback([], { noData: true });
                return;
            }
            
            const params = {
                amm: this.chainId.toString(),
                interval: interval,
                dir: 0, // Направление (обязательный параметр)
                start: from * 1000, // Время начала в миллисекундах
                e: to * 1000 // Время окончания в миллисекундах (e вместо end или to)
            };
            
            console.log('Запрашиваем данные свечей с параметрами:', params);
            
            // Получить данные свечей из API
            const candles = await tradeAPI.getCandleSticks(params);
            
            console.log('Получены данные свечей:', candles);
            
            if (!candles || candles.length === 0) {
                console.log('Нет данных свечей');
                onHistoryCallback([], { noData: true });
                return;
            }
            
            // Форматируем данные для TradingView
            console.log('Форматируем свечи для TradingView');
            const formattedCandles = candles.map(candle => {
                // Проверка структуры свечи
                if (!candle.t) {
                    console.error('Некорректная структура свечи:', candle);
                    return null;
                }
                
                return {
                    time: Math.floor(candle.t / 1000), // Переводим миллисекунды в секунды
                    open: candle.o,
                    high: candle.h,
                    low: candle.l,
                    close: candle.c,
                    volume: 0
                };
            }).filter(Boolean);
            
            console.log('Отформатированные свечи:', formattedCandles);
            onHistoryCallback(formattedCandles);
            console.log('SimpleDataFeed.getBars завершен успешно');
        } catch (error) {
            console.error('Ошибка получения данных свечей:', error);
            onHistoryCallback([], { noData: true });
        }
    }
    
    // Конвертирует timeframe TradingView в формат для API
    convertResolution(resolution: string): number {
        // Преобразуем строковое представление интервала в минуты для API
        const resolutionMap: {[key: string]: number} = {
            "1": 1,
            "5": 5,
            "15": 15,
            "30": 30,
            "60": 60,
            "240": 240,
            "1D": 1440,
            "1W": 10080,
            "1M": 43200
        };
        
        return resolutionMap[resolution] || 1; // По умолчанию 1 минута
    }
    
    // Методы для подписки на обновления (не используются в этом упрощенном примере)
    subscribeBars() {
        console.log('SimpleDataFeed.subscribeBars вызван');
    }
    
    unsubscribeBars() {
        console.log('SimpleDataFeed.unsubscribeBars вызван');
    }
}

function ChartContainer(p: { chainId: BigNumberish; tokenSymbol: string }) {
    const { chainId, tokenSymbol } = p;

    const containerRef = useRef<HTMLDivElement>(null);
    const containerIdRef = useRef<string>(`tv_chart_container_${Date.now()}`);
    const tokenSymbolRef = useRef(tokenSymbol);
    const [widget, setWidget] = useState<IChartingLibraryWidget>();
    const [chartReady, setChartReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [containerMounted, setContainerMounted] = useState(false);

    // Сразу проверяем chainId
    useEffect(() => {
        console.log('ChartContainer получил chainId:', chainId);
        if (!chainId || chainId === "") {
            setError("Ошибка: chainId не указан или пустой");
            setIsLoading(false);
        }
    }, [chainId]);

    // Обновляем tokenSymbolRef при изменении tokenSymbol
    useEffect(() => {
        tokenSymbolRef.current = tokenSymbol;
    }, [tokenSymbol]);

    // Убедимся, что контейнер смонтирован
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.id = containerIdRef.current;
            console.log('Контейнер готов с ID:', containerIdRef.current);
            setContainerMounted(true);
        } else {
            console.error('Контейнер не найден при монтировании');
        }
    }, []);

    // Тестовый запрос к API для проверки соединения
    useEffect(() => {
        if (!chainId || chainId === "") return;
        
        const testApiConnection = async () => {
            try {
                console.log('Тестируем соединение с API...');
                // Получаем данные за последний день (24 часа)
                const now = Date.now();
                const oneDayAgo = now - 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
                
                const result = await tradeAPI.getCandleSticks({
                    amm: chainId.toString(),
                    interval: 15,  // 15-минутный интервал
                    dir: 0,
                    start: oneDayAgo,
                    e: now
                });
                
                console.log('Тест API успешен, получено свечей:', result ? result.length : 0);
            } catch (error) {
                console.error('Ошибка при тестировании API:', error);
            }
        };
        
        testApiConnection();
    }, [chainId]);

    // Эффект для загрузки библиотеки TradingView
    useEffect(() => {
        if (typeof window === 'undefined' || !containerMounted || !chainId || chainId === "") {
            return; // Выходим, если мы на сервере или контейнер не готов или chainId пустой
        }

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        // Загружаем библиотеку динамически только на клиенте
        const loadTradingViewLib = async () => {
            try {
                console.log("Начинаем загрузку TradingView...");
                
                // Устанавливаем таймаут для обнаружения зависания
                timeoutId = setTimeout(() => {
                    if (isMounted && isLoading) {
                        console.error("Таймаут загрузки графика");
                        setError("Таймаут загрузки графика. Пожалуйста, обновите страницу.");
                        setIsLoading(false);
                    }
                }, 15000); // 15 секунд таймаута
                
                // Проверяем, существует ли контейнер
                if (!containerRef.current) {
                    console.error("Контейнер не найден");
                    if (isMounted) {
                        setError("Ошибка инициализации контейнера графика");
                        setIsLoading(false);
                    }
                    return;
                }
                
                // Убедимся, что ID установлен
                if (!containerRef.current.id) {
                    containerRef.current.id = containerIdRef.current;
                }
                
                // Загружаем библиотеку
                console.log("Импортируем библиотеку charting_library...");
                
                // Добавляем глобальную переменную для дебага
                (window as any).TvDebug = true;
                
                let TradingViewModule;
                try {
                    TradingViewModule = await import('charting_library');
                    console.log("TradingView импортирован:", TradingViewModule);
                } catch (importError) {
                    console.error("Ошибка импорта библиотеки TradingView:", importError);
                    if (isMounted) {
                        setError(`Ошибка загрузки библиотеки графика: ${importError instanceof Error ? importError.message : 'Неизвестная ошибка'}`);
                        setIsLoading(false);
                        clearTimeout(timeoutId);
                    }
                    return;
                }
                
                if (!TradingViewModule.widget) {
                    console.error("Ошибка: widget не найден в модуле");
                    if (isMounted) {
                        setError("Ошибка: компонент графика не найден");
                        setIsLoading(false);
                    }
                    return;
                }
                
                if (!isMounted) return;
                
                console.log("Создаем datafeed...");
                // Используем новый упрощенный DataFeed
                const datafeed = new SimpleDataFeed(chainId);
                console.log("Datafeed создан");
                
                console.log("Инициализируем виджет с символом:", tokenSymbolRef.current);
                
                // Форматтеры для дат
                const formatters = {
                    timeFormatter: {
                        format: (date: Date | number) => formatTVTime(date),
                        formatLocal: (date: Date | number) => formatTVTime(date),
                    },
                    dateFormatter: {
                        format: (date: Date | number) => formatTVDate(date),
                        formatLocal: (date: Date | number) => formatTVDate(date),
                    },
                };
                
                // Для исправления ошибки типизации используем приведение типов
                try {
                    const tvWidget = new TradingViewModule.widget({
                        symbol: tokenSymbolRef.current,
                        interval: "15", // Используем 15-минутный интервал по умолчанию
                        container_id: containerIdRef.current,
                        datafeed: datafeed as any,
                        library_path: "/charting_library/",
                        locale: "en",
                        theme: "Dark",
                        autosize: true,
                        overrides: chartOverrides,
                        enabled_features: enabledFeatures,
                        disabled_features: disabledFeatures,
                        custom_css_url: "/tradingview-chart.css",
                        customFormatters: formatters,
                    });
                    
                    console.log("Виджет создан, ожидаем onChartReady...");
                    
                    // Устанавливаем обработчик готовности
                    tvWidget.onChartReady(() => {
                        console.log("График готов!");
                        if (isMounted) {
                            setChartReady(true);
                            setIsLoading(false);
                            clearTimeout(timeoutId);
                        }
                    });
                    
                    if (isMounted) {
                        setWidget(tvWidget);
                    }
                } catch (widgetError) {
                    console.error("Ошибка создания виджета TradingView:", widgetError);
                    if (isMounted) {
                        setError(`Ошибка создания графика: ${widgetError instanceof Error ? widgetError.message : 'Неизвестная ошибка'}`);
                        setIsLoading(false);
                        clearTimeout(timeoutId);
                    }
                }
            } catch (error) {
                console.error("Ошибка инициализации TradingView:", error);
                if (isMounted) {
                    setError(`Ошибка инициализации графика: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
                    setIsLoading(false);
                    clearTimeout(timeoutId);
                }
            }
        };
        
        // Добавляем небольшую задержку, чтобы убедиться, что DOM полностью готов
        const initTimeout = setTimeout(() => {
            loadTradingViewLib();
        }, 300);
        
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            clearTimeout(initTimeout);
            if (widget) {
                try {
                    widget.remove();
                } catch (e) {
                    console.error("Ошибка при удалении виджета:", e);
                }
            }
        };
    }, [chainId, isLoading, containerMounted]);

    useEffect(() => {
        if (chartReady && widget && tokenSymbol !== widget.activeChart().symbol()) {
            console.log(`Меняем символ с ${widget.activeChart().symbol()} на ${tokenSymbol}`);
            widget.setSymbol(tokenSymbol, widget.activeChart().resolution(), () => {
                console.log("Символ изменен");
            });
        }
    }, [widget, tokenSymbol, chartReady]);

    if (error) {
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "red", padding: "20px", textAlign: "center" }}>
                {error}
            </div>
        );
    }

    if (isLoading && !chartReady) {
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div>Загрузка графика...</div>
                <div style={{ fontSize: "12px", marginTop: "8px" }}>Идет подключение к источнику данных...</div>
            </div>
        );
    }

    return <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: "400px" }} />;
}
