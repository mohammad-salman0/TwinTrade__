const Portfolio =
 require("../models/Portfolio")

const {
 getLivePrices,
} = require(
 "../services/livePriceService"
)


/*
================================
 GET USER PORTFOLIO
================================
*/

exports.getPortfolio =
 async (req, res) => {

  try {

   /*
   =================================
   FIND PORTFOLIO
   =================================
   */

   const portfolio =
    await Portfolio.findOne({

     user:
      req.user.id,

    })


   /*
   =================================
   NOT FOUND
   =================================
   */

   if (!portfolio) {

    return res.status(404).json({

     message:
      "Portfolio not found",

    })

   }


   /*
   =================================
   GET SYMBOLS
   =================================
   */

   const symbols =

    portfolio.holdings.map(
     (holding) =>
      holding.symbol
    )


   /*
   =================================
   LIVE MARKET PRICES
   =================================
   */

   const livePrices =
    await getLivePrices(
     symbols
    )


   /*
   =================================
   TOTALS
   =================================
   */

   let totalCurrentValue = 0

   let totalInvestedValue = 0

   let totalProfit = 0


   /*
   =================================
   UPDATE HOLDINGS
   =================================
   */

   const updatedHoldings =

    portfolio.holdings.map(

     (holding) => {

      /*
      =================================
      LIVE STOCK
      =================================
      */

      const liveStock =
       livePrices.find(

        (stock) =>

         stock.symbol
          ?.toUpperCase()

         ===

         holding.symbol
          ?.toUpperCase()

       )


      /*
      =================================
      CURRENT PRICE
      =================================
      */

      const currentPrice =

       liveStock?.price != null

        ? Number(
           liveStock.price
          )

        : Number(
           holding.averagePrice || 0
          )


      /*
      =================================
      CURRENT VALUE
      =================================
      */

      const currentValue =

       Number(

        (
         holding.quantity *
         currentPrice
        ).toFixed(2)

       )


      /*
      =================================
      INVESTED VALUE
      =================================
      */

      const investedValue =

       Number(

        (
         holding.quantity *
         holding.averagePrice
        ).toFixed(2)

       )


      /*
      =================================
      PROFIT LOSS
      =================================
      */

      const profitLoss =

       Number(

        (
         currentValue -
         investedValue
        ).toFixed(2)

       )


      /*
      =================================
      RETURN %
      =================================
      */

      const returnPercentage =

       investedValue > 0

        ? Number(

           (

            (
             profitLoss /
             investedValue
            ) * 100

           ).toFixed(2)

          )

        : 0


      /*
      =================================
      UPDATE TOTALS
      =================================
      */

      totalCurrentValue +=
       currentValue

      totalInvestedValue +=
       investedValue

      totalProfit +=
       profitLoss


      /*
      =================================
      RETURN UPDATED HOLDING
      =================================
      */

      return {

       ...holding.toObject(),

       currentPrice,

       currentValue,

       investedValue,

       profitLoss,

       returnPercentage,

       allocationPercentage: 0,

      }

     }

    )


   /*
   =================================
   ALLOCATION %
   =================================
   */

   updatedHoldings.forEach(
    (holding) => {

     holding.allocationPercentage =

      totalCurrentValue > 0

       ? Number(

          (

           (
            holding.currentValue /

            totalCurrentValue

           ) * 100

          ).toFixed(2)

         )

       : 0

    }
   )


   /*
   =================================
   TOTAL RETURN %
   =================================
   */

   const totalReturnPercentage =

    totalInvestedValue > 0

     ? Number(

        (

         (
          totalProfit /
          totalInvestedValue
         ) * 100

        ).toFixed(2)

       )

     : 0


   /*
   =================================
   UPDATE ONLY SAFE DB FIELDS
   =================================
   */

   portfolio.totalProfit =
    Number(
     totalProfit.toFixed(2)
    )

   await portfolio.save()


   /*
   =================================
   RESPONSE
   =================================
   */

   res.status(200).json({

    ...portfolio.toObject(),

    holdings:
     updatedHoldings,

    currentPortfolioValue:

     Number(
      totalCurrentValue.toFixed(2)
     ),

    totalInvestedValue:

     Number(
      totalInvestedValue.toFixed(2)
     ),

    totalProfit:

     Number(
      totalProfit.toFixed(2)
     ),

    totalReturnPercentage,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch portfolio",

   })

  }

}