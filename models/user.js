const mongoose = require(`mongoose`);
const {schema} = require("./review");
const passportLocalMongoose = require("passport-local-mongoose");

const userImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  img: userImageSchema,
});

userSchema.plugin(passportLocalMongoose); // it create username and password schema for us and make sure username isn`t dupicated
module.exports = mongoose.model("User", userSchema);
