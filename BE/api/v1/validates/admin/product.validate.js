const { body, validationResult } = require("express-validator");

// Rule validate cho login
const productValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .trim()
    .isLength({ max: 150 }).withMessage("Tiêu đề không được nhập quá 150 kí tự!"),
  body("excerpt")
    .notEmpty().withMessage("Giới thiệu ngắn không được để trống!")
    .trim()
    .isLength({ max: 200 }).withMessage("Giới thiệu ngắn không được nhập quá 200 kí tự!"),
  body("categories")
    .notEmpty().withMessage("Chọn danh mục!"),
  body("author_id")
    .notEmpty().withMessage("Chọn tác giả!"),
  body("publisher_id")
    .notEmpty().withMessage("Chọn nhà xuất bản!"),
  body("price")
    .notEmpty().withMessage("Giá không được để trống!")
    .isNumeric().withMessage("Giá chỉ được chứa số!"),
  body("discountPercentage")
    .isNumeric().withMessage("Phần trăm giảm giá chỉ được chứa số!"),
  body("stock")
    .notEmpty().withMessage("Số lượng không được để trống!")
    .isNumeric().withMessage("Số lượng chỉ được chứa số!"),
  body("pageCount")
    .notEmpty().withMessage("Tổng số trang không được để trống!")
    .isNumeric().withMessage("Tổng số trang chỉ được chứa số!"),
];

const productValid = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
}

module.exports = {
  productValidationRules,
  productValid
};