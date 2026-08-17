const express =
 require("express");

const router =
 express.Router();

const authMiddleware =
 require(
  "../middleware/authMiddleware"
 );

const {

 addMoney,
 getTransactions,

} = require(
 "../controllers/walletController"
);


// ADD MONEY
router.post(

 "/add",

 authMiddleware,

 addMoney

);


// GET TRANSACTIONS
router.get(

 "/transactions",

 authMiddleware,

 getTransactions

);


module.exports =
 router;