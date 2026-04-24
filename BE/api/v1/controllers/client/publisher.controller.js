const Publisher = require("../../models/publisher.model");

// [GET] /publishers
module.exports.index = async (req, res) => {
  try {
    const publishers = await Publisher.find({
      deleted: false
    }).lean()
    .select("name _id thumbnail slug");

    res.json({
      code: 200,
      message: "Lấy danh sách thành công",
      data: publishers
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }

} 