# binance-signal-bot

Bot de **señales** (no ejecuta órdenes) sobre Binance Spot. Detecta cruces de
EMA rápida/lenta, filtrados con ATR como referencia de volatilidad.

## Por qué no necesita API key

Los endpoints de *market data* de Binance son públicos: no requieren
autenticación. Este bot solo lee velas (`klines`), nunca envía órdenes, así
que no hay credenciales que configurar ni exponer en ningún momento.

## Requisitos (Windows)

1. Node.js 18 o superior instalado. Verificar en PowerShell o CMD:
   ```
   node -v
   ```
2. No hay dependencias externas que instalar (usa `fetch` nativo de Node).

## Uso

Desde la carpeta del proyecto:

```
node index.js
```

o

```
npm start
```

Esto trae las últimas 200 velas de `BTCUSDT` en `1h`, calcula EMA12, EMA26 y
ATR14, y muestra en consola las últimas señales detectadas, además de si hay
una señal vigente en la vela más reciente cerrada.

## Configuración

Editar el objeto `CONFIG` en `index.js`:

```js
const CONFIG = {
  symbol: 'BTCUSDT',   // cualquier par de Binance Spot
  interval: '1h',      // 1m, 5m, 15m, 1h, 4h, 1d, etc.
  limit: 200,
  fastPeriod: 12,
  slowPeriod: 26,
  atrPeriod: 14,
};
```

## Estructura

```
binance-signal-bot/
├── index.js              orquestador: fetch + evaluación + log
├── src/
│   ├── marketData.js      conector a la API pública de Binance Spot
│   ├── indicators.js      EMA y ATR calculados desde cero
│   └── signalEngine.js    lógica de señal (reemplazable sin tocar lo demás)
└── package.json
```

## Estado actual

La lógica de `signalEngine.js` es una estrategia **base** (cruce EMA + ATR
como contexto de volatilidad), reutilizando conceptos ya cubiertos en el
mentoring de velas japonesas. Es un placeholder pensado para reemplazarse por
la lógica específica que proponga el video de referencia, sin tocar
`marketData.js` ni `indicators.js`.

## Próximos pasos sugeridos

- Confirmar la estrategia exacta del video y ajustar `signalEngine.js`.
- Agregar modo "watch" (loop con `setInterval`) para monitoreo continuo en
  vez de una sola corrida.
- Conectar la salida de señales con `visor_multidivisa_velas.html` para
  verlas superpuestas en el gráfico.
- Si más adelante se agrega ejecución real de órdenes, ahí sí se necesitará
  una API key de Binance con permisos de trading — generada y guardada
  siempre en el entorno local del usuario.
