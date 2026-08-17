type Props = { title:string; value:string|number; change?:string; positive?:boolean; accent?:string }

export default function StatsCard({ title, value, change, positive=true, accent="var(--accent-teal)" }: Props) {
  return (
    <div style={{
      background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12,
      padding:"18px 20px", boxShadow:"var(--shadow-sm)", borderTop:`3px solid ${accent}`,
    }}>
      <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:10 }}>{title}</p>
      <p style={{ fontSize:24, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.4px", fontFamily:"'JetBrains Mono', monospace" }}>{value}</p>
      {change && (
        <p style={{ fontSize:12, fontWeight:700, color: positive?"var(--up)":"var(--down)", marginTop:6, display:"flex", alignItems:"center", gap:3 }}>
          {positive ? "▲" : "▼"} {change}
        </p>
      )}
    </div>
  )
}
