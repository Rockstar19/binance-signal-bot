import { ema, atr } from './indicators.js';

/**
 * Evalua cruce de EMAs (rapida/lenta) sobre una serie de velas, reportando
 * el ATR vigente en cada cruce como referencia de volatilidad.
 *
 * Esta es una estrategia BASE (placeholder) usando conceptos ya vistos en el
 * mentoring de velas (EMA overlay + ATR). Reemplazar la logica interna aqui
 * una vez confirmada la estrategia especifica del video, sin tocar
 * marketData.js ni indicators.js.
 *
 * @param {Array} candles  velas ordenadas de mas antigua a mas reciente
 * @param {object} config  { fastPeriod, slowPeriod, atrPeriod }
 * @returns {Array<{time:number, close:number, signal:string, reason:string}>}
 */
export function evaluateEmaCrossoverAtr(candles, config = {}) {
  const { fastPeriod = 12, slowPeriod = 26, atrPeriod = 14 } = config;

  const closes = candles.map((c) => c.close);
  const emaFast = ema(closes, fastPeriod);
  const emaSlow = ema(closes, slowPeriod);
  const atrSeries = atr(candles, atrPeriod);

  const signals = [];

  for (let i = 1; i < candles.length; i++) {
    if (emaFast[i] === null || emaSlow[i] === null || atrSeries[i] === null) continue;
    if (emaFast[i - 1] === null || emaSlow[i - 1] === null) continue;

    const crossedUp = emaFast[i - 1] <= emaSlow[i - 1] && emaFast[i] > emaSlow[i];
    const crossedDown = emaFast[i - 1] >= emaSlow[i - 1] && emaFast[i] < emaSlow[i];

    if (!crossedUp && !crossedDown) continue;

    const signal = crossedUp ? 'LONG' : 'SHORT';
    const direction = crossedUp ? 'arriba' : 'abajo';
    const reason = `EMA${fastPeriod} cruzo ${direction} de EMA${slowPeriod} (ATR${atrPeriod}=${atrSeries[i].toFixed(2)})`;

    signals.push({
      time: candles[i].openTime,
      close: candles[i].close,
      signal,
      reason,
    });
  }

  return signals;
}
