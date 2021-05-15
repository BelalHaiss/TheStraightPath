const HadithModel = require("../models/hadith");
const Review = require("../models/review");

module.exports.postReview=async (req, res) => {
    const foundedHadith = await HadithModel.findById(req.params.id).populate(
      "reviews"
    );
    const review = await new Review(req.body.review);
    foundedHadith.reviews.push(review);
    review.userName = req.user._id
    await review.save();
    await foundedHadith.save();
    req.flash("success", "successfully Created The review :)");

    res.redirect(`/hadith/${req.params.id}`);
  }
  module.exports.deleteReview =async (req, res, next) => {
    const {id, reviewID} = req.params;
    await HadithModel.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    const review = await Review.findByIdAndDelete(reviewID);
    req.flash("success", "successfully deleted The Review :)");

    res.redirect(`/hadith/${id}`);
  }