const Portfolio =
 require("../models/Portfolio")


/*
========================================
 AI PORTFOLIO ANALYSIS
========================================
*/

exports.generatePortfolioInsights =
 async (userId) => {

  try {

   /*
   ========================================
   FIND PORTFOLIO
   ========================================
   */

   const portfolio =
    await Portfolio.findOne({

     user: userId,

    })


   if (
    !portfolio ||
    portfolio.holdings.length === 0
   ) {

    return {

     sentiment:
      "Neutral",

     confidence: 50,

     health:
      "Weak",

     recommendation:
      "Start building a diversified halal portfolio.",

    }

   }


   /*
   ========================================
   BASIC METRICS
   ========================================
   */

   const holdings =
    portfolio.holdings


   const totalValue =

    holdings.reduce(

     (
      sum,
      holding
     ) =>

      sum +
      (
       holding.currentValue || 0
      ),

     0

    )


   const totalProfit =

    holdings.reduce(

     (
      sum,
      holding
     ) =>

      sum +
      (
       holding.profitLoss || 0
      ),

     0

    )


   /*
   ========================================
   DIVERSIFICATION
   ========================================
   */

   const totalHoldings =
    holdings.length


   let health =
    "Moderate"


   if (
    totalHoldings >= 8
   ) {

    health =
     "Excellent"

   } else if (
    totalHoldings >= 5
   ) {

    health =
     "Good"

   } else if (
    totalHoldings <= 2
   ) {

    health =
     "Risky"

   }


   /*
   ========================================
   SENTIMENT
   ========================================
   */

   let sentiment =
    "Neutral"


   if (totalProfit > 0) {

    sentiment =
     "Bullish"

   }

   if (totalProfit < 0) {

    sentiment =
     "Cautious"

   }


   /*
   ========================================
   AI CONFIDENCE
   ========================================
   */

   let confidence = 65


   if (
    totalProfit > 0
   ) {

    confidence += 10

   }

   if (
    totalHoldings >= 6
   ) {

    confidence += 10

   }

   if (
    totalHoldings >= 10
   ) {

    confidence += 5

   }


   confidence =
    Math.min(
     confidence,
     95
    )


   /*
   ========================================
   RECOMMENDATION
   ========================================
   */

   let recommendation =
    ""


   if (
    totalHoldings <= 3
   ) {

    recommendation =
     "Increase diversification across halal sectors like technology, healthcare, and FMCG."

   }

   else if (
    totalProfit < 0
   ) {

    recommendation =
     "Portfolio is under pressure. Consider reducing weak positions and averaging strong halal stocks."

   }

   else {

    recommendation =
     "Portfolio looks balanced. Continue monitoring technical momentum and sector allocation."

   }


   /*
   ========================================
   RETURN AI RESULT
   ========================================
   */

   return {

    sentiment,

    confidence,

    health,

    recommendation,

   }

  } catch (error) {

   console.log(error)

   return {

    sentiment:
     "Neutral",

    confidence: 50,

    health:
     "Unknown",

    recommendation:
     "AI analysis unavailable.",

   }

  }

}