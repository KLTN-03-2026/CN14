const { body, validationResult } = require("express-validator");

// Rule validate cho login
const contactValidationRules = [
  body("email")
    .notEmpty().withMessage("Email không được để trống.")
    .trim()
    .isEmail().withMessage("Email không hợp lệ."),
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống.")
    .trim()
    .isLength({ max: 50 }).withMessage("Tên không được quá 50 ký tự!")
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tên không được chứa ký tự đặc biệt!"),
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống.")
    .trim()
    .isLength({ max: 100 }).withMessage("Tiêu đề không được quá 100 ký tự!"),
    body("description")
    .notEmpty().withMessage("Nội dung không được để trống.")
    .trim(),
    body("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống!")
    .isLength({ min: 10, max: 10 }).withMessage("Số điện thoại phải 10 số!")
    .matches(/^[0-9]+$/).withMessage("Số điện thoại chỉ chứa số"),

];

const contactValid = async (req, res, next) => {
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
  contactValidationRules,
  contactValid
}
