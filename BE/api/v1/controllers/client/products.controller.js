const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const Review = require("../../models/review.model");
const User = require("../../models/users.model");
const mongoose = require("mongoose");
const productsHelper = require("../../../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active",
  })
    .lean()
    .select(
      `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -sizeStock -outfitSuggestions -productSizeChart -additionalInformation -excerpt`
    );

  res.json({
    code: 200,
    message: "Lấy danh sách sản phẩm thành công",
    data: products,
  });
};

// [GET] /products/:slugCategory
// Lọc sản phẩm theo danh mục + điều kiện
module.exports.filterProducts = async (req, res) => {
  try {
    const { slugCategory } = req.params;
    const { sortKey, sortType, priceRange, author_id, publisher_id } = req.query;
    console.log("author", author_id);
    console.log("publisher", publisher_id);

    // Tìm category gốc
    const category = await Category.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active",
    });

    if (!category) {
      return res.status(404).json({
        code: 404,
        message: "Thể loại không tồn tại hoặc đã bị xóa!",
      });
    }

    // Tạo điều kiện lọc
    const find = {
      deleted: false,
      status: "active",
      categories: category._id,
    };

    if (author_id && mongoose.Types.ObjectId.isValid(author_id)) {
      find.author_id = author_id;
    }

    if (publisher_id && mongoose.Types.ObjectId.isValid(publisher_id)) {
      find.publisher_id = publisher_id;
    }
    // Lọc theo khoảng giá
    if (priceRange && priceRange.includes("-")) {
      const [min, max] = priceRange.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max) && min >= 0 && max > min) {
        find.price = { $gte: min, $lte: max };
      }
    }

    // Sắp xếp
    const sort = {};
    /**
     * Các trường hợp sắp xếp:
     * - latest (mới nhất) => createdAt giảm dần
     * - bestseller (bán chạy nhất) => sold giảm dần
     * - price => tăng/giảm theo sortType
     */
    if (sortKey === "latest") {
      sort["createdAt"] = -1; // mới nhất
    } else if (sortKey === "bestseller") {
      sort["sold"] = -1; // bán chạy nhất
    } else if (sortKey === "price" && sortType) {
      sort["price"] = sortType === "desc" ? -1 : 1;
    } else if (sortKey === "all") {
    } else {
      sort["createdAt"] = -1; // mặc định
    }

    const totalProducts = await Product.countDocuments(find);
    const productsRaw = await Product.find(find)
      .sort(sort)
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -stock -excerpt`
      )
      .populate("categories", "title")
      .populate("author_id", "fullName")
      .populate("publisher_id", "name")
      .lean();

    // Tính giá sau giảm (nếu có)
    const products = productsHelper.priceNewProducts(productsRaw);
    console.log(find);

    // Trả về response
    res.status(200).json({
      code: 200,
      message: "Lọc sản phẩm thành công",
      pagination: {
        total: totalProducts,
      },
      filters: {
        sortKey,
        sortType,
        priceRange
      },
      category,
      products,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lọc sản phẩm:", error);
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi lọc sản phẩm",
      error: error.message,
    });
  }
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const record = await Product.findOne({
      slug: slug,
    }).lean().select(`-updatedBy -createdAt -updatedAt -createBy 
      -deletedAt`);

    if (record.categories && record.categories.length > 0) {
      const categories = await Category.find({
        _id: { $in: record.categories },
      }).select("title slug").lean();

      record.categoriesDetail = categories;
    }

    const newRecord = productsHelper.priceNewProduct(record);

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      data: newRecord,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /products/reviews/:productId
module.exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: new mongoose.Types.ObjectId(String(productId)),
      deleted: false,
    })
      .populate("user", "fullName") // lấy thông tin người đánh giá
      .populate("replies.user", "fullName") // lấy thông tin người trả lời
      .sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: "Lấy danh sách đánh giá thành công",
      data: reviews,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

// [POST] /products/reviews/:productId
module.exports.postReview = async (req, res) => {
  console.log(req.user);

  try {
    const { productId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id; // ✅ lấy từ token sau khi login

    const user = await User.findOne({ _id: userId });

    const product = await Product.findOne({ _id: productId })
      .select("rating reviews");

    if (!product) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user!",
      });
      return;
    }

    // tạo review
    const review = await Review.create({
      product: new mongoose.Types.ObjectId(String(productId)),
      user: new mongoose.Types.ObjectId(String(userId)),
      rating,
      content,
    });

    product.rating = (((product.rating * product.reviews) + rating) / (product.reviews + 1)).toFixed(1);
    product.reviews = product.reviews + 1;
    await product.save();

    res.status(201).json({
      code: 201,
      message: "Đánh giá sản phẩm thành công",
      data: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// [POST] /reviews/:reviewId/replies
module.exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, role } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user",
      });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            user: userId ? new mongoose.Types.ObjectId(String(userId)) : null,
            content,
            role: role || "customer",
          },
        },
      },
      { new: true }
    )
      .populate("user", "fullName email")
      .populate("replies.user", "fullName email");

    if (!review) {
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy review" });
    }

    res.json({
      code: 200,
      message: "Thêm phản hồi thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" + error.message });
  }
};

// [DELETE] /products/reviews/delete/:reviewId
module.exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    await Review.findByIdAndUpdate(reviewId, { deleted: true });

    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user",
      });
      return;
    }

    res.json({
      code: 200,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!",
    });
  }
};

// [DELETE] /products/reviews/delete/:reviewId
module.exports.deleteReply = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user",
      });
    }

    const review = await Review.findByIdAndUpdate(reviewId, {
      $pull: { replies: { _id: replyId } },
    });

    if (!review) {
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy review" });
    }

    res.json({
      code: 200,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!",
    });
  }
};

// [GET] /products
module.exports.favoriteProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("favorites");
    // Lấy mảng product_id
    const favoriteIds = user.favorites.map((fav) => fav.product_id);

    // Query sản phẩm theo danh sách id
    const products = await Product.find({
      deleted: false,
      _id: { $in: favoriteIds },
    })
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -excerpt`
      )
      .populate("categories", "title")
      .lean();

    res.json({
      code: 200,
      message: "Danh sách sản phẩm yêu thích",
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      code: 400,
      message: error.message,
    });
  }
};

