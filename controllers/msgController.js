const Msg = require("../models/msg");
const { authorizeUser } = require("../passportHandler");

// ! not sure where this should actually go...
const getMsgs = async (user) => {
  const msgs = Msg.find({})
    .sort({ created_at: -1 })
    .limit(100)
    .populate("user");

  console.log(user);

  if (user && user.member_role !== "user") {
    return msgs.exec();
  } else {
    const filteredMsgs = await msgs.lean().exec();

    return filteredMsgs.map((msg) => {
      msg.created_at_formatted = "???";
      msg.user = {
        username: "???",
      };

      return msg;
    });
  }
};

// * HANDLER FOR /MSG <GET>
const msgRender = (req, res, next) => {
  res.render("msg", { title: "post your comment" });
};

const msgGet = [authorizeUser, msgRender];

// * HANDLER FOR /MSG <POST>
const addMsg = async (req, res, next) => {
  const { title, content } = req.body;
  const msg = new Msg({ title, content, user: req.user._id });
  await msg.save().catch(next);
  res.redirect("/");
};

const msgPost = [authorizeUser, addMsg];

module.exports = { msgGet, msgPost, getMsgs };
