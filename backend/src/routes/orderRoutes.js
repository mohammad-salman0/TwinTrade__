const express =
 require("express");

const router =
 express.Router();

const authMiddleware =
 require(
  "../middleware/authMiddleware"
 );

const {

 buyStock,
 sellStock,
 getOrders,

} = require(
 "../controllers/orderController"
);


// BUY
router.post(

 "/buy",

 authMiddleware,

 buyStock

);


// SELL
router.post(

 "/sell",

 authMiddleware,

 sellStock

);


// GET ORDERS
router.get(

 "/",

 authMiddleware,

 getOrders

);


module.exports =
 router;