// [PATCh] /products/
module.exports.favorite = async (req, res) => {
  try {
    const userId = req.user.id; // user đã login
    const productId = req.params.productId;
    const typeFavorite = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite": {
        // kiểm tra đã tồn tại chưa
        const user = await User.findOne({ _id: userId });

        const existFavorite = user.favorites.find(
          (item) => item.product_id === productId
        );

        if (!existFavorite) {
          await User.updateOne(
            { _id: userId },
            { $addToSet: { favorites: { product_id: productId } } } // $addToSet tránh trùng
          );
          return res.json({
            code: 200,
            message: "Yêu thích thành công",
          });
        }
      }

      case "unfavorite": {
        await User.updateOne(
          { _id: userId },
          { $pull: { favorites: { product_id: productId } } } // $pull xóa khỏi array
        );
        return res.json({
          code: 201,
          message: "Hủy yêu thích thành công",
        });
      }

      default:
        return res.json({
          code: 400,
          message: "Loại thao tác không hợp lệ",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

// [PATCH] /products/viewed-products
module.exports.viewedProducts = async (req, res) => {
  try {
    const ids = req.body.ids;

    // Query sản phẩm theo danh sách id
    const products = await Product.find({
      deleted: false,
      _id: { $in: ids },
    })
      .select("title slug sold thumbnail")
      .lean();

    res.json({
      code: 200,
      message: "Danh sách sản phẩm đã xem",
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      code: 400,
      message: error.message,
    });
  }
};
