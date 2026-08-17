// src/app/stocks/[symbol]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoutes";
import api from "@/services/api";
import CandlestickChart from "@/components/CandlestickChart";
import TradeModal from "@/components/TradeModal";
import { usePortfolio } from "@/context/PortfolioContext";
import type { Time } from "lightweight-charts";
import {
  TrendingUp,
  TrendingDown,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

type Stock = {
  symbol: string;
  companyName: string;
  industry: string;
  price: number | null;
  halalStatus: "Halal" | "Non-Halal" | "Review Needed";
  change: number;
  // real AI fields returned by /stocks/:symbol
  aiPrediction?: number; // 1 = bullish, 0 = bearish
  aiSignal?: string; // "Bullish" | "Bearish"
  aiConfidence?: number; // 0-100
  rsi?: number;
  volatility?: number;
  momentum?: number;
  return30d?: number;
  riskScore?: number;
  investmentStrength?: number;
  aiReason?: string;
};

const TIMEFRAMES = ["1D", "1W", "1M", "1Y"];

const HALAL_COLOR: Record<string, string> = {
  Halal: "var(--up)",
  "Non-Halal": "var(--down)",
  "Review Needed": "var(--warn)",
};
const HALAL_BG: Record<string, string> = {
  Halal: "var(--up-bg)",
  "Non-Halal": "var(--down-bg)",
  "Review Needed": "var(--warn-bg)",
};
const HALAL_BORDER: Record<string, string> = {
  Halal: "var(--up-border)",
  "Non-Halal": "var(--down-border)",
  "Review Needed": "rgba(217,119,6,0.25)",
};

function riskLabel(score?: number): string {
  if (score == null) return "—";
  if (score >= 70) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

function riskColor(score?: number): string {
  if (score == null) return "var(--text-muted)";
  if (score >= 70) return "var(--down)";
  if (score >= 40) return "var(--warn)";
  return "var(--up)";
}

export default function StockDetailPage() {
  const params = useParams();
  const rawSymbol = params?.symbol;
  const symbol =
    typeof rawSymbol === "string"
      ? rawSymbol
      : Array.isArray(rawSymbol)
        ? rawSymbol[0]
        : "";

  const { refreshPortfolio, refreshOrders } = usePortfolio();
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTF, setSelectedTF] = useState("1M");
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  // performance computed from real history data, not synthetic multipliers
  const [performance, setPerformance] = useState<Record<string, number | null>>(
    {
      "1D": null,
      "1W": null,
      "1M": null,
      "1Y": null,
    },
  );

  const fetchStock = async () => {
    try {
      setLoading(true);
      const r = await api.get(`/stocks/${symbol}`);
      setStock(r.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (range = "1mo", interval = "1d") => {
    try {
      const r = await api.get(`/stocks/${symbol}/history`, {
        params: { range, interval },
      });
      setChartData(r.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Pull real % change for each timeframe from actual history endpoints,
  // instead of multiplying today's change by arbitrary factors.
  const fetchPerformance = async () => {
    const ranges: Record<string, string> = {
      "1D": "5d",
      "1W": "5d",
      "1M": "1mo",
      "1Y": "1y",
    };
    const results: Record<string, number | null> = {
      "1D": null,
      "1W": null,
      "1M": null,
      "1Y": null,
    };

    await Promise.all(
      Object.entries(ranges).map(async ([key, range]) => {
        try {
          const r = await api.get(`/stocks/${symbol}/history`, {
            params: { range, interval: range === "5d" ? "1d" : "1wk" },
          });
          const candles: Candle[] = r.data;
          if (candles?.length >= 2) {
            const first = candles[0].close;
            const last = candles[candles.length - 1].close;
            results[key] = +(((last - first) / first) * 100).toFixed(2);
          }
        } catch (e) {
          /* leave as null, rendered as — */
        }
      }),
    );

    setPerformance(results);
  };

  const checkWatchlist = async () => {
    try {
      const r = await api.get("/watchlist");
      const list = r.data?.stocks || [];
      setInWatchlist(
        list.some((s: any) => s.symbol?.toUpperCase() === symbol.toUpperCase()),
      );
    } catch (e) {
      /* non-critical */
    }
  };

  const addToWatchlist = async () => {
    if (inWatchlist) return;
    try {
      setWatchlistLoading(true);
      await api.post("/watchlist/add", {
        symbol: stock?.symbol,
        companyName: stock?.companyName,
      });
      setInWatchlist(true);
    } catch {
      /* could surface a toast here if desired */
    } finally {
      setWatchlistLoading(false);
    }
  };

  useEffect(() => {
    if (!symbol) return;
    fetchStock();
    fetchHistory();
    fetchPerformance();
    checkWatchlist();
  }, [symbol]);

  const handleTimeframe = (tf: string) => {
    setSelectedTF(tf);
    const map: Record<string, [string, string]> = {
      "1D": ["5d", "15m"],
      "1W": ["5d", "30m"],
      "1M": ["1mo", "1d"],
      "1Y": ["1y", "1wk"],
    };
    const [range, interval] = map[tf] || ["1mo", "1d"];
    fetchHistory(range, interval);
  };

  const handleTradeSuccess = async () => {
    await fetchStock();
    await refreshPortfolio();
    await refreshOrders();
  };

  if (loading || !stock) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 16,
            }}
          >
            <div
              className="spin"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent-teal)",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Loading stock data...
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const isUp = stock.change >= 0;

  // ── REAL AI DATA (from backend, not client-side guesses) ──
  const isBullish = stock.aiPrediction === 1;
  const aiSignal = stock.aiSignal || (isBullish ? "Bullish" : "Bearish");
  const aiConfidence = stock.aiConfidence ?? null;
  const risk = riskLabel(stock.riskScore);
  const riskCol = riskColor(stock.riskScore);
  const aiReason =
    stock.aiReason || "AI analysis is currently unavailable for this stock.";

  const halalColor = HALAL_COLOR[stock.halalStatus] || "var(--warn)";
  const halalBg = HALAL_BG[stock.halalStatus] || "var(--warn-bg)";
  const halalBorder = HALAL_BORDER[stock.halalStatus] || "rgba(217,119,6,0.25)";

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* STOCK HEADER CARD */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div style={{ height: 3, background: halalColor }} />
            <div style={{ padding: "24px 28px" }}>
              {/* Company + Price row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      {stock.companyName}
                    </h1>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: halalBg,
                        color: halalColor,
                        border: `1px solid ${halalBorder}`,
                      }}
                    >
                      {stock.halalStatus}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: 4,
                    }}
                  >
                    {stock.symbol} · NSE
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-faint)" }}>
                    Industry: {stock.industry}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    ₹{stock.price?.toFixed(2)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 6,
                      marginTop: 6,
                      color: isUp ? "var(--up)" : "var(--down)",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    <span
                      className="live-dot"
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: isUp ? "var(--up)" : "var(--down)",
                        display: "inline-block",
                      }}
                    />
                    {isUp ? (
                      <TrendingUp size={15} />
                    ) : (
                      <TrendingDown size={15} />
                    )}
                    {isUp ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* PERFORMANCE GRID — real % change from history endpoint */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {Object.entries(performance).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: "var(--bg-base)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "12px 14px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      {key}
                    </p>
                    {val == null ? (
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                        }}
                      >
                        —
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: val >= 0 ? "var(--up)" : "var(--down)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {val >= 0 ? "+" : ""}
                        {val}%
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* TIMEFRAME BUTTONS */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTimeframe(tf)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: "none",
                      background:
                        selectedTF === tf
                          ? "var(--accent-teal)"
                          : "var(--bg-hover)",
                      color:
                        selectedTF === tf ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* CANDLESTICK CHART */}
              <CandlestickChart data={chartData} />

              {/* ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 24,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setBuyOpen(true)}
                  className="btn-primary"
                  style={{
                    background: "var(--up)",
                    padding: "11px 28px",
                    fontSize: 14,
                  }}
                >
                  <ArrowUpRight size={15} /> Buy Stock
                </button>
                <button
                  onClick={() => setSellOpen(true)}
                  className="btn-primary"
                  style={{
                    background: "var(--down)",
                    padding: "11px 28px",
                    fontSize: 14,
                  }}
                >
                  <ArrowDownRight size={15} /> Sell Stock
                </button>
                <button
                  onClick={addToWatchlist}
                  disabled={watchlistLoading || inWatchlist}
                  className="btn-ghost"
                  style={{
                    padding: "11px 28px",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: inWatchlist ? "default" : "pointer",
                    color: inWatchlist ? "var(--up)" : undefined,
                    borderColor: inWatchlist ? "var(--up-border)" : undefined,
                  }}
                >
                  {inWatchlist ? (
                    <>
                      <CheckCircle size={14} /> In Watchlist
                    </>
                  ) : (
                    <>
                      <Star size={14} />{" "}
                      {watchlistLoading ? "Adding..." : "Watchlist"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI OUTLOOK CARD — driven entirely by real backend AI fields */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Brain size={16} color="var(--indigo)" />
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                AI Market Outlook
              </h2>
            </div>

            {/* AI METRICS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 0,
              }}
            >
              {[
                {
                  label: "Signal",
                  value: aiSignal,
                  color: isBullish ? "var(--up)" : "var(--down)",
                  icon: Activity,
                  bg: isBullish ? "var(--up-bg)" : "var(--down-bg)",
                },
                {
                  label: "Confidence",
                  value: aiConfidence != null ? `${aiConfidence}%` : "—",
                  color: "var(--indigo)",
                  icon: Brain,
                  bg: "var(--indigo-bg)",
                },
                {
                  label: "Risk Level",
                  value: risk,
                  color: riskCol,
                  icon: AlertTriangle,
                  bg: "var(--warn-bg)",
                },
                {
                  label: "RSI (14)",
                  value: stock.rsi != null ? stock.rsi.toFixed(1) : "—",
                  color: "var(--accent-teal)",
                  icon: TrendingUp,
                  bg: "var(--accent-teal-bg)",
                },
              ].map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      padding: "18px 20px",
                      borderRight:
                        i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      background: item.bg,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      <Icon size={13} color={item.color} />
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: item.color,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* AI SUMMARY — real reasoning string from backend, no compliance score shown */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-base)",
              }}
            >
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                }}
              >
                {aiReason}
              </p>
            </div>
          </div>
        </div>

        {/* MODALS */}
        <TradeModal
          isOpen={buyOpen}
          onClose={() => setBuyOpen(false)}
          type="BUY"
          symbol={stock.symbol}
          companyName={stock.companyName}
          price={stock.price || 0}
          onSuccess={handleTradeSuccess}
        />
        <TradeModal
          isOpen={sellOpen}
          onClose={() => setSellOpen(false)}
          type="SELL"
          symbol={stock.symbol}
          companyName={stock.companyName}
          price={stock.price || 0}
          onSuccess={handleTradeSuccess}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
