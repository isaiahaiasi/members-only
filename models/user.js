const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  password: { type: String },
  member_role: { type: String, enum: ["user", "club-member", "admin"] },
});

userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("user", userSchema);
