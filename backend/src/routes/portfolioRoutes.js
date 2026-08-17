const express =
 require("express");

const router =
 express.Router();

const authMiddleware =
 require(
  "../middleware/authMiddleware"
 );

const {

 getPortfolio,

} = require(
 "../controllers/portfolioController"
);


// GET USER PORTFOLIO
router.get(

 "/",

 authMiddleware,

 getPortfolio

);

module.exports =
 router;