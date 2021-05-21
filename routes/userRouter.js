const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {wrapAsync} = require("../utilities/wrapAsync");
const users = require("../controllers/users");
const {isAuthenticated} = require("../utilities/middleware");

router.route("/user").get(isAuthenticated, (req, res) => {
  res.render("users/user");
});
router
  .route("/register")
  .get(users.registerForm)
  .post(wrapAsync(users.postRegister));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);
module.exports = router;
