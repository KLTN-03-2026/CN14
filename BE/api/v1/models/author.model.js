const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const authorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  excerpt: String,
  bio: String,
  avatar: String,
  birthday: Date,
  slug: { type: String, slug: "fullName", unique: true },
  deleted: {
    type: Boolean,
    default: false
  },
  createBy: {
    user_Id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deletedBy: {
    user_Id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      user_Id: String,
      updatedAt: Date
    }
  ],
  deletedAt: Date
},
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', authorSchema, "authors");

module.exports = Author; 