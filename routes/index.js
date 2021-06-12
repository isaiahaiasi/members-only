const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log in form" });
});

router.post("/login", signupController.loginPost);

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Sign up form" });
});

router.post("/signup", signupController.signupPost);

module.exports = router;
