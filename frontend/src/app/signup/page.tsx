// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { TrendingUp, User, Mail, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/signup", { name, email, password });
      alert("Account created! Please login.");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-base)",
    border: "1.5px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  const fields = [
    { label: "Full Name",       type: "text",     value: name,     set: setName,     icon: User,  placeholder: "Your full name" },
    { label: "Email Address",   type: "email",    value: email,    set: setEmail,    icon: Mail,  placeholder: "you@example.com" },
    { label: "Password",        type: "password", value: password, set: setPassword, icon: Lock,  placeholder: "Create a password" },
  ]

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", padding: 16, position: "relative",
    }}>

      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, var(--indigo-bg), transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        pointerEvents: "none",
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
          <div style={{ height: 3, background: "linear-gradient(90deg, var(--indigo), var(--accent-teal))" }} />

          <form onSubmit={handleSignup} style={{ padding: "32px 28px" }}>

            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 6 }}>
                Create Account
              </h1>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                Join TwinTrade and start halal investing today.
              </p>
            </div>

            {error && (
              <div style={{
                background: "var(--down-bg)", border: "1px solid var(--down-border)",
                color: "var(--down)", padding: "10px 14px", borderRadius: 8,
                fontSize: 13, marginBottom: 20, borderLeft: "3px solid var(--down)",
              }}>
                {error}
              </div>
            )}

            {fields.map(field => {
              const Icon = field.icon
              return (
                <div key={field.label} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                    {field.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Icon size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type={field.type} value={field.value}
                      onChange={e => field.set(e.target.value)}
                      placeholder={field.placeholder} required
                      style={{ ...inputStyle, paddingLeft: 36 }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--accent-teal)" }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)" }}
                    />
                  </div>
                </div>
              )
            })}

            <div style={{ marginTop: 28 }}>
              <button type="submit" disabled={loading} className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <p style={{ fontSize: 13, textAlign: "center", color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <span onClick={() => router.push("/login")} style={{
                color: "var(--accent-teal)", cursor: "pointer", fontWeight: 600,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
              >
                Login →
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
