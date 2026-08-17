import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type Stock = { _id:string; symbol:string; price:number; change:number }
type Props = { title:string; stocks:Stock[] }

export default function MarketMovers({ title, stocks }: Props) {
  const isGainers = title.toLowerCase().includes("gain") || stocks.every(s => s.change >= 0)

  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12, boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>{title}</h2>
        <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background: isGainers?"var(--up-bg)":"var(--down-bg)", color: isGainers?"var(--up)":"var(--down)", fontWeight:600 }}>
          {stocks.length} stocks
        </span>
      </div>
      {stocks.map((s, i) => {
        const up = s.change >= 0
        return (
          <div key={s._id} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 18px", borderBottom: i<stocks.length-1 ? "1px solid var(--border)" : "none",
            transition:"background 0.12s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
          >
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>{s.symbol}</p>
              <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2, fontFamily:"'JetBrains Mono', monospace" }}>₹{s.price.toFixed(2)}</p>
            </div>
            <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:13, fontWeight:700, color: up?"var(--up)":"var(--down)", fontFamily:"'JetBrains Mono', monospace" }}>
              {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
              {up?"+":""}{s.change.toFixed(2)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
