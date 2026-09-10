// Indicadores tecnicos calculados desde cero (sin librerias externas).
// EMA se puede leer como un filtro IIR de primer orden:
//   y[n] = k * x[n] + (1 - k) * y[n-1]
// ATR usa el suavizado de Wilder, que es un caso particular del mismo filtro
// con k = 1/period en vez de k = 2/(period+1).

/**
 * Media Movil Exponencial (EMA).
 * @param {number[]} values  serie de precios (ej. cierres)
 * @param {number} period
 * @returns {(number|null)[]} EMA alineada con `values`; los primeros
 *          `period - 1` valores son null (no hay suficiente historia aun).
 */
export function ema(values, period) {
  const k = 2 / (period + 1);
  const result = new Array(values.length).fill(null);
  if (values.length < period) return result;

  // Semilla: SMA de los primeros `period` valores
  let seed = 0;
  for (let i = 0; i < period; i++) seed += values[i];
  seed /= period;
  result[period - 1] = seed;

  for (let i = period; i < values.length; i++) {
    result[i] = values[i] * k + result[i - 1] * (1 - k);
  }
  return result;
}

/**
 * Average True Range (ATR) con suavizado de Wilder.
 * @param {Array<{high:number, low:number, close:number}>} candles
 * @param {number} period
 * @returns {(number|null)[]} ATR alineada con `candles`
 */
export function atr(candles, period) {
  const trueRange = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1].close;
    return Math.max(
      c.high - c.low,
      Math.abs(c.high - prevClose),
      Math.abs(c.low - prevClose)
    );
  });

  const result = new Array(candles.length).fill(null);
  if (candles.length < period) return result;

  let seed = 0;
  for (let i = 0; i < period; i++) seed += trueRange[i];
  seed /= period;
  result[period - 1] = seed;

  for (let i = period; i < trueRange.length; i++) {
    result[i] = (result[i - 1] * (period - 1) + trueRange[i]) / period;
  }
  return result;
}
