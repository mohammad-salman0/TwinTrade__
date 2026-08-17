// src/app/profile/page.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoutes"
import api from "@/services/api"
import {
  User, Mail, Phone, Camera, Save, Shield,
  CheckCircle, AlertCircle, Loader2
} from "lucide-react"

type Profile = {
  name: string
  email: string
  phone: string
  supportEmail: string
  avatar: string | null
}

type Toast = { message: string; type: "success" | "error" } | null

// ── Compress + resize an image file before converting to base64 ──
// Avatars don't need to be more than ~256px for a profile picture —
// resizing client-side keeps the base64 payload small (typically
// under 50-100kb instead of multi-MB for a raw phone camera photo),
// which avoids hitting body size limits and keeps MongoDB documents
// lean. Returns a JPEG data URL.
function resizeImageToDataUrl(file: File, maxDimension = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round(height * (maxDimension / width))
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height))
            height = maxDimension
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas context unavailable"))
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export default function ProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile>({
    name: "", email: "", phone: "", supportEmail: "", avatar: null,
  })
  const [preview, setPreview]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [imageProcessing, setImageProcessing] = useState(false)
  const [toast, setToast]       = useState<Toast>(null)

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwError, setPwError]     = useState("")

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── fetch profile ──────────────────────────────────────────────
  useEffect(() => {
    api.get("/user/profile")
      .then(r => {
        const d = r.data
        setProfile({
          name:         d.name        || "",
          email:        d.email       || "",
          phone:        d.phone       || "",
          supportEmail: d.supportEmail || "",
          avatar:       d.avatar      || null,
        })
        if (d.avatar) setPreview(d.avatar)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // ── avatar pick — resize before previewing/storing ─────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error")
      return
    }

    try {
      setImageProcessing(true)
      const resized = await resizeImageToDataUrl(file, 256, 0.85)
      setPreview(resized)
    } catch (err) {
      showToast("Could not process that image, try a different file", "error")
    } finally {
      setImageProcessing(false)
      // reset the input so selecting the same file again still fires onChange
      e.target.value = ""
    }
  }

  // ── save profile ───────────────────────────────────────────────
  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const payload: any = {
        name:         profile.name,
        phone:        profile.phone,
        supportEmail: profile.supportEmail,
      }
      if (preview && preview !== profile.avatar) payload.avatar = preview
      const res = await api.put("/user/profile", payload)

      // Sync local state with what the server actually confirmed saving —
      // previously the response was discarded, so `profile.avatar` stayed
      // stuck on the value loaded at page mount and the UI never reflected
      // the newly saved photo until a full page reload.
      setProfile(p => ({
        ...p,
        name: res.data.name ?? p.name,
        phone: res.data.phone ?? p.phone,
        supportEmail: res.data.supportEmail ?? p.supportEmail,
        avatar: res.data.avatar ?? p.avatar,
      }))
      if (res.data.avatar) setPreview(res.data.avatar)

      showToast("Profile updated successfully", "success")
    } catch (err: any) {
      const msg = err?.response?.status === 413
        ? "Image is still too large — try a smaller photo"
        : "Failed to update profile"
      showToast(msg, "error")
    } finally {
      setSaving(false)
    }
  }

  // ── change password ────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwError("")
    if (!passwords.current) return setPwError("Enter your current password")
    if (passwords.next.length < 6) return setPwError("New password must be at least 6 characters")
    if (passwords.next !== passwords.confirm) return setPwError("Passwords do not match")
    try {
      setPwSaving(true)
      await api.put("/user/change-password", {
        currentPassword: passwords.current,
        newPassword:     passwords.next,
      })
      setPasswords({ current: "", next: "", confirm: "" })
      showToast("Password changed successfully", "success")
    } catch (err: any) {
      setPwError(err?.response?.data?.message || "Failed to change password")
    } finally {
      setPwSaving(false)
    }
  }

  // ── shared input style ─────────────────────────────────────────
  const inp = {
    width: "100%", background: "var(--bg-base)", border: "1.5px solid var(--border)",
    color: "var(--text-primary)", borderRadius: 8, padding: "11px 14px",
    fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  }
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--accent-teal)")
  const blur  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--border)")

  const label = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
    textTransform: "uppercase" as const, color: "var(--text-muted)", marginBottom: 8,
  }

  if (loading) return (
    <ProtectedRoute>
      <DashboardLayout>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", gap:14 }}>
          <div className="spin" style={{ width:26,height:26,borderRadius:"50%",border:"3px solid var(--border)",borderTopColor:"var(--accent-teal)" }} />
          <span style={{ fontSize:14,color:"var(--text-muted)" }}>Loading profile...</span>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )

  return (
    <ProtectedRoute>
      <DashboardLayout>

        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position:"fixed", top:20, right:20, zIndex:9999,
            background: toast.type==="success" ? "var(--up-bg)" : "var(--down-bg)",
            border: `1px solid ${toast.type==="success" ? "var(--up-border)" : "var(--down-border)"}`,
            color: toast.type==="success" ? "var(--up)" : "var(--down)",
            padding:"12px 18px", borderRadius:10, fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", gap:8, boxShadow:"var(--shadow-lg)",
            animation:"slideIn 0.2s ease",
          }}>
            {toast.type==="success" ? <CheckCircle size={15}/> : <AlertCircle size={15}/>}
            {toast.message}
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:24, maxWidth:720 }}>

          {/* ── Header ── */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <User size={13} color="var(--accent-teal)" />
              <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500 }}>Account</span>
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.4px", fontFamily:"'Barlow',sans-serif" }}>
              Profile Settings
            </h1>
            <p style={{ color:"var(--text-muted)", marginTop:6, fontSize:14 }}>
              Update your personal details and account preferences.
            </p>
          </div>

          {/* ── Profile Card ── */}
          <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12, boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,var(--accent-teal),var(--indigo))" }} />

            <div style={{ padding:"28px 28px 0" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", marginBottom:20 }}>Personal Information</p>

              {/* ── Avatar ── */}
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
                <div style={{ position:"relative" }}>
                  <div style={{
                    width:80, height:80, borderRadius:"50%",
                    background:"var(--accent-teal-bg)", border:"2px solid var(--accent-teal-border)",
                    overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {imageProcessing ? (
                      <div className="spin" style={{ width:22,height:22,borderRadius:"50%",border:"2.5px solid var(--border)",borderTopColor:"var(--accent-teal)" }} />
                    ) : preview ? (
                      <img src={preview} alt="avatar" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    ) : (
                      <User size={32} color="var(--accent-teal)" />
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={imageProcessing}
                    style={{
                      position:"absolute", bottom:0, right:0,
                      width:26, height:26, borderRadius:"50%", border:"2px solid var(--bg-surface)",
                      background:"var(--accent-teal)", display:"flex", alignItems:"center", justifyContent:"center",
                      cursor: imageProcessing ? "not-allowed" : "pointer", opacity: imageProcessing ? 0.6 : 1,
                    }}
                  >
                    <Camera size={13} color="#fff" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:"none" }} />
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{profile.name || "Your Name"}</p>
                  <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:3 }}>{profile.email}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={imageProcessing}
                    style={{ fontSize:12, color:"var(--accent-teal)", background:"none", border:"none", cursor: imageProcessing ? "not-allowed" : "pointer", padding:0, marginTop:6, fontWeight:600 }}
                  >
                    {imageProcessing ? "Processing..." : "Change photo"}
                  </button>
                </div>
              </div>

              {/* ── Fields ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, paddingBottom:28 }}>

                {/* Name */}
                <div>
                  <label style={label}>Full Name</label>
                  <div style={{ position:"relative" }}>
                    <User size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                    <input
                      value={profile.name}
                      onChange={e => setProfile(p=>({...p,name:e.target.value}))}
                      placeholder="Your full name"
                      style={{ ...inp, paddingLeft:36 }}
                      onFocus={focus} onBlur={blur}
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label style={label}>Email Address</label>
                  <div style={{ position:"relative" }}>
                    <Mail size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                    <input
                      value={profile.email}
                      readOnly
                      style={{ ...inp, paddingLeft:36, opacity:0.6, cursor:"not-allowed" }}
                    />
                  </div>
                  <p style={{ fontSize:10, color:"var(--text-muted)", marginTop:5 }}>Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label style={label}>Phone Number</label>
                  <div style={{ position:"relative" }}>
                    <Phone size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                    <input
                      value={profile.phone}
                      onChange={e => setProfile(p=>({...p,phone:e.target.value}))}
                      placeholder="+91 98765 43210"
                      style={{ ...inp, paddingLeft:36 }}
                      onFocus={focus} onBlur={blur}
                    />
                  </div>
                </div>

                {/* Support Email */}
                <div>
                  <label style={label}>Support / Alternate Email</label>
                  <div style={{ position:"relative" }}>
                    <Mail size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)" }} />
                    <input
                      value={profile.supportEmail}
                      onChange={e => setProfile(p=>({...p,supportEmail:e.target.value}))}
                      placeholder="support@example.com"
                      type="email"
                      style={{ ...inp, paddingLeft:36 }}
                      onFocus={focus} onBlur={blur}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div style={{ padding:"16px 28px", borderTop:"1px solid var(--border)", background:"var(--bg-base)", display:"flex", justifyContent:"flex-end" }}>
              <button onClick={handleSaveProfile} disabled={saving || imageProcessing} className="btn-primary"
                style={{ padding:"10px 22px", fontSize:13, opacity: (saving || imageProcessing) ? 0.7 : 1 }}>
                {saving ? <Loader2 size={14} style={{ animation:"spin 0.8s linear infinite" }} /> : <Save size={14} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Change Password Card ── */}
          <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12, boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,var(--indigo),var(--accent-teal))" }} />

            <div style={{ padding:"28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                <Shield size={15} color="var(--indigo)" />
                <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>Change Password</p>
              </div>

              {pwError && (
                <div style={{
                  background:"var(--down-bg)", border:"1px solid var(--down-border)", borderLeft:"3px solid var(--down)",
                  color:"var(--down)", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:18,
                  display:"flex", alignItems:"center", gap:8,
                }}>
                  <AlertCircle size={14} /> {pwError}
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                {[
                  { key:"current", label:"Current Password",  placeholder:"Current password" },
                  { key:"next",    label:"New Password",       placeholder:"At least 6 characters" },
                  { key:"confirm", label:"Confirm Password",   placeholder:"Repeat new password" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={label}>{f.label}</label>
                    <input
                      type="password"
                      value={passwords[f.key as keyof typeof passwords]}
                      onChange={e => { setPwError(""); setPasswords(p=>({...p,[f.key]:e.target.value})) }}
                      placeholder={f.placeholder}
                      style={inp}
                      onFocus={focus} onBlur={blur}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"16px 28px", borderTop:"1px solid var(--border)", background:"var(--bg-base)", display:"flex", justifyContent:"flex-end" }}>
              <button onClick={handleChangePassword} disabled={pwSaving} className="btn-primary"
                style={{ padding:"10px 22px", fontSize:13, background:"var(--indigo)", opacity: pwSaving ? 0.7 : 1 }}>
                {pwSaving ? <Loader2 size={14} style={{ animation:"spin 0.8s linear infinite" }} /> : <Shield size={14} />}
                {pwSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
