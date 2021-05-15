const express = require("express");
const router = express.Router({mergeParams: true});
const Joi = require("joi");
const Review = require("../models/review");
const {validateHadith, reviewValidation} = require("../utilities/joi.js");
const {wrapAsync} = require("../utilities/wrapAsync");
const theReview = require('../controllers/reviews')
const appError = require("../utilities/appError");
const HadithModel = require("../models/hadith");
const {isAuthenticated,isAuthorizedForReview} = require("../utilities/middleware");


router.post(
  "/",
  isAuthenticated,
    reviewValidation,
  wrapAsync(theReview.postReview)
);

router.delete(
  "/:reviewID",
  isAuthenticated,isAuthorizedForReview,
  wrapAsync(theReview.deleteReview)
);

module.exports = router;
