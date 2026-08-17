// "use client";

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useRouter } from "next/navigation";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// type Stock = { symbol:string; companyName:string; price:number|null; halalStatus:string; change:number; complianceScore:number }
// type Props = { stocks: Stock[] }

// const halalStyle = (s: string) => ({
//   "Halal":        { background:"var(--up-bg)",   color:"var(--up)",   border:"1px solid var(--up-border)" },
//   "Non-Halal":    { background:"var(--down-bg)", color:"var(--down)", border:"1px solid var(--down-border)" },
//   "Review Needed":{ background:"var(--warn-bg)", color:"var(--warn)", border:"none" },
// }[s] || { background:"var(--bg-hover)", color:"var(--text-muted)", border:"none" })

// export default function StockTable({ stocks }: Props) {
//   const router = useRouter()
//   const cols = ["Symbol", "Company", "Price", "Change", "Status"]

//   return (
//     <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", boxShadow:"var(--shadow-sm)" }}>
//       <Table>
//         <TableHeader>
//           <TableRow style={{ background:"var(--bg-base)", borderBottom:"1px solid var(--border)" }}>
//             {cols.map(c => (
//               <TableHead key={c} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", color:"var(--text-muted)", textTransform:"uppercase", padding:"12px 16px", borderBottom:"none" }}>
//                 {c}
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {stocks.map((s) => (
//             <TableRow key={s.symbol}
//               onClick={() => router.push(`/stocks/${s.symbol}`)}
//               style={{ borderBottom:"1px solid var(--border)", cursor:"pointer", transition:"background 0.12s" }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
//             >
//               <TableCell style={{ padding:"12px 16px" }}>
//                 <span style={{ fontSize:13, fontWeight:800, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>{s.symbol}</span>
//               </TableCell>

//               <TableCell style={{ padding:"12px 16px" }}>
//                 <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{s.companyName}</span>
//               </TableCell>

//               <TableCell style={{ padding:"12px 16px" }}>
//                 <span style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", fontFamily:"'JetBrains Mono', monospace" }}>
//                   {s.price != null ? `₹${s.price.toFixed(2)}` : "—"}
//                 </span>
//               </TableCell>

//               <TableCell style={{ padding:"12px 16px" }}>
//                 <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:700, color: s.change>=0 ? "var(--up)" : "var(--down)", fontFamily:"'JetBrains Mono', monospace" }}>
//                   {s.change >= 0 ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
//                   {s.change >= 0 ? "+" : ""}{s.change}%
//                 </span>
//               </TableCell>

//               <TableCell style={{ padding:"12px 16px" }}>
//                 <span style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:5, ...halalStyle(s.halalStatus) }}>
//                   {s.halalStatus}
//                 </span>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Stock = {
  symbol: string;
  companyName: string;
  price: number | null;
  halalStatus: string;
  change: number;
  complianceScore?: number;
};
type Props = { stocks: Stock[] };

const halalStyle = (s: string) =>
  ({
    Halal: {
      background: "var(--up-bg)",
      color: "var(--up)",
      border: "1px solid var(--up-border)",
    },
    "Non-Halal": {
      background: "var(--down-bg)",
      color: "var(--down)",
      border: "1px solid var(--down-border)",
    },
    "Review Needed": {
      background: "var(--warn-bg)",
      color: "var(--warn)",
      border: "none",
    },
  })[s] || {
    background: "var(--bg-hover)",
    color: "var(--text-muted)",
    border: "none",
  };

export default function StockTable({ stocks }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        // Horizontal scroll on small screens so table never overflows the page
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}
      >
        <thead>
          <tr
            style={{
              background: "var(--bg-base)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Symbol", "Company", "Price", "Change", "Status"].map((c) => (
              <th
                key={c}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  padding: "12px 16px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr
              key={s.symbol}
              onClick={() => router.push(`/stocks/${s.symbol}`)}
              style={{
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                transition: "background 0.12s",
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
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.symbol}
                </span>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {s.companyName}
                </span>
              </td>
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.price != null ? `₹${s.price.toFixed(2)}` : "—"}
                </span>
              </td>
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 12,
                    fontWeight: 700,
                    color: s.change >= 0 ? "var(--up)" : "var(--down)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.change >= 0 ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {s.change >= 0 ? "+" : ""}
                  {s.change}%
                </span>
              </td>
              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 5,
                    ...halalStyle(s.halalStatus),
                  }}
                >
                  {s.halalStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
