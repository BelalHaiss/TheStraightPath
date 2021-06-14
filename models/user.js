const mongoose = require(`mongoose`);
const {schema} = require("./review");
const {imageSchema} = require("./hadith");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profileImage: {
    type: imageSchema,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose, {usernameField: "email"}); // it create username and password schema for us and make sure username isn`t dupicated
module.exports = mongoose.model("User", userSchema);
