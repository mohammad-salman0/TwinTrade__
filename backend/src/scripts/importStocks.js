require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

const Stock = require("../models/Stock");

const nifty500 = require("../data/nifty500");

const screeningPipeline = require("../halal-engine/screeningPipeline");


const importStocks = async () => {

  try {

    await connectDB();

    // clear old stocks
    await Stock.deleteMany();

    const processedStocks = nifty500.map((stock) => {

      const screeningResult =
        screeningPipeline(stock);

      return {
        ...stock,
        halalStatus: screeningResult.status,

halalConfidence:
  screeningResult.confidence,

halalReasons:
  screeningResult.reasons,
      };
    });

    await Stock.insertMany(processedStocks);

    console.log("Stocks Imported Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

importStocks();