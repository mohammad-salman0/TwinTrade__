"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const data = [
  { day: "Mon", value: 220000 },
  { day: "Tue", value: 224000 },
  { day: "Wed", value: 221500 },
  { day: "Thu", value: 228000 },
  { day: "Fri", value: 232000 },
  { day: "Sat", value: 238000 },
  { day: "Sun", value: 245000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-md)",
    }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>
        ₹{payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `₹${v/1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke="var(--accent-teal)" strokeWidth={2.5}
          fill="url(#areaGrad)" dot={false}
          activeDot={{ r: 5, fill: "var(--accent-teal)", stroke: "var(--bg-surface)", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
