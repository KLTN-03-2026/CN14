const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const {
  registerValidationRules,
  registerValid,
} = require("../../validates/client/register.validate");

const {
  loginValidationRules,
  loginUserValid,
} = require("../../validates/client/login.validate");

const { createRateLimiter } = require("../../middlewares/apiLimiter.middleware");
const validForgot = require("../../validates/client/forgot-password");

const {
  changePasswordRules,
  userValidationRules,
  setPasswordRules,
  userValid,
} = require("../../validates/client/user");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post(
  "/register",
  createRateLimiter(3, 5),
  registerValidationRules,
  registerValid,
  controller.registerPost
);

router.post(
  "/login",
  createRateLimiter(5, 5),
  loginValidationRules,
  loginUserValid,
  controller.loginPost
);

router.post(
  "/password/forgot",
  createRateLimiter(3, 15),
  validForgot.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.post(
  "/password/otp/:email",
  createRateLimiter(3, 15),
  validForgot.optPasswordPost,
  controller.optPasswordPost
);

router.post(
  "/password/reset-password",
  authMiddleware.requireAuth,
  validForgot.resetPasswordPost,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.info);

router.get("/voucher-gifts/templates",
  authMiddleware.requireAuth, controller.voucherGiftsTempGet);

router.get("/voucher-gifts/my-voucher-gifts",
  authMiddleware.requireAuth, controller.myVoucherGifts);

router.patch("/voucher-gifts/exchange-voucher-gift",
  authMiddleware.requireAuth, controller.exchangeVoucherGift);


router.patch(
  "/info/edit",
  userValidationRules,
  userValid,
  authMiddleware.requireAuth,
  controller.editInfo
);

router.patch(
  "/info/reset-password",
  changePasswordRules,
  userValid,
  authMiddleware.requireAuth,
  controller.resetPasswordPatch
);

router.get(
  "/history-order",
  authMiddleware.requireAuth,
  controller.ordersHistoryByUserId
);

router.post("/send-otp", controller.sendEmailOtpRegister);

router.post("/verify-otp", controller.verifyEmailOtpRegister);

router.post(
  "/info/send-otp",
  authMiddleware.requireAuth,
  controller.sendEmailOtpAccount
);

router.post(
  "/info/verify-otp",
  authMiddleware.requireAuth,
  controller.verifyEmailOtpAccount
);

module.exports = router;
