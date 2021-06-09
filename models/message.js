const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "member", required: true },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("message", messageSchema);
