// const YahooFinance = require("yahoo-finance2").default;
// const yahooFinance = new YahooFinance();

// /*
// =====================================
//  LIVE PRICE SERVICE (Yahoo Finance)
// =====================================
//  Replaces the old mock implementation. Uses the same
//  yahoo-finance2 library already used for candlestick
//  history in aiPredictionService.js, so both live price
//  and chart data now come from the same real source.
// */

// exports.getLivePrice =
//  async (symbol) => {

//   try {

//    const quote =
//     await yahooFinance.quote(

//      `${symbol}.NS`

//     )

//    /*
//    =====================================
//    NO QUOTE RETURNED
//    =====================================
//    */

//    if (!quote) {

//     return {

//      price: null,

//      change: null,

//     }

//    }

//    /*
//    =====================================
//    PRICE
//    =====================================
//    */

//    const price =

//     quote.regularMarketPrice != null

//      ? Number(
//         quote.regularMarketPrice.toFixed(2)
//        )

//      : null

//    /*
//    =====================================
//    CHANGE %
//    =====================================
//    */

//    const change =

//     quote.regularMarketChangePercent != null

//      ? Number(
//         quote.regularMarketChangePercent.toFixed(2)
//        )

//      : null

//    return {

//     price,

//     change,

//    }

//   } catch (error) {

//    console.log(

//     `Yahoo Finance quote failed for ${symbol}:`,
//     error.message

//    )

//    return {

//     price: null,

//     change: null,

//    }

//   }

// }

// trying to fix deployment live price issue

// const YahooFinance = require("yahoo-finance2").default;

// const yahooFinance = new YahooFinance({
//   queue: {
//     concurrency: 1,
//     interval: 500,
//   },
// });

// /*
// =====================================
//  GET LIVE PRICES FOR MULTIPLE SYMBOLS
// =====================================

// Uses Yahoo's quoteCombine() so a page of
// stocks does not create 25 independent
// quote requests.
// */

// exports.getLivePricesBatch = async (symbols = []) => {
//   if (!symbols.length) {
//     return [];
//   }

//   const yahooSymbols = [...new Set(symbols.map((symbol) => `${symbol}.NS`))];

//   try {
//     const quotes = await yahooFinance.quoteCombine(yahooSymbols.join(","));

//     return quotes.map((quote) => ({
//       symbol: quote.symbol.replace(/\.NS$/i, ""),
//       price:
//         quote.regularMarketPrice != null
//           ? Number(quote.regularMarketPrice.toFixed(2))
//           : null,
//       change:
//         quote.regularMarketChangePercent != null
//           ? Number(quote.regularMarketChangePercent.toFixed(2))
//           : null,
//     }));
//   } catch (error) {
//     console.error("Yahoo batch quote failed:", error.message);

//     return [];
//   }
// };

// /*
// =====================================
//  SINGLE STOCK PRICE
// =====================================
// */

// exports.getLivePrice = async (symbol) => {
//   try {
//     const quote = await yahooFinance.quote(`${symbol}.NS`);

//     if (!quote) {
//       return {
//         price: null,
//         change: null,
//       };
//     }

//     return {
//       price:
//         quote.regularMarketPrice != null
//           ? Number(quote.regularMarketPrice.toFixed(2))
//           : null,

//       change:
//         quote.regularMarketChangePercent != null
//           ? Number(quote.regularMarketChangePercent.toFixed(2))
//           : null,
//     };
//   } catch (error) {
//     console.error(`Yahoo quote failed for ${symbol}:`, error.message);

//     return {
//       price: null,
//       change: null,
//     };
//   }
// };

//attempt 2  //woking but yahoo not responding

// const YahooFinance = require("yahoo-finance2").default;

// /*
// =====================================
//  YAHOO FINANCE INSTANCE
// =====================================
// */

// const yahooFinance = new YahooFinance({
//   suppressNotices: ["yahooSurvey"],
// });

// /*
// =====================================
//  SLEEP HELPER
// =====================================
// */

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /*
// =====================================
//  SINGLE LIVE PRICE
//  Used by other parts of project
// =====================================
// */

// exports.getLivePrice = async (symbol) => {
//   const yahooSymbol = `${symbol}.NS`;

//   for (let attempt = 1; attempt <= 2; attempt++) {
//     try {
//       const quote = await yahooFinance.quote(yahooSymbol);

//       if (!quote) {
//         throw new Error("No quote returned");
//       }

//       return {
//         price:
//           quote.regularMarketPrice != null
//             ? Number(quote.regularMarketPrice.toFixed(2))
//             : null,

