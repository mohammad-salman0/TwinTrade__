const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

/*
=====================================
 LIVE PRICE SERVICE (Yahoo Finance)
=====================================
 Replaces the old mock implementation. Uses the same
 yahoo-finance2 library already used for candlestick
 history in aiPredictionService.js, so both live price
 and chart data now come from the same real source.
*/

exports.getLivePrice =
 async (symbol) => {

  try {

   const quote =
    await yahooFinance.quote(

     `${symbol}.NS`

    )


   /*
   =====================================
   NO QUOTE RETURNED
   =====================================
   */

   if (!quote) {

    return {

     price: null,

     change: null,

    }

   }


   /*
   =====================================
   PRICE
   =====================================
   */

   const price =

    quote.regularMarketPrice != null

     ? Number(
        quote.regularMarketPrice.toFixed(2)
       )

     : null


   /*
   =====================================
   CHANGE %
   =====================================
   */

   const change =

    quote.regularMarketChangePercent != null

     ? Number(
        quote.regularMarketChangePercent.toFixed(2)
       )

     : null


   return {

    price,

    change,

   }

  } catch (error) {

   console.log(

    `Yahoo Finance quote failed for ${symbol}:`,
    error.message

   )

   return {

    price: null,

    change: null,

   }

  }

}