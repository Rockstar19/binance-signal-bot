import { fetchKlines } from './src/marketData.js';
import { evaluateEmaCrossoverAtr } from './src/signalEngine.js';

// --- Configuracion editable ---
const CONFIG = {
  symbol: 'BTCUSDT',
  interval: '1h',
  limit: 200,
  fastPeriod: 12,
  slowPeriod: 26,
  atrPeriod: 14,
};

async function runOnce() {
  console.log(`\n[${new Date().toISOString()}] Consultando ${CONFIG.symbol} (${CONFIG.interval})...`);

  const candles = await fetchKlines(CONFIG.symbol, CONFIG.interval, CONFIG.limit);
  const closedCandles = candles.filter((c) => c.isClosed);

  const signals = evaluateEmaCrossoverAtr(closedCandles, CONFIG);

  if (signals.length === 0) {
    console.log('Sin cruces detectados en el rango analizado.');
    return;
  }

  console.log(`Se detectaron ${signals.length} senal(es) historicas. Ultimas 5:`);
  signals.slice(-5).forEach((s) => {
    const date = new Date(s.time).toISOString();
    console.log(`  ${date} | ${s.signal} @ ${s.close} - ${s.reason}`);
  });

  const last = signals[signals.length - 1];
  const lastCandle = closedCandles[closedCandles.length - 1];
  const isCurrentSignal = last.time === lastCandle.openTime;

  console.log(
    isCurrentSignal
      ? `\n>>> SENAL ACTUAL: ${last.signal} (${last.reason})`
      : '\n>>> Sin senal nueva en la ultima vela cerrada.'
  );
}

runOnce().catch((err) => {
  console.error('Error ejecutando el bot de senales:', err.message);
  process.exit(1);
});
