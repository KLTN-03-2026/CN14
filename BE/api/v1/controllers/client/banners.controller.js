const Banner = require("../../models/banner.model");
const Voucher = require("../../models/voucher.model");
// const { param } = require("../../routes/admin/banner.route");

// [GET] /api/v1/banners
module.exports.index = async (req, res) => {
  const banners = await Banner.find({ deleted: false, status: "active" })
    .sort({ position: 1 })
    .select(
      `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt -content -end_date -start_date -position`
    )
    .lean();

  res.json({
    code: 200,
    message: "Danh sách quảng cáo",
    data: banners,
  });
};

// [GET] /api/v1/banners/detail
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const banner = await Banner.findOne({ deleted: false, slug: slug })
    .select(
      `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt`
    )
    .lean();

  res.json({
    code: 200,
    message: "Chi tiết quảng cáo",
    data: banner,
  });
};

// [GET] /api/v1/banners/detail
module.exports.vouchers = async (req, res) => {
  const banner_id = req.params.banner_id;

  const vouchers = await Voucher.find({
    deleted: false,
    banner_id: banner_id,
    status: "active",
  })
    .select(
      `-updatedBy -createdAt -updatedAt -createBy -deleted 
      -deletedAt`
    )
    .lean();

  res.json({
    code: 200,
    message: "Danh sách voucher theo quảng cáo",
    data: vouchers,
  });
};
