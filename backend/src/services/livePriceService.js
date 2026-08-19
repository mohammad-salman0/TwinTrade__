// const { getLivePrice } = require("./finnhubService");

// /*
// =====================================
//  IN-MEMORY PRICE CACHE
// =====================================
//  Live quotes for ~500 NIFTY stocks are too slow to fetch
//  fresh on every page load. We cache each symbol's quote
//  for CACHE_TTL_MS and reuse it across requests in that
//  window, instead of re-hitting Yahoo Finance every time.

//  For production with multiple server instances, move this
//  to Redis so the cache is shared across processes — an
//  in-memory Map only helps within a single Node process.
// =====================================
// */

// const priceCache = new Map(); // symbol -> { price, change, fetchedAt }

// const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// /*
// =====================================
//  BATCH SIZE FOR PARALLEL FETCHES
// =====================================
//  Fetching 500 quotes fully in parallel risks Yahoo Finance
//  rate limiting / connection errors. We chunk requests into
//  batches and fetch each batch in parallel, with a short
//  pause between batches.
// =====================================
// */

// const BATCH_SIZE = 25;
// const BATCH_DELAY_MS = 150;

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /*
// =====================================
//  GET LIVE PRICES
// =====================================
// */

// exports.getLivePrices = async (symbols = []) => {
//   try {
//     /*
//    =====================================
//    REMOVE DUPLICATES
//    =====================================
//    */

//     const uniqueSymbols = [...new Set(symbols)];

//     const now = Date.now();

//     /*
//    =====================================
//    SPLIT: CACHED vs NEEDS FETCH
//    =====================================
//    */

//     const cached = [];
//     const toFetch = [];

//     for (const symbol of uniqueSymbols) {
//       const entry = priceCache.get(symbol);

//       if (entry && now - entry.fetchedAt < CACHE_TTL_MS) {
//         cached.push({
//           symbol,

//           price: entry.price,

//           change: entry.change,
//         });
//       } else {
//         toFetch.push(symbol);
//       }
//     }

//     /*
//    =====================================
//    FETCH MISSING SYMBOLS IN BATCHES
//    =====================================
//    */

//     const freshResults = [];

//     for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
//       const batch = toFetch.slice(i, i + BATCH_SIZE);

//       const batchResults = await Promise.all(
//         batch.map(async (symbol) => {
//           try {
//             const liveData = await getLivePrice(symbol);

//             const result = {
//               symbol,

//               price: liveData?.price != null ? Number(liveData.price) : null,

//               change: liveData?.change != null ? Number(liveData.change) : null,
//             };

//             /*
//          =====================================
//          UPDATE CACHE
//          =====================================
//          */

//             priceCache.set(symbol, {
//               price: result.price,

//               change: result.change,

//               fetchedAt: Date.now(),
//             });

//             return result;
//           } catch (error) {
//             console.log(`Failed: ${symbol}`);

//             return {
//               symbol,

//               price: null,

//               change: null,
//             };
//           }
//         }),
//       );

//       freshResults.push(...batchResults);

//       /*
//     =====================================
//     SMALL DELAY BETWEEN BATCHES
//     =====================================
//     */

//       if (i + BATCH_SIZE < toFetch.length) {
//         await sleep(BATCH_DELAY_MS);
//       }
//     }

//     console.log(
//       `Prices: ${cached.length} from cache, ${freshResults.length} freshly fetched`,
//     );

//     /*
//    =====================================
//    RETURN COMBINED RESULTS
//    =====================================
//    */

//     return [...cached, ...freshResults];
//   } catch (error) {
//     console.log(error);

//     return [];
//   }
// };

//fixing live price issue
// const { getLivePricesBatch } = require("./finnhubService");

// attempt 2 of using twelve data api
// const { getLivePricesBatch } = require("./finnhubService");

/*
=====================================
 IN-MEMORY PRICE CACHE
=====================================
*/

