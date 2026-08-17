const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const walletRoutes = require("./routes/walletRoutes");
const aiAdvisorRoutes = require("./routes/aiAdvisorRoutes");

const app = express();

app.use(cors());

/*
========================================
 JSON BODY LIMIT
========================================
 Default express.json() limit is 100kb, which is too small
 for profile avatar uploads sent as base64 data URLs (base64
 encoding adds ~33% overhead on top of the original image size,
 so even a modest 200kb photo becomes a ~270kb string).
 10mb gives comfortable headroom for a profile picture while
 still being a sane upper bound — not unlimited.
========================================
*/

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Twin Trade API Running");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/ai-advisor", aiAdvisorRoutes);

module.exports = app;