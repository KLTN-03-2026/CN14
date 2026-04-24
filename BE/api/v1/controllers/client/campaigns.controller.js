const Campaign = require("../../models/campaign.model");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");

// [GET] /api/v1/campaigns
module.exports.index = async (req, res) => {
  const campaigns = await Campaign.find({ deleted: false, status: "active" })
    .sort({ position: 1 })
    .select(
      `title thumbnail _id slug`
    )
    .lean();

  res.json({
    code: 200,
    message: "Danh sách chiến lược",
    data: campaigns,
  });
};

// [GET] /api/v1/campaigns/detail
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const campaign = await Campaign.findOne({ deleted: false, slug: slug })
    .select(
      `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt`
    )
    .lean();

  const products = await Product.find({
    deleted: false,
    status: "active",
    _id: { $in: campaign.products_id }
  }).select(`
    -updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -sizeStock -outfitSuggestions 
      -productSizeChart -additionalInformation -excerpt
    `)
    .populate("product_category_id", "_id title slug")
    .lean();

  const categories = await Category.find({
    deleted: false,
    status: "active",
    _id: { $in: campaign.categories_id }
  }).select("_id title slug thumbnail").lean();



  res.json({
    code: 200,
    message: "Chi tiết chiến lược",
    data: {
      campaign,
      products,
      categories,
    },
  });
};
