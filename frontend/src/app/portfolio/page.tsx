//gpt 2.0
// src/app/portfolio/page.tsx
"use client";

import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoutes";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePortfolio } from "@/context/PortfolioContext";

const COLORS = [
  "#00c896",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p
        style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}
      >
        {payload[0].name}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--accent-teal)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {payload[0].value}%
      </p>
    </div>
  );
};

export default function PortfolioPage() {
  const { portfolio, loading } = usePortfolio();

  if (loading || !portfolio) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 16,
            }}
          >
            <div
              className="spin"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent-teal)",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Loading portfolio...
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const allocationData = portfolio.holdings.map((h) => ({
    name: h.symbol,
    value: h.currentValue || 0,
  }));

  const halalData = [
    { name: "Halal", value: 80 },
    { name: "Non-Halal", value: 10 },
    { name: "Review", value: 10 },
  ];
  const halalColors = ["var(--up)", "var(--down)", "var(--warn)"];

  const totalProfit = portfolio.totalProfit ?? 0;
  const totalReturnPercentage = portfolio.totalReturnPercentage ?? 0;
  const balance = portfolio.balance ?? 0;
  const investedAmount = portfolio.investedAmount ?? 0;
  const currentPortfolioValue = portfolio.currentPortfolioValue ?? 0;

  const isProfit = totalProfit >= 0;
  const isReturn = totalReturnPercentage >= 0;

  const stats = [
    {
      label: "Wallet Balance",
      value: `₹${balance.toLocaleString()}`,
      icon: Wallet,
      accent: "var(--accent-teal)",
    },
    {
      label: "Invested Amount",
      value: `₹${investedAmount.toLocaleString()}`,
      icon: PieChart,
      accent: "var(--indigo)",
    },
    {
      label: "Current Value",
      value: `₹${currentPortfolioValue.toLocaleString()}`,
      icon: TrendingUp,
      accent: "var(--warn)",
    },
    {
      label: "Total Profit",
      value: `₹${totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      accent: isProfit ? "var(--up)" : "var(--down)",
      valueColor: isProfit ? "var(--up)" : "var(--down)",
    },
  ];

  const cols = [
    "Symbol",
    "Qty",
    "Avg Price",
    "Current Price",
    "Current Value",
    "Return %",
    "P&L",
    "Allocation",
    "Actions",
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* HEADER */}
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.4px",
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Portfolio
            </h1>
            <p
              style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}
            >
              Track your holdings, investments, and profits.
            </p>
          </div>

          {/* STATS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "18px 20px",
                    boxShadow: "var(--shadow-sm)",
                    borderTop: `3px solid ${item.accent}`,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "var(--shadow-sm)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.label}
                    </p>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        background: `${item.accent}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.accent,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: (item as any).valueColor || "var(--text-primary)",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {item.value}
                  </p>
                  {item.label === "Total Profit" && (
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: isReturn ? "var(--up)" : "var(--down)",
                        marginTop: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      {isReturn ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {isReturn ? "+" : ""}
                      {totalReturnPercentage.toFixed(2)}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* CHARTS ROW */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* HALAL ALLOCATION */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 22px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ShieldCheck size={14} color="var(--up)" />
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Halal Allocation
                </h2>
              </div>
              <div style={{ padding: 8, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={halalData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {halalData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={["#16a34a", "#dc2626", "#d97706"][i]}
                          opacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(v) => (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          {v}
                        </span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PORTFOLIO ALLOCATION */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 22px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <PieChart size={14} color="var(--indigo)" />
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Portfolio Allocation
                </h2>
              </div>
              <div style={{ padding: 8, height: 300 }}>
                {allocationData.length === 0 ? (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      No holdings to display
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {allocationData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                            opacity={0.85}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(v) => (
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-secondary)",
                              fontWeight: 500,
                            }}
                          >
                            {v}
                          </span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* HOLDINGS TABLE */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--bg-base)",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Holdings
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  Live portfolio performance
                </p>
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

            {portfolio.holdings.length === 0 ? (
              <div style={{ padding: "60px 22px", textAlign: "center" }}>
                <PieChart
                  size={36}
                  color="var(--border)"
                  style={{ margin: "0 auto 14px" }}
                />
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  No holdings yet
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-faint)",
                    marginTop: 6,
                  }}
                >
                  Start trading to build your portfolio
                </p>
                <Link href="/stocks">
                  <button
                    className="btn-primary"
                    style={{ display: "inline-flex", marginTop: 16 }}
                  >
                    <TrendingUp size={14} /> Browse Stocks
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 900,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-base)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {cols.map((col) => (
                        <th
                          key={col}
                          style={{
                            textAlign: "left",
                            padding: "11px 18px",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((holding, i) => {
                      const ret = holding.returnPercentage || 0;
                      const pl = holding.profitLoss || 0;
                      return (
                        <tr
                          key={i}
                          style={{
                            borderBottom: "1px solid var(--border)",
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
                          {/* SYMBOL */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: "var(--text-primary)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {holding.symbol}
                            </span>
                          </td>

                          {/* QTY */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {holding.quantity}
                            </span>
                          </td>

                          {/* AVG PRICE */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              ₹{(holding.averagePrice ?? 0).toFixed(2)}
                            </span>
                          </td>

                          {/* CURRENT PRICE */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              ₹{(holding.currentPrice ?? 0).toFixed(2)}
                            </span>
                          </td>

                          {/* CURRENT VALUE */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--accent-teal)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              ₹{(holding.currentValue ?? 0).toLocaleString()}
                            </span>
                          </td>

                          {/* RETURN % */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: ret >= 0 ? "var(--up)" : "var(--down)",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {ret >= 0 ? (
                                <ArrowUpRight size={13} />
                              ) : (
                                <ArrowDownRight size={13} />
                              )}
                              {ret >= 0 ? "+" : ""}
                              {ret.toFixed(2)}%
                            </span>
                          </td>

                          {/* P&L */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: pl >= 0 ? "var(--up)" : "var(--down)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {pl >= 0 ? "+" : ""}₹{pl.toLocaleString()}
                            </span>
                          </td>

                          {/* ALLOCATION */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 52,
                                  height: 4,
                                  borderRadius: 2,
                                  background: "var(--bg-base)",
                                  overflow: "hidden",
                                  border: "1px solid var(--border)",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${holding.allocationPercentage ?? 0}%`,
                                    background: "var(--accent-teal)",
                                    borderRadius: 2,
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "var(--text-secondary)",
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                              >
                                {(holding.allocationPercentage ?? 0).toFixed(1)}
                                %
                              </span>
                            </div>
                          </td>

                          {/* ACTIONS */}
                          <td
                            style={{
                              padding: "13px 18px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div style={{ display: "flex", gap: 8 }}>
                              <Link href={`/stocks/${holding.symbol}`}>
                                <button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "6px 12px",
                                    borderRadius: 7,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    background: "var(--up-bg)",
                                    color: "var(--up)",
                                    border: "1px solid var(--up-border)",
                                    transition: "opacity 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.opacity = "0.75";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.opacity = "1";
                                  }}
                                >
                                  <ArrowUpRight size={12} /> Buy
                                </button>
                              </Link>
                              <Link href={`/stocks/${holding.symbol}`}>
                                <button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "6px 12px",
                                    borderRadius: 7,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    background: "var(--down-bg)",
                                    color: "var(--down)",
                                    border: "1px solid var(--down-border)",
                                    transition: "opacity 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.opacity = "0.75";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.opacity = "1";
                                  }}
                                >
                                  <ArrowDownRight size={12} /> Sell
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// // src/app/portfolio/page.tsx
// "use client"

// import Link from "next/link"
// import DashboardLayout from "@/layouts/DashboardLayout"
// import ProtectedRoute from "@/components/ProtectedRoutes"
// import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, ShieldCheck } from "lucide-react"
// import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
// import { usePortfolio } from "@/context/PortfolioContext"

// const COLORS = ["#00c896", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null
//   return (
//     <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-md)" }}>
//       <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{payload[0].name}</p>
//       <p style={{ fontSize: 12, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value}%</p>
//     </div>
//   )
// }

// export default function PortfolioPage() {
//   const { portfolio, loading } = usePortfolio()

//   if (loading || !portfolio) {
//     return (
//       <ProtectedRoute>
//         <DashboardLayout>
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
//             <div className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent-teal)" }} />
//             <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading portfolio...</p>
//           </div>
//         </DashboardLayout>
//       </ProtectedRoute>
//     )
//   }

//   const allocationData = portfolio.holdings.map(h => ({ name: h.symbol, value: h.currentValue || 0 }))

//   const halalData = [
//     { name: "Halal",     value: 80 },
//     { name: "Non-Halal", value: 10 },
//     { name: "Review",    value: 10 },
//   ]
//   const halalColors = ["var(--up)", "var(--down)", "var(--warn)"]

//   const isProfit = portfolio.totalProfit >= 0
//   const isReturn = portfolio.totalReturnPercentage >= 0

//   const stats = [
//     { label: "Wallet Balance",   value: `₹${portfolio.balance?.toLocaleString()}`,                     icon: Wallet,    accent: "var(--accent-teal)" },
//     { label: "Invested Amount",  value: `₹${portfolio.totalInvestedValue?.toLocaleString()}`,           icon: PieChart,  accent: "var(--indigo)" },
//     { label: "Current Value",    value: `₹${portfolio.currentPortfolioValue?.toLocaleString()}`,        icon: TrendingUp,accent: "var(--warn)" },
//     { label: "Total Profit",     value: `₹${portfolio.totalProfit?.toLocaleString()}`,                  icon: TrendingUp,accent: isProfit ? "var(--up)" : "var(--down)", valueColor: isProfit ? "var(--up)" : "var(--down)" },
//   ]

//   const cols = ["Symbol", "Qty", "Avg Price", "Current Price", "Current Value", "Return %", "P&L", "Allocation", "Actions"]

//   return (
//     <ProtectedRoute>
//       <DashboardLayout>
//         <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

//           {/* HEADER */}
//           <div>
//             <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>
//               Portfolio
//             </h1>
//             <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
//               Track your holdings, investments, and profits.
//             </p>
//           </div>

//           {/* STATS GRID */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
//             {stats.map(item => {
//               const Icon = item.icon
//               return (
//                 <div key={item.label} style={{
//                   background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
//                   padding: "18px 20px", boxShadow: "var(--shadow-sm)", borderTop: `3px solid ${item.accent}`,
//                   transition: "box-shadow 0.2s",
//                 }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)" }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)" }}
//                 >
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                     <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{item.label}</p>
//                     <div style={{ width: 30, height: 30, borderRadius: 7, background: `${item.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.accent }}>
//                       <Icon size={14} />
//                     </div>
//                   </div>
//                   <p style={{ fontSize: 22, fontWeight: 800, color: (item as any).valueColor || "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.3px" }}>
//                     {item.value}
//                   </p>
//                   {item.label === "Total Profit" && (
//                     <p style={{ fontSize: 12, fontWeight: 700, color: isReturn ? "var(--up)" : "var(--down)", marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>
//                       {isReturn ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
//                       {isReturn ? "+" : ""}{portfolio.totalReturnPercentage}%
//                     </p>
//                   )}
//                 </div>
//               )
//             })}
//           </div>

//           {/* CHARTS ROW */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

//             {/* HALAL ALLOCATION */}
//             <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//               <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
//                 <ShieldCheck size={14} color="var(--up)" />
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Halal Allocation</h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RechartsPieChart>
//                     <Pie data={halalData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0}>
//                       {halalData.map((_, i) => <Cell key={i} fill={["#16a34a", "#dc2626", "#d97706"][i]} opacity={0.85} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend formatter={v => <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>} />
//                   </RechartsPieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* PORTFOLIO ALLOCATION */}
//             <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//               <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
//                 <PieChart size={14} color="var(--indigo)" />
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Portfolio Allocation</h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 {allocationData.length === 0 ? (
//                   <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No holdings to display</p>
//                   </div>
//                 ) : (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RechartsPieChart>
//                       <Pie data={allocationData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0}>
//                         {allocationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
//                       </Pie>
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend formatter={v => <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>} />
//                     </RechartsPieChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* HOLDINGS TABLE */}
//           <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//             <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-base)" }}>
//               <div>
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Holdings</h2>
//                 <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Live portfolio performance</p>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--up)", display: "inline-block" }} />
//                 <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
//               </div>
//             </div>

//             {portfolio.holdings.length === 0 ? (
//               <div style={{ padding: "60px 22px", textAlign: "center" }}>
//                 <PieChart size={36} color="var(--border)" style={{ margin: "0 auto 14px" }} />
//                 <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>No holdings yet</p>
//                 <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>Start trading to build your portfolio</p>
//                 <Link href="/stocks">
//                   <button className="btn-primary" style={{ display: "inline-flex", marginTop: 16 }}>
//                     <TrendingUp size={14} /> Browse Stocks
//                   </button>
//                 </Link>
//               </div>
//             ) : (
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
//                   <thead>
//                     <tr style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
//                       {cols.map(col => (
//                         <th key={col} style={{ textAlign: "left", padding: "11px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {portfolio.holdings.map((holding, i) => {
//                       const ret = holding.returnPercentage || 0
//                       const pl = holding.profitLoss || 0
//                       return (
//                         <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.12s" }}
//                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
//                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
//                         >
//                           {/* SYMBOL */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{holding.symbol}</span>
//                           </td>

//                           {/* QTY */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{holding.quantity}</span>
//                           </td>

//                           {/* AVG PRICE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.averagePrice?.toFixed(2)}</span>
//                           </td>

//                           {/* CURRENT PRICE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.currentPrice?.toFixed(2)}</span>
//                           </td>

//                           {/* CURRENT VALUE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.currentValue?.toLocaleString()}</span>
//                           </td>

//                           {/* RETURN % */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 12, fontWeight: 700, color: ret >= 0 ? "var(--up)" : "var(--down)", display: "flex", alignItems: "center", gap: 3, fontFamily: "'JetBrains Mono', monospace" }}>
//                               {ret >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
//                               {ret >= 0 ? "+" : ""}{ret.toFixed(2)}%
//                             </span>
//                           </td>

//                           {/* P&L */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: pl >= 0 ? "var(--up)" : "var(--down)", fontFamily: "'JetBrains Mono', monospace" }}>
//                               {pl >= 0 ? "+" : ""}₹{pl.toLocaleString()}
//                             </span>
//                           </td>

//                           {/* ALLOCATION */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                               <div style={{ width: 52, height: 4, borderRadius: 2, background: "var(--bg-base)", overflow: "hidden", border: "1px solid var(--border)" }}>
//                                 <div style={{ height: "100%", width: `${holding.allocationPercentage ?? 0}%`, background: "var(--accent-teal)", borderRadius: 2 }} />
//                               </div>
//                               <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
//                                 {holding.allocationPercentage?.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>

//                           {/* ACTIONS */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--up-bg)", color: "var(--up)", border: "1px solid var(--up-border)", transition: "opacity 0.15s" }}
//                                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
//                                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}>
//                                   <ArrowUpRight size={12} /> Buy
//                                 </button>
//                               </Link>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--down-bg)", color: "var(--down)", border: "1px solid var(--down-border)", transition: "opacity 0.15s" }}
//                                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
//                                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}>
//                                   <ArrowDownRight size={12} /> Sell
//                                 </button>
//                               </Link>
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   )
// }

// gpt 1.0
// // src/app/portfolio/page.tsx
// "use client";

// import Link from "next/link";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoutes";
// import {
//   Wallet,
//   TrendingUp,
//   ArrowUpRight,
//   ArrowDownRight,
//   PieChart,
//   ShieldCheck,
// } from "lucide-react";
// import {
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { usePortfolio } from "@/context/PortfolioContext";

// const COLORS = [
//   "#00c896",
//   "#6366f1",
//   "#f59e0b",
//   "#ef4444",
//   "#8b5cf6",
//   "#06b6d4",
// ];

// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div
//       style={{
//         background: "var(--bg-elevated)",
//         border: "1px solid var(--border)",
//         borderRadius: 8,
//         padding: "8px 12px",
//         boxShadow: "var(--shadow-md)",
//       }}
//     >
//       <p
//         style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}
//       >
//         {payload[0].name}
//       </p>
//       <p
//         style={{
//           fontSize: 12,
//           color: "var(--accent-teal)",
//           fontFamily: "'JetBrains Mono', monospace",
//         }}
//       >
//         {payload[0].value}%
//       </p>
//     </div>
//   );
// };

// export default function PortfolioPage() {
//   const { portfolio, loading } = usePortfolio();

//   if (loading || !portfolio) {
//     return (
//       <ProtectedRoute>
//         <DashboardLayout>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "60vh",
//               gap: 16,
//             }}
//           >
//             <div
//               className="spin"
//               style={{
//                 width: 28,
//                 height: 28,
//                 borderRadius: "50%",
//                 border: "3px solid var(--border)",
//                 borderTopColor: "var(--accent-teal)",
//               }}
//             />
//             <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
//               Loading portfolio...
//             </p>
//           </div>
//         </DashboardLayout>
//       </ProtectedRoute>
//     );
//   }

//   const allocationData = portfolio.holdings.map((h) => ({
//     name: h.symbol,
//     value: h.currentValue || 0,
//   }));

//   const halalData = [
//     { name: "Halal", value: 80 },
//     { name: "Non-Halal", value: 10 },
//     { name: "Review", value: 10 },
//   ];
//   const halalColors = ["var(--up)", "var(--down)", "var(--warn)"];

//   const totalProfit = portfolio.totalProfit ?? 0;
//   const totalReturnPercentage = portfolio.totalReturnPercentage ?? 0;
//   const balance = portfolio.balance ?? 0;
//   const totalInvestedValue = portfolio.totalInvestedValue ?? 0;
//   const currentPortfolioValue = portfolio.currentPortfolioValue ?? 0;

//   const isProfit = totalProfit >= 0;
//   const isReturn = totalReturnPercentage >= 0;

//   const stats = [
//     {
//       label: "Wallet Balance",
//       value: `₹${balance.toLocaleString()}`,
//       icon: Wallet,
//       accent: "var(--accent-teal)",
//     },
//     {
//       label: "Invested Amount",
//       value: `₹${totalInvestedValue.toLocaleString()}`,
//       icon: PieChart,
//       accent: "var(--indigo)",
//     },
//     {
//       label: "Current Value",
//       value: `₹${currentPortfolioValue.toLocaleString()}`,
//       icon: TrendingUp,
//       accent: "var(--warn)",
//     },
//     {
//       label: "Total Profit",
//       value: `₹${totalProfit.toLocaleString()}`,
//       icon: TrendingUp,
//       accent: isProfit ? "var(--up)" : "var(--down)",
//       valueColor: isProfit ? "var(--up)" : "var(--down)",
//     },
//   ];

//   const cols = [
//     "Symbol",
//     "Qty",
//     "Avg Price",
//     "Current Price",
//     "Current Value",
//     "Return %",
//     "P&L",
//     "Allocation",
//     "Actions",
//   ];

//   return (
//     <ProtectedRoute>
//       <DashboardLayout>
//         <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
//           {/* HEADER */}
//           <div>
//             <h1
//               style={{
//                 fontSize: 28,
//                 fontWeight: 800,
//                 color: "var(--text-primary)",
//                 letterSpacing: "-0.4px",
//                 fontFamily: "'Barlow', sans-serif",
//               }}
//             >
//               Portfolio
//             </h1>
//             <p
//               style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}
//             >
//               Track your holdings, investments, and profits.
//             </p>
//           </div>

//           {/* STATS GRID */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//               gap: 14,
//             }}
//           >
//             {stats.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={item.label}
//                   style={{
//                     background: "var(--bg-surface)",
//                     border: "1px solid var(--border)",
//                     borderRadius: 12,
//                     padding: "18px 20px",
//                     boxShadow: "var(--shadow-sm)",
//                     borderTop: `3px solid ${item.accent}`,
//                     transition: "box-shadow 0.2s",
//                   }}
//                   onMouseEnter={(e) => {
//                     (e.currentTarget as HTMLElement).style.boxShadow =
//                       "var(--shadow-md)";
//                   }}
//                   onMouseLeave={(e) => {
//                     (e.currentTarget as HTMLElement).style.boxShadow =
//                       "var(--shadow-sm)";
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       marginBottom: 12,
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 700,
//                         letterSpacing: "0.06em",
//                         textTransform: "uppercase",
//                         color: "var(--text-muted)",
//                       }}
//                     >
//                       {item.label}
//                     </p>
//                     <div
//                       style={{
//                         width: 30,
//                         height: 30,
//                         borderRadius: 7,
//                         background: `${item.accent}18`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: item.accent,
//                       }}
//                     >
//                       <Icon size={14} />
//                     </div>
//                   </div>
//                   <p
//                     style={{
//                       fontSize: 22,
//                       fontWeight: 800,
//                       color: (item as any).valueColor || "var(--text-primary)",
//                       fontFamily: "'JetBrains Mono', monospace",
//                       letterSpacing: "-0.3px",
//                     }}
//                   >
//                     {item.value}
//                   </p>
//                   {item.label === "Total Profit" && (
//                     <p
//                       style={{
//                         fontSize: 12,
//                         fontWeight: 700,
//                         color: isReturn ? "var(--up)" : "var(--down)",
//                         marginTop: 6,
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 3,
//                       }}
//                     >
//                       {isReturn ? (
//                         <ArrowUpRight size={12} />
//                       ) : (
//                         <ArrowDownRight size={12} />
//                       )}
//                       {isReturn ? "+" : ""}
//                       {totalReturnPercentage.toFixed(2)}%
//                     </p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* CHARTS ROW */}
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
//           >
//             {/* HALAL ALLOCATION */}
//             <div
//               style={{
//                 background: "var(--bg-surface)",
//                 border: "1px solid var(--border)",
//                 borderRadius: 12,
//                 boxShadow: "var(--shadow-sm)",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "16px 22px",
//                   borderBottom: "1px solid var(--border)",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <ShieldCheck size={14} color="var(--up)" />
//                 <h2
//                   style={{
//                     fontSize: 15,
//                     fontWeight: 700,
//                     color: "var(--text-primary)",
//                   }}
//                 >
//                   Halal Allocation
//                 </h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RechartsPieChart>
//                     <Pie
//                       data={halalData}
//                       dataKey="value"
//                       nameKey="name"
//                       outerRadius={100}
//                       innerRadius={55}
//                       paddingAngle={3}
//                       strokeWidth={0}
//                     >
//                       {halalData.map((_, i) => (
//                         <Cell
//                           key={i}
//                           fill={["#16a34a", "#dc2626", "#d97706"][i]}
//                           opacity={0.85}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend
//                       formatter={(v) => (
//                         <span
//                           style={{
//                             fontSize: 11,
//                             color: "var(--text-secondary)",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {v}
//                         </span>
//                       )}
//                     />
//                   </RechartsPieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* PORTFOLIO ALLOCATION */}
//             <div
//               style={{
//                 background: "var(--bg-surface)",
//                 border: "1px solid var(--border)",
//                 borderRadius: 12,
//                 boxShadow: "var(--shadow-sm)",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "16px 22px",
//                   borderBottom: "1px solid var(--border)",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <PieChart size={14} color="var(--indigo)" />
//                 <h2
//                   style={{
//                     fontSize: 15,
//                     fontWeight: 700,
//                     color: "var(--text-primary)",
//                   }}
//                 >
//                   Portfolio Allocation
//                 </h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 {allocationData.length === 0 ? (
//                   <div
//                     style={{
//                       height: "100%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
//                       No holdings to display
//                     </p>
//                   </div>
//                 ) : (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RechartsPieChart>
//                       <Pie
//                         data={allocationData}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={100}
//                         innerRadius={55}
//                         paddingAngle={3}
//                         strokeWidth={0}
//                       >
//                         {allocationData.map((_, i) => (
//                           <Cell
//                             key={i}
//                             fill={COLORS[i % COLORS.length]}
//                             opacity={0.85}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend
//                         formatter={(v) => (
//                           <span
//                             style={{
//                               fontSize: 11,
//                               color: "var(--text-secondary)",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {v}
//                           </span>
//                         )}
//                       />
//                     </RechartsPieChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* HOLDINGS TABLE */}
//           <div
//             style={{
//               background: "var(--bg-surface)",
//               border: "1px solid var(--border)",
//               borderRadius: 12,
//               boxShadow: "var(--shadow-sm)",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "16px 22px",
//                 borderBottom: "1px solid var(--border)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 background: "var(--bg-base)",
//               }}
//             >
//               <div>
//                 <h2
//                   style={{
//                     fontSize: 15,
//                     fontWeight: 700,
//                     color: "var(--text-primary)",
//                   }}
//                 >
//                   Holdings
//                 </h2>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: "var(--text-muted)",
//                     marginTop: 2,
//                   }}
//                 >
//                   Live portfolio performance
//                 </p>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span
//                   className="live-dot"
//                   style={{
//                     width: 7,
//                     height: 7,
//                     borderRadius: "50%",
//                     background: "var(--up)",
//                     display: "inline-block",
//                   }}
//                 />
//                 <span
//                   style={{
//                     fontSize: 11,
//                     color: "var(--text-muted)",
//                     fontFamily: "'JetBrains Mono', monospace",
//                   }}
//                 >
//                   LIVE
//                 </span>
//               </div>
//             </div>

//             {portfolio.holdings.length === 0 ? (
//               <div style={{ padding: "60px 22px", textAlign: "center" }}>
//                 <PieChart
//                   size={36}
//                   color="var(--border)"
//                   style={{ margin: "0 auto 14px" }}
//                 />
//                 <p
//                   style={{
//                     fontSize: 14,
//                     color: "var(--text-muted)",
//                     fontWeight: 500,
//                   }}
//                 >
//                   No holdings yet
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: "var(--text-faint)",
//                     marginTop: 6,
//                   }}
//                 >
//                   Start trading to build your portfolio
//                 </p>
//                 <Link href="/stocks">
//                   <button
//                     className="btn-primary"
//                     style={{ display: "inline-flex", marginTop: 16 }}
//                   >
//                     <TrendingUp size={14} /> Browse Stocks
//                   </button>
//                 </Link>
//               </div>
//             ) : (
//               <div style={{ overflowX: "auto" }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     minWidth: 900,
//                   }}
//                 >
//                   <thead>
//                     <tr
//                       style={{
//                         background: "var(--bg-base)",
//                         borderBottom: "1px solid var(--border)",
//                       }}
//                     >
//                       {cols.map((col) => (
//                         <th
//                           key={col}
//                           style={{
//                             textAlign: "left",
//                             padding: "11px 18px",
//                             fontSize: 11,
//                             fontWeight: 700,
//                             letterSpacing: "0.06em",
//                             textTransform: "uppercase",
//                             color: "var(--text-muted)",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {portfolio.holdings.map((holding, i) => {
//                       const ret = holding.returnPercentage || 0;
//                       const pl = holding.profitLoss || 0;
//                       return (
//                         <tr
//                           key={i}
//                           style={{
//                             borderBottom: "1px solid var(--border)",
//                             transition: "background 0.12s",
//                           }}
//                           onMouseEnter={(e) => {
//                             (e.currentTarget as HTMLElement).style.background =
//                               "var(--bg-hover)";
//                           }}
//                           onMouseLeave={(e) => {
//                             (e.currentTarget as HTMLElement).style.background =
//                               "transparent";
//                           }}
//                         >
//                           {/* SYMBOL */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 fontWeight: 800,
//                                 color: "var(--text-primary)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               {holding.symbol}
//                             </span>
//                           </td>

//                           {/* QTY */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 color: "var(--text-secondary)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               {holding.quantity}
//                             </span>
//                           </td>

//                           {/* AVG PRICE */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 color: "var(--text-secondary)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               ₹{(holding.averagePrice ?? 0).toFixed(2)}
//                             </span>
//                           </td>

//                           {/* CURRENT PRICE */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: "var(--text-primary)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               ₹{(holding.currentPrice ?? 0).toFixed(2)}
//                             </span>
//                           </td>

//                           {/* CURRENT VALUE */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: "var(--accent-teal)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               ₹{(holding.currentValue ?? 0).toLocaleString()}
//                             </span>
//                           </td>

//                           {/* RETURN % */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 12,
//                                 fontWeight: 700,
//                                 color: ret >= 0 ? "var(--up)" : "var(--down)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 3,
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               {ret >= 0 ? (
//                                 <ArrowUpRight size={13} />
//                               ) : (
//                                 <ArrowDownRight size={13} />
//                               )}
//                               {ret >= 0 ? "+" : ""}
//                               {ret?.toFixed(2)}%
//                             </span>
//                           </td>

//                           {/* P&L */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: pl >= 0 ? "var(--up)" : "var(--down)",
//                                 fontFamily: "'JetBrains Mono', monospace",
//                               }}
//                             >
//                               {pl >= 0 ? "+" : ""}₹{pl?.toLocaleString()}
//                             </span>
//                           </td>

//                           {/* ALLOCATION */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 8,
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   width: 52,
//                                   height: 4,
//                                   borderRadius: 2,
//                                   background: "var(--bg-base)",
//                                   overflow: "hidden",
//                                   border: "1px solid var(--border)",
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     height: "100%",
//                                     width: `${holding.allocationPercentage || 0}%`,
//                                     background: "var(--accent-teal)",
//                                     borderRadius: 2,
//                                   }}
//                                 />
//                               </div>
//                               <span
//                                 style={{
//                                   fontSize: 12,
//                                   fontWeight: 700,
//                                   color: "var(--text-secondary)",
//                                   fontFamily: "'JetBrains Mono', monospace",
//                                 }}
//                               >
//                                 {(holding.allocationPercentage ?? 0).toFixed(1)}
//                                 %
//                               </span>
//                             </div>
//                           </td>

//                           {/* ACTIONS */}
//                           <td
//                             style={{
//                               padding: "13px 18px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button
//                                   style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: 5,
//                                     padding: "6px 12px",
//                                     borderRadius: 7,
//                                     fontSize: 12,
//                                     fontWeight: 700,
//                                     cursor: "pointer",
//                                     background: "var(--up-bg)",
//                                     color: "var(--up)",
//                                     border: "1px solid var(--up-border)",
//                                     transition: "opacity 0.15s",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     (
//                                       e.currentTarget as HTMLElement
//                                     ).style.opacity = "0.75";
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     (
//                                       e.currentTarget as HTMLElement
//                                     ).style.opacity = "1";
//                                   }}
//                                 >
//                                   <ArrowUpRight size={12} /> Buy
//                                 </button>
//                               </Link>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button
//                                   style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: 5,
//                                     padding: "6px 12px",
//                                     borderRadius: 7,
//                                     fontSize: 12,
//                                     fontWeight: 700,
//                                     cursor: "pointer",
//                                     background: "var(--down-bg)",
//                                     color: "var(--down)",
//                                     border: "1px solid var(--down-border)",
//                                     transition: "opacity 0.15s",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     (
//                                       e.currentTarget as HTMLElement
//                                     ).style.opacity = "0.75";
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     (
//                                       e.currentTarget as HTMLElement
//                                     ).style.opacity = "1";
//                                   }}
//                                 >
//                                   <ArrowDownRight size={12} /> Sell
//                                 </button>
//                               </Link>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }

// dawar
// // src/app/portfolio/page.tsx
// "use client"

// import Link from "next/link"
// import DashboardLayout from "@/layouts/DashboardLayout"
// import ProtectedRoute from "@/components/ProtectedRoutes"
// import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, ShieldCheck } from "lucide-react"
// import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
// import { usePortfolio } from "@/context/PortfolioContext"

// const COLORS = ["#00c896", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null
//   return (
//     <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", boxShadow: "var(--shadow-md)" }}>
//       <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{payload[0].name}</p>
//       <p style={{ fontSize: 12, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value}%</p>
//     </div>
//   )
// }

// export default function PortfolioPage() {
//   const { portfolio, loading } = usePortfolio()

//   if (loading || !portfolio) {
//     return (
//       <ProtectedRoute>
//         <DashboardLayout>
//           <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
//             <div className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent-teal)" }} />
//             <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading portfolio...</p>
//           </div>
//         </DashboardLayout>
//       </ProtectedRoute>
//     )
//   }

//   const allocationData = portfolio.holdings.map(h => ({ name: h.symbol, value: h.currentValue || 0 }))

//   const halalData = [
//     { name: "Halal",     value: 80 },
//     { name: "Non-Halal", value: 10 },
//     { name: "Review",    value: 10 },
//   ]
//   const halalColors = ["var(--up)", "var(--down)", "var(--warn)"]

//   const isProfit = portfolio.totalProfit >= 0
//   const isReturn = portfolio.totalReturnPercentage >= 0

//   const stats = [
//     { label: "Wallet Balance",   value: `₹${portfolio.balance?.toLocaleString()}`,                     icon: Wallet,    accent: "var(--accent-teal)" },
//     { label: "Invested Amount",  value: `₹${portfolio.totalInvestedValue?.toLocaleString()}`,           icon: PieChart,  accent: "var(--indigo)" },
//     { label: "Current Value",    value: `₹${portfolio.currentPortfolioValue?.toLocaleString()}`,        icon: TrendingUp,accent: "var(--warn)" },
//     { label: "Total Profit",     value: `₹${portfolio.totalProfit?.toLocaleString()}`,                  icon: TrendingUp,accent: isProfit ? "var(--up)" : "var(--down)", valueColor: isProfit ? "var(--up)" : "var(--down)" },
//   ]

//   const cols = ["Symbol", "Qty", "Avg Price", "Current Price", "Current Value", "Return %", "P&L", "Allocation", "Actions"]

//   return (
//     <ProtectedRoute>
//       <DashboardLayout>
//         <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

//           {/* HEADER */}
//           <div>
//             <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.4px", fontFamily: "'Barlow', sans-serif" }}>
//               Portfolio
//             </h1>
//             <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
//               Track your holdings, investments, and profits.
//             </p>
//           </div>

//           {/* STATS GRID */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
//             {stats.map(item => {
//               const Icon = item.icon
//               return (
//                 <div key={item.label} style={{
//                   background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
//                   padding: "18px 20px", boxShadow: "var(--shadow-sm)", borderTop: `3px solid ${item.accent}`,
//                   transition: "box-shadow 0.2s",
//                 }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)" }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)" }}
//                 >
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                     <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{item.label}</p>
//                     <div style={{ width: 30, height: 30, borderRadius: 7, background: `${item.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.accent }}>
//                       <Icon size={14} />
//                     </div>
//                   </div>
//                   <p style={{ fontSize: 22, fontWeight: 800, color: (item as any).valueColor || "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.3px" }}>
//                     {item.value}
//                   </p>
//                   {item.label === "Total Profit" && (
//                     <p style={{ fontSize: 12, fontWeight: 700, color: isReturn ? "var(--up)" : "var(--down)", marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>
//                       {isReturn ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
//                       {isReturn ? "+" : ""}{portfolio.totalReturnPercentage}%
//                     </p>
//                   )}
//                 </div>
//               )
//             })}
//           </div>

//           {/* CHARTS ROW */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

//             {/* HALAL ALLOCATION */}
//             <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//               <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
//                 <ShieldCheck size={14} color="var(--up)" />
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Halal Allocation</h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RechartsPieChart>
//                     <Pie data={halalData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0}>
//                       {halalData.map((_, i) => <Cell key={i} fill={["#16a34a", "#dc2626", "#d97706"][i]} opacity={0.85} />)}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend formatter={v => <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>} />
//                   </RechartsPieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* PORTFOLIO ALLOCATION */}
//             <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//               <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
//                 <PieChart size={14} color="var(--indigo)" />
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Portfolio Allocation</h2>
//               </div>
//               <div style={{ padding: 8, height: 300 }}>
//                 {allocationData.length === 0 ? (
//                   <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No holdings to display</p>
//                   </div>
//                 ) : (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RechartsPieChart>
//                       <Pie data={allocationData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0}>
//                         {allocationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
//                       </Pie>
//                       <Tooltip content={<CustomTooltip />} />
//                       <Legend formatter={v => <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>} />
//                     </RechartsPieChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* HOLDINGS TABLE */}
//           <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
//             <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-base)" }}>
//               <div>
//                 <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Holdings</h2>
//                 <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Live portfolio performance</p>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--up)", display: "inline-block" }} />
//                 <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
//               </div>
//             </div>

//             {portfolio.holdings.length === 0 ? (
//               <div style={{ padding: "60px 22px", textAlign: "center" }}>
//                 <PieChart size={36} color="var(--border)" style={{ margin: "0 auto 14px" }} />
//                 <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>No holdings yet</p>
//                 <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>Start trading to build your portfolio</p>
//                 <Link href="/stocks">
//                   <button className="btn-primary" style={{ display: "inline-flex", marginTop: 16 }}>
//                     <TrendingUp size={14} /> Browse Stocks
//                   </button>
//                 </Link>
//               </div>
//             ) : (
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
//                   <thead>
//                     <tr style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
//                       {cols.map(col => (
//                         <th key={col} style={{ textAlign: "left", padding: "11px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {portfolio.holdings.map((holding, i) => {
//                       const ret = holding.returnPercentage || 0
//                       const pl = holding.profitLoss || 0
//                       return (
//                         <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.12s" }}
//                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
//                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
//                         >
//                           {/* SYMBOL */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>{holding.symbol}</span>
//                           </td>

//                           {/* QTY */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{holding.quantity}</span>
//                           </td>

//                           {/* AVG PRICE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.averagePrice?.toFixed(2)}</span>
//                           </td>

//                           {/* CURRENT PRICE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.currentPrice?.toFixed(2)}</span>
//                           </td>

//                           {/* CURRENT VALUE */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-teal)", fontFamily: "'JetBrains Mono', monospace" }}>₹{holding.currentValue?.toLocaleString()}</span>
//                           </td>

//                           {/* RETURN % */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 12, fontWeight: 700, color: ret >= 0 ? "var(--up)" : "var(--down)", display: "flex", alignItems: "center", gap: 3, fontFamily: "'JetBrains Mono', monospace" }}>
//                               {ret >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
//                               {ret >= 0 ? "+" : ""}{ret?.toFixed(2)}%
//                             </span>
//                           </td>

//                           {/* P&L */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: pl >= 0 ? "var(--up)" : "var(--down)", fontFamily: "'JetBrains Mono', monospace" }}>
//                               {pl >= 0 ? "+" : ""}₹{pl?.toLocaleString()}
//                             </span>
//                           </td>

//                           {/* ALLOCATION */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                               <div style={{ width: 52, height: 4, borderRadius: 2, background: "var(--bg-base)", overflow: "hidden", border: "1px solid var(--border)" }}>
//                                 <div style={{ height: "100%", width: `${holding.allocationPercentage || 0}%`, background: "var(--accent-teal)", borderRadius: 2 }} />
//                               </div>
//                               <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
//                                 {holding.allocationPercentage?.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>

//                           {/* ACTIONS */}
//                           <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--up-bg)", color: "var(--up)", border: "1px solid var(--up-border)", transition: "opacity 0.15s" }}
//                                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
//                                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}>
//                                   <ArrowUpRight size={12} /> Buy
//                                 </button>
//                               </Link>
//                               <Link href={`/stocks/${holding.symbol}`}>
//                                 <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--down-bg)", color: "var(--down)", border: "1px solid var(--down-border)", transition: "opacity 0.15s" }}
//                                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
//                                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}>
//                                   <ArrowDownRight size={12} /> Sell
//                                 </button>
//                               </Link>
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   )
// }
