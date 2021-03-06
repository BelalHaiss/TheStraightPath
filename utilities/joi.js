const sanitizeHtml = require("sanitize-html");
const BaseJoi = require("joi");
const appError = require("./appError");
const {cloudinary} = require("../cloudinary/index");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", {value});
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.validateHadith = (req, res, next) => {
  const hadithSchema = Joi.object({
    Hadith: Joi.object({
      narrator: Joi.string().required(),
      description: Joi.string().required().min(15),
      hadith: Joi.string().required().min(15),
    }).required(),
    deleteImages: Joi.array(),
  });
  const {error} = hadithSchema.validate(req.body);
  if (error) {
    removeImgs(req, res);
    const msg = error.details.map((el) => el.message).join(",");
    throw new appError(msg, 400);
  } else {
    next();
  }
};

module.exports.reviewValidation = (req, res, next) => {
  const reviewJoiSchema = Joi.object({
    review: Joi.object({
      comment: Joi.string().required(),
      rating: Joi.number().required(),
    }).required(),
  });
  const {error} = reviewJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new appError(msg, 400);
  } else {
    next();
  }
};

const removeImgs = async (req, res) => {
  const allimgs = req.files.map((el) => el.filename);
  for (let imgs of allimgs) {
    await cloudinary.uploader.destroy(imgs);
  }
};

module.exports.imageValidation = (req, res, next) => {
  const imageSchema = Joi.array().max(6).required();
  const {error} = imageSchema.validate(req.files);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new appError(msg, 400);
  } else {
    next();
  }
};
module.exports.imageEditValidation = async (updatedHadith, images, req) => {
  const length = updatedHadith.images.length;
  const max = 6;
  if (images.length + length <= max) {
    updatedHadith.images.push(...images);
    await updatedHadith.save();
    return true;
  } else {
    req.flash("error", "Sorry you can`t have more than 6 images");
    return false;
  }
};

module.exports.validateRegister = (pw, email) => {
  const pwREG = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])/;
  const emailREG = /^([a-zA-Z0-9_\-?\.?]){3,}@([a-zA-Z]){3,}\.([a-zA-Z]){2,5}$/;
  if (pwREG.test(pw) && emailREG.test(email)) {
    return true;
  } else {
    return false;
  }
};
