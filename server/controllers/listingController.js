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

const getSeachListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

const testRoute = (req, res) => {
  res.json("hello");
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getSeachListings,
  testRoute,
};
