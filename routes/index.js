const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const msgController = require("../controllers/msgController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log in form" });
});

router.post("/login", authController.loginPost);

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Sign up form" });
});

router.post("/signup", authController.signupPost);

router.post("/logout", authController.logoutPost);

router.get("/msg", msgController.msgGet);

module.exports = router;
