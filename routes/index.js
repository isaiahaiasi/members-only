const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const msgController = require("../controllers/msgController");
const upgradeController = require("../controllers/upgradeController");

// INDEX
router.get("/", async function (req, res, next) {
  try {
    const msgs = await msgController.getMsgs(req.user);
    res.render("index", { title: "Express", msgs });
  } catch (error) {
    next(error);
  }
});

// LOGOUT
router.post("/logout", authController.logoutPost);

// LOGIN
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log in form" });
});

router.post("/login", authController.loginPost);

// SIGNUP
router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Sign up form" });
});

router.post("/signup", authController.signupPost);

// MSG
router.get("/msg", msgController.msgGet);
router.post("/msg", msgController.msgPost);

router.post("/msg/:msgid/delete", msgController.msgDelete);

// UPGRADE
router.get("/upgrade", upgradeController.upgradeGet);
router.post("/upgrade", upgradeController.upgradePost);

module.exports = router;
