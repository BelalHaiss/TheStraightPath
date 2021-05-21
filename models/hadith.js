const mongoose = require("mongoose");
const {schema} = require("./review");
const Schema = mongoose.Schema;

const Review = require("./review");
const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
imageSchema.virtual("fit").get(function () {
  return this.url.replace("/upload", "/upload/w_400,c_fit");
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

module.exports = mongoose.model("Hadith", HadithSchema);