/*
symbol -> {
  price,
  change,
  fetchedAt
}
*/

// const priceCache = new Map();

// /*
// =====================================
//  CACHE SETTINGS
// =====================================
// */

// /*
// Keep successful prices for 10 minutes.
// */

// const CACHE_TTL_MS = 10 * 60 * 1000;

// /*
// Keep stale prices for up to 30 minutes
// if Twelve Data temporarily fails.
// */

// const STALE_CACHE_MS = 30 * 60 * 1000;

// /*
// =====================================
//  TWELVE DATA LIMIT
// =====================================
// */

// /*
// Basic plan:

// 8 credits / minute

// Therefore we only fetch 8 symbols
// during each API window.
// */

// const BATCH_SIZE = 8;

// /*
// Wait slightly more than one minute
// between Twelve Data batches.

// 61 seconds gives the API window
// time to reset.
// */

// const BATCH_INTERVAL_MS = 61 * 1000;

// /*
// =====================================
//  REFRESH STATE
// =====================================
// */

// /*
// Prevents multiple frontend requests
// from starting multiple refresh jobs.
// */

// let refreshRunning = false;

// /*
// =====================================
//  SLEEP
// =====================================
// */

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /*
// =====================================
//  GET LIVE PRICES
// =====================================
// */

// exports.getLivePrices = async (symbols = []) => {
//   /*
//     =====================================
//     REMOVE DUPLICATES
//     =====================================
//     */

//   const uniqueSymbols = [...new Set(symbols)];

//   if (!uniqueSymbols.length) {
//     return [];
//   }

//   const now = Date.now();

//   const results = [];

//   const needsRefresh = [];

//   /*
//     =====================================
//     CHECK CACHE
//     =====================================
//     */

//   for (const symbol of uniqueSymbols) {
//     const cached = priceCache.get(symbol);

//     /*
//       -----------------------------------
//       FRESH CACHE
//       -----------------------------------
//       */

//     if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
//       results.push({
//         symbol,

//         price: cached.price,

//         change: cached.change,
//       });

//       continue;
//     }

//     /*
//       -----------------------------------
//       NEEDS REFRESH
//       -----------------------------------
//       */

//     needsRefresh.push(symbol);
//   }

//   /*
//     =====================================
//     NO REFRESH NEEDED
//     =====================================
//     */

//   if (!needsRefresh.length) {
//     console.log(`Prices: ${results.length} from cache`);

//     return results;
//   }

//   /*
//     =====================================
//     PREVENT MULTIPLE REFRESH JOBS
//     =====================================
//     */

//   if (!refreshRunning) {
//     /*
//       Start refresh in background.

//       We intentionally DO NOT wait for
//       all 25 symbols.

//       This prevents the frontend from
//       waiting for several minutes.
//       */

//     refreshPrices(needsRefresh);
//   }

//   /*
//     =====================================
//     RETURN EXISTING CACHE IMMEDIATELY
//     =====================================
//     */

//   for (const symbol of needsRefresh) {
//     /*
//       Don't duplicate something already
//       returned above.
//       */

//     if (results.some((item) => item.symbol === symbol)) {
//       continue;
//     }

//     const cached = priceCache.get(symbol);

//     /*
//       -----------------------------------
//       STALE CACHE
//       -----------------------------------
//       */

//     if (cached && now - cached.fetchedAt < STALE_CACHE_MS) {
//       results.push({
//         symbol,

//         price: cached.price,

//         change: cached.change,
//       });
//     } else {
//       /*
//         No price available yet.
//         */

//       results.push({
//         symbol,

//         price: null,

//         change: null,
//       });
//     }
//   }

//   console.log(
//     `Prices: ${
//       results.filter((item) => item.price != null).length
//     } available, ${
//       results.filter((item) => item.price == null).length
//     } waiting`,
//   );

//   return results;
// };

// /*
// =====================================
//  BACKGROUND REFRESH
// =====================================
// */

