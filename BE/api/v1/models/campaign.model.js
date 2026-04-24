const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: String,
    thumbnail: String,
    images: [String], // Mảng chứa nhiều ảnh
    status: String,
    start_date: Date,
    end_date: Date,
    categories_id: [String],
    products_id: [String],
    brands_id: [String],
    slug: { type: String, slug: "title", unique: true },
    position: Number,
    createBy: {
      user_Id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    updatedBy: [
      {
        user_Id: String,
        updatedAt: Date,
      },
    ],
    deletedBy: {
      user_Id: String,
      deletedAt: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Campaign = mongoose.model("Campaign", campaignSchema, "campaigns");

module.exports = Campaign;