//         change:
//           quote.regularMarketChangePercent != null
//             ? Number(quote.regularMarketChangePercent.toFixed(2))
//             : null,
//       };
//     } catch (error) {
//       console.log(
//         `Yahoo attempt ${attempt} failed for ${symbol}:`,
//         error.message,
//       );

//       if (attempt < 2) {
//         await sleep(1000);
//       }
//     }
//   }

//   return {
//     price: null,
//     change: null,
//   };
// };

// /*
// =====================================
//  BATCH LIVE PRICES
//  Used by Stock Dashboard
// =====================================
// */

// exports.getLivePricesBatch = async (symbols = []) => {
//   if (!symbols.length) return [];

//   const yahooSymbols = [...new Set(symbols.map((symbol) => `${symbol}.NS`))];

//   for (let attempt = 1; attempt <= 2; attempt++) {
//     try {
//       console.log(
//         `Yahoo batch request attempt ${attempt} for ${yahooSymbols.length} symbols`,
//       );

//       const response = await yahooFinance.quote(yahooSymbols);

//       const quotes = Array.isArray(response) ? response : [response];

//       const results = quotes.map((quote) => ({
//         symbol: quote.symbol.replace(".NS", ""),

//         price:
//           quote.regularMarketPrice != null
//             ? Number(quote.regularMarketPrice.toFixed(2))
//             : null,

//         change:
//           quote.regularMarketChangePercent != null
//             ? Number(quote.regularMarketChangePercent.toFixed(2))
//             : null,
//       }));

//       console.log(`Yahoo returned ${results.length} quotes successfully`);

//       return results;
//     } catch (error) {
//       console.log(`Yahoo batch attempt ${attempt} failed:`, error.message);

//       if (attempt < 2) {
//         await sleep(1500);
//       }
//     }
//   }

//   console.log("Yahoo batch completely failed");

//   return [];
// };

// switching to twelve data api
/*
=====================================
 TWELVE DATA LIVE PRICE SERVICE
=====================================

Yahoo Finance was removed from the live
price path because Render was receiving
HTTP 429 crumb errors.

Twelve Data is now used for live quotes.

Expected symbol format:

360ONE:NSE
ABB:NSE
RELIANCE:NSE

=====================================
*/

// const TWELVE_DATA_API = "https://api.twelvedata.com";

// const API_KEY = process.env.TWELVE_DATA_API_KEY;

// /*
// =====================================
//  VALIDATE API KEY
// =====================================
// */

// if (!API_KEY) {
//   console.warn("WARNING: TWELVE_DATA_API_KEY is not configured");
// }

// /*
// =====================================
//  SLEEP
// =====================================
// */

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
=====================================
 CONVERT SYMBOL
=====================================

// Our database uses:

// RELIANCE
// ABB
// 360ONE

// Twelve Data uses:

// RELIANCE:NSE
// ABB:NSE
// 360ONE:NSE

// =====================================
// */

// const toTwelveDataSymbol = (symbol) => {
//   return `${symbol}:NSE`;
// };

// /*
// =====================================
//  SINGLE LIVE PRICE
// =====================================
// */

// //attempt 2 on using twelve data api key

// /*
// =====================================
//  TWELVE DATA LIVE PRICE SERVICE
// =====================================

// Yahoo Finance was removed from the
// LIVE PRICE path because Render was
// receiving Yahoo HTTP 429 errors.

// Twelve Data is now used for live
// NSE quotes.

// Database symbol:
//     RELIANCE

// Twelve Data symbol:
//     RELIANCE:NSE
// =====================================
// */

// const TWELVE_DATA_API = "https://api.twelvedata.com";

// const API_KEY = process.env.TWELVE_DATA_API_KEY;

// /*
// =====================================
//  CONFIGURATION
// =====================================
// */

// /*
// Twelve Data Basic currently allows
// 8 credits/minute.

// We therefore never request more
// than 8 symbols in one batch.
// */

// const MAX_BATCH_SIZE = 8;

// /*
// =====================================
//  SINGLE STOCK
// =====================================
// */

// exports.getLivePrice = async (symbol) => {
//   if (!API_KEY) {
//     console.error("TWELVE_DATA_API_KEY is missing");

//     return {
//       price: null,
//       change: null,
//     };
//   }

//   const twelveSymbol = `${symbol}:NSE`;

//   try {
//     const url = new URL(`${TWELVE_DATA_API}/quote`);

//     url.searchParams.set("symbol", twelveSymbol);

//     url.searchParams.set("apikey", API_KEY);

//     const response = await fetch(url);

//     const data = await response.json();

//     /*
//     =====================================
//     API ERROR
//     =====================================
//     */

