const mongoose = require("mongoose");
const User = require("./models/user");

const foundUser = User.findOne({username: "mam"}).then((out) => out);
console.log(foundUser);
