// Функции форматирования для TradingView

/**
 * Форматирует дату для отображения в TradingView
 * @param date Timestamp или объект Date
 * @returns Отформатированная дата в формате DD.MM.YYYY
 */
export function formatTVDate(date: Date | number): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Форматирует время для отображения в TradingView
 * @param date Timestamp или объект Date
 * @returns Отформатированное время в формате HH:MM
 */
export function formatTVTime(date: Date | number): string {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Тип периода для свечей (используется в datafeed.ts)
 */
export type CandleSticksPeriod = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
