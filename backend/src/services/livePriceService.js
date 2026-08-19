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
const { getLivePricesBatch } = require("./finnhubService");
/*
=====================================
 PRICE CACHE
=====================================
*/

const priceCache = new Map();

/*
 Fresh data for 2 minutes.
*/

const CACHE_TTL_MS = 2 * 60 * 1000;

/*
 Keep stale data for up to 15 minutes
 if Yahoo temporarily fails.
*/

const STALE_CACHE_MS = 15 * 60 * 1000;

/*
=====================================
 GET LIVE PRICES
=====================================
*/

exports.getLivePrices = async (symbols = []) => {
  const uniqueSymbols = [...new Set(symbols)];

  if (!uniqueSymbols.length) {
    return [];
  }

  const now = Date.now();

  const results = [];

  const toFetch = [];

  /*
  =====================================
  CHECK CACHE
  =====================================
  */

  for (const symbol of uniqueSymbols) {
    const cached = priceCache.get(symbol);

    if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
      results.push({
        symbol,

        price: cached.price,

        change: cached.change,
      });
    } else {
      toFetch.push(symbol);
    }
  }

  /*
  =====================================
  EVERYTHING WAS CACHED
  =====================================
  */

  if (!toFetch.length) {
    console.log(`Prices: ${results.length} from cache`);

    return results;
  }

  /*
  =====================================
  FETCH ONE BATCH
  =====================================
  */

  try {
    console.log(`Fetching ${toFetch.length} live prices from Yahoo`);

    const freshPrices = await getLivePricesBatch(toFetch);

    /*
    =====================================
    SAVE SUCCESSFUL RESULTS
    =====================================
    */

    for (const item of freshPrices) {
      if (item.price == null) {
        continue;
      }

      priceCache.set(item.symbol, {
        price: item.price,

        change: item.change,

        fetchedAt: Date.now(),
      });

      results.push(item);
    }

    /*
    =====================================
    HANDLE SYMBOLS THAT WEREN'T RETURNED
    =====================================
    */

    for (const symbol of toFetch) {
      const alreadyReturned = results.some((item) => item.symbol === symbol);

      if (alreadyReturned) {
        continue;
      }

      const cached = priceCache.get(symbol);

      /*
      Use previous data if Yahoo
      didn't return this symbol.
      */

      if (cached && Date.now() - cached.fetchedAt < STALE_CACHE_MS) {
        console.log(`Using stale cache for ${symbol}`);

        results.push({
          symbol,

          price: cached.price,

          change: cached.change,
        });
      } else {
        results.push({
          symbol,

          price: null,

          change: null,
        });
      }
    }
  } catch (error) {
    console.error("Live price batch failed:", error.message);

    /*
    =====================================
    FALLBACK TO CACHE
    =====================================
    */

    for (const symbol of toFetch) {
      const cached = priceCache.get(symbol);

      if (cached && Date.now() - cached.fetchedAt < STALE_CACHE_MS) {
        results.push({
          symbol,

          price: cached.price,

          change: cached.change,
        });
      } else {
        results.push({
          symbol,

          price: null,

          change: null,
        });
      }
    }
  }

  console.log(
    `Prices: ${
      results.filter((item) => item.price != null).length
    } available, ${
      results.filter((item) => item.price == null).length
    } unavailable`,
  );

  return results;
};
