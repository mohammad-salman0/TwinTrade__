const express =
 require("express")

const router =
 express.Router()

const {

 generateAdvice,
 investInPortfolio,

} = require(
 "../controllers/aiAdvisorController"
)

const authMiddleware =
 require("../middleware/authMiddleware")


/*
================================
 GENERATE AI ADVICE
================================
*/

router.post(

 "/generate",

 authMiddleware,

 generateAdvice

)


/*
================================
 INVEST IN PORTFOLIO
================================
*/

router.post(

 "/invest",

 authMiddleware,

 investInPortfolio

)


module.exports =
 router