const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getSeachListings,
  testRoute,
} = require("../controllers/listingController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/search", getSeachListings);
router.get("/test", testRoute);
router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/:id", getListing);

module.exports = router;
