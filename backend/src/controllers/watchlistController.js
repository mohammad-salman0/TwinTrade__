const Watchlist =
 require("../models/Watchlist")


/*
=================================
 GET WATCHLIST
=================================
*/

exports.getWatchlist =
 async (req, res) => {

  try {

   let watchlist =

    await Watchlist.findOne({

     user: req.user.id,

    })


   if (!watchlist) {

    watchlist =
     await Watchlist.create({

      user: req.user.id,

      stocks: [],

     })

   }


   res.status(200).json(
    watchlist
   )

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to fetch watchlist",

   })

  }

 }


/*
=================================
 ADD STOCK
=================================
*/

exports.addToWatchlist =
 async (req, res) => {

  try {

   const {
    symbol,
    companyName,
   } = req.body


   let watchlist =

    await Watchlist.findOne({

     user: req.user.id,

    })


   if (!watchlist) {

    watchlist =
     await Watchlist.create({

      user: req.user.id,

      stocks: [],

     })

   }


   /*
   ALREADY EXISTS
   */

   const exists =

    watchlist.stocks.find(

     (stock) =>

      stock.symbol ===
      symbol

    )


   if (exists) {

    return res.status(400).json({

     message:
      "Already in watchlist",

    })

   }


   watchlist.stocks.push({

    symbol,
    companyName,

   })


   await watchlist.save()


   res.status(200).json({

    message:
     "Added to watchlist",

    watchlist,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to add stock",

   })

  }

 }


/*
=================================
 REMOVE STOCK
=================================
*/

exports.removeFromWatchlist =
 async (req, res) => {

  try {

   const { symbol } =
    req.params


   const watchlist =

    await Watchlist.findOne({

     user: req.user.id,

    })


   if (!watchlist) {

    return res.status(404).json({

     message:
      "Watchlist not found",

    })

   }


   watchlist.stocks =

    watchlist.stocks.filter(

     (stock) =>

      stock.symbol !==
      symbol

    )


   await watchlist.save()


   res.status(200).json({

    message:
     "Removed from watchlist",

    watchlist,

   })

  } catch (error) {

   console.log(error)

   res.status(500).json({

    message:
     "Failed to remove stock",

   })

  }

 }