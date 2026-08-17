"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else setOk(true);
  }, []);

  if (!ok) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"var(--bg-base)" }}>
      <div style={{ width:44, height:44, borderRadius:11, background:"var(--accent-teal)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <TrendingUp size={22} color="#fff" />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div className="spin" style={{ width:18, height:18, borderRadius:"50%", border:"2.5px solid var(--border)", borderTopColor:"var(--accent-teal)" }} />
        <span style={{ fontSize:13, color:"var(--text-muted)", fontWeight:500 }}>Verifying session...</span>
      </div>
    </div>
  );

  return <>{children}</>;
}
