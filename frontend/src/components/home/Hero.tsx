// // src/components/home/Hero.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck, Brain, TrendingUp } from "lucide-react";

const images = [
  "/media/Screenshot 2026-06-07 200826.png",
  "/media/Screenshot 2026-06-07 200713.png",
  "/media/Screenshot 2026-06-07 200907.png",
  "/media/Screenshot 2026-06-07 183922.png",
];

const features = [
  { icon: ShieldCheck, label: "Halal Stock Screening" },
  { icon: Brain, label: "AI Portfolio Insights" },
  { icon: TrendingUp, label: "Zero Advisory Fees" },
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "clamp(48px, 8vw, 96px) clamp(16px, 5vw, 24px)",
        background: "var(--bg-base)",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "var(--accent-teal-bg)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "var(--indigo-bg)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/*
        Responsive grid:
          mobile  → single column (image below text)
          md+     → two equal columns side by side
      */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
      >
        {/* LEFT — text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 16px",
              borderRadius: 999,
              background: "var(--accent-teal-bg)",
              border: "1px solid var(--accent-teal-border)",
              color: "var(--accent-teal)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 24,
              letterSpacing: "0.03em",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent-teal)",
                display: "inline-block",
              }}
              className="live-dot"
            />
            AI Powered Halal Investing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: 20,
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Investing made{" "}
            <span style={{ color: "var(--accent-teal)" }}>Ethical</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              lineHeight: 1.75,
              color: "var(--text-muted)",
              marginBottom: 36,
            }}
          >
            TwinTrade empowers investors to trade confidently with
            halal-compliant screening, AI insights, and transparent financial
            tools built for modern ethical investing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <Link href="/signup">
              <button
                className="btn-primary"
                style={{ padding: "13px 28px", fontSize: 15 }}
              >
                Start Investing
              </button>
            </Link>
            <Link href="/about">
              <button
                className="btn-ghost"
                style={{ padding: "13px 28px", fontSize: 15 }}
              >
                Learn More
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "7px 14px",
                    borderRadius: 8,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  <Icon size={13} color="var(--accent-teal)" />
                  {f.label}
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* RIGHT — image slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "80%",
              paddingBottom: "80%",
              borderRadius: "50%",
              background: "var(--accent-teal-bg)",
              filter: "blur(60px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              borderRadius: 20,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-base)",
              }}
            >
              {["#f87171", "#fbbf24", "#4ade80"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 5,
                  background: "var(--border)",
                  marginLeft: 8,
                }}
              />
            </div>

            {/* Image — height responsive using aspect ratio trick */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "65%",
                overflow: "hidden",
                background: "var(--bg-surface)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  src={images[currentImage]}
                  alt="TwinTrade Dashboard"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    padding: 12,
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                zIndex: 10,
              }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    width: currentImage === i ? 24 : 8,
                    background:
                      currentImage === i
                        ? "var(--accent-teal)"
                        : "var(--border)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
