"use client"

import { TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} color="#fff" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Barlow', sans-serif" }}>
                TWIN<span style={{ color: "var(--accent-teal)" }}>TRADE</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 260, lineHeight: 1.65 }}>
              Ethical investing powered by AI and Shariah compliance. NSE & BSE screened.
            </p>
          </div>

          {/* Links */}
          {[
            { heading: "Platform", links: ["Dashboard", "Stocks", "Portfolio", "AI Advisor"] },
            { heading: "Company",  links: ["About", "Support", "Privacy", "Terms"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent-teal)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)" }}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>© {new Date().getFullYear()} TwinTrade. All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--up)", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>NSE / BSE Live</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
