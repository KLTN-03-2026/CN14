const Voucher = require("../../models/voucher.model");

// [GET] /vouchers
module.exports.index = async (req, res) => {
  try {
    const now = new Date();

    const vouchers = await Voucher.find({
      deleted: false,
      start_date: { $lte: now },   // voucher đã bắt đầu
      end_date: { $gte: now },     // voucher chưa hết hạn
      $expr: { $gt: ["$quantity", "$used_count"] } // còn lượt sử dụng
    })
      .lean()
      .select("voucher_code discount_value min_order_value");

    res.json({
      code: 200,
      message: "Lấy danh sách voucher còn hạn sử dụng thành công",
      data: vouchers
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy danh sách voucher còn hạn sử dụng",
      error: error.message
    });
  }
};

