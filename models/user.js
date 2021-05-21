const mongoose = require(`mongoose`);
const {schema} = require("./review");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose); // it create username and password schema for us and make sure username isn`t dupicated
module.exports = mongoose.model("User", userSchema);
