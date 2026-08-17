// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowUpRight, ArrowDownRight, TrendingUp, Loader2 } from "lucide-react"
// import api from "@/services/api"

// type Stock = {
//   symbol: string
//   companyName: string
//   price: number | null
//   change: number | null
//   halalStatus: string
// }

// export default function TopMovers() {
//   const [stocks, setStocks] = useState<Stock[]>([])
//   const [loading, setLoading] = useState(true)

//   const fetchMovers = async () => {
//     try {
//       const res = await api.get("/stocks", {
//         params: { page: 1, pageSize: 25 },
//       })
//       const all: Stock[] = res.data?.stocks || []

//       // Sort by absolute % change, pick top 5 with valid price data
//       const sorted = all
//         .filter(s => s.change != null && s.price != null)
//         .sort((a, b) => Math.abs(b.change!) - Math.abs(a.change!))
//         .slice(0, 5)

//       setStocks(sorted)
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMovers()
//     // Refresh every 60 seconds to stay current
//     const interval = setInterval(fetchMovers, 60_000)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div style={{
//       background: "var(--bg-surface)", border: "1px solid var(--border)",
//       borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden",
//     }}>

//       {/* Header */}
//       <div style={{
//         padding: "16px 20px", borderBottom: "1px solid var(--border)",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <TrendingUp size={15} color="var(--up)" />
//           <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Top Movers</span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--up)", display: "inline-block" }} />
//           <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
//         </div>
//       </div>

//       {/* Loading state */}
//       {loading && (
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 20px", color: "var(--text-muted)" }}>
//           <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
//           <span style={{ fontSize: 13 }}>Fetching live data...</span>
//         </div>
//       )}

//       {/* Rows */}
//       {!loading && stocks.map((s, i) => {
//         const up = (s.change ?? 0) >= 0
//         return (
//           <Link key={s.symbol} href={`/stocks/${s.symbol}`} style={{ textDecoration: "none" }}>
//             <div
//               style={{
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 padding: "13px 20px",
//                 borderBottom: i < stocks.length - 1 ? "1px solid var(--border)" : "none",
//                 transition: "background 0.12s", cursor: "pointer",
//               }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
//             >
//               {/* Left — icon + name */}
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{
//                   width: 36, height: 36, borderRadius: 8, flexShrink: 0,
//                   background: up ? "var(--up-bg)" : "var(--down-bg)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <span style={{
//                     fontSize: 10, fontWeight: 800,
//                     color: up ? "var(--up)" : "var(--down)",
//                     fontFamily: "'JetBrains Mono', monospace",
//                   }}>
//                     {s.symbol.slice(0, 2)}
//                   </span>
//                 </div>
//                 <div style={{ minWidth: 0 }}>
//                   <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {s.symbol}
//                   </p>
//                   <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {s.companyName}
//                   </p>
//                 </div>
//               </div>

//               {/* Right — price + change */}
//               <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
//                 <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
//                   {s.price != null ? `₹${s.price.toLocaleString("en-IN")}` : "—"}
//                 </p>
//                 <p style={{
//                   fontSize: 12, fontWeight: 700, marginTop: 2,
//                   color: up ? "var(--up)" : "var(--down)",
//                   display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end",
//                 }}>
//                   {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
//                   {up ? "+" : ""}{s.change?.toFixed(2)}%
//                 </p>
//               </div>
//             </div>
//           </Link>
//         )
//       })}

//       {/* Empty state */}
//       {!loading && stocks.length === 0 && (
//         <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
//           No live data available
//         </div>
//       )}
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import api from "@/services/api";

type Stock = {
  symbol: string;
  companyName: string;
  price: number | null;
  change: number | null;
  halalStatus: string;
};

export default function TopMovers() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovers = async () => {
    try {
      const res = await api.get("/stocks", {
        params: { page: 1, pageSize: 25 },
      });
      const all: Stock[] = res.data?.stocks || [];

      // Sort by absolute % change, pick top 5 with valid price data
      const sorted = all
        .filter((s) => s.change != null && s.price != null)
        .sort((a, b) => Math.abs(b.change!) - Math.abs(a.change!))
        .slice(0, 5);

      setStocks(sorted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovers();
    // Refresh every 60 seconds to stay current
    const interval = setInterval(fetchMovers, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={15} color="var(--up)" />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Top Movers
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="live-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--up)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "32px 20px",
            color: "var(--text-muted)",
          }}
        >
          <Loader2
            size={16}
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <span style={{ fontSize: 13 }}>Fetching live data...</span>
        </div>
      )}

      {/* Rows */}
      {!loading &&
        stocks.map((s, i) => {
          const up = (s.change ?? 0) >= 0;
          return (
            <Link
              key={s.symbol}
              href={`/stocks/${s.symbol}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 20px",
                  borderBottom:
                    i < stocks.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.12s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                {/* Left — icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: up ? "var(--up-bg)" : "var(--down-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: up ? "var(--up)" : "var(--down)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.symbol}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.companyName}
                    </p>
                  </div>
                </div>

                {/* Right — price + change */}
                <div
                  style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {s.price != null
                      ? `₹${s.price.toLocaleString("en-IN")}`
                      : "—"}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 2,
                      color: up ? "var(--up)" : "var(--down)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    {up ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {up ? "+" : ""}
                    {s.change?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

      {/* Empty state */}
      {!loading && stocks.length === 0 && (
        <div
          style={{
            padding: "24px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          No live data available
        </div>
      )}
    </div>
  );
}
