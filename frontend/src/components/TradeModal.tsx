// "use client"

// import { useState } from "react"
// import api from "@/services/api"
// import { X, Plus, Minus, Zap } from "lucide-react"

// type Props = { isOpen:boolean; onClose:()=>void; type:"BUY"|"SELL"; symbol:string; companyName:string; price:number; onSuccess?:()=>void }

// export default function TradeModal({ isOpen, onClose, type, symbol, companyName, price, onSuccess }: Props) {
//   const [qty, setQty] = useState(1)
//   const [loading, setLoading] = useState(false)
//   if (!isOpen) return null

//   const isBuy = type === "BUY"
//   const accentColor = isBuy ? "var(--up)" : "var(--down)"
//   const accentBg = isBuy ? "var(--up-bg)" : "var(--down-bg)"
//   const accentBorder = isBuy ? "var(--up-border)" : "var(--down-border)"
//   const total = qty * price

//   const handle = async () => {
//     try {
//       setLoading(true)
//       await api.post(isBuy?"/orders/buy":"/orders/sell", { symbol, companyName, quantity:qty, price })
//       alert(`${type} order placed`)
//       onClose()
//       onSuccess?.()
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Trade failed")
//     } finally { setLoading(false) }
//   }

//   return (
//     <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(5px)" }}>
//       <div style={{ width:"100%", maxWidth:420, background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-lg)", overflow:"hidden" }}>
//         {/* Top strip */}
//         <div style={{ height:3, background: accentColor }} />

//         {/* Header */}
//         <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
//           <div>
//             <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
//               <span style={{ fontSize:11, fontWeight:800, padding:"3px 9px", borderRadius:5, background:accentBg, color:accentColor, border:`1px solid ${accentBorder}`, letterSpacing:"0.05em" }}>{type}</span>
//             </div>
//             <h2 style={{ fontSize:19, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px" }}>{symbol}</h2>
//             <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{companyName}</p>
//           </div>
//           <button onClick={onClose} style={{ width:30, height:30, borderRadius:7, border:"1.5px solid var(--border)", background:"var(--bg-hover)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-secondary)" }}>
//             <X size={14}/>
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
//           {/* Price */}
//           <div style={{ padding:"12px 16px", borderRadius:9, background:"var(--bg-base)", border:"1px solid var(--border)" }}>
//             <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Market Price</p>
//             <p style={{ fontSize:26, fontWeight:800, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>₹{price.toLocaleString()}</p>
//           </div>

//           {/* Quantity */}
//           <div>
//             <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Quantity</p>
//             <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//               <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:38, height:38, borderRadius:8, border:"1.5px solid var(--border)", background:"var(--bg-hover)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-secondary)" }}><Minus size={14}/></button>
//               <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1,+e.target.value))}
//                 className="tt-input" style={{ textAlign:"center", fontSize:18, fontWeight:800, fontFamily:"'JetBrains Mono', monospace" }} />
//               <button onClick={() => setQty(q => q+1)} style={{ width:38, height:38, borderRadius:8, border:"1.5px solid var(--border)", background:"var(--bg-hover)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-secondary)" }}><Plus size={14}/></button>
//             </div>
//           </div>

//           {/* Total */}
//           <div style={{ padding:"12px 16px", borderRadius:9, background:accentBg, border:`1px solid ${accentBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//             <span style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:600 }}>Total Value</span>
//             <span style={{ fontSize:20, fontWeight:800, color:accentColor, fontFamily:"'JetBrains Mono', monospace" }}>₹{total.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", gap:10 }}>
//           <button onClick={onClose} className="btn-ghost" style={{ flex:1 }}>Cancel</button>
//           <button onClick={handle} disabled={loading} className="btn-primary"
//             style={{ flex:1, justifyContent:"center", background: isBuy?"var(--up)":"var(--down)" }}>
//             <Zap size={13}/>{loading?"Processing...":type}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import api from "@/services/api";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: "BUY" | "SELL";
  symbol: string;
  companyName: string;
  price: number;
  onSuccess?: () => void;
};

export default function TradeModal({
  isOpen,
  onClose,
  type,
  symbol,
  companyName,
  price,
  onSuccess,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const total = quantity * price;

  const handleTrade = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = type === "BUY" ? "/orders/buy" : "/orders/sell";
      await api.post(endpoint, { symbol, companyName, quantity, price });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Trade failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isBuy = type === "BUY";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // p-4 so modal never touches edges on mobile
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 440,
          // max-height + overflow-y so it scrolls on very small screens
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(18px, 4vw, 22px)",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {type} {symbol}
            </h2>
            <p
              style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}
            >
              {companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Error */}
          {error && (
            <div
              style={{
                background: "var(--down-bg)",
                border: "1px solid var(--down-border)",
                borderLeft: "3px solid var(--down)",
                color: "var(--down)",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Current price */}
          <div
            style={{
              background: "var(--bg-base)",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              Current Price
            </p>
            <p
              style={{
                fontSize: "clamp(22px, 5vw, 30px)",
                fontWeight: 800,
                color: "var(--text-primary)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ₹{price.toFixed(2)}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              Quantity
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg-hover)",
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  flexShrink: 0,
                }}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: "var(--bg-base)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "var(--bg-hover)",
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              background: isBuy ? "var(--up-bg)" : "var(--down-bg)",
              border: `1px solid ${isBuy ? "var(--up-border)" : "var(--down-border)"}`,
              borderRadius: 10,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              Total Amount
            </span>
            <span
              style={{
                fontSize: "clamp(16px, 3vw, 20px)",
                fontWeight: 800,
                color: isBuy ? "var(--up)" : "var(--down)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ₹
              {total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleTrade}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s",
                background: isBuy ? "var(--up)" : "var(--down)",
              }}
            >
              {loading ? "Processing..." : type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
