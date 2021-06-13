const { authorizeUser } = require("../passportHandler");
const User = require("../models/user");

// TODO: validation functions

// * HANDLER FOR /UPGRADE <GET>
const upgradeRender = async (req, res, next) => {
  res.render("upgrade", { title: "Upgrade membership status" });
};

const upgradeGet = [authorizeUser, upgradeRender];

// * HANDLER FOR /UPGRADE <POST>
const upgradeUser = async (req, res, next) => {
  console.log("upgrading user...");
  if (!req.user) {
    next(new Error("Unrecognized user"));
  }

  const { role, secret } = req.body;

  if (role === "club-member" && secret === process.env.CM_SECRET) {
    // upgrade user to 'club-member'
    await User.findByIdAndUpdate(req.user._id, { member_role: "club-member" });
  } else if (role === "admin" && secret === process.env.ADMIN_SECRET) {
    // upgrade user to 'admin'
    await User.findByIdAndUpdate(req.user._id, { member_role: "admin" });
  } else {
    res.render("upgrade", {
      title: "Invalid secret",
      errors: [{ param: "secret", msg: "Invalid secret" }],
    });
  }

  res.redirect("/");
};

const upgradePost = [
  // TODO: validation
  authorizeUser,
  upgradeUser,
];

module.exports = { upgradeGet, upgradePost };
