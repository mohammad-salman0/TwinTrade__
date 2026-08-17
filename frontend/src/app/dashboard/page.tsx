// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoutes";
import DashboardChart from "@/components/DashboardChart";
import TopMovers from "@/components/TopMovers";
import AddMoneyModal from "@/components/AddMoneyModal";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Brain,
  Star,
  ShieldCheck,
  Activity,
  Plus,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import api from "@/services/api";

export default function DashboardPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const { portfolio, orders, loading } = usePortfolio();
  const [aiInsights, setAiInsights] = useState({
    sentiment: "Neutral",
    confidence: 50,
    health: "Moderate",
    recommendation: "Loading AI insights...",
  });

  useEffect(() => {
    api
      .get("/ai/insights")
      .then((r) => setAiInsights(r.data))
      .catch(console.log);
  }, []);

  const stats = [
    {
      title: "Total Profit",
      value: `₹${(portfolio?.totalProfit ?? 0).toLocaleString()}`,
      change: (portfolio?.totalProfit ?? 0) >= 0 ? "Profitable" : "Loss",
      positive: (portfolio?.totalProfit ?? 0) >= 0,
      icon: TrendingUp,
      accent: "var(--up)",
    },
  ];

  if (loading)
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
              Loading dashboard...
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  className="live-dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--up)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  Markets Open
                </span>
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.4px",
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                Welcome Back 👋
              </h1>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: 6,
                  fontSize: 14,
                }}
              >
                AI-powered halal investing intelligence dashboard.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowAddMoney(true)}
                className="btn-primary"
              >
                <Plus size={14} /> Add Funds
              </button>
              <Link href="/ai-advisor">
                <button
                  className="btn-ghost"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Brain size={14} /> AI Advisor
                </button>
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
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
                      marginBottom: 14,
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
                      {item.title}
                    </p>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${item.accent}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.accent,
                      }}
                    >
                      <Icon size={15} />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.4px",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: 8,
                    }}
                  >
                    {item.value}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      color: item.positive ? "var(--up)" : "var(--down)",
                    }}
                  >
                    {item.positive ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {item.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHART + AI */}
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}
          >
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
                  padding: "18px 22px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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
                    Market Overview
                  </h2>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 3,
                    }}
                  >
                    Live portfolio analytics and performance tracking
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
              <div style={{ padding: "16px 12px" }}>
                <DashboardChart />
              </div>
            </div>

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
                  padding: "18px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  AI Insights
                </h2>
                <Brain size={15} color="var(--indigo)" />
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  {
                    icon: Activity,
                    color: "var(--indigo)",
                    bg: "var(--indigo-bg)",
                    label: "Market Sentiment",
                    sub: "Current signal",
                    val: aiInsights.sentiment,
                  },
                  {
                    icon: ShieldCheck,
                    color: "var(--up)",
                    bg: "var(--up-bg)",
                    label: "Portfolio Health",
                    sub: "Diversification",
                    val: aiInsights.health,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 9,
                        background: item.bg,
                        borderLeft: `3px solid ${item.color}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 6,
                        }}
                      >
                        <Icon size={13} color={item.color} />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: item.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          {item.sub}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {item.val}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 9,
                    background: "var(--warn-bg)",
                    borderLeft: "3px solid var(--warn)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 6,
                    }}
                  >
                    <Brain size={13} color="var(--warn)" />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--warn)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      AI Recommendation
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {aiInsights.recommendation}
                  </p>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 9,
                    background: "var(--bg-base)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      AI Confidence
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "var(--indigo)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {aiInsights.confidence}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "var(--border)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${aiInsights.confidence}%`,
                        background: "var(--indigo)",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TopMovers />

          {/* RECENT ORDERS */}
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
                padding: "18px 22px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                  Recent Orders
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 3,
                  }}
                >
                  Last {Math.min(orders.length, 5)} executed transactions
                </p>
              </div>
              <Link href="/orders">
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--accent-teal)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View all →
                </span>
              </Link>
            </div>
            <div>
              {orders.length === 0 ? (
                <div style={{ padding: "40px 22px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    No orders yet.
                  </p>
                </div>
              ) : (
                orders.slice(0, 5).map((order, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 22px",
                      borderBottom:
                        i < Math.min(orders.length, 5) - 1
                          ? "1px solid var(--border)"
                          : "none",
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "3px 9px",
                          borderRadius: 5,
                          background:
                            order.orderType === "BUY"
                              ? "var(--up-bg)"
                              : "var(--down-bg)",
                          color:
                            order.orderType === "BUY"
                              ? "var(--up)"
                              : "var(--down)",
                          border: `1px solid ${order.orderType === "BUY" ? "var(--up-border)" : "var(--down-border)"}`,
                        }}
                      >
                        {order.orderType}
                      </span>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {order.symbol}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          Qty: {order.quantity}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ₹{order.price?.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {showAddMoney && (
          <AddMoneyModal onClose={() => setShowAddMoney(false)} />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
