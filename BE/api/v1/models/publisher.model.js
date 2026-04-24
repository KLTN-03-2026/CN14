const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  thumbnail: String,
  address: String,
  phone: String,
  email: String,
  slug: { type: String, slug: "name", unique: true },
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

const Publisher = mongoose.model('Publisher', publisherSchema, "publishers");

module.exports = Publisher; 