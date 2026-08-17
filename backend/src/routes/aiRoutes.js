const express =
 require("express")

const router =
 express.Router()

const {
 getAIInsights,
} = require(
 "../controllers/aiController"
)

const auth =
 require("../middleware/authMiddleware")


/*
========================================
 AI INSIGHTS
========================================
*/

router.get(

 "/insights",

 auth,

 getAIInsights

)


module.exports =
 router