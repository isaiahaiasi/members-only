const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

// * VALIDATE & SANITIZE
// ? blacklist characters instead of escaping?
const usernameValidator = body("username").trim().not().isEmpty();
const passwordValidator = body(["password", "password-confirm"])
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

// * GENERIC VALIDATION HANDLER
// function that creates a middleware function for rendering the form rejection.
// takes the typical res.render arguments, then calls res.render with those + errors
// or calls next() if validation passes
const handleValidationErrors = (view, locals) => {
  return (req, res, next) => {
    const errorsArray = validationResult(req).array();

    // create a Map where [err.param]: [err]
    // ? Can't find built-in for making Map from Array? :hmm:
    // the downside of this approach is I'm creating a more burdensome dependency
    // for my Views, since Maps aren't really the assumed interface
    const errors = errorsArray.reduce(
      (acc, err) => acc.set(err.param, { msg: err.msg }),
      new Map()
    );

    if (errors.size > 0) {
      // create a copy of req.body with everything but entries containing "password"
      const filteredBody = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !key.includes("password"))
      );

      const allLocals = {
        ...locals,
        ...filteredBody,
        errors,
      };

      res.status(400).render(view, allLocals);
    } else {
      next();
    }
  };
};

// * TERMINAL ROUTE HANDLER
// assuming all validation has passed, register user
const registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

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

// * ORCHESTRATED ROUTE HANDLER
// the final array of handlers passed to the route
// consists of: validators, error handlers, and terminal handler (ie, success renderer)
const signupPost = [
  ...signupValidators,
  handleValidationErrors("signup", { title: "Couldn't sign up!" }),
  registerUser,
];

module.exports = { signupPost };
