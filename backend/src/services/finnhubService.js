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

//attempt 2

const YahooFinance = require("yahoo-finance2").default;

/*
=====================================
 YAHOO FINANCE INSTANCE
=====================================
*/

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

/*
=====================================
 SLEEP HELPER
=====================================
*/

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
=====================================
 SINGLE LIVE PRICE
 Used by other parts of project
=====================================
*/

exports.getLivePrice = async (symbol) => {
  const yahooSymbol = `${symbol}.NS`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const quote = await yahooFinance.quote(yahooSymbol);

      if (!quote) {
        throw new Error("No quote returned");
      }

      return {
        price:
          quote.regularMarketPrice != null
            ? Number(quote.regularMarketPrice.toFixed(2))
            : null,

        change:
          quote.regularMarketChangePercent != null
            ? Number(quote.regularMarketChangePercent.toFixed(2))
            : null,
      };
    } catch (error) {
      console.log(
        `Yahoo attempt ${attempt} failed for ${symbol}:`,
        error.message,
      );

      if (attempt < 2) {
        await sleep(1000);
      }
    }
  }

  return {
    price: null,
    change: null,
  };
};

/*
=====================================
 BATCH LIVE PRICES
 Used by Stock Dashboard
=====================================
*/

exports.getLivePricesBatch = async (symbols = []) => {
  if (!symbols.length) return [];

  const yahooSymbols = [...new Set(symbols.map((symbol) => `${symbol}.NS`))];

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `Yahoo batch request attempt ${attempt} for ${yahooSymbols.length} symbols`,
      );

      const response = await yahooFinance.quote(yahooSymbols);

      const quotes = Array.isArray(response) ? response : [response];

      const results = quotes.map((quote) => ({
        symbol: quote.symbol.replace(".NS", ""),

        price:
          quote.regularMarketPrice != null
            ? Number(quote.regularMarketPrice.toFixed(2))
            : null,

        change:
          quote.regularMarketChangePercent != null
            ? Number(quote.regularMarketChangePercent.toFixed(2))
            : null,
      }));

      console.log(`Yahoo returned ${results.length} quotes successfully`);

      return results;
    } catch (error) {
      console.log(`Yahoo batch attempt ${attempt} failed:`, error.message);

      if (attempt < 2) {
        await sleep(1500);
      }
    }
  }

  console.log("Yahoo batch completely failed");

  return [];
};
