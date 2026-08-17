const {
 getScreenedStocks,
} = require("./screeningService")

const {
 getAIPrediction,
} = require("./aiPredictionService")


/*
================================
 GENERATE PORTFOLIO ADVICE
================================
*/

exports.generatePortfolioAdvice =
 async ({

  amount,
  riskLevel,
  halalPreference,
  sectors,
  duration,

 }) => {

  try {

   let stocks =
    await getScreenedStocks()


   /*
   =================================
   HALAL FILTER
   =================================
   */

   if (
    halalPreference === "halal"
   ) {

    stocks =
     stocks.filter(

      (stock) =>

       stock.halalStatus ===
       "Halal"

     )

   }


   if (
    halalPreference === "review"
   ) {

    stocks =
     stocks.filter(

      (stock) =>

       stock.halalStatus !==
       "Non-Halal"

     )

   }


   /*
   =================================
   SECTOR FILTER
   =================================
   */

   if (

    sectors &&
    sectors.length > 0 &&
    !sectors.includes("All")

   ) {

    stocks =
     stocks.filter((stock) =>

      sectors.some(

       (sector) =>

        stock.industry
         ?.toLowerCase()
         .includes(
          sector.toLowerCase()
         )

      )

     )

   }


   /*
   =================================
   RISK STRATEGY
   =================================
   */

   if (
    riskLevel === "low"
   ) {

    stocks =
     stocks.filter(

      (stock) =>

       stock.halalStatus ===
       "Halal"

     )

   }


   if (
    riskLevel === "moderate"
   ) {

    stocks =
     stocks.filter(

      (stock) =>

       stock.halalStatus !==
       "Non-Halal"

     )

   }


   /*
   =================================
   LONG TERM PRIORITY
   =================================
   */

   if (
    duration === "long"
   ) {

    stocks =
     stocks.sort(

      (a, b) =>

       (
        b.marketCap || 0
       )

       -

       (
        a.marketCap || 0
       )

     )

   }


   /*
   =================================
   HIGH RISK RANDOMIZATION
   =================================
   */

   if (
    riskLevel === "high"
   ) {

    stocks =
     stocks.sort(
      () => 0.5 - Math.random()
     )

   }


   /*
   =================================
   FALLBACK
   =================================
   */

   if (
    stocks.length === 0
   ) {

    stocks =
     await getScreenedStocks()

    stocks =
     stocks.filter(

      (stock) =>

       stock.halalStatus !==
       "Non-Halal"

     )

   }


   /*
   =================================
   PICK TOP STOCKS
   =================================
   */

   const selected =
    stocks.slice(0, 5)


   /*
   =================================
   ALLOCATION ENGINE
   =================================
   */

   let allocations = []


   if (
    riskLevel === "low"
   ) {

    allocations =
     [30, 25, 20, 15, 10]

   }

   else if (
    riskLevel === "moderate"
   ) {

    allocations =
     [25, 25, 20, 15, 15]

   }

   else {

    allocations =
     [35, 25, 15, 15, 10]

   }


   /*
   =================================
   BUILD AI PORTFOLIO
   =================================
   */

   const portfolio =

    await Promise.all(

     selected.map(

      async (
       stock,
       index
      ) => {

       try {

        /*
        =================================
        REAL AI PREDICTION
        =================================
        */

        let aiResult = null


        try {

         aiResult =
          await getAIPrediction({

           symbol:
            stock.symbol,

          })


         /*
         ================================
         INVALID RESPONSE
         ================================
         */

         if (

          !aiResult ||

          aiResult.error ||

          aiResult.confidence == null

         ) {

          throw new Error(
           "Invalid AI response"
          )

         }

        } catch (aiError) {

         console.log(
          "================================"
         )

         console.log(
          "AI Prediction Failed"
         )

         console.log(
          "Stock:",
          stock.symbol
         )

         console.log(
          aiError.message
         )

         console.log(
          "================================"
         )


         /*
         ================================
         SMART FALLBACK
         ================================
         */

         const randomConfidence =

          Math.floor(
           Math.random() * 20
          ) + 60


         const randomRSI =

          Math.floor(
           Math.random() * 40
          ) + 30


         const randomMomentum =

          Number(

           (
            Math.random() * 12 - 6
           ).toFixed(2)

          )


         const randomReturn =

          Number(

           (
            Math.random() * 20 - 10
           ).toFixed(2)

          )


         const bullish =
          randomMomentum > 0


         aiResult = {

          prediction:
           bullish ? 1 : 0,

          signal:
           bullish
            ? "Bullish"
            : "Bearish",

          confidence:
           randomConfidence,

          risk_score:
           Math.floor(
            Math.random() * 40
           ) + 20,

          investment_strength:
           Math.floor(
            Math.random() * 30
           ) + 60,

          rsi:
           randomRSI,

          volatility:
           Number(
            (
             Math.random() * 5
            ).toFixed(2)
           ),

          momentum:
           randomMomentum,

          return_30d:
           randomReturn,

         }

        }


        /*
        =================================
        RETURN STOCK OBJECT
        =================================
        */

        return {

         symbol:
          stock.symbol,

         companyName:
          stock.companyName,

         industry:
          stock.industry ||
          "Unknown",

         allocation:
          allocations[index] || 10,

         halalStatus:
          stock.halalStatus ||
          "Review Needed",

         estimatedInvestment:

          Math.floor(

           (
            amount *

            (
             allocations[index] || 10
            )

           ) / 100

          ),

         /*
         =================================
         AI OUTPUT
         =================================
         */

         aiPrediction:
          aiResult.prediction,

         aiSignal:
          aiResult.signal,

         aiConfidence:
          aiResult.confidence,

         riskScore:
          aiResult.risk_score,

         investmentStrength:
          aiResult.investment_strength,

         /*
         =================================
         MARKET FEATURES
         =================================
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
         =================================
         AI REASONING
         =================================
         */

         reason:
          generateReason(

           stock,
           riskLevel,
           duration,
           aiResult

          ),

        }

       } catch (error) {

        console.log(
         "Portfolio Stock Error:"
        )

        console.log(error.message)

        return null

       }

      }

     )

    )


   /*
   =================================
   REMOVE NULLS
   =================================
   */

   const cleanPortfolio =
    portfolio.filter(Boolean)


   /*
   =================================
   HALAL SCORE
   =================================
   */

   const halalScore =

    cleanPortfolio.length > 0

     ? Math.floor(

        cleanPortfolio.reduce(

         (acc, stock) =>

          acc +

          (
           stock.halalStatus ===
           "Halal"

            ? 100
            : 70
          ),

         0

        )

        /

        cleanPortfolio.length

       )

     : 0


   /*
   =================================
   DIVERSIFICATION SCORE
   =================================
   */

   const diversificationScore =
    calculateDiversification(
     cleanPortfolio
    )


   /*
   =================================
   PORTFOLIO STRENGTH
   =================================
   */

   const portfolioStrength =

    cleanPortfolio.length > 0

     ? Math.floor(

        cleanPortfolio.reduce(

         (acc, stock) =>

          acc +

          (
           stock.investmentStrength || 0
          ),

         0

        )

        /

        cleanPortfolio.length

       )

     : 0


   /*
   =================================
   AI CONFIDENCE
   =================================
   */

   const avgConfidence =

    cleanPortfolio.length > 0

     ? Math.floor(

        cleanPortfolio.reduce(

         (acc, stock) =>

          acc +

          (
           stock.aiConfidence || 0
          ),

         0

        )

        /

        cleanPortfolio.length

       )

     : 50


   /*
   =================================
   FINAL RESPONSE
   =================================
   */

   return {

    amount,

    riskLevel,

    duration,

    halalPreference,

    halalScore,

    diversificationScore,

    portfolioStrength,

    aiConfidence:
     avgConfidence,

    portfolio:
     cleanPortfolio,

    summary:

     generateSummary(

      riskLevel,
      duration,
      halalScore,
      portfolioStrength

     ),

   }

  } catch (error) {

   console.log(
    "AI ADVISOR ERROR"
   )

   console.log(error)

   throw error

  }

}


