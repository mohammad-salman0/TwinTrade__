"use client";

import { useEffect, useRef, useState } from "react";
// import { createChart, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries } from "lightweight-charts";
// import {
//   createChart,
//   ColorType,
//   CrosshairMode,
//   CandlestickSeries,
//   HistogramSeries,
//   LineSeries,
//   Time,
// } from "lightweight-charts";

import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  Time,
  CandlestickData,
} from "lightweight-charts";
// type Candle = {
//   time: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume?: number;
// };

type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};
type Props = { data: Candle[] };

// ── EMA helper ────────────────────────────────────────────────
function calcEMA(values: number[], period: number): number[] {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const ema: number[] = [];
  const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(seed);
  for (let i = period; i < values.length; i++) {
    const prev = ema[ema.length - 1];
    ema.push(values[i] * k + prev * (1 - k));
  }
  return ema;
}

// ── MACD calculation ─────────────────────────────────────────
function calcMACD(closes: number[]) {
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  if (!ema12.length || !ema26.length)
    return {
      macdLine: [] as number[],
      signalLine: [] as number[],
      histogram: [] as number[],
    };

  const offset = ema12.length - ema26.length;
  const alignedEma12 = ema12.slice(offset);

  const macdLine = alignedEma12.map((v, i) => v - ema26[i]);
  const signalLine = calcEMA(macdLine, 9);

  const sigOffset = macdLine.length - signalLine.length;
  const alignedMacd = macdLine.slice(sigOffset);
  const histogram = alignedMacd.map((v, i) => v - signalLine[i]);

  return { macdLine: alignedMacd, signalLine, histogram };
}

// ── SMA calculation ──────────────────────────────────────────
// Pulled out as a pure function so it always runs against the
// exact same `data` array passed to the candlestick series in
// the same effect pass — avoids any chance of computing SMA
// against a stale/shorter array than what's actually rendered.
// function calcSMASeries(data: Candle[], period: number) {
//   const smaData: { time: number; value: number }[] = [];
function calcSMASeries(data: Candle[], period: number) {
  const smaData: { time: Time; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1); // inclusive window of `period` candles ending at i
    const avg = slice.reduce((s, c) => s + c.close, 0) / period;
    smaData.push({ time: data[i].time, value: +avg.toFixed(2) });
  }
  return smaData;
}

