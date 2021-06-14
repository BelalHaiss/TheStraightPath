const { HadithModel } = require('../models/hadith');
const reviewModel = require('../models/review');
const AppError = require('./appError');

module.exports.isAuthenticated = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be sign in');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthorized = async (req, res, next) => {
  const { id } = req.params;
  const hadith = await HadithModel.findById(id);
  if (!hadith.userName.equals(req.user._id)) {
    req.flash('error', 'You dont have premssion for that');
    return res.redirect(`/hadith/${id}`);
  }
  next();
};
module.exports.isAuthorizedForReview = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await reviewModel.findById(reviewID);
  if (!review.userName.equals(req.user._id)) {
    req.flash('error', 'You dont have premssion for that');
    return res.redirect(`/hadith/${id}`);
  }
  next();
};
module.exports.isAuthorizedUser = (req, res, next) => {
  const { id } = req.params;
  if (id === req.user.id) return next();

  next(Error('you don`t have permission for this page'));
};

module.exports.isRegisterable = (req, res, next) => {
  if (req.user)
    return next(new AppError('you can`t sign up while your logining'));
  next();
};
