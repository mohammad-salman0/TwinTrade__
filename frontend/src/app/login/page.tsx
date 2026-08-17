// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { Eye, EyeOff, TrendingUp, Mail, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      localStorage.removeItem("token");
      const response = await api.post("/auth/login", {
        email:    email.trim().toLowerCase(),
        password: password.trim(),
      });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", background: "var(--bg-base)", border: "1.5px solid var(--border)",
    color: "var(--text-primary)", borderRadius: 8, padding: "11px 14px",
    fontSize: 14, outline: "none", transition: "border-color 0.15s", fontFamily: "inherit",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--accent-teal)");
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--border)");

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", padding: 16, position: "relative",
    }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      {/* Glow */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-teal-bg), transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={19} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px", fontFamily: "'Barlow', sans-serif" }}>
            TWIN<span style={{ color: "var(--accent-teal)" }}>TRADE</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border)",
          borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden",
        }}>
          <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent-teal), var(--indigo))" }} />

          <form onSubmit={handleLogin} style={{ padding: "32px 28px" }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 6 }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                Login to continue your halal investing journey.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "var(--down-bg)", border: "1px solid var(--down-border)",
                color: "var(--down)", padding: "10px 14px", borderRadius: 8,
                fontSize: 13, marginBottom: 20, borderLeft: "3px solid var(--down)",
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email" value={email} onChange={e => { setError(""); setEmail(e.target.value); }}
                  placeholder="you@example.com" required
                  style={{ ...inp, paddingLeft: 36 }}
                  onFocus={focus} onBlur={blur}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Password
                </label>
                {/* ── Forgot Password link ── */}
                <Link href="/forgot-password" style={{
                  fontSize: 12, color: "var(--accent-teal)", textDecoration: "none",
                  fontWeight: 600, transition: "opacity 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={e => { setError(""); setPassword(e.target.value); }}
                  placeholder="Enter password" required
                  style={{ ...inp, paddingLeft: 36, paddingRight: 44 }}
                  onFocus={focus} onBlur={blur}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                  display: "flex", alignItems: "center",
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: 24 }}>
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Signup */}
            <p style={{ fontSize: 13, textAlign: "center", color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <span onClick={() => router.push("/signup")} style={{
                color: "var(--accent-teal)", cursor: "pointer", fontWeight: 600,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
              >
                Create account →
              </span>
            </p>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-faint)", marginTop: 20 }}>
          © {new Date().getFullYear()} TwinTrade · Halal Investing Platform
        </p>
      </div>
    </div>
  );
}
