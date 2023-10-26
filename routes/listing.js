const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
//Index Route
router.get(
  "/",
  wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path:"reviews", populate:{path:"author"}})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing that you have requested, does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    console.log(newListing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit/",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing that you have requested, does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");

    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
