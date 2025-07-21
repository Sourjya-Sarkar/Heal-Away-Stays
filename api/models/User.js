const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
// This code defines a Mongoose model for a User, which includes fields for name, email, and password.
