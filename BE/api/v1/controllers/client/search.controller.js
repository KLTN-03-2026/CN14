const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Transactions = require("../../models/transactions.model");
const searchHelper = require("../../../../helpers/search");

module.exports.index = async (req, res) => {
  try {
    const searchData = searchHelper(req.query);

    if (!searchData.keyword) {
      return res.json({
        code: 400,
        message: "Từ khóa không hợp lệ",
      });
    }
    const find = {
      deleted: false,
      status: "active",
      ...searchData.condition,
    };
    const records = await Product.find(find)
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -sizeStock -outfitSuggestions -productSizeChart -additionalInformation -excerpt`
      )
      .populate("brand_id", "_id title slug")
      .populate("product_category_id", "_id title slug")
      .lean();

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      keyword: searchData.keyword,
      data: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi ${error.message}`,
    });
  }
};

module.exports.searchOrder = async (req, res) => {
  try {
    const { code, email } = req.params;
    console.log(code, email);

    const order = await Order.findOne({
      code: code,
      'userInfo.email': email
    })
      .lean();

    if (!order) {
      res.json({
        code: 204,
        message: "Không tìm thấy đơn hàng!"
      });
      return;
    }

    if (order.products.length > 0) {
      for (const item of order.products) {
        const productId = item.product_id;
        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" })
          .select("title");
        item.title = productInfo.title || "Đã xóa"
      }
    }

    const trans = await Transactions.find({ code_TxnRef: code }).sort({ createdAt: -1 });;
    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      data: {
        order,
        trans
      }
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi ${error.message}`,
    });
  }
};

