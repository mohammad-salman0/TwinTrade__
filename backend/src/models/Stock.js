const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    sector: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    halalStatus: {
      type: String,
      enum: ["Halal", "Non-Halal", "Review Needed"],
      default: "Review Needed",
    },

    marketCap: {
      type: Number,
      default: 0,
    },

    debtRatio: {
      type: Number,
      default: 0,
    },
    previousPrice: {
  type: Number,
  default: 0,
},

change: {
  type: Number,
  default: 0,
},
halalConfidence: {
  type: Number,
  default: 0,
},

halalReasons: {
  type: [String],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);