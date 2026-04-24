const Article = require("../../models/articles.model");

module.exports.index = async (req, res) => {
  try {
    const articleFeatured = await Article.find({
      deleted: false,
      featured: "1",
      status: "active",
    })
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -description`
      )
      .lean();
    const articles = await Article.find({ deleted: false, status: "active" })
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -description`
      )
      .lean();

    res.json({
      code: 200,
      message: "Danh sách bài viết",
      articleFeatured: articleFeatured,
      data: articles,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await Article.findOne({ deleted: false, slug: slug })
      .select(
        `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt`
      )
      .populate("categories", "title slug")
      .lean();
      
    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      data: article,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};
