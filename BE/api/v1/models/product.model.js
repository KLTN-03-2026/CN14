const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    publishDate: Date,
    excerpt: String,
    pageCount: Number,
    price: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    thumbnail: String,
    images: [String], // Mảng chứa nhiều ảnh
    status: String,
    position: Number,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    publisher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    },
    featured: String,
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
  }
);
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
