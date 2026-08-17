const mongoose =
 require("mongoose");

const orderSchema =
 new mongoose.Schema({

  user: {

   type:
    mongoose.Schema.Types.ObjectId,

   ref: "User",

   required: true,

  },

  symbol: {

   type: String,

   required: true,

  },

  companyName: {

   type: String,

   required: true,

  },

  orderType: {

   type: String,

   enum: [
    "BUY",
    "SELL",
   ],

   required: true,

  },

  quantity: {

   type: Number,

   required: true,

  },

  price: {

   type: Number,

   required: true,

  },

  totalAmount: {

   type: Number,

   required: true,

  },

  status: {

   type: String,

   default:
    "COMPLETED",

  },

  createdAt: {

   type: Date,

   default: Date.now,

  },

 });

module.exports =
 mongoose.model(
  "Order",
  orderSchema
 );