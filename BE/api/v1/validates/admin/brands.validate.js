const { body, validationResult } = require("express-validator");

// Rule validate cho login
const brandValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .trim()
    .isLength({ max: 80 }).withMessage("Tiêu đề không được nhập quá 80 kí tự!"),
  body("excerpt")
    .notEmpty().withMessage("Giới thiệu ngắn không được để trống!")
    .trim()
    .isLength({ max: 200 }).withMessage("Giới thiệu ngắn không được nhập quá 200 kí tự!")
];

const brandValid = async (req, res, next) => {
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
  brandValidationRules,
  brandValid
};