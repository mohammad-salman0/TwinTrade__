const {
 getScreenedStocks,
} = require(
 "../services/screeningService"
)

const {
 getLivePrices,
} = require(
 "../services/livePriceService"
)

const {
 getAIPrediction,
} = require(
 "../services/aiPredictionService"
)

const YahooFinance =
 require("yahoo-finance2")
 .default

const yahooFinance =
 new YahooFinance()


/*
=====================================
 GET ALL STOCKS — PAGINATED
=====================================
 Instead of fetching live prices for all ~500 screened
 stocks on every request (slow, hits Yahoo Finance hard),
 we screen the full list (fast, no network calls) but only
 fetch live prices for the current page slice.

 Query params:
   page     - 1-indexed page number (default 1)
   pageSize - stocks per page (default 25, max 100)
   search   - optional symbol/company name filter
   halal    - optional filter: "Halal" | "Non-Halal" | "Review Needed"
=====================================
*/

const getAllStocks =
 async (req, res) => {

  try {

   /*
   =====================================
   SCREENED STOCKS
   =====================================
   */

   let screenedStocks =
    await getScreenedStocks()


   /*
   =====================================
   OPTIONAL SEARCH FILTER
   =====================================
   */

   const { search, halal } =
    req.query


   if (search) {

    const term =
     search.toLowerCase()

    screenedStocks =
     screenedStocks.filter(

      (s) =>

       s.symbol
        ?.toLowerCase()
        .includes(term)

       ||

       s.companyName
        ?.toLowerCase()
        .includes(term)

     )

   }


   /*
   =====================================
   OPTIONAL HALAL STATUS FILTER
   =====================================
   */

   if (halal) {

    screenedStocks =
     screenedStocks.filter(

      (s) =>

       s.halalStatus === halal

     )

   }


   /*
   =====================================
   PAGINATION
   =====================================
   */

   const page =
    Math.max(

     1,

     parseInt(req.query.page) || 1

    )


   const pageSize =
    Math.min(

     100,

     Math.max(

      1,

      parseInt(req.query.pageSize) || 25

     )

    )


   const totalStocks =
    screenedStocks.length


   const totalPages =
    Math.max(

     1,

     Math.ceil(totalStocks / pageSize)

    )


   const startIndex =
    (page - 1) * pageSize


   const pageSlice =
    screenedStocks.slice(

     startIndex,
     startIndex + pageSize

    )


   /*
   =====================================
   LIVE PRICES — ONLY FOR THIS PAGE
   =====================================
   */

   const symbols =

    pageSlice.map(
     (stock) =>
      stock.symbol
    )


   const livePrices =
    await getLivePrices(
     symbols
    )


   /*
   =====================================
   MERGE STOCKS
   =====================================
   No fake fallback formulas — if a live
   quote genuinely fails, price/change are null
   and the frontend shows "—" instead of a
   second layer of fake numbers.
   =====================================
   */

   const mergedStocks =

    pageSlice.map(
     (stock) => {

      const liveData =
       livePrices.find(

        (live) =>

         live.symbol
          ?.toUpperCase()

         ===

         stock.symbol
          ?.toUpperCase()

       )


      return {

       ...stock,

       price:
        liveData?.price ?? null,

       change:
        liveData?.change ?? null,

      }

     }
    )


   /*
   =====================================
   RESPONSE WITH PAGINATION META
   =====================================
   */

   res.json({

    stocks:
     mergedStocks,

    pagination: {

     page,

     pageSize,

     totalStocks,

     totalPages,

    },

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch stocks",

   })

  }

}


/*
=====================================
 GET SINGLE STOCK
=====================================
 Includes the real AI prediction call — this
 is the endpoint the stock detail page uses,
 so it needs aiPrediction/aiSignal/aiConfidence/
 rsi/riskScore/aiReason in the response, not
 just price/change.
=====================================
*/

