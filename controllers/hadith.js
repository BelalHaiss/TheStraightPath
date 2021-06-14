const e = require("express");
const {array} = require("joi");
const {HadithModel} = require("../models/hadith");
const {isAuthorizedForReview} = require("../utilities/middleware");
const {imageEditValidation} = require("../utilities/joi");
const {cloudinary} = require("../cloudinary");
const sanitizeHtml = require("sanitize-html");
const {uploadImage} = require("../utilities/alter");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const Hadiths = await HadithModel.find({});

  res.render("hadith/index", {Hadiths});
};

module.exports.newForm = (req, res) => {
  res.render("hadith/new");
};

module.exports.show = async (req, res, next) => {
  const {id} = req.params;
  const hadith = await HadithModel.findById(id)
    .populate({path: "reviews", populate: {path: "userName"}})
    .populate("userName");
  if (!hadith) {
    req.flash("error", "There no hadith exist");
    return res.redirect("/hadith");
  }
  req.session.returnTo = req.originalUrl;

  res.render("hadith/show", {hadith});
};
module.exports.postNewForm = async (req, res, next) => {
  const newHadith = new HadithModel(req.body.Hadith);
  newHadith.userName = req.user._id;
  await uploadImage(req, newHadith);

  await newHadith.save();
  req.flash("success", "successfully Create A new Hadith :)");
  res.redirect(`/hadith/${newHadith._id}`);
};

module.exports.editForm = async (req, res, next) => {
  const {id} = req.params;
  const hadith = await HadithModel.findById(id);
  if (!hadith) {
    req.flash("error", "There no hadith exist");
    return res.redirect("/hadith");
  }
  res.render("hadith/edit", {hadith});
};
module.exports.postEditForm = async (req, res, next) => {
  const {id} = req.params;
  const updatedHadith = await HadithModel.findByIdAndUpdate(
    id,
    {...req.body.Hadith},
    {runValidators: true}
  );
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedHadith.updateOne({
      $pull: {images: {filename: {$in: req.body.deleteImages}}},
    });
  }
  const images = req.files.map((f) => ({url: f.path, filename: f.filename}));
  if (await imageEditValidation(updatedHadith, images, req)) {
    req.flash("success", " The Hadith is successfully Edited :)");
  }
  req.flash("success", " The Hadith is successfully Edited :)");

  res.redirect(`/hadith/${id}`);
};
module.exports.deleteHadith = async (req, res, next) => {
  const {id} = req.params;
  await HadithModel.findByIdAndDelete(id);
  req.flash("success", "successfully Deleted The Hadith :)");
  res.redirect("/hadith");
};
