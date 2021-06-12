require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// passportjs
const session = require("express-session");
const passport = require("passport");
const {
  getLocalStrategy,
  handleUserSerialization,
  handleUserDeserialization,
} = require("./passportHandler");

const indexRouter = require("./routes/index");

// mongo setup
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo connection error: "));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// passportjs setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // TODO: store: sessionStore ???
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

passport.use(getLocalStrategy());
passport.serializeUser(handleUserSerialization);
passport.deserializeUser(handleUserDeserialization);

app.use(passport.initialize());
app.use(passport.session());

// middleware to add current user to res.locals
// this allows views to access it by default
const addUserToLocals = (req, res, next) => {
  res.locals.user = req.user;
  next();
};
app.use(addUserToLocals);

// defaults
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
// TODO: forward to custom 404 page
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
