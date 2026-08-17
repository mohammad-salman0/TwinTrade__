const Portfolio =
 require("../models/Portfolio")

const Order =
 require("../models/Order")


/*
================================
 BUY STOCK
================================
*/

exports.buyStock =
 async (req, res) => {

  try {

   let {

    symbol,
    companyName,
    quantity,
    price,

   } = req.body


   /*
   =================================
   CONVERT TO NUMBERS
   =================================
   */

   quantity =
    Number(quantity)

   price =
    Number(price)


   /*
   =================================
   VALIDATE INPUTS
   =================================
   */

   if (
    !symbol ||
    quantity <= 0 ||
    price <= 0
   ) {

    return res.status(400).json({

     message:
      "Invalid trade data",

    })

   }


   /*
   =================================
   TOTAL AMOUNT
   =================================
   */

   const totalAmount =

    Number(
     (
      quantity * price
     ).toFixed(2)
    )


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


   if (!portfolio) {

    return res.status(404).json({

     message:
      "Portfolio not found",

    })

   }


   /*
   =================================
   CHECK BALANCE
   =================================
   */

   if (
    portfolio.balance <
    totalAmount
   ) {

    return res.status(400).json({

     message:
      "Insufficient balance",

    })

   }


   /*
   =================================
   UPDATE BALANCE
   =================================
   */

   portfolio.balance =

    Number(
     (
      portfolio.balance -
      totalAmount
     ).toFixed(2)
    )


   portfolio.investedAmount =

    Number(
     (
      portfolio.investedAmount +
      totalAmount
     ).toFixed(2)
    )


   /*
   =================================
   FIND EXISTING HOLDING
   =================================
   */

   const existingHolding =
    portfolio.holdings.find(

     (item) =>

      item.symbol
       .toUpperCase()

      ===

      symbol
       .toUpperCase()

    )


   /*
   =================================
   UPDATE EXISTING
   =================================
   */

   if (existingHolding) {

    const oldValue =

     existingHolding.quantity *

     existingHolding.averagePrice


    const newValue =
     quantity * price


    const totalQuantity =

     existingHolding.quantity +
     quantity


    existingHolding.averagePrice =

     Number(

      (
       (
        oldValue +
        newValue
       ) / totalQuantity
      ).toFixed(2)

     )


    existingHolding.quantity =
     totalQuantity

   }

   /*
   =================================
   CREATE NEW HOLDING
   =================================
   */

   else {

    portfolio.holdings.push({

     symbol,

     quantity,

     averagePrice:
      price,

     currentPrice:
      price,

     currentValue:
      totalAmount,

     profitLoss: 0,

    })

   }


   /*
   =================================
   SAVE PORTFOLIO
   =================================
   */

   await portfolio.save()


   /*
   =================================
   CREATE ORDER
   =================================
   */

   await Order.create({

    user:
     req.user.id,

    symbol,

    companyName,

    orderType:
     "BUY",

    quantity,

    price,

    totalAmount,

   })


   /*
   =================================
   RESPONSE
   =================================
   */

   res.status(200).json({

    message:
     "Stock purchased successfully",

    portfolio,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to buy stock",

   })

  }

}


/*
================================
 SELL STOCK
================================
*/

exports.sellStock =
 async (req, res) => {

  try {

   let {

    symbol,
    quantity,
    price,

   } = req.body


   /*
   =================================
   CONVERT TO NUMBERS
   =================================
   */

   quantity =
    Number(quantity)

   price =
    Number(price)


   /*
   =================================
   VALIDATE INPUTS
   =================================
   */

   if (
    !symbol ||
    quantity <= 0 ||
    price <= 0
   ) {

    return res.status(400).json({

     message:
      "Invalid trade data",

    })

   }


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


   if (!portfolio) {

    return res.status(404).json({

     message:
      "Portfolio not found",

    })

   }


   /*
   =================================
   FIND HOLDING INDEX
   =================================
   */

   const holdingIndex =

    portfolio.holdings.findIndex(

     (item) =>

      item.symbol
       .toUpperCase()

      ===

      symbol
       .toUpperCase()

    )


   if (holdingIndex === -1) {

    return res.status(400).json({

     message:
      "Stock not owned",

    })

   }


   const holding =

    portfolio.holdings[
     holdingIndex
    ]


   /*
   =================================
   VALIDATE SHARES
   =================================
   */

   if (
    holding.quantity <
    quantity
   ) {

    return res.status(400).json({

     message:
      "Insufficient shares",

    })

   }


   /*
   =================================
   TOTAL SELL VALUE
   =================================
   */

   const totalAmount =

    Number(
     (
      quantity * price
     ).toFixed(2)
    )


   /*
   =================================
   CALCULATE PROFIT
   =================================
   */

   const investedValue =

    Number(
     (
      quantity *
      holding.averagePrice
     ).toFixed(2)
    )


   const profit =

    Number(
     (
      totalAmount -
      investedValue
     ).toFixed(2)
    )


   /*
   =================================
   UPDATE HOLDING
   =================================
   */

   holding.quantity -=
    quantity


   /*
   =================================
   REMOVE EMPTY HOLDING
   =================================
   */

   if (
    holding.quantity <= 0
   ) {

    portfolio.holdings.splice(
     holdingIndex,
     1
    )

   }


   /*
   =================================
   UPDATE BALANCE
   =================================
   */

   portfolio.balance =

    Number(
     (
      portfolio.balance +
      totalAmount
     ).toFixed(2)
    )


   /*
   =================================
   UPDATE PROFIT
   =================================
   */

   portfolio.totalProfit =

    Number(
     (
      portfolio.totalProfit +
      profit
     ).toFixed(2)
    )


   /*
   =================================
   SAVE
   =================================
   */

   await portfolio.save()


   /*
   =================================
   CREATE ORDER
   =================================
   */

   await Order.create({

    user:
     req.user.id,

    symbol,

    companyName:
     symbol,

    orderType:
     "SELL",

    quantity,

    price,

    totalAmount,

   })


   /*
   =================================
   RESPONSE
   =================================
   */

   res.status(200).json({

    message:
     "Stock sold successfully",

    portfolio,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to sell stock",

   })

  }

}


/*
================================
 GET USER ORDERS
================================
*/

exports.getOrders =
 async (req, res) => {

  try {

   const orders =
    await Order.find({

     user:
      req.user.id,

    })

    .sort({

     createdAt: -1,

    })


   res.status(200).json(
    orders
   )

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch orders",

   })

  }

}