const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    publishDate: Date,
    excerpt: String,
    additionalInformation: String,
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
    product_category_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" },
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
const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;

const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    excerpt: String,
    additionalInformation: String,
    productSizeChart: String,
    outfitSuggestions: String,
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
    sex: {
      type: Number,
      default: 0,
      // 0 = Nam
      // 1 = Nu
      // 2 = Unisex
    },
    thumbnail: String,
    images: [String], // Mảng chứa nhiều ảnh
    status: String,
    position: Number,
    sizeStock: {
      type: [String], // Mảng chứa các chuỗi định dạng "size-quantity"
      default: [],
    },
    product_category_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
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
