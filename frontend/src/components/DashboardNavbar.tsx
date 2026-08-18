// "use client"

// import { useEffect, useState } from "react"
// import { Search, User, ChevronDown } from "lucide-react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import api from "@/services/api"
// import ThemeToggle from "@/components/ThemeToggle"
// import NotificationPanel from "@/components/NotificationPanel"

// type Stock = { symbol: string; companyName: string }
// type TickerItem = { sym: string; val: string; up: boolean }

// const FALLBACK_TICKER: TickerItem[] = [
//   { sym: "NIFTY",    val: "+1.24%", up: true  },
//   { sym: "SENSEX",   val: "+0.87%", up: true  },
//   { sym: "RELIANCE", val: "+2841",  up: true  },
//   { sym: "TCS",      val: "-3412",  up: false },
//   { sym: "INFY",     val: "+0.45%", up: true  },
//   { sym: "HDFC",     val: "+1623",  up: true  },
//   { sym: "ITC",      val: "-410",   up: false },
//   { sym: "SBI",      val: "+0.63%", up: true  },
//   { sym: "BAJFIN",   val: "+6780",  up: true  },
//   { sym: "WIPRO",    val: "-521",   up: false },
// ]

// export default function DashboardNavbar() {
//   const router = useRouter()

//   const [query,   setQuery]   = useState("")
//   const [stocks,  setStocks]  = useState<Stock[]>([])
//   const [results, setResults] = useState<Stock[]>([])
//   const [focused, setFocused] = useState(false)
//   const [ticker,  setTicker]  = useState<TickerItem[]>(FALLBACK_TICKER)

//   // Search pool
//   useEffect(() => {
//     api.get("/stocks", { params: { page: 1, pageSize: 100 } })
//       .then(r => setStocks(r.data?.stocks || []))
//       .catch(console.log)
//   }, [])

//   // Live ticker
//   const fetchTicker = async () => {
//     try {
//       const res  = await api.get("/stocks", { params: { page: 1, pageSize: 25 } })
//       const live = (res.data?.stocks || [])
//         .filter((s: any) => s.price != null && s.change != null)
//         .slice(0, 10)
//         .map((s: any) => ({
//           sym: s.symbol,
//           val: `${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%`,
//           up:  s.change >= 0,
//         }))
//       if (live.length > 0) setTicker(live)
//     } catch { /* keep fallback */ }
//   }

//   useEffect(() => {
//     fetchTicker()
//     const interval = setInterval(fetchTicker, 60_000)
//     return () => clearInterval(interval)
//   }, [])

//   // Search filter
//   useEffect(() => {
//     if (!query) { setResults([]); return }
//     setResults(
//       stocks
//         .filter(s =>
//           s.symbol.toLowerCase().includes(query.toLowerCase()) ||
//           s.companyName.toLowerCase().includes(query.toLowerCase())
//         )
//         .slice(0, 6)
//     )
//   }, [query, stocks])

//   const goToStock = (symbol: string) => {
//     setQuery(""); setResults([]); setFocused(false)
//     router.push(`/stocks/${symbol}`)
//   }

//   return (
//     <div style={{
//       display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
//       padding: "10px 24px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
//       boxShadow: "var(--shadow-sm)", position: "sticky", top: 0, zIndex: 40,
//     }}>

