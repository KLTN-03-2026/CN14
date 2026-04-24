const mongoose = require("mongoose");

const verifyEmailSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    role: String, // register, order
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  { timestamps: true}
);

const VerifyEmail = mongoose.model("VerifyEmail", verifyEmailSchema, "verify-email");

module.exports = VerifyEmail;