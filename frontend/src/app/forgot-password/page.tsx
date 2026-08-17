// src/app/forgot-password/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/services/api"
import ThemeToggle from "@/components/ThemeToggle"
import { TrendingUp, Mail, KeyRound, CheckCircle, ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react"
import Link from "next/link"

type Step = "email" | "otp" | "reset" | "done"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep]         = useState<Step>("email")
  const [email, setEmail]       = useState("")
  const [otp, setOtp]           = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [resending, setResending] = useState(false)

  const inp = {
    width:"100%", background:"var(--bg-base)", border:"1.5px solid var(--border)",
    color:"var(--text-primary)", borderRadius:8, padding:"11px 14px",
    fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" as const,
    transition:"border-color 0.15s",
  }
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--accent-teal)")
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--border)")
  const labelStyle = {
    display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.06em",
    textTransform:"uppercase" as const, color:"var(--text-muted)", marginBottom:8,
  }

  // ── STEP 1: send OTP ──────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email.trim()) return setError("Enter your email address")
    try {
      setLoading(true); setError("")
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() })
      setStep("otp")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not send OTP. Check your email.")
    } finally { setLoading(false) }
  }

  // ── STEP 2: verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 4) return setError("Enter the full OTP code")
    try {
      setLoading(true); setError("")
      await api.post("/auth/verify-otp", { email, otp })
      setStep("reset")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP. Try again.")
    } finally { setLoading(false) }
  }

  // ── STEP 3: reset password ────────────────────────────────────
  const handleReset = async () => {
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirm) return setError("Passwords do not match")
    try {
      setLoading(true); setError("")
      await api.post("/auth/reset-password", { email, otp, newPassword: password })
      setStep("done")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.")
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    try {
      setResending(true); setError("")
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() })
    } catch { setError("Could not resend OTP") }
    finally { setResending(false) }
  }

  const steps: Step[] = ["email", "otp", "reset", "done"]
  const stepLabels = ["Email", "Verify OTP", "New Password", "Done"]

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"var(--bg-base)", padding:16, position:"relative",
    }}>
      <div style={{ position:"absolute", top:20, right:20 }}>
        <ThemeToggle />
      </div>

      {/* Glow */}
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, var(--indigo-bg), transparent 70%)",
        top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none",
      }} />

      <div style={{ width:"100%", maxWidth:440, position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:28 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:"var(--accent-teal)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <TrendingUp size={19} color="#fff" />
          </div>
          <span style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px", fontFamily:"'Barlow',sans-serif" }}>
            TWIN<span style={{ color:"var(--accent-teal)" }}>TRADE</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background:"var(--bg-surface)", border:"1px solid var(--border)",
          borderRadius:14, boxShadow:"var(--shadow-lg)", overflow:"hidden",
        }}>
          {/* Progress bar */}
          <div style={{ height:3, background:"var(--border)", position:"relative" }}>
            <div style={{
              position:"absolute", top:0, left:0, height:"100%",
              width:`${((steps.indexOf(step)+1)/steps.length)*100}%`,
              background:"linear-gradient(90deg,var(--accent-teal),var(--indigo))",
              transition:"width 0.4s ease",
            }} />
          </div>

          {/* Step indicators */}
          <div style={{ display:"flex", padding:"14px 24px 0", gap:0 }}>
            {steps.map((s,i) => (
              <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                <div style={{
                  width:22, height:22, borderRadius:"50%", fontSize:11, fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: steps.indexOf(step) > i ? "var(--accent-teal)"
                    : step===s ? "var(--indigo)" : "var(--border)",
                  color: steps.indexOf(step) >= i ? "#fff" : "var(--text-muted)",
                  transition:"all 0.3s",
                  zIndex:1,
                }}>
                  {steps.indexOf(step) > i ? "✓" : i+1}
                </div>
                <span style={{ fontSize:9, color: step===s ? "var(--text-primary)" : "var(--text-muted)", marginTop:4, fontWeight: step===s ? 700 : 400, letterSpacing:"0.04em", textTransform:"uppercase" }}>
                  {stepLabels[i]}
                </span>
                {i < steps.length-1 && (
                  <div style={{
                    position:"absolute", top:11, left:"50%", width:"100%", height:1,
                    background: steps.indexOf(step) > i ? "var(--accent-teal)" : "var(--border)",
                    transition:"background 0.3s",
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding:"24px 28px 28px" }}>

            {/* Error */}
            {error && (
              <div style={{
                background:"var(--down-bg)", border:"1px solid var(--down-border)", borderLeft:"3px solid var(--down)",
                color:"var(--down)", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:18,
              }}>
                {error}
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {step === "email" && (
              <>
                <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px", marginBottom:6 }}>
                  Forgot Password?
                </h1>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24, lineHeight:1.65 }}>
                  Enter the email address linked to your account. We'll send you a one-time code.
                </p>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position:"relative", marginBottom:22 }}>
                  <Mail size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                  <input
                    type="email" value={email} onChange={e=>{setError("");setEmail(e.target.value)}}
                    placeholder="you@example.com"
                    style={{ ...inp, paddingLeft:36 }}
                    onFocus={focus} onBlur={blur}
                    onKeyDown={e => e.key==="Enter" && handleSendOtp()}
                  />
                </div>
                <button onClick={handleSendOtp} disabled={loading} className="btn-primary"
                  style={{ width:"100%", justifyContent:"center", padding:"12px", fontSize:14, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <>
                <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px", marginBottom:6 }}>
                  Check your inbox
                </h1>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24, lineHeight:1.65 }}>
                  We sent a 6-digit OTP to <strong style={{ color:"var(--text-primary)" }}>{email}</strong>. Enter it below.
                </p>
                <label style={labelStyle}>OTP Code</label>
                <div style={{ position:"relative", marginBottom:12 }}>
                  <KeyRound size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                  <input
                    type="text" value={otp}
                    onChange={e=>{setError("");setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}}
                    placeholder="6-digit code"
                    style={{ ...inp, paddingLeft:36, letterSpacing:"0.2em", fontFamily:"'JetBrains Mono',monospace", fontSize:18 }}
                    onFocus={focus} onBlur={blur}
                    maxLength={6}
                    onKeyDown={e => e.key==="Enter" && handleVerifyOtp()}
                  />
                </div>
                <div style={{ marginBottom:22, display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:12, color:"var(--text-muted)" }}>Didn't receive it?</span>
                  <button onClick={handleResend} disabled={resending}
                    style={{ fontSize:12, color:"var(--accent-teal)", background:"none", border:"none", cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                    <RefreshCw size={11} style={{ animation: resending ? "spin 0.8s linear infinite" : "none" }} />
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>{setStep("email");setError("")}} className="btn-ghost"
                    style={{ padding:"12px 18px", display:"flex", alignItems:"center", gap:6, fontSize:14 }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={handleVerifyOtp} disabled={loading || otp.length < 4} className="btn-primary"
                    style={{ flex:1, justifyContent:"center", padding:"12px", fontSize:14, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === "reset" && (
              <>
                <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px", marginBottom:6 }}>
                  Set New Password
                </h1>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24, lineHeight:1.65 }}>
                  Choose a strong password for your account.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:22 }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position:"relative" }}>
                      <KeyRound size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                      <input
                        type={showPw ? "text" : "password"} value={password}
                        onChange={e=>{setError("");setPassword(e.target.value)}}
                        placeholder="At least 6 characters"
                        style={{ ...inp, paddingLeft:36, paddingRight:44 }}
                        onFocus={focus} onBlur={blur}
                      />
                      <button type="button" onClick={()=>setShowPw(!showPw)}
                        style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",alignItems:"center" }}>
                        {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position:"relative" }}>
                      <KeyRound size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                      <input
                        type="password" value={confirm}
                        onChange={e=>{setError("");setConfirm(e.target.value)}}
                        placeholder="Repeat new password"
                        style={{ ...inp, paddingLeft:36 }}
                        onFocus={focus} onBlur={blur}
                        onKeyDown={e => e.key==="Enter" && handleReset()}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={handleReset} disabled={loading} className="btn-primary"
                  style={{ width:"100%", justifyContent:"center", padding:"12px", fontSize:14, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}

            {/* ── STEP 4: Done ── */}
            {step === "done" && (
              <div style={{ textAlign:"center", padding:"12px 0" }}>
                <div style={{ width:56, height:56, borderRadius:14, background:"var(--up-bg)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
                  <CheckCircle size={28} color="var(--up)" />
                </div>
                <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", marginBottom:8 }}>
                  Password Reset!
                </h1>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24, lineHeight:1.65 }}>
                  Your password has been updated. You can now log in with your new password.
                </p>
                <button onClick={()=>router.push("/login")} className="btn-primary"
                  style={{ display:"inline-flex", padding:"12px 28px", fontSize:14 }}>
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to login link */}
        {step !== "done" && (
          <div style={{ textAlign:"center", marginTop:20 }}>
            <Link href="/login" style={{ fontSize:13, color:"var(--text-muted)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5 }}>
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
