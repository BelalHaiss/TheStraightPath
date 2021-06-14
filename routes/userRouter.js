const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { wrapAsync } = require('../utilities/wrapAsync');
const users = require('../controllers/users');
const AppError = require('../utilities/appError');
const multer = require('multer');
const { profileStorage, cloudinary } = require('../cloudinary/index');
const fileSize = {
  fileSize: 1024 * 1024 * 2,
  files: 1
};
const upload = multer({ storage: profileStorage, limits: fileSize });

const {
  isAuthenticated,
  isRegisterable,
  isAuthorizedUser
} = require('../utilities/middleware');

router
  .route('/users/:id')
  .get(isAuthenticated, isAuthorizedUser, (req, res) => {
    res.render('users/profile');
  })
  .post(
    isAuthenticated,
    isAuthorizedUser,
    upload.single('profileImage'),
    async (req, res, next) => {
      const { id } = req.params;
      if (req.file) {
        const { path, filename } = req.file;

        const foundUser = await User.findByIdAndUpdate(id, {
          profileImage: { profileUrl: path, filename }
        });
      }
      try {
        const foundUser = await User.findByIdAndUpdate(id, req.body.user);
        req.session.passport.user = req.body.user.email;

        req.flash('success', 'Your Profile Is updated successfully');
        return res.redirect('/users/' + id);
      } catch (e) {
        const duplicated = Object.keys(e.keyPattern);
        return next(
          new AppError(
            `this ${duplicated} already in use, you can enter another ${duplicated} `,
            406
          )
        );
      }
    }
  );
router
  .route('/users/:id/changePW')
  .get(isAuthenticated, isAuthorizedUser, (req, res) => {
    res.render('users/changepw');
  })
  .post(isAuthenticated, isAuthorizedUser, async (req, res, next) => {
    const { id } = req.params;
    const { oldpw, newpw } = req.body.password;
    const foundUser = await User.findById(id);
    const changedPw = await foundUser.changePassword(
      oldpw,
      newpw,
      (err, response) => {
        if (err) {
          console.log(err);
          return next(new AppError('please check your old password again'));
        } else {
          return res.redirect('/users/' + id);
        }
      }
    );
  });
router
  .route('/register')
  .get(isRegisterable, users.registerForm)
  .post(isRegisterable, wrapAsync(users.postRegister));

router
  .route('/login')
  .get(users.loginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    users.login
  );

router.get('/logout', users.logout);
module.exports = router;
