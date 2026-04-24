const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const { loginValidationRules, loginValid } = require("../../validates/admin/auth.validate");
const { createRateLimiter } = require("../../middlewares/apiLimiter.middleware");

router.post("/login", createRateLimiter(5, 5),
  loginValidationRules, loginValid, controller.loginPost);

module.exports = router; 