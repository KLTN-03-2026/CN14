const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: { type: String, slug: "title", unique: true },
  createBy: {
    user_Id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  deletedBy: {
    user_Id: String,
    deletedAt: Date,
  },
  updatedBy: [
    {
      user_Id: String,
      updatedAt: Date,
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
},
  {
    timestamps: true,
  });

const Category = mongoose.model('Category', categorySchema, "categories");

module.exports = Category; 