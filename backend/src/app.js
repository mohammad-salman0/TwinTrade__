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

//adding test route for live price on render
app.get("/api/test-yahoo", async (req, res) => {
  try {
    const YahooFinance = require("yahoo-finance2").default;

    const yahooFinance = new YahooFinance();

    const result = await yahooFinance.quote("RELIANCE.NS");

    res.json(result);
  } catch (error) {
    console.error("Yahoo test failed:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});
// adding test route for twelve data api
// app.get("/api/test-twelve", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://api.twelvedata.com/quote?symbol=RELIANCE:NSE&apikey=${process.env.TWELVE_DATA_API_KEY}`,
//     );

//     const data = await response.json();

//     console.log("Twelve Data test:", data);

//     res.json(data);
//   } catch (error) {
//     console.error("Twelve Data test failed:", error.message);

//     res.status(500).json({
//       error: error.message,
//     });
//   }
// });

// ========================================
// FINNHUB TEST ROUTE
// ========================================

// app.get("/api/test-finnhub", async (req, res) => {
//   try {
//     const token = process.env.FINNHUB_API_KEY;

//     if (!token) {
//       return res.status(500).json({
//         error: "FINNHUB_API_KEY is missing",
//       });
//     }

//     const url =
//       `https://finnhub.io/api/v1/quote` +
//       `?symbol=RELIANCE.NS` +
//       `&token=${token}`;

//     const response = await fetch(url);

//     const data = await response.json();

//     console.log("Finnhub status:", response.status);

//     console.log("Finnhub response:", data);

//     res.status(response.status).json(data);
//   } catch (error) {
//     console.error("Finnhub test failed:", error.message);

//     res.status(500).json({
//       error: error.message,
//     });
//   }
// });

module.exports = app;
