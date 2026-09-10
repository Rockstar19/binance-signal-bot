// Conector de datos de mercado - Binance Spot API publica (sin autenticacion).
// No requiere API key: los endpoints de market data de Binance son publicos.
// Docs: https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints

const BASE_URL = 'https://api.binance.com';

/**
 * Obtiene velas (klines) historicas de un simbolo en Binance Spot.
 * @param {string} symbol   ej. 'BTCUSDT'
 * @param {string} interval ej. '15m', '1h', '4h', '1d'
 * @param {number} limit    cantidad de velas a traer (maximo permitido por Binance: 1000)
 * @returns {Promise<Array>} arreglo de velas normalizadas, ordenadas de mas antigua a mas reciente
 */
export async function fetchKlines(symbol, interval, limit = 200) {
  const url = `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Binance API respondio ${res.status}: ${body}`);
  }

  const raw = await res.json();

  // Cada vela cruda viene como:
  // [openTime, open, high, low, close, volume, closeTime, quoteVol, trades, ...]
  return raw.map((k) => ({
    openTime: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
    closeTime: k[6],
    isClosed: k[6] < Date.now(), // true si la vela ya cerro
  }));
}
