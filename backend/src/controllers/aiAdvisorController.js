const {
 generatePortfolioAdvice,
} = require(
 "../services/aiAdvisorService"
)

const {
 getLivePrices,
} = require(
 "../services/livePriceService"
)

const Portfolio =
 require("../models/Portfolio")

const Order =
 require("../models/Order")


/*
================================
 GENERATE AI ADVICE
================================
*/

exports.generateAdvice =
 async (req, res) => {

  try {

   const advice =
    await generatePortfolioAdvice(
     req.body
    )

   res.status(200).json(
    advice
   )

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to generate AI advice",

   })

  }

}


/*
================================
 INVEST IN AI PORTFOLIO
================================
*/

exports.investInPortfolio =
 async (req, res) => {

  try {

   const {
    portfolio,
   } = req.body


   /*
   USER
   */
   const userId =
    req.user.id


   /*
   FIND PORTFOLIO
   */
   const existingPortfolio =
    await Portfolio.findOne({

     user: userId,

    })


   /*
   PORTFOLIO NOT FOUND
   */
   if (
    !existingPortfolio
   ) {

    return res.status(404).json({

     message:
      "Portfolio not found",

    })

   }


   /*
   INVALID PORTFOLIO
   */
   if (
    !portfolio ||
    portfolio.length === 0
   ) {

    return res.status(400).json({

     message:
      "No AI portfolio provided",

    })

   }


   /*
   LIVE MARKET PRICES
   */
   const livePrices =
    await getLivePrices()


   /*
   TOTAL ESTIMATED REQUIRED
   */
   const totalInvestment =
    portfolio.reduce(

     (acc, stock) =>

      acc +
      stock.estimatedInvestment,

     0

    )


   /*
   BALANCE CHECK
   */
   if (

    existingPortfolio.balance
    <
    totalInvestment

   ) {

    return res.status(400).json({

     message:
      "Insufficient wallet balance",

    })

   }


   /*
   TRACK ACTUAL MONEY SPENT
   */
   let actualSpent = 0


   /*
   EXECUTE BUYS
   */
   for (
    const stock
    of portfolio
   ) {

    /*
    LIVE STOCK PRICE
    */
    const liveStock =
     livePrices.find(

      (item) =>

       item.symbol ===
       stock.symbol

     )


    /*
    MARKET PRICE
    */
    const marketPrice =

     liveStock?.price || 1000


    /*
    REAL SHARE QUANTITY
    */
    const quantity =
     Math.max(

      1,

      Math.floor(

       stock.estimatedInvestment
       / marketPrice

      )

     )


    /*
    CALCULATED PRICE
    */
    const calculatedPrice =
     Number(
      marketPrice.toFixed(2)
     )


    /*
    TOTAL ACTUAL INVESTMENT
    */
    const totalActual =
     Number(

      (
       quantity *
       calculatedPrice
      ).toFixed(2)

     )


    /*
    ADD TO ACTUAL SPENT
    */
    actualSpent +=
     totalActual


    /*
    CREATE ORDER
    */
    const newOrder =
     new Order({

      user: userId,

      symbol:
       stock.symbol,

      companyName:
       stock.companyName,

      orderType:
       "BUY",

      quantity,

      price:
       calculatedPrice,

      totalAmount:
       totalActual,

      status:
       "COMPLETED",

     })

    await newOrder.save()


    /*
    FIND EXISTING HOLDING
    */
    const existingHolding =
     existingPortfolio.holdings.find(

      (holding) =>

       holding.symbol ===
       stock.symbol

     )


    /*
    UPDATE EXISTING HOLDING
    */
    if (
     existingHolding
    ) {

     const oldQty =
      existingHolding.quantity

     const oldAvg =
      existingHolding.averagePrice

     const newQty =
      oldQty + quantity

     const newAvg =

      (

       (oldQty * oldAvg)

       +

       totalActual

      )

      /

      newQty


     existingHolding.quantity =
      newQty

     existingHolding.averagePrice =
      Number(
       newAvg.toFixed(2)
      )

     existingHolding.currentPrice =
      calculatedPrice

     existingHolding.currentValue =
      Number(

       (
        newQty *
        calculatedPrice
       ).toFixed(2)

      )

     existingHolding.profitLoss =
      Number(

       (
        existingHolding.currentValue

        -

        (

         newQty *
         existingHolding.averagePrice

        )

       ).toFixed(2)

      )

    }


    /*
    CREATE NEW HOLDING
    */
    else {

     existingPortfolio.holdings.push({

      symbol:
       stock.symbol,

      quantity,

      averagePrice:
       calculatedPrice,

      currentPrice:
       calculatedPrice,

      currentValue:
       totalActual,

      profitLoss: 0,

     })

    }


    /*
    UPDATE INVESTED AMOUNT
    */
    existingPortfolio.investedAmount +=
     totalActual

   }


   /*
   UPDATE TOTAL PROFIT
   */
   existingPortfolio.totalProfit =

    existingPortfolio.holdings.reduce(

     (acc, holding) =>

      acc +
      holding.profitLoss,

     0

    )


   /*
   REAL WALLET DEDUCTION
   */
   existingPortfolio.balance -=
    actualSpent


   /*
   SAVE PORTFOLIO
   */
   await existingPortfolio.save()


   /*
   SUCCESS RESPONSE
   */
   res.status(200).json({

    message:
     "AI portfolio invested successfully",

    portfolio:
     existingPortfolio,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to invest in AI portfolio",

   })

  }

}