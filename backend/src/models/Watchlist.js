const mongoose =
 require("mongoose")

const watchlistSchema =
 new mongoose.Schema({

  user: {

   type:
    mongoose.Schema.Types.ObjectId,

   ref: "User",

   required: true,

  },

  stocks: [

   {

    symbol: String,

    companyName: String,

    addedAt: {

     type: Date,

     default: Date.now,

    },

   },

  ],

 })


module.exports =
 mongoose.model(
  "Watchlist",
  watchlistSchema
 )