//       {/* ── TICKER STRIP ── */}
//       <div style={{ flex: 1, overflow: "hidden", maxWidth: 420 }}>
//         <div className="ticker-track" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
//           {ticker.map(item => (
//             <span key={`a-${item.sym}`} style={{ marginRight: 24, color: item.up ? "var(--up)" : "var(--down)" }}>
//               <span style={{ color: "var(--text-secondary)", marginRight: 4 }}>{item.sym}</span>
//               {item.val}
//             </span>
//           ))}
//           {ticker.map(item => (
//             <span key={`b-${item.sym}`} style={{ marginRight: 24, color: item.up ? "var(--up)" : "var(--down)" }}>
//               <span style={{ color: "var(--text-secondary)", marginRight: 4 }}>{item.sym}</span>
//               {item.val}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ── SEARCH ── */}
//       <div style={{ position: "relative", width: 280 }}>
//         <div style={{
//           display: "flex", alignItems: "center", gap: 8,
//           background: "var(--bg-base)",
//           border: `1.5px solid ${focused ? "var(--accent-teal)" : "var(--border)"}`,
//           borderRadius: 8, padding: "7px 12px", transition: "border-color 0.15s",
//         }}>
//           <Search size={14} color="var(--text-muted)" />
//           <input
//             type="text"
//             placeholder="Search stocks..."
//             value={query}
//             onChange={e => setQuery(e.target.value)}
//             onFocus={() => setFocused(true)}
//             onBlur={() => setTimeout(() => setFocused(false), 180)}
//             style={{
//               background: "transparent", border: "none", outline: "none",
//               fontSize: 13, color: "var(--text-primary)", width: "100%",
//             }}
//           />
//         </div>

//         {focused && results.length > 0 && (
//           <div style={{
//             position: "absolute", top: "calc(100% + 6px)", left: 0, width: "100%", zIndex: 99,
//             background: "var(--bg-elevated)", border: "1px solid var(--border)",
//             borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden",
//           }}>
//             {results.map((s, i) => (
//               <button
//                 key={s.symbol}
//                 onMouseDown={e => { e.preventDefault(); goToStock(s.symbol) }}
//                 style={{
//                   width: "100%", textAlign: "left", padding: "10px 14px",
//                   borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none",
//                   background: "transparent", border: "none", cursor: "pointer", transition: "background 0.1s",
//                 }}
//                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
//                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
//               >
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{s.symbol}</div>
//                 <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{s.companyName}</div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── RIGHT ACTIONS ── */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//         <ThemeToggle />

//         {/* Notification bell — now a real working component */}
//         <NotificationPanel />

//         {/* Account → /profile */}
//         <Link href="/profile" style={{ textDecoration: "none" }}>
//           <div style={{
//             display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
//             borderRadius: 8, border: "1.5px solid var(--border)",
//             background: "var(--bg-hover)", cursor: "pointer",
//           }}>
//             <div style={{
//               width: 26, height: 26, borderRadius: 6, background: "var(--accent-teal)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               <User size={14} color="#fff" />
//             </div>
//             <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Account</span>
//             <ChevronDown size={12} color="var(--text-muted)" />
//           </div>
//         </Link>
//       </div>
//     </div>
//   )
// }

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, User, ChevronDown, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationPanel from "@/components/NotificationPanel";

type Stock = { symbol: string; companyName: string; halalStatus?: string };
type TickerItem = { sym: string; val: string; up: boolean };

const FALLBACK_TICKER: TickerItem[] = [
  { sym: "NIFTY", val: "+1.24%", up: true },
  { sym: "SENSEX", val: "+0.87%", up: true },
  { sym: "RELIANCE", val: "+2841", up: true },
  { sym: "TCS", val: "-3412", up: false },
  { sym: "INFY", val: "+0.45%", up: true },
  { sym: "HDFC", val: "+1623", up: true },
  { sym: "ITC", val: "-410", up: false },
  { sym: "SBI", val: "+0.63%", up: true },
  { sym: "BAJFIN", val: "+6780", up: true },
  { sym: "WIPRO", val: "-521", up: false },
];

const HALAL_DOT: Record<string, string> = {
  Halal: "var(--up)",
  "Non-Halal": "var(--down)",
  "Review Needed": "var(--warn)",
};

// export default function DashboardNavbar() {

