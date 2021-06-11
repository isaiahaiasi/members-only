const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

// TODO: rewrite to be less... promise-hell-y
const getLocalStrategy = () =>
  new LocalStrategy((username, pw, done) => {
    User.findOne({ username })
      .exec()
      .then((user) => {
        if (!user) {
          console.log("Incorrect username");
          return done(null, false, { message: "Incorrect username" });
        }

        bcrypt
          .compare(pw, user.password)
          .then((res) => {
            if (!res) {
              console.log("Incorrect password");
              return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
          })
          .catch(done);
      })
      .catch(done);
  });

const handleUserSerialization = (user, done) => done(null, user.id);
const handleUserDeserialization = (id, done) => User.findById(id, done);

module.exports = {
  getLocalStrategy,
  handleUserSerialization,
  handleUserDeserialization,
};
