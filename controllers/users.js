const User = require("../models/user");
const {validateRegister} = require("../utilities/joi");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.postRegister = async (req, res, next) => {
  const {username, password, email} = req.body;
  console.log(validateRegister(password, email));
  if (validateRegister(password, email)) {
    const user = await new User({username, email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Thanks For Signing up");
      res.redirect("/hadith");
    });
  } else {
    req.flash("error", "please check your email and password");

    // req.flash("error", `${e.message}`);
    res.redirect("register");
  }
};
module.exports.loginForm = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "welcome Back !");
  const url = req.session.returnTo || "/hadith";
  delete req.session.returnTo;
  res.redirect(url);
};
module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", "Goodbye !");
  res.redirect("/hadith");
};
