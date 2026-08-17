// src/app/about/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Brain, Globe } from "lucide-react";

const pillars = [
  "AAOIFI-compliant Shariah screening",
  "AI-driven portfolio intelligence",
  "Real-time halal certification alerts",
];

const values = [
  {
    num: "01",
    title: "Integrity",
    desc: "Every screening decision is grounded in authentic Shariah scholarship and transparent methodology.",
    accent: "var(--accent-teal)",
    icon: ShieldCheck,
  },
  {
    num: "02",
    title: "Innovation",
    desc: "Cutting-edge AI models continuously refine our halal stock analysis and portfolio recommendations.",
    accent: "var(--indigo)",
    icon: Brain,
  },
  {
    num: "03",
    title: "Accessibility",
    desc: "Bringing institutional-grade ethical investing tools to everyday Muslim investors worldwide.",
    accent: "var(--warn)",
    icon: Globe,
  },
];

const stats = [
  { value: "AAOIFI", label: "Standards" },
  { value: "AI", label: "Powered" },
  { value: "100%", label: "Halal Focus" },
];

const team = [
  {
    initials: "MS",
    name: "Mohammad Salman",
    role: "Founder & Vision Lead",
    bio: "Passionate about ethical finance, he developed TwinTrade and its Shariah-compliant screening engine to make halal investing simple, transparent, and accessible.",
    photo: "/media/salman.JPG",
  },
  {
    initials: "DF",
    name: "Dawar Farooq",
    role: "Lead Developer",
    bio: "Responsible for the AI-powered halal screening engine, secure backend systems, and real-time fintech infrastructure.",
    photo: "/media/Dawar.JPG",
  },
];

export default function About() {
  return (
    <div
      style={{
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* HERO */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent-teal-bg)",
            color: "var(--accent-teal)",
            border: "1px solid var(--accent-teal-border)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 999,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-teal)",
              display: "inline-block",
            }}
          />
          Ethical AI Investing Platform
        </div>
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 20,
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          About <span style={{ color: "var(--accent-teal)" }}>Twin</span>Trade
        </h1>
        <div
          style={{
            width: 40,
            height: 2,
            background: "var(--accent-teal)",
            margin: "24px auto",
          }}
        />
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.85,
            color: "var(--text-muted)",
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          Combining ethical investing, artificial intelligence, and halal stock
          screening into one powerful fintech platform designed for the modern
          investor.
        </p>
      </section>

      {/* PLATFORM */}
      <section
        style={{
          padding: "60px 24px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-teal)",
              marginBottom: 16,
            }}
          >
            Our Platform
          </p>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 24,
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Building the Future of Ethical Investing
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "TwinTrade helps investors discover halal investment opportunities through advanced Shariah screening and AI-driven financial analysis.",
              "Our platform evaluates companies using AAOIFI standards, sector analysis, and intelligent portfolio insights — making ethical investing more accessible and technologically advanced.",
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: "var(--text-muted)",
                }}
              >
                {p}
              </p>
            ))}
          </div>
          <ul
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {pillars.map((p) => (
              <li
                key={p}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent-teal)",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, var(--accent-teal), transparent)",
              marginBottom: 0,
            }}
          />
          <img
            src="/media/tt2.png"
            alt="TwinTrade partnership"
            style={{
              width: "100%",
              aspectRatio: "4/5",
              objectFit: "cover",
              border: "1px solid var(--border)",
              filter: "brightness(0.95)",
            }}
          />
        </div>
      </section>

      {/* MISSION */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--indigo)",
            marginBottom: 20,
          }}
        >
          Mission
        </p>
        <h2
          style={{
            fontSize: "clamp(36px, 6vw, 54px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            maxWidth: 680,
            margin: "0 auto 0",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          Empowering investors with{" "}
          <span style={{ color: "var(--indigo)" }}>purpose</span>
        </h2>
        <div
          style={{
            width: 1,
            height: 48,
            background: "var(--border)",
            margin: "28px auto",
          }}
        />
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.9,
            color: "var(--text-muted)",
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          To empower Muslim investors worldwide with intelligent financial tools
          that align with Islamic principles while leveraging the power of
          modern AI and fintech innovation.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            maxWidth: 600,
            margin: "48px auto 0",
            border: "1px solid var(--border)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "28px 0",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  display: "block",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: 6,
                  display: "block",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: "var(--bg-base)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-teal)",
              marginBottom: 28,
            }}
          >
            Core Values
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 14,
            }}
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.num}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 32,
                    borderTop: `3px solid ${v.accent}`,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 800,
                      color: "var(--border)",
                      lineHeight: 1,
                      marginBottom: 16,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {v.num}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Icon size={14} color={v.accent} />
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {v.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.75,
                      color: "var(--text-muted)",
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section
        style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-teal)",
              marginBottom: 12,
            }}
          >
            The Team
          </p>
          <h2
            style={{
              fontSize: "clamp(32px,5vw,48px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            The people building TwinTrade
          </h2>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {team.map((member) => (
            <div
              key={member.name}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 28,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "2px solid var(--accent-teal-border)",
                  overflow: "hidden",
                  background: "var(--accent-teal-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {member.name}
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent-teal)",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {member.role}
                </span>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: "var(--text-muted)",
                  }}
                >
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
