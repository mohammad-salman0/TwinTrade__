// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Bell, ShoppingBag, TrendingUp, TrendingDown, Check, X, CheckCheck } from "lucide-react"
// import api from "@/services/api"

// type OrderNotif = {
//   id: string
//   type: "order"
//   title: string
//   body: string
//   time: string
//   read: boolean
//   orderType: "BUY" | "SELL"
// }

// type PriceNotif = {
//   id: string
//   type: "price"
//   title: string
//   body: string
//   time: string
//   read: boolean
//   direction: "up" | "down"
// }

// type Notif = OrderNotif | PriceNotif

// // Price alert thresholds stored in memory
// // (In production these would be stored in the DB)
// const PRICE_ALERTS = [
//   { symbol: "INFY",     threshold: 1000, direction: "up"  as const },
//   { symbol: "TCS",      threshold: 3500, direction: "up"  as const },
//   { symbol: "RELIANCE", threshold: 2900, direction: "down" as const },
// ]

// function timeAgo(dateStr: string) {
//   const diff = Date.now() - new Date(dateStr).getTime()
//   const mins = Math.floor(diff / 60000)
//   if (mins < 1)  return "just now"
//   if (mins < 60) return `${mins}m ago`
//   const hrs = Math.floor(mins / 60)
//   if (hrs < 24)  return `${hrs}h ago`
//   return `${Math.floor(hrs / 24)}d ago`
// }

// export default function NotificationPanel() {
//   const [open, setOpen]       = useState(false)
//   const [notifs, setNotifs]   = useState<Notif[]>([])
//   const [loading, setLoading] = useState(true)
//   const panelRef              = useRef<HTMLDivElement>(null)

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
//         setOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handler)
//     return () => document.removeEventListener("mousedown", handler)
//   }, [])

//   const fetchNotifications = async () => {
//     setLoading(true)
//     const result: Notif[] = []

//     // ── Order notifications ─────────────────────────────────
//     try {
//       const res = await api.get("/orders")
//       const orders = res.data?.orders || res.data || []

//       orders.slice(0, 8).forEach((o: any) => {
//         result.push({
//           id:        `order-${o._id}`,
//           type:      "order",
//           orderType: o.orderType,
//           title:     `${o.orderType} Order Executed`,
//           body:      `${o.quantity} shares of ${o.symbol} at ₹${o.price?.toFixed(2)} — Total ₹${o.totalAmount?.toLocaleString("en-IN")}`,
//           time:      o.createdAt || new Date().toISOString(),
//           read:      false,
//         })
//       })
//     } catch {
//       // orders endpoint unavailable — skip
//     }

//     // ── Price alert notifications ───────────────────────────
//     try {
//       const res = await api.get("/stocks", { params: { page: 1, pageSize: 25 } })
//       const stocks = res.data?.stocks || []

//       PRICE_ALERTS.forEach(alert => {
//         const stock = stocks.find((s: any) =>
//           s.symbol?.toUpperCase() === alert.symbol.toUpperCase()
//         )
//         if (!stock || stock.price == null) return

//         const triggered =
//           alert.direction === "up"
//             ? stock.price >= alert.threshold
//             : stock.price <= alert.threshold

//         if (triggered) {
//           result.push({
//             id:        `price-${alert.symbol}-${alert.threshold}`,
//             type:      "price",
//             direction: alert.direction,
//             title:     `Price Alert — ${alert.symbol}`,
//             body:      `${alert.symbol} is ${alert.direction === "up" ? "above" : "below"} ₹${alert.threshold.toLocaleString("en-IN")} (current: ₹${stock.price?.toLocaleString("en-IN")})`,
//             time:      new Date().toISOString(),
//             read:      false,
//           })
//         }
//       })
//     } catch {
//       // price check failed — skip
//     }

//     // Sort newest first
//     result.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//     setNotifs(result)
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchNotifications()
//   }, [])

//   // Re-fetch when panel opens
//   useEffect(() => {
//     if (open) fetchNotifications()
//   }, [open])

//   const unread = notifs.filter(n => !n.read).length

//   const markAllRead = () =>
//     setNotifs(prev => prev.map(n => ({ ...n, read: true })))

//   const dismiss = (id: string) =>
//     setNotifs(prev => prev.filter(n => n.id !== id))

//   const markRead = (id: string) =>
//     setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

//   return (
//     <div ref={panelRef} style={{ position: "relative" }}>

//       {/* Bell button */}
//       <button
//         onClick={() => setOpen(!open)}
//         style={{
//           position: "relative", width: 36, height: 36, borderRadius: 8,
//           background: open ? "var(--accent-teal-bg)" : "var(--bg-hover)",
//           border: `1.5px solid ${open ? "var(--accent-teal-border)" : "var(--border)"}`,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           cursor: "pointer", color: open ? "var(--accent-teal)" : "var(--text-secondary)",
//           transition: "all 0.15s",
//         }}
//       >
//         <Bell size={15} />
//         {unread > 0 && (
//           <span style={{
//             position: "absolute", top: 5, right: 5,
//             width: 16, height: 16, borderRadius: "50%",
//             background: "var(--down)", border: "1.5px solid var(--bg-surface)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 9, fontWeight: 800, color: "#fff", lineHeight: 1,
//           }}>
//             {unread > 9 ? "9+" : unread}
//           </span>
//         )}
//       </button>

