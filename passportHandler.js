const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

const getLocalStrategy = () =>
  new LocalStrategy(async (username, pw, done) => {
    const user = await User.findOne({ username }).exec().catch(done);

    if (!user) {
      console.log("Incorrect username");
      return done(null, false, {
        param: "username",
        msg: "Incorrect username",
      });
    }

    const res = await bcrypt.compare(pw, user.password).catch(done);

    if (!res) {
      console.log("Incorrect password");
      return done(null, false, {
        param: "password",
        msg: "Incorrect password",
      });
    }

    return done(null, user);
  });

const handleUserSerialization = (user, done) => done(null, user.id);
const handleUserDeserialization = (id, done) => User.findById(id, done);

const authorizeUser = (req, res, next) =>
  req.user ? next() : res.redirect("/login");

module.exports = {
  getLocalStrategy,
  handleUserSerialization,
  handleUserDeserialization,
  authorizeUser,
};
