const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
const { infoCheckoutValidationRules, infoCheckoutValid } = require("../../validates/client/info-checkout");
const { createRateLimiter } = require("../../middlewares/apiLimiter.middleware");
const middlware = require("../../middlewares/client/auth.middleware");
router.get("/order/detail/:code", controller.detailOrder);

router.post("/order-user",
  infoCheckoutValidationRules, createRateLimiter(3, 5), infoCheckoutValid,
  middlware.requireAuthOptional, controller.orderPostGuest);

router.post("/check-voucher", controller.checkVoucher);

router.post("/check-voucher-gift",
  middlware.requireAuthOptional, controller.checkVoucherGift);

router.patch("/success/:orderId", controller.success);

router.post("/send-otp", createRateLimiter(3, 10),
  controller.sendEmailOtpOrder);

router.post("/verify-otp", createRateLimiter(5, 10),
  controller.verifyEmailOtpOrder);

module.exports = router;