//       {/* Dropdown panel */}
//       {open && (
//         <div style={{
//           position: "absolute", top: "calc(100% + 10px)", right: 0,
//           width: 360, maxHeight: 480,
//           background: "var(--bg-elevated)", border: "1px solid var(--border)",
//           borderRadius: 12, boxShadow: "var(--shadow-lg)",
//           overflow: "hidden", display: "flex", flexDirection: "column",
//           zIndex: 100,
//         }}>

//           {/* Panel header */}
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             padding: "14px 16px", borderBottom: "1px solid var(--border)",
//             background: "var(--bg-surface)",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Bell size={14} color="var(--accent-teal)" />
//               <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
//                 Notifications
//               </span>
//               {unread > 0 && (
//                 <span style={{
//                   fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
//                   background: "var(--down-bg)", color: "var(--down)",
//                   border: "1px solid var(--down-border)",
//                 }}>
//                   {unread} new
//                 </span>
//               )}
//             </div>
//             {unread > 0 && (
//               <button
//                 onClick={markAllRead}
//                 style={{
//                   display: "flex", alignItems: "center", gap: 4,
//                   fontSize: 11, color: "var(--accent-teal)", fontWeight: 600,
//                   background: "none", border: "none", cursor: "pointer", padding: 0,
//                 }}
//               >
//                 <CheckCheck size={13} /> Mark all read
//               </button>
//             )}
//           </div>

//           {/* Notification list */}
//           <div style={{ overflowY: "auto", flex: 1 }}>

//             {loading && (
//               <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
//                 Loading notifications...
//               </div>
//             )}

//             {!loading && notifs.length === 0 && (
//               <div style={{ padding: "40px 16px", textAlign: "center" }}>
//                 <Bell size={28} color="var(--text-muted)" style={{ margin: "0 auto 10px" }} />
//                 <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
//                   No notifications yet
//                 </p>
//                 <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
//                   Order confirmations and price alerts will appear here
//                 </p>
//               </div>
//             )}

//             {!loading && notifs.map(n => (
//               <div
//                 key={n.id}
//                 onClick={() => markRead(n.id)}
//                 style={{
//                   display: "flex", alignItems: "flex-start", gap: 12,
//                   padding: "12px 16px", borderBottom: "1px solid var(--border)",
//                   background: n.read ? "transparent" : "var(--accent-teal-bg)",
//                   cursor: "pointer", transition: "background 0.12s", position: "relative",
//                 }}
//                 onMouseEnter={e => {
//                   if (n.read) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"
//                 }}
//                 onMouseLeave={e => {
//                   (e.currentTarget as HTMLElement).style.background = n.read ? "transparent" : "var(--accent-teal-bg)"
//                 }}
//               >
//                 {/* Icon */}
//                 <div style={{
//                   width: 34, height: 34, borderRadius: 8, flexShrink: 0,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   background: n.type === "order"
//                     ? (n as OrderNotif).orderType === "BUY" ? "var(--up-bg)" : "var(--down-bg)"
//                     : (n as PriceNotif).direction === "up" ? "var(--up-bg)" : "var(--down-bg)",
//                 }}>
//                   {n.type === "order"
//                     ? <ShoppingBag size={15} color={(n as OrderNotif).orderType === "BUY" ? "var(--up)" : "var(--down)"} />
//                     : (n as PriceNotif).direction === "up"
//                       ? <TrendingUp size={15} color="var(--up)" />
//                       : <TrendingDown size={15} color="var(--down)" />
//                   }
//                 </div>

//                 {/* Content */}
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
//                       {n.title}
//                     </span>
//                     {!n.read && (
//                       <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-teal)", flexShrink: 0 }} />
//                     )}
//                   </div>
//                   <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
//                     {n.body}
//                   </p>
//                   <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>
//                     {timeAgo(n.time)}
//                   </p>
//                 </div>

//                 {/* Dismiss button */}
//                 <button
//                   onClick={e => { e.stopPropagation(); dismiss(n.id) }}
//                   style={{
//                     background: "none", border: "none", cursor: "pointer",
//                     color: "var(--text-muted)", padding: 2, flexShrink: 0,
//                     borderRadius: 4, display: "flex", alignItems: "center",
//                   }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--down)" }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)" }}
//                 >
//                   <X size={13} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Footer */}
//           {notifs.length > 0 && (
//             <div style={{
//               padding: "10px 16px", borderTop: "1px solid var(--border)",
//               background: "var(--bg-surface)", textAlign: "center",
//             }}>
//               <button
//                 onClick={() => setNotifs([])}
//                 style={{
//                   fontSize: 12, color: "var(--text-muted)", fontWeight: 500,
//                   background: "none", border: "none", cursor: "pointer",
//                 }}
//               >
//                 Clear all notifications
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
import api from "@/services/api";

