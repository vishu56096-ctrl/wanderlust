const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const user = require("../models/user.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


router
     .route("/")
     .get(wrapAsync(listingController.index))
     .post(isLoggedIn,
          validateListing,
          upload.single('listing[image]'),
          wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
     .route("/:id")
     .get(wrapAsync(listingController.showListings))
     .put(isLoggedIn,
          isOwner,
          upload.single('image'),
          validateListing,
          wrapAsync(listingController.updateListing))
     .delete(isLoggedIn,
          isOwner,
          wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;













// delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// module.exports = router;


//index route
// router.get("/",wrapAsync(listingController.index));

//create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// show route
// router.get("/:id",wrapAsync(listingController.showListings));

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// module.exports = router;