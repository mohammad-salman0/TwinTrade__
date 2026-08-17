const {
 generatePortfolioInsights,
} = require(
 "../services/aiPortfolioService"
)


/*
========================================
 GET AI INSIGHTS
========================================
*/

exports.getAIInsights =
 async (req, res) => {

  try {

   const insights =

    await generatePortfolioInsights(

     req.user.id

    )


   res.status(200).json(
    insights
   )

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to generate AI insights",

   })

  }

}