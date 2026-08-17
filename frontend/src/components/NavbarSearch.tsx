"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/services/api"
import { Search } from "lucide-react"

type Stock = { symbol:string; companyName:string; halalStatus:string }

export default function NavbarSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [results, setResults] = useState<Stock[]>([])
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    api.get("/stocks").then(r => setStocks(r.data)).catch(console.log)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setResults(stocks.filter(s =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.companyName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6))
  }, [query, stocks])

  return (
    <div style={{ position:"relative", width:"100%", maxWidth:380 }}>
      <div style={{
        display:"flex", alignItems:"center", gap:9,
        background:"var(--bg-base)", border:`1.5px solid ${focused?"var(--accent-teal)":"var(--border)"}`,
        borderRadius:9, padding:"8px 14px", transition:"border-color 0.15s",
      }}>
        <Search size={14} color="var(--text-muted)" />
        <input type="text" placeholder="Search stocks, symbols..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          style={{ background:"transparent", border:"none", outline:"none", fontSize:13.5, color:"var(--text-primary)", width:"100%" }}
        />
      </div>

      {focused && results.length > 0 && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:0, width:"100%", zIndex:99,
          background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:10,
          boxShadow:"var(--shadow-lg)", overflow:"hidden",
        }}>
          {results.map((s, i) => (
            <button key={s.symbol} onClick={() => { router.push(`/stocks/${s.symbol}`); setQuery(""); setResults([]) }}
              style={{
                width:"100%", textAlign:"left", padding:"10px 14px", background:"transparent", border:"none",
                borderBottom: i<results.length-1 ? "1px solid var(--border)" : "none",
                cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center",
                transition:"background 0.1s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>{s.symbol}</p>
                <p style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:2 }}>{s.companyName}</p>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 7px", borderRadius:5,
                background: s.halalStatus==="Halal"?"var(--up-bg)":"var(--down-bg)",
                color: s.halalStatus==="Halal"?"var(--up)":"var(--down)",
              }}>{s.halalStatus}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
