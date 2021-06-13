const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const passport = require("passport");

const User = require("../models/user");

const { handleValidationErrors } = require("../validationHelpers");

// * VALIDATE & SANITIZE
// ? blacklist characters instead of escaping?
const usernameValidator = body("username").trim().not().isEmpty();
const passwordValidator = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

const passwordsMatchValidator = body("password-confirm").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match!");
    } else {
      return true;
    }
  }
);

const usernameIsUniqueValidator = body("username").custom(async (value) => {
  const matchingUser = await User.findOne({ username: value })
    .exec()
    .catch((err) => {
      console.log(err);
      throw new Error("Something went wrong!");
    });

  if (matchingUser) {
    throw new Error(`Username "${matchingUser.username}" already exists`);
  } else {
    return true;
  }
});

// * TERMINAL ROUTE HANDLER FOR <POST> /SIGNUP
// assuming all validation has passed, register user
const registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // ! TODO? : Get a random salt each time, store in user record??
    const passwordHash = await bcrypt.hash(password, 10);

    // ! TODO? : Should hash (& salt) be stored in a record I'm NOT constantly pulling up??
    const user = new User({ username, password: passwordHash });
    await user.save();

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const signupValidators = [
  usernameValidator,
  passwordValidator,
  passwordsMatchValidator,
  usernameIsUniqueValidator,
];

// * ORCHESTRATED ROUTE HANDLER FOR <POST> /SIGNUP
// the final array of handlers passed to the route
// consists of: validators, error handlers, and terminal handler (ie, success renderer)
const signupPost = [
  ...signupValidators,
  handleValidationErrors("signup", { title: "Couldn't sign up!" }),
  registerUser,
];

// ! Cannot figure out how to pass validation error to redirect (url params I guess?)
// * TERMINAL ROUTE HANDLER FOR <POST> /LOGIN
const loginUser = (req, res, next) => {
  // ? should this be extracted?
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.locals.errors = [info];
      res.locals.title = "uhghh";
      console.log(res.locals);
      return res.redirect("/login");
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
};

const loginValidators = [usernameValidator, passwordValidator];

const loginPost = [
  ...loginValidators,
  handleValidationErrors("login", { title: "Couldn't log in!" }),
  loginUser,
];

// * HANDLER FOR <POST> /LOGOUT

const logoutPost = (req, res) => {
  req.logout();
  res.redirect("/");
};

module.exports = { signupPost, loginPost, logoutPost };