//     if (!response.ok || data.status === "error") {
//       console.error(
//         `Twelve Data failed for ${symbol}:`,
//         data.message || response.statusText,
//       );

//       return {
//         price: null,
//         change: null,
//       };
//     }

//     /*
//     =====================================
//     SUCCESS
//     =====================================
//     */

//     return {
//       price: data.close != null ? Number(data.close) : null,

//       change: data.percent_change != null ? Number(data.percent_change) : null,
//     };
//   } catch (error) {
//     console.error(`Twelve Data request failed for ${symbol}:`, error.message);

//     return {
//       price: null,
//       change: null,
//     };
//   }
// };

// /*
// =====================================
//  BATCH LIVE PRICES
// =====================================

// IMPORTANT:

// This function accepts any number of
// symbols but internally processes a
// maximum of 8 symbols per request.

// The livePriceService controls which
// symbols are sent to this function.
// =====================================
// */

// exports.getLivePricesBatch = async (symbols = []) => {
//   if (!symbols.length) {
//     return [];
//   }

//   if (!API_KEY) {
//     console.error("TWELVE_DATA_API_KEY is missing");

//     return [];
//   }

//   /*
//     =====================================
//     LIMIT BATCH SIZE
//     =====================================
//     */

//   const batch = symbols.slice(0, MAX_BATCH_SIZE);

//   /*
//     =====================================
//     REMOVE DUPLICATES
//     =====================================
//     */

//   const uniqueSymbols = [...new Set(batch)];

//   /*
//     =====================================
//     CREATE TWELVE DATA SYMBOLS
//     =====================================
//     */

//   const twelveSymbols = uniqueSymbols.map((symbol) => `${symbol}:NSE`);

//   console.log(`Twelve Data request for ${twelveSymbols.length} symbols`);

//   try {
//     const url = new URL(`${TWELVE_DATA_API}/quote`);

//     /*
//       =====================================
//       BATCH REQUEST
//       =====================================
//       */

//     url.searchParams.set("symbol", twelveSymbols.join(","));

//     url.searchParams.set("apikey", API_KEY);

//     const response = await fetch(url);

//     const data = await response.json();

//     /*
//       =====================================
//       HTTP ERROR
//       =====================================
//       */

//     if (!response.ok) {
//       console.error(
//         "Twelve Data HTTP error:",
//         response.status,
//         response.statusText,
//       );

//       return [];
//     }

//     /*
//       =====================================
//       API ERROR
//       =====================================
//       */

//     if (data.status === "error") {
//       console.error("Twelve Data API error:", data.message);

//       return [];
//     }

//     /*
//       =====================================
//       PARSE RESULTS
//       =====================================
//       */

//     const results = [];

//     /*
//       Twelve Data returns an object
//       containing the requested symbols.
//       */

//     for (const [key, quote] of Object.entries(data)) {
//       if (!quote || typeof quote !== "object") {
//         continue;
//       }

//       if (quote.status === "error") {
//         console.error(`Twelve Data failed for ${key}:`, quote.message);

//         continue;
//       }

//       const rawSymbol = quote.symbol || key;

//       const symbol = rawSymbol.replace(":NSE", "").replace(".NSE", "");

//       const price = quote.close != null ? Number(quote.close) : null;

//       const change =
//         quote.percent_change != null ? Number(quote.percent_change) : null;

//       results.push({
//         symbol,

//         price,

//         change,
//       });
//     }

//     console.log(`Twelve Data returned ${results.length} quotes`);

//     return results;
//   } catch (error) {
//     console.error("Twelve Data batch request failed:", error.message);

//     return [];
//   }
// };
/*
=====================================
 TWELVE DATA LIVE PRICE SERVICE
=====================================
*/

// const TWELVE_DATA_API = "https://api.twelvedata.com";

// const API_KEY = process.env.TWELVE_DATA_API_KEY;

// /*
// =====================================
//  CONFIGURATION
// =====================================
// */

// const MAX_BATCH_SIZE = 8;

// /*
// =====================================
//  SINGLE LIVE PRICE
// =====================================
// */

// exports.getLivePrice = async (symbol) => {
//   if (!API_KEY) {
//     console.error("TWELVE_DATA_API_KEY is missing");

//     return {
//       price: null,
//       change: null,
//     };
//   }

//   try {
//     const url = new URL(`${TWELVE_DATA_API}/quote`);

//     url.searchParams.set("symbol", `${symbol}:NSE`);

//     url.searchParams.set("apikey", API_KEY);

//     const response = await fetch(url);

//     const data = await response.json();

