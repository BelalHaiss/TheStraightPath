const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {wrapAsync} = require("../utilities/wrapAsync");
const users = require('../controllers/users')


router.route("/register")
.get(users.registerForm)
.post(  wrapAsync(users.postRegister));

router.route('/login')
.get(users.loginForm)
.post(  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login",}),users.login);
  
router.get("/logout", users.logout);
module.exports = router;
