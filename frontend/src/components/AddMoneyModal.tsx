"use client"

import { useState } from "react"
import api from "@/services/api"
import { usePortfolio } from "@/context/PortfolioContext"
import { X, Plus } from "lucide-react"

type Props = { onClose: () => void }
const QUICK = [5000, 10000, 25000, 50000]

export default function AddMoneyModal({ onClose }: Props) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { refreshPortfolio } = usePortfolio()

  const handle = async () => {
    try {
      setLoading(true)
      await api.post("/wallet/add", { amount: Number(amount) })
      await refreshPortfolio()
      alert("Funds added successfully")
      onClose()
    } catch { alert("Failed to add funds") }
    finally { setLoading(false) }
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(5px)" }}>
      <div style={{ width:"100%", maxWidth:420, background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-lg)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ fontSize:17, fontWeight:800, color:"var(--text-primary)" }}>Add Funds</h2>
            <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:3 }}>Deposit to your trading wallet</p>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:7, border:"1.5px solid var(--border)", background:"var(--bg-hover)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-secondary)" }}>
            <X size={14}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", letterSpacing:"0.04em", display:"block", marginBottom:8, textTransform:"uppercase" }}>Amount (₹)</label>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
              className="tt-input" style={{ fontSize:22, fontWeight:800, fontFamily:"'JetBrains Mono', monospace" }} />
          </div>

          <div>
            <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:8, fontWeight:600 }}>QUICK SELECT</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => setAmount(String(q))}
                  style={{
                    padding:"8px 0", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
                    background: amount===String(q) ? "var(--accent-teal-bg)" : "var(--bg-base)",
                    color: amount===String(q) ? "var(--accent-teal)" : "var(--text-secondary)",
                    border: `1.5px solid ${amount===String(q) ? "var(--accent-teal)" : "var(--border)"}`,
                  }}>₹{q>=1000?`${q/1000}K`:q}</button>
              ))}
            </div>
          </div>

          {amount && Number(amount) > 0 && (
            <div style={{ padding:"12px 14px", borderRadius:9, background:"var(--accent-teal-bg)", border:"1px solid var(--accent-teal-border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:600 }}>Depositing</span>
              <span style={{ fontSize:18, fontWeight:800, color:"var(--accent-teal)", fontFamily:"'JetBrains Mono', monospace" }}>₹{Number(amount).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", gap:10 }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex:1 }}>Cancel</button>
          <button onClick={handle} disabled={loading || !amount} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
            <Plus size={14}/>{loading ? "Processing..." : "Add Funds"}
          </button>
        </div>
      </div>
    </div>
  )
}