// async function refreshPrices(symbols) {
//   /*
//   Prevent another request from
//   starting another refresh job.
//   */

//   if (refreshRunning) {
//     return;
//   }

//   refreshRunning = true;

//   try {
//     /*
//     ===================================
//     REMOVE SYMBOLS THAT WERE JUST
//     REFRESHED BY ANOTHER REQUEST
//     ===================================
//     */

//     const now = Date.now();

//     const symbolsToFetch = symbols.filter((symbol) => {
//       const cached = priceCache.get(symbol);

//       return !cached || now - cached.fetchedAt >= CACHE_TTL_MS;
//     });

//     if (!symbolsToFetch.length) {
//       return;
//     }

//     /*
//     ===================================
//     PROCESS 8 SYMBOLS AT A TIME
//     ===================================
//     */

//     for (let i = 0; i < symbolsToFetch.length; i += BATCH_SIZE) {
//       const batch = symbolsToFetch.slice(i, i + BATCH_SIZE);

//       console.log(`Fetching Twelve Data batch: ${batch.length} symbols`);

//       /*
//       =================================
//       FETCH BATCH
//       =================================
//       */

//       const freshPrices = await getLivePricesBatch(batch);

//       /*
//       =================================
//       UPDATE CACHE
//       =================================
//       */

//       for (const item of freshPrices) {
//         if (item.price == null) {
//           continue;
//         }

//         priceCache.set(item.symbol, {
//           price: item.price,

//           change: item.change,

//           fetchedAt: Date.now(),
//         });
//       }

//       console.log(`Twelve Data batch complete: ${freshPrices.length} prices`);

//       /*
//       =================================
//       WAIT BEFORE NEXT BATCH
//       =================================

//       Don't exceed the 8 credits/minute
//       allowance.
//       */

//       if (i + BATCH_SIZE < symbolsToFetch.length) {
//         console.log("Waiting for Twelve Data rate limit window...");

//         await sleep(BATCH_INTERVAL_MS);
//       }
//     }
//   } catch (error) {
//     console.error("Background live-price refresh failed:", error.message);
//   } finally {
//     refreshRunning = false;
//   }
// }

// TRYING TO MAKE THINGS BETTER

const { getLivePricesBatch } = require("./finnhubService");

/*
=====================================
 PRICE CACHE
=====================================

symbol -> {
  price,
  change,
  fetchedAt,
  marketState
}
=====================================
*/

const priceCache = new Map();

/*
=====================================
 CACHE CONFIGURATION
=====================================
*/

/*
Fresh prices are used for 60 seconds.
*/

const CACHE_TTL_MS = 60 * 1000;

/*
If Yahoo temporarily fails, we can
continue displaying an older price for
up to 10 minutes.
*/

const STALE_CACHE_TTL_MS = 10 * 60 * 1000;

/*
=====================================
 REFRESH CONTROL
=====================================
*/

/*
Only one Yahoo refresh is allowed
at a time.

This is VERY important on Render
because multiple browser requests
could otherwise start multiple Yahoo
requests simultaneously.
*/

let refreshPromise = null;

/*
=====================================
 HELPER
=====================================
*/

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
=====================================
 GET LIVE PRICES
=====================================
*/