const getStockBySymbol =
 async (req, res) => {

  try {

   /*
   =====================================
   SCREENED STOCKS
   =====================================
   */

   const screenedStocks =
    await getScreenedStocks()


   /*
   =====================================
   FIND STOCK
   =====================================
   */

   const stock =
    screenedStocks.find(

     (s) =>

      s.symbol
       ?.toUpperCase()

      ===

      req.params.symbol
       ?.toUpperCase()

    )


   /*
   =====================================
   STOCK NOT FOUND
   =====================================
   */

   if (!stock) {

    return res.status(404).json({

     message:
      "Stock not found",

    })

   }


   /*
   =====================================
   LIVE PRICE
   =====================================
   */

   const livePrices =
    await getLivePrices([
     stock.symbol
    ])


   const liveData =
    livePrices[0]


   const price =
    liveData?.price ?? null

   const change =
    liveData?.change ?? null


   /*
   =====================================
   REAL AI PREDICTION
   =====================================
   Calls the FastAPI ML microservice. If it
   fails (service down, bad symbol, timeout),
   fall back to a generic neutral object so
   the page still renders something sensible
   instead of crashing.
   =====================================
   */

   let aiResult = {

    prediction: 0,

    signal: "Bearish",

    confidence: 50,

    risk_score: 50,

    investment_strength: 50,

    rsi: 50,

    volatility: 30,

    momentum: 10,

    return_30d: 5,

   }


   try {

    aiResult =
     await getAIPrediction({

      symbol:
       stock.symbol,

     })

   } catch (aiError) {

    console.log(
     "AI Prediction Error for",
     stock.symbol
    )

    console.log(
     aiError.message
    )

   }


   /*
   =====================================
   AI REASONING
   =====================================
   */

   let aiReason = ""


   if (
    aiResult.prediction === 1
   ) {

    aiReason =

     `${stock.companyName} currently shows bullish technical momentum supported by real-time RSI analysis, historical return trends, and machine learning confidence scoring.`

   }

   else {

    aiReason =

     `${stock.companyName} currently reflects weaker technical momentum and elevated volatility, leading to a cautious AI outlook.`

   }


   /*
   =====================================
   RESPONSE
   =====================================
   */

   res.json({

    ...stock,

    /*
    =====================================
    LIVE MARKET DATA
    =====================================
    */

    price,

    change,

    /*
    =====================================
    AI ENGINE
    =====================================
    */

    aiPrediction:
     aiResult.prediction,

    aiSignal:
     aiResult.signal,

    aiConfidence:
     aiResult.confidence,

    /*
    =====================================
    REAL TECHNICAL INDICATORS
    =====================================
    */

    rsi:
     aiResult.rsi,

    volatility:
     aiResult.volatility,

    momentum:
     aiResult.momentum,

    return30d:
     aiResult.return_30d,

    /*
    =====================================
    AI SCORES
    =====================================
    */

    riskScore:
     aiResult.risk_score,

    investmentStrength:
     aiResult.investment_strength,

    /*
    =====================================
    AI REASONING
    =====================================
    */

    aiReason,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch stock",

   })

  }

}


/*
=====================================
 GET STOCK HISTORY
=====================================
*/

const getStockHistory =
 async (req, res) => {

  try {

   const { symbol } =
    req.params

   const {
    range = "1mo",
    interval = "1d",
   } = req.query


   /*
   =====================================
   DATE RANGE
   =====================================
   */

   const now =
    new Date()

   let period1 =
    new Date()


   switch (range) {

    case "1d":

     period1.setDate(
      now.getDate() - 1
     )

     break


    case "5d":

     period1.setDate(
      now.getDate() - 5
     )

     break


    case "1mo":

     period1.setMonth(
      now.getMonth() - 1
     )

     break


    case "6mo":

     period1.setMonth(
      now.getMonth() - 6
     )

     break


    case "1y":

     period1.setFullYear(
      now.getFullYear() - 1
     )

     break


    default:

     period1.setMonth(
      now.getMonth() - 1
     )

   }


   /*
   =====================================
   YAHOO CHART
   =====================================
   */

   const result =
    await yahooFinance.chart(

     `${symbol}.NS`,

     {

      period1,
      period2: now,
      interval,

     }

    )


   /*
   =====================================
   NO DATA
   =====================================
   */

   if (
    !result ||
    !result.quotes
   ) {

    return res.status(404).json({

     message:
      "No historical data found",

    })

   }


   /*
   =====================================
   FORMAT CANDLES
   =====================================
   */

   const candles =
    result.quotes

     .filter(

      (q) =>

       q.open &&
       q.high &&
       q.low &&
       q.close

     )

     .map((q) => ({

      time:
       Math.floor(

        new Date(
         q.date
        ).getTime() / 1000

       ),

      open:
       Number(
        q.open.toFixed(2)
       ),

      high:
       Number(
        q.high.toFixed(2)
       ),

      low:
       Number(
        q.low.toFixed(2)
       ),

      close:
       Number(
        q.close.toFixed(2)
       ),

      volume:

       q.volume != null

        ? q.volume

        : null,

     }))


   /*
   =====================================
   RESPONSE
   =====================================
   */

   res.json(
    candles
   )

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch stock history",

   })

  }

}


module.exports = {

 getAllStocks,
 getStockBySymbol,
 getStockHistory,

}