// lines added
interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  // lines added
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ticker, setTicker] = useState<TickerItem[]>(FALLBACK_TICKER);

  // ── Server-side search with 300ms debounce ─────────────────
  // Searches ALL ~500 screened stocks on the backend instead
  // of filtering a partial client-side list of 100.
  // The backend /stocks endpoint supports ?search= natively.
  const searchStocks = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/stocks", {
        params: {
          search: term.trim(),
          page: 1,
          pageSize: 10, // show up to 10 results instead of 6
        },
      });
      setResults(res.data?.stocks || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce — wait 300ms after user stops typing before fetching
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true); // show spinner immediately so UI feels responsive
    debounceRef.current = setTimeout(() => searchStocks(query), 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchStocks]);

  // ── Live ticker ────────────────────────────────────────────
  const fetchTicker = async () => {
    try {
      const res = await api.get("/stocks", {
        params: { page: 1, pageSize: 25 },
      });
      const live = (res.data?.stocks || [])
        .filter((s: any) => s.price != null && s.change != null)
        .slice(0, 10)
        .map((s: any) => ({
          sym: s.symbol,
          val: `${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%`,
          up: s.change >= 0,
        }));
      if (live.length > 0) setTicker(live);
    } catch {
      /* keep fallback */
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 60_000);
    return () => clearInterval(interval);
  }, []);

  // onMouseDown fires before onBlur — avoids blur-before-click race
  const goToStock = (symbol: string) => {
    setQuery("");
    setResults([]);
    setFocused(false);
    router.push(`/stocks/${symbol}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 24px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* ── TICKER STRIP ── */}
      <div style={{ flex: 1, overflow: "hidden", maxWidth: 420 }}>
        <div
          className="ticker-track"
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
          }}
        >
          {ticker.map((item) => (
            <span
              key={`a-${item.sym}`}
              style={{
                marginRight: 24,
                color: item.up ? "var(--up)" : "var(--down)",
              }}
            >
              <span style={{ color: "var(--text-secondary)", marginRight: 4 }}>
                {item.sym}
              </span>
              {item.val}
            </span>
          ))}
          {ticker.map((item) => (
            <span
              key={`b-${item.sym}`}
              style={{
                marginRight: 24,
                color: item.up ? "var(--up)" : "var(--down)",
              }}
            >
              <span style={{ color: "var(--text-secondary)", marginRight: 4 }}>
                {item.sym}
              </span>
              {item.val}
            </span>
          ))}
        </div>
      </div>
      {/* ── SEARCH ── */}
      <div style={{ position: "relative", width: 320 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg-base)",
            border: `1.5px solid ${focused ? "var(--accent-teal)" : "var(--border)"}`,
            borderRadius: 8,
            padding: "7px 12px",
            transition: "border-color 0.15s",
          }}
        >
          {/* Leading icon — spinner when loading, search icon otherwise */}
          {loading && query ? (
            <Loader2
              size={14}
              color="var(--accent-teal)"
              style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
            />
          ) : (
            <Search
              size={14}
              color="var(--text-muted)"
              style={{ flexShrink: 0 }}
            />
          )}

          <input
            type="text"
            placeholder="Search any stock..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "var(--text-primary)",
              width: "100%",
            }}
          />

          {/* Clear button */}
          {query && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                clearSearch();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 0,
                display: "flex",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {focused && query.trim() && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              width: "100%",
              zIndex: 99,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* Loading state */}
            {loading && (
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                <Loader2
                  size={13}
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                Searching all stocks...
              </div>
            )}

            {/* Results */}
            {!loading &&
              results.length > 0 &&
              results.map((s, i) => (
                <button
                  key={s.symbol}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goToStock(s.symbol);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    borderBottom:
                      i < results.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.1s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
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
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s.symbol}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--text-muted)",
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.companyName}
                    </div>
                  </div>
                  {/* Halal status dot */}
                  {s.halalStatus && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background:
                            HALAL_DOT[s.halalStatus] || "var(--text-muted)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.halalStatus}
                      </span>
                    </div>
                  )}
                </button>
              ))}

            {/* No results */}
            {!loading && results.length === 0 && (
              <div
                style={{
                  padding: "14px 16px",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                No stocks found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
      {/* ── RIGHT ACTIONS ── */}
      {/* // commeted line 596 and added lines 597--606 */}
      {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}> */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onMenuClick && (
          <button
            className="mobile-menu-button"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        <ThemeToggle />
        <NotificationPanel />

        <Link href="/profile" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1.5px solid var(--border)",
              background: "var(--bg-hover)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "var(--accent-teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Account
            </span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </div>
        </Link>
      </div>
    </div>
  );
}