export default function CandlestickChart({ data }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
  } | null>(null);
  const [showSMA, setShowSMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);

  const isDark = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (!ref.current) return;
    if (!data || data.length === 0) return; // guard against an empty/loading array briefly mounting the chart

    const dark = isDark();
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 460,
      layout: {
        background: {
          type: ColorType.Solid,
          color: dark ? "#111827" : "#ffffff",
        },
        textColor: dark ? "#6b7280" : "#6b7280",
      },
      grid: {
        vertLines: { color: dark ? "#1a2332" : "#f0f2f5" },
        horzLines: { color: dark ? "#1a2332" : "#f0f2f5" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: dark ? "#1e2d3d" : "#e2e6ea" },
      timeScale: {
        borderColor: dark ? "#1e2d3d" : "#e2e6ea",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });
    const volumes = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      color: "#94a3b8",
    });
    volumes
      .priceScale()
      .applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    const sma = chart.addSeries(LineSeries, { color: "#6366f1", lineWidth: 2 });

    // Set candle + volume data first, from the SAME `data` reference
    // candles.setData(data);
    candles.setData(
      data.map((d) => ({
        ...d,
        time: d.time as Time,
      })),
    );

    volumes.setData(
      data.map((d) => ({
        time: d.time as Time,
        value: d.volume ?? 0,
        color:
          d.close >= d.open ? "rgba(22,163,74,0.4)" : "rgba(220,38,38,0.4)",
      })),
    );
    // volumes.setData(
    //   data.map((d) => ({
    //     time: d.time,
    //     value: d.volume ?? 0,
    //     color:
    //       d.close >= d.open ? "rgba(22,163,74,0.4)" : "rgba(220,38,38,0.4)",
    //   })),
    // );

    // SMA computed from the exact same `data` array, in the same pass —
    // guarantees the line always extends to the same final timestamp
    // as the candlesticks, no matter how `data` arrived.
    if (showSMA) {
      const smaData = calcSMASeries(data, 20);
      sma.setData(smaData);
    } else {
      sma.setData([]);
    }

    chart.subscribeCrosshairMove((p) => {
      if (!p.time || !p.seriesData) return;

      const c = p.seriesData.get(candles);

      if (c && "open" in c && "high" in c && "low" in c && "close" in c) {
        setHover({
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        });
      }
    });

    // fitContent AFTER all series have their data set, so the visible
    // range accounts for every series, not just whichever was set first
    chart.timeScale().fitContent();

    const resize = () => {
      if (ref.current) chart.applyOptions({ width: ref.current.clientWidth });
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [data, showSMA]);

  const latestRSI =
    data.length > 14
      ? (() => {
          let g = 0,
            l = 0;
          for (let i = data.length - 14; i < data.length; i++) {
            const d = data[i].close - data[i - 1].close;
            d >= 0 ? (g += d) : (l += Math.abs(d));
          }
          const rs = l === 0 ? 100 : g / 14 / (l / 14);
          return +(100 - 100 / (1 + rs)).toFixed(2);
        })()
      : 0;

  const closes = data.map((d) => d.close);
  const { macdLine, signalLine, histogram } = calcMACD(closes);

  const latestMacd = macdLine.length ? macdLine[macdLine.length - 1] : null;
  const latestSignal = signalLine.length
    ? signalLine[signalLine.length - 1]
    : null;
  const latestHistogram = histogram.length
    ? histogram[histogram.length - 1]
    : null;

  const macdAvailable =
    closes.length >= 35 && latestMacd !== null && latestSignal !== null;

  const macdBullish =
    macdAvailable && (latestMacd as number) > (latestSignal as number);
  const macdSignalLabel = !macdAvailable
    ? "Not enough data"
    : macdBullish
      ? "Bullish ↑"
      : "Bearish ↓";
  const macdSignalColor = !macdAvailable
    ? "var(--text-muted)"
    : macdBullish
      ? "var(--up)"
      : "var(--down)";

  const indicators = [
    { label: "SMA 20", active: showSMA, toggle: () => setShowSMA(!showSMA) },
    { label: "RSI", active: showRSI, toggle: () => setShowRSI(!showRSI) },
    { label: "MACD", active: showMACD, toggle: () => setShowMACD(!showMACD) },
  ];

  const ohlc = hover
    ? [
        { label: "O", val: hover.open, color: "var(--text-secondary)" },
        { label: "H", val: hover.high, color: "var(--up)" },
        { label: "L", val: hover.low, color: "var(--down)" },
        { label: "C", val: hover.close, color: "var(--accent-teal)" },
      ]
    : [];

  // Show a small note if the chart has data but not enough for a full SMA20 window
  const smaInsufficient = showSMA && data.length > 0 && data.length < 20;

  return (
    <div>
      {/* OHLC row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, minHeight: 32 }}>
        {ohlc.length > 0 ? (
          ohlc.map((o) => (
            <div
              key={o.label}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                color: o.color,
                fontWeight: 600,
              }}
            >
              {o.label}:{" "}
              <span style={{ color: "var(--text-primary)" }}>{o.val}</span>
            </div>
          ))
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Hover chart for OHLC data
          </span>
        )}
      </div>

      {/* Chart */}
      <div
        ref={ref}
        style={{
          width: "100%",
          border: "1px solid var(--border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      />

      {smaInsufficient && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
          SMA 20 needs at least 20 candles — switch to a longer timeframe to see
          the full line.
        </p>
      )}

      {/* Toggles */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {indicators.map((ind) => (
          <button
            key={ind.label}
            onClick={ind.toggle}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              background: ind.active ? "var(--accent-teal)" : "var(--bg-hover)",
              color: ind.active ? "#fff" : "var(--text-secondary)",
              border:
                "1.5px solid " +
                (ind.active ? "var(--accent-teal)" : "var(--border)"),
            }}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {showRSI && (
        <div
          style={{
            marginTop: 14,
            padding: 16,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            borderLeft: "3px solid var(--warn)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              RSI (14)
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color:
                  latestRSI > 70
                    ? "var(--down)"
                    : latestRSI < 30
                      ? "var(--up)"
                      : "var(--warn)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {latestRSI}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--bg-base)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${latestRSI}%`,
                background:
                  latestRSI > 70
                    ? "var(--down)"
                    : latestRSI < 30
                      ? "var(--up)"
                      : "var(--warn)",
                borderRadius: 3,
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            <span>Oversold (&lt;30)</span>
            <span>Overbought (&gt;70)</span>
          </div>
        </div>
      )}

      {showMACD && (
        <div
          style={{
            marginTop: 14,
            padding: 16,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            borderLeft: "3px solid var(--indigo)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: macdAvailable ? 12 : 0,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                MACD (12, 26, 9)
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 3,
                }}
              >
                Trend-following momentum indicator
              </p>
            </div>
            <span
              style={{ fontSize: 15, fontWeight: 800, color: macdSignalColor }}
            >
              {macdSignalLabel}
            </span>
          </div>

          {macdAvailable && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "var(--bg-base)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 5,
                  }}
                >
                  MACD Line
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {(latestMacd as number).toFixed(2)}
                </p>
              </div>
              <div
                style={{
                  background: "var(--bg-base)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 5,
                  }}
                >
                  Signal Line
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {(latestSignal as number).toFixed(2)}
                </p>
              </div>
              <div
                style={{
                  background: "var(--bg-base)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 5,
                  }}
                >
                  Histogram
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      (latestHistogram as number) >= 0
                        ? "var(--up)"
                        : "var(--down)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {(latestHistogram as number) >= 0 ? "+" : ""}
                  {(latestHistogram as number).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {!macdAvailable && (
            <p
              style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}
            >
              MACD needs at least 35 days of price history. Try a longer
              timeframe (1Y) for this stock.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
