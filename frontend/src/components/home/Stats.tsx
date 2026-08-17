// src/components/home/Stats.tsx
"use client"

import { ShieldCheck, Eye, Brain, Users } from "lucide-react"

const features = [
  { icon: ShieldCheck, title: "Faith-Driven Finance",    desc: "Invest confidently with stocks screened for Shariah compliance using AAOIFI standards.",     accent: "var(--up)" },
  { icon: Eye,         title: "Transparency Always",      desc: "No hidden charges — just clear halal insights and full visibility into every decision.",       accent: "var(--accent-teal)" },
  { icon: Brain,       title: "Smarter Halal Investing",  desc: "Our AI keeps every investment aligned with your faith, continuously refining recommendations.", accent: "var(--indigo)" },
  { icon: Users,       title: "Empowering Investors",     desc: "We help investors grow with knowledge, integrity, and tools built for modern ethical finance.",  accent: "var(--warn)" },
]

const stats = [
  { value: "500+",   label: "Halal Stocks",      accent: "var(--accent-teal)" },
  { value: "AAOIFI", label: "Certified",          accent: "var(--up)" },
  { value: "AI",     label: "Powered Analysis",   accent: "var(--indigo)" },
  { value: "100%",   label: "Halal Focused",      accent: "var(--warn)" },
]

export default function Stats() {
  return (
    <section style={{ background: "var(--bg-base)", width: "100%" }}>

      {/* Stats bar */}
      <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: "24px 0", textAlign: "center",
              borderRight: i < 3 ? "1px solid var(--border)" : "none",
            }}>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-teal)", marginBottom: 14 }}>Why TwinTrade</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", fontFamily: "'Barlow', sans-serif" }}>
            Trust with Confidence
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.title} style={{
                background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
                padding: "28px 24px", borderTop: `3px solid ${f.accent}`,
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "var(--shadow-md)"; el.style.transform = "translateY(-2px)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)" }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 9, background: `${f.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: f.accent }}>
                  <Icon size={18} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Image section */}
        <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-teal)", marginBottom: 16 }}>Our Approach</p>
            <h3 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 16, fontFamily: "'Barlow', sans-serif", lineHeight: 1.15 }}>
              Combining ethics with modern intelligence
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 20 }}>
              Every feature of TwinTrade is built around one core principle: helping Muslim investors grow their wealth without compromising their values. Our AI screening, real-time alerts, and transparent reporting make it effortless.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Real-time halal status updates", "AAOIFI-certified compliance methodology", "AI-driven portfolio rebalancing"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-teal)", display: "inline-block", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <img src="/media/shakinghands.jpg" alt="TwinTrade Ecosystem"
              style={{ width: "100%", maxHeight: 380, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