//     if (!response.ok || data.status === "error") {
//       console.error(
//         `Twelve Data failed for ${symbol}:`,
//         data.message || response.statusText,
//       );

//       return {
//         price: null,
//         change: null,
//       };
//     }

//     return {
//       price: data.close != null ? Number(data.close) : null,

//       change: data.percent_change != null ? Number(data.percent_change) : null,
//     };
//   } catch (error) {
//     console.error(`Twelve Data request failed for ${symbol}:`, error.message);

//     return {
//       price: null,
//       change: null,
//     };
//   }
// };

// /*
// =====================================
//  BATCH LIVE PRICES
// =====================================
// */

// exports.getLivePricesBatch = async (symbols = []) => {
//   if (!symbols.length) {
//     return [];
//   }

//   if (!API_KEY) {
//     console.error("TWELVE_DATA_API_KEY is missing");

//     return [];
//   }

//   /*
//     Only allow 8 symbols in one request.
//     */

//   const batch = symbols.slice(0, MAX_BATCH_SIZE);

//   const uniqueSymbols = [...new Set(batch)];

//   const twelveSymbols = uniqueSymbols.map((symbol) => `${symbol}:NSE`);

//   console.log(`Twelve Data request for ${twelveSymbols.length} symbols`);

//   try {
//     const url = new URL(`${TWELVE_DATA_API}/quote`);

//     url.searchParams.set("symbol", twelveSymbols.join(","));

//     url.searchParams.set("apikey", API_KEY);

//     const response = await fetch(url);

//     const data = await response.json();

//     /*
//       =====================================
//       HTTP ERROR
//       =====================================
//       */

//     if (!response.ok) {
//       console.error(
//         "Twelve Data HTTP error:",
//         response.status,
//         response.statusText,
//       );

//       return [];
//     }

//     /*
//       =====================================
//       API ERROR
//       =====================================
//       */

//     if (data.status === "error") {
//       console.error("Twelve Data API error:", data.message);

//       return [];
//     }

//     /*
//       =====================================
//       PARSE RESPONSE
//       =====================================
//       */

//     const results = [];

//     for (const [key, quote] of Object.entries(data)) {
//       if (!quote || typeof quote !== "object") {
//         continue;
//       }

//       if (quote.status === "error") {
//         continue;
//       }

//       const rawSymbol = quote.symbol || key;

//       const symbol = rawSymbol.replace(":NSE", "").replace(".NSE", "");

//       results.push({
//         symbol,

//         price: quote.close != null ? Number(quote.close) : null,

//         change:
//           quote.percent_change != null ? Number(quote.percent_change) : null,
//       });
//     }

//     console.log(`Twelve Data returned ${results.length} quotes`);

//     return results;
//   } catch (error) {
//     console.error("Twelve Data batch request failed:", error.message);

//     return [];
//   }
// };

// WORKING VERSION OF YAHHOOOO FINANCE

// const YahooFinance = require("yahoo-finance2").default;

// /*
// =====================================
//  YAHOO FINANCE INSTANCE
// =====================================
// */

// const yahooFinance = new YahooFinance({
//   suppressNotices: ["yahooSurvey"],
// });

// /*
// =====================================
//  SLEEP HELPER
// =====================================
// */

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /*
// =====================================
//  SINGLE LIVE PRICE
//  Used by other parts of project
// =====================================
// */

// exports.getLivePrice = async (symbol) => {
//   const yahooSymbol = `${symbol}.NS`;

//   for (let attempt = 1; attempt <= 2; attempt++) {
//     try {
//       const quote = await yahooFinance.quote(yahooSymbol);

//       if (!quote) {
//         throw new Error("No quote returned");
//       }

//       return {
//         price:
//           quote.regularMarketPrice != null
//             ? Number(quote.regularMarketPrice.toFixed(2))
//             : null,

//         change:
//           quote.regularMarketChangePercent != null
//             ? Number(quote.regularMarketChangePercent.toFixed(2))
//             : null,
//       };
//     } catch (error) {
//       console.log(
//         `Yahoo attempt ${attempt} failed for ${symbol}:`,
//         error.message,
//       );

//       if (attempt < 2) {
//         await sleep(1000);
//       }
//     }
//   }

//   return {
//     price: null,
//     change: null,
//   };
// };

// /*
// =====================================
//  BATCH LIVE PRICES
//  Used by Stock Dashboard
// =====================================
// */

// exports.getLivePricesBatch = async (symbols = []) => {
//   if (!symbols.length) return [];

//   const yahooSymbols = [...new Set(symbols.map((symbol) => `${symbol}.NS`))];

