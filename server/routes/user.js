const express = require("express");
const { verifyToken } = require("../middleware/verifyJWT");
const {
  deleteUser,
  getUser,
  updateUser,
  logoutUser,
  getUserListing,
} = require("../controllers/userController");
const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/logout", logoutUser);
router.get("/:id", verifyToken, getUser);
router.get("/listings/:id", verifyToken, getUserListing);

module.exports = router;
