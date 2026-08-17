const mongoose =
 require("mongoose");

const walletTransactionSchema =
 new mongoose.Schema(

  {

   user: {

    type:
     mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,

   },

   type: {

    type: String,

    enum: [

     "DEPOSIT",
     "WITHDRAW",

    ],

    required: true,

   },

   amount: {

    type: Number,

    required: true,

   },

  },

  {

   timestamps: true,

  }

 );

module.exports =
 mongoose.model(

  "WalletTransaction",

  walletTransactionSchema

 );