// src/app/stocks/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoutes"
import StockTable from "@/components/StockTable"
import api from "@/services/api"
import socket from "@/services/socket"
import { Search, ShieldCheck, ShieldOff, BarChart2, Filter, ChevronLeft, ChevronRight } from "lucide-react"

type Stock = {
  symbol: string
  companyName: string
  price: number | null
  halalStatus: string
  change: number
  industry: string
  complianceScore: number
}

type Pagination = {
  page: number
  pageSize: number
  totalStocks: number
  totalPages: number
}

const PAGE_SIZE = 25

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [halalOnly, setHalalOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [focused, setFocused] = useState(false)

  // ── debounce search so we don't hit the API on every keystroke ──
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // reset to page 1 whenever the search changes
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // ── reset to page 1 when halal filter changes ──
  useEffect(() => { setPage(1) }, [halalOnly])

  // ── fetch current page from backend ──
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, any> = { page, pageSize: PAGE_SIZE }
      if (debouncedSearch) params.search = debouncedSearch
      if (halalOnly) params.halal = "Halal"

      const r = await api.get("/stocks", { params })
      setStocks(r.data.stocks || [])
      setPagination(r.data.pagination || null)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, halalOnly])

  useEffect(() => { fetchStocks() }, [fetchStocks])

  // ── live socket price updates, patched into whichever page is showing ──
  useEffect(() => {
    socket.on("stockUpdates", (liveUpdates) => {
      setStocks(prev => prev.map(s => {
        const u = liveUpdates.find((l: any) => l.symbol === s.symbol)
        return u ? { ...s, price: u.price, change: u.change } : s
      }))
    })
    return () => { socket.off("stockUpdates") }
  }, [])

  const goToPage = (p: number) => {
    if (!pagination) return
    if (p < 1 || p > pagination.totalPages) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── stats now reflect the current page + overall totals from backend ──
  const halalOnPage = stocks.filter(s => s.halalStatus === "Halal").length
  const nonHalalOnPage = stocks.filter(s => s.halalStatus === "Non-Halal").length

  const summaryStats = [
    { label: "Total Stocks",  value: pagination?.totalStocks ?? "—", accent: "var(--accent-teal)", icon: BarChart2 },
    { label: "Halal (page)",  value: halalOnPage,                     accent: "var(--up)",          icon: ShieldCheck },
    { label: "Non-Halal (page)", value: nonHalalOnPage,               accent: "var(--down)",        icon: ShieldOff },
    { label: "Showing",       value: stocks.length,                   accent: "var(--indigo)",      icon: Filter },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--up)", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Live Market Feed</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>Market Stocks</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>Explore NIFTY 500 stocks with halal screening and live market updates.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {summaryStats.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${s.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{s.label}</p>
                    <Icon size={13} color={s.accent} />
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.accent, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
                </div>
              )
            })}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 9, background: "var(--bg-surface)", border: `1.5px solid ${focused ? "var(--accent-teal)" : "var(--border)"}`, borderRadius: 9, padding: "10px 14px", transition: "border-color 0.15s" }}>
              <Search size={14} color="var(--text-muted)" />
              <input type="text" placeholder="Search symbol or company..." value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: "var(--text-primary)", width: "100%" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16 }}>×</button>}
            </div>
            <button onClick={() => setHalalOnly(!halalOnly)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", background: halalOnly ? "var(--up-bg)" : "var(--bg-surface)", color: halalOnly ? "var(--up)" : "var(--text-secondary)", border: `1.5px solid ${halalOnly ? "var(--up-border)" : "var(--border)"}` }}>
              <ShieldCheck size={14} />{halalOnly ? "Halal Only ✓" : "All Stocks"}
            </button>
          </div>

          {loading ? (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "60px 22px", textAlign: "center" }}>
              <div className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent-teal)", margin: "0 auto 14px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading stocks...</p>
            </div>
          ) : stocks.length === 0 ? (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "60px 22px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No stocks match your search</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Showing <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{stocks.length}</span>
                  {pagination && <> of {pagination.totalStocks} stocks · page {pagination.page} of {pagination.totalPages}</>}
                </p>
                {halalOnly && <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 5, background: "var(--up-bg)", color: "var(--up)", fontWeight: 600 }}>Halal filter active</span>}
              </div>
              <StockTable stocks={stocks} />
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: page <= 1 ? "not-allowed" : "pointer",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  color: page <= 1 ? "var(--text-faint)" : "var(--text-secondary)",
                }}
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc: (number | "...")[], p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} style={{ padding: "8px 6px", fontSize: 13, color: "var(--text-muted)" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p as number)}
                        style={{
                          minWidth: 36, padding: "8px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                          cursor: "pointer", border: "1px solid",
                          borderColor: p === page ? "var(--accent-teal)" : "var(--border)",
                          background: p === page ? "var(--accent-teal)" : "var(--bg-surface)",
                          color: p === page ? "#fff" : "var(--text-secondary)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.totalPages}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: page >= pagination.totalPages ? "not-allowed" : "pointer",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  color: page >= pagination.totalPages ? "var(--text-faint)" : "var(--text-secondary)",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}