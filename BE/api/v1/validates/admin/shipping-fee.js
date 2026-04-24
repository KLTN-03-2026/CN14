const { body, validationResult } = require("express-validator");

// Rule validate
const shippingFeeValidationRules = [
  body("defaultFee")
    .notEmpty().withMessage("Phí vận chuyển không được để trống")
    .matches(/^[0-9]+$/).withMessage("Phí vận chuyển chỉ chứa số"),
  body("freeThreshold")
    .notEmpty().withMessage("Ngưỡng miễn phí không được để trống")
    .matches(/^[0-9]+$/).withMessage("Ngưỡng miễn phí chỉ chứa số")
];

const shippingFeeValid = async (req, res, next) => {
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
  shippingFeeValidationRules,
  shippingFeeValid
};