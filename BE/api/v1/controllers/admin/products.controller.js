const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const User = require("../../models/users.model");
const Review = require("../../models/review.model");
const searchHelper = require("../../../../helpers/search");
const Account = require("../../models/account.model");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  try {
    const { status, category, author, publisher, limit, page, sortKey, sortType } = req.query;

    // Bộ lọc mặc định
    let find = { deleted: false };
    if (status !== "default") find.status = status;
    if (category !== "default") find.categories = category;
    if (author !== "default") find.author_id = author;
    if (publisher !== "default") find.publisher_id = publisher;

    // Phân trang
    const limitItems = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    const countProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProduct / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Tìm kiếm
    const searchData = searchHelper(req.query);
    if (searchData.keyword) {
      find = { ...find, ...searchData.condition };
    }

    // Sắp xếp
    const sort = {};
    if (
      sortKey &&
      sortType &&
      sortKey !== "undefined" &&
      sortKey !== "default"
    ) {
      // Mongoose cho phép 'asc'/'desc' hoặc 1/-1
      sort[sortKey] = sortType === "desc" ? -1 : 1;
    }

    // Lấy danh sách
    const products = await Product.find(find)
      .sort(sort)
      .limit(limitItems)
      .skip(skip)
      .lean();

    for (const item of products) {
      const account = await Account.findOne({
        deleted: false,
        _id: item.createBy.user_Id,
      });

      // add thêm key fullName vào item
      if (account) {
        item.createBy.fullName = account.fullName;
      }

      // add thêm key fullName vào updatedBy
      item.updatedBy = item.updatedBy.map(async (entry) => {
        const userUpdated = await Account.findOne({ _id: entry.user_Id });
        if (userUpdated) {
          return { ...entry, fullName: userUpdated.fullName }; // Thêm key fullName
        }
        return entry;
      });

      // Đợi tất cả các promise trong .map() hoàn thành
      item.updatedBy = await Promise.all(item.updatedBy);
    }

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        products,
        totalPage,
        currentPage,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
};

// [GET] /api/v1/products/reviews/:product_id
module.exports.getReviewsOfProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const users = await User.find().select("_id fullName").lean();
    const reviews = await Review.find({ product: product_id }).lean();

    reviews.forEach(review => {
      const user = users.find((i) => i._id.toString() === review.user.toString());

      review.fullName = user.fullName || "Đã xóa";
    });

    res.json({
      code: 200,
      message: "Danh sách reviews",
      data: reviews,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error,
    });
  }
}
// [POST] /api/v1/products/create-item
module.exports.createItem = async (req, res) => {
  try {
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);

    if (!req.body.position) {
      const countItem = await Product.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const validCategories = await Category.find({
      _id: { $in: req.body.categories },
    }).select("_id");

    req.body.categories = validCategories.map((c) => c._id);

    req.body.createBy = {
      user_Id: req.userAuth.id,
    };

    const product = new Product(req.body);
    await product.save();
    res.json({
      code: 200,
      message: "Tạo mới thành công",
      data: product,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo mới sản phẩm không thành công! - " + error,
    });
  }
};

// [GET] /api/v1/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message,
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
};

// [PATCH] /api/v1/products/edit-item/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    ["position", "price", "discountPercentage"].forEach((k) => {
      if (req.body[k]) req.body[k] = parseFloat(req.body[k]);
    });

    if (Array.isArray(req.body.sizeStock)) {
      const totalStock = req.body.sizeStock.reduce((sum, item) => {
        const parts = item.split("-");
        const quantity = parseInt(parts[1], 10);
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);

      req.body.stock = totalStock;
    }

    const { ...dataEdit } = req.body;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date(),
    };

    const updateQuery = {
      $set: dataEdit, // mọi field khác
      $push: { updatedBy }, // log lịch sử
    };

    await Product.updateOne(
      {
        _id: id,
      },
      updateQuery
    );

    res.json({
      code: 200,
      message: "Chỉnh sửa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

// [DELETE] /api/v1/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id }).select("_id");

    if (!product) {
      res.json({
        code: 400,
        message: "Không tồn tại sản phẩm!"
      });
      return;
    }

    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date(),
    };

    await Product.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy,
      }
    );

    res.json({
      code: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      deleted: false,
      _id: id,
    });

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      product: product,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params",
    });
  }
};

// [POST] /reviews/:reviewId/replies
module.exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, role } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            user: null,
            content,
            role: role || "admin",
          },
        },
      },
      { new: true }
    );

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

// [GET] /api/v1/products/change-deleted/:status/:id
module.exports.changeDeleted = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    let result;
    if (status === "true") {
      result = true
    } else if (status === "false") {
      result = false
    }

    await Review.updateOne(
      {
        _id: id,
      },
      {
        deleted: result,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhập thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message,
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
};

// [DELETE] /api/v1/products/reviews/delete-permanent/:id
module.exports.permanentReview = async (req, res) => {
  try {
    const id = req.params.id;
    const reviews = await Review.findByIdAndDelete(id);

    if (!reviews) {
      res.json({
        code: 404,
        message: "Không tìm thấy đánh giá!"
      });
      return;
    }

    res.json({
      code: 200,
      message: "Xóa vĩnh viễn thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message,
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
};
