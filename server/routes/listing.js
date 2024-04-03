const express = require("express");
const { createListing } = require("../controllers/listingController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/create", verifyToken, createListing);

module.exports = router;
