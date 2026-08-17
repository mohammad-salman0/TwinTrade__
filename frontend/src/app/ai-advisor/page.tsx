// src/app/ai-advisor/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoutes"
import AdvisorPieChart from "@/components/AdvisorPieChart"
import api from "@/services/api"
import { Brain, ShieldCheck, TrendingUp, PieChart, Sparkles, ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react"

export default function AIAdvisorPage() {
  const [amount, setAmount] = useState("10000")
  const [riskLevel, setRiskLevel] = useState("moderate")
  const [duration, setDuration] = useState("long")
  const [halalPreference, setHalalPreference] = useState("halal")
  const [sector, setSector] = useState("All")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const generateAdvice = async () => {
    try {
      setLoading(true)
      const response = await api.post("/ai-advisor/generate", {
        amount: Number(amount),
        riskLevel,
        duration,
        halalPreference,
        sectors: [sector],
      })
      setResult(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const selectStyle = {
    width: "100%",
    background: "var(--bg-base)",
    border: "1.5px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
    transition: "border-color 0.15s",
  }

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: 8,
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* HEADER */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Brain size={16} color="var(--indigo)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>AI-Powered</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>
              AI Investment Advisor
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14, maxWidth: 560, lineHeight: 1.7 }}>
              Generate intelligent halal investment portfolios powered by AI-based diversification, risk analysis, and compliance scoring.
            </p>
          </div>

          {/* FORM CARD */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-base)", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color="var(--warn)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Portfolio Configuration</span>
            </div>

            <div style={{ padding: "24px 22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>

              {/* AMOUNT */}
              <div>
                <label style={labelStyle}>Investment Amount (₹)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ ...selectStyle, paddingLeft: 28, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}
                  />
                </div>
              </div>

              {/* RISK */}
              <div>
                <label style={labelStyle}>Risk Level</label>
                <div style={{ position: "relative" }}>
                  <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} style={selectStyle}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* DURATION */}
              <div>
                <label style={labelStyle}>Investment Duration</label>
                <div style={{ position: "relative" }}>
                  <select value={duration} onChange={e => setDuration(e.target.value)} style={selectStyle}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}>
                    <option value="short">Short Term</option>
                    <option value="medium">Medium Term</option>
                    <option value="long">Long Term</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* HALAL PREFERENCE */}
              <div>
                <label style={labelStyle}>Halal Preference</label>
                <div style={{ position: "relative" }}>
                  <select value={halalPreference} onChange={e => setHalalPreference(e.target.value)} style={selectStyle}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}>
                    <option value="halal">Halal Only</option>
                    <option value="review">Include Review Needed</option>
                    <option value="all">Include All</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* SECTOR */}
              <div>
                <label style={labelStyle}>Preferred Sector</label>
                <div style={{ position: "relative" }}>
                  <select value={sector} onChange={e => setSector(e.target.value)} style={selectStyle}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}>
                    <option>All</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>FMCG</option>
                    <option>Energy</option>
                    <option>Automobile</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* GENERATE BUTTON */}
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={generateAdvice}
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "11px 20px", fontSize: 14, opacity: loading ? 0.7 : 1 }}
                >
                  <Brain size={15} />
                  {loading ? "Generating..." : "Generate AI Portfolio"}
                </button>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "48px 22px", textAlign: "center" }}>
              <div className="spin" style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--indigo)", margin: "0 auto 16px" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Generating your portfolio...</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>AI is analyzing NIFTY 500 halal stocks for optimal allocation</p>
            </div>
          )}

          {/* RESULTS */}
          {result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* SCORE CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                {[
                  { label: "Halal Score",      value: `${result.halalScore}%`,              icon: ShieldCheck, accent: "var(--up)",     bg: "var(--up-bg)" },
                  { label: "Risk Profile",      value: result.riskLevel,                     icon: TrendingUp,  accent: "var(--indigo)", bg: "var(--indigo-bg)" },
                  { label: "Diversification",   value: `${result.diversificationScore}/10`,  icon: PieChart,    accent: "var(--warn)",   bg: "var(--warn-bg)" },
                  { label: "AI Confidence",     value: "92%",                                icon: Brain,       accent: "var(--indigo)", bg: "var(--indigo-bg)" },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-sm)", borderTop: `3px solid ${item.accent}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{item.label}</p>
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: item.accent }}>
                          <Icon size={14} />
                        </div>
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 800, color: item.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* PIE CHART */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Portfolio Allocation</h2>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>AI-generated portfolio diversification</p>
                  </div>
                  <PieChart size={15} color="var(--warn)" />
                </div>
                <div style={{ padding: "16px 12px" }}>
                  <AdvisorPieChart data={result.portfolio} />
                </div>
              </div>

              {/* RECOMMENDED STOCKS */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Brain size={14} color="var(--indigo)" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Recommended Portfolio</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {result.portfolio.map((stock: any, index: number) => (
                    <Link href={`/stocks/${stock.symbol}`} key={index} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "20px 22px", gap: 20,
                        borderBottom: index < result.portfolio.length - 1 ? "1px solid var(--border)" : "none",
                        transition: "background 0.12s", cursor: "pointer",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
                      >
                        {/* Left info */}
                        <div style={{ flex: 1, minWidth: 240 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{stock.symbol}</h3>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                              background: stock.aiPrediction === 1 ? "var(--up-bg)" : "var(--down-bg)",
                              color: stock.aiPrediction === 1 ? "var(--up)" : "var(--down)",
                              border: `1px solid ${stock.aiPrediction === 1 ? "var(--up-border)" : "var(--down-border)"}`,
                              display: "inline-flex", alignItems: "center", gap: 3,
                            }}>
                              {stock.aiPrediction === 1 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              {stock.aiPrediction === 1 ? "Bullish AI" : "Bearish AI"}
                            </span>
                          </div>

                          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{stock.companyName}</p>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "var(--bg-base)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                              {stock.industry}
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                              background: stock.halalStatus === "Halal" ? "var(--up-bg)" : "var(--warn-bg)",
                              color: stock.halalStatus === "Halal" ? "var(--up)" : "var(--warn)",
                            }}>
                              {stock.halalStatus}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: "var(--indigo-bg)", color: "var(--indigo)" }}>
                              AI: {stock.aiConfidence}%
                            </span>
                          </div>

                          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 12 }}>{stock.reason}</p>

                          {/* Confidence bar */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>AI Confidence</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--indigo)", fontFamily: "'JetBrains Mono', monospace" }}>{stock.aiConfidence}%</span>
                            </div>
                            <div style={{ height: 5, background: "var(--bg-base)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--border)" }}>
                              <div style={{ height: "100%", width: `${stock.aiConfidence}%`, background: "var(--indigo)", borderRadius: 3, transition: "width 0.5s ease" }} />
                            </div>
                          </div>
                        </div>

                        {/* Right — allocation + investment */}
                        <div style={{ textAlign: "right", minWidth: 140 }}>
                          <p style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.5px" }}>
                            {stock.allocation}%
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, marginBottom: 16 }}>Allocation</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: "var(--up)", fontFamily: "'JetBrains Mono', monospace" }}>
                            ₹{stock.estimatedInvestment?.toLocaleString()}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Suggested Investment</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* AI SUMMARY */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--indigo-bg)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={14} color="var(--warn)" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>AI Summary</h2>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{result.summary}</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}