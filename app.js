if (process.env.NODE_ENV !== 'production') {
  require('dotEnv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const HadithModel = require('./models/hadith');
const mongoose = require('mongoose');
const cors = require('cors');
const appError = require('./utilities/appError');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const Review = require('./models/review');
const hadithRoutes = require('./routes/hadithRouter');
const reviewRoutes = require('./routes/reviewRouter');
const { validateHadith, reviewValidation } = require('./utilities/joi');
const { wrapAsync } = require('./utilities/wrapAsync');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRouters = require('./routes/userRouter');
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
const helmet = require('helmet');
const { urls } = require('./utilities/url');
const { response } = require('express');
const MongoStore = require('connect-mongo');
// process.env.dbUrl || this will be on the next line
const dbUrl = 'mongodb://localhost:27017/Ahadith';
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Mongo server Running');
  })
  .catch((e) => {
    console.log('Error with the Mongo Server');
    console.log(e);
  });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(mongoSanitize());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ['http://dorar.net/'],
      scriptSrc: ["'unsafe-inline'", "'self'", ...urls.scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...urls.styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/belalhaiss10/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/'
      ],
      fontSrc: ["'self'", ...urls.fontSrcUrls]
    }
  })
);
const secret = process.env.secret || '@#%%@#EDSsdfsdkfdkdk_s';
const store = new MongoStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  req.flash(
    'success',
    'welcome to our lovely website please register now, add hadith and Enrich us  :) '
  );
  res.render('home');
});

app.use('/', userRouters);
app.use('/hadith', hadithRoutes);
app.use('/hadith/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  next(new appError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Oh Boy, something went wrong';
  res.status(status).render('error/error', { err });
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('server Running'));
