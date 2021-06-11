const bcrypt = require("bcryptjs");
const User = require("../models/user");

const validators = [
  // TODO: custom validator to see password === passwordConfirm
  // https://express-validator.github.io/docs/custom-validators-sanitizers.html#example-checking-if-password-confirmation-matches-password
  // TODO: custom validator to see if username already exists
];

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

const signupPost = [...validators, registerUser];

module.exports = { signupPost };
