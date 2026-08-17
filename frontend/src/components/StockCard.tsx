// import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// type Props = { symbol:string; companyName:string; price:number; halalStatus:string; change:number }

// export default function StockCard({ symbol, companyName, price, halalStatus, change }: Props) {
//   const up = change >= 0
//   return (
//     <div className="card" style={{ padding:18, cursor:"pointer", transition:"box-shadow 0.2s, transform 0.15s" }}
//       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)" }}
//       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
//     >
//       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
//         <div>
//           <p style={{ fontSize:14, fontWeight:800, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>{symbol}</p>
//           <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{companyName}</p>
//         </div>
//         <span style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:5, background: halalStatus==="Halal"?"var(--up-bg)":"var(--down-bg)", color: halalStatus==="Halal"?"var(--up)":"var(--down)", border:`1px solid ${halalStatus==="Halal"?"var(--up-border)":"var(--down-border)"}` }}>{halalStatus}</span>
//       </div>
//       <p style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace", marginBottom:6 }}>₹{price.toFixed(2)}</p>
//       <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:700, color: up?"var(--up)":"var(--down)" }}>
//         {up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
//         {up?"+":""}{change.toFixed(2)}%
//       </span>
//     </div>
//   )
// }
"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Props = {
  symbol: string;
  companyName: string;
  price: number;
  halalStatus: string;
  change: number;
};

const HALAL_COLOR: Record<string, string> = {
  Halal: "var(--up)",
  "Non-Halal": "var(--down)",
  "Review Needed": "var(--warn)",
};
const HALAL_BG: Record<string, string> = {
  Halal: "var(--up-bg)",
  "Non-Halal": "var(--down-bg)",
  "Review Needed": "var(--warn-bg)",
};

export default function StockCard({
  symbol,
  companyName,
  price,
  halalStatus,
  change,
}: Props) {
  const router = useRouter();
  const up = change >= 0;

  return (
    <div
      className="card"
      onClick={() => router.push(`/stocks/${symbol}`)}
      style={{
        padding: "clamp(14px, 3vw, 18px)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "'JetBrains Mono', monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {symbol}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {companyName}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 5,
            flexShrink: 0,
            background: HALAL_BG[halalStatus] || "var(--bg-hover)",
            color: HALAL_COLOR[halalStatus] || "var(--text-muted)",
          }}
        >
          {halalStatus}
        </span>
      </div>
      <p
        style={{
          fontSize: "clamp(18px, 3.5vw, 22px)",
          fontWeight: 800,
          color: "var(--text-primary)",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 6,
        }}
      >
        ₹{price.toFixed(2)}
      </p>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: 12,
          fontWeight: 700,
          color: up ? "var(--up)" : "var(--down)",
        }}
      >
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {up ? "+" : ""}
        {change.toFixed(2)}%
      </span>
    </div>
  );
}
