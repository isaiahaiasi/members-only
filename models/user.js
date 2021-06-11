const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String, required: true },
  password: { type: String, minLength: 8, required: true },
  member_role: {
    type: String,
    enum: ["user", "club-member", "admin"],
    default: "user",
  },
});

userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("user", userSchema);
