const { body } = require("express-validator");

const { handleValidationErrors } = require("../validationHelpers");
const { authorizeUser, authorizeAdmin } = require("../passportHelpers");

const Msg = require("../models/msg");
const mongoose = require("mongoose");

const titleValidator = body("title").not().isEmpty();
const contentValidator = body("content").isLength({ min: 5 });

// ! not sure where this should actually go...
const getMsgs = async (user) => {
  const msgs = Msg.find({})
    .sort({ created_at: -1 })
    .limit(100)
    .populate("user");

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
const msgRender = async (req, res) => {
  const msgs = await getMsgs(req.user);
  res.render("msg", { title: "post your comment", msgs });
};

const msgGet = [authorizeUser, msgRender];

// * HANDLER FOR /MSG <POST>
const addMsg = async (req, res, next) => {
  const { title, content } = req.body;
  const msg = new Msg({ title, content, user: req.user._id });
  await msg.save().catch(next);
  res.redirect("/");
};

const msgPost = [
  authorizeUser,
  titleValidator,
  contentValidator,
  handleValidationErrors("msg", { title: "Something went wrong" }),
  addMsg,
];

// * HANDLER FOR /MSG/:MSGID/DELETE
const deleteMsg = async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.msgid);
  const deletedMsg = Msg.findByIdAndDelete(id).catch(next);

  if (!deletedMsg) {
    next(new Error(`could not find msg with id ${req.params.msgid}`));
  }

  console.log("delete successful");
  res.redirect("index");
};

const msgDelete = [authorizeAdmin, deleteMsg];

module.exports = { msgGet, msgPost, msgDelete, getMsgs };
