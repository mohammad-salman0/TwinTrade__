"use client";

import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type ChartData = { time: string; price: number }
type Props = {
  symbol?: string; companyName?: string; currentPrice?: number;
  change?: number; halalStatus?: "Halal" | "Non-Halal" | "Review Needed"; data?: ChartData[];
}

const TF = ["1D","1W","1M","1Y"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-md)" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>₹{payload[0].value.toFixed(2)}</p>
    </div>
  )
}

const HALAL_COLOR: Record<string, string> = { "Halal": "var(--up)", "Non-Halal": "var(--down)", "Review Needed": "var(--warn)" }

const metrics = [
  { label: "Market Cap", value: "₹6.2T" },
  { label: "P/E Ratio",  value: "28.6" },
  { label: "52W High",   value: "₹1,680" },
  { label: "Volume",     value: "2.1M" },
]

export default function StockChart({ symbol="N/A", companyName="Unknown", currentPrice=0, change=0, halalStatus="Review Needed", data=[] }: Props) {
  const [tf, setTf] = useState("1W")
  const [liveData, setLiveData] = useState(data)
  const isUp = change >= 0
  const halalColor = HALAL_COLOR[halalStatus]

  useEffect(() => { setLiveData(data) }, [data])
  useEffect(() => {
    if (!liveData.length) return
    const iv = setInterval(() => {
      setLiveData(prev => {
        const u = [...prev]
        const last = u[u.length-1]
        u[u.length-1] = { ...last, price: +(last.price + (Math.random()-.5)*5).toFixed(2) }
        return u
      })
    }, 3000)
    return () => clearInterval(iv)
  }, [liveData.length])

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>{companyName}</h2>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: halalColor + "18", color: halalColor, border: `1px solid ${halalColor}40` }}>{halalStatus}</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{symbol} · NSE</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", fontFamily: "'JetBrains Mono', monospace" }}>₹{currentPrice.toFixed(2)}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginTop: 4, color: isUp ? "var(--up)" : "var(--down)", fontSize: 13, fontWeight: 700 }}>
            <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: isUp ? "var(--up)" : "var(--down)", display: "inline-block" }} />
            {isUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
            {isUp?"+":""}{change.toFixed(2)}%
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
            <button className="btn-primary" style={{ background: "var(--up)", padding: "8px 18px", fontSize: 13 }}>Buy</button>
            <button className="btn-primary" style={{ background: "var(--down)", padding: "8px 18px", fontSize: 13 }}>Sell</button>
          </div>
        </div>
      </div>

      {/* Timeframe */}
      <div style={{ padding: "14px 24px 0", display: "flex", gap: 6 }}>
        {TF.map(t => (
          <button key={t} onClick={() => setTf(t)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            background: tf===t ? "var(--accent-teal)" : "var(--bg-hover)",
            color: tf===t ? "#fff" : "var(--text-secondary)",
            border: "none",
          }}>{t}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "8px 8px 8px", height: 300 }}>
        {liveData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveData} margin={{ top:8, right:8, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false}/>
              <XAxis dataKey="time" tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[(d:number)=>d*.995,(d:number)=>d*1.005]} tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="price" stroke="var(--accent-teal)" strokeWidth={2.5}
                fill="url(#sGrad)" dot={false}
                activeDot={{ r:5, fill:"var(--accent-teal)", stroke:"var(--bg-surface)", strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-muted)", fontSize:13 }}>No data available</div>
        )}
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", borderTop:"1px solid var(--border)" }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{ padding:"14px 20px", borderRight: i<3 ? "1px solid var(--border)" : "none" }}>
            <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4, fontWeight:500 }}>{m.label}</p>
            <p style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
