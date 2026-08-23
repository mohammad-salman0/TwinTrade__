/*
=====================================
 LIVE PRICE WORKER
=====================================

The ONLY process in this system that talks to Yahoo Finance.

Runs continuously as a Render Background Worker. Every 60
seconds it:

  1. Reads the full symbol list from the Stock collection
  2. Fetches fresh quotes from Yahoo (via finnhubService.js,
     unchanged)
  3. Writes the results to Upstash Redis as one JSON blob

livePriceService.js (used by the web service on both Render
and Vercel) only ever reads from Redis — it never calls Yahoo
directly, which is what eliminates the crumb/429 errors.

=====================================
 RESILIENCE NOTES
=====================================

 - Each symbol CHUNK is fetched and saved independently, so
   one bad chunk doesn't discard results already fetched this
   cycle.
 - A failed cycle never crashes the process — it logs and
   waits for the next interval.
 - Global handlers catch anything that slips past the local
   try/catches, so an unexpected error can't silently kill
   the worker (which would otherwise sit "dead" on Render
   until someone notices prices have stopped updating).
=====================================
*/

require("dotenv").config();

const connectDB = require("./config/db");
const redis = require("./config/redisClient");
const Stock = require("./models/Stock");
const { getLivePricesBatch } = require("./services/finnhubService");

/*
=====================================
 CONFIG
=====================================
*/

const REFRESH_INTERVAL_MS = 60 * 1000;
const CHUNK_SIZE = 50;
const CHUNK_DELAY_MS = 1500;

const PRICES_KEY = "live-prices";
const UPDATED_AT_KEY = "live-prices:updated-at";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
=====================================
 GLOBAL CRASH GUARDS
=====================================

If something throws outside the try/catches below (a bug in
a dependency, a malformed response, etc.), Node's default
behavior is to crash the whole process. On a Background
Worker that means prices silently stop updating until Render
restarts it (or worse, it keeps restarting in a crash loop).

Log and keep running instead — the next refresh cycle gets a
clean attempt regardless of what went wrong in a previous one.
=====================================
*/

process.on("uncaughtException", (error) => {
  console.error("Worker: uncaught exception (continuing):", error.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Worker: unhandled rejection (continuing):", reason);
});

/*
=====================================
 FETCH ONE CYCLE
=====================================

Fetches all symbols in chunks. Each chunk's success is saved
independently, so a failure partway through still preserves
everything fetched before it.
=====================================
*/

async function runOneCycle() {
  const stocks = await Stock.find({}, "symbol");
  const symbols = stocks.map((s) => s.symbol);

  if (!symbols.length) {
    console.warn(
      "Worker: no symbols found in Stock collection, skipping cycle",
    );
    return;
  }

  console.log(`Worker: refreshing ${symbols.length} symbols from Yahoo`);

  const allResults = [];
  let failedChunks = 0;

  for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
    const chunk = symbols.slice(i, i + CHUNK_SIZE);

    try {
      const results = await getLivePricesBatch(chunk);
      allResults.push(...results);
    } catch (error) {
      failedChunks += 1;
      console.error(
        `Worker: chunk ${i / CHUNK_SIZE + 1} failed (${chunk.length} symbols):`,
        error.message,
      );
      // Keep going — later chunks still get a chance.
    }

    if (i + CHUNK_SIZE < symbols.length) {
      await sleep(CHUNK_DELAY_MS);
    }
  }

  if (allResults.length === 0) {
    console.warn(
      "Worker: entire cycle returned 0 prices, keeping previous Redis cache",
    );
    return;
  }

  try {
    await redis.set(PRICES_KEY, JSON.stringify(allResults));
    await redis.set(UPDATED_AT_KEY, Date.now());

    console.log(
      `Worker: wrote ${allResults.length}/${symbols.length} prices to Redis` +
        (failedChunks ? ` (${failedChunks} chunk(s) failed)` : ""),
    );
  } catch (error) {
    console.error("Worker: failed to write to Redis:", error.message);
    // Don't throw — next cycle will try again in 60s regardless.
  }
}

/*
=====================================
 MAIN LOOP
=====================================

Each cycle is independently wrapped, so a thrown error here
(one that escaped runOneCycle's own handling) still can't end
the loop — it's logged and the loop waits for the next
interval instead.
=====================================
*/

async function refreshLoop() {
  while (true) {
    try {
      await runOneCycle();
    } catch (error) {
      console.error(
        "Worker: refresh cycle failed unexpectedly:",
        error.message,
      );
    }

    await sleep(REFRESH_INTERVAL_MS);
  }
}

/*
=====================================
 STARTUP
=====================================
*/

connectDB()
  .then(() => {
    console.log("Worker connected to MongoDB, starting refresh loop");
    refreshLoop();
  })
  .catch((error) => {
    // connectDB() already calls process.exit(1) internally on
    // failure (see config/db.js), so this catch is a safety
    // net only — Render will restart the service either way.
    console.error("Worker: failed to start:", error.message);
  });

// require("dotenv").config();

// const connectDB = require("./config/db");
// const redis = require("./config/redisClient");
// const Stock = require("./models/Stock");
// const { getLivePricesBatch } = require("./services/finnhubService");

// const REFRESH_INTERVAL_MS = 60 * 1000;
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function refreshLoop() {
//   while (true) {
//     try {
//       const stocks = await Stock.find({}, "symbol");
//       const symbols = stocks.map((s) => s.symbol);

//       console.log(`Worker: refreshing ${symbols.length} symbols from Yahoo`);

//       // Yahoo's quoteCombine already batches internally (see finnhubService.js),
//       // but with ~500 symbols, chunk to stay conservative
//       const CHUNK_SIZE = 50;
//       const allResults = [];

//       for (let i = 0; i < symbols.length; i += CHUNK_SIZE) {
//         const chunk = symbols.slice(i, i + CHUNK_SIZE);
//         const results = await getLivePricesBatch(chunk);
//         allResults.push(...results);

//         if (i + CHUNK_SIZE < symbols.length) {
//           await sleep(1500); // matches your existing inter-batch delay
//         }
//       }

//       if (allResults.length > 0) {
//         await redis.set("live-prices", JSON.stringify(allResults));
//         await redis.set("live-prices:updated-at", Date.now());
//         console.log(`Worker: wrote ${allResults.length} prices to Redis`);
//       } else {
//         console.warn(
//           "Worker: Yahoo returned 0 prices this cycle, keeping old cache",
//         );
//       }
//     } catch (error) {
//       console.error("Worker: refresh cycle failed:", error.message);
//     }

//     await sleep(REFRESH_INTERVAL_MS);
//   }
// }

// connectDB().then(() => {
//   console.log("Worker connected to MongoDB, starting refresh loop");
//   refreshLoop();
// });
