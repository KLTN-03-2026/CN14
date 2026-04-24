const Author = require("../../models/author.model");

// [GET] /authors
module.exports.index = async (req, res) => {
  try {
    const authors = await Author.find({
      deleted: false
    }).lean()
    .select("fullName _id avatar slug");

    res.json({
      code: 200,
      message: "Lấy danh sách thành công",
      data: authors
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }

} 