type OrderNotif = {
  id: string;
  type: "order";
  title: string;
  body: string;
  time: string;
  read: boolean;
  orderType: "BUY" | "SELL";
};

type PriceNotif = {
  id: string;
  type: "price";
  title: string;
  body: string;
  time: string;
  read: boolean;
  direction: "up" | "down";
};

type Notif = OrderNotif | PriceNotif;

// Price alert thresholds stored in memory
// (In production these would be stored in the DB)
const PRICE_ALERTS = [
  { symbol: "INFY", threshold: 1000, direction: "up" as const },
  { symbol: "TCS", threshold: 3500, direction: "up" as const },
  { symbol: "RELIANCE", threshold: 2900, direction: "down" as const },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const result: Notif[] = [];

    // ── Order notifications ─────────────────────────────────
    try {
      const res = await api.get("/orders");
      const orders = res.data?.orders || res.data || [];

      orders.slice(0, 8).forEach((o: any) => {
        result.push({
          id: `order-${o._id}`,
          type: "order",
          orderType: o.orderType,
          title: `${o.orderType} Order Executed`,
          body: `${o.quantity} shares of ${o.symbol} at ₹${o.price?.toFixed(2)} — Total ₹${o.totalAmount?.toLocaleString("en-IN")}`,
          time: o.createdAt || new Date().toISOString(),
          read: false,
        });
      });
    } catch {
      // orders endpoint unavailable — skip
    }

    // ── Price alert notifications ───────────────────────────
    try {
      const res = await api.get("/stocks", {
        params: { page: 1, pageSize: 25 },
      });
      const stocks = res.data?.stocks || [];

      PRICE_ALERTS.forEach((alert) => {
        const stock = stocks.find(
          (s: any) => s.symbol?.toUpperCase() === alert.symbol.toUpperCase(),
        );
        if (!stock || stock.price == null) return;

        const triggered =
          alert.direction === "up"
            ? stock.price >= alert.threshold
            : stock.price <= alert.threshold;

        if (triggered) {
          result.push({
            id: `price-${alert.symbol}-${alert.threshold}`,
            type: "price",
            direction: alert.direction,
            title: `Price Alert — ${alert.symbol}`,
            body: `${alert.symbol} is ${alert.direction === "up" ? "above" : "below"} ₹${alert.threshold.toLocaleString("en-IN")} (current: ₹${stock.price?.toLocaleString("en-IN")})`,
            time: new Date().toISOString(),
            read: false,
          });
        }
      });
    } catch {
      // price check failed — skip
    }

    // Sort newest first
    result.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
    setNotifs(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Re-fetch when panel opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: 8,
          background: open ? "var(--accent-teal-bg)" : "var(--bg-hover)",
          border: `1.5px solid ${open ? "var(--accent-teal-border)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: open ? "var(--accent-teal)" : "var(--text-secondary)",
          transition: "all 0.15s",
        }}
      >
        <Bell size={15} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--down)",
              border: "1.5px solid var(--bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 360,
            maxHeight: 480,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
          }}
        >
          {/* Panel header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={14} color="var(--accent-teal)" />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Notifications
              </span>
              {unread > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 20,
                    background: "var(--down-bg)",
                    color: "var(--down)",
                    border: "1px solid var(--down-border)",
                  }}
                >
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "var(--accent-teal)",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                Loading notifications...
              </div>
            )}

            {!loading && notifs.length === 0 && (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <Bell
                  size={28}
                  color="var(--text-muted)"
                  style={{ margin: "0 auto 10px" }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  No notifications yet
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Order confirmations and price alerts will appear here
                </p>
              </div>
            )}

            {!loading &&
              notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: n.read
                      ? "transparent"
                      : "var(--accent-teal-bg)",
                    cursor: "pointer",
                    transition: "background 0.12s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (n.read)
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = n.read
                      ? "transparent"
                      : "var(--accent-teal-bg)";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        n.type === "order"
                          ? (n as OrderNotif).orderType === "BUY"
                            ? "var(--up-bg)"
                            : "var(--down-bg)"
                          : (n as PriceNotif).direction === "up"
                            ? "var(--up-bg)"
                            : "var(--down-bg)",
                    }}
                  >
                    {n.type === "order" ? (
                      <ShoppingBag
                        size={15}
                        color={
                          (n as OrderNotif).orderType === "BUY"
                            ? "var(--up)"
                            : "var(--down)"
                        }
                      />
                    ) : (n as PriceNotif).direction === "up" ? (
                      <TrendingUp size={15} color="var(--up)" />
                    ) : (
                      <TrendingDown size={15} color="var(--down)" />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {n.title}
                      </span>
                      {!n.read && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent-teal)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {n.body}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 5,
                      }}
                    >
                      {timeAgo(n.time)}
                    </p>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: 2,
                      flexShrink: 0,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--down)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-muted)";
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-surface)",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => setNotifs([])}
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
