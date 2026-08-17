"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

type PortfolioItem = { symbol: string; allocation: number }
type Props = { data: PortfolioItem[] }

const COLORS = ["#00c896","#6366f1","#f59e0b","#ef4444","#06b6d4","#8b5cf6","#10b981"]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:8, padding:"8px 12px", boxShadow:"var(--shadow-md)" }}>
      <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>{payload[0].name}</p>
      <p style={{ fontSize:13, color:"var(--accent-teal)", fontFamily:"'JetBrains Mono', monospace" }}>{payload[0].value.toFixed(2)}%</p>
    </div>
  )
}

export default function AdvisorPieChart({ data }: Props) {
  const safe = (data||[]).filter(Boolean).map(d => ({ symbol:d.symbol, allocation:Number(d.allocation||0) }))
  if (!safe.length) return (
    <div style={{ height:320, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, color:"var(--text-muted)" }}>
      <div style={{ width:60, height:60, borderRadius:"50%", border:"2px dashed var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>—</div>
      <p style={{ fontSize:13 }}>No allocation data</p>
    </div>
  )
  return (
    <div style={{ height:320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={safe} dataKey="allocation" nameKey="symbol" cx="50%" cy="45%" outerRadius={105} innerRadius={60} paddingAngle={3} strokeWidth={0}>
            {safe.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} opacity={0.9}/>)}
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
          <Legend formatter={v => <span style={{ fontSize:11, color:"var(--text-secondary)", fontWeight:500 }}>{v}</span>}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
