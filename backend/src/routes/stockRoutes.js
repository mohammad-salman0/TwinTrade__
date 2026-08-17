const express =
 require("express")

const router =
 express.Router()

const stockController =
 require(
  "../controllers/stockController"
)


// GET ALL STOCKS
router.get(
 "/",
 stockController.getAllStocks
)


// GET STOCK HISTORY
router.get(
 "/:symbol/history",
 stockController.getStockHistory
)


// GET STOCK BY SYMBOL
router.get(
 "/:symbol",
 stockController.getStockBySymbol
)


module.exports =
 router