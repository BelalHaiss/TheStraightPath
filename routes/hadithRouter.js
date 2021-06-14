const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  validateHadith,
  reviewValidation,
  imageValidation,
} = require("../utilities/joi.js");
const {wrapAsync} = require("../utilities/wrapAsync");
const {isAuthenticated, isAuthorized} = require("../utilities/middleware");
const appError = require("../utilities/appError");
const HadithModel = require("../models/hadith");
const theHadith = require("../controllers/hadith");
const multer = require("multer");
const {storage, cloudinary} = require("../cloudinary");
const fileSize = {
  fileSize: 1024 * 1024 * 2,
  files: 6,
};
const upload = multer({storage, limits: fileSize});
const axios = require("axios");
let tempData = {};

router.route("/").get(wrapAsync(theHadith.index)).post(
  isAuthenticated,
  upload.array("image"),
  validateHadith,
  imageValidation,

  wrapAsync(theHadith.postNewForm)
);

router.get("/new", isAuthenticated, theHadith.newForm);

router
  .route("/search")
  .get(async (req, res) => {
    if (Object.keys(tempData).length === 0) {
      req.flash("error", "بامكانك البحث عن اي حديث تريد في صندوق البحث");
      return res.render("hadith/search", {tempData: null});
    } else {
      res.render("hadith/search", {tempData});
    }
  })
  .post(async (req, res) => {
    searchValue = req.body.search;
    const url = `https://dorar.net/dorar_api.json?skey=${searchValue}`;
    const response = await axios.get(encodeURI(url));
    const apiResponse = await response.data.ahadith.result;
    tempData = apiResponse;
    if (Object.keys(tempData).length === 68) {
      req.flash("error", "بامكانك البحث عن اي حديث تريد في صندوق البحث");
    }
    res.redirect("/hadith/search");
  });

// handling error without wrapAsync Function
router
  .route("/:id")
  .get(wrapAsync(theHadith.show))
  .patch(
    isAuthenticated,
    isAuthorized,
    upload.array("image"),
    validateHadith,
    wrapAsync(theHadith.postEditForm)
  )
  .delete(isAuthenticated, isAuthorized, wrapAsync(theHadith.deleteHadith));

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthorized,
  wrapAsync(theHadith.editForm)
);
router.get("*", (err, req, res, next) => {
  next(err);
});
module.exports = router;
