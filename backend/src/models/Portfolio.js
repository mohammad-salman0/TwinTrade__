const mongoose =
 require("mongoose")


const portfolioSchema =
 new mongoose.Schema({

  user: {

   type:
    mongoose.Schema.Types.ObjectId,

   ref: "User",

   required: true,

  },


  /*
  ================================
   WALLET
  ================================
  */

  balance: {

   type: Number,

   default: 0,

  },


  /*
  ================================
   TOTAL INVESTED
  ================================
  */

  investedAmount: {

   type: Number,

   default: 0,

  },


  /*
  ================================
   TOTAL PROFIT / LOSS
  ================================
  */

  totalProfit: {

   type: Number,

   default: 0,

  },


  /*
  ================================
   HOLDINGS
  ================================
  */

  holdings: [

   {

    /*
    STOCK SYMBOL
    */
    symbol: {

     type: String,

     required: true,

    },


    /*
    TOTAL SHARES
    */
    quantity: {

     type: Number,

     default: 0,

    },


    /*
    BUY PRICE
    */
    averagePrice: {

     type: Number,

     default: 0,

    },


    /*
    CURRENT MARKET PRICE
    */
    currentPrice: {

     type: Number,

     default: 0,

    },


    /*
    LIVE HOLDING VALUE
    */
    currentValue: {

     type: Number,

     default: 0,

    },


    /*
    PROFIT / LOSS
    */
    profitLoss: {

     type: Number,

     default: 0,

    },

   },

  ],

 })


module.exports =
 mongoose.model(
  "Portfolio",
  portfolioSchema
 )