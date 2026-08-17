const Portfolio =
 require("../models/Portfolio");

const WalletTransaction =
 require(
  "../models/WalletTransaction"
 );


// ADD MONEY
const addMoney =
 async (req, res) => {

  try {

   const {
    amount,
   } = req.body;


   if (
    !amount ||
    amount <= 0
   ) {

    return res.status(400).json({

     message:
      "Invalid amount",

    });

   }


   const portfolio =
    await Portfolio.findOne({

     user:
      req.user.id,

    });


   if (!portfolio) {

    return res.status(404).json({

     message:
      "Portfolio not found",

    });

   }


   // UPDATE BALANCE
   portfolio.balance +=
    amount;


   await portfolio.save();


   // SAVE TRANSACTION
   await WalletTransaction.create({

    user:
     req.user.id,

    type:
     "DEPOSIT",

    amount,

   });


   res.status(200).json({

    message:
     "Money added successfully",

    balance:
     portfolio.balance,

   });

  } catch (error) {

   console.log(error);

   res.status(500).json({

    message:
     "Failed to add money",

   });

  }

};



// GET TRANSACTIONS
const getTransactions =
 async (req, res) => {

  try {

   const transactions =
    await WalletTransaction.find({

     user:
      req.user.id,

    })

    .sort({

     createdAt: -1,

    });


   res.status(200).json(
    transactions
   );

  } catch (error) {

   console.log(error);

   res.status(500).json({

    message:
     "Failed to fetch transactions",

   });

  }

};


module.exports = {

 addMoney,
 getTransactions,

};