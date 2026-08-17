const Stock = require("../models/Stock");

const startStockUpdates = async (io) => {

  setInterval(async () => {

    try {

      const stocks = await Stock.find();

      for (let stock of stocks) {

        // random price movement
        const randomChange =
          (Math.random() * 10 - 5).toFixed(2);

        const oldPrice = stock.price;

stock.previousPrice = oldPrice;

stock.price =
  Number(stock.price) + Number(randomChange);

stock.change =
  stock.price - oldPrice;

        await stock.save();
      }

      const updatedStocks = await Stock.find();

      // emit updated stocks
      io.emit("stockUpdates", updatedStocks);

      console.log("Live stock updates sent");

    } catch (error) {

      console.log(error);
    }

  }, 5000);
};

module.exports = startStockUpdates;