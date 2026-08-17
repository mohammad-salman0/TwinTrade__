// src/app/support/ticket/page.tsx
"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateTicket() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle = {
    width: "100%", background: "var(--bg-base)", border: "1.5px solid var(--border)",
    color: "var(--text-primary)", borderRadius: 8, padding: "11px 14px",
    fontSize: 14, outline: "none", transition: "border-color 0.15s",
    fontFamily: "inherit", boxSizing: "border-box" as const,
  }

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "var(--text-muted)" }}>
          <Link href="/support" style={{ color: "var(--accent-teal)", textDecoration: "none", fontWeight: 600 }}>Support</Link>
          <span>/</span>
          <span>Create Ticket</span>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent-teal), var(--indigo))" }} />

          <div style={{ padding: "32px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--accent-teal-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={16} color="var(--accent-teal)" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                Create Support Ticket
              </h1>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 28, marginLeft: 44 }}>
              Describe your issue and our support team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--up-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Send size={22} color="var(--up)" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Ticket Submitted!</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>We'll get back to you within 24 hours.</p>
                <Link href="/support">
                  <button className="btn-ghost" style={{ padding: "10px 20px" }}>← Back to Support</button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                    Subject
                  </label>
                  <input
                    type="text" value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="Enter issue subject" required
                    style={inputStyle}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                    Message
                  </label>
                  <textarea
                    rows={7} value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    required
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <Link href="/support">
                    <button type="button" className="btn-ghost" style={{ padding: "11px 20px" }}>Cancel</button>
                  </Link>
                  <button type="submit" className="btn-primary" style={{ padding: "11px 24px", flex: 1, justifyContent: "center" }}>
                    <Send size={14} /> Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
