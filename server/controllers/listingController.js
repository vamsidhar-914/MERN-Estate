const { createError } = require("../middleware/errorhandler");
const Listing = require("../model/listing");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(createError(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(createError(401, "you are not allowed to do that"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing deleted Succesfully");
  } catch (err) {
    next(err);
  }
};

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(createError(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(createError(401, "You can only update your own phone"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
};

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(createError(404, "there are no listings with this id"));
    }
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
};
