const Category = require("../../models/category.model");

// [GET] /products-category
module.exports.index = async (req, res) => {
  const productsCategory = await Category.aggregate([
    {
      $match: {
        status: "active",
        deleted: false
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "product_category_id",
        as: "products",
      },
    },
    {
      $addFields: {
        totalProducts: { $size: "$products" },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        totalProducts: 1,
        thumbnail: 1,
        slug: 1,
      },
    },
  ]);


  res.json({
    code: 200,
    message: "Danh sách danh mục",
    data: productsCategory,
  });
};
