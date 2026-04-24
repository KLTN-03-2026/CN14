const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  rank: {
    type: String,
    default: "Member"
  }, // Diamond, Platinum, Gold, Silver, Member
  phone: {
    type: String,
    default: ""
  },
  points: {
    type: Number,
    default: 0, // tổng điểm hiện có
  },
  avatar: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  favorites: [
    {
      product_id: String
    }
  ],
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const User = mongoose.model('User', userSchema, "users");

module.exports = User;