const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  member_role: { type: String, enum: ["user", "club-member", "admin"] },
});

memberSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("member", memberSchema);