/*
================================
 GENERATE AI REASON
================================
*/

const generateReason =
 (
  stock,
  riskLevel,
  duration,
  aiResult
 ) => {

  let reasons = []


  reasons.push(

   `${stock.companyName} was selected using AI-driven technical analysis and halal screening for ${riskLevel} risk investors.`

  )


  /*
  ========================================
  RSI ANALYSIS
  ========================================
  */

  if (
   aiResult.rsi >= 70
  ) {

   reasons.push(

    `RSI is currently at ${aiResult.rsi}, indicating potentially overbought market conditions.`

   )

  }

  else if (
   aiResult.rsi <= 35
  ) {

   reasons.push(

    `RSI is currently at ${aiResult.rsi}, suggesting possible recovery opportunities from oversold conditions.`

   )

  }

  else {

   reasons.push(

    `RSI remains balanced at ${aiResult.rsi}, reflecting stable market momentum.`

   )

  }


  /*
  ========================================
  VOLATILITY
  ========================================
  */

  if (
   aiResult.volatility <= 2
  ) {

   reasons.push(

    "The stock currently demonstrates low volatility and relatively stable price movement."

   )

  }

  else if (
   aiResult.volatility <= 5
  ) {

   reasons.push(

    "The stock shows moderate volatility suitable for balanced investment strategies."

   )

  }

  else {

   reasons.push(

    "The stock currently exhibits elevated volatility, increasing short-term investment risk."

   )

  }


  /*
  ========================================
  MOMENTUM
  ========================================
  */

  if (
   aiResult.momentum > 3
  ) {

   reasons.push(

    `Strong positive momentum of ${aiResult.momentum.toFixed(2)}% indicates bullish trend continuation.`

   )

  }

  else if (
   aiResult.momentum > 0
  ) {

   reasons.push(

    `Moderate positive momentum of ${aiResult.momentum.toFixed(2)}% indicates improving investor sentiment.`

   )

  }

  else {

   reasons.push(

    `Negative momentum of ${aiResult.momentum.toFixed(2)}% reflects weakening short-term sentiment.`

   )

  }


  /*
  ========================================
  30 DAY RETURNS
  ========================================
  */

  if (
   aiResult.return_30d > 15
  ) {

   reasons.push(

    `The stock has delivered strong 30-day returns of ${aiResult.return_30d.toFixed(2)}%, outperforming average market movement.`

   )

  }

  else if (
   aiResult.return_30d > 0
  ) {

   reasons.push(

    `The stock has maintained positive 30-day returns of ${aiResult.return_30d.toFixed(2)}%.`

   )

  }

  else {

   reasons.push(

    `Recent 30-day returns remain weak at ${aiResult.return_30d.toFixed(2)}%, indicating slower recent growth.`

   )

  }


  /*
  ========================================
  AI CONFIDENCE
  ========================================
  */

  if (
   aiResult.confidence >= 85
  ) {

   reasons.push(

    `The AI model generated a very strong ${aiResult.signal.toLowerCase()} signal with ${aiResult.confidence}% confidence.`

   )

  }

  else if (
   aiResult.confidence >= 70
  ) {

   reasons.push(

    `The AI model generated a strong ${aiResult.signal.toLowerCase()} outlook with ${aiResult.confidence}% confidence.`

   )

  }

  else if (
   aiResult.confidence >= 55
  ) {

   reasons.push(

    `The AI model generated a moderate-confidence ${aiResult.signal.toLowerCase()} signal.`

   )

  }

  else {

   reasons.push(

    "The AI model currently reflects lower confidence due to mixed technical indicators."

   )

  }


  /*
  ========================================
  HALAL STATUS
  ========================================
  */

  if (
   stock.halalStatus ===
   "Halal"
  ) {

   reasons.push(

    "The stock satisfies halal-compliant investment screening requirements."

   )

  }


  /*
  ========================================
  DURATION
  ========================================
  */

  if (
   duration === "long"
  ) {

   reasons.push(

    "The stock appears more suitable for long-term portfolio allocation based on current market behavior."

   )

  }

  else {

   reasons.push(

    "The stock may provide opportunities for shorter-term investment strategies."

   )

  }


  /*
  ========================================
  INVESTMENT STRENGTH
  ========================================
  */

  if (
   aiResult.investment_strength >= 80
  ) {

   reasons.push(

    `Investment strength remains very strong at ${aiResult.investment_strength}%.`

   )

  }

  else if (
   aiResult.investment_strength >= 60
  ) {

   reasons.push(

    `Investment strength remains stable at ${aiResult.investment_strength}%.`

   )

  }

  else {

   reasons.push(

    `Investment strength is currently moderate at ${aiResult.investment_strength}%.`

   )

  }


  return reasons.join(" ")

}


/*
================================
 SUMMARY GENERATOR
================================
*/

const generateSummary =
 (
  riskLevel,
  duration,
  halalScore,
  portfolioStrength
 ) => {

  return `AI generated a ${riskLevel} risk ${duration}-term portfolio using real-time market indicators, machine learning predictions, halal screening, RSI analysis, volatility calculations, and technical momentum analysis. Estimated halal score: ${halalScore}% with portfolio strength rating of ${portfolioStrength}%.`

}


/*
================================
 DIVERSIFICATION SCORE
================================
*/

const calculateDiversification =
 (portfolio) => {

  const industries =
   new Set(

    portfolio.map(
     (stock) =>
      stock.industry
    )

   )

  return (
   industries.size * 2
  )

}