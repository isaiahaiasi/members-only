const mongoose = require("mongoose");
const { Schema } = mongoose;

const { formatDistance } = require("date-fns");
const msgSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

msgSchema.virtual("created_at_formatted").get(function () {
  return formatDistance(this.created_at, Date.now(), { addSuffix: true });
});

module.exports = mongoose.model("msg", msgSchema);
