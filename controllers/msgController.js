const Msg = require("../models/msg");
const { authorizeUser } = require("../passportHandler");

// ! not sure where this should actually go...
const getMsgs = async () => {
  const msgs = await Msg.find({})
    .sort({ created_at: -1 })
    .limit(100)
    .populate("user")
    .exec();

  // TODO: format timestamp
  // TODO: any other changes to how I want to actually display the comments

  return msgs;
};

// * HANDLER FOR /MSG <GET>
const msgRender = (req, res, next) => {
  res.render("msg", { title: "post your comment" });
};

const msgGet = [authorizeUser, msgRender];

// * HANDLER FOR /MSG <POST>

const addMsg = async (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.user);
  const msg = new Msg({ title, content, user: req.user._id });
  await msg.save().catch(next);
  res.redirect("/");
};

const msgPost = [authorizeUser, addMsg];

module.exports = { msgGet, msgPost, getMsgs };
