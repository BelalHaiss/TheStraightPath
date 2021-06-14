const mongoose = require("mongoose");
const {schema} = require("./review");
const Schema = mongoose.Schema;

const Review = require("./review");
const imageSchema = new Schema({
  url: {
    type: String,
  },
  profileUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/belalhaiss10/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1622061143/profileImg/blank_xi6zex.jpg",
  },
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
imageSchema.virtual("fit").get(function () {
  return this.profileUrl.replace(
    "/upload",
    "/upload/w_350,h_350,c_fit,c_fill,ar_1:1,g_auto,r_max/q_auto"
  );
});
const HadithSchema = new Schema({
  narrator: {
    type: String,
    // required: [true, "You have to enter Narrator Name"]
  },
  hadith: {
    type: String,
    // required: true
  },
  images: [imageSchema],
  description: {
    type: String,
    // required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  userName: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

HadithSchema.post("findOneAndDelete", async (data) => {
  if (data.reviews.length) {
    await Review.deleteMany({_id: {$in: data.reviews}});
  }
});
const HadithModel = mongoose.model("Hadith", HadithSchema);

module.exports = {
  HadithModel,
  imageSchema,
};
