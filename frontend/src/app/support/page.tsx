// src/app/support/page.tsx
"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Search, ExternalLink, BookOpen, Shield, TrendingUp, HelpCircle } from "lucide-react"
import Link from "next/link"

const resources = [
  { title: "Halal Investing Guides",       href: "https://www.islamicfinanceguru.com/investing", icon: Shield },
  { title: "SEBI Investor Awareness Portal", href: "https://investor.sebi.gov.in/",             icon: TrendingUp },
  { title: "AAOIFI Shariah Standards",     href: "https://aaoifi.com/shariyah-standards/?lang=en", icon: BookOpen },
]

const articles = [
  { title: "Stock Market for Beginners",   href: "https://appreciatewealth.com/blog/the-stock-market-for-beginners" },
  { title: "What is Delivery Trading",     href: "https://www.bajajfinserv.in/delivery-trading" },
]

const faqs = [
  { q: "How is halal compliance determined?", a: "We use AAOIFI standards to screen each stock based on business activity, debt ratios, and revenue sources." },
  { q: "Is my investment data secure?",        a: "Yes. All data is encrypted in transit and at rest. We follow industry-standard security practices." },
  { q: "What is the AI Advisor?",              a: "Our AI Advisor generates personalized halal portfolios based on your risk profile, investment amount, and sector preference." },
]

export default function Support() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--indigo-bg)", color: "var(--indigo)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 999, marginBottom: 20 }}>
            <HelpCircle size={12} /> Support Portal
          </div>
          <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, fontFamily: "'Barlow', sans-serif" }}>
            How can we help?
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.7 }}>
            Search for answers or explore our guides to learn more about halal investing.
          </p>
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="e.g. Why is my order getting rejected?"
              style={{
                width: "100%", background: "var(--bg-base)", border: "1.5px solid var(--border)",
                color: "var(--text-primary)", borderRadius: 10, padding: "13px 14px 13px 40px",
                fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
              }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}
            />
          </div>
        </div>
      </section>

      {/* RESOURCES + ARTICLES */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* RESOURCES */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-base)" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Helpful Resources</h2>
            </div>
            <div style={{ padding: "8px 0" }}>
              {resources.map(r => {
                const Icon = r.icon
                return (
                  <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", transition: "background 0.12s", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-teal-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={14} color="var(--accent-teal)" />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{r.title}</span>
                      </div>
                      <ExternalLink size={13} color="var(--text-muted)" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* ARTICLES */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-base)" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Featured Articles</h2>
            </div>
            <div style={{ padding: "8px 0" }}>
              {articles.map(a => (
                <a key={a.title} href={a.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", transition: "background 0.12s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--indigo-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BookOpen size={14} color="var(--indigo)" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{a.title}</span>
                    </div>
                    <ExternalLink size={13} color="var(--text-muted)" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 24, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-base)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: "20px 22px", borderBottom: i < faqs.length - 1 ? "1px solid var(--border)" : "none" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{faq.q}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.3px" }}>Still need help?</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Create a support ticket and our team will assist you.</p>
        <Link href="/support/ticket">
          <button className="btn-primary" style={{ padding: "12px 24px", fontSize: 14 }}>
            Create Support Ticket
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  )
}
