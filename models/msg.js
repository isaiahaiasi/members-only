const mongoose = require("mongoose");
const { Schema } = mongoose;

const msgSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("msg", msgSchema);
