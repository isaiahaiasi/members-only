const express = require("express");
const router = express.Router();
const passport = require("passport");
const signupController = require("../controllers/signupController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log in form" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Sign up form" });
});

router.post("/signup", signupController.signupPost);

module.exports = router;
