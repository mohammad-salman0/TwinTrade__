// src/app/orders/page.tsx
"use client"

import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoutes"
import { usePortfolio } from "@/context/PortfolioContext"
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react"

export default function OrdersPage() {
  const { orders, loading } = usePortfolio()

  if (loading) return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
          <div className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent-teal)" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading orders...</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )

  const buyCount = orders.filter(o => o.orderType === "BUY").length
  const sellCount = orders.filter(o => o.orderType === "SELL").length
  const cols = ["Type", "Symbol", "Quantity", "Price", "Total Value", "Date & Time"]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>Orders</h1>
              <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>Complete trading history and executed orders.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "var(--up-bg)", border: "1px solid var(--up-border)", display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowUpRight size={13} color="var(--up)" /><span style={{ fontSize: 12, fontWeight: 700, color: "var(--up)" }}>BUY</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{buyCount}</span>
              </div>
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "var(--down-bg)", border: "1px solid var(--down-border)", display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowDownRight size={13} color="var(--down)" /><span style={{ fontSize: 12, fontWeight: 700, color: "var(--down)" }}>SELL</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{sellCount}</span>
              </div>
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "var(--bg-hover)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={13} color="var(--text-muted)" /><span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>TOTAL</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{orders.length}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Order History</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{orders.length} records</span>
            </div>
            {orders.length === 0 ? (
              <div style={{ padding: "60px 22px", textAlign: "center" }}>
                <FileText size={36} color="var(--border)" style={{ margin: "0 auto 14px" }} />
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>No orders found</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
                      {cols.map(col => <th key={col} style={{ textAlign: "left", padding: "11px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.12s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                        <td style={{ padding: "13px 20px" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 5, background: order.orderType === "BUY" ? "var(--up-bg)" : "var(--down-bg)", color: order.orderType === "BUY" ? "var(--up)" : "var(--down)", border: `1px solid ${order.orderType === "BUY" ? "var(--up-border)" : "var(--down-border)"}`, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {order.orderType === "BUY" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{order.orderType}
                          </span>
                        </td>
                        <td style={{ padding: "13px 20px" }}><span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{order.symbol}</span></td>
                        <td style={{ padding: "13px 20px" }}><span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{order.quantity}</span></td>
                        <td style={{ padding: "13px 20px" }}><span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>₹{order.price?.toLocaleString()}</span></td>
                        <td style={{ padding: "13px 20px" }}><span style={{ fontSize: 13, fontWeight: 800, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>₹{(order.price * order.quantity).toLocaleString()}</span></td>
                        <td style={{ padding: "13px 20px" }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleString()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
