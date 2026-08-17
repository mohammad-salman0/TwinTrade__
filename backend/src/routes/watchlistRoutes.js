const express =
  require("express");

const router =
  express.Router();

const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require(
  "../controllers/watchlistController"
);

const authMiddleware =
  require("../middleware/authMiddleware");


router.get(
  "/",
  authMiddleware,
  getWatchlist
);

router.post(
  "/add",
  authMiddleware,
  addToWatchlist
);

router.post(
  "/remove",
  authMiddleware,
  removeFromWatchlist
);

module.exports = router;