const { authorizeUser } = require("../passportHandler");

const msgRender = (req, res, next) => {
  res.render("comment", { title: "post your comment" });
};

const msgGet = [authorizeUser, msgRender];

module.exports = { msgGet };
