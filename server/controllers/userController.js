const { createError } = require("../middleware/errorhandler");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Listing = require("../model/listing");

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(createError(401, "you can only update your account"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return next(createError(403, "You are not allowed to do that"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("user has been logged out");
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "user not found"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(401, "you can only view your listings"));
  }
};

module.exports = {
  updateUser,
  deleteUser,
  logoutUser,
  getUser,
  getUserListing,
};
