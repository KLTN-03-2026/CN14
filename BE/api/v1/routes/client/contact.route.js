const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/contact.controller");
const { createRateLimiter } = require("../../middlewares/apiLimiter.middleware");
const {
  contactValid, contactValidationRules
} = require("../../validates/client/contact");


router.post("/send",
  createRateLimiter(3, 10), contactValidationRules, 
  contactValid,
  controller.sendContact);

module.exports = router;