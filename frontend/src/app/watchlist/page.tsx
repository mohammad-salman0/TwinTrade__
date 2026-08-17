// src/app/watchlist/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoutes"
import api from "@/services/api"
import {
  Star, Trash2, ExternalLink, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw, BarChart2
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type WatchlistStock = { symbol: string; companyName: string }

type StockAnalysis = {
  price: number | null
  change: number
  halalStatus: string
  // SMA
  sma20: number | null
  sma50: number | null
  smaSignal: "BUY" | "SELL" | "NEUTRAL"
  // RSI
  rsi: number | null
  rsiSignal: "OVERSOLD" | "OVERBOUGHT" | "NEUTRAL"
  // extra
  high52w: number | null
  low52w:  number | null
  volume:  number | null
}

type AnalysisMap = Record<string, StockAnalysis>

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcSMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null
  const slice = prices.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / period
}

function calcRSI(prices: number[], period = 14): number | null {
  if (prices.length < period + 1) return null
  let gains = 0, losses = 0
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff >= 0) gains += diff
    else losses += Math.abs(diff)
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2))
}

function smaSignal(price: number | null, sma20: number | null, sma50: number | null): "BUY" | "SELL" | "NEUTRAL" {
  if (!price || !sma20 || !sma50) return "NEUTRAL"
  if (price > sma20 && sma20 > sma50) return "BUY"
  if (price < sma20 && sma20 < sma50) return "SELL"
  return "NEUTRAL"
}

function rsiSignal(rsi: number | null): "OVERSOLD" | "OVERBOUGHT" | "NEUTRAL" {
  if (rsi === null) return "NEUTRAL"
  if (rsi < 30) return "OVERSOLD"
  if (rsi > 70) return "OVERBOUGHT"
  return "NEUTRAL"
}

// ─── RSI colour ──────────────────────────────────────────────────────────────
function rsiColor(sig: string) {
  if (sig === "OVERSOLD")   return { color: "var(--up)",   bg: "var(--up-bg)",   border: "var(--up-border)" }
  if (sig === "OVERBOUGHT") return { color: "var(--down)", bg: "var(--down-bg)", border: "var(--down-border)" }
  return { color: "var(--text-muted)", bg: "var(--bg-base)", border: "var(--border)" }
}

function smaColor(sig: string) {
  if (sig === "BUY")  return { color: "var(--up)",   bg: "var(--up-bg)",   border: "var(--up-border)" }
  if (sig === "SELL") return { color: "var(--down)", bg: "var(--down-bg)", border: "var(--down-border)" }
  return { color: "var(--text-muted)", bg: "var(--bg-base)", border: "var(--border)" }
}

