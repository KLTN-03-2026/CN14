const { body, validationResult } = require("express-validator");

const voucherGiftValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .isLength({ max: 80 }).withMessage("Tiêu đề không được nhập quá 80 kí tự!"),
  body("excerpt")
    .isLength({ max: 256 }).withMessage("Trích đoạn không được nhập quá 256 ký tự!")
    .trim()
    .notEmpty().withMessage("Trích đoạn không được để trống!"),
  body("minOrderValue")
    .notEmpty().withMessage("Giá trị đơn hàng tối thiểu nhận không được để trống!"),
  body("maxOrderValue")
    .notEmpty().withMessage("Số tiền tối đa được giảm không được để thống!"),
  body("pointCost")
    .notEmpty().withMessage("Số điểm đổi quà không được để trống!"),
  body("discount")
    .notEmpty().withMessage("Giá trị giảm giá không được để trống!"),
  body("expiredAfterDays")
    .notEmpty().withMessage("Hạn ngày có hiệu lực không được để trống!")
];

const voucherGiftValid = async (req, res, next) => {
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
  voucherGiftValidationRules,
  voucherGiftValid
};