//   for (let attempt = 1; attempt <= 2; attempt++) {
//     try {
//       console.log(
//         `Yahoo batch request attempt ${attempt} for ${yahooSymbols.length} symbols`,
//       );

//       const response = await yahooFinance.quote(yahooSymbols);

//       const quotes = Array.isArray(response) ? response : [response];

//       const results = quotes.map((quote) => ({
//         symbol: quote.symbol.replace(".NS", ""),

//         price:
//           quote.regularMarketPrice != null
//             ? Number(quote.regularMarketPrice.toFixed(2))
//             : null,

//         change:
//           quote.regularMarketChangePercent != null
//             ? Number(quote.regularMarketChangePercent.toFixed(2))
//             : null,
//       }));

//       console.log(`Yahoo returned ${results.length} quotes successfully`);

//       return results;
//     } catch (error) {
//       console.log(`Yahoo batch attempt ${attempt} failed:`, error.message);

//       if (attempt < 2) {
//         await sleep(1500);
//       }
//     }
//   }

//   console.log("Yahoo batch completely failed");

//   return [];
// };

// TRYING TO IMPROVE THINGS

const YahooFinance = require("yahoo-finance2").default;

/*
=====================================
 YAHOO FINANCE CLIENT
=====================================

IMPORTANT:
- Server-side only
- Never call Yahoo directly from
  the frontend.
- Conservative queue configuration
  helps reduce rate-limit problems.
=====================================
*/

const yahooFinance = new YahooFinance({
  queue: {
    concurrency: 1,
    interval: 1000,
  },

  quoteCombine: {
    debounceTime: 100,
    maxSymbolsPerRequest: 50,
  },

  suppressNotices: ["yahooSurvey"],
});

/*
=====================================
 GET ONE LIVE PRICE
=====================================
*/

exports.getLivePrice = async (symbol) => {
  try {
    const yahooSymbol = symbol.endsWith(".NS") ? symbol : `${symbol}.NS`;

    const quote = await yahooFinance.quote(yahooSymbol);

    if (!quote) {
      return {
        price: null,
        change: null,
      };
    }

    const price =
      quote.regularMarketPrice != null
        ? Number(quote.regularMarketPrice)
        : null;

    const change =
      quote.regularMarketChangePercent != null
        ? Number(quote.regularMarketChangePercent)
        : null;

    return {
      price,
      change,
    };
  } catch (error) {
    console.error(`Yahoo Finance quote failed for ${symbol}:`, error.message);

    return {
      price: null,
      change: null,
    };
  }
};

/*
=====================================
 GET MULTIPLE LIVE PRICES
=====================================

Yahoo Finance supports passing an
array of symbols to quote(), allowing
multiple quotes in one request.

Example:

quote([
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS"
])
=====================================
*/

exports.getLivePricesBatch = async (symbols = []) => {
  if (!symbols.length) {
    return [];
  }

  try {
    /*
      ---------------------------------
      REMOVE DUPLICATES
      ---------------------------------
      */

    const uniqueSymbols = [...new Set(symbols)];

    /*
      ---------------------------------
      CONVERT TO NSE SYMBOLS
      ---------------------------------
      */

    const yahooSymbols = uniqueSymbols.map((symbol) =>
      symbol.endsWith(".NS") ? symbol : `${symbol}.NS`,
    );

    console.log(`Yahoo batch request for ${yahooSymbols.length} symbols`);

    /*
      ---------------------------------
      ONE BATCH REQUEST
      ---------------------------------
      */

    const quotes = await yahooFinance.quote(yahooSymbols, {
      fields: [
        "symbol",
        "regularMarketPrice",
        "regularMarketChangePercent",
        "regularMarketTime",
        "marketState",
      ],
    });

    /*
      ---------------------------------
      NORMALIZE RESPONSE
      ---------------------------------
      */

    const results = [];

    for (const quote of quotes) {
      if (!quote) {
        continue;
      }

      const yahooSymbol = quote.symbol;

      if (!yahooSymbol) {
        continue;
      }

      const symbol = yahooSymbol.endsWith(".NS")
        ? yahooSymbol.slice(0, -3)
        : yahooSymbol;

      const price =
        quote.regularMarketPrice != null
          ? Number(quote.regularMarketPrice)
          : null;

      const change =
        quote.regularMarketChangePercent != null
          ? Number(quote.regularMarketChangePercent)
          : null;

      results.push({
        symbol,

        price,

        change,

        marketState: quote.marketState || null,

        fetchedAt: Date.now(),
      });
    }

    console.log(`Yahoo returned ${results.length} quotes successfully`);

    return results;
  } catch (error) {
    console.error("Yahoo batch quote failed:", error.message);

    return [];
  }
};