// ─── RSI gauge bar ───────────────────────────────────────────────────────────
function RSIBar({ rsi }: { rsi: number | null }) {
  if (rsi === null) return <span style={{ fontSize: 12, color: "var(--text-muted)" }}>N/A</span>
  const color = rsi < 30 ? "var(--up)" : rsi > 70 ? "var(--down)" : "var(--warn)"
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 80, height: 5, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(rsi, 100)}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{rsi}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function WatchlistPage() {
  const [stocks,   setStocks]   = useState<WatchlistStock[]>([])
  const [analysis, setAnalysis] = useState<AnalysisMap>({})
  const [loading,  setLoading]  = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // ── Fetch watchlist ─────────────────────────────────────────────────────────
  const fetchWatchlist = useCallback(async () => {
    try {
      const r = await api.get("/watchlist")
      const list: WatchlistStock[] = r.data.stocks || []
      setStocks(list)
      return list
    } catch (e) {
      console.log(e)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Fetch price + history for one symbol, compute RSI / SMA ────────────────
  const fetchAnalysis = useCallback(async (symbol: string): Promise<StockAnalysis> => {
    try {
      // Stock info (price, change, halalStatus)
      const infoRes = await api.get(`/stocks/${symbol}`)
      const info = infoRes.data

      // History for SMA/RSI
      let closePrices: number[] = []
      let high52w: number | null = null
      let low52w:  number | null = null
      let volume:  number | null = null

      try {
        const histRes = await api.get(`/stocks/${symbol}/history`, {
          params: { range: "3mo", interval: "1d" }
        })
        const candles: { close: number; high: number; low: number; volume?: number }[] = histRes.data || []
        closePrices = candles.map(c => c.close).filter(Boolean)
        const highs  = candles.map(c => c.high).filter(Boolean)
        const lows   = candles.map(c => c.low).filter(Boolean)
        high52w = highs.length  ? Math.max(...highs)  : null
        low52w  = lows.length   ? Math.min(...lows)   : null
        volume  = candles.length ? (candles[candles.length - 1].volume ?? null) : null
      } catch (_) {}

      const sma20 = calcSMA(closePrices, 20)
      const sma50 = calcSMA(closePrices, 50)
      const rsi   = calcRSI(closePrices, 14)
      const price = info.price ?? null

      return {
        price,
        change:      info.change     ?? 0,
        halalStatus: info.halalStatus ?? "—",
        sma20,
        sma50,
        smaSignal:   smaSignal(price, sma20, sma50),
        rsi,
        rsiSignal:   rsiSignal(rsi),
        high52w,
        low52w,
        volume,
      }
    } catch (_) {
      return { price: null, change: 0, halalStatus: "—", sma20: null, sma50: null, smaSignal: "NEUTRAL", rsi: null, rsiSignal: "NEUTRAL", high52w: null, low52w: null, volume: null }
    }
  }, [])

  // ── Load all analysis in parallel ───────────────────────────────────────────
  const loadAnalysis = useCallback(async (list: WatchlistStock[]) => {
    if (!list.length) return
    const results = await Promise.all(list.map(s => fetchAnalysis(s.symbol)))
    const map: AnalysisMap = {}
    list.forEach((s, i) => { map[s.symbol] = results[i] })
    setAnalysis(map)
    setLastUpdated(new Date())
  }, [fetchAnalysis])

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchWatchlist().then(loadAnalysis)
  }, [])

  // ── Manual refresh ──────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true)
    const list = await fetchWatchlist()
    await loadAnalysis(list)
    setRefreshing(false)
  }

  // ── Remove stock ────────────────────────────────────────────────────────────
  const removeStock = async (symbol: string) => {
    try {
      setRemoving(symbol)
      await api.delete(`/watchlist/${symbol}`)
      const list = await fetchWatchlist()
      await loadAnalysis(list)
    } catch (e) { console.log(e) }
    finally { setRemoving(null) }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── HEADER ─────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Star size={13} color="var(--warn)" fill="var(--warn)" />
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Watchlist</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>
                Watchlist
              </h1>
              <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
                Live prices · RSI · SMA analysis for your halal stocks.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {lastUpdated && (
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button onClick={handleRefresh} disabled={refreshing || loading}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", background: "var(--bg-surface)", color: "var(--text-secondary)", border: "1px solid var(--border)", transition: "all 0.15s", opacity: refreshing ? 0.6 : 1 }}>
                <RefreshCw size={13} style={{ animation: refreshing ? "spin 0.75s linear infinite" : "none" }} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              {!loading && stocks.length > 0 && (
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "var(--warn-bg)", border: "1px solid rgba(217,119,6,0.25)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Star size={13} color="var(--warn)" fill="var(--warn)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--warn)" }}>{stocks.length} watching</span>
                </div>
              )}
            </div>
          </div>

          {/* ── LOADING ────────────────────────────────────────────────────── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 }}>
              <div className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--warn)" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading watchlist & analysis...</p>
            </div>

          ) : stocks.length === 0 ? (
            /* ── EMPTY ─────────────────────────────────────────────────────── */
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "60px 22px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--warn-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Star size={24} color="var(--warn)" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>No stocks watched yet</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Browse market stocks and add your favorites here.</p>
              <Link href="/stocks">
                <button className="btn-primary" style={{ display: "inline-flex" }}>
                  <TrendingUp size={14} /> Browse Stocks
                </button>
              </Link>
            </div>

          ) : (
            /* ── STOCK TABLE WITH ANALYSIS ─────────────────────────────────── */
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>

              {/* Table header */}
              <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-base)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Monitored Stocks — Live Analysis</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{stocks.length} symbols</span>
              </div>

              {/* Column labels */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 1.4fr 1.2fr 1fr",
                padding: "10px 22px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-base)",
                gap: 8,
              }}>
                {["Stock", "Price / Change", "Halal", "RSI (14)", "SMA Signal", "52W Range", "Actions"].map(col => (
                  <span key={col} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {col}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {stocks.map((stock, i) => {
                const a = analysis[stock.symbol]
                const isUp = (a?.change ?? 0) >= 0
                const rsiC = rsiColor(a?.rsiSignal ?? "NEUTRAL")
                const smaC = smaColor(a?.smaSignal ?? "NEUTRAL")

                return (
                  <div key={stock.symbol}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 1.4fr 1.2fr 1fr",
                      padding: "16px 22px",
                      borderBottom: i < stocks.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
                  >

                    {/* ── Stock name ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--warn-bg)", border: "1px solid rgba(217,119,6,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "var(--warn)", fontFamily: "'JetBrains Mono', monospace" }}>
                          {stock.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <Link href={`/stocks/${stock.symbol}`} style={{ textDecoration: "none" }}>
                          <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent-teal)" }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)" }}>
                            {stock.symbol}
                          </p>
                        </Link>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{stock.companyName}</p>
                      </div>
                    </div>

                    {/* ── Price / Change ── */}
                    <div>
                      {a ? (
                        <>
                          <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                            {a.price != null ? `₹${a.price.toFixed(2)}` : "—"}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3, fontSize: 12, fontWeight: 700, color: isUp ? "var(--up)" : "var(--down)", fontFamily: "'JetBrains Mono', monospace" }}>
                            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {isUp ? "+" : ""}{a.change.toFixed(2)}%
                          </div>
                        </>
                      ) : (
                        <div className="spin" style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--accent-teal)" }} />
                      )}
                    </div>

                    {/* ── Halal Status ── */}
                    <div>
                      {a ? (
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                          background: a.halalStatus === "Halal" ? "var(--up-bg)" : a.halalStatus === "Non-Halal" ? "var(--down-bg)" : "var(--warn-bg)",
                          color:      a.halalStatus === "Halal" ? "var(--up)"   : a.halalStatus === "Non-Halal" ? "var(--down)"   : "var(--warn)",
                          border: `1px solid ${a.halalStatus === "Halal" ? "var(--up-border)" : a.halalStatus === "Non-Halal" ? "var(--down-border)" : "rgba(217,119,6,0.3)"}`,
                          whiteSpace: "nowrap",
                        }}>
                          {a.halalStatus}
                        </span>
                      ) : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>}
                    </div>

                    {/* ── RSI ── */}
                    <div>
                      {a ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <RSIBar rsi={a.rsi} />
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: rsiC.bg, color: rsiC.color, border: `1px solid ${rsiC.border}`, display: "inline-block", letterSpacing: "0.04em" }}>
                            {a.rsiSignal === "OVERSOLD" ? "OVERSOLD — BUY ZONE" : a.rsiSignal === "OVERBOUGHT" ? "OVERBOUGHT — SELL ZONE" : "NEUTRAL"}
                          </span>
                        </div>
                      ) : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Calculating...</span>}
                    </div>

                    {/* ── SMA ── */}
                    <div>
                      {a ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <div>
                              <span style={{ fontSize: 9, color: "var(--text-muted)", display: "block", letterSpacing: "0.06em", marginBottom: 1 }}>SMA 20</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                                {a.sma20 != null ? `₹${a.sma20.toFixed(1)}` : "—"}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontSize: 9, color: "var(--text-muted)", display: "block", letterSpacing: "0.06em", marginBottom: 1 }}>SMA 50</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                                {a.sma50 != null ? `₹${a.sma50.toFixed(1)}` : "—"}
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: smaC.bg, color: smaC.color, border: `1px solid ${smaC.border}`, display: "inline-block", letterSpacing: "0.04em" }}>
                            {a.smaSignal === "BUY" ? "▲ BULLISH CROSSOVER" : a.smaSignal === "SELL" ? "▼ BEARISH CROSSOVER" : "— SIDEWAYS"}
                          </span>
                        </div>
                      ) : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Calculating...</span>}
                    </div>

                    {/* ── 52W Range ── */}
                    <div>
                      {a && (a.high52w || a.low52w) ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <TrendingUp size={10} color="var(--up)" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--up)", fontFamily: "'JetBrains Mono', monospace" }}>
                              ₹{a.high52w?.toFixed(0) ?? "—"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <TrendingDown size={10} color="var(--down)" />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--down)", fontFamily: "'JetBrains Mono', monospace" }}>
                              ₹{a.low52w?.toFixed(0) ?? "—"}
                            </span>
                          </div>
                          {/* Range position bar */}
                          {a.price && a.high52w && a.low52w && (
                            <div style={{ width: 70, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden", marginTop: 2 }}>
                              <div style={{ height: "100%", width: `${Math.min(((a.price - a.low52w) / (a.high52w - a.low52w)) * 100, 100)}%`, background: "var(--accent-teal)", borderRadius: 2, transition: "width 0.5s" }} />
                            </div>
                          )}
                        </div>
                      ) : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>}
                    </div>

                    {/* ── Actions ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <Link href={`/stocks/${stock.symbol}`}>
                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "var(--accent-teal-bg)", color: "var(--accent-teal)", border: "1px solid var(--accent-teal-border)", width: "100%", justifyContent: "center" }}>
                          <ExternalLink size={10} /> View
                        </button>
                      </Link>
                      <button onClick={() => removeStock(stock.symbol)} disabled={removing === stock.symbol}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: removing === stock.symbol ? "not-allowed" : "pointer", background: removing === stock.symbol ? "var(--bg-hover)" : "var(--down-bg)", color: removing === stock.symbol ? "var(--text-muted)" : "var(--down)", border: `1px solid ${removing === stock.symbol ? "var(--border)" : "var(--down-border)"}`, opacity: removing === stock.symbol ? 0.6 : 1, width: "100%", justifyContent: "center" }}>
                        <Trash2 size={10} />{removing === stock.symbol ? "..." : "Remove"}
                      </button>
                    </div>

                  </div>
                )
              })}

            </div>
          )}

          {/* ── ANALYSIS LEGEND ─────────────────────────────────────────────── */}
          {stocks.length > 0 && !loading && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 22px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
                Analysis Guide
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { icon: Activity, label: "RSI < 30", desc: "Oversold — potential buy zone", color: "var(--up)" },
                  { icon: Activity, label: "RSI > 70", desc: "Overbought — potential sell zone", color: "var(--down)" },
                  { icon: BarChart2, label: "SMA Bullish", desc: "Price > SMA20 > SMA50 — uptrend", color: "var(--up)" },
                  { icon: BarChart2, label: "SMA Bearish", desc: "Price < SMA20 < SMA50 — downtrend", color: "var(--down)" },
                  { icon: TrendingUp, label: "52W Range bar", desc: "Position of current price within 52-week range", color: "var(--accent-teal)" },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={13} color={item.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}