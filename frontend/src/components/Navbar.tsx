// "use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 40px)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--accent-teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={16} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.3px",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            TWIN<span style={{ color: "var(--accent-teal)" }}>TRADE</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 32 }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.15s",
                color:
                  pathname === link.href
                    ? "var(--accent-teal)"
                    : "var(--text-secondary)",
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex" style={{ gap: 10 }}>
          <Link href="/login">
            <button
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                transition: "background 0.15s",
              }}
            >
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: "var(--accent-teal)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
            padding: 6,
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            padding: "16px clamp(16px, 4vw, 40px) 24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textDecoration: "none",
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 500,
                borderBottom: "1px solid var(--border)",
                color:
                  pathname === link.href
                    ? "var(--accent-teal)"
                    : "var(--text-primary)",
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Link href="/login" style={{ flex: 1 }}>
              <button
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Login
              </button>
            </Link>
            <Link href="/signup" style={{ flex: 1 }}>
              <button
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--accent-teal)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