exports.getLivePrices = async (symbols = []) => {
  if (!symbols.length) {
    return [];
  }

  /*
    ---------------------------------
    REMOVE DUPLICATES
    ---------------------------------
    */

  const uniqueSymbols = [...new Set(symbols)];

  const now = Date.now();

  const results = [];

  const symbolsNeedingRefresh = [];

  /*
    =================================
    CHECK CACHE
    =================================
    */

  for (const symbol of uniqueSymbols) {
    const cached = priceCache.get(symbol);

    /*
      ---------------------------------
      FRESH CACHE
      ---------------------------------
      */

    if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
      results.push({
        symbol,

        price: cached.price,

        change: cached.change,

        marketState: cached.marketState,
      });

      continue;
    }

    /*
      ---------------------------------
      CACHE EXPIRED
      ---------------------------------
      */

    symbolsNeedingRefresh.push(symbol);
  }

  /*
    =================================
    EVERYTHING WAS CACHED
    =================================
    */

  if (symbolsNeedingRefresh.length === 0) {
    console.log(`Prices: ${results.length} from cache`);

    return results;
  }

  /*
    =================================
    RETURN STALE CACHE WHILE
    BACKGROUND REFRESH RUNS
    =================================
    */

  for (const symbol of symbolsNeedingRefresh) {
    const cached = priceCache.get(symbol);

    if (cached && now - cached.fetchedAt < STALE_CACHE_TTL_MS) {
      results.push({
        symbol,

        price: cached.price,

        change: cached.change,

        marketState: cached.marketState,
      });
    } else {
      /*
        No cached price yet.
        */

      results.push({
        symbol,

        price: null,

        change: null,

        marketState: null,
      });
    }
  }

  /*
    =================================
    START BACKGROUND REFRESH
    =================================
    */

  startBackgroundRefresh(symbolsNeedingRefresh);

  console.log(
    `Prices: ${
      results.filter((item) => item.price != null).length
    } available, ${
      results.filter((item) => item.price == null).length
    } waiting`,
  );

  return results;
};

/*
=====================================
 BACKGROUND REFRESH
=====================================
*/

function startBackgroundRefresh(symbols) {
  /*
  If a refresh is already running,
  DO NOT start another one.
  */

  if (refreshPromise) {
    return;
  }

  refreshPromise = refreshPrices(symbols)
    .catch((error) => {
      console.error("Yahoo background refresh failed:", error.message);
    })
    .finally(() => {
      refreshPromise = null;
    });
}

/*
=====================================
 ACTUAL YAHOO REFRESH
=====================================
*/

async function refreshPrices(symbols) {
  if (!symbols.length) {
    return;
  }

  /*
  ---------------------------------
  RE-CHECK CACHE
  ---------------------------------

  Another request might have refreshed
  some symbols while this job was
  waiting.
  */

  const now = Date.now();

  const symbolsToFetch = symbols.filter((symbol) => {
    const cached = priceCache.get(symbol);

    return !cached || now - cached.fetchedAt >= CACHE_TTL_MS;
  });

  if (!symbolsToFetch.length) {
    return;
  }

  /*
  =================================
  LIMIT BATCH SIZE
  =================================

  Keep this at 25 because your Stocks
  page currently displays 25 stocks.

  Yahoo has already successfully
  returned 25 quotes from your Render
  backend.
  */

  const BATCH_SIZE = 25;

  for (let i = 0; i < symbolsToFetch.length; i += BATCH_SIZE) {
    const batch = symbolsToFetch.slice(i, i + BATCH_SIZE);

    console.log(`Fetching ${batch.length} live prices from Yahoo`);

    /*
    =================================
    YAHOO REQUEST
    =================================
    */

    const freshPrices = await getLivePricesBatch(batch);

    /*
    =================================
    SAVE SUCCESSFUL PRICES
    =================================
    */

    for (const item of freshPrices) {
      if (item.price == null) {
        continue;
      }

      priceCache.set(item.symbol, {
        price: item.price,

        change: item.change,

        marketState: item.marketState,

        fetchedAt: Date.now(),
      });
    }

    console.log(`Prices: ${freshPrices.length} available`);

    /*
    =================================
    SMALL DELAY BETWEEN BATCHES
    =================================
    */

    if (i + BATCH_SIZE < symbolsToFetch.length) {
      await sleep(1500);
    }
  }
}

/*
=====================================
 OPTIONAL CACHE CLEAR
=====================================

Useful if you ever want to manually
clear prices without restarting
Node.
=====================================
*/

exports.clearPriceCache = () => {
  priceCache.clear();

  console.log("Yahoo price cache cleared");
};
